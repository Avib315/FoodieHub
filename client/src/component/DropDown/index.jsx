import React, { useState } from 'react'
import './style.scss'

export default function DropDown({ options, onSelect, name, defaultValue = "", placeholder = "בחר אפשרות" }) {
  return (
    <div className='drop-down'>
      <select 
        className='drop-down-select' 
        onChange={onSelect}
        name={name}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}