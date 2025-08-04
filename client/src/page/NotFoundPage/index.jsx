import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './style.scss'
import FloatingElements from '../../component/FloatingElements'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="not-found-page">
      <FloatingElements theme='error' />
      <div className="container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1>הדף לא נמצא</h1>
          <p>הדף שחיפשת לא קיים או שהוסר</p>
          
          <div className="error-actions">
            <Link to="/" className="btn btn-primary">חזור לעמוד הבית</Link>
            <button onClick={() => navigate(-1)} className="btn btn-secondary">
              חזור לדף הקודם
            </button>
          </div>
          
          <div className="suggestions">
            <h3>אולי תמצא מה שאתה מחפש כאן:</h3>
            <ul>
              <li><Link to="/">מתכונים</Link></li>
              <li><Link to="/new-recipe">יצירת מתכון חדש</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
