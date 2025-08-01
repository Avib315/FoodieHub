import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './style.scss'

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="about-page">
      <div className="container">
        <div className="about-content">
          <h1>עלינו</h1>
          <p>ברוכים הבאים ל-FoodieHub, הפלטפורמה המושלמת לאוהבי אוכל!</p>
          <p>כאן תוכלו למצוא מתכונים, לשתף את המתכונים האהובים עליכם ולגלות טעמים חדשים.</p>
        </div>
        </div>   
    </div>
  )
}
