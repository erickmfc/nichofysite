'use client'

import { useState, useEffect, useRef } from 'react'

// Hook para animações de entrada
export const useFadeIn = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return { ref, isVisible }
}

// Hook para animações de hover
export const useHover = () => {
  const [isHovered, setIsHovered] = useState(false)

  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false)
  }

  return { isHovered, hoverProps }
}

// Hook para animações de clique
export const useClickAnimation = () => {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 150)
  }

  return { isClicked, handleClick }
}

// Hook para contador animado
export const useAnimatedCounter = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const startCount = 0

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(startCount + (end - startCount) * easeOutQuart)
      
      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return { count, ref }
}

// Hook para progresso animado
export const useAnimatedProgress = (targetProgress: number, duration = 1000) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const startProgress = 0

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progressRatio = Math.min(elapsed / duration, 1)
      
      const easeOutCubic = 1 - Math.pow(1 - progressRatio, 3)
      const currentProgress = startProgress + (targetProgress - startProgress) * easeOutCubic
      
      setProgress(currentProgress)

      if (progressRatio < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, targetProgress, duration])

  return { progress, ref }
}

// Componente para animação de entrada escalonada
export const StaggeredAnimation: React.FC<{
  children: React.ReactNode[]
  delay?: number
  className?: string
}> = ({ children, delay = 100, className = '' }) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(children.length).fill(false))

  useEffect(() => {
    children.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => {
          const newVisible = [...prev]
          newVisible[index] = true
          return newVisible
        })
      }, index * delay)
    })
  }, [children.length, delay])

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={`transition-all duration-500 ease-out ${
            visibleItems[index]
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// Componente para loading skeleton
export const SkeletonLoader: React.FC<{
  className?: string
  lines?: number
}> = ({ className = '', lines = 1 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 rounded h-4 mb-2"
          style={{
            width: `${Math.random() * 40 + 60}%`
          }}
        />
      ))}
    </div>
  )
}

// Componente para botão com micro-interação
export const AnimatedButton: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false 
}) => {
  const { isHovered, hoverProps } = useHover()
  const { isClicked, handleClick } = useClickAnimation()

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white'
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-700'
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white'
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white'
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  }

  const getSizeStyles = () => {
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

  const handleButtonClick = () => {
    if (!disabled) {
      handleClick()
      onClick?.()
    }
  }

  return (
    <button
      onClick={handleButtonClick}
      disabled={disabled}
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        rounded-lg font-semibold transition-all duration-200 ease-in-out
        transform ${isHovered ? 'scale-105' : 'scale-100'}
        ${isClicked ? 'scale-95' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        shadow-md hover:shadow-lg
        ${className}
      `}
      {...hoverProps}
    >
      {children}
    </button>
  )
}
