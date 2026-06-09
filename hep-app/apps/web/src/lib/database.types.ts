export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          phone: string | null
          email: string | null
          name: string
          role: 'consumer' | 'vendor' | 'admin'
          avatar_url: string | null
          preferred_language: 'en' | 'ta' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          phone?: string | null
          email?: string | null
          name?: string
          role?: 'consumer' | 'vendor' | 'admin'
          avatar_url?: string | null
          preferred_language?: 'en' | 'ta' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string | null
          email?: string | null
          name?: string
          role?: 'consumer' | 'vendor' | 'admin'
          avatar_url?: string | null
          preferred_language?: 'en' | 'ta' | null
          updated_at?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          id: string
          user_id: string
          business_name: string
          tagline: string | null
          categories: string[]
          description: string | null
          gstin: string | null
          pan: string | null
          is_kyc_verified: boolean
          subscription_tier: 'basic' | 'pro' | 'elite'
          avg_rating: number
          total_reviews: number
          total_events: number
          reliability_score: number
          response_time_hours: number
          portfolio: Json
          packages: Json
          service_areas: string[] | null
          lat: number | null
          lng: number | null
          city: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          tagline?: string | null
          categories?: string[]
          description?: string | null
          gstin?: string | null
          pan?: string | null
          is_kyc_verified?: boolean
          subscription_tier?: 'basic' | 'pro' | 'elite'
          avg_rating?: number
          total_reviews?: number
          total_events?: number
          reliability_score?: number
          response_time_hours?: number
          portfolio?: Json
          packages?: Json
          service_areas?: string[] | null
          lat?: number | null
          lng?: number | null
          city?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          business_name?: string
          tagline?: string | null
          categories?: string[]
          description?: string | null
          gstin?: string | null
          pan?: string | null
          is_kyc_verified?: boolean
          subscription_tier?: 'basic' | 'pro' | 'elite'
          avg_rating?: number
          total_reviews?: number
          total_events?: number
          reliability_score?: number
          response_time_hours?: number
          portfolio?: Json
          packages?: Json
          service_areas?: string[] | null
          lat?: number | null
          lng?: number | null
          city?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          consumer_id: string
          title: string
          type: string
          date: string
          duration_hours: number
          guest_count: number
          venue_name: string | null
          venue_address: string
          lat: number | null
          lng: number | null
          budget_min: number
          budget_max: number
          categories_needed: string[]
          notes: string | null
          status: 'open' | 'in_progress' | 'completed' | 'cancelled'
          visibility: 'public' | 'invite_only'
          bid_deadline: string | null
          ai_suggestions: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          consumer_id: string
          title: string
          type: string
          date: string
          duration_hours?: number
          guest_count: number
          venue_name?: string | null
          venue_address: string
          lat?: number | null
          lng?: number | null
          budget_min: number
          budget_max: number
          categories_needed?: string[]
          notes?: string | null
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          visibility?: 'public' | 'invite_only'
          bid_deadline?: string | null
          ai_suggestions?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          consumer_id?: string
          title?: string
          type?: string
          date?: string
          duration_hours?: number
          guest_count?: number
          venue_name?: string | null
          venue_address?: string
          lat?: number | null
          lng?: number | null
          budget_min?: number
          budget_max?: number
          categories_needed?: string[]
          notes?: string | null
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          visibility?: 'public' | 'invite_only'
          bid_deadline?: string | null
          ai_suggestions?: Json
          updated_at?: string
        }
        Relationships: []
      }
      bids: {
        Row: {
          id: string
          event_id: string
          vendor_id: string
          category: string
          price: number
          advance_percent: number
          message: string | null
          portfolio_samples: Json
          package_id: string | null
          status: 'pending' | 'accepted' | 'declined' | 'counter' | 'withdrawn' | 'expired'
          counter_price: number | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          vendor_id: string
          category: string
          price: number
          advance_percent?: number
          message?: string | null
          portfolio_samples?: Json
          package_id?: string | null
          status?: 'pending' | 'accepted' | 'declined' | 'counter' | 'withdrawn' | 'expired'
          counter_price?: number | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          event_id?: string
          vendor_id?: string
          category?: string
          price?: number
          advance_percent?: number
          message?: string | null
          portfolio_samples?: Json
          package_id?: string | null
          status?: 'pending' | 'accepted' | 'declined' | 'counter' | 'withdrawn' | 'expired'
          counter_price?: number | null
          expires_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          event_id: string
          bid_id: string
          consumer_id: string
          vendor_id: string
          total_amount: number
          advance_amount: number
          balance_amount: number
          commission_amount: number
          advance_paid_at: string | null
          balance_paid_at: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: 'bid_accepted' | 'advance_paid' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          bid_id: string
          consumer_id: string
          vendor_id: string
          total_amount: number
          advance_amount: number
          balance_amount: number
          commission_amount: number
          advance_paid_at?: string | null
          balance_paid_at?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: 'bid_accepted' | 'advance_paid' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          advance_paid_at?: string | null
          balance_paid_at?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: 'bid_accepted' | 'advance_paid' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          reviewer_id: string
          vendor_id: string
          rating_overall: number
          rating_punctuality: number | null
          rating_quality: number | null
          rating_communication: number | null
          rating_value: number | null
          comment: string | null
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          reviewer_id: string
          vendor_id: string
          rating_overall: number
          rating_punctuality?: number | null
          rating_quality?: number | null
          rating_communication?: number | null
          rating_value?: number | null
          comment?: string | null
          is_public?: boolean
          created_at?: string
        }
        Update: {
          comment?: string | null
          is_public?: boolean
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          body: string
          action_path: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          body: string
          action_path?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          is_read?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
