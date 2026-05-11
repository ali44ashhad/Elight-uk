import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../../api'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

function Pill({ status }) {
  const s = status || 'pending'
  const cls =
    s === 'approved'
      ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
      : s === 'rejected'
        ? 'bg-rose-50 text-rose-800 ring-rose-200'
        : 'bg-amber-50 text-amber-900 ring-amber-200'
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}>{s}</span>
}

export function AdminPendingPropertiesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')
  const [busyId, setBusyId] = useState(null)

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return items
    return items.filter((p) => {
      const blob = `${p?.title || ''} ${p?.location || ''} ${p?.id || ''} ${p?.seller?.name || ''}`.toLowerCase()
      return blob.includes(q)
    })
  }, [items, filter])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getAdminProperties({ moderationStatus: 'pending' })
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : []
      setItems(list)
    } catch (e) {
      setError(e?.message || 'Failed to load pending properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function setModeration(id, moderationStatus) {
    setBusyId(id)
    setError(null)
    try {
      await api.updateProperty(id, { moderationStatus })
      await load()
    } catch (e) {
      setError(e?.message || 'Failed to update')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-black tracking-tight text-slate-900">Pending properties</h2>
            <p className="mt-1 text-sm text-slate-600">Approve provider submissions to publish them to the public site.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
            <div className="w-full sm:w-80">
              <Input
                label="Filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search by title, location, seller…"
              />
            </div>
            <Button variant="secondary" onClick={load} disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Refreshing…' : 'Refresh'}
            </Button>
          </div>
        </div>
      </Card>

      {error ? (
        <Card className="p-3">
          <div className="text-sm font-semibold text-rose-700">{error}</div>
        </Card>
      ) : null}

      {loading ? (
        <Card className="h-40 animate-pulse bg-slate-100" />
      ) : filtered.length === 0 ? (
        <Card className="p-6 text-sm text-slate-600">No pending submissions.</Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((p) => {
            const id = p?.id || p?._id
            const busy = busyId === id
            return (
              <Card key={id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-black text-slate-900">{p?.title || '—'}</div>
                    <div className="mt-1 text-sm text-slate-600">{p?.location || '—'}</div>
                    <div className="mt-3 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
                      <div>
                        Seller: <span className="font-semibold text-slate-800">{p?.seller?.name || '—'}</span>
                      </div>
                      <div>
                        Submitted by user: <span className="font-semibold text-slate-800">{p?.createdByUser || '—'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Pill status={p?.moderationStatus || 'pending'} />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        as={Link}
                        to={`/admin/pending-properties/${id}`}
                        variant="secondary"
                        className="!px-3 !py-1 text-xs"
                        disabled={!id}
                      >
                        View
                      </Button>
                      <Button
                        variant="secondary"
                        className="!px-3 !py-1 text-xs"
                        disabled={busy}
                        onClick={() => setModeration(id, 'approved')}
                      >
                        {busy ? 'Working…' : 'Approve'}
                      </Button>
                      <Button
                        variant="secondary"
                        className="!px-3 !py-1 text-xs"
                        disabled={busy}
                        onClick={() => setModeration(id, 'rejected')}
                      >
                        Reject
                      </Button>
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

