// thezostad/useAuth.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuth = create(
  persist(
    (set, get) => ({
      auth: false,
      
      login: () => set({ auth: true }),
      logout: () => set({ auth: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ auth: state.auth }),
    }
  )
)

export default useAuth