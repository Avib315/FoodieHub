import React from 'react'
import './style.scss'

export default function FloatingElements({ 
  elements = ['🍳', '🥘', '🍰', '🧄', '🥕', '🍅'],
  count = 6,
  className = '',
  theme = 'cooking' // 'cooking', 'general', 'signup', 'custom'
}) {
  
  // Predefined themes
  const themes = {
    cooking: ['🍳', '🥘', '🍰', '🧄', '🥕', '🍅'],
    general: ['🍽️', '👨‍🍳', '📝', '❤️', '⭐', '🔥'],
    signup: ['👨‍🍳', '📝', '🎉', '🍽️', '❤️', '✨'],
    auth: ['📧', '🔐', '🍴', '👤', '✅', '🔑'],
    search: ['🔍', '🍕', '🍜', '🥗', '🍪', '🧁'],
    recipe: ['📖', '⏰', '👥', '⭐', '❤️', '🍽️'],
    loading: ['🍳', '⏳', '🍽️', '👨‍🍳', '📱', '✨'],
    error: ['😅', '🍕', '🔍', '🏠', '📱', '❤️'],
    custom: elements
  }

  // Get elements based on theme
  const themeElements = themes[theme] || themes.cooking
  const finalElements = themeElements.slice(0, count)

  return (
    <div className={`floating-elements ${className} theme-${theme}`}>
      {finalElements.map((element, index) => (
        <div 
          key={index}
          className={`floating-element element-${index + 1}`}
          data-element={element}
          style={{
            '--animation-delay': `${-index * 0.5}s`,
            '--animation-duration': `${6 + index}s`
          }}
        >
          {element}
        </div>
      ))}
    </div>
  )
}
