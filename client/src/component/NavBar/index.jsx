import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  AiFillHome, 
  AiOutlineUser, 
  AiOutlineShoppingCart, 
  AiOutlineBell, 
  AiOutlinePlusCircle, 
  AiOutlineSetting 
} from "react-icons/ai"
import './style.scss'

export default function NavBar() {
  const navArr = [
    { name: 'Home', path: '/', icon: <AiFillHome />, label: 'בית' },
    { name: 'Personal Area', path: '/personal-area', icon: <AiOutlineUser />, label: 'איזור אישי' },
    // { name: 'Shopping List', path: '/shopping-list', icon: <AiOutlineShoppingCart />, label: 'קניות' },
    { name: 'Notifications', path: '/notifications', icon: <AiOutlineBell />, label: 'התראות', badge: 3 },
    { name: 'New Recipe', path: '/new-recipe', icon: <AiOutlinePlusCircle />, label: 'הוסף מתכון' },
    { name: 'Settings', path: '/settings', icon: <AiOutlineSetting />, label: 'הגדרות' }
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3> FoodieHob</h3>
          <span>🍳</span>
        </div>
        {navArr.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path} 
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
            aria-label={item.label}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge && <div className="badge">{item.badge}</div>}
          </NavLink>
        ))}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="bottom-nav">
        {navArr.slice(0, 4).map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path} 
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
            aria-label={item.label}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge && <div className="badge">{item.badge}</div>}
          </NavLink>
        ))}
      </div>
    </>
  )
}