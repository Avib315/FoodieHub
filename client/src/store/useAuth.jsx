// thezostad/useAuth.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuth = create(
  persist(
    (set, get) => ({
      // User data state
      auth: false,

      // Set authentication status
      setAuth: (status) => {
        set({ auth: status })
      },
      logout:(state)=>{
        set({ auth: false })

      },
      // Get authentication status
      getAuth: () => {
        return get().auth
      },
    })
  )
)

export default useAuth