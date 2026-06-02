import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (v: boolean) => void
  logout: () => void
  mockLogin: (role: UserRole) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, token: null }),
      mockLogin: (role) => set({
        user: {
          id: `mock-${role}-1`,
          phone: '+91 90252 34564',
          email: 'reach.harmonyevents@gmail.com',
          name: role === 'vendor' ? 'Sree Caterers' : 'Tharaneeshwaran V U',
          role,
          preferred_language: 'en',
          created_at: new Date().toISOString(),
        },
        token: `mock-token-${role}`,
      }),
    }),
    { name: 'hep-auth' }
  )
)
