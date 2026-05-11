import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Header } from '../../components/Layout/Header'
import { Footer } from '../../components/Layout/Footer'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useUserAuth } from '../../contexts/UserAuthContext'
import * as api from '../../api'

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

function Pill({ children, tone = 'slate' }) {
  const cls =
    tone === 'emerald'
      ? 'bg-emerald-100 text-emerald-800'
      : tone === 'amber'
        ? 'bg-amber-100 text-amber-800'
        : tone === 'rose'
          ? 'bg-rose-100 text-rose-800'
          : 'bg-slate-100 text-slate-700'
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${cls}`}>{children}</span>
}

export function ProviderPropertyDetailsPage() {
  const { id } = useParams()
  const { isAuthenticated, loading, user } = useUserAuth()
  const nav = useNavigate()
  const [property, setProperty] = useState(null)
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) nav(`/login?redirect=/provider/properties/${id}`, { replace: true })
  }, [loading, isAuthenticated, nav, id])

  useEffect(() => {
    if (!isAuthenticated || !id) return
    setBusy(true)
    setError(null)
    api
      .providerGetMyProperty(id)
      .then((data) => setProperty(data || null))
      .catch((e) => setError(e?.message || 'Failed to load'))
      .finally(() => setBusy(false))
  }, [isAuthenticated, id])

  const providerStatus = user?.providerStatus || 'none'
  const status = property?.moderationStatus || 'pending'
  const tone = status === 'approved' ? 'emerald' : status === 'pending' ? 'amber' : 'rose'

  const imgUrls = useMemo(() => {
    const images = property?.images || []
    return images.map((im) => im?.secureUrl || im?.url).filter(Boolean)
  }, [property])
  const heroImg = imgUrls[0]

  return (
    <div className="min-h-screen bg-white text-teal-900">
      <Header variant="light" />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <Link to="/provider/properties" className="text-sm font-semibold text-teal-700 hover:underline">
              ← Back to My properties
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-bold text-teal-900">{property?.title || 'Property'}</h1>
              <Pill tone={tone}>{status}</Pill>
            </div>
            {property?.location ? <div className="mt-1 text-sm text-teal-700">{property.location}</div> : null}
          </div>

          {providerStatus === 'approved' ? (
            <Button as={Link} to={`/provider/properties/${property?.id || property?._id}/edit`} variant="secondary">
              Edit
            </Button>
          ) : null}
        </div>

        {busy ? (
          <Card className="mt-6 h-72 animate-pulse bg-slate-100" />
        ) : error ? (
          <Card className="mt-6 p-6">
            <div className="text-sm font-semibold text-rose-700">{error}</div>
          </Card>
        ) : !property ? (
          <Card className="mt-6 p-6 text-sm text-teal-700">Property not found.</Card>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="overflow-hidden border-teal-200 bg-white">
              <div className="aspect-[16/9] w-full bg-slate-100">
                {heroImg ? (
                  <img src={heroImg} alt={property?.title || 'Property'} className="h-full w-full object-cover" />
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
              <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5">
                <div className="text-sm font-bold text-teal-900">Key figures</div>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-sm text-teal-900">
                  <div>
                    <dt className="text-xs font-semibold text-teal-700">Monthly rent</dt>
                    <dd className="mt-1 font-bold">{formatMoney(property.monthlyRent)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-teal-700">Investment</dt>
                    <dd className="mt-1 font-bold">{formatMoney(property.investmentAmount)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-teal-700">Expected profit</dt>
                    <dd className="mt-1 font-bold">{formatMoney(property.expectedProfit)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-teal-700">ROI</dt>
                    <dd className="mt-1 font-bold">{property.roi != null ? `${Number(property.roi).toFixed(0)}%` : '—'}</dd>
                  </div>
                </dl>
              </Card>

              {property?.tenancyDetails ? (
                <Card className="border-teal-200 bg-white p-5">
                  <div className="text-sm font-bold text-teal-900">Tenancy details</div>
                  <div className="mt-2 whitespace-pre-wrap text-sm text-teal-800">{property.tenancyDetails}</div>
                </Card>
              ) : null}

              {Array.isArray(property?.highlights) && property.highlights.filter(Boolean).length > 0 ? (
                <Card className="border-teal-200 bg-white p-5">
                  <div className="text-sm font-bold text-teal-900">Highlights</div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-teal-800">
                    {property.highlights
                      .map((x) => (x == null ? '' : String(x).trim()))
                      .filter(Boolean)
                      .slice(0, 20)
                      .map((h) => (
                        <span key={h} className="rounded-full bg-teal-100 px-3 py-1">
                          {h}
                        </span>
                      ))}
                  </div>
                </Card>
              ) : null}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

