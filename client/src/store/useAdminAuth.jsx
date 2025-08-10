// store/useAuth.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAdminAuth = create(
  persist(
    (set, get) => ({
      auth: false,
      _hasHydrated: false,
      
      login: () => {
        set({ auth: true });
      },
      
      logout: () => {
        set({ auth: false });
        // Clear the persisted storage on logout
        localStorage.removeItem('auth-storage');
      },
      
      setHasHydrated: (state) => {
        console.log('Setting hydrated to:', state);
        set({ _hasHydrated: state });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ auth: state.auth }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
)

export default useAdminAuth