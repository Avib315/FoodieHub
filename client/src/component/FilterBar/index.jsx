import React, { useState } from 'react'
import './style.scss'
import { AiOutlineClose, AiOutlineFilter } from 'react-icons/ai'
import SearchBar from '../SerchBar'
import DropDown from '../DropDown'
export default function FilterBar({ data }) {
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
            <SearchBar label="חיפוש מתכונים..." />
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
            <SearchBar label="חיפוש מתכונים..." />
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
