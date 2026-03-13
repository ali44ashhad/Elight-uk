import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/ui/Button'
import * as api from '../api'

export function RefundPage() {
  const [form, setForm] = useState({
    orderDate: '',
    dealPropertyAddress: '',
    purchaseEmail: '',
    cardLast4: '',
    reasonForRefund: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setSubmitted(false)
    setError(null)
    try {
      await api.createRefund({
        orderDate: form.orderDate.trim(),
        dealPropertyAddress: form.dealPropertyAddress.trim(),
        purchaseEmail: form.purchaseEmail.trim(),
        cardLast4: form.cardLast4.trim(),
        reasonForRefund: form.reasonForRefund.trim(),
      })
      setSubmitted(true)
      setForm({ orderDate: '', dealPropertyAddress: '', purchaseEmail: '', cardLast4: '', reasonForRefund: '' })
    } catch (err) {
      setError(err?.data?.error || err?.message || 'Failed to submit refund request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-teal-900">
      <Header variant="light" />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-wrap items-start gap-4 border-b border-teal-800/40 pb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Deal Refund Request - DRR
            </h1>
            <p className="mt-3 max-w-2xl font-semibold text-sm leading-relaxed text-slate-800">
              Please note that only the buyer can request a refund; sellers are not permitted to do so. If your order
              was placed more than 14 days ago, we are unfortunately unable to issue a refund. In this case, you will
              need to contact the seller directly for further assistance.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Row 1 */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-900">Order Date</label>
              <input
                type="text"
                value={form.orderDate}
                onChange={(e) => setForm((f) => ({ ...f, orderDate: e.target.value }))}
                placeholder="e.g. DD/MM/YYYY"
                className="w-full rounded border-2 border-teal-800 bg-white px-3 py-2 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-900">Deal Property Address</label>
              <input
                type="text"
                value={form.dealPropertyAddress}
                onChange={(e) => setForm((f) => ({ ...f, dealPropertyAddress: e.target.value }))}
                placeholder="Property address"
                className="w-full rounded border-2 border-teal-800 bg-white px-3 py-2 text-sm text-slate-900"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-900">Purchase Email Address</label>
              <input
                type="email"
                value={form.purchaseEmail}
                onChange={(e) => setForm((f) => ({ ...f, purchaseEmail: e.target.value }))}
                placeholder="Email used for purchase"
                className="w-full rounded border-2 border-teal-800 bg-white px-3 py-2 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-900">Card Last 4 Digits</label>
              <input
                type="text"
                maxLength={4}
                value={form.cardLast4}
                onChange={(e) => setForm((f) => ({ ...f, cardLast4: e.target.value.replace(/\D/g, '') }))}
                placeholder="XXXX"
                className="w-full rounded border-2 border-teal-800 bg-white px-3 py-2 text-sm text-slate-900"
              />
            </div>
          </div>

          <p className="  leading-relaxed text-slate-800">
            Please ensure that you have spoken with the seller to work things out, before submitting a refund request.
            To help us improve the service, please tell us the reason for your refund request.
          </p>

          <div>
            <label className="mb-1 block text-lg font-bold text-slate-900">Reason for Refund</label>
            <textarea
              rows={5}
              value={form.reasonForRefund}
              onChange={(e) => setForm((f) => ({ ...f, reasonForRefund: e.target.value }))}
              placeholder="Describe the reason for your refund request..."
              className="w-full resize-y rounded border-2 border-teal-800 bg-white px-3 py-2 text-sm text-slate-900"
            />
          </div>

          {error ? (
            <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>
          ) : null}

          {submitted ? (
            <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              Thank you. Your refund request has been submitted. We will get back to you as soon as possible.
            </div>
          ) : null}

          <div>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-teal-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
