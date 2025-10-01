'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from '@/lib/contexts/ThemeContext'

// Hook para micro-interações
export const useMicroInteractions = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)
  const handleMouseDown = () => setIsPressed(true)
  const handleMouseUp = () => setIsPressed(false)
  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  // Feedback háptico para dispositivos móveis
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30]
      }
      navigator.vibrate(patterns[type])
    }
  }

  // Feedback sonoro sutil
  const triggerSound = (type: 'click' | 'hover' | 'success' | 'error' = 'click') => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      const frequencies = {
        click: 800,
        hover: 600,
        success: 1000,
        error: 400
      }
      
      oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    }
  }

  return {
    isHovered,
    isPressed,
    isFocused,
    elementRef,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onFocus: handleFocus,
      onBlur: handleBlur
    },
    feedback: {
      haptic: triggerHaptic,
      sound: triggerSound
    }
  }
}

// Componente de card com micro-interações
interface InteractiveCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  variant?: 'default' | 'elevated' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
  role?: string
}

export const InteractiveCard = ({
  children,
  className = '',
  onClick,
  disabled = false,
  variant = 'default',
  size = 'md',
  ariaLabel,
  role = 'button'
}: InteractiveCardProps) => {
  const { theme } = useTheme()
  const { isHovered, isPressed, isFocused, handlers, feedback } = useMicroInteractions()

  const baseClasses = 'relative overflow-hidden transition-all duration-300 ease-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
  
  const sizeClasses = {
    sm: 'p-3 rounded-lg',
    md: 'p-4 rounded-xl',
    lg: 'p-6 rounded-2xl'
  }
  
  const variantClasses = {
    default: theme === 'dark' 
      ? 'bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:border-gray-600' 
      : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300',
    elevated: theme === 'dark'
      ? 'bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl hover:bg-gray-700'
      : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:bg-gray-50',
    outlined: theme === 'dark'
      ? 'bg-transparent border-2 border-gray-600 hover:border-gray-500 hover:bg-gray-800'
      : 'bg-transparent border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
  }

  const interactionClasses = `
    ${isHovered ? 'scale-105 shadow-lg' : 'scale-100'}
    ${isPressed ? 'scale-95' : ''}
    ${isFocused ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `

  const handleClick = () => {
    if (!disabled && onClick) {
      feedback.haptic('light')
      feedback.sound('click')
      onClick()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${interactionClasses} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role={role}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      {...handlers}
    >
      {/* Efeito de shimmer no hover */}
      {isHovered && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}
      
      {/* Conteúdo */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Efeito de ripple no click */}
      {isPressed && (
        <div className="absolute inset-0 bg-blue-500/20 animate-ping" />
      )}
      
      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}

// Componente de botão com micro-interações avançadas
interface InteractiveButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  className?: string
  ariaLabel?: string
}

export const InteractiveButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className = '',
  ariaLabel
}: InteractiveButtonProps) => {
  const { theme } = useTheme()
  const { isHovered, isPressed, isFocused, handlers, feedback } = useMicroInteractions()

  const baseClasses = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl'
  }
  
  const variantClasses = {
    primary: theme === 'dark'
      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500'
      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
    secondary: theme === 'dark'
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-500'
      : 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
    outline: theme === 'dark'
      ? 'border-2 border-gray-600 hover:border-gray-500 hover:bg-gray-800 text-gray-200 focus:ring-gray-500'
      : 'border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 focus:ring-gray-500',
    ghost: theme === 'dark'
      ? 'hover:bg-gray-800 text-gray-200 focus:ring-gray-500'
      : 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500'
  }

  const interactionClasses = `
    ${isHovered ? 'scale-105' : 'scale-100'}
    ${isPressed ? 'scale-95' : ''}
    ${loading ? 'cursor-wait' : ''}
  `

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      feedback.haptic('medium')
      feedback.sound('click')
      onClick()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && !loading) {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${interactionClasses} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      {...handlers}
    >
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Conteúdo */}
      <div className={`flex items-center space-x-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </div>
      
      {/* Efeito de ripple */}
      {isPressed && !loading && (
        <div className="absolute inset-0 bg-white/20 rounded-inherit animate-ping" />
      )}
    </button>
  )
}

// Componente de input com micro-interações
interface InteractiveInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  type?: 'text' | 'email' | 'password' | 'number'
  className?: string
  ariaLabel?: string
}

export const InteractiveInput = ({
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  type = 'text',
  className = '',
  ariaLabel
}: InteractiveInputProps) => {
  const { theme } = useTheme()
  const { isFocused, handlers } = useMicroInteractions()
  const [isFilled, setIsFilled] = useState(value.length > 0)

  useEffect(() => {
    setIsFilled(value.length > 0)
  }, [value])

  const baseClasses = 'w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
  
  const stateClasses = error
    ? 'border-red-500 focus:border-red-500'
    : isFocused
      ? 'border-blue-500'
      : theme === 'dark'
        ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400'
        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'

  const labelClasses = `
    absolute left-4 transition-all duration-200 ease-out pointer-events-none
    ${isFocused || isFilled
      ? 'top-2 text-xs text-blue-500'
      : 'top-3 text-sm text-gray-500'
    }
  `

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isFocused ? placeholder : ''}
        disabled={disabled}
        className={`${baseClasses} ${stateClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={ariaLabel}
        aria-invalid={!!error}
        aria-describedby={error ? 'error-message' : undefined}
        {...handlers}
      />
      
      {error && (
        <div id="error-message" className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}

// Hook para animações de entrada
export const useEnterAnimation = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return {
    isVisible,
    elementRef,
    animationClasses: isVisible 
      ? 'opacity-100 translate-y-0 scale-100' 
      : 'opacity-0 translate-y-4 scale-95'
  }
}

// Componente com animação de entrada
interface AnimatedContainerProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export const AnimatedContainer = ({ children, delay = 0, className = '' }: AnimatedContainerProps) => {
  const { isVisible, animationClasses } = useEnterAnimation(delay)

  return (
    <div className={`transition-all duration-500 ease-out ${animationClasses} ${className}`}>
      {children}
    </div>
  )
}
