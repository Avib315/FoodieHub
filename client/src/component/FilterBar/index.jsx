import React, { useState } from 'react'
import './style.scss'
import { AiOutlineClose, AiOutlineFilter } from 'react-icons/ai'
import SearchBar from '../SerchBar'
import DropDown from '../DropDown'
import categoryOptions from '../../data/options/categoryOptions'
import difLevelOptions from '../../data/options/difLevelOption'
import ratingOptions from '../../data/options/ratingOptions'
import timeOptions from '../../data/options/timeOptions'
export default function FilterBar({ data, setData }) {
  console.log("data FilterBar:", data);
  console.log("FilterBar render");


  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)
  const [searchTerm, setSearchTerm] = useState('');

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
    // Implement search logic here ysing searchTerm
    console.log("Search clicked")
    setData(data.filter(r => r.title.includes(searchTerm)))
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handelSearch();
    }
  };

  const FilterElements = () => {
    return (
      <>
        <SearchBar
          label="חיפוש מתכונים..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <DropDown
          options={categoryOptions}
          onSelect={handleFilterSelect}
          name="חיפוש לפי קטגוריה"
        />
        <DropDown
          options={difLevelOptions}
          onSelect={handleFilterSelect}
          name="חיפוש לפי רמת קושי"
        />
        <DropDown
          options={ratingOptions}
          onSelect={handleFilterSelect}
          name="חיפוש לפי דירוג"
        />
        <DropDown
          options={timeOptions}
          onSelect={handleFilterSelect}
          name="חיפוש לפי זמן הכנה"
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handelSearch();
              }}
            >
              <FilterElements />
            </form>
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
            נמצאו <strong>{data.length}</strong> מתכונים
          </div>
          <button className="clear-filters" onClick={clearAllFilters}>
            נקה סינונים
          </button>
        </div>
      )}
    </>
  )
}
