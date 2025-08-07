import React from 'react'
import './style.scss'
export default function DropDown({ options, onSelect  ,name}) {
  return (
    <div className='drop-down'>
      <button className='drop-down-btn'>{name}</button>
      <div className='drop-down-content'>
        {options.map((option, index) => (
          <div key={index} className='drop-down-item' onClick={() => onSelect(option.value)}>
            {option.label}
          </div>
        ))}
      </div>
    </div>
  )
}
