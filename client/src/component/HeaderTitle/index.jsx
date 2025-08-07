import React from 'react'
import './style.scss'
export default function HeaderTitle({ title }) {
  return (
       <header className='page-header'>
        <h1 className='page-title'>{title}</h1>
      </header>
  )
}
