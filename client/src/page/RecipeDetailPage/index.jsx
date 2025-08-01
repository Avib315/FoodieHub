import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style.scss';

// Import the JSON data (in a real app, this would be an API call)
import recipeData from './data.json';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [interactions, setInteractions] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [userRating, setUserRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [isCommentFormActive, setIsCommentFormActive] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // Simulate API call delay
        setTimeout(() => {
          setRecipe(recipeData.recipe);
          setInteractions(recipeData.interactions);
          setComments(recipeData.comments);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} דק'`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}:${mins.toString().padStart(2, '0')} שעות` : `${hours} שעות`;
  };

  const getDifficultyText = (level) => {
    const levels = { 1: 'קל מאוד', 2: 'קל', 3: 'בינוני', 4: 'קשה', 5: 'קשה מאוד' };
    return levels[level] || 'קל';
  };

  const formatIngredient = (ingredient) => {
    let text = '';
    if (ingredient.quantity && ingredient.quantity !== 1) {
      text += ingredient.quantity;
      if (ingredient.quantity % 1 !== 0) {
        // Handle fractions
        const fraction = ingredient.quantity % 1;
        if (fraction === 0.5) text = text.replace('.5', ' וחצי');
        else if (fraction === 0.25) text = text.replace('.25', ' ורבע');
        else if (fraction === 0.75) text = text.replace('.75', ' ושלושת רבעים');
      }
      text += ' ';
    }
    
    if (ingredient.unit && ingredient.unit !== 'יחידה') {
      text += ingredient.unit + ' ';
    }
    
    text += ingredient.productId.name;
    
    if (ingredient.notes) {
      text += `, ${ingredient.notes}`;
    }
    
    return text;
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

  const toggleLike = () => {
    setInteractions(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const toggleSave = () => {
    setInteractions(prev => ({
      ...prev,
      isSaved: !prev.isSaved
    }));
  };

  const toggleFollow = () => {
    setInteractions(prev => ({
      ...prev,
      isFollowing: !prev.isFollowing
    }));
  };

  const setRating = (rating) => {
    setUserRating(rating);
  };

  const submitRating = () => {
    if (userRating > 0) {
      console.log('Rating submitted:', userRating);
      // Here you would send the rating to your API
    }
  };

  const submitComment = () => {
    if (commentText.trim()) {
      const newComment = {
        _id: Date.now().toString(),
        userId: {
          _id: 'current-user',
          name: 'משתמש נוכחי',
          avatar: 'מ'
        },
        text: commentText,
        rating: userRating,
        likes: 0,
        isLiked: false,
        createdAt: new Date().toISOString()
      };
      
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
      setIsCommentFormActive(false);
      setUserRating(0);
    }
  };

  const toggleCommentLike = (commentId) => {
    setComments(prev => prev.map(comment => 
      comment._id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'לפני פחות משעה';
    if (diffInHours < 24) return `לפני ${diffInHours} שעות`;
    if (diffInHours < 48) return 'אתמול';
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `לפני ${diffInDays} ימים`;
  };

  const renderStars = (rating, size = 'medium') => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i 
          key={i}
          className={`fas fa-star ${i <= rating ? 'star' : 'star empty'}`}
          style={{ fontSize: size === 'large' ? '24px' : size === 'small' ? '12px' : '16px' }}
        />
      );
    }
    return stars;
  };

  const renderRatingInput = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i 
          key={i}
          className={`fas fa-star rating-star ${i <= userRating ? 'active' : ''}`}
          onClick={() => setRating(i)}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return <div className="loading">טוען מתכון...</div>;
  }

  if (!recipe) {
    return <div className="error">מתכון לא נמצא</div>;
  }

  return (
    <div className="recipe-detail-page">
      <div className="container">
        {/* Recipe Header Image */}
        <div 
          className="recipe-header"
          style={{
            backgroundImage: `linear-gradient(45deg, rgba(255,107,107,0.8), rgba(238,90,36,0.8)), url('${recipe.imageUrl}')`
          }}
        >
          <div className="header-overlay"></div>
          <div className="header-controls">
            <button className="control-btn" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-right"></i>
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="control-btn" onClick={() => navigator.share?.({ title: recipe.title, url: window.location.href })}>
                <i className="fas fa-share"></i>
              </button>
              <button 
                className={`control-btn ${interactions?.isSaved ? 'saved' : ''}`}
                onClick={toggleSave}
              >
                <i className={interactions?.isSaved ? 'fas fa-bookmark' : 'far fa-bookmark'}></i>
              </button>
            </div>
          </div>
          <div className="recipe-title-overlay">
            <h1>{recipe.title}</h1>
            <div className="recipe-meta-header">
              <div className="meta-item-header">
                <i className="fas fa-clock"></i>
                <span>{formatTime(recipe.prepTime + recipe.cookTime)}</span>
              </div>
              <div className="meta-item-header">
                <i className="fas fa-users"></i>
                <span>{recipe.servings} מנות</span>
              </div>
              <div className="meta-item-header">
                <i className="fas fa-signal"></i>
                <span>{getDifficultyText(recipe.difficultyLevel)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="recipe-content">
          <div className="recipe-main-content">
            <div className="left-column">
              {/* User Section */}
              <div className="user-section">
                <div className="user-header">
                  <div className="user-avatar">{recipe.userId.avatar}</div>
                  <div className="user-info">
                    <h3>{recipe.userId.name}</h3>
                    <div className="user-stats">
                      <span>{recipe.userId.recipesCount} מתכונים</span>
                      <span>{recipe.userId.followersCount.toLocaleString()} עוקבים</span>
                      <span>נרשמה ב-{recipe.userId.joinDate}</span>
                    </div>
                  </div>
                  <button 
                    className={`follow-btn ${interactions?.isFollowing ? 'following' : ''}`}
                    onClick={toggleFollow}
                  >
                    {interactions?.isFollowing ? 'עוקב' : 'עקוב'}
                  </button>
                </div>
                <p className="recipe-description">{recipe.description}</p>
              </div>

              {/* Actions Bar */}
              <div className="actions-bar">
                <div className="actions-left">
                  <button 
                    className={`action-btn ${interactions?.isLiked ? 'liked' : ''}`}
                    onClick={toggleLike}
                  >
                    <i className={interactions?.isLiked ? 'fas fa-heart' : 'far fa-heart'}></i>
                    <span className="like-count">{interactions?.likes}</span>
                  </button>
                  <button className="action-btn" onClick={() => document.getElementById('commentsSection')?.scrollIntoView()}>
                    <i className="far fa-comment"></i>
                    <span>{comments.length}</span>
                  </button>
                  <button className="action-btn" onClick={() => navigator.share?.({ title: recipe.title, url: window.location.href })}>
                    <i className="fas fa-share"></i>
                    <span>שתף</span>
                  </button>
                </div>
                <button 
                  className={`save-btn ${interactions?.isSaved ? 'saved' : ''}`}
                  onClick={toggleSave}
                >
                  <i className={interactions?.isSaved ? 'fas fa-heart' : 'far fa-heart'}></i>
                </button>
              </div>

              {/* Instructions */}
              <div className="recipe-section">
                <h2 className="section-title">
                  <i className="fas fa-clipboard-list"></i>
                  הוראות הכנה
                </h2>
                <ol className="instructions-list">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="instruction-item">
                      <div className="step-number">{instruction.stepNumber}</div>
                      <div className="step-content">{instruction.text}</div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Comments Section */}
              <div className="recipe-section" id="commentsSection">
                <div className="comments-header">
                  <h2 className="section-title">
                    <i className="fas fa-comments"></i>
                    תגובות ({comments.length})
                  </h2>
                  <button className="sort-btn">
                    <i className="fas fa-sort"></i>
                    מיון: חדשות
                  </button>
                </div>

                {/* Comment Form */}
                <div className={`comment-form ${isCommentFormActive ? 'active' : ''}`}>
                  <textarea 
                    className="comment-input" 
                    placeholder="שתף את החוויה שלך עם המתכון..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onFocus={() => setIsCommentFormActive(true)}
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
                  {comments.map((comment) => (
                    <div key={comment._id} className="comment">
                      <div className="comment-header">
                        <div className="comment-avatar">{comment.userId.avatar}</div>
                        <div className="comment-info">
                          <div className="comment-author">{comment.userId.name}</div>
                          <div className="comment-time">{getTimeAgo(comment.createdAt)}</div>
                        </div>
                        {comment.rating && (
                          <div className="comment-rating">
                            {renderStars(comment.rating, 'small')}
                          </div>
                        )}
                      </div>
                      <div className="comment-text">{comment.text}</div>
                      <div className="comment-actions">
                        <button 
                          className={`comment-action ${comment.isLiked ? 'liked' : ''}`}
                          onClick={() => toggleCommentLike(comment._id)}
                        >
                          <i className={comment.isLiked ? 'fas fa-heart' : 'far fa-heart'}></i>
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

            <div className="right-column">
              {/* Recipe Meta */}
              <div className="recipe-section">
                <div className="recipe-meta">
                  <div className="meta-card">
                    <i className="fas fa-clock"></i>
                    <div className="meta-value">{recipe.prepTime + recipe.cookTime}</div>
                    <div className="meta-label">דקות</div>
                  </div>
                  <div className="meta-card">
                    <i className="fas fa-users"></i>
                    <div className="meta-value">{recipe.servings}</div>
                    <div className="meta-label">מנות</div>
                  </div>
                  <div className="meta-card">
                    <i className="fas fa-signal"></i>
                    <div className="meta-value">{getDifficultyText(recipe.difficultyLevel)}</div>
                    <div className="meta-label">רמת קושי</div>
                  </div>
                  <div className="meta-card">
                    <i className="fas fa-fire"></i>
                    <div className="meta-value">{recipe.nutrition.calories}</div>
                    <div className="meta-label">קלוריות</div>
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
                  {recipe.ingredients.map((ingredient, index) => (
                    <li 
                      key={index}
                      className={`ingredient-item ${checkedIngredients.has(index) ? 'checked' : ''}`}
                      onClick={() => toggleIngredient(index)}
                    >
                      <div className={`ingredient-checkbox ${checkedIngredients.has(index) ? 'checked' : ''}`}>
                        <i className="fas fa-check" style={{ display: checkedIngredients.has(index) ? 'block' : 'none' }}></i>
                      </div>
                      <span className="ingredient-text">{formatIngredient(ingredient)}</span>
                    </li>
                  ))}
                </ul>
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
                      {renderStars(Math.round(recipe.averageRating), 'large')}
                    </div>
                    <div className="rating-text">
                      {recipe.averageRating} מתוך 5 ({recipe.ratingsCount} דירוגים)
                    </div>
                  </div>

                  <div className="your-rating">
                    <h4>דרג את המתכון</h4>
                    <div className="rating-input">
                      {renderRatingInput()}
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
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}