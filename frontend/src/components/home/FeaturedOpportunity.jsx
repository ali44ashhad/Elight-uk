import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'
import logo from '../../assets/logo.png'

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

function getEffectiveStatus(property) {
  const raw = property?.status || 'Available'
  const until = property?.underOfferUntil ? new Date(property.underOfferUntil) : null
  const now = new Date()
  if (raw === 'UnderOffer' && until && until < now) {
    return 'Available'
  }
  return raw
}

function getUnderOfferCountdown(property) {
  const until = property?.underOfferUntil ? new Date(property.underOfferUntil) : null
  if (!until) return null
  const now = new Date()
  const diffMs = until.getTime() - now.getTime()
  if (diffMs <= 0) return null
  const totalSeconds = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSeconds / (60 * 60 * 24))
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
  const seconds = totalSeconds % 60

  if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) return 'Expires soon'

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0 || days > 0) parts.push(`${hours}h`)
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`)
  parts.push(`${seconds}s`)

  return `${parts.join(' ')} left`
}

function OpportunityCard({ property }) {
  const images = property?.images || []
  const imgUrls = images.map((im) => im?.secureUrl || im?.url).filter(Boolean)
  const [hovered, setHovered] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nowTick, setNowTick] = useState(() => Date.now())

  useEffect(() => {
    if (!hovered || imgUrls.length <= 1) return
    const t = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % imgUrls.length)
    }, 700)
    return () => clearInterval(t)
  }, [hovered, imgUrls.length])

  useEffect(() => {
    if (!hovered) setCurrentIndex(0)
  }, [hovered])

  useEffect(() => {
    const t = setInterval(() => {
      setNowTick(Date.now())
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const img = imgUrls[currentIndex] || imgUrls[0]
  const title = property?.title || 'Property opportunity'
  const location = property?.location || ''
  const seller = property?.seller && typeof property.seller === 'object' ? property.seller : null
  const status = getEffectiveStatus(property)
  const underOfferCountdown = status === 'UnderOffer' ? getUnderOfferCountdown(property) : null
  const isLocked = status === 'Sold' || status === 'UnderOffer'

  const rent = formatMoney(property?.monthlyRent)
  const bills = property?.billsAmount ? formatMoney(property.billsAmount) : '£350'
  const profit = formatMoney(property?.expectedProfit)
  const roi = property?.roi != null ? `${Number(property.roi).toFixed(0)}%` : '—'

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-[26px] border border-emerald-900/90 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.15)]">
      <div className="relative">
        <div
          className={`group relative h-60 w-full rounded-[26px] bg-slate-100 ${
            isLocked ? 'overflow-hidden' : ''
          }`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {img ? (
            <img
              src={img}
              alt={title}
              className={`h-full w-full object-cover transition-opacity duration-300 ${
                isLocked ? 'grayscale-[55%] blur-[1px] brightness-90' : ''
              }`}
              key={currentIndex}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
              Image coming soon
            </div>
          )}

          {/* Status badge */}
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
            <span className="rounded-full bg-black/65 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-emerald-100 shadow-sm">
              {status}
            </span>
            {status === 'UnderOffer' && underOfferCountdown ? (
              <span className="rounded-full bg-emerald-100/90 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wide text-emerald-800 shadow-sm">
                {underOfferCountdown}
              </span>
            ) : null}
          </div>

          {/* Hover carousel dots (auto-rotates on hover) */}
          {imgUrls.length > 1 && (
            <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {imgUrls.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${
                    i === currentIndex ? 'bg-white ring-1 ring-slate-400' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        {isLocked ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[26px] bg-black/35">
            <div className="flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-emerald-50 shadow-sm">
              <span>🔒</span>
              <span>{status === 'Sold' ? 'Sold' : 'Under offer'}</span>
            </div>
          </div>
        ) : null}
        <div className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-black/5" />
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center justify-center px-4 py-1 text-[0.68rem] font-semibold tracking-[0.18em] text-emerald-50">
          <img src={logo} alt="" className="h-9 w-auto opacity-90 sm:h-10" />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">
              {title} {location ? `| ${location}` : ''}
            </div>
          </div>
          {seller && (seller.id || seller._id) ? (
            <Link
              to={`/sellers/${seller.id || seller._id}`}
              className="flex shrink-0 items-center gap-2   text-[0.68rem] font-medium text-slate-800 transition "
              onClick={(e) => {
                if (isLocked) {
                  e.preventDefault()
                  e.stopPropagation()
                }
              }}
            >
              {seller.imageUrl ? (
                <img
                  src={seller.imageUrl}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[0.7rem] font-semibold text-emerald-800">
                  {(seller.name || '?').charAt(0).toUpperCase()}
                </div>
              )}  
            </Link>
          ) : null}
        </div>
        <div className="mt-2 text-[0.8rem] font-medium text-slate-900">
          Rent: {rent} &nbsp;|&nbsp; Bills: {bills} &nbsp;|&nbsp; Profit: {profit}
        </div>
        <div className="mt-1 text-[0.8rem] font-semibold text-emerald-700">ROI: {roi}</div>

        {Array.isArray(property?.highlights) && property.highlights.filter(Boolean).length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[0.72rem] text-slate-600">
            {property.highlights
              .map((x) => (x == null ? '' : String(x).trim()))
              .filter(Boolean)
              .slice(0, 10)
              .map((h) => (
                <span key={h}>{h}</span>
              ))}
          </div>
        ) : null}
      </div>
 
    </Card>
  )
}

function Pagination({ page, totalPages, onPageChange }) {
  const pages = useMemo(() => {
    const n = Math.max(1, Number(totalPages) || 1)
    return Array.from({ length: n }, (_, i) => i + 1)
  }, [totalPages])

  if (!onPageChange || pages.length <= 1) return null

  return (
    <div className="mt-6 flex justify-center">
      <nav className="inline-flex items-center gap-1 rounded-full border border-emerald-500/70 bg-white px-2 py-1 shadow-sm">
        {pages.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPageChange(n)}
            className={`h-8 w-8 rounded-full text-xs font-semibold ${
              n === page
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-800 hover:bg-emerald-50'
            }`}
          >
            {n}
          </button>
        ))}
      </nav>
    </div>
  )
}

export function FeaturedOpportunity({ featured = [], loading, loadError }) {
  const [page, setPage] = useState(1)
  const pageSize = 3

  const orderedFeatured = useMemo(() => {
    const rank = (p) => {
      const s = getEffectiveStatus(p)
      if (s === 'Available') return 0
      if (s === 'UnderOffer') return 1
      if (s === 'Sold') return 2
      return 3
    }
    return [...featured].sort((a, b) => rank(a) - rank(b))
  }, [featured])

  const totalPages = Math.max(1, Math.ceil((orderedFeatured.length || 0) / pageSize))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const pageItems = useMemo(
    () => orderedFeatured.slice((page - 1) * pageSize, page * pageSize),
    [orderedFeatured, page, pageSize],
  )

  return (
    <section id="featured-opportunities" className="bg-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Featured Opportunities</h2>
          <p className="mt-2 text-sm text-slate-700">
          Buying Property or Renting Property for Business: deals are sold on a first come, first served basis.           </p>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="h-80 animate-pulse rounded-[26px] bg-slate-100" />
            ))}
          </div>
        ) : loadError ? (
          <Card className="mt-8 rounded-2xl p-5">
            <div className="text-sm font-semibold text-rose-700">{loadError}</div>
            <div className="mt-1 text-sm text-slate-600">Make sure the backend is running and CORS is allowed.</div>
          </Card>
        ) : (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((p) => {
                const id = p?.id || p?._id
                const status = getEffectiveStatus(p)
                const isLocked = status === 'UnderOffer' || status === 'Sold'
                const card = <OpportunityCard property={p} />
                if (!id || isLocked) {
                  return (
                    <div key={id || Math.random()} className={isLocked ? 'cursor-not-allowed' : 'cursor-default'}>
                      {card}
                    </div>
                  )
                }
                return (
                  <Link key={id} to={`/properties/${id}`} className="block">
                    {card}
                  </Link>
                )
              })}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </section>
  )
}

