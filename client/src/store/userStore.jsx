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
      
      addToSaved: () => set((state) => ({
        ...state,
        user: state.user ? {
          ...state.user,
          savedRecipesCount: (state.user.savedRecipesCount || 0) + 1
        } : state.user
      })),
      
      removedSaved: () => set((state) => ({
        ...state,
        user: state.user ? {
          ...state.user,
          savedRecipesCount: Math.max((state.user?.savedRecipesCount || 0) - 1, 0)
        } : state.user
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
    {
      name: 'user-storage', // unique name for localStorage key
    }
  )
)

export default useUserStore