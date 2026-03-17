import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../api'
import { Footer } from '../components/Layout/Footer'
import { FeaturedOpportunity } from '../components/home/FeaturedOpportunity'
import { Header } from '../components/Layout/Header'
import heroVideo from '../assets/hero.mp4'

export function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

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
 
                <h1 className="animate-[fadeIn_0.8s_ease-out] text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-7xl">
                  <span className="block font-bold">Discover Your Next</span>
                  <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-white to-emerald-300 bg-clip-text text-transparent">
                    Investment Property
                  </span>
                </h1> 
                <p className="mx-auto mt-6 max-w-2xl animate-[fadeIn_1s_ease-out] text-lg text-white/80">
                  England, Scotland, Wales & Northern Ireland
                </p>
 
                
              </div>
            </div>
          </div>
        </section> 
        <FeaturedOpportunity featured={featured} loading={loading} loadError={loadError} />
 
        <section className="relative overflow-hidden bg-white py-24"> 
          <div className="absolute inset-0">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-50 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-5xl px-4">
            <div className="rounded-3xl border border-slate-200 bg-white/50 p-12 backdrop-blur-sm">
              <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                <div>
                  <h2 className="text-3xl font-light text-slate-900">
                    Join the{' '}
                    <span className="font-bold text-emerald-600">Investors Club</span>
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Be the first to receive weekly updates on new opportunities
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
                
                <h2 className="text-4xl font-light leading-tight text-slate-900 lg:text-5xl">
                  Find Your Perfect{' '}
                  <span className="font-bold text-emerald-600">Investment Property</span>
                </h2>
                
                <p className="text-lg text-slate-600">
                  Tell us what you're looking for, and we'll find properties that match your exact criteria.
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
                { label: 'Properties', value: '500+' },
                { label: 'Investors', value: '2.5k+' },
                { label: 'Cities', value: '25+' },
                { label: 'ROI', value: '12%' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className="text-3xl font-bold text-slate-900 lg:text-4xl">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}