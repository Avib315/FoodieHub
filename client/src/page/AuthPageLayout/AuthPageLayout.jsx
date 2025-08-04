import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useAxiosRequest, { axiosRequestHandler } from '../../services/ApiRequest'

export default function AuthPageLayout({ children }) {
  const [isAuth, setIsAuth] = useState(false)
  const location = useLocation()
  useEffect(()=>{
      const {data} =  axiosRequestHandler({url:"user/isAuthenticated"})
      setIsAuth(data)
  },[])
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

