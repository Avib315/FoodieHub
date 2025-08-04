import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './style.scss'
import Input from '../../component/Input'
import FloatingElements from '../../component/FloatingElements'
import axiosRequest from '../../services/axiosRequest'
export default function SignupPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
    subscribeNewsletter: false
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('')

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    // Check password strength in real-time
    if (name === 'password') {
      checkPasswordStrength(value)
    }
  }

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength('weak')
    } else if (password.length < 8) {
      setPasswordStrength('medium')
    } else if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)) {
      setPasswordStrength('strong')
    } else {
      setPasswordStrength('medium')
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'שם פרטי הוא שדה חובה'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'שם משפחה הוא שדה חובה'
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'אימות סיסמה הוא שדה חובה'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'הסיסמאות אינן תואמות'
    }

    if (formData.phone && !/^05\d{8}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'מספר טלפון לא תקין (05xxxxxxxx)'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'חובה להסכים לתנאי השימוש'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const data = await axiosRequest({url: "user/register" , method:"POST" , body:formData })
      console.log(data);
      
      if(data){

      }
      console.log('Registration data:', data)

      // Redirect to login or dashboard
      navigate('/login', {
        state: { message: 'חשבון נוצר בהצלחה! נא להתחבר.' }
      })

    } catch (error) {
      setErrors({ general: 'שגיאה ביצירת החשבון. נסה שוב.' })
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="signup-page">
      <FloatingElements theme="signup" />
      <div className="container">
        <div className="hero-section">
          <h1>הצטרף אלינו</h1>
          <p>צור חשבון והתחל לגלות, לשתף ולשמור את המתכונים הטובים ביותר</p>

        </div>

        <div className="signup-container">
          <div className="logo">
            <h2>🍴 FOODIEHOB</h2>
            <p>צור חשבון חדש</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            {/* General error message */}
            {errors.general && (
              <div className="error-message">
                {errors.general}
              </div>
            )}

            {/* Name fields */}
            <div className="name-fields">
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="שם פרטי"
                label="שם פרטי"
                error={errors.firstName}
                required
                disabled={isLoading}
                autoComplete="given-name"
              />

              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="שם משפחה"
                label="שם משפחה"
                error={errors.lastName}
                required
                disabled={isLoading}
                autoComplete="family-name"
              />
            </div>

            {/* Email input */}
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="כתובת אימייל"
              label="אימייל"
              error={errors.email}
              required
              disabled={isLoading}
              autoComplete="email"
            />

            {/* Phone input */}
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="מספר טלפון (אופציונלי)"
              label="טלפון"
              error={errors.phone}
              disabled={isLoading}
              autoComplete="tel"
              helpText="פורמט: 05xxxxxxxx"
            />

            {/* Password input */}
            <div className="password-input-container">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="סיסמה"
                label="סיסמה"
                error={errors.password}
                required
                disabled={isLoading}
                autoComplete="new-password"
              />

              {/* Password strength indicator */}
              {formData.password && (
                <div className={`password-strength ${passwordStrength}`}>
                  <div className="strength-bar">
                    <div className="strength-fill"></div>
                  </div>
                  <span className="strength-text">
                    {passwordStrength === 'weak' && 'חלשה'}
                    {passwordStrength === 'medium' && 'בינונית'}
                    {passwordStrength === 'strong' && 'חזקה'}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password input */}
            <div className="password-input-container">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="אימות סיסמה"
                label="אימות סיסמה"
                error={errors.confirmPassword}
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            {/* Checkboxes */}
            <div className="checkboxes">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
                <label htmlFor="agreeToTerms">
                  אני מסכים ל<Link to="/terms" target="_blank">תנאי השימוש</Link> ול<Link to="/privacy" target="_blank">מדיניות הפרטיות</Link>
                </label>
                {errors.agreeToTerms && (
                  <span className="checkbox-error">{errors.agreeToTerms}</span>
                )}
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="subscribeNewsletter"
                  name="subscribeNewsletter"
                  checked={formData.subscribeNewsletter}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <label htmlFor="subscribeNewsletter">
                  קבל עדכונים על מתכונים חדשים ומבצעים
                </label>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className={`signup-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              <span className="btn-text">
                {isLoading ? 'יוצר חשבון...' : 'צור חשבון'}
              </span>
              {isLoading && <div className="spinner"></div>}
            </button>
          </form>

          <div className="divider">
            <span>או</span>
          </div>



          {/* Login link */}
          <div className="login-link">
            כבר יש לך חשבון? <Link to="/login" className="login-link-btn">התחבר כאן</Link>
          </div>
        </div>
      </div>
    </div>
  )
}