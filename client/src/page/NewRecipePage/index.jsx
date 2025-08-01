import React, { useState } from 'react';
import './style.scss';

export default function NewRecipePage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle image upload logic here
      console.log('Image uploaded:', file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('recipeImage').click();
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
  };

  const selectDifficulty = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const updateInstruction = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const submitRecipe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 2000);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    // Navigate back to personal area
  };

  return (
    <div className="new-recipe-page">
      <div className="header">
        <a href="PersonalArea-mobile.html">
          <button className="back-btn">
            <i className="fas fa-arrow-right"></i>
          </button>
        </a>
        <div className="header-content">
          <h1>הוספת מתכון חדש</h1>
          <p>שתף את המתכון שלך עם הקהילה</p>
        </div>
      </div>

      <div className="form-container">
        <form id="recipeForm" onSubmit={submitRecipe}>
          {/* Image Upload Section */}
          <div className="form-section">
            <div className="section-header">
              <h3><i className="fas fa-camera"></i>תמונת המתכון</h3>
            </div>
            <div className="section-content">
              <div className="image-upload" onClick={triggerFileInput}>
                <input 
                  type="file" 
                  id="recipeImage" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                />
                <div className="upload-content">
                  <i className="fas fa-cloud-upload-alt upload-icon"></i>
                  <div className="upload-text">הוסף תמונה למתכון</div>
                  <div className="upload-hint">לחץ כדי לבחור תמונה מהמכשיר</div>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="form-section">
            <div className="section-header">
              <h3><i className="fas fa-info-circle"></i>מידע בסיסי</h3>
            </div>
            <div className="section-content">
              <div className="form-group">
                <label htmlFor="recipeName">שם המתכון *</label>
                <input 
                  type="text" 
                  id="recipeName" 
                  name="recipeName" 
                  placeholder="לדוגמה: עוגת שוקולד ביתית" 
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="recipeDescription">תיאור קצר</label>
                <textarea 
                  id="recipeDescription" 
                  name="recipeDescription" 
                  placeholder="תאר את המתכון בכמה מילים..."
                ></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prepTime">זמן הכנה (דקות)</label>
                  <input 
                    type="number" 
                    id="prepTime" 
                    name="prepTime" 
                    placeholder="30" 
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="servings">מספר מנות</label>
                  <input 
                    type="number" 
                    id="servings" 
                    name="servings" 
                    placeholder="4" 
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category and Difficulty Section */}
          <div className="form-section">
            <div className="section-header">
              <h3><i className="fas fa-tags"></i>קטגוריה ורמת קושי</h3>
            </div>
            <div className="section-content">
              <div className="form-group">
                <label>קטגוריה</label>
                <div className="category-grid">
                  {[
                    { key: 'main', icon: 'utensils', text: 'מנה עיקרית' },
                    { key: 'appetizer', icon: 'cheese', text: 'מתאבן' },
                    { key: 'dessert', icon: 'birthday-cake', text: 'קינוח' },
                    { key: 'soup', icon: 'soup', text: 'מרק' },
                    { key: 'salad', icon: 'salad', text: 'סלט' },
                    { key: 'drink', icon: 'cocktail', text: 'משקה' }
                  ].map(category => (
                    <div 
                      key={category.key}
                      className={`category-pill ${selectedCategory === category.key ? 'selected' : ''}`}
                      onClick={() => selectCategory(category.key)}
                    >
                      <i className={`fas fa-${category.icon}`}></i>
                      <span>{category.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>רמת קושי</label>
                <div className="difficulty-options">
                  {[
                    { key: 'easy', icon: 'thumbs-up', text: 'קל' },
                    { key: 'medium', icon: 'balance-scale', text: 'בינוני' },
                    { key: 'hard', icon: 'fire', text: 'מאתגר' }
                  ].map(difficulty => (
                    <div 
                      key={difficulty.key}
                      className={`difficulty-option ${selectedDifficulty === difficulty.key ? 'selected' : ''}`}
                      onClick={() => selectDifficulty(difficulty.key)}
                    >
                      <i className={`fas fa-${difficulty.icon} difficulty-icon`}></i>
                      <span className="difficulty-text">{difficulty.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="form-section">
            <div className="section-header">
              <h3><i className="fas fa-list"></i>רכיבים</h3>
            </div>
            <div className="section-content">
              <div className="dynamic-list" id="ingredientsList">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="list-item">
                    <input 
                      type="text" 
                      placeholder="לדוגמה: 2 כוסות קמח" 
                      className="ingredient-input"
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="remove-btn" 
                      onClick={() => removeIngredient(index)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="add-btn" onClick={addIngredient}>
                <i className="fas fa-plus"></i>
                הוסף רכיב
              </button>
            </div>
          </div>

          {/* Instructions Section */}
          <div className="form-section">
            <div className="section-header">
              <h3><i className="fas fa-clipboard-list"></i>הוראות הכנה</h3>
            </div>
            <div className="section-content">
              <div className="dynamic-list" id="instructionsList">
                {instructions.map((instruction, index) => (
                  <div key={index} className="list-item">
                    <input 
                      type="text" 
                      placeholder={`שלב ${index + 1}: לערבב את החומרים היבשים...`}
                      className="instruction-input"
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="remove-btn" 
                      onClick={() => removeInstruction(index)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="add-btn" onClick={addInstruction}>
                <i className="fas fa-plus"></i>
                הוסף שלב
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="submit-section">
        <button 
          type="submit" 
          className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
          onClick={submitRecipe}
          disabled={isSubmitting}
        >
          <span className="btn-text">
            <i className="fas fa-paper-plane"></i>
            פרסם מתכון
          </span>
          <div className="spinner"></div>
        </button>
      </div>

      {showSuccess && (
        <>
          <div className="overlay" onClick={closeSuccess}></div>
          <div className="success-popup">
            <i className="fas fa-check-circle success-icon"></i>
            <div className="success-title">המתכון נוסף בהצלחה!</div>
            <div className="success-text">המתכון שלך פורסם ויופיע בזרימה תוך כמה דקות</div>
            <button className="success-btn" onClick={closeSuccess}>מעולה!</button>
          </div>
        </>
      )}
    </div>
  );
}