import { useEffect, useMemo, useState } from 'react'
import { request } from '../../api'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'

function formatDate(d) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleString()
  } catch {
    return String(d)
  }
}

function EmptyState({ title, subtitle }) {
  return (
    <Card className="p-6">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {subtitle ? <div className="mt-1 text-sm text-slate-600">{subtitle}</div> : null}
    </Card>
  )
}

export function AdminRefundsPage() {
  const [refunds, setRefunds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')

  const filteredRefunds = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return refunds
    return refunds.filter((r) => {
      const blob = `${r?.orderDate || ''} ${r?.dealPropertyAddress || ''} ${r?.purchaseEmail || ''} ${
        r?.cardLast4 || ''
      } ${r?.reasonForRefund || ''} ${r?.reasonForRefunds || ''} ${r?.reasonForRefundsText || ''} ${
        r?.reasonForRefundText || ''
      }`.toLowerCase()
      // support legacy field name reasonForRefund (your model uses reasonForRefund)
      const reason = (r?.reasonForRefund ?? r?.reasonForRefunds ?? r?.reasonForRefundText ?? '').toString()
      return `${blob} ${reason}`.includes(q)
    })
  }, [filter, refunds])

  async function loadRefunds() {
    setLoading(true)
    setError(null)
    try {
      const res = await request('GET', '/api/admin/refunds')
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : []
      setRefunds(list)
    } catch (e) {
      setError(e?.message || 'Failed to load refunds')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRefunds()
  }, [])

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-black tracking-tight text-slate-900">Refunds</h2>
            <p className="mt-1 text-sm text-slate-600">
              All refund requests submitted from the Deal Refund Request (DRR) page.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
            <div className="w-full sm:w-80">
              <Input
                label="Filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search by email, address, reason…"
              />
            </div>
            <Button variant="secondary" onClick={loadRefunds} disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Refreshing…' : 'Refresh'}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 ring-1 ring-slate-200">
            Showing <span className="font-semibold text-slate-900">{filteredRefunds.length}</span> refund request
            {filteredRefunds.length === 1 ? '' : 's'}
          </span>
          {filter.trim() ? (
            <button
              type="button"
              className="rounded-full bg-white px-2.5 py-1 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              onClick={() => setFilter('')}
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
      ) : filteredRefunds.length === 0 ? (
        <EmptyState title="No refund requests yet" subtitle="Submit one from the public refund form." />
      ) : (
        <div className="grid gap-4">
          {filteredRefunds.map((r) => {
            const id = r?.id || r?._id
            const reason = r?.reasonForRefund || r?.reasonForRefundText || r?.reason || '—'
            return (
              <Card key={id} className="overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-black text-slate-900">Refund request</div>
                      <div className="mt-1 text-xs text-slate-600">
                        Submitted <span className="font-medium text-slate-800">{formatDate(r?.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        Order date: <span className="font-black text-slate-900">{r?.orderDate || '—'}</span>
                      </span>
                      {r?.cardLast4 ? (
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                          Card last 4: <span className="font-black text-slate-900">{r.cardLast4}</span>
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                  <div className="min-w-0 space-y-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Purchase</div>
                      <div className="mt-2 text-sm text-slate-700">
                        <div className="break-all">
                          <span className="font-medium text-slate-900">Email:</span> {r?.purchaseEmail || '—'}
                        </div>
                        <div className="mt-1 break-words">
                          <span className="font-medium text-slate-900">Property address:</span>{' '}
                          {r?.dealPropertyAddress || '—'}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reason</div>
                      <div className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-700">{reason}</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Details</div>
                    <dl className="mt-2 grid gap-2 text-xs text-slate-700">
                      <div className="flex items-start justify-between gap-3">
                        <dt className="text-slate-500">Request ID</dt>
                        <dd className="break-all text-right font-medium text-slate-800">{id || '—'}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <dt className="text-slate-500">Order date</dt>
                        <dd className="text-right font-medium text-slate-800">{r?.orderDate || '—'}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <dt className="text-slate-500">Card last 4</dt>
                        <dd className="text-right font-medium text-slate-800">{r?.cardLast4 || '—'}</dd>
                      </div>
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

