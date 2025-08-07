import React, { useState, useEffect } from 'react'
import './style.scss'

export default function DropDown({ options, onSelect, name, defaultValue = "", placeholder = "בחר אפשרות" }) {
  const [selectedValue, setSelectedValue] = useState(defaultValue)

  // Update selected value when defaultValue changes
  useEffect(() => {
    setSelectedValue(defaultValue)
  }, [defaultValue])

  const handelSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    onSelect(selectedValue);
  }

  return (
    <div className='drop-down'>
      <select 
        className='drop-down-select' 
        value={selectedValue}
        onChange={handelSelectChange}
        name={name}
      >
        <option value="">
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