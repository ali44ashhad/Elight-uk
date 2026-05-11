import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Header } from '../components/Layout/Header'
import { Footer } from '../components/Layout/Footer'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useUserAuth } from '../contexts/UserAuthContext'

export function UserLoginPage() {
  const { login, error, setError } = useUserAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()
  const loc = useLocation()

  const redirectTo = useMemo(() => {
    const s = new URLSearchParams(loc.search)
    return s.get('redirect') || '/account'
  }, [loc.search])

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await login(email, password)
      nav(redirectTo, { replace: true })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-teal-900">
      <Header variant="light" />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-teal-900">Login</h1>
          <p className="mt-1 text-sm text-teal-700">Login to manage your provider account.</p>

          {error ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={busy}>
                {busy ? 'Logging in…' : 'Login'}
              </Button>
              <Link to="/register" className="text-sm font-semibold text-teal-700 hover:underline">
                Create an account
              </Link>
            </div>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

