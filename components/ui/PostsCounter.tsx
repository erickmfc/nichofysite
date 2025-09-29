'use client'

import { useState, useEffect } from 'react'

interface PostsCounterProps {
  currentPlan?: 'basic' | 'pro' | 'premium'
  postsUsed?: number
}

export const PostsCounter = ({ currentPlan = 'basic', postsUsed = 0 }: PostsCounterProps) => {
  const [animatedPostsUsed, setAnimatedPostsUsed] = useState(0)
  
  const planLimits = {
    basic: 50,
    pro: 200,
    premium: 1000
  }

  const limit = planLimits[currentPlan]
  const remaining = limit - animatedPostsUsed
  const percentage = (animatedPostsUsed / limit) * 100

  // Animação do contador
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPostsUsed(postsUsed)
    }, 500)
    return () => clearTimeout(timer)
  }, [postsUsed])

  const getProgressColor = () => {
    if (percentage > 80) return 'bg-red-500'
    if (percentage > 60) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPlanColor = () => {
    switch (currentPlan) {
      case 'basic': return 'text-blue-600'
      case 'pro': return 'text-purple-600'
      case 'premium': return 'text-gold-600'
      default: return 'text-blue-600'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            📊 Limite de Posts
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Plano {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
          </p>
        </div>
        <div className={`text-2xl font-bold ${getPlanColor()}`}>
          {remaining}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Usados: {animatedPostsUsed}</span>
          <span>Total: {limit}</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ease-out ${getProgressColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
      
      {remaining < 10 && remaining > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ Poucos posts restantes! Considere fazer upgrade.
          </p>
        </div>
      )}

      {remaining === 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-800 dark:text-red-200">
            🚫 Limite atingido! Faça upgrade para continuar criando.
          </p>
        </div>
      )}

      {remaining > 10 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✅ Você ainda tem {remaining} posts disponíveis.
          </p>
        </div>
      )}

      {currentPlan !== 'premium' && (
        <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
          🚀 Fazer Upgrade
        </button>
      )}
    </div>
  )
}
