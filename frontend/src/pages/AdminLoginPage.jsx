import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

export function AdminLoginPage() {
  const nav = useNavigate()
  const { login, user, loading, error, setError, isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setError(null)
  }, [setError])

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const next = searchParams.get('next') || '/admin'
      nav(next, { replace: true })
    }
  }, [isAuthenticated, loading, nav, searchParams])

  async function submit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await login(email, password)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900 flex flex-col">
      <Header variant="dark" />
      {/* Hero (same vibe as homepage) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-emerald-900/75" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse delay-1000" />

        <div className="relative">
          <div className="mx-auto max-w-7xl px-4 pb-14 pt-10 sm:pb-16 sm:pt-12">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                <span className="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-xs font-medium tracking-wider text-white/90">ADMIN ACCESS</span>
              </div>
              <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">
                <span className="block font-bold">Admin login</span>
                <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-white to-emerald-300 bg-clip-text text-transparent">
                  Manage properties, deals, and inquiries.
                </span>
              </h1>
              <div className="mt-6">
                <Link to="/" className="inline-block">
                  <Button variant="secondary" className="!bg-white/10 !text-white !ring-white/20 hover:!bg-white/20">
                    Back to home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mx-auto max-w-lg">
            <Card className="p-6 bg-white border-slate-200 shadow-sm">
              <form className="grid gap-3" onSubmit={submit}>
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />

                {error ? <div className="text-sm font-semibold text-rose-600">{error}</div> : null}
                {user ? (
                  <div className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
                    Signed in as <span className="font-black">{user.email}</span>
                  </div>
                ) : null}

                <Button type="submit" disabled={submitting || loading}>
                  {submitting ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

