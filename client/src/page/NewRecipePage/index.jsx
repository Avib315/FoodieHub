import React, { useState } from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import axiosRequest from '../../services/axiosRequest';
import categories from '../../data/categories';
import difficultyLevel from '../../data/difLevel';
import unitTypes from '../../data/unitTypes';

export default function NewRecipePage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  
  // FIXED: Initialize ingredients as objects, not strings
  const [ingredients, setIngredients] = useState([{
    name: '',
    quantity: '',
    unit: '',
    notes: ''
  }]);
  
  const [instructions, setInstructions] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'נא לבחור קובץ תמונה תקין (JPG, PNG, WEBP)' }));
        return;
      }
      
      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, image: 'גודל התמונה חייב להיות פחות מ-5MB' }));
        return;
      }
      
      setSelectedImage(file);
      
      // Clear image error if exists
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: null }));
      }
      
      console.log('Image selected:', file.name, 'Size:', file.size, 'Type:', file.type);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('recipeImage').click();
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: null }));
    }
  };

  const selectDifficulty = (difficulty) => {
    setSelectedDifficulty(difficulty);
    if (errors.difficulty) {
      setErrors(prev => ({ ...prev, difficulty: null }));
    }
  };

  // FIXED: Add ingredient as object
  const addIngredient = () => {
    setIngredients([...ingredients, {
      name: '',
      quantity: '',
      unit: '',
      notes: ''
    }]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  // FIXED: Update ingredient with field-specific updates
  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    
    // Ensure the ingredient object exists
    if (!newIngredients[index] || typeof newIngredients[index] !== 'object') {
      newIngredients[index] = { name: '', quantity: '', unit: '', notes: '' };
    }
    
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
    
    // Debug log
    console.log(`Updated ingredient ${index}.${field} to:`, value);
    console.log('Full ingredient object:', newIngredients[index]);
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

  // FIXED: Updated validation for new ingredient structure
  const validateForm = (formData) => {
    const newErrors = {};

    // Check recipe name
    const recipeName = formData.get('title');
    if (!recipeName || recipeName.trim().length < 3) {
      newErrors.recipeName = 'שם המתכון חייב להכיל לפחות 3 תווים';
    }

    // Check image
    if (!selectedImage) {
      newErrors.image = 'יש לבחור תמונה למתכון';
    }

    // Check category
    if (!selectedCategory) {
      newErrors.category = 'יש לבחור קטגוריה';
    }

    // Check difficulty
    if (!selectedDifficulty) {
      newErrors.difficulty = 'יש לבחור רמת קושי';
    }

    // FIXED: Check ingredients with new structure
    const validIngredients = ingredients.filter(ing => 
      ing && typeof ing === 'object' &&
      ing.name && ing.name.trim().length > 0 && 
      ing.quantity && 
      !isNaN(parseFloat(ing.quantity)) &&
      parseFloat(ing.quantity) > 0 && 
      ing.unit && ing.unit.trim().length > 0
    );
    
    if (validIngredients.length === 0) {
      newErrors.ingredients = 'יש להוסיף לפחות רכיב אחד מלא (שם, כמות ויחידת מידה)';
    }

    // Check for invalid quantities in ingredients
    for (let ing of ingredients) {
      if (ing && typeof ing === 'object' && ing.name && ing.name.trim() && 
          ing.quantity && (isNaN(ing.quantity) || parseFloat(ing.quantity) <= 0)) {
        newErrors.ingredients = 'כמות הרכיב חייבת להיות מספר חיובי';
        break;
      }
    }

    // Check instructions
    const validInstructions = instructions.filter(inst => inst.trim().length > 0);
    if (validInstructions.length === 0) {
      newErrors.instructions = 'יש להוסיף לפחות הוראה אחת';
    }

    // Check prep time
    const prepTime = formData.get('prepTime');
    if (prepTime && (isNaN(prepTime) || prepTime < 1)) {
      newErrors.prepTime = 'זמן הכנה חייב להיות מספר חיובי';
    }

    // Check servings
    const servings = formData.get('servings');
    if (servings && (isNaN(servings) || servings < 1)) {
      newErrors.servings = 'מספר המנות חייב להיות מספר חיובי';
    }

    return newErrors;
  };

  // FIXED: Updated submit function with proper ingredient formatting
  const submitRecipe = async (e) => {
    e.preventDefault();

    const form = e.target.form || document.getElementById('recipeForm');
    const formData = new FormData(form);

    // Add selected category and difficulty to formData
    formData.append('category', selectedCategory);
    formData.append('difficultyLevel', selectedDifficulty);

    // FIXED: Prepare ingredients according to your model
    const validIngredients = ingredients.filter(ing => 
      ing && typeof ing === 'object' &&
      ing.name && ing.name.trim().length > 0 && 
      ing.quantity && 
      !isNaN(parseFloat(ing.quantity)) &&
      parseFloat(ing.quantity) > 0 && 
      ing.unit && ing.unit.trim().length > 0
    ).map(ing => ({
      name: ing.name.trim(),
      quantity: parseFloat(ing.quantity),
      unit: ing.unit.trim(),
      notes: ing.notes && ing.notes.trim() ? ing.notes.trim() : ""
    }));

    // Prepare instructions with step numbers
    const validInstructions = instructions.filter(inst => inst.trim().length > 0)
      .map((inst, index) => ({
        stepNumber: index + 1,
        text: inst.trim()
      }));

    // Add arrays as JSON strings
    formData.append('ingredients', JSON.stringify(validIngredients));
    formData.append('instructions', JSON.stringify(validInstructions));

    // Log what we're about to send for debugging
    console.log('=== Recipe Submission Debug ===');
    console.log('Raw ingredients state:', ingredients);
    console.log('Filtered valid ingredients:', validIngredients);
    console.log('Valid instructions:', validInstructions);
    console.log('Selected image:', selectedImage?.name);
    console.log('Category:', selectedCategory);
    console.log('Difficulty:', selectedDifficulty);
    
    // Debug each ingredient individually
    ingredients.forEach((ing, index) => {
      console.log(`Ingredient ${index}:`, {
        name: ing?.name,
        quantity: ing?.quantity,
        unit: ing?.unit,
        notes: ing?.notes,
        typeof: typeof ing
      });
    });

    // Validate form before submission
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation Errors:', validationErrors);
      setErrors(validationErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setIsSubmitting(true);

    try {
      const data = await axiosRequest({
        url: "recipe/create",
        method: "POST",
        body: formData
      });

      console.log('Recipe created successfully:', data);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error creating recipe:', error);
      // Handle specific error types
      if (error.response?.status === 413) {
        setErrors({ image: 'התמונה גדולה מדי. נא לבחור תמונה קטנה יותר' });
      } else if (error.response?.status === 400) {
        setErrors({ general: error.response?.data?.message || 'נתונים שגויים. נא לבדוק את הטופס' });
      } else {
        setErrors({ general: 'שגיאה ביצירת המתכון. נסה שוב' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <div className="new-recipe-page">
      <div className="header">
        <Link to={-1}>
          <button className="back-btn">
            <i className="fas fa-arrow-right"></i>
          </button>
        </Link>
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
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {/* Show selected image name or upload content */}
                {selectedImage ? (
                  <div className="selected-image">
                    <i className="fas fa-check-circle success-icon"></i>
                    <div className="upload-text">נבחרה: {selectedImage.name}</div>
                    <div className="upload-hint">לחץ כדי לשנות תמונה</div>
                  </div>
                ) : (
                  <div className="upload-content">
                    <i className="fas fa-cloud-upload-alt upload-icon"></i>
                    <div className="upload-text">הוסף תמונה למתכון</div>
                    <div className="upload-hint">לחץ כדי לבחור תמונה מהמכשיר</div>
                  </div>
                )}
              </div>
              {errors.image && <span className="error-message">{errors.image}</span>}
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
                  name="title"
                  placeholder="לדוגמה: עוגת שוקולד ביתית"
                  required
                  className={errors.recipeName ? 'error' : ''}
                />
                {errors.recipeName && <span className="error-message">{errors.recipeName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="recipeDescription">תיאור קצר</label>
                <textarea
                  id="recipeDescription"
                  name="description"
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
                    className={errors.prepTime ? 'error' : ''}
                  />
                  {errors.prepTime && <span className="error-message">{errors.prepTime}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="servings">מספר מנות</label>
                  <input
                    type="number"
                    id="servings"
                    name="servings"
                    placeholder="4"
                    min="1"
                    className={errors.servings ? 'error' : ''}
                  />
                  {errors.servings && <span className="error-message">{errors.servings}</span>}
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
                <label>קטגוריה *</label>
                <div className="category-grid">
                  {categories.map(category => (
                    <div
                      key={category.key}
                      className={`category-pill ${selectedCategory === category.key ? 'selected' : ''} ${errors.category ? 'error' : ''}`}
                      onClick={() => selectCategory(category.key)}
                    >
                      <i className={`fas fa-${category.icon}`}></i>
                      <span>{category.text}</span>
                    </div>
                  ))}
                </div>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>
              <div className="form-group">
                <label>רמת קושי *</label>
                <div className="difficulty-options">
                  {difficultyLevel.map(difficulty => (
                    <div
                      key={difficulty.key}
                      className={`difficulty-option ${selectedDifficulty === difficulty.value ? 'selected' : ''} ${errors.difficulty ? 'error' : ''}`}
                      onClick={() => selectDifficulty(difficulty.value)}
                    >
                      <i className={`fas fa-${difficulty.icon} difficulty-icon`}></i>
                      <span className="difficulty-text">{difficulty.text}</span>
                    </div>
                  ))}
                </div>
                {errors.difficulty && <span className="error-message">{errors.difficulty}</span>}
              </div>
            </div>
          </div>

          {/* FIXED: Ingredients Section */}
          <div className="form-section">
            <div className="section-header">
              <h3><i className="fas fa-list"></i>רכיבים *</h3>
            </div>
            <div className="section-content">
              <div className="dynamic-list" id="ingredientsList">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-item">
                    <div className="ingredient-row">
                      <div className="form-group ingredient-name">
                        <label>שם הרכיב *</label>
                        <input
                          type="text"
                          placeholder="לדוגמה: קמח"
                          className={`ingredient-input ${errors.ingredients ? 'error' : ''}`}
                          value={ingredient.name || ''}
                          onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                        />
                      </div>

                      <div className="form-group ingredient-quantity">
                        <label>כמות *</label>
                        <input
                          type="number"
                          placeholder="2"
                          min="0"
                          step="0.1"
                          className={`ingredient-input ${errors.ingredients ? 'error' : ''}`}
                          value={ingredient.quantity || ''}
                          onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                        />
                      </div>

                      <div className="form-group ingredient-unit">
                        <label>יחידת מידה *</label>
                        <select
                          className={`ingredient-select ${errors.ingredients ? 'error' : ''}`}
                          value={ingredient.unit || ''}
                          onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                        >
                          <option value="">בחר יחידה</option>
                          {unitTypes.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group ingredient-notes">
                        <label>הערות</label>
                        <input
                          type="text"
                          placeholder="קצוץ דק, מבושל..."
                          className="ingredient-input"
                          value={ingredient.notes || ''}
                          onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeIngredient(index)}
                      title="הסר רכיב"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
              {errors.ingredients && <span className="error-message">{errors.ingredients}</span>}
              <button type="button" className="add-btn" onClick={addIngredient}>
                <i className="fas fa-plus"></i>
                הוסף רכיב
              </button>
            </div>
          </div>

          {/* Instructions Section */}
          <div className="form-section">
            <div className="section-header">
              <h3><i className="fas fa-clipboard-list"></i>הוראות הכנה *</h3>
            </div>
            <div className="section-content">
              <div className="dynamic-list" id="instructionsList">
                {instructions.map((instruction, index) => (
                  <div key={index} className="list-item">
                    <input
                      type="text"
                      placeholder={`שלב ${index + 1}: לערבב את החומרים היבשים...`}
                      className={`instruction-input ${errors.instructions ? 'error' : ''}`}
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
              {errors.instructions && <span className="error-message">{errors.instructions}</span>}
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
          form="recipeForm"
          disabled={isSubmitting}
        >
          <span className="btn-text">
            <i className="fas fa-paper-plane"></i>
            פרסם מתכון
          </span>
          <div className="spinner"></div>
        </button>
      </div>

      {/* Show general errors */}
      {errors.general && (
        <div className="error-banner">
          <i className="fas fa-exclamation-triangle"></i>
          {errors.general}
        </div>
      )}

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