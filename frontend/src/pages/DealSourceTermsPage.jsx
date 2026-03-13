import { Header } from '../components/Layout/Header'
import { Footer } from '../components/Layout/Footer'

export function DealSourceTermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
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
                <span className="text-xs font-medium tracking-wider text-white/90">LEGAL</span>
              </div>
              <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">
                <span className="block font-bold">Deal Sourcing Terms</span>
                <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-white to-emerald-300 bg-clip-text text-transparent">
                  Important information for investors
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-base text-white/80">
                These terms set out the basis on which we introduce and package property investment opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Deal Sourcing Terms</h2>
            <p className="mt-2 text-sm text-slate-600">
              These Deal Sourcing Terms set out the basis on which we introduce and package property investment
              opportunities for you as an investor.
            </p>
          </div>

          <section className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700">
          <div>
            <h3 className="text-base font-bold text-slate-900">1. Our role</h3>
            <p className="mt-2">
              We act as a deal sourcer and introducer. We are not providing financial, tax, or legal advice. You remain
              responsible for taking your own independent professional advice on any opportunity we present.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">2. Fees and payments</h3>
            <p className="mt-2">
              Our sourcing fees, interim payments, and balance payments will be communicated to you in writing for each
              deal. Any interim or reservation fee is payable upon acceptance of a deal and is subject to any cooling‑off
              or refund terms agreed with you.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">3. Due diligence</h3>
            <p className="mt-2">
              We carry out our own checks and due diligence on the opportunities we source. However, you should not rely
              solely on our checks and must complete your own due diligence before committing to any purchase or
              investment.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">4. No guarantee of returns</h3>
            <p className="mt-2">
              Any figures, yields, or return on investment projections we provide are estimates only and are not
              guaranteed. Property values and rental incomes can go down as well as up.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">5. Cooling‑off and refunds</h3>
            <p className="mt-2">
              Where a cooling‑off period or refund eligibility applies, this will be clearly set out in the deal pack or
              confirmation email. Refunds are only available within the stated timeframes and subject to the conditions
              described there.
            </p>
          </div>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  )
}

