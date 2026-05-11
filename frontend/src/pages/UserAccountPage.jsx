import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Layout/Header'
import { Footer } from '../components/Layout/Footer'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { useUserAuth } from '../contexts/UserAuthContext'
import * as api from '../api'

function StatusPill({ status }) {
  const s = status || 'none'
  const cls =
    s === 'approved'
      ? 'bg-emerald-100 text-emerald-800'
      : s === 'pending'
        ? 'bg-amber-100 text-amber-800'
        : s === 'rejected'
          ? 'bg-rose-100 text-rose-800'
          : 'bg-slate-100 text-slate-700'
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${cls}`}>{s}</span>
}

export function UserAccountPage() {
  const { user, loading, isAuthenticated, logout, refreshMe } = useUserAuth()
  const nav = useNavigate()

  const [provider, setProvider] = useState(null)
  const [applyMessage, setApplyMessage] = useState('')
  const [busyApply, setBusyApply] = useState(false)
  const [error, setError] = useState(null)

  const [section, setSection] = useState('profile') // profile | provider | security

  const [profileName, setProfileName] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileOk, setProfileOk] = useState(null)

  const [avatarFile, setAvatarFile] = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [changingPw, setChangingPw] = useState(false)
  const [pwOk, setPwOk] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) return
    setError(null)
    api
      .providerMe()
      .then((data) => setProvider(data))
      .catch((e) => setError(e?.message || 'Failed to load provider status'))
  }, [isAuthenticated])

  useEffect(() => {
    setProfileName(user?.name || '')
  }, [user])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      nav('/login?redirect=/account', { replace: true })
    }
  }, [loading, isAuthenticated, nav])

  const providerStatus = useMemo(() => {
    return provider?.user?.providerStatus || user?.providerStatus || 'none'
  }, [provider?.user?.providerStatus, user?.providerStatus])

  async function onApplyProvider() {
    setBusyApply(true)
    setError(null)
    try {
      await api.providerApply({ message: applyMessage })
      await refreshMe()
      const data = await api.providerMe()
      setProvider(data)
    } catch (e) {
      setError(e?.message || 'Failed to apply')
    } finally {
      setBusyApply(false)
    }
  }

  async function onSaveProfile() {
    setSavingProfile(true)
    setError(null)
    setProfileOk(null)
    try {
      await api.userUpdateMe({ name: profileName })
      await refreshMe()
      setProfileOk('Saved')
    } catch (e) {
      setError(e?.message || 'Failed to save profile')
    } finally {
      setSavingProfile(false)
    }
  }

  async function onPickAvatar(file) {
    if (!file) return
    // keep filename visible while uploading
    setAvatarFile(file)
    setUploadingAvatar(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('image', file)
      await api.userUploadMeImage(fd)
      setAvatarFile(null)
      await refreshMe()
    } catch (e) {
      setError(e?.message || 'Failed to upload avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  async function onChangePassword() {
    setChangingPw(true)
    setError(null)
    setPwOk(null)
    try {
      await api.userChangePassword({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setPwOk('Password changed')
    } catch (e) {
      setError(e?.message || 'Failed to change password')
    } finally {
      setChangingPw(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-teal-900">
      <Header variant="light" />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-teal-900">My account</h1>
            <p className="mt-1 text-sm text-teal-700">{user?.email}</p>
          </div>
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
          {/* Sidebar */}
          <Card className="p-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Account</div>
            <div className="mt-3 space-y-1">
              <button
                type="button"
                onClick={() => setSection('profile')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  section === 'profile'
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Profile
              </button>
              <button
                type="button"
                onClick={() => setSection('provider')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  section === 'provider'
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Provider
              </button>
              <button
                type="button"
                onClick={() => setSection('security')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  section === 'security'
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Security
              </button>
            </div>
          </Card>

          {/* Content */}
          <div className="space-y-4">
            {section === 'profile' ? (
              <Card className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt=""
                        className="h-20 w-20 rounded-full object-cover ring-2 ring-teal-200"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-200 text-3xl font-bold text-teal-800">
                        {String(user?.name || user?.email || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-lg font-black text-teal-900">Profile</div>
                      <div className="mt-1 text-sm text-teal-700">Update your name and avatar.</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onPickAvatar(e.target.files?.[0] || null)}
                      />
                      <span>
                        {uploadingAvatar
                          ? 'Uploading…'
                          : avatarFile
                            ? avatarFile.name
                            : 'Choose avatar'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <Input label="Name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                  <Button onClick={onSaveProfile} disabled={savingProfile}>
                    {savingProfile ? 'Saving…' : 'Save'}
                  </Button>
                </div>
                {profileOk ? <div className="mt-2 text-xs font-semibold text-emerald-700">{profileOk}</div> : null}
              </Card>
            ) : null}

            {section === 'provider' ? (
              <Card className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-black text-teal-900">Provider</div>
                    <div className="mt-1 text-sm text-teal-700">Apply, track status, and manage submissions.</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-teal-900">Status</span>
                    <StatusPill status={providerStatus} />
                  </div>
                </div>

                {providerStatus === 'approved' ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button as={Link} to="/provider/properties" variant="secondary">
                      My properties
                    </Button>
                    <Button as={Link} to="/provider/properties/new">
                      Submit property
                    </Button>
                  </div>
                ) : null}

                {providerStatus === 'none' || providerStatus === 'rejected' ? (
                  <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/40 p-4">
                    <div className="text-sm font-bold text-teal-900">Become a provider</div>
                    <p className="mt-1 text-sm text-teal-700">
                      Submit your request and wait for admin approval. After approval, you can submit properties for review.
                    </p>
                    <div className="mt-4 grid gap-3">
                      <Textarea
                        label="Message (optional)"
                        value={applyMessage}
                        onChange={(e) => setApplyMessage(e.target.value)}
                        placeholder="Tell us about your properties…"
                      />
                      <div className="flex items-center gap-3">
                        <Button onClick={onApplyProvider} disabled={busyApply}>
                          {busyApply ? 'Submitting…' : 'Apply'}
                        </Button>
                        <span className="text-xs text-slate-500">Admin will review your request.</span>
                      </div>
                    </div>
                  </div>
                ) : null}

                {providerStatus === 'pending' ? (
                  <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="text-sm font-bold text-amber-900">Application pending</div>
                    <p className="mt-1 text-sm text-amber-800">Your provider application is under review.</p>
                  </div>
                ) : null}
              </Card>
            ) : null}

            {section === 'security' ? (
              <Card className="p-6">
                <div className="text-lg font-black text-teal-900">Security</div>
                <div className="mt-1 text-sm text-teal-700">Change your password.</div>
                <div className="mt-6 grid gap-3">
                  <Input
                    label="Current password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Input
                    label="New password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    hint="At least 6 characters."
                  />
                  <div className="flex items-center gap-3">
                    <Button variant="secondary" onClick={onChangePassword} disabled={changingPw}>
                      {changingPw ? 'Updating…' : 'Change password'}
                    </Button>
                    {pwOk ? <span className="text-xs font-semibold text-emerald-700">{pwOk}</span> : null}
                  </div>
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

