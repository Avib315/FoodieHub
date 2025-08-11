import React, { useState, useEffect } from 'react'
import './style.scss'
import RecipeCard from '../../component/RecipeCard'
import SearchBar from '../../component/SerchBar'
import DropDown from '../../component/DropDown'
import { AiOutlineFilter, AiOutlineClose } from 'react-icons/ai'
import NavBar from '../../component/NavBar'
import useApiRequest from '../../services/useApiRequest'
import axiosRequest from '../../services/axiosRequest'
import { Link } from 'react-router-dom'
import FilterBar from '../FilterBar'
import LoadingPage from '../../page/LoadingPage'

export default function RecipesDisplay({ data = [], loading = false, isMyRecipes, addSaveBtn = true }) {
  if (loading) {
    return <LoadingPage />
  }
  return (
    <>
      <div className='recipes-page'>
        <div className='recipes-list'>
          {/* Display filtered data, not original data */}
          {data.map(recipe => (
            <RecipeCard
              addSaveBtn={addSaveBtn}
              isMyRecipes={isMyRecipes}
              key={recipe._id}
              recipe={recipe}
              id={recipe._id}
            />
          ))}
        </div>

        {/* Empty State */}
        {data.length === 0 && data.length > 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>לא נמצאו מתכונים</h3>
            <p>נסה לשנות את קריטריוני החיפוש או נקה את הסינונים</p>
          </div>
        )}

        {/* No Data State */}
        {data.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🍳</div>
            <h3>אין מתכונים זמינים</h3>
            <p>טוען מתכונים או שאין מתכונים במערכת</p>
          </div>
        )}
      </div>
    </>
  )
}