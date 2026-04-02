import { useEffect, useMemo, useState } from 'react'
import * as api from '../../api'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { RichTextEditor } from '../../components/ui/RichTextEditor'
import { Textarea } from '../../components/ui/Textarea'

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

function formatDate(d) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleString()
  } catch {
    return String(d)
  }
}

function EmptyState({ title, subtitle }) {
  return (
    <Card className="p-6">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {subtitle ? <div className="mt-1 text-sm text-slate-600">{subtitle}</div> : null}
    </Card>
  )
}

export function AdminPropertiesPage() {
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

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')

  const [sellers, setSellers] = useState([])
  const [createForm, setCreateForm] = useState({
    title: '',
    location: '',
    monthlyRent: '',
    investmentAmount: '',
    expectedProfit: '',
    roi: '',
    tenancyDetails: '',
    details: '',
    highlights: [],
    customHighlight: '',
    status: 'Available',
    sellerId: '',
  })
  const MAX_IMAGES = 10
  const [createFiles, setCreateFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [creatingProperty, setCreatingProperty] = useState(false)
  const [createError, setCreateError] = useState(null)
  const [createSuccess, setCreateSuccess] = useState(null)
  const [deleteError, setDeleteError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editingImages, setEditingImages] = useState([])
  const [deletingImageId, setDeletingImageId] = useState(null)

  const filteredProperties = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return properties
    return properties.filter((p) => {
      const blob = `${p?.title || ''} ${p?.location || ''} ${p?.status || ''} ${p?.id || p?._id || ''}`.toLowerCase()
      return blob.includes(q)
    })
  }, [filter, properties])

  async function loadProperties() {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getAdminProperties()
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : []
      setProperties(list)
    } catch (e) {
      setError(e?.message || 'Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  async function loadSellers() {
    try {
      const list = await api.getAdminSellers()
      setSellers(Array.isArray(list) ? list : [])
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    loadProperties()
    loadSellers()
  }, [])

  function handleCreateFilesChange(e) {
    previewUrls.forEach((url) => {
      if (typeof url === 'string' && url.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(url)
        } catch {}
      }
    })
    const files = Array.from(e.target.files || [])
    const limited = files.slice(0, MAX_IMAGES)
    setCreateFiles(limited)
    const urls = limited.map((file) => URL.createObjectURL(file))
    setPreviewUrls(urls)
  }

  async function handleCreateProperty(e) {
    e.preventDefault()
    setCreateError(null)
    setCreateSuccess(null)
    setCreatingProperty(true)
    try {
      const body = {
        title: createForm.title.trim(),
        location: createForm.location.trim(),
        monthlyRent: Number(createForm.monthlyRent),
        investmentAmount: Number(createForm.investmentAmount),
      }
      if (!body.title || !body.location || Number.isNaN(body.monthlyRent) || Number.isNaN(body.investmentAmount)) {
        throw new Error('Title, location, monthly rent and investment amount are required')
      }
      if (createForm.expectedProfit.trim()) body.expectedProfit = Number(createForm.expectedProfit)
      if (createForm.roi.trim()) body.roi = Number(createForm.roi)
      if (createForm.tenancyDetails.trim()) body.tenancyDetails = createForm.tenancyDetails.trim()
      if (createForm.status) body.status = createForm.status
      if (createForm.sellerId?.trim()) body.sellerId = createForm.sellerId.trim()
      else body.sellerId = null
      const detailsTrimmed = createForm.details && createForm.details.trim()
      const hasDetailsText = detailsTrimmed && detailsTrimmed.replace(/<[^>]*>/g, '').trim()
      body.details = hasDetailsText ? detailsTrimmed : ''
      body.highlights = (Array.isArray(createForm.highlights) ? createForm.highlights : [])
        .map((x) => (x == null ? '' : String(x).trim()))
        .filter(Boolean)
        .slice(0, 10)

      let propertyId = editingId
      if (editingId) {
        await api.updateProperty(editingId, body)
      } else {
        const created = await api.createProperty(body)
        propertyId = created?.id || created?._id
      }

      if (propertyId && createFiles.length > 0) {
        const fd = new FormData()
        createFiles.forEach((file) => fd.append('images', file))
        await api.uploadPropertyImages(propertyId, fd)
      }

      setCreateSuccess(editingId ? 'Property updated successfully' : 'Property created successfully')
      setCreateForm({
        title: '',
        location: '',
        monthlyRent: '',
        investmentAmount: '',
        expectedProfit: '',
        roi: '',
        tenancyDetails: '',
        details: '',
        highlights: [],
        customHighlight: '',
        status: 'Available',
        sellerId: '',
      })
      previewUrls.forEach((url) => {
        if (typeof url === 'string' && url.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(url)
          } catch {}
        }
      })
      setCreateFiles([])
      setPreviewUrls([])
      setEditingId(null)
      await loadProperties()
    } catch (err) {
      setCreateError(err?.data?.error || err?.message || 'Failed to create property')
    } finally {
      setCreatingProperty(false)
    }
  }

  async function handleDeleteProperty(id) {
    if (!id) return
    // eslint-disable-next-line no-alert
    const ok = window.confirm('Are you sure you want to delete this property?')
    if (!ok) return
    setDeleteError(null)
    try {
      await api.deleteProperty(id)
      await loadProperties()
    } catch (err) {
      setDeleteError(err?.data?.error || err?.message || 'Failed to delete property')
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-black tracking-tight text-slate-900">Properties</h2>
            <p className="mt-1 text-sm text-slate-600">
              Create and manage properties that appear on the public site. Upload images and keep details up to date.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
            <div className="w-full sm:w-80">
              <Input
                label="Filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search by title, location, status…"
              />
            </div>
            <Button variant="secondary" onClick={loadProperties} disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Refreshing…' : 'Refresh'}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 ring-1 ring-slate-200">
            Showing <span className="font-semibold text-slate-900">{filteredProperties.length}</span> propert
            {filteredProperties.length === 1 ? 'y' : 'ies'}
          </span>
          {editingId ? (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800 ring-1 ring-emerald-200">
              Editing: <span className="font-black">{editingId}</span>
            </span>
          ) : null}
          {filter.trim() ? (
            <button
              type="button"
              className="rounded-full bg-white px-2.5 py-1 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              onClick={() => setFilter('')}
            >
              Clear search
            </button>
          ) : null}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
        <Card className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-black text-slate-900">{editingId ? 'Edit property' : 'Create property'}</div>
              <div className="mt-1 text-sm text-slate-600">
                Fill the details below, then optionally upload images (1–10).
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {editingId ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditingId(null)
                    setCreateError(null)
                    setCreateSuccess(null)
                    setEditingImages([])
                    setDeletingImageId(null)
                    setCreateForm({
                      title: '',
                      location: '',
                      monthlyRent: '',
                      investmentAmount: '',
                      expectedProfit: '',
                      roi: '',
                      tenancyDetails: '',
                      details: '',
                      highlights: [],
                      customHighlight: '',
                      status: 'Available',
                      sellerId: '',
                    })
                    previewUrls.forEach((url) => {
                      if (typeof url === 'string' && url.startsWith('blob:')) {
                        try {
                          URL.revokeObjectURL(url)
                        } catch {}
                      }
                    })
                    setCreateFiles([])
                    setPreviewUrls([])
                  }}
                  disabled={creatingProperty}
                >
                  Cancel editing
                </Button>
              ) : null}
              <Button
                variant="secondary"
                onClick={() => {
                  setCreateError(null)
                  setCreateSuccess(null)
                  setEditingId(null)
                  setEditingImages([])
                  setDeletingImageId(null)
                  setCreateForm({
                    title: '',
                    location: '',
                    monthlyRent: '',
                    investmentAmount: '',
                    expectedProfit: '',
                    roi: '',
                    tenancyDetails: '',
                    details: '',
                    highlights: [],
                    customHighlight: '',
                    status: 'Available',
                    sellerId: '',
                  })
                  previewUrls.forEach((url) => {
                    if (typeof url === 'string' && url.startsWith('blob:')) {
                      try {
                        URL.revokeObjectURL(url)
                      } catch {}
                    }
                  })
                  setCreateFiles([])
                  setPreviewUrls([])
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                disabled={creatingProperty}
              >
                Reset form
              </Button>
            </div>
          </div>

          <form className="mt-4 grid gap-3" onSubmit={handleCreateProperty}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Title"
              value={createForm.title}
              onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
            <Input
              label="Location"
              value={createForm.location}
              onChange={(e) => setCreateForm((f) => ({ ...f, location: e.target.value }))}
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              label="Monthly rent"
              type="number"
              min="0"
              value={createForm.monthlyRent}
              onChange={(e) => setCreateForm((f) => ({ ...f, monthlyRent: e.target.value }))}
              required
            />
            <Input
              label="Investment amount"
              type="number"
              min="0"
              value={createForm.investmentAmount}
              onChange={(e) => setCreateForm((f) => ({ ...f, investmentAmount: e.target.value }))}
              required
            />
            <Input
              label="Expected profit (optional)"
              type="number"
              value={createForm.expectedProfit}
              onChange={(e) => setCreateForm((f) => ({ ...f, expectedProfit: e.target.value }))}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              label="ROI % (optional)"
              type="number"
              value={createForm.roi}
              onChange={(e) => setCreateForm((f) => ({ ...f, roi: e.target.value }))}
            />
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-800">Status</span>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white"
                value={createForm.status}
                onChange={(e) => setCreateForm((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="Available">Available</option>
                <option value="UnderOffer">UnderOffer</option>
                <option value="Sold">Sold</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-800">Seller</span>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white"
                value={createForm.sellerId || ''}
                onChange={(e) => setCreateForm((f) => ({ ...f, sellerId: e.target.value }))}
              >
                <option value="">— No seller —</option>
                {sellers.map((s) => {
                  const id = s?.id || s?._id
                  return (
                    <option key={id} value={id}>
                      {s?.name || id}
                    </option>
                  )}
                )}
              </select>
            </label>
          </div>
          <Textarea
            label="Tenancy details (optional)"
            value={createForm.tenancyDetails}
            onChange={(e) => setCreateForm((f) => ({ ...f, tenancyDetails: e.target.value }))}
          />
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-800">Highlights (optional)</div>
            <div className="flex flex-wrap gap-2">
              {HIGHLIGHT_OPTIONS.map((opt) => {
                const selected = Array.isArray(createForm.highlights) && createForm.highlights.includes(opt)
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setCreateForm((f) => {
                        const curr = Array.isArray(f.highlights) ? f.highlights : []
                        const next = selected ? curr.filter((x) => x !== opt) : [...curr, opt]
                        return { ...f, highlights: next.slice(0, 10) }
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
                value={createForm.customHighlight}
                onChange={(e) => setCreateForm((f) => ({ ...f, customHighlight: e.target.value }))}
                placeholder="e.g. 🧾 Bills included"
              />
              <Button
                type="button"
                variant="secondary"
                className="sm:mt-6"
                onClick={() => {
                  setCreateForm((f) => {
                    const raw = String(f.customHighlight || '').trim()
                    if (!raw) return f
                    const curr = Array.isArray(f.highlights) ? f.highlights : []
                    if (curr.includes(raw)) return { ...f, customHighlight: '' }
                    return { ...f, highlights: [...curr, raw].slice(0, 10), customHighlight: '' }
                  })
                }}
              >
                Add
              </Button>
            </div>

            {Array.isArray(createForm.highlights) && createForm.highlights.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {createForm.highlights.slice(0, 10).map((h) => (
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
            placeholder="Describe the property, features, area info, etc. Shown below title and location on the property page."
            value={createForm.details}
            onChange={(html) => setCreateForm((f) => ({ ...f, details: html }))}
          />
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-800">Images (1–10, optional)</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleCreateFilesChange}
              className="text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
            />
            {createFiles.length > 0 ? (
              <p className="mt-1 text-xs text-slate-500">
                {createFiles.length} image{createFiles.length !== 1 ? 's' : ''} selected (max {MAX_IMAGES})
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">
                Select 1–10 images. You can add more later from the property.
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
                      aria-label="Remove selected image"
                      title="Remove selected image"
                      onClick={() => {
                        setPreviewUrls((urls) => {
                          const next = [...urls]
                          const [removed] = next.splice(idx, 1)
                          if (typeof removed === 'string' && removed.startsWith('blob:')) {
                            try {
                              URL.revokeObjectURL(removed)
                            } catch {}
                          }
                          return next
                        })
                        setCreateFiles((files) => {
                          const next = [...files]
                          next.splice(idx, 1)
                          return next
                        })
                      }}
                      className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-xs font-black text-white opacity-0 shadow-sm transition hover:bg-rose-700 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            {editingId && editingImages.length > 0 ? (
              <div className="mt-4 space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Existing images
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {editingImages.map((img) => {
                    const src = img?.secureUrl || img?.url
                    const imageId = img?.id || img?._id
                    if (!src || !imageId) return null
                    const isDeleting = deletingImageId === imageId
                    return (
                      <div
                        key={imageId}
                        className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                      >
                        <img src={src} alt="Existing" className="h-20 w-full object-cover" />
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={async () => {
                            if (!editingId || !imageId) return
                            // eslint-disable-next-line no-alert
                            const ok = window.confirm('Delete this image from the property?')
                            if (!ok) return
                            setDeletingImageId(imageId)
                            try {
                              await api.deletePropertyImage(editingId, imageId)
                              setEditingImages((imgs) =>
                                imgs.filter((x) => (x?.id || x?._id) !== imageId)
                              )
                              await loadProperties()
                            } catch (err) {
                              setDeleteError(err?.data?.error || err?.message || 'Failed to delete image')
                            } finally {
                              setDeletingImageId(null)
                            }
                          }}
                          aria-label="Remove image"
                          title={isDeleting ? 'Deleting…' : 'Remove image'}
                          className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-xs font-black text-white opacity-0 shadow-sm transition hover:bg-rose-700 group-hover:opacity-100 disabled:cursor-not-allowed disabled:bg-rose-300"
                        >
                          {isDeleting ? '…' : '×'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </label>

          {createError ? <div className="text-sm font-semibold text-rose-600">{createError}</div> : null}
          {createSuccess ? (
            <div className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{createSuccess}</div>
          ) : null}

          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              On success this will appear on the public site immediately.
            </p>
            <Button type="submit" disabled={creatingProperty}>
                  {creatingProperty
                    ? editingId
                      ? 'Updating…'
                      : 'Creating…'
                    : editingId
                      ? 'Update property'
                      : 'Create property'}
            </Button>
          </div>
        </form>
        </Card>

      {deleteError ? (
        <Card className="p-3">
          <div className="text-sm font-semibold text-rose-700">{deleteError}</div>
        </Card>
      ) : null}

      {loading ? (
        <Card className="h-56 animate-pulse bg-slate-100" />
      ) : error ? (
        <Card className="p-5">
          <div className="text-sm font-semibold text-rose-700">{error}</div>
        </Card>
      ) : filteredProperties.length === 0 ? (
        <EmptyState title="No properties yet" subtitle="Create a property via the admin interface above." />
      ) : (
        <div className="grid gap-4 lg:col-start-2">
          {filteredProperties.map((p) => {
            const id = p?.id || p?._id
            const img = (p?.images || []).map((im) => im?.secureUrl || im?.url).filter(Boolean)[0]
            const status = p?.status || 'Available'
            const statusCls =
              status === 'Available'
                ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
                : status === 'UnderOffer'
                  ? 'bg-sky-50 text-sky-800 ring-sky-200'
                  : status === 'Sold'
                    ? 'bg-slate-100 text-slate-800 ring-slate-200'
                    : 'bg-slate-100 text-slate-800 ring-slate-200'

            return (
              <Card key={id} className="h-full overflow-hidden">
                <div className="grid h-full gap-4 p-5 sm:grid-cols-[140px_minmax(0,1fr)]">
                  <div className="h-full overflow-hidden rounded-xl bg-slate-100">
                    {img ? (
                      <img
                        src={img}
                        alt={p?.title || 'Property'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-black text-slate-900">{p?.title || '—'}</div>
                        <div className="mt-0.5 truncate text-sm text-slate-600">{p?.location || '—'}</div>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusCls}`}>
                        {status}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 sm:grid-cols-3">
                      <div>
                        <div className="text-slate-500">Investment</div>
                        <div className="font-semibold text-slate-800">{formatMoney(p?.investmentAmount)}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Rent/mo</div>
                        <div className="font-semibold text-slate-800">{formatMoney(p?.monthlyRent)}</div>
                      </div>
                      <div className="sm:text-right">
                        <div className="text-slate-500">Updated</div>
                        <div className="font-semibold text-slate-800">{formatDate(p?.updatedAt)}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs text-slate-500">
                        ID: <span className="break-all">{id || '—'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="secondary"
                          className="!px-3 !py-1 text-xs"
                          onClick={() => {
                            if (!id) return
                            setEditingImages(p?.images || [])
                            setEditingId(id)
                            setCreateError(null)
                            setCreateSuccess(null)
                            setCreateFiles([])
                            setPreviewUrls([])
                            setCreateForm({
                              title: p?.title || '',
                              location: p?.location || '',
                              monthlyRent:
                                p?.monthlyRent != null && !Number.isNaN(Number(p.monthlyRent))
                                  ? String(p.monthlyRent)
                                  : '',
                              investmentAmount:
                                p?.investmentAmount != null && !Number.isNaN(Number(p.investmentAmount))
                                  ? String(p.investmentAmount)
                                  : '',
                              expectedProfit:
                                p?.expectedProfit != null && !Number.isNaN(Number(p.expectedProfit))
                                  ? String(p.expectedProfit)
                                  : '',
                              roi: p?.roi != null && !Number.isNaN(Number(p.roi)) ? String(p.roi) : '',
                              tenancyDetails: p?.tenancyDetails || '',
                              details: p?.details || '',
                              highlights: Array.isArray(p?.highlights) ? p.highlights : [],
                              customHighlight: '',
                              status: p?.status || 'Available',
                              sellerId: p?.seller?.id || p?.seller?._id || p?.seller || '',
                            })
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="secondary"
                          className="!px-3 !py-1 text-xs"
                          onClick={() => handleDeleteProperty(id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
      </div>
    </div>
  )
}

