import React, { useState } from 'react'
import './style.scss'
import RecipeCard from '../../component/RecipeCard'
import SearchBar from '../../component/SerchBar'
import DropDown from '../../component/DropDown'
import { AiOutlineFilter, AiOutlineClose } from 'react-icons/ai'
import {recipes} from './data.json'
import NavBar from '../../component/NavBar'
import useApiRequest from '../../services/useApiRequest'

export default function RecipesPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)
  
  const {data , setData } = useApiRequest({url: "/recipe/getAll" , defaultValue:[]})

  const handleFilterSelect = (option) => {
    console.log(option)
    setActiveFilters(prev => prev + 1)
  }

  const clearAllFilters = () => {
    setActiveFilters(0)
  }

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen)
  }

  const closeMobileFilter = () => {
    setIsMobileFilterOpen(false)
  }

  return (
    <>
    <NavBar/>
    <div className='recipes-page'>
      {/* Desktop/Tablet Filter Container */}
      <div className={`filter-container ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
        {/* Mobile filter modal content */}
        {isMobileFilterOpen && (
          <div className="filter-content">
            <button className="close-filters" onClick={closeMobileFilter}>
              <AiOutlineClose />
            </button>
            <h3>סינון מתכונים</h3>
            <SearchBar label="חיפוש מתכונים..."/>
            <DropDown 
              options={['בשרי', 'חלבי', 'צמחוני']} 
              onSelect={handleFilterSelect} 
              name="חיפוש לפי קטגוריה..."
              />
            <DropDown 
              options={['פופולרי', 'חדש', 'מומלץ']} 
              onSelect={handleFilterSelect} 
              name="סינון לפי..."
              />
          </div>
        )}
        
        {/* Desktop/Tablet filters */}
        {!isMobileFilterOpen && (
          <>
            <SearchBar label="חיפוש מתכונים..."/>
            <DropDown 
              options={['בשרי', 'חלבי', 'צמחוני']} 
              onSelect={handleFilterSelect} 
              name=" קטגוריה..."
            />
            <DropDown 
              options={['פופולרי', 'חדש', 'מומלץ']} 
              onSelect={handleFilterSelect} 
              name="סינון לפי..."
              />
          </>
        )}
      </div>

      {/* Mobile Floating Filter Button */}
      <button className="floating-filter-btn" onClick={toggleMobileFilter}>
        <AiOutlineFilter />
        {activeFilters > 0 && (
          <div className="filter-badge">{activeFilters}</div>
        )}
      </button>

      {/* Results Info */}
      {activeFilters > 0 && (
        <div className="results-info">
          <div className="results-count">
            נמצאו <strong>{arr.length}</strong> מתכונים
          </div>
          <button className="clear-filters" onClick={clearAllFilters}>
            נקה סינונים
          </button>
        </div>
      )}

      
      <div className='recipes-list'>  
        {data.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
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