// thezostad/userStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUserStore = create(
  persist(
    (set, get) => ({
      // User data state
      user: null,

      setUser: (userData) => set({ 
        user: userData, 
      }),

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      clearUser: () => set({ 
        user: null, 
      }),

      setError: (error) => set({ 
        error: error 
      }),


    }),

  )
)

export default useUserStore