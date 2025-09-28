'use client'

import { useState, useEffect } from 'react'

interface PainPointProps {
  text: string
  icon: string
  isVisible: boolean
  onDestroy: () => void
}

export const PainPoint: React.FC<PainPointProps> = ({ text, icon, isVisible, onDestroy }) => {
  const [isDestroyed, setIsDestroyed] = useState(false)

  useEffect(() => {
    if (isVisible && !isDestroyed) {
      const timer = setTimeout(() => {
        setIsDestroyed(true)
        setTimeout(onDestroy, 1000)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, isDestroyed, onDestroy])

  if (!isVisible) return null

  return (
    <div className={`transition-all duration-1000 ${isDestroyed ? 'opacity-0 scale-0 rotate-45' : 'opacity-100 scale-100 rotate-0'}`}>
      <div className="text-center">
        <div className={`text-6xl mb-4 transition-all duration-1000 ${isDestroyed ? 'animate-spin' : ''}`}>
          {isDestroyed ? '✅' : icon}
        </div>
        <h3 className="text-4xl md:text-6xl font-bold text-white mb-8">
          {text}
        </h3>
      </div>
    </div>
  )
}
