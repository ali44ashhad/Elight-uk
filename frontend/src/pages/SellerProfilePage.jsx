import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as api from '../api'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Card } from '../components/ui/Card'

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

function toTitleCase(str) {
  if (!str) return ''
  return String(str)
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function getEffectiveStatus(property) {
  const raw = property?.status || 'Available'
  const until = property?.underOfferUntil ? new Date(property.underOfferUntil) : null
  const now = new Date()
  if (raw === 'UnderOffer' && until && until < now) {
    return 'Available'
  }
  return raw
}

export function SellerProfilePage() {
  const { id } = useParams()
  const [seller, setSeller] = useState(null)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const orderedProperties = useMemo(() => {
    const rank = (p) => {
      const s = getEffectiveStatus(p)
      if (s === 'Available') return 0
      if (s === 'UnderOffer') return 1
      if (s === 'Sold') return 2
      return 3
    }
    return [...(properties || [])].sort((a, b) => {
      const r = rank(a) - rank(b)
      if (r !== 0) return r
      const ad = a?.createdAt ? new Date(a.createdAt).getTime() : 0
      const bd = b?.createdAt ? new Date(b.createdAt).getTime() : 0
      return bd - ad
    })
  }, [properties])

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    if (!id) {
      setLoading(false)
      return
    }
    Promise.all([
      api.getSeller(id),
      api.getProperties({ seller: id }),
    ])
      .then(([sellerData, propsData]) => {
        if (!alive) return
        setSeller(sellerData)
        const list = Array.isArray(propsData) ? propsData : Array.isArray(propsData?.data) ? propsData.data : []
        setProperties(list)
      })
      .catch((e) => {
        if (!alive) return
        setError(e?.message || 'Failed to load')
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })
    return () => { alive = false }
  }, [id])

  return (
    <div className="min-h-screen bg-white text-teal-900">
      <Header variant="light" />
      <main>
        <section className="mx-auto max-w-6xl px-4 py-10">
          {loading ? (
            <Card className="h-64 animate-pulse bg-slate-100" />
          ) : error ? (
            <Card className="p-6">
              <div className="text-sm font-semibold text-rose-700">{error}</div>
              <Link to="/" className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline">
                ← Back to home
              </Link>
            </Card>
          ) : !seller ? (
            <Card className="p-6">
              <div className="text-sm font-semibold text-teal-900">Seller not found.</div>
              <Link to="/" className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline">
                ← Back to home
              </Link>
            </Card>
          ) : (
            <>
              <Card className="mb-8 overflow-hidden border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6">
                <div className="flex flex-wrap items-center gap-6">
                  {seller.imageUrl ? (
                    <img
                      src={seller.imageUrl}
                      alt=""
                      className="h-24 w-24 rounded-full object-cover ring-2 ring-teal-200"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-200 text-3xl font-bold text-teal-800">
                      {(seller.name || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-teal-900">{seller.name || 'Seller'}</h1>
                    <p className="mt-1 text-sm text-teal-600">
                      {properties.length} propert{properties.length === 1 ? 'y' : 'ies'} listed
                    </p>
                  </div>
                </div>
              </Card>

              <h2 className="mb-4 text-lg font-bold text-teal-900">Properties</h2>
              {properties.length === 0 ? (
                <Card className="p-6 text-sm text-teal-700">
                  No properties listed yet.
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {orderedProperties.map((p) => {
                    const propId = p?.id || p?._id
                    const images = p?.images || []
                    const imgUrl = images.map((im) => im?.secureUrl || im?.url).filter(Boolean)[0]
                    const title = toTitleCase(p?.title || '')
                    const location = toTitleCase(p?.location || '')
                    const status = getEffectiveStatus(p)
                    const isLocked = status === 'UnderOffer' || status === 'Sold'
                    const card = (
                      <div className="group block overflow-hidden rounded-2xl border border-teal-200 bg-white transition hover:border-teal-400 hover:shadow-lg">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={title || 'Property'}
                              className={`h-full w-full object-cover transition group-hover:scale-105 ${
                                isLocked ? 'grayscale-[55%] blur-[1px] brightness-90' : ''
                              }`}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                              No image
                            </div>
                          )}
                          <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold uppercase text-white">
                            {status}
                          </div>
                          {isLocked ? (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35">
                              <div className="flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-emerald-50 shadow-sm">
                                <span>🔒</span>
                                <span>{status === 'Sold' ? 'Sold' : 'Under offer'}</span>
                              </div>
                            </div>
                          ) : null}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-teal-900 line-clamp-1">{title || 'Property'}</h3>
                          {location ? (
                            <p className="mt-1 text-sm text-teal-600 line-clamp-1">{location}</p>
                          ) : null}
                          <div className="mt-3 flex flex-wrap gap-3 text-xs text-teal-700">
                            <span>Rent: {formatMoney(p?.monthlyRent)}</span>
                            <span>Investment: {formatMoney(p?.investmentAmount)}</span>
                          </div>
                        </div>
                      </div>
                    )

                    if (!propId || isLocked) {
                      return (
                        <div
                          key={propId || `${p?.title || 'property'}-${Math.random()}`}
                          className={isLocked ? 'cursor-not-allowed' : 'cursor-default'}
                          aria-disabled={isLocked ? 'true' : undefined}
                        >
                          {card}
                        </div>
                      )
                    }

                    return (
                      <Link
                        key={propId}
                        to={`/properties/${propId}`}
                        className="block"
                      >
                        {card}
                      </Link>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
