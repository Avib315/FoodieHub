import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './style.scss'
const adminLog = [

]
export default function AdminPage() {

  return (
    <div className="about-page">
      <div className='logs'>
        <h2>יומן פעולות מנהל</h2>
        <ul>
          {adminLog.length > 0 ? adminLog.map((log, index) => (
            <li key={index}>
              <span className="log-action">{log.action}</span>
            </li>
          )) : (
            <li>לא נמצאו פעולות</li>
          )}
        </ul>
      </div>
      <div className='actions'>
        <Link to="/admin-users-panel" className='action'>ניהול משתמשים</Link>
        <Link to="/admin-recipes-panel" className='action'>ניהול מתכונים</Link>
      </div>

    </div>
  )
}
