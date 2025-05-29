export interface Workshop {
  id?: number
  title: string
  slug: string
  description: string
  image: string
  sessions: number
  duration: string
  capacity: number
  price: number
  featured: boolean
  status: string
  benefits: string[]
  workshop_code?: string
  zoomLink?: string
  category?: string // Add this line
  upcoming?: {
    id?: number
    date: string
    time: string
    slots: number
    enrolled: number
  }[]
  createdAt?: string
  updatedAt?: string
  affiliates?: any[]
}
