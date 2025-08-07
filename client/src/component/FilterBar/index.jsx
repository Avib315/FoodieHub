import React, { useCallback, useMemo, useState } from 'react'
import './style.scss'
import { AiOutlineClose, AiOutlineFilter } from 'react-icons/ai'
import SearchBar from '../SerchBar'
import DropDown from '../DropDown'
import categoryOptions from '../../data/options/categoryOptions'
import difLevelOptions from '../../data/options/difLevelOption'
import ratingOptions from '../../data/options/ratingOptions'
import timeOptions from '../../data/options/timeOptions'
export default function FilterBar({ data, setData }) {



  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState({
    category: "",
    difficulty: "",
    rating: "",
    time: ""
  })
  const handelSelectChange = (e) => {
    const { name, value } = e.target;
    setFilterOption(prev => ({ ...prev, [name]: value }));
  }
  const activeFilters = useMemo(() => {
    return Object.values(filterOption).filter(value => value !== "").length;
  }, [filterOption]);


  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen)
  }

  const closeMobileFilter = () => {
    setIsMobileFilterOpen(false)
  }
  const handelSearch = useCallback(() => {
    console.log("Current searchTerm:", searchTerm);
    console.log("Current filterOption:", filterOption);
    
    let filteredData = [...data];

    // Apply search filter
    if (searchTerm.trim()) {
      filteredData = filteredData.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filter options
    Object.entries(filterOption).forEach(([key, value]) => {
      if (value) {
        filteredData = filteredData.filter(r => r[key] === value);
      }
    });

    setData(filteredData);
  }, [searchTerm, filterOption, data]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handelSearch();
    }
  };
  const clearAllFilters = useCallback(() => {
    setFilterOption({
      category: "",
      difficulty: "",
      rating: "",
      time: ""
    });
    setSearchTerm('');

  }, []);

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
          onSelect={handelSelectChange}
          placeholder="קטגוריה"
          name={"category"}
        />
        <DropDown
          options={difLevelOptions}
          onSelect={handelSelectChange}
          placeholder="רמת קושי"
          name={"difficulty"}

        />
        <DropDown
          options={ratingOptions}
          onSelect={handelSelectChange}
          placeholder="דירוג"
          name={"rating"}
        />
        <DropDown
          options={timeOptions}
          onSelect={handelSelectChange}
          placeholder="זמן הכנה"
          name={"time"}
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
