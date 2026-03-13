import { useEffect, useMemo, useState } from 'react'
import * as api from '../../api'
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

export function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [creatingDealId, setCreatingDealId] = useState(null)
  const [dealError, setDealError] = useState(null)
  const [filter, setFilter] = useState('')

  const filteredInquiries = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return inquiries
    return inquiries.filter((i) => {
      const p = i?.property
      const blob = `${i?.name || ''} ${i?.email || ''} ${i?.phone || ''} ${i?.budget || ''} ${i?.status || ''} ${
        p?.title || ''
      } ${p?.location || ''} ${p?.id || p?._id || ''}`.toLowerCase()
      return blob.includes(q)
    })
  }, [filter, inquiries])

  async function loadInquiries() {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getAdminInquiries()
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : []
      setInquiries(list)
    } catch (e) {
      setError(e?.message || 'Failed to load inquiries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInquiries()
  }, [])

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-black tracking-tight text-slate-900">Inquiries</h2>
            <p className="mt-1 text-sm text-slate-600">
              All inquiries submitted from the property “I am interested” forms.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
            <div className="w-full sm:w-80">
              <Input
                label="Filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search by investor, property, status…"
              />
            </div>
            <Button variant="secondary" onClick={loadInquiries} disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Refreshing…' : 'Refresh'}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 ring-1 ring-slate-200">
            Showing <span className="font-semibold text-slate-900">{filteredInquiries.length}</span> inquiry
            {filteredInquiries.length === 1 ? '' : 'ies'}
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
      ) : filteredInquiries.length === 0 ? (
        <EmptyState title="No inquiries yet" subtitle="Submit one from a property details page." />
      ) : (
        <div className="grid gap-4">
          {filteredInquiries.map((q) => {
            const id = q?.id || q?._id
            const status = q?.status || 'submitted'
            const statusLabel =
              status === 'draft' ? 'Draft' : status === 'submitted' ? 'Submitted' : String(status).replace(/_/g, ' ')
            const statusCls =
              status === 'draft'
                ? 'bg-amber-50 text-amber-800 ring-amber-200'
                : 'bg-emerald-50 text-emerald-800 ring-emerald-200'
            const p = q?.property
            const canCreateDeal = !q?.hasDeal && status !== 'draft'

            return (
              <Card key={id} className="overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-black text-slate-900">{q?.name || 'Investor'}</div>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusCls}`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        Created <span className="font-medium text-slate-800">{formatDate(q?.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {q?.hasDeal ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                          Deal created
                        </span>
                      ) : (
                        <Button
                          variant="secondary"
                          className="w-full sm:w-auto"
                          disabled={!canCreateDeal || creatingDealId === id}
                          title={!canCreateDeal ? 'Create deal is available for submitted inquiries' : undefined}
                          onClick={async () => {
                            if (!id) return
                            setDealError(null)
                            setCreatingDealId(id)
                            try {
                              await api.createAdminDealFromInquiry(id)
                              await loadInquiries()
                            } catch (e) {
                              setDealError(e?.message || 'Failed to create deal')
                            } finally {
                              setCreatingDealId(null)
                            }
                          }}
                        >
                          {creatingDealId === id ? 'Creating…' : 'Create deal'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
                  <div className="min-w-0 space-y-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contact</div>
                      <div className="mt-1 text-sm text-slate-700">
                        <div className="break-all">
                          <span className="font-medium text-slate-900">Email:</span> {q?.email || '—'}
                        </div>
                        <div className="mt-1 break-all">
                          <span className="font-medium text-slate-900">Phone:</span> {q?.phone || '—'}
                        </div>
                        <div className="mt-1 break-all">
                          <span className="font-medium text-slate-900">Budget:</span> {q?.budget ? `£${q.budget}` : '—'}
                        </div>
                      </div>
                    </div>

                    {q?.message ? (
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Message</div>
                        <div className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-700">{q.message}</div>
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Property</div>
                    {p ? (
                      <>
                        <div className="mt-1 text-sm font-semibold text-slate-900">{p.title || '—'}</div>
                        {p.location ? <div className="mt-0.5 text-sm text-slate-600">{p.location}</div> : null}
                        <div className="mt-2 text-xs text-slate-500">
                          ID: <span className="break-all">{p.id || p._id || '—'}</span>
                        </div>
                      </>
                    ) : (
                      <div className="mt-1 text-sm text-slate-700">—</div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}

          {dealError ? (
            <Card className="p-4">
              <div className="rounded-lg bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">{dealError}</div>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  )
}

