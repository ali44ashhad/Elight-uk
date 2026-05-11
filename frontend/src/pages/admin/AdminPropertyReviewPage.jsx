import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import * as api from '../../api'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

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

export function AdminPropertyReviewPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function load() {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await api.getAdminProperty(id)
      setProperty(data || null)
    } catch (e) {
      setError(e?.message || 'Failed to load property')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const imgUrls = useMemo(() => {
    const images = property?.images || []
    return images.map((im) => im?.secureUrl || im?.url).filter(Boolean)
  }, [property])

  async function setModeration(moderationStatus) {
    if (!id) return
    setBusy(true)
    setError(null)
    try {
      await api.updateProperty(id, { moderationStatus })
      await load()
    } catch (e) {
      setError(e?.message || 'Failed to update')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <button
              type="button"
              className="text-sm font-semibold text-slate-700 hover:underline"
              onClick={() => nav(-1)}
            >
              ← Back
            </button>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h2 className="truncate text-xl font-black tracking-tight text-slate-900">{property?.title || 'Property'}</h2>
              <Pill status={property?.moderationStatus || 'pending'} />
            </div>
            <div className="mt-1 text-sm text-slate-600">{property?.location || '—'}</div>
            <div className="mt-2 text-xs text-slate-500">
              ID: <span className="break-all">{id}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" disabled={busy || loading} onClick={() => setModeration('approved')}>
              {busy ? 'Working…' : 'Approve'}
            </Button>
            <Button variant="secondary" disabled={busy || loading} onClick={() => setModeration('rejected')}>
              Reject
            </Button>
            <Button as={Link} to="/admin/pending-properties" variant="secondary" disabled={busy}>
              Pending list
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
        <Card className="h-56 animate-pulse bg-slate-100" />
      ) : !property ? (
        <Card className="p-6 text-sm text-slate-600">Property not found.</Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="overflow-hidden">
            <div className="aspect-[16/9] w-full bg-slate-100">
              {imgUrls[0] ? (
                <img src={imgUrls[0]} alt={property?.title || 'Property'} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">No image</div>
              )}
            </div>
            {imgUrls.length > 1 ? (
              <div className="grid grid-cols-5 gap-2 p-4">
                {imgUrls.slice(0, 10).map((u) => (
                  <div key={u} className="aspect-square overflow-hidden rounded-xl bg-slate-100">
                    <img src={u} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </Card>

          <div className="space-y-4">
            <Card className="p-5">
              <div className="text-sm font-black text-slate-900">Key figures</div>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-900">
                <div>
                  <dt className="text-xs font-semibold text-slate-600">Monthly rent</dt>
                  <dd className="mt-1 font-bold">{formatMoney(property?.monthlyRent)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate-600">Investment</dt>
                  <dd className="mt-1 font-bold">{formatMoney(property?.investmentAmount)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate-600">Expected profit</dt>
                  <dd className="mt-1 font-bold">{formatMoney(property?.expectedProfit)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate-600">ROI</dt>
                  <dd className="mt-1 font-bold">{property?.roi != null ? `${Number(property.roi).toFixed(0)}%` : '—'}</dd>
                </div>
              </dl>
              <div className="mt-4 grid gap-1 text-xs text-slate-600">
                <div>
                  Seller: <span className="font-semibold text-slate-800">{property?.seller?.name || '—'}</span>
                </div>
                <div>
                  Created by user: <span className="font-semibold text-slate-800">{property?.createdByUser || '—'}</span>
                </div>
              </div>
            </Card>

            {property?.tenancyDetails ? (
              <Card className="p-5">
                <div className="text-sm font-black text-slate-900">Tenancy details</div>
                <div className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{property.tenancyDetails}</div>
              </Card>
            ) : null}

            {Array.isArray(property?.highlights) && property.highlights.filter(Boolean).length > 0 ? (
              <Card className="p-5">
                <div className="text-sm font-black text-slate-900">Highlights</div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-800">
                  {property.highlights
                    .map((x) => (x == null ? '' : String(x).trim()))
                    .filter(Boolean)
                    .slice(0, 20)
                    .map((h) => (
                      <span key={h} className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">
                        {h}
                      </span>
                    ))}
                </div>
              </Card>
            ) : null}
          </div>

          {property?.details && String(property.details).trim() ? (
            <Card className="p-5 lg:col-span-2">
              <div className="text-sm font-black text-slate-900">Details</div>
              <div
                className="prose prose-slate mt-3 max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: property.details }}
              />
            </Card>
          ) : null}
        </div>
      )}
    </div>
  )
}

