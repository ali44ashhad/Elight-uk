import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import logo from '../../assets/logo.jpeg'
import { useUserAuth } from '../../contexts/UserAuthContext'

function HeaderAvatar({ user, size = 'md' }) {
  const letter = String(user?.name || user?.email || '?').charAt(0).toUpperCase()
  const sizeClass = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-9 w-9 text-sm'
  if (user?.imageUrl) {
    return (
      <img
        src={user.imageUrl}
        alt=""
        className={`${sizeClass} rounded-full object-cover ring-2 ring-white/40`}
      />
    )
  }
  return (
    <div
      className={`flex ${sizeClass} items-center justify-center rounded-full bg-emerald-500/30 font-semibold text-white ring-2 ring-white/40`}
    >
      {letter}
    </div>
  )
}

function HeaderDesktopNav({ navItems, isDark }) {
  return (
    <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
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
  )
}

function HeaderMobileSection({ navItems, isDark, isOpen, setIsOpen, mobileFooter }) {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 md:hidden ${
        isOpen ? 'max-h-96 py-4' : 'max-h-0'
      }`}
    >
      <nav className="flex flex-col gap-5 pb-4" aria-label="Main mobile">
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
        {mobileFooter}
      </nav>
    </div>
  )
}

export function Header({ variant = 'dark' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileWrapRef = useRef(null)
  const isDark = variant === 'dark'
  const { user, loading, isAuthenticated, logout } = useUserAuth()

  const hasStoredUserToken =
    typeof window !== 'undefined' && !!localStorage.getItem('elite_user_token')
  const restoringSession = loading && !user && hasStoredUserToken

  useEffect(() => {
    if (!profileMenuOpen) return
    const onDown = (e) => {
      if (profileWrapRef.current && !profileWrapRef.current.contains(e.target)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [profileMenuOpen])

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/about-us', label: 'About Us' },
  ]

  let rightDesktop = null
  if (restoringSession) {
    rightDesktop = <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" aria-hidden />
  } else if (isAuthenticated && user) {
    rightDesktop = (
      <div className="relative" ref={profileWrapRef}>
        <button
          type="button"
          className="rounded-full outline-none ring-offset-2 ring-offset-slate-900 transition hover:ring-2 hover:ring-white/50 focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-expanded={profileMenuOpen}
          aria-haspopup="true"
          aria-label="Account menu"
          onClick={() => setProfileMenuOpen((v) => !v)}
        >
          <HeaderAvatar user={user} />
        </button>
        {profileMenuOpen ? (
          <div
            className="absolute right-0 z-50 mt-2 min-w-[11rem] rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
            role="menu"
          >
            <Link
              to="/account"
              role="menuitem"
              className="block px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              onClick={() => setProfileMenuOpen(false)}
            >
              Account
            </Link>
            <button
              type="button"
              role="menuitem"
              className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50"
              onClick={() => {
                logout()
                setProfileMenuOpen(false)
              }}
            >
              Log out
            </button>
          </div>
        ) : null}
      </div>
    )
  } else {
    rightDesktop = (
      <span
        className={`text-sm font-semibold tracking-wide ${
          isDark ? 'text-white/90' : 'text-white/90'
        }`}
      >
        Getting Started
      </span>
    )
  }

  let mobileFooter = null
  if (restoringSession) {
    mobileFooter = <div className="mt-2 h-8 w-8 animate-pulse rounded-full bg-white/10" aria-hidden />
  } else if (isAuthenticated && user) {
    mobileFooter = (
      <Link
        to="/account"
        className="mt-2 flex items-center gap-3 text-sm font-semibold text-white/90 hover:text-white"
        onClick={() => setIsOpen(false)}
      >
        <HeaderAvatar user={user} size="sm" />
        My account
      </Link>
    )
  } else {
    mobileFooter = (
      <span className="mt-2 text-sm font-semibold tracking-wide text-white/90">Getting Started</span>
    )
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-900 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="logo" className="h-10 w-auto" />
          </Link>

          <HeaderDesktopNav navItems={navItems} isDark={isDark} />

          <div className="hidden md:block">{rightDesktop}</div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`text-3xl md:hidden ${isDark ? 'text-white' : 'text-white'}`}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        <HeaderMobileSection
          navItems={navItems}
          isDark={isDark}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          mobileFooter={mobileFooter}
        />
      </div>
    </header>
  )
}
