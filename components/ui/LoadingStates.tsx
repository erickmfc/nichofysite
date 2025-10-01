'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'

// Componente de loading principal
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  className?: string
}

export const LoadingSpinner = ({ size = 'md', color, className = '' }: LoadingSpinnerProps) => {
  const { theme } = useTheme()
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }
  
  const defaultColor = theme === 'dark' ? '#3B82F6' : '#2563EB'
  const spinnerColor = color || defaultColor
  
  return (
    <div className={`animate-spin ${sizeClasses[size]} ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="32"
          strokeDashoffset="32"
          className="animate-spin"
          style={{
            stroke: spinnerColor,
            animation: 'spin 1s linear infinite, dash 1.5s ease-in-out infinite'
          }}
        />
      </svg>
      <style jsx>{`
        @keyframes dash {
          0% { stroke-dashoffset: 32; }
          50% { stroke-dashoffset: 8; }
          100% { stroke-dashoffset: 32; }
        }
      `}</style>
    </div>
  )
}

// Skeleton loader para cards
interface SkeletonCardProps {
  className?: string
  lines?: number
}

export const SkeletonCard = ({ className = '', lines = 3 }: SkeletonCardProps) => {
  const { theme } = useTheme()
  
  return (
    <div className={`animate-pulse ${className}`}>
      <div className={`rounded-xl p-6 ${
        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className={`h-6 w-32 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          <div className={`h-6 w-20 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className={`h-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`} style={{ width: `${Math.random() * 40 + 60}%` }} />
              {index === 0 && (
                <div className={`h-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`} style={{ width: `${Math.random() * 30 + 40}%` }} />
              )}
            </div>
          ))}
        </div>
        
        {/* Footer skeleton */}
        <div className="mt-6 flex justify-between items-center">
          <div className={`h-4 w-24 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          <div className={`h-8 w-20 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
        </div>
      </div>
    </div>
  )
}

// Skeleton loader para estatísticas
export const SkeletonStats = () => {
  const { theme } = useTheme()
  
  return (
    <div className={`rounded-2xl p-6 shadow-lg ${
      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className={`h-6 w-40 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`} />
        <div className={`h-6 w-20 rounded-full ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`} />
      </div>
      
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={`p-4 rounded-xl border ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl ${
                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
              }`} />
              <div className="text-right">
                <div className={`h-8 w-16 rounded-lg mb-1 ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`} />
                <div className={`h-3 w-20 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`} />
              </div>
            </div>
            <div className={`h-4 w-24 rounded-lg mb-3 ${
              theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
            }`} />
            <div className={`w-full rounded-full h-2 ${
              theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
            }`}>
              <div className={`h-2 rounded-full ${
                theme === 'dark' ? 'bg-gray-500' : 'bg-gray-300'
              }`} style={{ width: `${Math.random() * 80 + 20}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Skeleton loader para gráficos
export const SkeletonChart = ({ height = 200 }: { height?: number }) => {
  const { theme } = useTheme()
  
  return (
    <div className={`rounded-xl p-4 ${
      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      <div className={`h-6 w-32 rounded-lg mb-4 ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
      }`} />
      
      <div className="relative" style={{ height }}>
        {/* Chart area skeleton */}
        <div className={`w-full h-full rounded-lg ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          {/* Simulated chart elements */}
          <div className="absolute inset-4 space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                }`} />
                <div className={`h-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                }`} style={{ width: `${Math.random() * 60 + 20}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading state com mensagem personalizada
interface LoadingStateProps {
  message?: string
  submessage?: string
  icon?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingState = ({ 
  message = 'Carregando...', 
  submessage, 
  icon = '⏳',
  size = 'md',
  className = ''
}: LoadingStateProps) => {
  const { theme } = useTheme()
  
  const sizeClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16'
  }
  
  return (
    <div className={`flex flex-col items-center justify-center ${sizeClasses[size]} ${className}`}>
      <div className="mb-4">
        <LoadingSpinner size={size === 'sm' ? 'md' : size === 'md' ? 'lg' : 'xl'} />
      </div>
      
      <div className="text-center">
        <div className={`text-2xl mb-2 ${size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl'}`}>
          {icon}
        </div>
        <h3 className={`text-lg font-medium mb-1 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {message}
        </h3>
        {submessage && (
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {submessage}
          </p>
        )}
      </div>
    </div>
  )
}

// Loading overlay para ações específicas
interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  children: React.ReactNode
}

export const LoadingOverlay = ({ isVisible, message = 'Processando...', children }: LoadingOverlayProps) => {
  const { theme } = useTheme()
  
  return (
    <div className="relative">
      {children}
      {isVisible && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
          <div className={`p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center space-x-3">
              <LoadingSpinner size="md" />
              <span className={`font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {message}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Pulse loader para elementos pequenos
export const PulseLoader = ({ className = '' }: { className?: string }) => {
  const { theme } = useTheme()
  
  return (
    <div className={`flex space-x-1 ${className}`}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full ${
            theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'
          }`}
          style={{
            animation: `pulse 1.4s ease-in-out ${index * 0.16}s infinite both`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// Shimmer effect para elementos específicos
export const ShimmerEffect = ({ className = '' }: { className?: string }) => {
  const { theme } = useTheme()
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent ${
        theme === 'dark' ? 'via-gray-700' : 'via-gray-200'
      }`} />
      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
