import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

export function ProviderPropertiesPage() {
  const { isAuthenticated, loading, user } = useUserAuth()
  const nav = useNavigate()
  const [items, setItems] = useState([])
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) nav('/login?redirect=/provider/properties', { replace: true })
  }, [loading, isAuthenticated, nav])

  useEffect(() => {
    if (!isAuthenticated) return
    setBusy(true)
    setError(null)
    api
      .providerGetMyProperties()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => setError(e?.message || 'Failed to load'))
      .finally(() => setBusy(false))
  }, [isAuthenticated])

  const ordered = useMemo(() => {
    const rank = (p) => {
      const s = p?.moderationStatus || 'pending'
      if (s === 'pending') return 0
      if (s === 'approved') return 1
      if (s === 'rejected') return 2
      return 9
    }
    return [...items].sort((a, b) => {
      const r = rank(a) - rank(b)
      if (r !== 0) return r
      const ad = a?.createdAt ? new Date(a.createdAt).getTime() : 0
      const bd = b?.createdAt ? new Date(b.createdAt).getTime() : 0
      return bd - ad
    })
  }, [items])

  const providerStatus = user?.providerStatus || 'none'

  return (
    <div className="min-h-screen bg-white text-teal-900">
      <Header variant="light" />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-teal-900">My properties</h1>
            <p className="mt-1 text-sm text-teal-700">Your submissions and their approval status.</p>
          </div>
          <Button as={Link} to="/provider/properties/new" disabled={providerStatus !== 'approved'}>
            Submit a property
          </Button>
        </div>

        {providerStatus !== 'approved' ? (
          <Card className="mt-6 p-6">
            <div className="text-sm font-bold text-rose-700">Provider not approved.</div>
            <p className="mt-1 text-sm text-teal-700">
              Go to <Link className="font-semibold text-teal-700 hover:underline" to="/account">My account</Link> to apply.
            </p>
          </Card>
        ) : null}

        {busy ? (
          <Card className="mt-6 h-40 animate-pulse bg-slate-100" />
        ) : error ? (
          <Card className="mt-6 p-6">
            <div className="text-sm font-semibold text-rose-700">{error}</div>
          </Card>
        ) : ordered.length === 0 ? (
          <Card className="mt-6 p-6 text-sm text-teal-700">No submissions yet.</Card>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ordered.map((p) => {
              const status = p?.moderationStatus || 'pending'
              const tone = status === 'approved' ? 'emerald' : status === 'pending' ? 'amber' : 'rose'
              const id = p?.id || p?._id
              const imgUrl = (p?.images || []).map((im) => im?.secureUrl || im?.url).filter(Boolean)[0]

              const rent = formatMoney(p?.monthlyRent)
              const bills = p?.billsAmount ? formatMoney(p.billsAmount) : '£350'
              const profit = formatMoney(p?.expectedProfit)
              const roi = p?.roi != null ? `${Number(p.roi).toFixed(0)}%` : '—'

              const card = (
                <div className="group block overflow-hidden rounded-2xl border border-teal-200 bg-white transition hover:border-teal-400 hover:shadow-lg">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={p?.title || 'Property'}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">No image</div>
                    )}
                    <div className="absolute left-2 top-2">
                      <Pill tone={tone}>{status}</Pill>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="truncate text-sm font-bold text-teal-900">{p?.title || 'Property'}</div>
                    <div className="mt-1 truncate text-xs text-teal-700">{p?.location || ''}</div>
                    <div className="mt-3 text-[0.8rem] font-medium text-slate-900">
                      Rent: {rent} &nbsp;|&nbsp; Bills: {bills} &nbsp;|&nbsp; Profit: {profit}
                    </div>
                    <div className="mt-1 text-[0.8rem] font-semibold text-emerald-700">ROI: {roi}</div>
                    {providerStatus === 'approved' ? (
                      <div className="mt-4">
                        <Button as={Link} to={`/provider/properties/${id}/edit`} variant="secondary">
                          Edit
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              )

              if (!id) return <Card key={`${p?.title || 'property'}-${Math.random()}`} className="p-5">{card}</Card>

              return (
                <Link key={id} to={`/provider/properties/${id}`} className="block">
                  {card}
                </Link>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

