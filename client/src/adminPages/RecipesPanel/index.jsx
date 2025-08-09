import React, { useState, useEffect } from 'react';
import Table from '../../component/Table';
import './style.scss';
import useAxiosRequest from '../../services/useApiRequest';
import axiosRequest from '../../services/axiosRequest';
import categoryOptions from '../../data/options/categoryOptions';

const recipeColumns = [
  { title: 'שם המתכון', field: 'title', typeof: 'string' },
  { title: 'קטגוריה', field: 'categoryLabel', typeof: 'badge' },
  { title: 'זמן הכנה', field: 'prepTime', typeof: 'string' },
  { title: 'רמת קושי', field: 'difficultyLevel', typeof: 'badge' },
  { title: 'סטטוס', field: 'status', typeof: 'badge' },
  { title: 'תאריך יצירה', field: 'createdAt', typeof: 'date' },
  { title: 'פעולות', field: 'actions', typeof: 'actions' }
];


export default function RecipesPanel() {
  const { data } = useAxiosRequest({ url: `/admin/getAllRecipes`, defaultValue: [], method: "GET" });

  const [recipeData, setRecipeData] = useState(data);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  // Get unique categories for filter
  const categories = [...new Set(recipeData.map(recipe => recipe.category))];

  useEffect(() => {
    setRecipeData(data);
  }, [data]);

  // Filter recipes based on search and filters
  const filteredRecipes = recipeData.filter(recipe => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || recipe.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || recipe.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const toggleRecipeStatus = async (recipeId, status) => {
    const newStatus = status === 'active' ? 'rejected' : 'active';

    const res = await axiosRequest({
      url: `/admin/updateRecipeStatus`,
      body: { status: newStatus, id: recipeId },
      method: 'PUT'
    });

    if (!res.data.success) {
      alert('שגיאה בשינוי הסטטוס של המתכון');
      return;
    }

    if (status === 'active') {
      setRecipeData(prevData =>
        prevData.map(recipe =>
          recipe._id === recipeId
            ? { ...recipe, status: 'rejected' }
            : recipe
        )
      );
    } else {
      setRecipeData(prevData =>
        prevData.map(recipe =>
          recipe._id === recipeId
            ? { ...recipe, status: 'active' }
            : recipe
        )
      );
    }
  };

  // Add action buttons to table data
  const tableDataWithActions = filteredRecipes.map(recipe => {
    const categoryLabel = categoryOptions.find(opt => opt.value === recipe.category)?.label || recipe.category;
    return {
      ...recipe,
      categoryLabel,
      actions: (
        <div className="recipe-actions">
          <button
            className="action-btn view-btn"
            onClick={() => viewRecipe(recipe._id)}
            title="צפייה במתכון"
          >
            <span>👁️</span>
          </button>
          <button
            onClick={() => toggleRecipeStatus(recipe._id, recipe.status)}
            className="action-btn edit-btn"
            title={recipe.status === 'active' ? 'הפוך ללא פעיל' : 'הפוך לפעיל'}
          >
            {recipe.status === 'active' ? '⏸️' : '▶️'}
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => deleteRecipe(recipe._id)}
            title="מחיקת מתכון"
          >
            <span>🗑️</span>
          </button>
        </div>
      )
    }
  });

  const viewRecipe = (recipeId) => {
    const recipe = recipeData.find(r => r._id === recipeId);
    setSelectedRecipe(recipe);
    console.log(`Viewing recipe with ID: ${recipeId} this ,`, recipe);
  };

  const deleteRecipe = async (recipeId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את המתכון?')) {
      const res = await axiosRequest({
        url: `/admin/deleteRecipe/${recipeId}`,
        method: 'DELETE'
      });

      if (!res.data.success) {
        alert('שגיאה במחיקת המתכון');
        return;
      }

      setRecipeData(prevData => prevData.filter(recipe => recipe._id !== recipeId));
      if (selectedRecipe && selectedRecipe._id === recipeId) {
        setSelectedRecipe(null);
      }
    }
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
        <a className="back-btn" href="/admin-panel">
          חזור לפאנל
          <span>← </span>
        </a>
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
            <option value="rejected">לא פעיל</option>
            <option value="draft">טיוטה</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">כל הקטגוריות</option>
            {categories.map(
              category => {
                const option = categoryOptions.find(opt => opt.value === category);
                return (
                  <option key={category} value={category}>
                    {option ? option.label : category}
                  </option>
                );
              }
            )}
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
              <h2>{selectedRecipe.title}</h2>
              <button className="close-btn" onClick={closeRecipeDetails}>
                ✕
              </button>
            </div>

            <div className="details-content">
              <div className="recipe-info">
                <div className="info-item">
                  <strong>קטגוריה:</strong>
                  <span className={`category-badge ${selectedRecipe?.category}`}>
                    {selectedRecipe?.category}
                  </span>
                </div>

                <div className="info-item">
                  <strong>זמן הכנה:</strong>
                  <span>{selectedRecipe?.prepTime}</span>
                </div>

                <div className="info-item">
                  <strong>רמת קושי:</strong>
                  <span className={`difficulty-badge ${selectedRecipe?.difficulty}`}>
                    {selectedRecipe?.difficulty}
                  </span>
                </div>

                <div className="info-item">
                  <strong>סטטוס:</strong>
                  <span className={`status-badge ${selectedRecipe?.status}`}>
                    {selectedRecipe?.status === 'active' ? 'פעיל' :
                      selectedRecipe?.status === 'pending' ? 'ממתין' : 'לא פעיל'}
                  </span>
                </div>
              </div>

              <div className="recipe-description">
                <h3>תיאור</h3>
                <p>{selectedRecipe?.description}</p>
              </div>

              <div className="recipe-ingredients">
                <h3>רכיבים</h3>
                <ul>
                  {selectedRecipe?.ingredients.map((ingredient, index) => (
                    <li key={index}>{Object.values(ingredient)[0]}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}