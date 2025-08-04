import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './style.scss'
import FloatingElements from '../../component/FloatingElements'

export default function NotFoundPage({ type = 2 }) {
  const types = {
    1: "notAllowed",
    2: "notFound"
  }
  
  const navigate = useNavigate()
  
  // Content based on type
  const getContent = () => {
    if (type === 1) {
      return {
        code: "403",
        title: "אין הרשאה",
        description: "אין לך הרשאה לגשת לדף זה",
        theme: "error"
      }
    } else {
      return {
        code: "404",
        title: "הדף לא נמצא",
        description: "הדף שחיפשת לא קיים או שהוסר",
        theme: "error"
      }
    }
  }
  
  const content = getContent()
  
  return (
    <div className="not-found-page">
      <FloatingElements theme={content.theme} />
      <div className="container">
        <div className="not-found-content">
          <div className="error-code">{content.code}</div>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          
          <div className="error-actions">
            {type === 1 ? (
              <>
                <Link to="/login" className="btn btn-primary">התחבר</Link>
                <button onClick={() => navigate(-1)} className="btn btn-secondary">
                  חזור לדף הקודם
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="btn btn-primary">חזור לעמוד הבית</Link>
                <button onClick={() => navigate(-1)} className="btn btn-secondary">
                  חזור לדף הקודם
                </button>
              </>
            )}
          </div>
          
          {type === 2 && (
            <div className="suggestions">
              <h3>אולי תמצא מה שאתה מחפש כאן:</h3>
              <ul>
                <li><Link to="/">מתכונים</Link></li>
                <li><Link to="/new-recipe">יצירת מתכון חדש</Link></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}