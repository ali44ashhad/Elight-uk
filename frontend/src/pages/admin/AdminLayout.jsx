import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import logo from '../../assets/logo.png'
const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/properties', label: 'Properties' },
  { path: '/admin/sellers', label: 'Sellers' },
  { path: '/admin/deals', label: 'Deals' },
  { path: '/admin/inquiries', label: 'Inquiries' },
  { path: '/admin/refunds', label: 'Refunds' },
  { path: '/admin/general-queries', label: 'General queries' },
]

function NavButton({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
        active
          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
          : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      {children}
    </Link>
  )
}

export function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <a href="/">
            <img src={logo} alt="Global Deal Sourcing" className="h-10 w-auto" /></a>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-500">Signed in as</p>
              <p className="text-sm font-medium text-slate-900">{user?.email}</p>
            </div>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:flex-row">
        {/* Sidebar nav */}
        <aside className="w-full space-y-4 lg:max-w-[220px]">
          <Card className="p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Navigation</p>
            <div className="mt-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const active =
                  item.path === '/admin'
                    ? location.pathname === '/admin'
                    : location.pathname.startsWith(item.path)
                return (
                  <NavButton key={item.path} to={item.path} active={active}>
                    <span>{item.label}</span>
                  </NavButton>
                )
              })}
            </div>
          </Card>
        </aside>

        {/* Main content */}
        <main className="flex-1 space-y-6 pb-10">{children}</main>
      </div>
    </div>
  )
}

