import { Link } from 'react-router-dom'
import { useState } from 'react'
import logo from '../../assets/logo.jpeg'
import { useUserAuth } from '../../contexts/UserAuthContext'

function AccountIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export function Header({ variant = 'dark' }) {
  const [isOpen, setIsOpen] = useState(false)
  const isDark = variant === 'dark'
  const { user, isAuthenticated } = useUserAuth()

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/about-us', label: 'About Us' },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-900 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="logo" className="h-10 w-auto" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-lg font-semibold transition ${
                  isDark ? 'text-white/90 hover:text-white' : 'text-white/90 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              to="/account"
              aria-label="Account"
              title="Account"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
                isDark
                  ? 'border border-white/20 bg-white/10 text-white hover:bg-white/20'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {isAuthenticated && user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-white/20"
                />
              ) : (
                <AccountIcon className="h-5 w-5" />
              )}
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`text-3xl md:hidden ${isDark ? 'text-white' : 'text-white'}`}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            isOpen ? 'max-h-96 py-4' : 'max-h-0'
          }`}
        >
          <nav className="flex flex-col gap-5 pb-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium ${
                  isDark ? 'text-white/90 hover:text-white' : 'text-white/90 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              to="/account"
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-center text-sm font-semibold text-white hover:bg-slate-800"
            >
              {isAuthenticated && user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover ring-2 ring-white/20"
                />
              ) : (
                <AccountIcon className="h-5 w-5" />
              )}
              <span>{isAuthenticated ? 'My account' : 'Account'}</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )}
