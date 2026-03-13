import { Footer } from '../components/Layout/Footer'
import { Header } from '../components/Layout/Header'

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <Header variant="dark" />
      {/* Hero (same vibe as homepage) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-emerald-900/75" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse delay-1000" />

        <div className="relative">
          <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:pb-20 sm:pt-12">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                <span className="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-xs font-medium tracking-wider text-white/90">ABOUT GLOBAL DEAL SOURCING</span>
              </div>
              <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">
                <span className="block font-bold">Managing Director’s Message</span>
                <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-white to-emerald-300 bg-clip-text text-transparent">
                  Our mission is simple.
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-base text-white/80">
                UK property investment opportunities — carefully analysed, transparent, and investment ready.
              </p>
            </div>
          </div>
        </div>
      </section> 
      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* Managing Director's Message */}
        <section className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
          <div className="min-h-[220px] rounded-2xl border border-slate-200 bg-white shadow-sm" />
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Managing Director’s Message</h2>
            <p className="mt-3 text-[17px] leading-relaxed text-slate-700">
              Globcal Deal Sourcing is probably one of the fastest growing and most reputable commercial and residential
              deal sourcing firms in the United Kingdom. Our highly skilled deal-sourcing team specialise in identifying
              and delivering high quality property investment opportunities, from Buy To Let, HMO and Serviced
              Accommodation properties to Buy, Refurbish, Rent (BRRR) developments.
            </p>
            <p className="mt-3 text-[17px] leading-relaxed text-slate-700">
              As experienced deal sourcers, we understand how unpredictable and competitive the UK property market can be.
              That’s why we continually work to stay ahead of market trends, maintain strong industry relationships, and
              uncover off-market and high-yield opportunities before they reach the open market.
            </p>
           
          </div>
          
        </section>
        <p className="mt-8 text-[17px] font-semibold text-slate-900">Our mission is simple.</p>
        <p className="mt-3 text-[17px] leading-relaxed text-slate-700">
              Our mission is simple: to provide investors with carefully analysed, high value, and stress-free property
              deals that align with their investment goals. From initial sourcing and due diligence to negotiation support,
              we ensure every deal we present is fully packaged, transparent, and investment ready.
            </p>
           
        {/* Our Team Members */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-900">Our Team Members</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            <div className="min-h-[160px] rounded-2xl border border-slate-200 bg-white shadow-sm" />
            <div className="min-h-[160px] rounded-2xl border border-slate-200 bg-white shadow-sm" />
            <div className="min-h-[160px] rounded-2xl border border-slate-200 bg-white shadow-sm" />
          </div>
        </section>

        {/* Buying and Renting Deal Services */}
        <section className="mt-12">
          <h2 className="text-4xl text-center font-black tracking-tight text-slate-900">Buying and Renting Deal Services</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3 text-[13px] leading-relaxed">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg text-center font-bold text-slate-900">Deal Ready Options</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-700">
                We deliver fully prepared, deal‑ready investment opportunities that offer a workable ROI. Every property
                we source undergoes thorough analysis, due diligence, and risk assessment to ensure it offers strong,
                reliable value.
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-700">
                From the initial identification of an opportunity right through to negotiation support, we provide fully
                packaged, transparent, and investment‑ready deals. This allows our clients to move quickly and
                confidently, knowing every essential detail has already been professionally handled.
              </p>
            </div> 
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg text-center font-bold text-slate-900">Deal Request</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-700">
                As part of our mission, we can source the type of property investment you are looking for that gives you
                the results you require. Every opportunity we source is rigorously analysed, fully packaged, and designed
                to maximise returns while minimising stress.
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-700">
                We do the heavy lifting: sourcing high‑yield opportunities, completing our side of the due diligence,
                verifying the numbers, and preparing every essential detail before it reaches your inbox.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg text-center font-bold text-slate-900">Deal Joint Venture</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-700">
                Join our Joint Venture project designed for investors seeking high‑return, low‑stress property
                opportunities. We combine capital from our investment partners with our expertise in sourcing, managing,
                and delivering profitable developments.
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-700">
                Together, we share risk, rewards, and long‑term growth potential through professionally packaged,
                deal‑ready projects engineered for strong financial performance.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}