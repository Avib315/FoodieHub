import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './style.scss'
import FloatingElements from '../../component/FloatingElements'

export default function NotFoundPage({ type: propType = 2 , isAdmin=false }) {
  const { type: paramType } = useParams()
  const navigate = useNavigate()
  
  // Use URL parameter if available, otherwise use prop, fallback to 2
  const finalType = paramType ? parseInt(paramType) : propType
  
  const types = {
    1: "notAllowed",
    2: "notFound"
  }
  
  // Content based on type
  const getContent = () => {
    if (finalType === 1) {
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
            {finalType === 1 ? (
              <>
                <Link to="/login" className="btn btn-primary">התחבר</Link>
                <button onClick={() => navigate(-1)} className="btn btn-secondary">
                  חזור לדף הקודם
                </button>
              </>
            ) : (
              <>
                {!isAdmin && <Link to="/" className="btn btn-primary">חזור לעמוד הבית</Link>}
               <button onClick={() => navigate(-1)} className="btn btn-secondary">
                  חזור לדף הקודם
                </button>
              </>
            )}
          </div>
          {
            !isAdmin&& <>
            {finalType === 2 && (
              <div className="suggestions">
              <h3>אולי תמצא מה שאתה מחפש כאן:</h3>
              <ul>
                <li><Link to="/">מתכונים</Link></li>
                <li><Link to="/new-recipe">יצירת מתכון חדש</Link></li>
              </ul>
            </div>
          )}
          </>
        }
        </div>
      </div>
    </div>
  )
}