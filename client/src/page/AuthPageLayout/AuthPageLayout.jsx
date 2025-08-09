
import useAuth from '../../store/useAuth'

export default function AuthPageLayout({ children }) {
  const {auth , setAuth} = useAuth()
  const isAuthPage = location.pathname === '/login' || 
                     location.pathname === '/signup' || 
                     location.pathname === '/register' ||
                     location.pathname.includes('/auth')

  return (
    <div className="auth-layout">
      <main className="auth-layout-content">
        {children}
      </main>
    </div>
  )
}

