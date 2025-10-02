'use client'

import React from 'react'

// Componente de card de estatística
export const StatCard: React.FC<{
  title: string
  value: number | string
  change?: number
  changeType?: 'increase' | 'decrease' | 'stable'
  icon?: string
  color?: string
  className?: string
}> = ({ 
  title, 
  value, 
  change, 
  changeType = 'stable', 
  icon, 
  color = 'blue',
  className = '' 
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green': return 'text-green-600 bg-green-50'
      case 'red': return 'text-red-600 bg-red-50'
      case 'yellow': return 'text-yellow-600 bg-yellow-50'
      case 'purple': return 'text-purple-600 bg-purple-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase': return '↗'
      case 'decrease': return '↘'
      default: return '→'
    }
  }

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-green-600'
      case 'decrease': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className={`p-3 rounded-full ${getColorClasses()}`}>
            <span className="text-xl">{icon}</span>
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className="mt-2 flex items-center">
          <span className={`text-sm font-medium ${getChangeColor()}`}>
            {getChangeIcon()} {Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
        </div>
      )}
    </div>
  )
}

// Componente de gráfico simples
export const StatChart: React.FC<{
  data: number[]
  labels?: string[]
  title?: string
  className?: string
}> = ({ data, labels, title, className = '' }) => {
  const maxValue = Math.max(...data)
  
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="flex items-end space-x-2 h-32">
        {data.map((value, index) => {
          const height = (value / maxValue) * 100
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="bg-blue-500 rounded-t w-full transition-all duration-500 ease-out"
                style={{ height: `${height}%` }}
              />
              {labels && labels[index] && (
                <span className="text-xs text-gray-600 mt-2 text-center">
                  {labels[index]}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Componente de alerta de estatística
export const StatAlert: React.FC<{
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}> = ({ type, title, message, action, className = '' }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      case 'info': return 'ℹ️'
      default: return 'ℹ️'
    }
  }

  return (
    <div className={`rounded-lg border p-4 ${getTypeStyles()} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-lg">{getIcon()}</span>
        </div>
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-medium">{title}</h4>
          <p className="mt-1 text-sm opacity-90">{message}</p>
          {action && (
            <div className="mt-3">
              <button
                onClick={action.onClick}
                className="text-sm font-medium hover:opacity-80 transition-opacity"
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente de progresso de meta
export const GoalProgress: React.FC<{
  title: string
  current: number
  target: number
  unit?: string
  color?: string
  className?: string
}> = ({ title, current, target, unit = '', color = 'blue', className = '' }) => {
  const percentage = Math.min((current / target) * 100, 100)
  
  const getColorClasses = () => {
    switch (color) {
      case 'green': return 'bg-green-500'
      case 'red': return 'bg-red-500'
      case 'yellow': return 'bg-yellow-500'
      case 'purple': return 'bg-purple-500'
      default: return 'bg-blue-500'
    }
  }

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <span className="text-sm text-gray-600">
          {current}{unit} / {target}{unit}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ease-out ${getColorClasses()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{percentage.toFixed(1)}% concluído</span>
        <span>{target - current}{unit} restantes</span>
      </div>
    </div>
  )
}