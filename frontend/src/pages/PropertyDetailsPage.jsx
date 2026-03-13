import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as api from '../api'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'

function formatMoney(n) {
  if (n == null || Number.isNaN(Number(n))) return '—'
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(Number(n))
  } catch {
    return `£${Number(n).toLocaleString()}`
  }
}

function toTitleCase(str) {
  if (!str) return ''
  return String(str)
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function PropertyDetailsPage() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [inquiryError, setInquiryError] = useState(null)
  const [inquiryDraftId, setInquiryDraftId] = useState(null)
  const [showInquiryModal, setShowInquiryModal] = useState(false)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    api
      .getProperty(id)
      .then((data) => {
        if (!alive) return
        setProperty(data)
      })
      .catch((e) => {
        if (!alive) return
        setError(e?.message || 'Failed to load property')
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [id])

  const rawTitle = property?.title || 'Property opportunity'
  const rawLocation = property?.location || ''
  const title = toTitleCase(rawTitle)
  const location = toTitleCase(rawLocation)
  const images = property?.images || []
  const imgUrls = images.map((im) => im?.secureUrl || im?.url).filter(Boolean)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (imgUrls.length <= 1) return
    const t = setInterval(() => {
      setCurrentImageIndex((i) => (i + 1) % imgUrls.length)
    }, 1800)
    return () => clearInterval(t)
  }, [imgUrls.length])

  async function submitInquiry(e) {
    e.preventDefault()
    if (sending) return
    setInquiryError(null)
    setSent(false)
    setSending(true)
    try {
      await api.createInquiry({
        name: inquiryForm.name.trim(),
        email: inquiryForm.email.trim(),
        phone: inquiryForm.phone.trim(),
        budget: inquiryForm.budget.trim(),
        message: inquiryForm.message.trim(),
        source: 'property',
        propertyId: id,
        draftId: inquiryDraftId || undefined,
      })
      setSent(true)
      setInquiryForm({ name: '', email: '', phone: '', budget: '', message: '' })
      setInquiryDraftId(null)
    } catch (err) {
      setInquiryError(err?.data?.error || err?.message || 'Failed to submit inquiry')
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    const hasAny = Object.values(inquiryForm).some((v) => v && String(v).trim() !== '')
    if (!hasAny || !id || sent) return
    const t = setTimeout(() => {
      saveInquiryDraft()
    }, 2000)
    return () => clearTimeout(t)
  }, [inquiryForm, id]) 

  async function saveInquiryDraft() {
    const hasAny = Object.values(inquiryForm).some((v) => v && String(v).trim() !== '')
    if (!hasAny || sent) return
    const body = {
      name: inquiryForm.name || undefined,
      email: inquiryForm.email || undefined,
      phone: inquiryForm.phone || undefined,
      budget: inquiryForm.budget || undefined,
      message: inquiryForm.message || undefined,
      source: 'property',
      propertyId: id,
    }
    try {
      if (!inquiryDraftId) {
        const created = await api.createInquiryDraft(body)
        const draftId = created?.id || created?._id
        if (draftId) setInquiryDraftId(draftId)
      } else {
        await api.updateInquiryDraft(inquiryDraftId, body)
      }
    } catch { 
    }
  }

  return (
    <div className="min-h-screen bg-white text-teal-900">
      <Header variant="light" />

      <main> 
        <section className="mx-auto max-w-6xl px-4 py-10">
          {loading ? (
            <Card className="h-64 animate-pulse bg-slate-100" />
          ) : error ? (
            <Card className="p-6"> 
              <div className="text-sm font-semibold text-rose-700">{error}</div>
            </Card>
          ) : !property ? (
            <Card className="p-6">
              <div className="text-sm font-semibold text-teal-900">Property not found.</div>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
              <div className="min-w-0 space-y-4">
                <Card className="overflow-hidden bg-white">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
                    {imgUrls.length > 0 ? (
                      <img
                        src={imgUrls[currentImageIndex] || imgUrls[0]}
                        alt={title}
                        className="h-full w-full object-cover transition-opacity duration-300"
                        key={currentImageIndex}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                        Image coming soon
                      </div>
                    )}

                    {/* Status badge on image */}
                    <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-emerald-100 shadow-sm">
                      {property?.status || 'Available'}
                    </div>

                    {imgUrls.length > 1 && (
                      <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                        {imgUrls.map((_, i) => (
                          <span
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full ${
                              i === currentImageIndex ? 'bg-white ring-1 ring-slate-400' : 'bg-white/60'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Card>

                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                  <div className="min-w-0">
                    <div className="text-4xl font-semibold text-teal-900">{title}</div>
                    {location ? (
                      <div className="mt-2 flex items-center gap-1.5 text-lg font-medium text-teal-700">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-3 w-3"
                          >
                            <path
                              fill="currentColor"
                              d="M12 2.25A6.75 6.75 0 0 0 5.25 9c0 4.08 3.59 7.42 5.76 9.02.58.43 1.4.43 1.98 0C15.25 16.42 18.75 13.08 18.75 9A6.75 6.75 0 0 0 12 2.25Zm0 4.5A2.25 2.25 0 1 1 9.75 9 2.25 2.25 0 0 1 12 6.75Z"
                            />
                          </svg>
                        </span>
                        <span>{location}</span>
                      </div>
                    ) : null}
                  </div>
                  {property?.seller && (property.seller.id || property.seller._id) ? (
                    <Link
                      to={`/sellers/${property.seller.id || property.seller._id}`}
                      className="flex w-full items-center gap-3 rounded-xl   bg-white/80 p-3 transition md:w-auto md:justify-self-end"
                    >
                      {property.seller.imageUrl ? (
                        <img
                          src={property.seller.imageUrl}
                          alt=""
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-lg font-semibold text-teal-800">
                          {(property.seller.name || '?').charAt(0).toUpperCase()}
                        </div>
                      )} 
                    </Link>
                  ) : null}
                </div>

                {property?.details && property.details.trim() ? (
                  <div
                    className="property-details-html max-w-full overflow-hidden break-words text-teal-900 [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-semibold [&_p]:mb-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5 [&_a]:break-all [&_a]:text-teal-700 [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: property.details }}
                  />
                ) : null}
              </div>

              <div className="min-w-0 space-y-4">
                <Card className="border-teal-800/60 bg-[#d5efef] p-4">
                  <h2 className="text-lg font-bold text-teal-900">Key figures</h2>
                  <dl className="mt-3 grid grid-cols-1 gap-3 text-sm text-teal-900 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-medium text-teal-700">Monthly rent</dt>
                      <dd className="mt-1 font-semibold">{formatMoney(property.monthlyRent)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-teal-700">Investment amount</dt>
                      <dd className="mt-1 font-semibold">{formatMoney(property.investmentAmount)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-teal-700">Expected profit</dt>
                      <dd className="mt-1 font-semibold">{formatMoney(property.expectedProfit)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-teal-700">ROI</dt>
                      <dd className="mt-1 font-semibold">
                        {property?.roi != null ? `${Number(property.roi).toFixed(0)}%` : '—'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-teal-700">Status</dt>
                      <dd className="mt-1 font-semibold">{property?.status || 'Available'}</dd>
                    </div>
                  </dl>
                </Card>

                <Card className="p-4">
                  <h2 className="text-sm font-bold text-teal-900">Property details</h2>
                  <dl className="mt-2 grid grid-cols-1 gap-3 text-xs text-teal-900 sm:grid-cols-2">
                    <div>
                      <dt className="font-medium text-teal-700">Property ID</dt>
                      <dd className="mt-1 break-all">{property?.id || property?._id || '—'}</dd>
                    </div>
                    {property?.createdAt ? (
                      <div>
                        <dt className="font-medium text-teal-700">Created at</dt>
                        <dd className="mt-1">{new Date(property.createdAt).toLocaleString()}</dd>
                      </div>
                    ) : null}
                    {property?.updatedAt ? (
                      <div>
                        <dt className="font-medium text-teal-700">Updated at</dt>
                        <dd className="mt-1">{new Date(property.updatedAt).toLocaleString()}</dd>
                      </div>
                    ) : null}
                  </dl>
                </Card>

                {property?.tenancyDetails ? (
                  <Card className="p-4">
                    <h2 className="text-lg font-bold text-teal-900">Tenancy details</h2>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-teal-900">
                      {property.tenancyDetails}
                    </p>
                  </Card>
                ) : null} 
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      className="bg-teal-800 px-5 py-2 text-sm text-white hover:bg-teal-900"
                      onClick={() => setShowInquiryModal(true)}
                    >
                      I am interested
                    </Button>
                  </div> 
              </div>
            </div>
          )}
        </section>
      </main>

      {showInquiryModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg">
            <Card className="p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-teal-900">Interested in this deal?</h2>
                  <p className="mt-1 text-sm text-teal-800">
                    Complete this short form and we’ll follow up with you about this specific property.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInquiryModal(false)}
                  className="text-sm font-medium text-slate-500 hover:text-slate-800"
                >
                  ✕
                </button>
              </div>

              <form
                className="grid gap-3"
                onSubmit={(e) => {
                  submitInquiry(e)
                }}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Full name"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
                  <Input
                    label="Phone"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                  <Input
                    label="Budget (optional)"
                    value={inquiryForm.budget}
                    onChange={(e) => setInquiryForm((f) => ({ ...f, budget: e.target.value }))}
                  />
                </div>
                <Textarea
                  label="Message (optional)"
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm((f) => ({ ...f, message: e.target.value }))}
                  rows={3}
                />

                {inquiryError ? <div className="text-sm font-semibold text-rose-700">{inquiryError}</div> : null}
                {sent ? (
                  <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
                    Thank you. We’ve received your inquiry for this property.
                  </div>
                ) : null}

                <div className="mt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-sm"
                    onClick={() => setShowInquiryModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-teal-800 px-5 py-2 text-sm text-white hover:bg-teal-900"
                    disabled={sending}
                  >
                    {sending ? 'Sending…' : 'Submit inquiry'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  )
}