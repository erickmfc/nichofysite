'use client'

import { ReactNode } from 'react'

interface ModernCardProps {
  children: ReactNode
  className?: string
  gradient?: boolean
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
}

export const ModernCard = ({ 
  children, 
  className = '',
  gradient = false,
  shadow = 'lg',
  padding = 'md',
  rounded = '2xl'
}: ModernCardProps) => {
  const baseClasses = 'transition-all duration-300'
  
  const gradientClasses = gradient 
    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' 
    : 'bg-white'
  
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  }[shadow]
  
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  }[padding]
  
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl'
  }[rounded]

  return (
    <div className={`${baseClasses} ${gradientClasses} ${shadowClasses} ${paddingClasses} ${roundedClasses} ${className}`}>
      {children}
    </div>
  )
}

interface HeroCardProps {
  title: string
  subtitle: string
  value: string | number
  icon: string
  buttonText: string
  onButtonClick?: () => void
  floatingIcons?: string[]
}

export const HeroCard = ({ 
  title, 
  subtitle, 
  value, 
  icon, 
  buttonText, 
  onButtonClick,
  floatingIcons = []
}: HeroCardProps) => {
  return (
    <ModernCard gradient shadow="2xl" padding="lg" rounded="3xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-white/90">{subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-sm text-white/80">novas</div>
        </div>
      </div>
      
      {/* Floating Icons */}
      {floatingIcons.length > 0 && (
        <div className="flex justify-center space-x-4 mb-4">
          {floatingIcons.map((icon, index) => (
            <div 
              key={index}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-bounce" 
              style={{animationDelay: `${0.1 * (index + 1)}s`}}
            >
              <span className="text-sm">{icon}</span>
            </div>
          ))}
        </div>
      )}
      
      <button 
        onClick={onButtonClick}
        className="w-full bg-white text-orange-500 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
      >
        {buttonText}
      </button>
    </ModernCard>
  )
}

interface StatsCardProps {
  value: string | number
  label: string
  color?: 'orange' | 'blue' | 'green' | 'purple'
}

export const StatsCard = ({ value, label, color = 'orange' }: StatsCardProps) => {
  const colorClasses = {
    orange: 'text-orange-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500'
  }[color]

  return (
    <ModernCard padding="md" rounded="2xl">
      <div className="text-center">
        <div className={`text-2xl font-bold mb-1 ${colorClasses}`}>{value}</div>
        <div className="text-xs text-gray-600 font-medium">{label}</div>
      </div>
    </ModernCard>
  )
}
