import React, { useState } from 'react';
import './style.scss';
import axiosRequest from '../../services/axiosRequest';
import Input from '../../component/Input';
import { Link, useNavigate } from 'react-router-dom'
import useAdminAuth from '../../store/useAdminAuth';

export default function AdminLogin() {
  const { adminLogin } = useAdminAuth()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const nav = useNavigate();
  const checkValidation = () => {
    const newErrors = {};

    if (!email || email.trim() === '') {
      newErrors.email = 'כתובת אימייל נדרשת';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'אנא הכנס כתובת אימייל תקינה';
    }

    if (!password || password.trim() === '') {
      newErrors.password = 'סיסמה נדרשת';
    } else if (password.length < 6) {
      newErrors.password = 'הסיסמה חייבת להכיל לפחות 6 תווים';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!checkValidation()) {
      return;
    }

    setLoading(true);


    const response = await axiosRequest({
      url: '/admin/login', body: {
        email: email.trim(),
        password
      }
    });
    if (response?.success === false) {
      setLoading(false);
      setMessage(response.message || 'התחברות נכשלה, אנא נסה שוב');
      return;
    }
    else {
      setLoading(false);
      setTimeout(() => {
        nav('/admin-panel');
        adminLogin()
      }, 2000);
    }
    console.log('Login successful:', response.data);
    setMessage('התחברות מוצלחת! מפנה...');

  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;

    if (field === 'email') {
      setEmail(value);
      if (errors.email && value.trim() !== '') {
        setErrors(prev => ({ ...prev, email: null }));
      }
    } else if (field === 'password') {
      setPassword(value);
      if (errors.password && value.trim() !== '') {
        setErrors(prev => ({ ...prev, password: null }));
      }
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-header">
          <h1>התחברות מנהל</h1>
          <p>אנא הכנס את הפרטים שלך כדי לגשת לפאנל הניהול</p>
        </div>

          <div className="login-form">
        <form onSubmit={loginHandler}>
            <Input
              error={!!errors.email}
              label="כתובת אימייל"
              type="email"
              value={email}
              onChange={handleInputChange('email')}
              placeholder="הכנס את כתובת האימייל שלך"
              disabled={loading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}

            <Input
              error={!!errors.password}
              label="סיסמה"
              type="password"
              value={password}
              onChange={handleInputChange('password')}
              placeholder="הכנס את הסיסמה שלך"
              disabled={loading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}

            {message && (
              <div className={`message ${message.includes('מוצלחת') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
          
            >
              {loading ? 'מתחבר...' : 'התחבר'}
            </button>
        </form>

            <div className="user-link">
              <Link to="/login" className="register-link-btn">התחבר כאורח</Link>
            </div>

          </div>

      </div>
    </div>
  );
}