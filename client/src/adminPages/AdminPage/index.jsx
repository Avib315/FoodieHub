import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './style.scss'

export default function AdminPage() {

  return (
    <div className="about-page">
    <div className='logs'></div>
    <div className='actions'>
      <div className='recpiesWatingForApproval'></div>
      <div className='allRecepies' > 
        
        <table>
          <th>יוזר</th>
          <th>שם מתכון</th>
          <th>קישור למתכון</th>
          <th>סטטוס</th>
          </table>
           </div>
      <div ></div>
    </div>
    </div>
  )
}
