import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import type { User, UserRole } from '@/types'

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (v: boolean) => void
  logout: () => Promise<void>
  sendOtp: (phone: string) => Promise<{ error?: string }>
  verifyOtp: (phone: string, token: string) => Promise<{ error?: string }>
  updateProfile: (data: Partial<User>) => Promise<{ error?: string }>
  mockLogin: (role: UserRole) => void  // keep for dev
  refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),

      sendOtp: async (email: string) => {
        set({ isLoading: true })
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim().toLowerCase(),
          options: { shouldCreateUser: true },
        })
        set({ isLoading: false })
        return error ? { error: error.message } : {}
      },

      verifyOtp: async (email: string, token: string) => {
        set({ isLoading: true })
        const { data, error } = await supabase.auth.verifyOtp({
          email: email.trim().toLowerCase(),
          token,
          type: 'email',
        })
        if (error) { set({ isLoading: false }); return { error: error.message } }

        if (data.user) {
          await get().refreshUser()
        }
        set({ isLoading: false })
        return {}
      },

      refreshUser: async () => {
        const { data: { user: sbUser } } = await supabase.auth.getUser()
        if (!sbUser) return

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sbUser.id)
          .single()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const profile = profileData as any
        if (profile) {
          set({
            user: {
              id: profile.id,
              phone: profile.phone || sbUser.phone || '',
              email: profile.email || sbUser.email || '',
              name: profile.name,
              role: (profile.role as UserRole) || 'consumer',
              avatar_url: profile.avatar_url || undefined,
              preferred_language: (profile.preferred_language as 'en' | 'ta') || 'en',
              created_at: profile.created_at,
            }
          })
        }
      },

      updateProfile: async (data) => {
        const user = get().user
        if (!user) return { error: 'Not authenticated' }

        const { error } = await supabase
          .from('profiles')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .update({ ...(data as any), updated_at: new Date().toISOString() })
          .eq('id', user.id)

        if (!error) {
          set({ user: { ...user, ...data } })
        }
        return error ? { error: error.message } : {}
      },

      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null })
      },

      mockLogin: (role: UserRole) => {
        set({
          user: {
            id: `mock-${role}-1`,
            phone: '+91 98765 43210',
            email: 'reach.harmonyevents@gmail.com',
            name: role === 'vendor' ? 'Sree Caterers' : role === 'admin' ? 'Admin User' : 'Priya Sharma',
            role,
            preferred_language: 'en',
            created_at: new Date().toISOString(),
          }
        })
      },
    }),
    {
      name: 'hep-auth',
      partialize: (s) => ({ user: s.user }),
    }
  )
)
