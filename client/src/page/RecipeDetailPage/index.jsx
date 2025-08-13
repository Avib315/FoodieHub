import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const commentSectionRef = useRef(null);
  const { addToSaved, removedSaved, user } = useUserStore()
  const { id } = useParams()
  const { data, loading } = useAxiosRequest({ url: `recipe/getDetails?id=${id}`, method: "GET", defaultValue: {} });

  const passedData = location.state;

  const recipeData = {
    ...passedData,
    comments: data.comments || [],
    ratedByMe: data.ratedByMe || false,
    saved: data.saved || false
  };

  console.log("this is recipeData in recipe detail page: ", recipeData);

  const [saved, setSaved] = useState(recipeData.saved);
  useEffect(() => {
    setSaved(recipeData.saved)
    console.log("this is saved in recipe detail page: ", recipeData.saved);
  }, [recipeData?._id, recipeData?.saved]);


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
  if (!recipeData) {
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
        <div className="header-overlay" style={getImageStyle(recipeData.imageUrl)}></div>
        <div className="header-controls">
          <Link to={-1} className="back-btn">
            <button className="control-btn">
              <i className="fas fa-arrow-right"></i>
            </button>
          </Link>
        </div>
        <div className="recipe-title-overlay">
          <h1>{recipeData?.title}</h1>
          <div className="recipe-meta-header">
            <div className="meta-item-header">
              <i className="fas fa-clock"></i>
              <span>{formatTime(recipeData?.prepTime)}</span>
            </div>
            <div className="meta-item-header">
              <i className="fas fa-users"></i>
              <span>{recipeData?.servings} מנות</span>
            </div>
            <div className="meta-item-header">
              <i className="fas fa-signal"></i>
              <span>{getDifficultyText(recipeData?.difficultyLevel)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="recipe-content">
        {/* User Section */}
        <div className="user-section">
          <div className="user-header">
            <div className="user-avatar">{recipeData.fullName?.slice(0, 1)}</div>
            <div className="user-info">
              <h3>{recipeData.fullName}</h3>
              <p>{recipeData.userName}</p>

            </div>

          </div>
          <p className="recipe-description">
            {recipeData.description}
          </p>
        </div>

        {/* Actions Bar */}
        <div className="actions-bar">
          <div className="actions-left">

            <button
              className="action-btn"
              onClick={() =>
                commentSectionRef.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <i className="far fa-comment"></i>
              <span>{recipeData.comments.length}</span>
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
              <div className="meta-value">{recipeData.prepTime}</div>
              <div className="meta-label">דקות</div>
            </div>
            <div className="meta-card">
              <i className="fas fa-users"></i>
              <div className="meta-value">{recipeData.servings}</div>
              <div className="meta-label">מנות</div>
            </div>
            <div className="meta-card">
              <i className="fas fa-signal"></i>
              <div className="meta-value">{getDifficultyText(recipeData.difficultyLevel)}</div>
              <div className="meta-label">רמת קושי</div>
            </div>
            <div className="meta-card">
              <i className={`fas fa-${getCategoryTagData(recipeData.category).icon}`}></i>
              <div className="meta-value">{getCategoryTagData(recipeData.category).text}</div>
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
            {recipeData.ingredients.map((ingredient, index) => (
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
            {recipeData.instructions.map((instruction) => (
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
        <RatingSection
          ratedByMe={recipeData.ratedByMe}
          averageRating={recipeData.averageRating}
          ratingsCount={recipeData.ratingsCount}
          userName={recipeData.userName}
          id={id}
        />

        <div ref={commentSectionRef}>
          <CommentSection
            recipeId={id}
            data={recipeData.comments}
          />
        </div>

      </div>
    </div>
  );
}

