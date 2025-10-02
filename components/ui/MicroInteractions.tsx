'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

// Componente de card interativo com animações
export const InteractiveCard: React.FC<{
  children: React.ReactNode
  className?: string
  hover?: boolean
  click?: boolean
  disabled?: boolean
}> = ({ children, className = '', hover = true, click = true, disabled = false }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const handleMouseEnter = useCallback(() => {
    if (!disabled && hover) {
      setIsHovered(true)
    }
  }, [disabled, hover])

  const handleMouseLeave = useCallback(() => {
    if (!disabled && hover) {
      setIsHovered(false)
    }
  }, [disabled, hover])

  const handleMouseDown = useCallback(() => {
    if (!disabled && click) {
      setIsClicked(true)
    }
  }, [disabled, click])

  const handleMouseUp = useCallback(() => {
    if (!disabled && click) {
      setIsClicked(false)
    }
  }, [disabled, click])

  const baseClasses = "transition-all duration-200 ease-in-out"
  const hoverClasses = hover && !disabled ? "hover:shadow-lg hover:scale-105" : ""
  const clickClasses = click && !disabled ? "active:scale-95" : ""
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickClasses} ${disabledClasses} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        transform: isClicked ? 'scale(0.95)' : isHovered ? 'scale(1.05)' : 'scale(1)',
        boxShadow: isHovered ? '0 10px 25px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.1)'
      }}
    >
      {children}
    </div>
  )
}

// Container animado com entrada suave
export const AnimatedContainer: React.FC<{
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  duration?: number
}> = ({ 
  children, 
  className = '', 
  delay = 0, 
  direction = 'fade', 
  duration = 500 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(20px)'
      case 'down': return 'translateY(-20px)'
      case 'left': return 'translateX(20px)'
      case 'right': return 'translateX(-20px)'
      case 'fade': return 'translateY(0)'
      default: return 'translateY(0)'
    }
  }

  const getFinalTransform = () => {
    switch (direction) {
      case 'up':
      case 'down':
      case 'left':
      case 'right':
      case 'fade': return 'translateY(0) translateX(0)'
      default: return 'translateY(0) translateX(0)'
    }
  }

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? getFinalTransform() : getInitialTransform(),
        transition: `all ${duration}ms ease-out`
      }}
    >
      {children}
    </div>
  )
}

// Botão interativo com animações
export const InteractiveButton: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
}> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '' 
}) => {
  const [isPressed, setIsPressed] = useState(false)

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white'
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white'
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white'
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white'
      case 'outline':
        return 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'md':
        return 'px-4 py-2 text-base'
      case 'lg':
        return 'px-6 py-3 text-lg'
      default:
        return 'px-4 py-2 text-base'
    }
  }

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return
    onClick?.()
  }, [disabled, loading, onClick])

  const handleMouseDown = useCallback(() => {
    if (!disabled && !loading) {
      setIsPressed(true)
    }
  }, [disabled, loading])

  const handleMouseUp = useCallback(() => {
    setIsPressed(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsPressed(false)
  }, [])

  return (
    <button
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden rounded-lg font-medium transition-all duration-200 ease-in-out
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isPressed ? 'scale-95' : 'hover:scale-105'}
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center justify-center">
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Carregando...
          </>
        ) : (
          children
        )}
      </span>
    </button>
  )
}

// Botão com micro-interações avançadas
export const MicroButton: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
}> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '' 
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white'
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white'
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white'
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white'
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'md':
        return 'px-4 py-2 text-base'
      case 'lg':
        return 'px-6 py-3 text-lg'
      default:
        return 'px-4 py-2 text-base'
    }
  }

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return

    // Criar efeito ripple
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rippleId = Date.now()

    setRipples(prev => [...prev, { id: rippleId, x, y }])

    // Remover ripple após animação
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== rippleId))
    }, 600)

    onClick?.()
  }, [disabled, loading, onClick])

  const handleMouseDown = useCallback(() => {
    if (!disabled && !loading) {
      setIsPressed(true)
    }
  }, [disabled, loading])

  const handleMouseUp = useCallback(() => {
    setIsPressed(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsPressed(false)
  }, [])

  return (
    <button
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden rounded-lg font-medium transition-all duration-200 ease-in-out
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isPressed ? 'scale-95' : 'hover:scale-105'}
        ${className}
      `}
    >
      {/* Efeito ripple */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%'
          }}
        />
      ))}

      {/* Conteúdo do botão */}
      <span className="relative z-10 flex items-center justify-center">
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Carregando...
          </>
        ) : (
          children
        )}
      </span>
    </button>
  )
}

// Input com micro-interações
export const MicroInput: React.FC<{
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number'
  label?: string
  error?: string
  disabled?: boolean
  className?: string
}> = ({ 
  value, 
  onChange, 
  placeholder, 
  type = 'text', 
  label, 
  error, 
  disabled = false,
  className = '' 
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(!!value)

  useEffect(() => {
    setHasValue(!!value)
  }, [value])

  const handleFocus = useCallback(() => {
    if (!disabled) {
      setIsFocused(true)
    }
  }, [disabled])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }, [onChange])

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className={`
          absolute left-3 transition-all duration-200 ease-in-out pointer-events-none
          ${isFocused || hasValue 
            ? 'top-1 text-xs text-blue-600' 
            : 'top-3 text-sm text-gray-500'
          }
        `}>
          {label}
        </label>
      )}
      
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={!label ? placeholder : ''}
        disabled={disabled}
        className={`
          w-full px-3 py-3 border rounded-lg transition-all duration-200 ease-in-out
          ${isFocused 
            ? 'border-blue-500 ring-2 ring-blue-200' 
            : error 
              ? 'border-red-500' 
              : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${label ? 'pt-6 pb-2' : ''}
        `}
      />

      {error && (
        <div className="mt-1 text-sm text-red-600 animate-pulse">
          {error}
        </div>
      )}
    </div>
  )
}

// Hook para micro-interações personalizadas
export const useMicroInteractions = () => {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)
  const [clickedElement, setClickedElement] = useState<string | null>(null)

  const handleElementHover = useCallback((elementId: string) => {
    setHoveredElement(elementId)
  }, [])

  const handleElementLeave = useCallback(() => {
    setHoveredElement(null)
  }, [])

  const handleElementClick = useCallback((elementId: string) => {
    setClickedElement(elementId)
    setTimeout(() => setClickedElement(null), 200)
  }, [])

  return {
    hoveredElement,
    clickedElement,
    handleElementHover,
    handleElementLeave,
    handleElementClick
  }
}

// Componente de loading com micro-animações
export const MicroLoading: React.FC<{
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'green' | 'red' | 'yellow'
  text?: string
}> = ({ size = 'md', color = 'blue', text }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4'
      case 'md': return 'w-8 h-8'
      case 'lg': return 'w-12 h-12'
      default: return 'w-8 h-8'
    }
  }

  const getColorClasses = () => {
    switch (color) {
      case 'blue': return 'text-blue-600'
      case 'green': return 'text-green-600'
      case 'red': return 'text-red-600'
      case 'yellow': return 'text-yellow-600'
      default: return 'text-blue-600'
    }
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <div className={`
        ${getSizeClasses()} 
        ${getColorClasses()} 
        animate-spin rounded-full border-2 border-gray-300 border-t-current
      `} />
      {text && (
        <span className={`text-sm ${getColorClasses()}`}>
          {text}
        </span>
      )}
    </div>
  )
}