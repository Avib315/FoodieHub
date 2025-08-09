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
import difLevel from '../../data/difLevel'
import { Link, useParams } from 'react-router-dom';
import axiosRequest from '../../services/axiosRequest'
import useUserStore from '../../store/userStore'
export default function RecipeCard({ recipe, addSaveBtn = true, isMyRecipes }) {
  const {user , setUser , addToSaved ,removedSaved } = useUserStore()
  const {
    fullName = 'משתמש לא ידוע',
    title = 'מתכון ללא שם',
    imageUrl = '',
    updatedAt = 'לא ידוע',
    description = 'אין תיאור',
    prepTime = '0 דק\'',
    difficultyLevel = 'לא ידוע',
    averageRating = 0,
    servings = 1,
    totalRatings = 0,
    saved,
    _id
  } = recipe || {}
  const [isSaved, setIsSaved] = useState(saved)



  // Get user's first letter for avatar
  const getUserInitial = (name) => {
    return name ? name.charAt(0) : '?'
  }
  const difLevelMap = () => {
    const level = difLevel.find(level => level.value === difficultyLevel);
    return level ? level.text : 'לא ידוע';
  }
  // Format time display
  const formatTime = (timeValue) => {
    if (typeof timeValue === 'number') {
      return `${timeValue} דק'`
    }
    return timeValue || '0 דק\''
  }

  const formatDate = (date) => {
    if (!date) return 'לא ידוע';

    const d = new Date(date);  // Convert the string to a Date object
    const year = d.getFullYear(); // Get the full year (yyyy)
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Get the month (mm), pad with leading zero if necessary
    const day = String(d.getDate()).padStart(2, '0'); // Get the day (dd), pad with leading zero if necessary

    return `${year}/${month}/${day}`; // Return the formatted string
  };

  async function saveRecipe() {
    const body = {
      recipeId: _id
    }
    const res = await axiosRequest({ url: "/savedRecipe/add", method: "POST", body: body })
    if(res){
      setUser({...user , createdRecipesCount : user.savedRecipesCount + 1})
      addToSaved()
      alert("מתכון נוסף לשמורים בהצלחה")
    }
  }
  
  async function unsaveRecipe() {
    const res = await axiosRequest({ url: `/savedRecipe/remove/${_id}`, method: "DELETE" })
    if(res){
      removedSaved()
      alert("מתכון לא בשמורים יותר")
    }
  }


  // Generate star rating
  const renderStars = () => {
    const starElements = []
    const fullStars = Math.floor(averageRating)

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
  async function toggleSave() {
    try {
      if (isSaved) {
        await unsaveRecipe();
        setIsSaved(false);
      } else {
        await saveRecipe();
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error toggling saved status:", error.message);
    }
  }

  // Generate background image style
  const getImageStyle = () => {
    if (imageUrl) {
      return {
        backgroundImage: `url(${imageUrl})`,
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
    <div className={`recipe-card ${recipe.status}`}>
      <Link to={`/recipe/${_id}`} className="recipe-link">
        <div className="card-header">
          {!isMyRecipes && <><div className="user-avatar">
            {getUserInitial(fullName)}
          </div>
            <div className="user-info">
              <h3>{fullName}</h3>
              <span>{formatDate(updatedAt)}</span>
            </div> </>}
        </div>

        <div
          className="recipe-image"
          style={getImageStyle()}
        >
    =
        </div>

      </Link>
      <div className="recipe-info">
        <h2 className="recipe-title">{title}</h2>
        <p className="recipe-description">{description}</p>

        <div className="recipe-meta">
          <div className="meta-item">
            <AiOutlineClockCircle />
            <span>{formatTime(prepTime)}</span>
          </div>
          <div className="meta-item">
            <AiOutlineUser />
            <span>{servings} מנות</span>
          </div>
          <div className="meta-item">
            <MdSignalCellularAlt />
            <span>{difLevelMap(difficultyLevel)}</span>
          </div>
        </div>

        <div className="recipe-actions">
          <div className="rating">
            <div className="stars">
              {renderStars()}
            </div>
            <span className="rating-text">
              {averageRating.toFixed(1)} ({totalRatings} דירוגים)
            </span>
          </div>
          {addSaveBtn && <button
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={toggleSave}
            aria-label={isSaved ? 'בטל שמירה' : 'שמור מתכון'}
          >
            {isSaved ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>}
        </div>
      </div>
      <p className='pendingOrReject'>{recipe.status == "pending" ? "מחכה לאישור" : recipe.status == "rejected" ? "מנהל הסיר את המתכון" : ""} </p>
    </div>
  )
}