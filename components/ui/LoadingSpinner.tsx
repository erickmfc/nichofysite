'use client'

import { useState, useEffect } from 'react'

interface LoadingSpinnerProps {
  message?: string
  subMessage?: string
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Carregando...',
  subMessage = 'Aguarde um momento',
  size = 'md',
  showProgress = false
}) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 0
          return prev + Math.random() * 10
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [showProgress])

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          {/* Spinner principal */}
          <div className={`animate-spin rounded-full border-b-4 border-blue-600 mx-auto ${sizeClasses[size]}`}></div>
          
          {/* Spinner interno */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-1/2 h-1/2 bg-blue-100 rounded-full animate-pulse`}></div>
          </div>
          
          {/* Pontos animados */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        <h2 className={`font-semibold text-gray-800 mb-2 ${textSizeClasses[size]}`}>
          {message}
        </h2>
        
        <p className="text-gray-600 mb-4">
          {subMessage}
        </p>

        {showProgress && (
          <div className="w-64 mx-auto">
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              {Math.round(Math.min(progress, 100))}% concluído
            </p>
          </div>
        )}

        {/* Dicas rotativas */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">
              💡 <strong>Dica:</strong> O sistema está verificando suas credenciais de forma segura
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente específico para autenticação
export const AuthLoadingSpinner: React.FC = () => {
  return (
    <LoadingSpinner
      message="Verificando autenticação..."
      subMessage="Validando suas credenciais"
      size="md"
      showProgress={true}
    />
  )
}

// Componente para carregamento de dados
export const DataLoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Carregando dados...' }) => {
  return (
    <LoadingSpinner
      message={message}
      subMessage="Buscando informações atualizadas"
      size="sm"
      showProgress={false}
    />
  )
}