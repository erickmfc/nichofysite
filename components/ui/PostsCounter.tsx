'use client'

import { useState, useEffect } from 'react'

interface PostsCounterProps {
  currentPlan?: 'basic' | 'pro' | 'premium'
  postsUsed?: number
  className?: string
}

export const PostsCounter: React.FC<PostsCounterProps> = ({ 
  currentPlan = 'basic', 
  postsUsed = 0,
  className = ''
}) => {
  const planLimits = { 
    basic: 50, 
    pro: 200, 
    premium: 1000 
  }
  
  const limit = planLimits[currentPlan]
  const remaining = limit - postsUsed
  const percentage = (postsUsed / limit) * 100

  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStatusText = () => {
    if (percentage >= 90) return 'Quase no limite'
    if (percentage >= 70) return 'Uso moderado'
    return 'Uso normal'
  }

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Posts Restantes</span>
        <span className="text-sm text-gray-500">{remaining}/{limit}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center text-xs">
        <span className={`font-medium ${
          percentage >= 90 ? 'text-red-600' : 
          percentage >= 70 ? 'text-yellow-600' : 
          'text-green-600'
        }`}>
          {getStatusText()}
        </span>
        <span className="text-gray-500">
          {postsUsed} usados
        </span>
      </div>
      
      {percentage >= 80 && (
        <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
          💡 Considere fazer upgrade do seu plano para mais posts
        </div>
      )}
    </div>
  )
}