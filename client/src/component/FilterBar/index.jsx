import React, { useState, useCallback, useMemo, useEffect } from 'react'
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

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState({
    category: "",
    difficulty: "",
    rating: "",
    time: ""
  })

  // Calculate active filters count using useMemo
  const activeFilters = useMemo(() => {
    return Object.values(filterOption).filter(value => value !== "").length;
  }, [filterOption]);

  // Memoize the dropdown change handler
  const handelSelectChange = useCallback((name, value) => {
    setFilterOption(prev => ({ ...prev, [name]: value }));
  }, []);
  useEffect(() => {

  }, [filterOption]);
  // Memoize the search change handler
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Memoize the search handler
  const handelSearch = useCallback(() => {
    let filteredData = [...data];

    // Apply search filter
    if (searchTerm.trim()) {
      filteredData = filteredData.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply other filters
    if (filterOption.category) {
      filteredData = filteredData.filter(r => r.category === filterOption.category);
    }
    if (filterOption.difficulty) {
      filteredData = filteredData.filter(r => r.difficulty === filterOption.difficulty);
    }
    if (filterOption.rating) {
      filteredData = filteredData.filter(r => r.rating >= parseInt(filterOption.rating));
    }
    if (filterOption.time) {
      filteredData = filteredData.filter(r => r.time <= parseInt(filterOption.time));
    }

    setData(filteredData);
  }, [searchTerm, filterOption, data, setData]);

  // Memoize the key down handler
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handelSearch();
    }
  }, [handelSearch]);

  // Memoize the clear filters handler
  const clearAllFilters = useCallback(() => {
    setFilterOption({
      category: "",
      difficulty: "",
      rating: "",
      time: ""
    });
    setSearchTerm('');
    // Reset data to original
    // You might want to pass original data as a prop or store it separately
  }, []);

  // Memoize mobile filter handlers
  const toggleMobileFilter = useCallback(() => {
    setIsMobileFilterOpen(prev => !prev);
  }, []);

  const closeMobileFilter = useCallback(() => {
    setIsMobileFilterOpen(false);
  }, []);

  // Create dropdown change handlers for each dropdown
  const handleCategoryChange = useCallback((value) => {
    handelSelectChange('category', value);
  }, [handelSelectChange]);

  const handleDifficultyChange = useCallback((value) => {
    handelSelectChange('difficulty', value);
  }, [handelSelectChange]);

  const handleRatingChange = useCallback((value) => {
    handelSelectChange('rating', value);
  }, [handelSelectChange]);

  const handleTimeChange = useCallback((value) => {
    handelSelectChange('time', value);
  }, [handelSelectChange]);

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
         
              <SearchBar
                label="חיפוש מתכונים..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
              />
              <DropDown
                options={categoryOptions}
                onSelect={handleCategoryChange}
                placeholder="קטגוריה"
                name="category"
                defaultValue={filterOption.category}
              />
              <DropDown
                options={difLevelOptions}
                onSelect={handleDifficultyChange}
                placeholder="רמת קושי"
                name="difficulty"
                defaultValue={filterOption.difficulty}
              />
              <DropDown
                options={ratingOptions}
                onSelect={handleRatingChange}
                placeholder="דירוג"
                name="rating"
                defaultValue={filterOption.rating}
              />
              <DropDown
                options={timeOptions}
                onSelect={handleTimeChange}
                placeholder="זמן הכנה"
                name="time"
                defaultValue={filterOption.time}
              />
            
          </div>
        )}

        {/* Desktop/Tablet filters */}
        {!isMobileFilterOpen && (
          <>
            <SearchBar
              label="חיפוש מתכונים..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <DropDown
              options={categoryOptions}
              onSelect={handleCategoryChange}
              placeholder="קטגוריה"
              name="category"
              defaultValue={filterOption.category}
            />
            <DropDown
              options={difLevelOptions}
              onSelect={handleDifficultyChange}
              placeholder="רמת קושי"
              name="difficulty"
              defaultValue={filterOption.difficulty}
            />
            <DropDown
              options={ratingOptions}
              onSelect={handleRatingChange}
              placeholder="דירוג"
              name="rating"
              defaultValue={filterOption.rating}
            />
            <DropDown
              options={timeOptions}
              onSelect={handleTimeChange}
              placeholder="זמן הכנה"
              name="time"
              defaultValue={filterOption.time}
            />
            <button onClick={handelSearch}>חיפוש</button>
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