export type UserRole = 'consumer' | 'vendor' | 'admin'

export type VendorCategory =
  | 'catering'
  | 'photography'
  | 'decoration'
  | 'entertainment'
  | 'av_production'
  | 'venue'
  | 'transportation'
  | 'equipment_rental'
  | 'security'
  | 'event_coordination'
  | 'cake_desserts'
  | 'invitation_design'
  | 'makeup_styling'

export type EventType =
  | 'wedding'
  | 'birthday'
  | 'corporate'
  | 'baby_shower'
  | 'housewarming'
  | 'college_fest'
  | 'product_launch'
  | 'conference'
  | 'awards_night'
  | 'team_outing'
  | 'other'

export type BidStatus = 'pending' | 'accepted' | 'declined' | 'counter' | 'withdrawn' | 'expired'

export type BookingStatus =
  | 'bid_accepted'
  | 'agreement_signed'
  | 'advance_paid'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed'

export interface User {
  id: string
  phone: string
  email?: string
  name: string
  role: UserRole
  avatar_url?: string
  preferred_language: 'en' | 'ta'
  created_at: string
}

export interface VendorProfile {
  id: string
  user_id: string
  business_name: string
  tagline?: string
  about?: string
  categories: VendorCategory[]
  gstin?: string
  pan?: string
  is_kyc_verified: boolean
  is_backup_pool: boolean
  subscription_tier: 'free' | 'growth' | 'pro'
  service_radius_km: number
  lat: number
  lng: number
  city: string
  address: string
  avg_rating: number
  total_reviews: number
  total_events: number
  repeat_booking_count: number
  response_time_hours: number
  reliability_score: number
  logo_url?: string
  portfolio: PortfolioItem[]
  packages: ServicePackage[]
  availability_blocked: string[]
  created_at: string
}

export interface PortfolioItem {
  id: string
  url: string
  type: 'image' | 'video'
  caption?: string
  event_type?: EventType
}

export interface ServicePackage {
  id: string
  name: string
  description: string
  price: number
  includes: string[]
  excludes: string[]
  min_advance_days: number
  max_guests?: number
}

export interface Event {
  id: string
  consumer_id: string
  title: string
  type: EventType
  date: string
  end_date?: string
  duration_hours: number
  venue_name?: string
  venue_address: string
  lat: number
  lng: number
  guest_count: number
  budget_min: number
  budget_max: number
  needed_categories: VendorCategory[]
  notes?: string
  visibility: 'public' | 'invite_only'
  bid_deadline: string
  status: 'open' | 'bids_received' | 'booking_in_progress' | 'confirmed' | 'completed' | 'cancelled'
  bids_count: number
  created_at: string
}

export interface Bid {
  id: string
  event_id: string
  vendor_id: string
  vendor: VendorProfile
  category: VendorCategory
  service_description: string
  price: number
  includes: string[]
  excludes: string[]
  advance_percent: number
  message?: string
  portfolio_samples: string[]
  status: BidStatus
  expires_at: string
  created_at: string
}

export interface Booking {
  id: string
  event_id: string
  bid_id: string
  consumer_id: string
  vendor_id: string
  event: Event
  vendor: VendorProfile
  bid: Bid
  status: BookingStatus
  agreement_url?: string
  advance_paid: number
  balance_due: number
  total_amount: number
  hep_commission: number
  vendor_payout: number
  payment_link?: string
  created_at: string
  completed_at?: string
}

export interface Review {
  id: string
  booking_id: string
  reviewer_id: string
  reviewee_id: string
  reviewer_role: UserRole
  overall: number
  punctuality?: number
  quality?: number
  communication?: number
  value_for_money?: number
  text?: string
  photos: string[]
  vendor_response?: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'new_event' | 'new_bid' | 'bid_accepted' | 'payment_received' | 'event_reminder' | 'review_request' | 'emergency'
  title: string
  body: string
  data?: Record<string, string>
  read: boolean
  created_at: string
}
