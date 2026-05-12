import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PageShell } from '@/components/PageShell'
import { Reveal } from '@/components/Reveal'
import { submitResource } from '@/api/public'

const CATEGORIES = [
  'Food & Nutrition',
  'Health & Wellness',
  'Education',
  'Housing',
  'Employment',
  'Senior Services',
  'Legal',
  'Family Services',
  'Community Services',
  'Youth Services',
  'Recreation',
  'Arts & Culture',
  'Community Events',
  'Other',
]

type FormData = {
  name: string
  category: string
  description: string
  address: string
  website: string
  contact: string
}

const emptyForm: FormData = {
  name: '',
  category: '',
  description: '',
  address: '',
  website: '',
  contact: '',
}

export const Route = createFileRoute('/submit')({
  head: () => ({
    meta: [
      { title: 'Submit a Resource — Seattle Together' },
      {
        name: 'description',
        content: 'Know a great Seattle-area resource we are missing? Suggest it and help your neighbors.',
      },
    ],
  }),
  component: SubmitPage,
})

function SubmitPage() {
  const [form, setForm] = useState<FormData>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function update<K extends keyof FormData>(key: K, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormData, string>> = {}
    if (!form.name.trim()) next.name = 'Required'
    if (!form.category) next.category = 'Required'
    if (!form.description.trim()) next.description = 'Required'
    if (!form.contact.trim()) next.contact = 'Required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      await submitResource({ data: form })
      setSubmitted(true)
      setForm(emptyForm)
    } catch (err) {
      setSubmitError(String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageShell
      eyebrow="Contribute"
      title="Suggest a resource"
      intro="Know a Seattle-area service, nonprofit, or program we should list? Send it our way and we'll review it."
    >
      <div className="pb-16 max-w-2xl">
        {submitted && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-6 rounded-3xl bg-sage text-sage-foreground p-5"
          >
            <div className="font-bold">Got it</div>
            <p className="text-sm mt-1 opacity-80">
              We'll take a look and add it if it fits.
            </p>
          </div>
        )}

        <Reveal>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-3xl bg-card border border-border p-5 sm:p-7 space-y-5"
        >
          <Field label="Resource name" required error={errors.name}>
            <input
              type="text"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="e.g., Hopelink"
              className={inputClass(!!errors.name)}
            />
          </Field>

          <Field label="Category" required error={errors.category}>
            <select
              value={form.category}
              onChange={e => update('category', e.target.value)}
              className={inputClass(!!errors.category)}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Description" required error={errors.description}>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="What services do they offer? Who can use them?"
              rows={4}
              className={`rounded-3xl bg-background border border-border px-4 py-3 w-full focus:outline-none focus:border-primary ${
                errors.description ? 'border-crimson' : ''
              }`}
            />
          </Field>

          <Field label="Address">
            <input
              type="text"
              value={form.address}
              onChange={e => update('address', e.target.value)}
              placeholder="Street, city"
              className={inputClass(false)}
            />
          </Field>

          <Field label="Website">
            <input
              type="url"
              value={form.website}
              onChange={e => update('website', e.target.value)}
              placeholder="example.org"
              className={inputClass(false)}
            />
          </Field>

          <Field label="Your name or organization" required error={errors.contact}>
            <input
              type="text"
              value={form.contact}
              onChange={e => update('contact', e.target.value)}
              placeholder="So we know who suggested it"
              className={inputClass(!!errors.contact)}
            />
          </Field>

          {submitError && (
            <div role="alert" className="text-sm text-crimson">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-rose px-6 py-3 font-semibold text-rose-foreground hover:bg-crimson transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        </Reveal>
      </div>
    </PageShell>
  )
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-foreground/80 mb-2">
        {label}
        {required && <span className="text-crimson"> *</span>}
      </span>
      {children}
      {error && <span className="block mt-1 text-xs text-crimson">{error}</span>}
    </label>
  )
}

function inputClass(hasError: boolean): string {
  return `rounded-full bg-background border border-border px-4 py-3 w-full focus:outline-none focus:border-primary ${
    hasError ? 'border-crimson' : ''
  }`
}
