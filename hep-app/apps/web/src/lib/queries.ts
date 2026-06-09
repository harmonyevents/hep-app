import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'
import type { Event, Bid } from '@/types'

// Events
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
  })
}

export function useMyEvents(userId?: string) {
  return useQuery({
    queryKey: ['my-events', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, bids(count)')
        .eq('consumer_id', userId!)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
  })
}

export function useMyBids(vendorId?: string) {
  return useQuery({
    queryKey: ['my-bids', vendorId],
    enabled: !!vendorId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bids')
        .select('*, events(*)')
        .eq('vendor_id', vendorId!)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
  })
}

export function useNearbyEvents(lat: number, lng: number, radiusKm = 50) {
  return useQuery({
    queryKey: ['nearby-events', lat, lng, radiusKm],
    queryFn: async () => {
      // Simple bounding box query without PostGIS
      const delta = radiusKm / 111 // roughly 1 degree = 111km
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'open')
        .gte('lat', lat - delta)
        .lte('lat', lat + delta)
        .gte('lng', lng - delta)
        .lte('lng', lng + delta)
      if (error) throw error
      return data
    }
  })
}

export function useVendorProfile(userId?: string) {
  return useQuery({
    queryKey: ['vendor-profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', userId!)
        .single()
      if (error && error.code !== 'PGRST116') throw error
      return data
    }
  })
}

// Mutations
export function useSubmitBid() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (bid: Omit<Bid, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('bids').insert(bid as any).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-bids'] })
  })
}

export function usePostEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('events').insert(event as any).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events', 'my-events'] })
  })
}

export function useAcceptBid() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ bidId, eventId }: { bidId: string; eventId: string }) => {
      // Accept the bid
      const { error: bidError } = await supabase
        .from('bids')
        .update({ status: 'accepted' as const })
        .eq('id', bidId)
      if (bidError) throw bidError

      // Decline all other bids for same category
      // Create booking
      return { bidId, eventId }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-events'] })
      qc.invalidateQueries({ queryKey: ['events'] })
    }
  })
}
