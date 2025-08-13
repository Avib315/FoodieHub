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
import categories from '../../data/categories'
import { Link, useParams } from 'react-router-dom';
import axiosRequest from '../../services/axiosRequest'
import useUserStore from '../../store/userStore'
import { useNavigate } from 'react-router-dom';


export default function RecipeCard({ recipe, addSaveBtn = true, isMyRecipes }) {
  const navigate = useNavigate();
  const { addToSaved, removedSaved, user } = useUserStore()
  const {
    fullName = 'משתמש לא ידוע',
    title = 'מתכון ללא שם',
    imageUrl = '',
    updatedAt = 'לא ידוע',
    description = 'אין תיאור',
    prepTime = '0 דק\'',
    category,
    difficultyLevel = 'לא ידוע',
    averageRating = recipe.averageRating,
    servings = 1,
    totalRatings = recipe.ratingsCount,
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

  const categoriesMap = () => {
    const resCategory = categories.find(cat => cat.key === category);
    return resCategory ? resCategory.text : 'לא ידוע';
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
    if (res) {
      addToSaved()
      alert("מתכון נוסף לשמורים בהצלחה")
    }
  }

  async function unsaveRecipe() {
    const res = await axiosRequest({ url: `/savedRecipe/remove/${_id}`, method: "DELETE" })
    if (res) {
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

  const handleRecipeClick = () => {
    let { username, totalRatings, saved, ...sendableResipe } = recipe;
    if (isMyRecipes) {
      sendableResipe = {
        ...sendableResipe,
        userName: user.username,
        fullName: user.name
      }
    } else {
      sendableResipe = {
        ...sendableResipe,
        userName: recipe.username,
      }
    }
    navigate(`/recipe/${_id}`, {
      state: {
        ...sendableResipe,
        ratingsCount: recipe.totalRatings
      }
    });
  };

  return (
    <div className={`recipe-card ${recipe.status}`}>
      <div
        className="recipe-link"
        style={{ cursor: 'pointer' }}
        onClick={() => handleRecipeClick()}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleRecipeClick();
        }}
      >
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
        </div>
      </div>

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
          <div className="meta-item">
            <span>{categoriesMap(category)}</span>
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