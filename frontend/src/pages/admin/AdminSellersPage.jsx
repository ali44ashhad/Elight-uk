import { useEffect, useState } from 'react'
import * as api from '../../api'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'

export function AdminSellersPage() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ name: '' })
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [editingId, setEditingId] = useState(null)

  async function loadSellers() {
    setLoading(true)
    setError(null)
    try {
      const list = await api.getAdminSellers()
      setSellers(Array.isArray(list) ? list : [])
    } catch (e) {
      setError(e?.message || 'Failed to load sellers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSellers()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError(null)
    setSuccess(null)
    const name = form.name?.trim()
    if (!name) {
      setFormError('Name is required')
      return
    }
    setSaving(true)
    try {
      let sellerId = editingId
      if (editingId) {
        await api.updateSeller(editingId, { name })
        setSuccess('Seller updated')
      } else {
        const created = await api.createSeller({ name })
        sellerId = created?.id || created?._id
        setSuccess('Seller created')
      }

      if (sellerId && file) {
        const fd = new FormData()
        fd.append('image', file)
        await api.uploadSellerImage(sellerId, fd)
      }

      setForm({ name: '' })
      setFile(null)
      setEditingId(null)
      await loadSellers()
    } catch (err) {
      setFormError(err?.data?.error || err?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!id) return
    if (!window.confirm('Delete this seller? Properties linked to them will keep the link but the seller will be removed.')) return
    setError(null)
    try {
      await api.deleteSeller(id)
      if (editingId === id) {
        setEditingId(null)
        setForm({ name: '' })
        setFile(null)
      }
      await loadSellers()
    } catch (err) {
      setError(err?.data?.error || err?.message || 'Failed to delete')
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h2 className="text-xl font-black tracking-tight text-slate-900">Sellers</h2>
        <p className="mt-1 text-sm text-slate-600">
          Create sellers and assign them to properties. Sellers appear on property pages and have a public profile with their listed properties.
        </p>
      </Card>

      <Card className="p-5">
        <div className="text-sm font-black text-slate-900">{editingId ? 'Edit seller' : 'Create seller'}</div>
        <form className="mt-4 grid max-w-md gap-3" onSubmit={handleSubmit}>
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-800">Profile image (optional)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0]
                setFile(f || null)
              }}
              className="text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
            />
            {file ? (
              <p className="mt-1 text-xs text-slate-500 truncate">
                Selected: <span className="font-medium text-slate-700">{file.name}</span>
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">Optional. Upload a seller photo for the public site.</p>
            )}
          </label>
          {formError ? <div className="text-sm font-semibold text-rose-600">{formError}</div> : null}
          {success ? <div className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{success}</div> : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Update seller' : 'Create seller'}
            </Button>
            {editingId ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEditingId(null)
                  setForm({ name: '' })
                  setFile(null)
                  setFormError(null)
                  setSuccess(null)
                }}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      {error ? (
        <Card className="p-3">
          <div className="text-sm font-semibold text-rose-700">{error}</div>
        </Card>
      ) : null}

      {loading ? (
        <Card className="h-32 animate-pulse bg-slate-100" />
      ) : sellers.length === 0 ? (
        <Card className="p-6 text-sm text-slate-600">No sellers yet. Create one above.</Card>
      ) : (
        <Card className="p-5">
          <div className="text-sm font-black text-slate-900">All sellers</div>
          <ul className="mt-3 space-y-2">
            {sellers.map((s) => {
              const id = s?.id || s?._id
              const img = s?.imageUrl
              return (
                <li
                  key={id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    {img ? (
                      <img src={img} alt="" className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
                        {String(s?.name || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-semibold text-slate-900">{s?.name || '—'}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      className="!px-3 !py-1 text-xs"
                      onClick={() => {
                        setEditingId(id)
                        setForm({ name: s?.name || '', imageUrl: s?.imageUrl || '' })
                        setFormError(null)
                        setSuccess(null)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      className="!px-3 !py-1 text-xs"
                      onClick={() => handleDelete(id)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      )}
    </div>
  )
}
