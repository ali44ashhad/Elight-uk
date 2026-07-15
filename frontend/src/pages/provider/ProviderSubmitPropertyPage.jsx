import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../../components/Layout/Header'
import { Footer } from '../../components/Layout/Footer'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { RichTextEditor } from '../../components/ui/RichTextEditor'
import { Textarea } from '../../components/ui/Textarea'
import { Button } from '../../components/ui/Button'
import { useUserAuth } from '../../contexts/UserAuthContext'
import * as api from '../../api'

export function ProviderSubmitPropertyPage() {
  const { isAuthenticated, loading, user } = useUserAuth()
  const nav = useNavigate()

  const HIGHLIGHT_OPTIONS = [
    '🏡 R2SA',
    '🏡 Residential',
    '🏢 Commercial',
    '🏠 HMO',
    '🛏 Studio',
    '🛏 1 bed',
    '🛏 2 bed',
    '🛏 3 bed',
    '🛏 4+ bed',
    '🛁 1 bathroom',
    '🛁 2 bathroom',
    '🛗 Lift',
    '🚗 Parking',
    '🌳 Garden',
    '🏙 City centre',
    '🚇 Near station',
  ]
  const MAX_IMAGES = 10

  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [monthlyRent, setMonthlyRent] = useState('')
  const [billsAmount, setBillsAmount] = useState('')
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [expectedProfit, setExpectedProfit] = useState('')
  const [roi, setRoi] = useState('')
  const [tenancyDetails, setTenancyDetails] = useState('')
  const [highlights, setHighlights] = useState([])
  const [customHighlight, setCustomHighlight] = useState('')
  const [details, setDetails] = useState('')

  const [files, setFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) nav('/login?redirect=/provider/properties/new', { replace: true })
  }, [loading, isAuthenticated, nav])

  // Keep blob URLs tidy if user navigates away.
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (typeof url === 'string' && url.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(url)
          } catch {}
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleFilesChange(e) {
    const picked = Array.from(e.target.files || []).filter((f) => f && f.type?.startsWith('image/'))
    if (picked.length === 0) return

    setError(null)

    setFiles((curr) => {
      const existing = Array.isArray(curr) ? curr : []
      const existingKeys = new Set(existing.map((f) => `${f.name}:${f.size}:${f.lastModified}`))
      const uniquePicked = picked.filter((f) => !existingKeys.has(`${f.name}:${f.size}:${f.lastModified}`))

      const next = [...existing, ...uniquePicked].slice(0, MAX_IMAGES)
      if (existing.length + uniquePicked.length > MAX_IMAGES) {
        setError(`You can upload maximum ${MAX_IMAGES} images.`)
      }
      return next
    })

    setPreviewUrls((curr) => {
      const existing = Array.isArray(curr) ? curr : []
      const nextUrls = [...existing]
      for (const f of picked) {
        // We'll create URLs for all picks; if file ends up deduped/truncated, we'll reconcile below.
        nextUrls.push(URL.createObjectURL(f))
      }
      return nextUrls.slice(0, MAX_IMAGES)
    })

    // allow picking the same file again later
    e.target.value = ''
  }

  function removeImageAt(index) {
    setFiles((curr) => {
      const arr = Array.isArray(curr) ? curr : []
      return arr.filter((_, i) => i !== index)
    })
    setPreviewUrls((curr) => {
      const arr = Array.isArray(curr) ? curr : []
      const url = arr[index]
      if (typeof url === 'string' && url.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(url)
        } catch {}
      }
      return arr.filter((_, i) => i !== index)
    })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setOk(false)
    try {
      const body = {
        title,
        location,
        monthlyRent: Number(monthlyRent),
        investmentAmount: Number(investmentAmount),
        details,
        highlights,
      }
      if (billsAmount.trim()) body.billsAmount = Number(billsAmount)
      if (expectedProfit.trim()) body.expectedProfit = Number(expectedProfit)
      if (roi.trim()) body.roi = Number(roi)
      if (tenancyDetails.trim()) body.tenancyDetails = tenancyDetails.trim()

      const created = await api.providerCreateProperty(body)
      const propertyId = created?.id || created?._id

      if (propertyId && files.length > 0) {
        const fd = new FormData()
        files.forEach((f) => fd.append('images', f))
        await api.providerUploadPropertyImages(propertyId, fd)
      }
      setOk(true)
      nav('/provider/properties', { replace: true })
    } catch (e2) {
      setError(e2?.message || 'Failed to submit')
    } finally {
      setBusy(false)
    }
  }

  const providerStatus = user?.providerStatus || 'none'

  return (
    <div className="min-h-screen bg-white text-teal-900">
      <Header variant="light" />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-teal-900">Create property</h1>
            <p className="mt-1 text-sm text-teal-700">
              Fill the details below, then optionally upload images (1–10). This will be reviewed by admin before it
              becomes public.
            </p>
          </div>
          <Button as={Link} to="/provider/properties" variant="secondary">
            Back
          </Button>
        </div>

        {providerStatus !== 'approved' ? (
          <Card className="p-6">
            <div className="text-sm font-bold text-rose-700">Provider not approved.</div>
            <p className="mt-1 text-sm text-teal-700">
              Go to <Link className="font-semibold text-teal-700 hover:underline" to="/account">My account</Link>.
            </p>
          </Card>
        ) : (
          <Card className="p-6">
            {error ? (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
                {error}
              </div>
            ) : ok ? (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                Submitted.
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Monthly rent"
                  type="number"
                  min="0"
                  step="1"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  required
                />
                <Input
                  label="Bills (optional)"
                  type="number"
                  min="0"
                  step="1"
                  value={billsAmount}
                  onChange={(e) => setBillsAmount(e.target.value)}
                  placeholder="e.g. 350"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Investment amount"
                  type="number"
                  min="0"
                  step="1"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  required
                />
                <Input
                  label="Expected profit (optional)"
                  type="number"
                  value={expectedProfit}
                  onChange={(e) => setExpectedProfit(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="ROI % (optional)" type="number" value={roi} onChange={(e) => setRoi(e.target.value)} />
              </div>

              <Textarea
                label="Tenancy details (optional)"
                value={tenancyDetails}
                onChange={(e) => setTenancyDetails(e.target.value)}
              />

              <div className="space-y-2">
                <div className="text-sm font-medium text-slate-800">Highlights (optional)</div>
                <div className="flex flex-wrap gap-2">
                  {HIGHLIGHT_OPTIONS.map((opt) => {
                    const selected = Array.isArray(highlights) && highlights.includes(opt)
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setHighlights((curr) => {
                            const c = Array.isArray(curr) ? curr : []
                            const next = selected ? c.filter((x) => x !== opt) : [...c, opt]
                            return next.slice(0, 10)
                          })
                        }}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
                          selected
                            ? 'bg-emerald-600 text-white ring-emerald-600'
                            : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>

                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <Input
                    label="Add custom highlight"
                    value={customHighlight}
                    onChange={(e) => setCustomHighlight(e.target.value)}
                    placeholder="e.g. 🧾 Bills included"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="sm:mt-6"
                    onClick={() => {
                      const raw = String(customHighlight || '').trim()
                      if (!raw) return
                      setHighlights((curr) => {
                        const c = Array.isArray(curr) ? curr : []
                        if (c.includes(raw)) return c
                        return [...c, raw].slice(0, 10)
                      })
                      setCustomHighlight('')
                    }}
                  >
                    Add
                  </Button>
                </div>

                {highlights.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {highlights.slice(0, 10).map((h) => (
                      <span key={h} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {h}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="text-xs text-slate-500">You can select multiple (max 10).</div>
              </div>

              <RichTextEditor
                label="Details (optional)"
                placeholder="Describe the property, features, area info, etc."
                value={details}
                onChange={(html) => setDetails(html)}
              />

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-800">Images (1–10, optional)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFilesChange}
                  className="text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
                />
                {files.length > 0 ? (
                  <p className="mt-1 text-xs text-slate-500">
                    {files.length} image{files.length !== 1 ? 's' : ''} selected (max {MAX_IMAGES})
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    Select 1–10 images. You can add more later while the submission is pending.
                  </p>
                )}
                {previewUrls.length > 0 ? (
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                    {previewUrls.map((url, idx) => (
                      <div
                        key={url || idx}
                        className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                      >
                        <img src={url} alt={`Preview ${idx + 1}`} className="h-20 w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImageAt(idx)}
                          className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-sm font-bold text-white opacity-100 transition hover:bg-black/75 sm:opacity-0 sm:group-hover:opacity-100"
                          aria-label="Remove image"
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </label>

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">On success this will be submitted for admin approval.</p>
                <Button type="submit" disabled={busy}>
                  {busy ? 'Submitting…' : 'Create property'}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  )
}

