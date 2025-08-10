import React, { useState } from 'react';
import './style.scss';
import useAxiosRequest from '../../services/useApiRequest';
import axiosRequest from '../../services/axiosRequest';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingPage from '../LoadingPage';
import unitTypes from '../../data/unitTypes';
import useUserStore from '../../store/userStore';
import CommentSection from '../../component/CommentSections';
import categories from "../../data/categories"
import RatingSection from '../../component/RatingSection';


export default function RecipeDetailPage() {
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  // const [rating , setRating] = useState()
  const [userRating, setUserRating] = useState(0);

  const { addToSaved, removedSaved, user } = useUserStore()
  const { id } = useParams()
  // הוספתי שמפה ניתן לשלוף גם את התגובות על מתכונים
  const { data, loading } = useAxiosRequest({ url: `recipe/getById?id=${id}`, method: "GET", defaultValue: {} });
  //מה שקורל עשתה -------------------------------
  async function addRating(rat) {
    const body = {
      recipeId: id,
      rating: rat,
      review: ''
    };
    const res = await axiosRequest({ url: "/rating/create", method: "POST", body: body })
    console.log(res);
    return res;
  }
  const [saved, setSaved] = useState(data.saved);
  useEffect(() => {
    
    setSaved(data.saved)
  }, [data?._id])


  async function saveRecipe() {
    const body = {
      recipeId: id
    }
    const res = await axiosRequest({ url: "/savedRecipe/add", method: "POST", body: body })
    addToSaved()
    if (res) {
      alert("מתכון נשמר למועדפים")
    }
  }

  async function unsaveRecipe() {
    const res = await axiosRequest({ url: `/savedRecipe/remove/${id}`, method: "DELETE" })
    removedSaved()
    if (res) {
      alert("מתכון נמחק מהמועדפים")
    }
  }



  const getDifficultyText = (level) => {
    switch (level) {
      case 1: return 'קל';
      case 2: return 'בינוני';
      case 3: return 'קשה';
      default: return 'קל';
    }
  };

  const formatTime = (minutes) => {
    if (minutes === 0) return 'ללא בישול';
    return `${minutes} דק'`;
  };

  const toggleIngredient = (index) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const renderStars = (rating, interactive = true, onStarClick = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          // className={`fas fa-star ${i <= rating ? 'star' : 'star empty'} ${interactive ? 'rating-star' : ''}`}
          className={`fas fa-star star ${i <= rating ? '' : 'empty'}`}
          onClick={interactive ? () => onStarClick(i) : undefined}
          data-rating={i}
        />
      );
    }
    return stars;
  };

  const setRating = (rating) => {
    setUserRating(rating);
  };

  const submitRating = async () => {
    if (userRating > 0) {
      const result = await addRating(userRating);

      if (result.success === false) {
        alert('לא ניתן לשלוח דירוג');
      }
      else {
        alert(`דירוג נשלח בהצלחה: ${userRating} כוכבים`);
      }
    }
  };
  function getCategoryTagData(categoryData) {
    return categories.find(c => c.key == categoryData) || {}
  }


  async function handleSaveClick() {
    try {
      if (saved) {
        await unsaveRecipe();
        setSaved(false);
      } else {
        await saveRecipe();
        setSaved(true);
      }
    } catch (error) {
      console.error("Error toggling saved status:", error.message);
    }
  }

  if (loading) {
    return <LoadingPage />
  }
  if (!data) {
    return <></>
  }

  const getImageStyle = (imageUrl) => {
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
    <div className="recipe-detail-page">
      {/* Recipe Header Image */}
      <div className="recipe-header">
        <div className="header-overlay" style={getImageStyle(data.imageUrl)}></div>
        <div className="header-controls">
          <Link to={-1} className="back-btn">
            <button className="control-btn">
              <i className="fas fa-arrow-right"></i>
            </button>
          </Link>
        </div>
        <div className="recipe-title-overlay">
          <h1>{data?.title}</h1>
          <div className="recipe-meta-header">
            <div className="meta-item-header">
              <i className="fas fa-clock"></i>
              <span>{formatTime(data?.prepTime)}</span>
            </div>
            <div className="meta-item-header">
              <i className="fas fa-users"></i>
              <span>{data?.servings} מנות</span>
            </div>
            <div className="meta-item-header">
              <i className="fas fa-signal"></i>
              <span>{getDifficultyText(data?.difficultyLevel)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="recipe-content">
        {/* User Section */}
        <div className="user-section">
          <div className="user-header">
            <div className="user-avatar">{data.fullName?.slice(0, 1)}</div>
            <div className="user-info">
              <h3>{data.fullName}</h3>
              <p>{data.userName}</p>

            </div>

          </div>
          <p className="recipe-description">
            {data.description}
          </p>
        </div>

        {/* Actions Bar */}
        <div className="actions-bar">
          <div className="actions-left">

            <button className="action-btn">
              <i className="far fa-comment"></i>
              <span>{data.comments.length}</span>
            </button>

          </div>
          <button
            className={`save-btn ${saved ? 'saved' : ''}`}
            onClick={handleSaveClick}
          >
            <i className={`${saved ? 'fas' : 'far'} fa-heart`}></i>
          </button>
        </div>

        {/* Recipe Meta */}
        <div className="recipe-section1">
          <div className="recipe-meta">
            <div className="meta-card">
              <i className="fas fa-clock"></i>
              <div className="meta-value">{data.prepTime}</div>
              <div className="meta-label">דקות</div>
            </div>
            <div className="meta-card">
              <i className="fas fa-users"></i>
              <div className="meta-value">{data.servings}</div>
              <div className="meta-label">מנות</div>
            </div>
            <div className="meta-card">
              <i className="fas fa-signal"></i>
              <div className="meta-value">{getDifficultyText(data.difficultyLevel)}</div>
              <div className="meta-label">רמת קושי</div>
            </div>
            <div className="meta-card">
              <i className={`fas fa-${getCategoryTagData(data.category).icon}`}></i>
              <div className="meta-value">{getCategoryTagData(data.category).text}</div>
              <div className="meta-label">קטגוריה</div>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="recipe-section">
          <h2 className="section-title">
            <i className="fas fa-list"></i>
            רכיבים
          </h2>
          <ul className="ingredients-list">
            {data.ingredients.map((ingredient, index) => (
              <li
                key={ingredient._id}
                className={`ingredient-item ${checkedIngredients.has(index) ? 'checked' : ''}`}
                onClick={() => toggleIngredient(index)}
              >
                <div className={`ingredient-checkbox ${checkedIngredients.has(index) ? 'checked' : ''}`}>
                  <i className="fas fa-check" style={{ display: checkedIngredients.has(index) ? 'block' : 'none' }}></i>
                </div>
                <span className="ingredient-text">
                  {ingredient.quantity} {unitTypes.map(type => type.value === ingredient.unit ? type.label : null)} {ingredient.name}
                  {ingredient.notes && ` - ${ingredient.notes}`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="recipe-section">
          <h2 className="section-title">
            <i className="fas fa-clipboard-list"></i>
            הוראות הכנה
          </h2>
          <ol className="instructions-list">
            {data.instructions.map((instruction) => (
              <li key={instruction._id} className="instruction-item">
                <div className="step-number">{instruction.stepNumber}</div>
                <div className="step-content">
                  {instruction.text}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Rating Section */}
        <RatingSection ratedByMe={data.ratedByMe} averageRating={data.averageRating} ratingsCount={data.ratingsCount} userName={data.userName} id={id}  />

        <CommentSection recipeId={id} data={data.comments} />

      </div>


    </div>
  );
}

