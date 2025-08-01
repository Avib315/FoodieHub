import React from 'react'
import './style.scss'
import FloatingElements from '../../component/FloatingElements'

export default function LoadingPage() {
  return (
    <div className="loading-page">
  <FloatingElements theme='loading'/>
      <div className="loading-spinner">
        <h2>טוען...</h2>
        <p>אנא המתן בזמן שאנחנו מכינים הכל בשבילך</p>
      </div>
    </div>
  )
}
