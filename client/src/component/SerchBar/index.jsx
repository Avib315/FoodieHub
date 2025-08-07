import React from 'react'
import './style.scss'

export default function SearchBar({
  placeholder = "חפש",
  label,
  onChange,
  value,
  name,
  type = "text",
  required,
  disabled,
  onKeyDown,
  onFocus,
  onBlur
}) {


  return (
    <div className='search-bar'>
      {label && <label className='search-bar-label'>{label}</label>}
      <div className='search-bar-container'>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          className='search-bar-input'
        />
        <div className='search-bar-icon'>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}