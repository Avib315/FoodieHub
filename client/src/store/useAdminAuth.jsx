// store/useAuth.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAdminAuth = create(
  persist(
    (set, get) => ({
      adminAuth: false,
      _hasHydrated: false,
      
      login: () => {
        set({ adminAuth: true });
      },
      
      logout: () => {
        set({ adminAuth: false });
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
      partialize: (state) => ({ adminAuth: state.adminAuth }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
)

export default useAdminAuth