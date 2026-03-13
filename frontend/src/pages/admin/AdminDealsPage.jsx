import { useEffect, useMemo, useState } from 'react'
import * as api from '../../api'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'

function formatMoney(n) {
  if (n == null || Number.isNaN(Number(n))) return '—'
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(Number(n))
  } catch {
    return `£${Number(n).toLocaleString()}`
  }
}

function formatDate(d) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleString()
  } catch {
    return String(d)
  }
}

function StatusBadge({ value }) {
  const raw = value || '—'
  const normalized = raw === 'rejected_refunded' ? 'refunded' : raw

  const label =
    normalized === 'pending_payment'
      ? 'Pending payment'
      : normalized === 'under_offer'
        ? 'Under offer'
        : normalized === 'sold'
          ? 'Sold'
          : normalized === 'refunded'
            ? 'Refunded'
            : normalized && normalized !== '—'
              ? String(normalized)
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (m) => m.toUpperCase())
              : '—'

  const cls =
    normalized === 'pending_payment'
      ? 'bg-amber-50 text-amber-800 ring-amber-200'
      : normalized === 'under_offer'
        ? 'bg-sky-50 text-sky-800 ring-sky-200'
        : normalized === 'sold'
          ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
          : normalized === 'refunded'
            ? 'bg-violet-50 text-violet-800 ring-violet-200'
            : normalized?.startsWith('rejected')
              ? 'bg-slate-100 text-slate-800 ring-slate-200'
              : 'bg-slate-100 text-slate-800 ring-slate-200'

  const dot =
    normalized === 'pending_payment'
      ? 'bg-amber-500'
      : normalized === 'under_offer'
        ? 'bg-sky-500'
        : normalized === 'sold'
          ? 'bg-emerald-500'
          : normalized === 'refunded'
            ? 'bg-violet-500'
            : 'bg-slate-400'

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}

function EmptyState({ title, subtitle }) {
  return (
    <Card className="p-6">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {subtitle ? <div className="mt-1 text-sm text-slate-600">{subtitle}</div> : null}
    </Card>
  )
}

export function AdminDealsPage() {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dealFilter, setDealFilter] = useState('')

  const filteredDeals = useMemo(() => {
    const q = dealFilter.trim().toLowerCase()
    if (!q) return deals
    return deals.filter((d) => {
      const p = d?.property
      const blob = `${d?.investorName || ''} ${d?.investorEmail || ''} ${p?.title || ''} ${p?.location || ''} ${
        d?.status || ''
      }`.toLowerCase()
      return blob.includes(q)
    })
  }, [deals, dealFilter])

  async function loadDeals() {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getAdminDeals()
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : []
      setDeals(list)
    } catch (e) {
      setError(e?.message || 'Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDeals()
  }, [])

  async function dealAction(dealId, action) {
    await api.updateDeal(dealId, { action })
    await loadDeals()
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-black tracking-tight text-slate-900">Deals</h2>
            <p className="mt-1 text-sm text-slate-600">
              Record payment to move to Under Offer, then mark sold or refunded as needed.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
            <div className="w-full sm:w-80">
              <Input
                label="Filter"
                value={dealFilter}
                onChange={(e) => setDealFilter(e.target.value)}
                placeholder="Search by investor, property, status…"
              />
            </div>
            <Button variant="secondary" onClick={loadDeals} disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Refreshing…' : 'Refresh'}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 ring-1 ring-slate-200">
            Showing <span className="font-semibold text-slate-900">{filteredDeals.length}</span> deal
            {filteredDeals.length === 1 ? '' : 's'}
          </span>
          {dealFilter.trim() ? (
            <button
              type="button"
              className="rounded-full bg-white px-2.5 py-1 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              onClick={() => setDealFilter('')}
            >
              Clear search
            </button>
          ) : null}
        </div>
      </Card>

      {loading ? (
        <Card className="h-56 animate-pulse bg-slate-100" />
      ) : error ? (
        <Card className="p-5">
          <div className="text-sm font-semibold text-rose-700">{error}</div>
        </Card>
      ) : filteredDeals.length === 0 ? (
        <EmptyState title="No deals found" subtitle="Deals are created from the property details page." />
      ) : (
        <div className="grid gap-4">
          {filteredDeals.map((d) => {
            const id = d?.id || d?._id
            const p = d?.property
            const canRecordPayment = d?.status === 'pending_payment'
            const canMarkSold = d?.status === 'under_offer'
            const canMarkRefunded = !!d?.refundEligible
            return (
              <Card key={id} className="overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-black text-slate-900">Deal {id}</div>
                        <StatusBadge value={d?.status} />
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        Created <span className="font-medium text-slate-800">{formatDate(d?.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="secondary"
                        className="w-full sm:w-auto"
                        onClick={() => dealAction(id, 'record_payment')}
                        disabled={!canRecordPayment}
                        title={!canRecordPayment ? 'Available when status is Pending payment' : undefined}
                      >
                        Record payment
                      </Button>
                      <Button
                        variant="secondary"
                        className="w-full sm:w-auto"
                        onClick={() => dealAction(id, 'mark_sold')}
                        disabled={!canMarkSold}
                        title={!canMarkSold ? 'Available when status is Under offer' : undefined}
                      >
                        Mark sold
                      </Button>
                      <Button
                        variant="secondary"
                        className="w-full sm:w-auto"
                        onClick={() => dealAction(id, 'mark_refunded')}
                        disabled={!canMarkRefunded}
                        title={!canMarkRefunded ? 'Only available if refund eligible' : undefined}
                      >
                        Mark refunded
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
                  <div className="min-w-0">
                    <div className="text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">{d?.investorName || 'Investor'}</span>
                      {d?.investorEmail ? (
                        <>
                          <span className="text-slate-400"> · </span>
                          <span className="break-all text-slate-600">{d?.investorEmail}</span>
                        </>
                      ) : null}
                    </div>

                    <div className="mt-2 rounded-xl border border-slate-200 bg-white p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Property</div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">{p?.title || '—'}</div>
                      {p?.location ? <div className="mt-0.5 text-sm text-slate-600">{p.location}</div> : null}
                      {p ? (
                        <div className="mt-1 text-xs text-slate-500">
                          Property ID: <span className="break-all">{p.id || p._id || '—'}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Timeline</div>
                    <dl className="mt-2 grid gap-2 text-xs text-slate-700">
                      <div className="flex items-start justify-between gap-3">
                        <dt className="text-slate-500">Payment</dt>
                        <dd className="text-right font-medium text-slate-800">{formatDate(d?.paymentAt)}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <dt className="text-slate-500">Reject by</dt>
                        <dd className="text-right font-medium text-slate-800">{formatDate(d?.rejectBy)}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <dt className="text-slate-500">Refund eligible</dt>
                        <dd className="text-right font-semibold">{d?.refundEligible ? 'Yes' : 'No'}</dd>
                      </div>
                      {d?.amount != null ? (
                        <div className="flex items-start justify-between gap-3">
                          <dt className="text-slate-500">Amount</dt>
                          <dd className="text-right font-semibold">{formatMoney(d.amount)}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

