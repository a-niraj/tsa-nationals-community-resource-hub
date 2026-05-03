import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { PageShell } from '@/components/PageShell'
import {
  verifyAdmin,
  getPendingSubmissions,
  approveSubmission,
  rejectSubmission,
  uploadImage,
} from '@/api/admin'
import type { PendingSubmission } from '@/lib/types'

const STORAGE_KEY = 'admin-password'

type ApprovalDraft = {
  icon: string
  image: string
  lat: string
  lng: string
  notes: string
}

const emptyDraft: ApprovalDraft = { icon: '', image: '', lat: '', lng: '', notes: '' }

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [
      { title: 'Admin — Seattle Together' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminPage,
})

function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [submissions, setSubmissions] = useState<PendingSubmission[]>([])
  const [listError, setListError] = useState('')
  const [listLoading, setListLoading] = useState(false)

  const [drafts, setDrafts] = useState<Record<number, ApprovalDraft>>({})
  const [busy, setBusy] = useState<Record<number, boolean>>({})
  const [rowError, setRowError] = useState<Record<number, string>>({})
  const [uploading, setUploading] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (!stored) return
    verifyAdmin({ data: { password: stored } })
      .then(() => {
        setPassword(stored)
        setAuthed(true)
      })
      .catch(() => sessionStorage.removeItem(STORAGE_KEY))
  }, [])

  useEffect(() => {
    if (authed) loadSubmissions(password)
  }, [authed])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    setAuthLoading(true)
    try {
      await verifyAdmin({ data: { password } })
      sessionStorage.setItem(STORAGE_KEY, password)
      setAuthed(true)
    } catch {
      setAuthError('Incorrect password')
    } finally {
      setAuthLoading(false)
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(STORAGE_KEY)
    setPassword('')
    setAuthed(false)
    setSubmissions([])
  }

  async function loadSubmissions(pw: string) {
    setListError('')
    setListLoading(true)
    try {
      const data = await getPendingSubmissions({ data: { password: pw } })
      setSubmissions(data)
    } catch (err) {
      setListError(String(err))
      setSubmissions([])
    } finally {
      setListLoading(false)
    }
  }

  function getDraft(id: number): ApprovalDraft {
    return drafts[id] ?? emptyDraft
  }

  function updateDraft(id: number, patch: Partial<ApprovalDraft>) {
    setDrafts(prev => ({ ...prev, [id]: { ...(prev[id] ?? emptyDraft), ...patch } }))
  }

  async function handleUpload(id: number, file: File) {
    setRowError(prev => ({ ...prev, [id]: '' }))
    setUploading(prev => ({ ...prev, [id]: true }))
    try {
      const form = new FormData()
      form.append('password', password)
      form.append('file', file)
      const { url } = await uploadImage({ data: form })
      updateDraft(id, { image: url })
    } catch (err) {
      setRowError(prev => ({ ...prev, [id]: String(err) }))
    } finally {
      setUploading(prev => ({ ...prev, [id]: false }))
    }
  }

  async function handleApprove(submission: PendingSubmission) {
    const draft = getDraft(submission.id)
    setRowError(prev => ({ ...prev, [submission.id]: '' }))
    setBusy(prev => ({ ...prev, [submission.id]: true }))

    const payload: {
      password: string
      id: number
      icon?: string
      image?: string
      lat?: number
      lng?: number
      notes?: string
    } = { password, id: submission.id }

    if (draft.icon.trim()) payload.icon = draft.icon.trim()
    if (draft.image.trim()) payload.image = draft.image.trim()
    if (draft.notes.trim()) payload.notes = draft.notes.trim()
    if (draft.lat.trim()) {
      const v = Number(draft.lat)
      if (!Number.isFinite(v)) {
        setBusy(prev => ({ ...prev, [submission.id]: false }))
        setRowError(prev => ({ ...prev, [submission.id]: 'lat must be a number' }))
        return
      }
      payload.lat = v
    }
    if (draft.lng.trim()) {
      const v = Number(draft.lng)
      if (!Number.isFinite(v)) {
        setBusy(prev => ({ ...prev, [submission.id]: false }))
        setRowError(prev => ({ ...prev, [submission.id]: 'lng must be a number' }))
        return
      }
      payload.lng = v
    }

    try {
      await approveSubmission({ data: payload })
      setSubmissions(prev => prev.filter(s => s.id !== submission.id))
    } catch (err) {
      setRowError(prev => ({ ...prev, [submission.id]: String(err) }))
    } finally {
      setBusy(prev => ({ ...prev, [submission.id]: false }))
    }
  }

  async function handleReject(submission: PendingSubmission) {
    const draft = getDraft(submission.id)
    setRowError(prev => ({ ...prev, [submission.id]: '' }))
    setBusy(prev => ({ ...prev, [submission.id]: true }))
    try {
      await rejectSubmission({
        data: {
          password,
          id: submission.id,
          ...(draft.notes.trim() ? { notes: draft.notes.trim() } : {}),
        },
      })
      setSubmissions(prev => prev.filter(s => s.id !== submission.id))
    } catch (err) {
      setRowError(prev => ({ ...prev, [submission.id]: String(err) }))
    } finally {
      setBusy(prev => ({ ...prev, [submission.id]: false }))
    }
  }

  if (!authed) {
    return (
      <PageShell
        eyebrow="Admin"
        title="Sign in"
        intro="Enter the admin password to review pending submissions."
      >
        <form
          onSubmit={handleLogin}
          className="rounded-3xl bg-card border border-border p-7 max-w-md space-y-4 mb-16"
        >
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="rounded-full bg-background border border-border px-4 py-3 w-full focus:outline-none focus:border-primary"
          />
          {authError && <div className="text-sm text-crimson">{authError}</div>}
          <button
            type="submit"
            disabled={authLoading || !password}
            className="rounded-full bg-rose px-6 py-3 font-semibold text-rose-foreground hover:bg-crimson transition disabled:opacity-50"
          >
            {authLoading ? 'Checking...' : 'Sign in'}
          </button>
        </form>
      </PageShell>
    )
  }

  return (
    <PageShell
      eyebrow="Admin"
      title="Pending submissions"
      intro={`${submissions.length} pending`}
    >
      <div className="pb-16 space-y-6">
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => loadSubmissions(password)}
            disabled={listLoading}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary transition disabled:opacity-50"
          >
            {listLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={handleLogout}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary transition"
          >
            Sign out
          </button>
        </div>

        {listError && (
          <div className="rounded-3xl bg-crimson/10 border border-crimson p-5 text-sm text-crimson">
            {listError}
          </div>
        )}

        {!listLoading && submissions.length === 0 && !listError && (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center text-foreground/60">
            No pending submissions.
          </div>
        )}

        {submissions.map(sub => {
          const draft = getDraft(sub.id)
          const isBusy = !!busy[sub.id]
          const isUp = !!uploading[sub.id]
          const err = rowError[sub.id]
          return (
            <article key={sub.id} className="rounded-3xl bg-card border border-border p-7 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-rose" />
                  {sub.category}
                  <span className="text-foreground/50">{new Date(sub.created_at).toLocaleString()}</span>
                </div>
                <h2 className="mt-2 text-2xl font-bold text-primary">{sub.name}</h2>
              </div>

              <p className="text-sm text-foreground/75">{sub.description}</p>

              <dl className="grid sm:grid-cols-2 gap-2 text-sm text-foreground/70">
                {sub.address && (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Address</dt>
                    <dd>{sub.address}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Phone</dt>
                  <dd>{sub.phone}</dd>
                </div>
                {sub.website && (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Website</dt>
                    <dd className="truncate">{sub.website}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Submitted by</dt>
                  <dd>{sub.contact}</dd>
                </div>
              </dl>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Extra fields
                </div>
                <div className="grid sm:grid-cols-3 gap-2">
                  <input
                    placeholder="Icon (emoji)"
                    value={draft.icon}
                    onChange={e => updateDraft(sub.id, { icon: e.target.value })}
                    className="rounded-full bg-background border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                  <input
                    placeholder="Latitude"
                    value={draft.lat}
                    onChange={e => updateDraft(sub.id, { lat: e.target.value })}
                    className="rounded-full bg-background border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                  <input
                    placeholder="Longitude"
                    value={draft.lng}
                    onChange={e => updateDraft(sub.id, { lng: e.target.value })}
                    className="rounded-full bg-background border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    placeholder="Image URL"
                    value={draft.image}
                    onChange={e => updateDraft(sub.id, { image: e.target.value })}
                    className="rounded-full bg-background border border-border px-4 py-2 text-sm flex-1 focus:outline-none focus:border-primary"
                  />
                  <label className="cursor-pointer rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary transition whitespace-nowrap">
                    {isUp ? 'Uploading...' : 'Upload image'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      disabled={isUp}
                      onChange={e => {
                        const f = e.target.files?.[0]
                        if (f) handleUpload(sub.id, f)
                        e.target.value = ''
                      }}
                    />
                  </label>
                </div>
                {draft.image && (
                  <img
                    src={draft.image}
                    alt="Preview"
                    className="h-24 w-auto rounded-2xl border border-border"
                  />
                )}
                <input
                  placeholder="Internal notes (optional)"
                  value={draft.notes}
                  onChange={e => updateDraft(sub.id, { notes: e.target.value })}
                  className="rounded-full bg-background border border-border px-4 py-2 text-sm w-full focus:outline-none focus:border-primary"
                />
              </div>

              {err && <div className="text-sm text-crimson">{err}</div>}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleApprove(sub)}
                  disabled={isBusy}
                  className="flex-1 rounded-full bg-rose px-6 py-3 font-semibold text-rose-foreground hover:bg-crimson transition disabled:opacity-50"
                >
                  {isBusy ? 'Working...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleReject(sub)}
                  disabled={isBusy}
                  className="flex-1 rounded-full border border-crimson px-6 py-3 font-semibold text-crimson hover:bg-crimson/10 transition disabled:opacity-50"
                >
                  {isBusy ? 'Working...' : 'Reject'}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </PageShell>
  )
}
