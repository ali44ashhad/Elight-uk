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

export function AdminGeneralQueriesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return items
    return items.filter((x) => {
      const blob = `${x?.propertyType || ''} ${(x?.propertyStyles || []).join(' ')} ${x?.region || ''} ${
        x?.district || ''
      } ${x?.ward || ''} ${x?.fullName || ''} ${x?.email || ''} ${x?.mobile || ''} ${x?.telephone || ''} ${
        x?.budget || ''
      } ${x?.postcode || ''} ${x?.reason || ''}`.toLowerCase()
      return blob.includes(q)
    })
  }, [items, filter])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getAdminGeneralQueries()
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : []
      setItems(list)
    } catch (e) {
      setError(e?.message || 'Failed to load general queries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-black tracking-tight text-slate-900">General queries</h2>
            <p className="mt-1 text-sm text-slate-600">
              Investment Property Requirement Requests (IPRR) submitted from the Getting Started page.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
            <div className="w-full sm:w-80">
              <Input
                label="Filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search by name, email, property type…"
              />
            </div>
            <Button variant="secondary" onClick={load} disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Refreshing…' : 'Refresh'}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 ring-1 ring-slate-200">
            Showing <span className="font-semibold text-slate-900">{filtered.length}</span> quer
            {filtered.length === 1 ? 'y' : 'ies'}
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
      ) : filtered.length === 0 ? (
        <EmptyState title="No general queries yet" subtitle="Submit one from the Getting Started page." />
      ) : (
        <div className="grid gap-4">
          {filtered.map((q) => {
            const id = q?.id || q?._id
            return (
              <Card key={id} className="overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-black text-slate-900">
                        {q?.propertyType || 'Property requirement'}
                      </div>
                      {Array.isArray(q?.propertyStyles) && q.propertyStyles.length > 0 ? (
                        <div className="mt-0.5 text-xs text-slate-600">
                          Styles:{' '}
                          <span className="font-medium text-slate-800">{q.propertyStyles.join(', ')}</span>
                        </div>
                      ) : null}
                      <div className="mt-1 text-xs text-slate-600">
                        Submitted <span className="font-medium text-slate-800">{formatDate(q?.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      ID: <span className="break-all">{id || '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 px-5 py-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                  <div className="min-w-0 space-y-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Requirement details
                      </div>
                      <dl className="mt-2 grid gap-2 text-xs text-slate-700">
                        <div className="flex items-start justify-between gap-3">
                          <dt className="text-slate-500">Bedrooms</dt>
                          <dd className="text-right font-medium text-slate-800">
                            {q?.bedrooms ? q.bedrooms : '—'}
                          </dd>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                          <dt className="text-slate-500">Region</dt>
                          <dd className="text-right font-medium text-slate-800">{q?.region || '—'}</dd>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                          <dt className="text-slate-500">District / Borough</dt>
                          <dd className="text-right font-medium text-slate-800">{q?.district || '—'}</dd>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                          <dt className="text-slate-500">Ward</dt>
                          <dd className="text-right font-medium text-slate-800">{q?.ward || '—'}</dd>
                        </div>
                        <div className="flex items-start gap-3">
                          <dt className="text-slate-500">Reason</dt>
                          <dd className="flex-1 text-right whitespace-pre-wrap break-words text-slate-800">
                            {q?.reason || '—'}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Correspondence
                      </div>
                      <div className="mt-2 whitespace-pre-wrap break-words text-xs text-slate-700">
                        {q?.correspondenceAddress || '—'}
                      </div>
                      <div className="mt-2 text-xs text-slate-700">
                        <span className="text-slate-500">Postcode:</span>{' '}
                        <span className="font-medium text-slate-800">{q?.postcode || '—'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Contact details
                      </div>
                      <div className="mt-2 text-xs text-slate-700">
                        <div className="break-all">
                          <span className="font-medium text-slate-900">Name:</span> {q?.fullName || '—'}
                        </div>
                        <div className="mt-1 break-all">
                          <span className="font-medium text-slate-900">Email:</span> {q?.email || '—'}
                        </div>
                        <div className="mt-1 break-all">
                          <span className="font-medium text-slate-900">Mobile:</span> {q?.mobile || '—'}
                        </div>
                        <div className="mt-1 break-all">
                          <span className="font-medium text-slate-900">Telephone:</span> {q?.telephone || '—'}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Budget
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900">
                        {q?.budget && String(q.budget).trim() !== '' ? q.budget : '—'}
                      </div>
                    </div>
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

