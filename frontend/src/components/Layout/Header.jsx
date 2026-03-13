import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { useState } from 'react'

export function Header({ variant = 'dark' }) {
  const [isOpen, setIsOpen] = useState(false)
  const isDark = variant === 'dark'

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/about-us', label: 'About Us' },
    { to: '/getting-started', label: 'Getting Started' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-md ${
        isDark ? 'border-white/10 bg-slate-950/70' : 'border-slate-200/70 bg-white/80'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-20 items-center justify-between"> 
          <Link to="/" className="relative group">
            <img 
              src={logo} 
              alt="Global Deal Sourcing" 
              className="h-12 w-auto transition-transform group-hover:scale-105" 
            />
          </Link> 
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`group relative px-4 py-2 text-sm font-medium transition-colors ${
                  isDark 
                    ? 'text-white/90 hover:text-white' 
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-current transition-all group-hover:w-full ${
                  isDark ? 'bg-white' : 'bg-slate-900'
                }`} />
              </Link>
            ))}
          </nav>
 
          <div className="hidden md:block">
            <Link
              to="/contact"
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                isDark
                  ? 'border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              Contact Us
            </Link>
          </div> 
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative z-50 block md:hidden ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''} bg-current`} />
              <span className={`block h-0.5 w-6 transition-all ${isOpen ? 'opacity-0' : ''} bg-current`} />
              <span className={`block h-0.5 w-6 transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''} bg-current`} />
            </div>
          </button> 
          {isOpen && (
            <div className="fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-lg md:hidden">
              <nav className="flex h-full flex-col items-center justify-center space-y-8">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-light text-white transition-colors hover:text-emerald-400"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="mt-8 rounded-full border-2 border-white/20 px-10 py-3 text-lg text-white backdrop-blur-sm hover:bg-white/10"
                >
                  Contact Us
                </Link>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}