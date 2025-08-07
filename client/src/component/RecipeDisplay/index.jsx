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

export default function RecipesDisplay({ data = [] }) {
  // State for filtered data - this is what gets displayed
  const [filteredData, setFilteredData] = useState(data);

  // Update filtered data when original data changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  return (
    <>
      <div className='recipes-page'>
        {/* Desktop/Tablet Filter Container */}
        {/* <FilterBar 
          originalData={data} 
          data={filteredData} 
          setData={setFilteredData} 
        /> */}

        <div className='recipes-list'>
          {/* Display filtered data, not original data */}
          {filteredData.map(recipe => (
            <RecipeCard 
              key={recipe._id} 
              recipe={recipe} 
              id={recipe._id} 
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && data.length > 0 && (
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