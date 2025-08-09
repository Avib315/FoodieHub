// thezostad/useAuth.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuth = create(
  persist(
    (set, get) => ({
      // User data state



    }),

  )
)

export default useAuth