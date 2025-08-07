import React, { useState } from 'react';
import './style.scss';
import useAxiosRequest from '../../services/useApiRequest';
import axiosRequest from '../../services/axiosRequest';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingPage from '../LoadingPage';
import unitTypes from '../../data/unitTypes';

// Mock data based on the provided structure

// Mock user data
const userData = {
  name: "שרה כהן",
  avatar: "ש",
  recipesCount: 156,
  followersCount: 2300,
  joinedYear: 2022
};

export default function RecipeDetailPage() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [userRating, setUserRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [showCommentActions, setShowCommentActions] = useState(false);
  const { id } = useParams()

  // הוספתי שמפה ניתן לשלוף גם את התגובות על מתכונים
  const { data, loading } = useAxiosRequest({ url: `recipe/getById?id=${id}`, method: "GET" });
  //מה שקורל עשתה -------------------------------
  async function addRating(rating) {
    const body = {
      recipeId: id,
      rating,
      review: ''
    };
    const res = await axiosRequest({ url: "/rating/create", method: "POST", body: body })
    console.log(res)
  }

  async function addComment() {
    const body = {
      recipeId: "recipeId",
      content: "content"
    };
    const res = await axiosRequest({ url: "/comment/create", method: "POST", body: body })
    console.log(res)
  }

  async function saveRecipe() {
    const body = {
      recipeId: id
    }
    const res = await axiosRequest({ url: "/savedRecipe/add", method: "POST", body: body })
    console.log(res)
  }

  async function unsaveRecipe() {
    const res = await axiosRequest({ url: `/savedRecipe/remove/${id}`, method: "DELETE" })
    console.log(res)
  }
  //מה שקורל עשתה -------------------------------


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
      try {
        await addRating(userRating);
        alert(`דירוג נשלח בהצלחה: ${userRating} כוכבים`);
      } catch (error) {
        alert('שגיאה בשליחת הדירוג');
        console.error(error);
      }
    }
  };


  const submitComment = () => {
    if (commentText.trim()) {
      alert('תגובה נשלחה בהצלחה!');
      setCommentText('');
      setShowCommentActions(false);
    }
  };

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

  const mockComments = [
    {
      id: 1,
      author: "רחל אברהם",
      avatar: "ר",
      time: "לפני 2 שעות",
      rating: 5,
      text: "המתכון הזה פשוט מדהים! הטעם עשיר ומפנק, והכנה מאוד פשוטה. גם הילדים אהבו. בהחלט אכין שוב! תודה על המתכון המושלם 😍",
      likes: 5,
      liked: false
    },
    {
      id: 2,
      author: "מיכל לוי",
      avatar: "מ",
      time: "לפני 5 שעות",
      rating: 4,
      text: "סלט טעים! הוספתי גם גזר וסלרי והיה מושלם. הילדים בקשו תוספת 👨‍🍳",
      likes: 3,
      liked: true
    }
  ];
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
        <div className="recipe-section">
          <h2 className="section-title">
            <i className="fas fa-star"></i>
            דירוגים וחוות דעת
          </h2>

          <div className="rating-section">
            <div className="current-rating">
              <div className="rating-stars">
                {renderStars(Math.round(data.averageRating))}
              </div>
              <div className="rating-text">
                {data.averageRating} מתוך 5 ({data.ratingsCount} דירוגים)
              </div>
            </div>

            <div className="your-rating">
              <h4>דרג את המתכון</h4>
              <div className="rating-input">
                {renderStars(userRating, true, setRating)}
              </div>
              <button
                className="rating-submit"
                onClick={submitRating}
                disabled={userRating === 0}
              >
                שלח דירוג
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="recipe-section">
          <div className="comments-header">
            <h2 className="section-title">
              <i className="fas fa-comments"></i>
              תגובות ({data.comments.length})
            </h2>
  
          </div>

          {/* Comment Form */}
          <div className={`comment-form ${showCommentActions ? 'active' : ''}`}>
            <textarea
              className="comment-input"
              placeholder="שתף את החוויה שלך עם המתכון..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onFocus={() => setShowCommentActions(true)}
            />
            <div className="comment-actions">
              <div className="comment-tools">
                <button className="comment-tool" title="הוסף אימוג'י">
                  <i className="far fa-smile"></i>
                </button>
                <button className="comment-tool" title="הוסף תמונה">
                  <i className="fas fa-camera"></i>
                </button>
              </div>
              <button
                className="comment-submit"
                onClick={submitComment}
                disabled={!commentText.trim()}
              >
                פרסם
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="comments-list">
            {data.comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <div className="comment-avatar">{comment.avatar}</div>
                  <div className="comment-info">
                    <div className="comment-author">{comment.fullName}</div>
                    <div className="comment-time">{ new Date(comment.createdAt).toLocaleDateString('he-IL')}</div>
                  </div>
           
                </div>
                <div className="comment-text">{comment.content}</div>
                <div className="comment-actions">
                  <button className={`comment-action ${comment.liked ? 'liked' : ''}`}>
                    <i className={`${comment.liked ? 'fas' : 'far'} fa-heart`}></i>
                    <span>{comment.likes}</span>
                  </button>
                  <button className="comment-action">
                    <i className="far fa-comment"></i>
                    <span>הגב</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
}

