import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../api'
import { Footer } from '../components/Layout/Footer'
import { FeaturedOpportunity } from '../components/home/FeaturedOpportunity'
import { Header } from '../components/Layout/Header'
import heroVideo from '../assets/hero.mp4'

function AnimatedNumber({ end, durationMs = 1400, suffix = '' }) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)
  const [hasRun, setHasRun] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || hasRun) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)')?.matches

    const start = () => {
      if (hasRun) return
      setHasRun(true)
      if (prefersReducedMotion) {
        setValue(end)
        return
      }

      const startTs = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - startTs) / durationMs)
        const eased = 1 - Math.pow(1 - t, 3)
        setValue(Math.round(end * eased))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start()
          obs.disconnect()
        }
      },
      { threshold: 0.35 }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [durationMs, end, hasRun])

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}

export function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [isMailchimpOpen, setIsMailchimpOpen] = useState(false)
  const [investorsLoungeOpen, setInvestorsLoungeOpen] = useState(false)
  const [investorsLoungeSubmitting, setInvestorsLoungeSubmitting] = useState(false)
  const [investorsLoungeError, setInvestorsLoungeError] = useState(null)
  const [investorsLoungeSuccess, setInvestorsLoungeSuccess] = useState(false)
  const [investorsLoungeForm, setInvestorsLoungeForm] = useState({
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    terms: [],
  })

  useEffect(() => {
    if (!investorsLoungeOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setInvestorsLoungeOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [investorsLoungeOpen])

  useEffect(() => {
    const t = window.setTimeout(() => {
      setIsMailchimpOpen(true)
    }, 5000)

    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    let alive = true
    setLoading(true)
    setLoadError(null)
    api
      .getProperties()
      .then((data) => {
        if (!alive) return
        const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
        setFeatured(list)
      })
      .catch((e) => {
        if (!alive) return
        setLoadError(e?.message || 'Failed to load properties')
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  useMemo(() => {
    const total = featured.length
    const available = featured.filter((p) => (p?.status || 'Available') === 'Available').length
    return { total, available }
  }, [featured])

  function scrollToFeatured() {
    const el = document.getElementById('featured-opportunities')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  async function submitInvestorsLounge(e) {
    e.preventDefault()
    if (investorsLoungeSubmitting) return
    setInvestorsLoungeError(null)
    setInvestorsLoungeSuccess(false)

    const fullName = String(investorsLoungeForm.fullName || '').trim()
    const mobileNumber = String(investorsLoungeForm.mobileNumber || '').trim()
    const emailAddress = String(investorsLoungeForm.emailAddress || '').trim()
    const terms = Array.isArray(investorsLoungeForm.terms) ? investorsLoungeForm.terms : []

    if (!fullName || !mobileNumber || !emailAddress) {
      setInvestorsLoungeError('Full Name, Mobile Number, and Email Address are required.')
      return
    }

    setInvestorsLoungeSubmitting(true)
    try {
      await api.createInvestorsLoungeSubmission({ fullName, mobileNumber, emailAddress, terms })
      setInvestorsLoungeSuccess(true)
      setInvestorsLoungeForm({ fullName: '', mobileNumber: '', emailAddress: '', terms: [] })
      window.setTimeout(() => setInvestorsLoungeOpen(false), 800)
    } catch (err) {
      setInvestorsLoungeError(err?.message || 'Failed to submit. Please try again.')
    } finally {
      setInvestorsLoungeSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <main>
        <Header variant="dark" /> 
        <section className="relative min-h-screen overflow-hidden"> 
          <div className="absolute inset-0">
            <video
              className="h-full w-full object-cover scale-105 transition-transform duration-[20s] hover:scale-100"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={heroVideo} type="video/mp4" />
            </video> 
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-emerald-900/70" />
             
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse delay-1000" />
          </div> 
          <div className="relative flex min-h-screen flex-col">
            <div className="flex flex-1 items-center justify-center">
              <div className="relative mx-auto max-w-7xl px-4 text-center"> 
                <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                  <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-400 mr-2" />
                  <span className="text-xs font-medium tracking-wider text-white/90">PREMIUM PROPERTY PARTNER</span>
                </div>
 
                <h1 className="animate-[fadeIn_0.8s_ease-out] text-4xl font-light tracking-tight text-white sm:text-4xl lg:text-6xl">
                  <span className="block font-bold">Explore the latest property deals with us in</span>
                  <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-white to-emerald-300 bg-clip-text text-transparent">
                  The United Kingdom and Great Britain
                  </span>
                </h1> 
                <p className="mx-auto mt-6 max-w-2xl animate-[fadeIn_1s_ease-out] text-lg text-white/80">
                England, Scotland, and Wales Plus Northern Ireland

                </p>
 
                <div className="mt-8" />
              </div>
            </div>
          </div>

          {isMailchimpOpen ? (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-label="Mailchimp signup"
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsMailchimpOpen(false)
              }}
              tabIndex={-1}
            >
              <button
                type="button"
                aria-label="Close"
                className="absolute inset-0 cursor-default bg-black/70"
                onClick={() => setIsMailchimpOpen(false)}
              />
              <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <div className="text-sm font-semibold text-slate-900">Join our mailing list</div>
                  <button
                    type="button"
                    onClick={() => setIsMailchimpOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
                    aria-label="Close popup"
                  >
                    ×
                  </button>
                </div>
                <div className="max-h-[75vh] overflow-auto p-5">
                  <p className="text-sm text-slate-600">
                    Enter your details below to join the Globcal Properties mailing list.
                  </p>

                  <form
                    action="https://globcalproperties.us8.list-manage.com/subscribe/post"
                    method="POST"
                    target="_blank"
                    noValidate
                    className="mt-4 grid gap-3"
                  >
                    <input type="hidden" name="u" value="fdd68430ee4c1e6cc83e6d304" />
                    <input type="hidden" name="id" value="35cf5cd1fd" />

                    <label className="grid gap-1 text-left">
                      <span className="text-xs font-semibold text-slate-700">Email address *</span>
                      <input
                        name="EMAIL"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        autoComplete="email"
                      />
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="grid gap-1 text-left">
                        <span className="text-xs font-semibold text-slate-700">First name</span>
                        <input
                          name="FNAME"
                          type="text"
                          placeholder="First name"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          autoComplete="given-name"
                        />
                      </label>
                      <label className="grid gap-1 text-left">
                        <span className="text-xs font-semibold text-slate-700">Last name</span>
                        <input
                          name="LNAME"
                          type="text"
                          placeholder="Last name"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          autoComplete="family-name"
                        />
                      </label>
                    </div>

                    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="submit"
                        className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Subscribe
                      </button>
                      <a
                        href="https://eepurl.com/jC9VmA"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
                      >
                        Open in new tab
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : null}
        </section> 
        <FeaturedOpportunity featured={featured} loading={loading} loadError={loadError} />
 
        <section className="relative overflow-hidden bg-white py-24"> 
          <div className="absolute inset-0">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-50 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-5xl px-4 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white/50 p-12 backdrop-blur-sm">
              <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                <div>
                  <h2 className="text-3xl font-light text-slate-900">
                    Join the{' '}
                    <span className="font-bold text-emerald-600">Investors Club</span>
                  </h2>
                  <p className="mt-2 text-slate-600">
                  Be the first to receive weekly updates: join the investors club. 
                  </p>
                </div>
                <Link
                  to="/getting-started"
                  className="group relative inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-white transition-all hover:bg-slate-800"
                >
                  <span className="font-medium">Get Started</span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/50 p-12 backdrop-blur-sm">
              <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                <div>
                  <h2 className="text-3xl font-light text-slate-900">
                    Register for our Armchair <span className="font-bold text-emerald-600">Investors Lounge</span>
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Perfect for cash rich, time poor, and a passive income approach appetite
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setInvestorsLoungeOpen(true)}
                  className="group relative inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-white transition-all hover:bg-slate-800"
                >
                  <span className="font-medium">Investors Lounge</span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
 
        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20"> 
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold tracking-wider text-emerald-700">PERSONALIZED SERVICE</span>
                </div>
                
                <h2 className="text-2xl font-light leading-tight text-slate-900 lg:text-3xl">
                Find the Right Investment Property

{' '}
                  <span className="font-bold text-emerald-600">Through Our Requirement Request Service</span>
                </h2>
                
                <p className="text-lg text-slate-600">
                For an interim fee we can start! Complete the form and tell us what you are looking for and where
                </p>

                <div className="grid grid-cols-2 gap-4 pt-6">
                  {['Residential', 'Commercial', 'HMO', 'SA', 'FLIP', 'BRRR'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-slate-700">
                      <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/getting-started"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-white transition-all hover:bg-emerald-700 hover:shadow-lg"
                >
                  Start Your Search
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div> 
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    id: 1,
                    title: 'Modern Apartment',
                    location: 'Manchester',
                    image: 'https://media.istockphoto.com/id/488120139/photo/modern-real-estate.jpg?s=612x612&w=0&k=20&c=88jk1VLSoYboMmLUx173sHs_XrZ9pH21as8lC7WINQs=',
                  },
                  {
                    id: 2,
                    title: 'City Retreat',
                    location: 'Leeds',
                    image: 'https://img.freepik.com/free-photo/side-view-front-doors-with-white-blue-wall_23-2149360616.jpg',
                  },
                  {
                    id: 3,
                    title: 'Cozy Townhouse',
                    location: 'Liverpool',
                    image: 'https://media.istockphoto.com/id/1616979010/photo/elegant-townhouses-london-england-uk-south-kensington.jpg?s=612x612&w=0&k=20&c=XMTyX7PIwn3kLIwBthpKoygNzJDzsIKMCtBeZFfNwIE=',
                  },
                  {
                    id: 4,
                    title: 'Suburban Home',
                    location: 'Birmingham',
                    image: 'https://images.unsplash.com/photo-1710883734889-5a0b8ab6bfcf?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dWslMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D',
                  },
                ].map((card) => (
                  <div
                    key={card.id}
                    className={`group relative aspect-square overflow-hidden rounded-2xl bg-slate-200 ${
                      card.id === 1 ? 'translate-y-4' : card.id === 4 ? '-translate-y-4' : ''
                    }`}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute bottom-4 left-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="text-sm font-medium">{card.title}</p>
                      <p className="text-xs opacity-80">{card.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section> 
        <section className="border-y border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              {[
                { label: 'Properties', end: 500, suffix: '+' },
                { label: 'Investors', end: 2500, suffix: '+' },
                { label: 'Cities', end: 25, suffix: '+' },
                { label: 'ROI', end: 12, suffix: '%' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className="text-3xl font-bold text-slate-900 lg:text-4xl">
                    <AnimatedNumber end={stat.end} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {investorsLoungeOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setInvestorsLoungeOpen(false)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="The Armchair Investors Lounge"
            className="w-full max-w-6xl overflow-hidden rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-white/10"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="text-lg font-bold tracking-tight text-emerald-500">The Armchair Investors Lounge</div>
              <button
                type="button"
                onClick={() => setInvestorsLoungeOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="grid gap-8 px-6 py-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <div className="min-w-0 space-y-6">
                <p className="text-sm leading-relaxed text-slate-200">
                  As an armchair investor, you take a completely hands-off approach, providing capital for property
                  investments without the burden of day-to-day operations.{' '}
                  <span className="text-emerald-500">
                    We source, develop, manage, and maintain each property, as well as handle all guest services and
                    professional tenants across a carefully selected portfolio.
                  </span>{' '}
                  This makes it an ideal solution for those seeking a truly passive income opportunity with minimal
                  involvement.
                </p>

                <div className="text-3xl font-light leading-tight text-white sm:text-4xl">
                  Start your armchair investors journey today. Let us do all the work while you reap the rewards.
                </div>
              </div>

              <form onSubmit={submitInvestorsLounge} className="space-y-4">
                <div className="space-y-3">
                  <input
                    value={investorsLoungeForm.fullName}
                    onChange={(e) => setInvestorsLoungeForm((s) => ({ ...s, fullName: e.target.value }))}
                    placeholder="Full Name"
                    className="w-full rounded-lg border border-emerald-400 bg-transparent px-4 py-3 text-white placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <input
                    value={investorsLoungeForm.mobileNumber}
                    onChange={(e) => setInvestorsLoungeForm((s) => ({ ...s, mobileNumber: e.target.value }))}
                    placeholder="Mobile Number"
                    className="w-full rounded-lg border border-emerald-400 bg-transparent px-4 py-3 text-white placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <input
                    value={investorsLoungeForm.emailAddress}
                    onChange={(e) => setInvestorsLoungeForm((s) => ({ ...s, emailAddress: e.target.value }))}
                    placeholder="Email Address"
                    className="w-full rounded-lg border border-emerald-400 bg-transparent px-4 py-3 text-white placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="pt-2">
                  <div className="text-sm font-semibold tracking-wide text-emerald-500">
                    SELECT THE BEST TERMS THAT DESCRIBES YOU
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      'Passive Approach',
                      'Time Poor - Cash Rich',
                      'Moderate Investor',
                      'Conservative Investor',
                      'Personal Investor',
                      'Institutional Investor',
                      'Family and Friends Investor',
                    ].map((label) => {
                      const checked = investorsLoungeForm.terms.includes(label)
                      return (
                        <label key={label} className="flex items-center gap-3 text-sm text-slate-100">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const next = e.target.checked
                                ? Array.from(new Set([...investorsLoungeForm.terms, label]))
                                : investorsLoungeForm.terms.filter((x) => x !== label)
                              setInvestorsLoungeForm((s) => ({ ...s, terms: next }))
                            }}
                            className="h-5 w-5 rounded border-emerald-400 bg-transparent text-emerald-500 focus:ring-emerald-500/30"
                          />
                          <span>{label}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {investorsLoungeError ? (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {investorsLoungeError}
                  </div>
                ) : null}
                {investorsLoungeSuccess ? (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                    Submitted successfully.
                  </div>
                ) : null}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={investorsLoungeSubmitting}
                    className="rounded-lg bg-teal-600 px-10 py-3 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:opacity-60"
                  >
                    {investorsLoungeSubmitting ? 'Submitting…' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  )
}