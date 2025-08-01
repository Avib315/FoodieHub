import React, { useState, useRef, useEffect } from 'react'
import './style.scss'

export default function Input({
  placeholder = "חפש", 
  label, 
  onChange, 
  value, 
  name, 
  type = "text", 
  required = false, 
  disabled = false, 
  onKeyDown, 
  onFocus, 
  onBlur,
  // Additional props for enhanced functionality
  error,
  success,
  helpText,
  size = "medium", // "small", "medium", "large"
  variant = "default", // "default", "outlined", "filled", "underlined", "floating"
  icon,
  iconPosition = "right",
  loading = false,
  className = "",
  autoFocus = false,
  maxLength,
  minLength,
  pattern,
  autoComplete,
  id
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(!!value)
  const inputRef = useRef(null)

  // Update hasValue when value prop changes
  useEffect(() => {
    setHasValue(!!value)
  }, [value])

  // Auto focus if specified
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleFocus = (e) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  const handleChange = (e) => {
    setHasValue(!!e.target.value)
    onChange?.(e)
  }

  // Build className for input field container
  const inputFieldClasses = [
    'input-field',
    variant === 'floating' && 'floating-label',
    icon && iconPosition === 'left' && 'has-icon-left',
    icon && iconPosition === 'right' && 'has-icon-right',
    loading && 'loading',
    variant === 'outlined' && 'input-outlined',
    variant === 'filled' && 'input-filled',
    variant === 'underlined' && 'input-underlined',
    className
  ].filter(Boolean).join(' ')

  // Build className for input element
  const inputElementClasses = [
    'input-element',
    size === 'small' && 'input-sm',
    size === 'large' && 'input-lg',
    error && 'error',
    success && 'success',
    hasValue && 'has-value'
  ].filter(Boolean).join(' ')

  // Generate unique ID if not provided
  const inputId = id || `input-${name || Date.now()}`

  return (
    <div className={inputFieldClasses}>
      {/* Standard label (not floating) */}
      {label && variant !== 'floating' && (
        <label 
          htmlFor={inputId}
          className="input-label"
          data-required={required}
        >
          {label}
        </label>
      )}

      {/* Input element */}
      <input
        ref={inputRef}
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value || ''}
        name={name}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        disabled={disabled}
        className={inputElementClasses}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={
          [
            error && `${inputId}-error`,
            helpText && `${inputId}-help`
          ].filter(Boolean).join(' ') || undefined
        }
      />

      {/* Floating label */}
      {label && variant === 'floating' && (
        <label 
          htmlFor={inputId}
          className="input-label"
          data-required={required}
        >
          {label}
        </label>
      )}

      {/* Icon */}
      {icon && (
        <span className="input-icon" aria-hidden="true">
          {icon}
        </span>
      )}

      {/* Focus ring for accessibility */}
      <div className="input-focus-ring" />

      {/* Error message */}
      {error && (
        <span 
          id={`${inputId}-error`}
          className="input-error"
          role="alert"
        >
          {error}
        </span>
      )}

      {/* Help text */}
      {helpText && !error && (
        <span 
          id={`${inputId}-help`}
          className="input-help"
        >
          {helpText}
        </span>
      )}
    </div>
  )
}

