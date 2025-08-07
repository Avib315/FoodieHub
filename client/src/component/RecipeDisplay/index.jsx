import React, { useState } from 'react'
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

export default function RecipesDisplay({ data = []}) {




  return (
    <>
      <div className='recipes-page'>
        {/* Desktop/Tablet Filter Container */}
        <FilterBar data={data}/>
        



        <div className='recipes-list'>
          {data.map(recipe => (
            <>
  
                <RecipeCard key={recipe._id} recipe={recipe} id={recipe._id} />
            </>
          ))}
        </div>

        {/* Empty State Example */}
        {data.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🍳</div>
            <h3>לא נמצאו מתכונים</h3>
            <p>נסה לשנות את קריטריוני החיפוש או נקה את הסינונים</p>
          </div>
        )}
      </div>
    </>
  )
}