import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase-server'
import { checkAdminPassword } from '@/lib/admin-auth'

const STORAGE_BUCKET = 'resource-images'
const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

const passwordOnly = z.object({ password: z.string() })

export const verifyAdmin = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => passwordOnly.parse(data))
  .handler(async ({ data }) => {
    if (!checkAdminPassword(data.password)) throw new Error('unauthorized')
    return { ok: true }
  })

export const getPendingSubmissions = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => passwordOnly.parse(data))
  .handler(async ({ data }) => {
    if (!checkAdminPassword(data.password)) throw new Error('unauthorized')
    const { data: rows, error } = await supabaseAdmin
      .from('pending_submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return rows ?? []
  })

const approveSchema = z.object({
  password: z.string(),
  id: z.number().int().positive(),
  icon: z.string().trim().max(20).optional(),
  image: z.string().trim().max(500).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  notes: z.string().trim().max(2000).optional(),
})

export const approveSubmission = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => approveSchema.parse(data))
  .handler(async ({ data }) => {
    if (!checkAdminPassword(data.password)) throw new Error('unauthorized')

    const { data: submission, error: fetchError } = await supabaseAdmin
      .from('pending_submissions')
      .select('*')
      .eq('id', data.id)
      .single()
    if (fetchError || !submission) throw new Error('submission not found')
    if (submission.status !== 'pending') throw new Error(`submission already ${submission.status}`)

    const { error: insertError } = await supabaseAdmin.from('resources').insert({
      name: submission.name,
      category: submission.category,
      description: submission.description,
      address: submission.address,
      phone: submission.phone || null,
      website: submission.website,
      icon: data.icon ?? null,
      image: data.image ?? null,
      lat: data.lat ?? null,
      lng: data.lng ?? null,
    })
    if (insertError) throw new Error(insertError.message)

    const { error: updateError } = await supabaseAdmin
      .from('pending_submissions')
      .update({ status: 'approved', notes: data.notes ?? submission.notes })
      .eq('id', data.id)
    if (updateError) throw new Error(updateError.message)

    return { ok: true }
  })

const rejectSchema = z.object({
  password: z.string(),
  id: z.number().int().positive(),
  notes: z.string().trim().max(2000).optional(),
})

export const rejectSubmission = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => rejectSchema.parse(data))
  .handler(async ({ data }) => {
    if (!checkAdminPassword(data.password)) throw new Error('unauthorized')

    const { data: submission, error: fetchError } = await supabaseAdmin
      .from('pending_submissions')
      .select('status')
      .eq('id', data.id)
      .single()
    if (fetchError || !submission) throw new Error('submission not found')
    if (submission.status !== 'pending') throw new Error(`submission already ${submission.status}`)

    const { error } = await supabaseAdmin
      .from('pending_submissions')
      .update({ status: 'rejected', notes: data.notes ?? null })
      .eq('id', data.id)
    if (error) throw new Error(error.message)
    return { ok: true }
  })

export const uploadImage = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error('expected FormData')
    return data
  })
  .handler(async ({ data }) => {
    const password = data.get('password')
    if (typeof password !== 'string' || !checkAdminPassword(password)) {
      throw new Error('unauthorized')
    }

    const file = data.get('file')
    if (!(file instanceof File)) throw new Error('missing file')
    if (!ALLOWED_TYPES.has(file.type)) throw new Error(`unsupported type: ${file.type || 'unknown'}`)
    if (file.size > MAX_BYTES) throw new Error(`file too large (max ${MAX_BYTES / 1024 / 1024} MB)`)
    if (file.size === 0) throw new Error('empty file')

    const ext = EXT_BY_TYPE[file.type]
    const random = Math.random().toString(36).slice(2, 10)
    const path = `${Date.now()}-${random}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(path, arrayBuffer, {
        contentType: file.type,
        cacheControl: '31536000',
        upsert: false,
      })
    if (uploadError) throw new Error(uploadError.message)

    const { data: urlData } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(path)
    return { url: urlData.publicUrl, path }
  })
