import React from 'react'
import { useLocation } from 'react-router-dom'

export default function AuthPageLayout({ children }) {
  const location = useLocation()
  
  // Check if current page is an auth page
  const isAuthPage = location.pathname === '/login' || 
                     location.pathname === '/signup' || 
                     location.pathname === '/register' ||
                     location.pathname.includes('/auth')

  return (
    <div className="auth-layout">
      {/* Only show NavBar on non-auth pages, or show a different NavBar for auth pages */}
      {/* {!isAuthPage && <NavBar />} */}
      
      {/* If you want a different navbar for auth pages, uncomment below: */}
      {/* {isAuthPage && <AuthNavBar />} */}
      
      <main className="auth-layout-content">
        {children}
      </main>
    </div>
  )
}

// Alternative version if you want to always show NavBar but style it differently:
/*
export default function AuthPageLayout({ children }) {
  const location = useLocation()
  
  const isAuthPage = location.pathname === '/login' || 
                     location.pathname === '/signup' || 
                     location.pathname === '/register' ||
                     location.pathname.includes('/auth')

  return (
    <div className={`auth-layout ${isAuthPage ? 'auth-page' : ''}`}>
      <NavBar isAuthPage={isAuthPage} />
      <main className="auth-layout-content">
        {children}
      </main>
    </div>
  )
}
*/