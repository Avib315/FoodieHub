import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './style.scss'
import Input from '../../component/Input'
import FloatingElements from '../../component/FloatingElements'
import axiosRequest from '../../services/axiosRequest'
import useAuth from '../../store/useAuth'
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const { login } = useAuth()
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const nav = useNavigate()
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'אימייל הוא שדה חובה'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה'
    }

    if (!formData.password) {
      newErrors.password = 'סיסמה היא שדה חובה'
    } else if (formData.password.length < 6) {
      newErrors.password = 'סיסמה חייבת להכיל לפחות 6 תווים'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setSuccessMessage('')

    try {
      // Simulate API call

      const data = await axiosRequest({ url: "user/login", method: "POST", body: formData })
      console.log(data);

      if (data?.success === true || data.data?.success === true) {
        nav("/")
        login()
        setSuccessMessage('התחברת בהצלחה!')
      }

      else {
        setErrors({ general: 'שגיאה בהתחברות. נסה שוב.' })
      }


    } catch (error) {
      console.log(error);

      setErrors({ general: 'שגיאה בהתחברות. נסה שוב.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="login-page">
      <FloatingElements />

      <div className="container">
        <div className="hero-section">
          <h1>ברוכים הבאים</h1>
          <p>גלו אלפי מתכונים טעימים, שתפו את המתכונים שלכם והצטרפו לקהילה הקולינרית הגדולה ביותר בישראל</p>
        </div>

        <div className="login-container">
          <div className="logo">
            <h2> FOODIEHOB</h2>
            <p>המקום שלכם למתכונים מושלמים</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* General error message */}
            {errors.general && (
              <div className="error-message">
                {errors.general}
              </div>
            )}

            {/* Success message */}
            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}

            {/* Email input */}
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="הכנס כתובת אימייל"
              label="אימייל"
              iconPosition="right"
              error={errors.email}
              required
              disabled={isLoading}
              autoComplete="email"
            />

            {/* Password input */}
            <div className="password-input-container">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="הכנס סיסמה"
                label="סיסמה"
                icon={
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="password-toggle"
                    aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                  >
                  </button>
                }
                iconPosition="right"
                error={errors.password}
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              <span className="btn-text">
                {isLoading ? 'מתחבר...' : 'התחבר'}
              </span>
              {isLoading && <div className="spinner"></div>}
            </button>
          </form>

          <div className="register-link">
            אין לך חשבון? <Link to="/signup" className="register-link-btn">הרשם כאן</Link>
          </div>
          <div className="register-link">
            <Link to="/admin-login" className="register-link-btn">התחבר כמנהל</Link>
          </div>
        </div>
      </div>
    </div>
  )
}