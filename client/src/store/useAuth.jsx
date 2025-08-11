import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuth = create(
  persist(
    (set, get) => ({
      auth: false,
      _hasHydrated: false,
      
      login: () => {
        console.log('🔐 LOGIN called');
        set({ auth: true });
      },
      
      logout: () => {
        console.log('🚪 LOGOUT called');
        set({ auth: false });
        // Only clear this specific store's data
        localStorage.removeItem('user-auth-storage');
      },
      
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: 'user-auth-storage', // ← UNIQUE KEY
      partialize: (state) => ({ auth: state.auth }),
      onRehydrateStorage: () => {
        return (state) => {
          state?.setHasHydrated(true);
        };
      },
    }
  )
)

export default useAuth