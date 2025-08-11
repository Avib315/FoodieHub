// store/useAdminAuth.js  
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAdminAuth = create(
  persist(
    (set, get) => ({
      adminAuth: false,
      _hasHydrated: false,
      
      adminLogin: () => {
        set({ adminAuth: true });
      },
      
      adminLogout: () => {
        set({ adminAuth: false });
        // Only clear this specific store's data
        localStorage.removeItem('admin-auth-storage');
      },
      
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: 'admin-auth-storage', // ← DIFFERENT UNIQUE KEY
      partialize: (state) => ({ adminAuth: state.adminAuth }),
      onRehydrateStorage: () => {
        return (state) => {
          state?.setHasHydrated(true);
        };
      },
    }
  )
)

export default useAdminAuth