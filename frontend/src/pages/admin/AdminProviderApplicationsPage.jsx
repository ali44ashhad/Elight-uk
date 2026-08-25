import React, { useEffect, useState } from 'react'
import * as api from '../../api'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { openCloudinaryPdf } from '../../utils/cloudinaryPdf'

/**
 * @typedef {{
 *   id?: string,
 *   _id?: string,
 *   status?: string,
 *   rejectionReason?: string,
 *   createdAt?: string | Date,
 *   submittedData?: { phone?: string, company?: string, message?: string },
 *   agreement?: { partyB?: { name?: string, companyName?: string, address?: string, registeredNumber?: string }, pdfUrl?: string },
 *   user?: {
 *     name?: string,
 *     email?: string,
 *     companyName?: string,
 *     registeredNumber?: string,
 *     website?: string,
 *     address?: string,
 *   } | null,
 * }} AdminProviderApplication
 */

/**
 * @param {{ status?: string | null }} props
 */
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

/**
 * @param {string | Date | undefined} value
 */
function formatAppliedAt(value) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return String(value)
  }
}

export function AdminProviderApplicationsPage() {
  const [apps, setApps] = useState(/** @type {AdminProviderApplication[]} */ ([]))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))
  const [statusFilter, setStatusFilter] = useState('pending')
  const [busyId, setBusyId] = useState(/** @type {string | null} */ (null))

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getAdminProviderApplications(statusFilter ? { status: statusFilter } : {})
      setApps(Array.isArray(res) ? res : [])
    } catch (e) {
      const err = /** @type {{ message?: string }} */ (e)
      setError(err?.message || 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  /**
   * @param {string | undefined} id
   * @param {'approve' | 'reject'} action
   */
  async function review(id, action) {
    if (!id) return
    setBusyId(id)
    setError(null)
    try {
      let reason = ''
      if (action === 'reject') {
        // eslint-disable-next-line no-alert
        reason = window.prompt('Rejection reason (optional)') || ''
      }
      await api.reviewAdminProviderApplication(id, { action, reason })
      await load()
    } catch (e) {
      const err = /** @type {{ message?: string }} */ (e)
      setError(err?.message || 'Failed to review')
    } finally {
      setBusyId(null)
    }
  }

  /**
   * @param {string | undefined} url
   * @param {boolean} [download]
   */
  function onPdf(url, download = false) {
    setError(null)
    try {
      openCloudinaryPdf(url, { download })
    } catch (e) {
      const err = /** @type {{ message?: string }} */ (e)
      setError(err?.message || 'Agreement PDF is not available')
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-black tracking-tight text-slate-900">Provider applications</h2>
            <p className="mt-1 text-sm text-slate-600">Approve or reject users who want to become providers.</p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-800">Status</span>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="pending">pending</option>
                <option value="approved">approved</option>
                <option value="rejected">rejected</option>
                <option value="">all</option>
              </select>
            </label>
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
      ) : apps.length === 0 ? (
        <Card className="p-6 text-sm text-slate-600">No applications found.</Card>
      ) : (
        <div className="grid gap-4">
          {apps.map((a) => {
            const id = a?.id || a?._id
            const user = a?.user
            const party = a?.agreement?.partyB
            const status = a?.status || 'pending'
            const busy = busyId === id
            const pdfUrl = a?.agreement?.pdfUrl
            const company = party?.companyName || user?.companyName || a?.submittedData?.company
            const registeredNumber = party?.registeredNumber || user?.registeredNumber
            const address = party?.address || user?.address
            return (
              <Card key={id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-black text-slate-900">{user?.name || party?.name || '—'}</div>
                    <div className="mt-1 text-sm text-slate-600">{user?.email || '—'}</div>
                    {company ? <div className="mt-1 text-sm text-slate-700">{company}</div> : null}
                    {registeredNumber ? (
                      <div className="mt-1 text-xs text-slate-500">Company no. {registeredNumber}</div>
                    ) : null}
                    {address ? (
                      <div className="mt-1 whitespace-pre-line text-xs text-slate-500">{address}</div>
                    ) : null}
                    {a?.createdAt ? (
                      <div className="mt-2 text-xs font-medium text-slate-500">
                        Applied {formatAppliedAt(a.createdAt)}
                      </div>
                    ) : null}
                    {a?.submittedData?.message ? (
                      <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200">
                        {a.submittedData.message}
                      </div>
                    ) : null}
                    {a?.rejectionReason ? (
                      <div className="mt-2 text-xs font-semibold text-rose-700">
                        Rejection reason: <span className="font-medium">{a.rejectionReason}</span>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Pill status={status} />
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        variant="secondary"
                        className="!px-3 !py-1 text-xs"
                        disabled={!pdfUrl}
                        onClick={() => onPdf(pdfUrl, false)}
                      >
                        View PDF
                      </Button>
                      <Button
                        variant="secondary"
                        className="!px-3 !py-1 text-xs"
                        disabled={!pdfUrl}
                        onClick={() => onPdf(pdfUrl, true)}
                      >
                        Download PDF
                      </Button>
                    </div>
                    {status === 'pending' ? (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="secondary"
                          className="!px-3 !py-1 text-xs"
                          disabled={busy}
                          onClick={() => review(id, 'approve')}
                        >
                          {busy ? 'Working…' : 'Approve'}
                        </Button>
                        <Button
                          variant="secondary"
                          className="!px-3 !py-1 text-xs"
                          disabled={busy}
                          onClick={() => review(id, 'reject')}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : null}
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
