import { useState } from 'react'
import * as api from '../api'
import { Header } from '../components/Layout/Header'
import { Footer } from '../components/Layout/Footer'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const PROPERTY_TYPES = [
  'Buy To Let Single',
  'Buy To Let HMO',
  'Buy To Let SA',
  'Flip Single',
  'BRRR',
  'Rent 2 Rent SA',
  'Rent 2 Rent HMO',
]

const PROPERTY_STYLES = ['Studio', 'Detached', 'Semi Detached', 'Terrace', 'Apartment', 'Maisonette']

export function GettingStartedPage() {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [form, setForm] = useState({
    propertyType: '',
    propertyStyles: [],
    bedrooms: '',
    reason: '',
    region: '',
    district: '',
    ward: '',
    fullName: '',
    email: '',
    mobile: '',
    telephone: '',
    budget: '',
    correspondenceAddress: '',
    postcode: '',
    acceptTerms: false,
  })

  function toggleStyle(style) {
    setForm((prev) => {
      const has = prev.propertyStyles.includes(style)
      return {
        ...prev,
        propertyStyles: has ? prev.propertyStyles.filter((s) => s !== style) : [...prev.propertyStyles, style],
      }
    })
  }

  function canGoNextFromStep1() {
    return !!form.propertyType
  }

  function canGoNextFromStep2() {
    return !!form.bedrooms && !!form.region
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.propertyType || !form.fullName || !form.email || !form.acceptTerms) {
      setSubmitError('Please complete all required fields and accept the terms.')
      setStep(3)
      return
    }
    setSubmitError(null)
    setSubmitSuccess(false)
    setSubmitting(true)
    try {
      await api.createGeneralQuery({
        propertyType: form.propertyType,
        propertyStyles: form.propertyStyles,
        bedrooms: form.bedrooms,
        reason: form.reason,
        region: form.region,
        district: form.district,
        ward: form.ward,
        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        telephone: form.telephone,
        budget: form.budget,
        correspondenceAddress: form.correspondenceAddress,
        postcode: form.postcode,
      })
      setSubmitSuccess(true)
      setForm({
        propertyType: '',
        propertyStyles: [],
        bedrooms: '',
        reason: '',
        region: '',
        district: '',
        ward: '',
        fullName: '',
        email: '',
        mobile: '',
        telephone: '',
        budget: '',
        correspondenceAddress: '',
        postcode: '',
        acceptTerms: false,
      })
      setStep(1)
    } catch (err) {
      setSubmitError(err?.data?.error || err?.message || 'Failed to submit request')
    } finally {
      setSubmitting(false)
    }
  }

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
                <span className="text-xs font-medium tracking-wider text-white/90">Find the Right Property</span>
              </div>
              <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">
                <span className="block font-bold">Investment Property Requirement</span>
                <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-white to-emerald-300 bg-clip-text text-transparent">
                  Request Form (IPRR)
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-base text-white/80">
                Tell us what kind of investment property you are looking for.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <header className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-xl font-black leading-snug text-slate-900 sm:text-2xl">
                  Investment Property Requirement Request - IPRR
                </h2>
                <p className="text-xs font-medium text-slate-600">Please select up to 2 options</p>
              </div>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="mt-6 space-y-8 text-[13px]">
            {/* Step 1: Property type */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Step 1 — Property type</h3>
                <p className="text-xs text-slate-600">Choose one property strategy that best matches your needs.</p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {PROPERTY_TYPES.map((type) => {
                    const selected = form.propertyType === type
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, propertyType: type }))}
                        className={`text-left transition ${
                          selected
                            ? 'ring-2 ring-emerald-600'
                            : 'ring-1 ring-slate-200 hover:ring-emerald-400/80'
                        } rounded-2xl`}
                      >
                        <Card className="h-full border-none bg-white shadow-sm">
                          <div className="flex items-start gap-2 p-3">
                            <span
                              className={`mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] ${
                                selected
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : 'border-slate-300 text-transparent'
                              }`}
                            >
                              ✓
                            </span>
                            <div>
                              <div className="text-sm font-bold text-slate-900">{type}</div>
                            </div>
                          </div>
                        </Card>
                      </button>
                    )
                  })}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    className="rounded-full bg-slate-900 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-slate-800"
                    disabled={!canGoNextFromStep1()}
                    onClick={() => setStep(2)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Styles, bedrooms, region */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Step 2 — Property details</h3>
                    <p className="text-xs text-slate-600">
                      Select one or more styles, then tell us where and how many bedrooms you need.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="rounded-full px-4 py-1.5 text-xs"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      className="rounded-full bg-slate-900 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-slate-800"
                      disabled={!canGoNextFromStep2()}
                      onClick={() => setStep(3)}
                    >
                      Next
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,1.3fr)]">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                        Property styles (multi‑select)
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {PROPERTY_STYLES.map((style) => {
                          const active = form.propertyStyles.includes(style)
                          return (
                            <button
                              key={style}
                              type="button"
                              onClick={() => toggleStyle(style)}
                              className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition ${
                                active
                                  ? 'bg-emerald-600 text-white ring-emerald-600'
                                  : 'bg-white text-slate-800 ring-slate-200 hover:bg-emerald-50'
                              }`}
                            >
                              {style}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                          Bedrooms required
                        </label>
                        <input
                          type="text"
                          value={form.bedrooms}
                          onChange={(e) => setForm((prev) => ({ ...prev, bedrooms: e.target.value }))}
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                          Reason / notes
                        </label>
                        <textarea
                          rows={3}
                          value={form.reason}
                          onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
                          className="mt-1 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-700">Region</label>
                      <input
                        type="text"
                        value={form.region}
                        onChange={(e) => setForm((prev) => ({ ...prev, region: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                        District / Borough
                      </label>
                      <input
                        type="text"
                        value={form.district}
                        onChange={(e) => setForm((prev) => ({ ...prev, district: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-700">Ward</label>
                      <input
                        type="text"
                        value={form.ward}
                        onChange={(e) => setForm((prev) => ({ ...prev, ward: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contact & budget */}
            {step === 3 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Step 3 — Your contact details</h3>
                    <p className="text-xs text-slate-600">
                      We&apos;ll use these to follow up with suitable opportunities.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-full px-4 py-1.5 text-xs"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                </div>

                <div className="grid gap-3">
                <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.2fr)]">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Mobile</label>
                    <input
                      type="text"
                      value={form.mobile}
                      onChange={(e) => setForm((prev) => ({ ...prev, mobile: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white"
                    />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-end">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Telephone</label>
                    <input
                      type="text"
                      value={form.telephone}
                      onChange={(e) => setForm((prev) => ({ ...prev, telephone: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">What is the budget for the project</label>
                    <div className="mt-1 flex items-center gap-1">
                      <span className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900 shadow-sm">
                        £
                      </span>
                      <input
                        type="number"
                        value={form.budget}
                        onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Correspondence Address</label>
                  <textarea
                    rows={3}
                    value={form.correspondenceAddress}
                    onChange={(e) => setForm((prev) => ({ ...prev, correspondenceAddress: e.target.value }))}
                    className="mt-1 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white"
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-[minmax(0,3fr)_minmax(0,1.2fr)] md:items-end">
                  <div />
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Postcode</label>
                    <input
                      type="text"
                      value={form.postcode}
                      onChange={(e) => setForm((prev) => ({ ...prev, postcode: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white"
                    />
                  </div>
                </div>
                </div>
              </section>
            )}

            <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-4 text-[11px] sm:flex-row sm:items-center">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={form.acceptTerms}
                  onChange={(e) => setForm((prev) => ({ ...prev, acceptTerms: e.target.checked }))}
                  className="mt-0.5 h-3.5 w-3.5 border-slate-300 text-emerald-600 focus:ring-emerald-600"
                />
                <span className="max-w-xl leading-snug text-slate-700">
                I acknowledge that upon submitting this completed request form, an interim holding fee of £597 becomes payable upon acceptance of the IPRR. The remaining balance for deal sourcing will become payable prior to delivery of the deal, following a 14-day cooling-off period. All services are provided in accordance with the standard Deal Sourcing Terms and Conditions. 
                </span>
              </label>

              <div className="flex flex-col items-end gap-2">
                {submitError ? (
                  <div className="max-w-xs rounded-md bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700">
                    {submitError}
                  </div>
                ) : null}
                {submitSuccess ? (
                  <div className="max-w-xs rounded-md bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-800">
                    Thank you. We&apos;ve received your requirement.
                  </div>
                ) : null}
                <Button
                  type="submit"
                  disabled={submitting || !form.acceptTerms}
                  className="rounded-full bg-slate-900 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {submitting ? 'Submitting…' : 'Submit'}
                </Button>
              </div>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  )
}