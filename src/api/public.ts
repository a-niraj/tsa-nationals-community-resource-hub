import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase-server'

export const getResources = createServerFn({ method: 'GET' }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from('resources')
    .select('*')
    .order('id', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
})

export const getLikes = createServerFn({ method: 'GET' }).handler(async () => {
  const { data, error } = await supabaseAdmin.from('resource_likes').select('resource_id')
  if (error) throw new Error(error.message)
  const counts: Record<number, number> = {}
  for (const row of data ?? []) {
    counts[row.resource_id] = (counts[row.resource_id] ?? 0) + 1
  }
  return counts
})

const likedResourcesSchema = z.object({
  userId: z.string().trim().min(1).max(64),
})

export const getLikedResources = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => likedResourcesSchema.parse(data))
  .handler(async ({ data }) => {
    const { data: likedResources, error } = await supabaseAdmin
      .from('resource_likes')
      .select('resource_id')
      .eq('user_id', data.userId)
    if (error) throw new Error(error.message)
    return (likedResources ?? []).map(row => row.resource_id)
  })

const toggleLikeSchema = z.object({
  resourceId: z.number().int().positive(),
  userId: z.string().trim().min(1).max(64),
})

export const toggleLike = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => toggleLikeSchema.parse(data))
  .handler(async ({ data }) => {
    const { resourceId, userId } = data

    const { data: existing, error: lookupError } = await supabaseAdmin
      .from('resource_likes')
      .select('user_id')
      .eq('user_id', userId)
      .eq('resource_id', resourceId)
      .maybeSingle()
    if (lookupError) throw new Error(lookupError.message)

    let liked: boolean
    if (existing) {
      const { error } = await supabaseAdmin
        .from('resource_likes')
        .delete()
        .eq('user_id', userId)
        .eq('resource_id', resourceId)
      if (error) throw new Error(error.message)
      liked = false
    } else {
      const { error } = await supabaseAdmin
        .from('resource_likes')
        .insert({ user_id: userId, resource_id: resourceId })
      if (error) throw new Error(error.message)
      liked = true
    }

    const { count, error: countError } = await supabaseAdmin
      .from('resource_likes')
      .select('*', { count: 'exact', head: true })
      .eq('resource_id', resourceId)
    if (countError) throw new Error(countError.message)

    return { liked, count: count ?? 0 }
  })

const submissionSchema = z.object({
  name: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(2000),
  address: z.string().trim().max(300).optional().or(z.literal('')),
  phone: z
    .string()
    .min(1)
    .max(50)
    .transform(s => s.replace(/\D/g, ''))
    .refine(s => s.length >= 7 && s.length <= 15, 'phone must be 7 to 15 digits'),
  website: z.string().trim().max(300).optional().or(z.literal('')),
  contact: z.string().trim().min(1).max(200),
})

export const submitResource = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => submissionSchema.parse(data))
  .handler(async ({ data }) => {
    const { address, website, ...rest } = data
    const { error } = await supabaseAdmin.from('pending_submissions').insert({
      ...rest,
      address: address || null,
      website: website || null,
    })
    if (error) throw new Error(error.message)
    return { ok: true }
  })

const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(5000),
})

export const submitContactMessage = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from('contact_messages').insert(data)
    if (error) throw new Error(error.message)
    return { ok: true }
  })
