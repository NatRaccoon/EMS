import { create } from 'zustand'

interface AuthState {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,

  setToken: (token: string) => {
    set({ token })
    document.cookie = `token=${token}; path=/`
  },

  clearToken: () => {
    set({ token: null })
    document.cookie = 'token=; Max-Age=0; path=/'
  },

  isAuthenticated: () => {
    return !!get().token
  }
}))
