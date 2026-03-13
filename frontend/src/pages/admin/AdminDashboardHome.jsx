import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../../api'
import { request } from '../../api'
import { Card } from '../../components/ui/Card'

function StatCard({ title, value, subtitle, to, loading, tone = 'slate' }) {
  const ring =
    tone === 'emerald'
      ? 'ring-emerald-200 bg-emerald-50/60'
      : tone === 'sky'
        ? 'ring-sky-200 bg-sky-50/60'
        : tone === 'violet'
          ? 'ring-violet-200 bg-violet-50/60'
          : 'ring-slate-200 bg-slate-50/70'

  return (
    <Card className={`p-5 ring-1 ${ring}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">{title}</div>
          <div className="mt-2 text-2xl font-black tracking-tight text-slate-900">
            {loading ? <span className="inline-block h-7 w-16 animate-pulse rounded bg-slate-200/70" /> : value}
          </div>
          <div className="mt-2 text-sm text-slate-700">{subtitle}</div>
        </div>

        {to ? (
          <Link
            to={to}
            className="shrink-0 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Open
          </Link>
        ) : null}
      </div>
    </Card>
  )
}

export function AdminDashboardHome() {
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState({ properties: 0, sellers: 0, deals: 0, inquiries: 0, refunds: 0 })

  const summary = useMemo(
    () => [
      {
        key: 'properties',
        title: 'Properties',
        to: '/admin/properties',
        tone: 'emerald',
        subtitle: 'Create, update and publish properties to the public site.',
      },
      {
        key: 'sellers',
        title: 'Sellers',
        to: '/admin/sellers',
        tone: 'slate',
        subtitle: 'Create sellers and assign them to properties.',
      },
      {
        key: 'deals',
        title: 'Deals',
        to: '/admin/deals',
        tone: 'sky',
        subtitle: 'Record payments, then mark sold or refunded when needed.',
      },
      {
        key: 'inquiries',
        title: 'Inquiries',
        to: '/admin/inquiries',
        tone: 'slate',
        subtitle: 'Review investor interest coming from property pages.',
      },
      {
        key: 'refunds',
        title: 'Refunds',
        to: '/admin/refunds',
        tone: 'violet',
        subtitle: 'View refund requests submitted from the public refund form.',
      },
    ],
    []
  )

  useEffect(() => {
    let alive = true

    function getTotal(res) {
      if (res?.pagination?.total != null) return Number(res.pagination.total) || 0
      if (Array.isArray(res?.data)) return res.data.length
      if (Array.isArray(res)) return res.length
      return 0
    }

    async function load() {
      setLoading(true)
      try {
        const [p, s, d, i, r] = await Promise.allSettled([
          api.getAdminProperties({ page: 1, limit: 1 }),
          api.getAdminSellers(),
          api.getAdminDeals({ page: 1, limit: 1 }),
          api.getAdminInquiries({ page: 1, limit: 1 }),
          request('GET', '/api/admin/refunds'),
        ])

        if (!alive) return
        setCounts({
          properties: p.status === 'fulfilled' ? getTotal(p.value) : 0,
          sellers: s.status === 'fulfilled' ? getTotal(s.value) : 0,
          deals: d.status === 'fulfilled' ? getTotal(d.value) : 0,
          inquiries: i.status === 'fulfilled' ? getTotal(i.value) : 0,
          refunds: r.status === 'fulfilled' ? getTotal(r.value) : 0,
        })
      } finally {
        if (!alive) return
        setLoading(false)
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-black tracking-tight text-slate-900">Dashboard</h2>
            <p className="mt-1 text-sm text-slate-600">
              Quick overview of your admin workspace. Jump into a section to manage your pipeline.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 ring-1 ring-slate-200">
              Status:{' '}
              <span className={`font-semibold ${loading ? 'text-slate-500' : 'text-emerald-700'}`}>
                {loading ? 'Loading…' : 'Up to date'}
              </span>
            </span>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {summary.map((s) => (
          <StatCard
            key={s.key}
            title={s.title}
            to={s.to}
            tone={s.tone}
            subtitle={s.subtitle}
            value={counts[s.key]}
            loading={loading}
          />
        ))}
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">Quick actions</div>
            <div className="mt-1 text-sm text-slate-600">
              Common next steps to keep deals and seller pipeline moving.
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/inquiries"
              className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Review inquiries
            </Link>
            <Link
              to="/admin/deals"
              className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Manage deals
            </Link>
            <Link
              to="/admin/sellers"
              className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Manage sellers
            </Link>
            <Link
              to="/admin/properties"
              className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Add property
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

