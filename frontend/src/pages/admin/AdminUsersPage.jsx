import React, { useCallback, useEffect, useState } from 'react'
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

function providerPill(status) {
  const s = status || 'none'
  const cls =
    s === 'approved'
      ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
      : s === 'rejected'
        ? 'bg-rose-50 text-rose-800 ring-rose-200'
        : s === 'pending'
          ? 'bg-amber-50 text-amber-900 ring-amber-200'
          : 'bg-slate-50 text-slate-700 ring-slate-200'
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}>{s}</span>
}

export function AdminUsersPage() {
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [role, setRole] = useState('')
  const [q, setQ] = useState('')
  const [qDraft, setQDraft] = useState('')
  const [page, setPage] = useState(1)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, limit: 20 }
      if (role === 'providers' || role === 'buyers') params.role = role
      const trimmed = q.trim()
      if (trimmed) params.q = trimmed
      const res = await api.getAdminUsers(params)
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : []
      setRows(list)
      setPagination(res?.pagination || null)
    } catch (e) {
      setError(e?.message || 'Failed to load users')
      setRows([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [page, role, q])

  useEffect(() => {
    load()
  }, [load])

  async function toggleActive(row) {
    const id = row?.id || row?._id
    if (!id) return
    const next = row?.isActive === false ? true : false
    setBusyId(id)
    setError(null)
    try {
      await api.patchAdminUser(id, { isActive: next })
      await load()
    } catch (e) {
      setError(e?.message || 'Failed to update user')
    } finally {
      setBusyId(null)
    }
  }

  function applySearch() {
    setPage(1)
    setQ(qDraft.trim())
  }

  const totalPages = pagination?.pages || 1

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-black tracking-tight text-slate-900">Users &amp; providers</h2>
            <p className="mt-1 text-sm text-slate-600">
              Activate or deactivate accounts. Deactivating an approved provider hides every property they listed from
              the public site until you activate them again.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <label className="block sm:min-w-[160px]">
              <span className="mb-1 block text-sm font-medium text-slate-800">Show</span>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">All users</option>
                <option value="providers">Approved providers only</option>
                <option value="buyers">Non-providers (buyers &amp; applicants)</option>
              </select>
            </label>
            <div className="flex w-full flex-col gap-2 sm:w-72">
              <Input
                label="Search name or email"
                value={qDraft}
                onChange={(e) => setQDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applySearch()
                }}
                placeholder="e.g. jamie@…"
              />
              <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={applySearch}>
                Search
              </Button>
            </div>
            <Button variant="secondary" onClick={load} disabled={loading} className="sm:mb-[2px]">
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
      ) : rows.length === 0 ? (
        <Card className="p-6 text-sm text-slate-600">No users match your filters.</Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Account</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((row) => {
                const id = row?.id || row?._id
                const active = row?.isActive !== false
                const busy = busyId === id
                return (
                  <tr key={id} className="text-slate-800">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{row?.name || '—'}</div>
                      <div className="mt-0.5 text-slate-600">{row?.email || '—'}</div>
                    </td>
                    <td className="px-4 py-3">{providerPill(row?.providerStatus)}</td>
                    <td className="px-4 py-3">
                      {active ? (
                        <span className="font-medium text-emerald-700">Active</span>
                      ) : (
                        <span className="font-medium text-rose-700">Deactivated</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(row?.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {active ? (
                        <Button type="button" variant="secondary" disabled={busy} onClick={() => toggleActive(row)}>
                          {busy ? '…' : 'Deactivate'}
                        </Button>
                      ) : (
                        <Button type="button" disabled={busy} onClick={() => toggleActive(row)}>
                          {busy ? '…' : 'Activate'}
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}

      {pagination && totalPages > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <span>
            Page <span className="font-semibold text-slate-900">{pagination.page}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalPages}</span>
            {pagination.total != null ? (
              <>
                {' '}
                (<span className="font-semibold text-slate-900">{pagination.total}</span> total)
              </>
            ) : null}
          </span>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" disabled={loading || page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={loading || page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
