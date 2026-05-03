export type Resource = {
  id: number
  name: string
  category: string
  description: string
  address: string | null
  phone: string | null
  website: string | null
  icon: string | null
  image: string | null
  lat: number | null
  lng: number | null
  created_at: string
}

export type PendingSubmission = {
  id: number
  name: string
  category: string
  description: string
  address: string | null
  phone: string
  website: string | null
  contact: string
  status: 'pending' | 'approved' | 'rejected'
  notes: string | null
  created_at: string
}
