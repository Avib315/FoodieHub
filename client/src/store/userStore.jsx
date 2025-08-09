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
      addToSaved: () => set((state)=>({
        ...state,
        savedRecipesCount: state.user?.savedRecipesCount + 1
      })),
      removedSaved:  () => set((state)=>({
        ...state,
        savedRecipesCount: state.user?.savedRecipesCount -1
      })),
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