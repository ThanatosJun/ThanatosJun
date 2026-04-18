import { create } from 'zustand'

interface AuthStore {
  isAdmin: boolean
  error: string | null
  setAdmin: (isAdmin: boolean) => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAdmin: false,
  error: null,
  setAdmin: (isAdmin) => set({ isAdmin }),
  setError: (error) => set({ error }),
}))
