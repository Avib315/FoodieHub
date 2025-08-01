import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../../component/Input'
import './style.scss'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // API call to send reset email
      console.log('Sending reset email to:', email)
      setIsSubmitted(true)
    } catch (error) {
      setError('שגיאה בשליחת האימייל. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="forgot-password-page">
        <div className="container">
          <div className="success-message">
            <h1>אימייל נשלח בהצלחה</h1>
            <p>בדוק את תיבת הדואר שלך לקישור איפוס הסיסמה</p>
            <Link to="/login" className="btn btn-primary">חזור להתחברות</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="forgot-password-page">
      <div className="container">
        <div className="forgot-password-form">
          <h1>שכחת סיסמה?</h1>
          <p>הכנס את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה</p>
          
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <Input
              type="email"
              placeholder="כתובת אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'שולח...' : 'שלח קישור איפוס'}
            </button>
          </form>
          
          <div className="auth-links">
            <Link to="/login">חזור להתחברות</Link>
            <Link to="/signup">אין לך חשבון? הרשם</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
