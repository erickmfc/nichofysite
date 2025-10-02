'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

// Componente para elementos focáveis com navegação por teclado
export const FocusableElement: React.FC<{
  children: React.ReactNode
  className?: string
  onFocus?: () => void
  onBlur?: () => void
  tabIndex?: number
  disabled?: boolean
  role?: string
  ariaLabel?: string
  ariaDescribedBy?: string
}> = ({ 
  children, 
  className = '', 
  onFocus, 
  onBlur, 
  tabIndex = 0, 
  disabled = false,
  role,
  ariaLabel,
  ariaDescribedBy
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  const handleFocus = useCallback(() => {
    if (!disabled) {
      setIsFocused(true)
      onFocus?.()
    }
  }, [disabled, onFocus])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    onBlur?.()
  }, [onBlur])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!disabled) {
        elementRef.current?.click()
      }
    }
  }, [disabled])

  return (
    <div
      ref={elementRef}
      className={`
        transition-all duration-200 ease-in-out
        ${isFocused ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      tabIndex={disabled ? -1 : tabIndex}
      role={role}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  )
}

// Região ao vivo para leitores de tela
export const LiveRegion: React.FC<{
  children: React.ReactNode
  className?: string
  politeness?: 'polite' | 'assertive' | 'off'
  atomic?: boolean
}> = ({ 
  children, 
  className = '', 
  politeness = 'polite', 
  atomic = false 
}) => {
  const [announcement, setAnnouncement] = useState('')
  const regionRef = useRef<HTMLDivElement>(null)

  const announce = useCallback((message: string) => {
    setAnnouncement(message)
    // Limpar após um tempo para permitir novos anúncios
    setTimeout(() => setAnnouncement(''), 1000)
  }, [])

  useEffect(() => {
    if (announcement && regionRef.current) {
      regionRef.current.textContent = announcement
    }
  }, [announcement])

  return (
    <>
      <div
        ref={regionRef}
        className="sr-only"
        aria-live={politeness}
        aria-atomic={atomic}
      />
      <div className={className}>
        {children}
      </div>
    </>
  )
}

// Componente para exibir erros de forma acessível
export const AccessibleError: React.FC<{
  error: string | null
  className?: string
  id?: string
}> = ({ error, className = '', id }) => {
  if (!error) return null

  return (
    <div
      id={id}
      className={`text-red-600 text-sm mt-1 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <span className="sr-only">Erro: </span>
      {error}
    </div>
  )
}

// Hook para gerenciar foco e acessibilidade
export const useAccessibility = () => {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null)
  const [announcements, setAnnouncements] = useState<string[]>([])

  const announce = useCallback((message: string) => {
    setAnnouncements(prev => [...prev, message])
    // Remover após 3 segundos
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1))
    }, 3000)
  }, [])

  const setFocus = useCallback((element: HTMLElement | null) => {
    if (element) {
      element.focus()
      setFocusedElement(element)
    }
  }, [])

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [])

  return {
    focusedElement,
    announcements,
    announce,
    setFocus,
    trapFocus
  }
}

// Componente de modal acessível
export const AccessibleModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}> = ({ isOpen, onClose, title, children, className = '' }) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const { trapFocus, announce } = useAccessibility()

  useEffect(() => {
    if (isOpen) {
      announce(`Modal ${title} aberto`)
      document.body.style.overflow = 'hidden'
      
      if (modalRef.current) {
        const cleanup = trapFocus(modalRef.current)
        return cleanup
      }
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, title, announce, trapFocus])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={`
          relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6
          ${className}
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="text-gray-700">
          {children}
        </div>
      </div>
    </div>
  )
}

// Componente de skip link para navegação por teclado
export const SkipLink: React.FC<{
  href: string
  children: React.ReactNode
}> = ({ href, children }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsVisible(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsVisible(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <a
      href={href}
      className={`
        absolute top-0 left-0 bg-blue-600 text-white px-4 py-2 rounded-br-lg
        transform -translate-y-full transition-transform duration-200
        focus:translate-y-0 focus:z-50
        ${isVisible ? 'translate-y-0 z-50' : ''}
      `}
    >
      {children}
    </a>
  )
}

// Hook para detectar preferências de movimento reduzido
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Componente de loading acessível
export const AccessibleLoading: React.FC<{
  text?: string
  size?: 'sm' | 'md' | 'lg'
}> = ({ text = 'Carregando...', size = 'md' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4'
      case 'md': return 'w-8 h-8'
      case 'lg': return 'w-12 h-12'
      default: return 'w-8 h-8'
    }
  }

  return (
    <div className="flex items-center justify-center space-x-2" role="status" aria-live="polite">
      <div className={`
        ${getSizeClasses()} 
        animate-spin rounded-full border-2 border-gray-300 border-t-blue-600
      `} />
      <span className="text-gray-600">{text}</span>
    </div>
  )
}

// Componente de progresso acessível
export const AccessibleProgress: React.FC<{
  value: number
  max?: number
  label?: string
  className?: string
}> = ({ value, max = 100, label, className = '' }) => {
  const percentage = Math.round((value / max) * 100)

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{label}</span>
          <span>{percentage}%</span>
        </div>
      )}
      
      <div 
        className="w-full bg-gray-200 rounded-full h-2"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progresso: ${percentage}%`}
      >
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}