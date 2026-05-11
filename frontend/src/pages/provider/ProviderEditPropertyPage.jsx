import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Header } from '../../components/Layout/Header'
import { Footer } from '../../components/Layout/Footer'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { RichTextEditor } from '../../components/ui/RichTextEditor'
import { Textarea } from '../../components/ui/Textarea'
import { Button } from '../../components/ui/Button'
import { useUserAuth } from '../../contexts/UserAuthContext'
import * as api from '../../api'

export function ProviderEditPropertyPage() {
  const { id } = useParams()
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

  const [initialLoading, setInitialLoading] = useState(true)
  const [property, setProperty] = useState(null)

  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [monthlyRent, setMonthlyRent] = useState('')
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [expectedProfit, setExpectedProfit] = useState('')
  const [roi, setRoi] = useState('')
  const [tenancyDetails, setTenancyDetails] = useState('')
  const [highlights, setHighlights] = useState([])
  const [customHighlight, setCustomHighlight] = useState('')
  const [details, setDetails] = useState('')

  const [newFiles, setNewFiles] = useState([])
  const [newPreviewUrls, setNewPreviewUrls] = useState([])

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [deletingImageId, setDeletingImageId] = useState(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) nav(`/login?redirect=/provider/properties/${id}/edit`, { replace: true })
  }, [loading, isAuthenticated, nav, id])

  useEffect(() => {
    if (!isAuthenticated || !id) return
    setInitialLoading(true)
    setError(null)
    api
      .providerGetMyProperty(id)
      .then((p) => {
        setProperty(p || null)
        setTitle(p?.title || '')
        setLocation(p?.location || '')
        setMonthlyRent(p?.monthlyRent != null ? String(p.monthlyRent) : '')
        setInvestmentAmount(p?.investmentAmount != null ? String(p.investmentAmount) : '')
        setExpectedProfit(p?.expectedProfit != null ? String(p.expectedProfit) : '')
        setRoi(p?.roi != null ? String(p.roi) : '')
        setTenancyDetails(p?.tenancyDetails || '')
        setHighlights(Array.isArray(p?.highlights) ? p.highlights.filter(Boolean).slice(0, 10) : [])
        setDetails(p?.details || '')
      })
      .catch((e) => setError(e?.message || 'Failed to load property'))
      .finally(() => setInitialLoading(false))
  }, [isAuthenticated, id])

  const providerStatus = user?.providerStatus || 'none'
  const moderationStatus = property?.moderationStatus || 'pending'

  const existingImgUrls = useMemo(() => {
    const images = property?.images || []
    return images.map((im) => im?.secureUrl || im?.url).filter(Boolean)
  }, [property])

  const existingImages = useMemo(() => {
    const images = property?.images || []
    return Array.isArray(images) ? images : []
  }, [property])

  useEffect(() => {
    return () => {
      newPreviewUrls.forEach((url) => {
        if (typeof url === 'string' && url.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(url)
          } catch {}
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleNewFilesChange(e) {
    const picked = Array.from(e.target.files || []).filter((f) => f && f.type?.startsWith('image/'))
    if (picked.length === 0) return
    setError(null)

    setNewFiles((curr) => {
      const existing = Array.isArray(curr) ? curr : []
      const existingKeys = new Set(existing.map((f) => `${f.name}:${f.size}:${f.lastModified}`))
      const uniquePicked = picked.filter((f) => !existingKeys.has(`${f.name}:${f.size}:${f.lastModified}`))
      const remainingSlots = Math.max(0, MAX_IMAGES - existingImgUrls.length)
      const next = [...existing, ...uniquePicked].slice(0, remainingSlots)
      if (existing.length + uniquePicked.length > remainingSlots) {
        setError(`You can upload maximum ${MAX_IMAGES} images total. Remove some before adding more.`)
      }
      return next
    })

    setNewPreviewUrls((curr) => {
      const existing = Array.isArray(curr) ? curr : []
      const remainingSlots = Math.max(0, MAX_IMAGES - existingImgUrls.length)
      const next = [...existing, ...picked.map((f) => URL.createObjectURL(f))].slice(0, remainingSlots)
      return next
    })

    e.target.value = ''
  }

  function removeNewImageAt(index) {
    setNewFiles((curr) => {
      const arr = Array.isArray(curr) ? curr : []
      return arr.filter((_, i) => i !== index)
    })
    setNewPreviewUrls((curr) => {
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
    if (!id) return

    setBusy(true)
    setError(null)
    try {
      const body = {
        title,
        location,
        monthlyRent: Number(monthlyRent),
        investmentAmount: Number(investmentAmount),
        details,
        highlights,
      }
      if (expectedProfit.trim()) body.expectedProfit = Number(expectedProfit)
      if (roi.trim()) body.roi = Number(roi)
      if (tenancyDetails.trim()) body.tenancyDetails = tenancyDetails.trim()

      await api.providerUpdateProperty(id, body)

      if (newFiles.length > 0) {
        const fd = new FormData()
        newFiles.forEach((f) => fd.append('images', f))
        await api.providerUploadPropertyImages(id, fd)
      }

      nav(`/provider/properties/${id}`, { replace: true })
    } catch (e2) {
      setError(e2?.message || 'Failed to update')
    } finally {
      setBusy(false)
    }
  }

  const locked = providerStatus !== 'approved'
  const editingNote =
    moderationStatus === 'rejected'
      ? 'After you save, this will be resubmitted for admin approval.'
      : moderationStatus === 'approved'
        ? 'After you save, changes will go live immediately.'
        : 'After you save, this will update your current submission.'

  return (
    <div className="min-h-screen bg-white text-teal-900">
      <Header variant="light" />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-teal-900">Edit property</h1>
            <p className="mt-1 text-sm text-teal-700">{editingNote}</p>
          </div>
          <Button as={Link} to={`/provider/properties/${id}`} variant="secondary">
            Back
          </Button>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        ) : null}

        {initialLoading ? (
          <Card className="h-56 animate-pulse bg-slate-100" />
        ) : !property ? (
          <Card className="p-6 text-sm text-teal-700">Property not found.</Card>
        ) : locked ? (
          <Card className="p-6">
            <div className="text-sm font-bold text-rose-700">Editing is not available.</div>
            <p className="mt-1 text-sm text-teal-700">
              Status: <span className="font-semibold">{moderationStatus}</span>
            </p>
          </Card>
        ) : (
          <Card className="p-6">
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
                  label="Investment amount"
                  type="number"
                  min="0"
                  step="1"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Expected profit (optional)"
                  type="number"
                  value={expectedProfit}
                  onChange={(e) => setExpectedProfit(e.target.value)}
                />
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
              </div>

              <RichTextEditor
                label="Details (optional)"
                placeholder="Describe the property, features, area info, etc."
                value={details}
                onChange={(html) => setDetails(html)}
              />

              <div className="space-y-2">
                <div className="text-sm font-medium text-slate-800">Existing images</div>
                {existingImgUrls.length === 0 ? (
                  <div className="text-xs text-slate-500">No images yet.</div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                    {existingImages.slice(0, 10).map((im, idx) => {
                      const u = im?.secureUrl || im?.url
                      const imageId = im?._id || im?.id
                      const isDeleting = deletingImageId && imageId && deletingImageId === String(imageId)
                      return (
                        <div
                          key={String(imageId || u || idx)}
                          className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                        >
                          {u ? <img src={u} alt="" className="h-20 w-full object-cover" /> : null}
                          <button
                            type="button"
                            disabled={!imageId || isDeleting || busy}
                            onClick={async () => {
                              if (!imageId || !id) return
                              setDeletingImageId(String(imageId))
                              setError(null)
                              try {
                                await api.providerDeletePropertyImage(id, String(imageId))
                                const fresh = await api.providerGetMyProperty(id)
                                setProperty(fresh || null)
                              } catch (e) {
                                setError(e?.message || 'Failed to remove image')
                              } finally {
                                setDeletingImageId(null)
                              }
                            }}
                            title={isDeleting ? 'Deleting…' : 'Remove image'}
                            aria-label="Remove existing image"
                            className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-sm font-black text-white opacity-100 shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300 sm:opacity-0 sm:group-hover:opacity-100"
                          >
                            {isDeleting ? '…' : '×'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
                <div className="text-xs text-slate-500">
                  You can add more images (max {MAX_IMAGES} total). Use the × button to remove existing images.
                </div>
              </div>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-800">Add new images (optional)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleNewFilesChange}
                  className="text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
                />
                {newPreviewUrls.length > 0 ? (
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                    {newPreviewUrls.map((url, idx) => (
                      <div
                        key={url || idx}
                        className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                      >
                        <img src={url} alt={`Preview ${idx + 1}`} className="h-20 w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeNewImageAt(idx)}
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
                <p className="text-xs text-slate-500">{editingNote}</p>
                <Button type="submit" disabled={busy}>
                  {busy ? 'Saving…' : 'Save changes'}
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

