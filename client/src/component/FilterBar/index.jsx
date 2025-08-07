import React, { useState } from 'react'
import './style.scss'
import { AiOutlineClose, AiOutlineFilter } from 'react-icons/ai'
import SearchBar from '../SerchBar'
import DropDown from '../DropDown'
import categoryOptions from '../../data/options/categoryOptions'
import difLevelOptions from '../../data/options/difLevelOption'
export default function FilterBar({ data }) {
  console.log("data FilterBar:" ,data);
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)
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
  const handelSearch = () => {
    // Implement search logic here
    console.log("Search clicked")
  }
  const FilterElements = ()=>{
    return (
      <>
            <SearchBar label="חיפוש מתכונים..." />
            <DropDown
              options={difLevelOptions}
              onSelect={handleFilterSelect}
              name="חיפוש לפי קטגוריה..."
            />
            <DropDown
              options={categoryOptions}
              onSelect={handleFilterSelect}
              name="סינון לפי..."
            />
            <button onClick={() => handelSearch()}>חיפוש</button>
          </>
    )
  }



  return (
    <>
      <div className={`filter-container ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
        {/* Mobile filter modal content */}
        {isMobileFilterOpen && (
          <div className="filter-content">
            <button className="close-filters" onClick={closeMobileFilter}>
              <AiOutlineClose />
            </button>
            <h3>סינון מתכונים</h3>
            <FilterElements />
          </div>
        )}

        {/* Desktop/Tablet filters */}
        {!isMobileFilterOpen && (
          <>
          <FilterElements />
          </>
        )}
      </div>

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
    </>
  )
}
