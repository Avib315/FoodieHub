import React, { useState, useEffect } from 'react';
import Table from '../../component/Table';
import './style.scss';

const recipeColumns = [
  { title: 'שם המתכון', field: 'name', typeof: 'string' },
  { title: 'קטגוריה', field: 'category', typeof: 'badge' },
  { title: 'זמן הכנה', field: 'prepTime', typeof: 'string' },
  { title: 'רמת קושי', field: 'difficulty', typeof: 'badge' },
  { title: 'סטטוס', field: 'status', typeof: 'badge' },
  { title: 'תאריך יצירה', field: 'createdAt', typeof: 'date' },
  { title: 'פעולות', field: 'actions', typeof: 'actions' }
];

const initialRecipeData = [
  {
    id: 1,
    name: 'פיצה מרגריטה',
    category: 'עיקרי',
    prepTime: '30 דקות',
    difficulty: 'קל',
    status: 'active',
    createdAt: '2024-01-15',
    description: 'פיצה קלסית עם רוטב עגבניות, מוצרלה וזרעי בזיליקום טריים',
    ingredients: ['קמח', 'שמרים', 'רוטב עגבניות', 'גבינת מוצרלה', 'בזיליקום'],
    link: 'https://example.com/recipe/margherita'
  },
  {
    id: 2,
    name: 'סלט יווני',
    category: 'סלטים',
    prepTime: '15 דקות',
    difficulty: 'קל',
    status: 'active',
    createdAt: '2024-02-20',
    description: 'סלט רענן עם עגבניות, מלפפונים, זיתים וגבינת פטה',
    ingredients: ['עגבניות', 'מלפפונים', 'זיתים', 'גבינת פטה', 'שמן זית'],
    link: 'https://example.com/recipe/greek-salad'
  },
  {
    id: 3,
    name: 'עוגת שוקולד',
    category: 'קינוחים',
    prepTime: '45 דקות',
    difficulty: 'בינוני',
    status: 'pending',
    createdAt: '2024-03-10',
    description: 'עוגת שוקולד עשירה ולחה עם קרם שוקולד',
    ingredients: ['שוקולד מריר', 'קמח', 'ביצים', 'חמאה', 'סוכר'],
    link: 'https://example.com/recipe/chocolate-cake'
  },
  {
    id: 4,
    name: 'מרק עדשים',
    category: 'מרקים',
    prepTime: '40 דקות',
    difficulty: 'קל',
    status: 'inactive',
    createdAt: '2024-04-05',
    description: 'מרק עדשים מזין ובריא עם ירקות',
    ingredients: ['עדשים אדומות', 'בצל', 'גזר', 'סלרי', 'תבלינים'],
    link: 'https://example.com/recipe/lentil-soup'
  }
];

export default function RecipesPanel() {
  const [recipeData, setRecipeData] = useState(initialRecipeData);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Get unique categories for filter
  const categories = [...new Set(recipeData.map(recipe => recipe.category))];

  // Filter recipes based on search and filters
  const filteredRecipes = recipeData.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || recipe.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || recipe.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Add action buttons to table data
  const tableDataWithActions = filteredRecipes.map(recipe => ({
    ...recipe,
    actions: (
      <div className="recipe-actions">
        <button 
          className="action-btn view-btn"
          onClick={() => viewRecipe(recipe.id)}
          title="צפייה במתכון"
        >
          <span>👁️</span>
        </button>
        <button 
          className="action-btn edit-btn"
          onClick={() => editRecipe(recipe.id)}
          title="עריכת מתכון"
        >
          <span>✏️</span>
        </button>
        <button 
          className="action-btn delete-btn"
          onClick={() => deleteRecipe(recipe.id)}
          title="מחיקת מתכון"
        >
          <span>🗑️</span>
        </button>
      </div>
    )
  }));

  const viewRecipe = (recipeId) => {
    const recipe = recipeData.find(r => r.id === recipeId);
    setSelectedRecipe(recipe);
    console.log(`Viewing recipe with ID: ${recipeId}`);
  };

  const editRecipe = (recipeId) => {
    console.log(`Editing recipe with ID: ${recipeId}`);
    // Add your edit logic here
  };

  const deleteRecipe = (recipeId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את המתכון?')) {
      setRecipeData(prevData => prevData.filter(recipe => recipe.id !== recipeId));
      if (selectedRecipe && selectedRecipe.id === recipeId) {
        setSelectedRecipe(null);
      }
    }
  };

  const addNewRecipe = () => {
    console.log('Adding new recipe');
    // Add your new recipe logic here
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterCategory('all');
  };

  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="recipes-panel">
      {/* Header */}
      <div className="panel-header">
        <div className="header-content">
          <h1>ניהול מתכונים</h1>
          <p>נהל את המתכונים שלך בקלות</p>
        </div>
        <button className="add-recipe-btn" onClick={addNewRecipe}>
          <span>➕</span>
          הוסף מתכון חדש
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="חפש מתכונים..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">כל הסטטוסים</option>
            <option value="active">פעיל</option>
            <option value="pending">ממתין</option>
            <option value="inactive">לא פעיל</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">כל הקטגוריות</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <button className="clear-filters-btn" onClick={clearFilters}>
            נקה סינון
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-number">{recipeData.length}</span>
          <span className="stat-label">סה״כ מתכונים</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{recipeData.filter(r => r.status === 'active').length}</span>
          <span className="stat-label">מתכונים פעילים</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{categories.length}</span>
          <span className="stat-label">קטגוריות</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{filteredRecipes.length}</span>
          <span className="stat-label">תוצאות מסוננות</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="panel-content">
        {/* Table Section */}
        <div className="table-section">
          <Table 
            tableColumns={recipeColumns} 
            tableData={tableDataWithActions}
            loading={loading}
            emptyMessage="לא נמצאו מתכונים"
            striped={true}
            hoverable={true}
          />
        </div>

        {/* Recipe Details Sidebar */}
        {selectedRecipe && (
          <div className="recipe-details">
            <div className="details-header">
              <h2>{selectedRecipe.name}</h2>
              <button className="close-btn" onClick={closeRecipeDetails}>
                ✕
              </button>
            </div>
            
            <div className="details-content">
              <div className="recipe-info">
                <div className="info-item">
                  <strong>קטגוריה:</strong> 
                  <span className={`category-badge ${selectedRecipe.category}`}>
                    {selectedRecipe.category}
                  </span>
                </div>
                
                <div className="info-item">
                  <strong>זמן הכנה:</strong> 
                  <span>{selectedRecipe.prepTime}</span>
                </div>
                
                <div className="info-item">
                  <strong>רמת קושי:</strong> 
                  <span className={`difficulty-badge ${selectedRecipe.difficulty}`}>
                    {selectedRecipe.difficulty}
                  </span>
                </div>
                
                <div className="info-item">
                  <strong>סטטוס:</strong> 
                  <span className={`status-badge ${selectedRecipe.status}`}>
                    {selectedRecipe.status === 'active' ? 'פעיל' : 
                     selectedRecipe.status === 'pending' ? 'ממתין' : 'לא פעיל'}
                  </span>
                </div>
              </div>

              <div className="recipe-description">
                <h3>תיאור</h3>
                <p>{selectedRecipe.description}</p>
              </div>

              <div className="recipe-ingredients">
                <h3>רכיבים</h3>
                <ul>
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="recipe-actions-full">
                <a 
                  href={selectedRecipe.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-full-btn"
                >
                  צפה במתכון המלא
                </a>
                <button 
                  className="edit-full-btn"
                  onClick={() => editRecipe(selectedRecipe.id)}
                >
                  ערוך מתכון
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}