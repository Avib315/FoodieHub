import React, { useState } from 'react'
import { 
  AiOutlineClockCircle, 
  AiOutlineUser, 
  AiOutlineHeart, 
  AiFillHeart,
  AiFillStar,
  AiOutlineStar 
} from 'react-icons/ai'
import { MdSignalCellularAlt } from 'react-icons/md'
import './style.scss'

export default function RecipeCard({ recipe }) {
  const [isSaved, setIsSaved] = useState(false)
  
  // Destructure recipe data with fallbacks
  const { 
    userName = 'משתמש לא ידוע', 
    recipeName = 'מתכון ללא שם', 
    image = '', 
    dateCreated = 'לא ידוע', 
    desc = 'אין תיאור', 
    time = '0 דק\'', 
    level = 'לא ידוע', 
    stars = 0, 
    meals = 1,
    totalRatings = 0
  } = recipe || {}

  // Get user's first letter for avatar
  const getUserInitial = (name) => {
    return name ? name.charAt(0) : '?'
  }

  // Format time display
  const formatTime = (timeValue) => {
    if (typeof timeValue === 'number') {
      return `${timeValue} דק'`
    }
    return timeValue || '0 דק\''
  }

  // Format date display
  const formatDate = (date) => {
    if (!date) return 'לא ידוע'
    // You can add more sophisticated date formatting here
    return date
  }

  // Generate star rating
  const renderStars = () => {
    const starElements = []
    const fullStars = Math.floor(stars)
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starElements.push(
          <AiFillStar key={i} className="star filled" />
        )
      } else {
        starElements.push(
          <AiOutlineStar key={i} className="star empty" />
        )
      }
    }
    return starElements
  }

  // Handle save/unsave functionality
  const toggleSave = () => {
    setIsSaved(!isSaved)
    // You can add API call here to save/unsave recipe
  }

  // Generate background image style
  const getImageStyle = () => {
    if (image) {
      return {
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    }
    // Fallback gradient if no image
    return {
      backgroundImage: 'linear-gradient(45deg, #ff6b6b, #ee5a24)'
    }
  }

  return (
    <div className="recipe-card">
      <div className="card-header">
        <div className="user-avatar">
          {getUserInitial(userName)}
        </div>
        <div className="user-info">
          <h3>{userName}</h3>
          <span>{formatDate(dateCreated)}</span>
        </div>
      </div>

      <div 
        className="recipe-image" 
        style={getImageStyle()}
      >
        <div className="recipe-overlay">
          <p>{desc}</p>
        </div>
      </div>

      <div className="recipe-info">
        <h2 className="recipe-title">{recipeName}</h2>
        <p className="recipe-description">{desc}</p>
        
        <div className="recipe-meta">
          <div className="meta-item">
            <AiOutlineClockCircle />
            <span>{formatTime(time)}</span>
          </div>
          <div className="meta-item">
            <AiOutlineUser />
            <span>{meals} מנות</span>
          </div>
          <div className="meta-item">
            <MdSignalCellularAlt />
            <span>{level}</span>
          </div>
        </div>

        <div className="recipe-actions">
          <div className="rating">
            <div className="stars">
              {renderStars()}
            </div>
            <span className="rating-text">
              {stars.toFixed(1)} ({totalRatings} דירוגים)
            </span>
          </div>
          <button 
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={toggleSave}
            aria-label={isSaved ? 'בטל שמירה' : 'שמור מתכון'}
          >
            {isSaved ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>
        </div>
      </div>
    </div>
  )
}