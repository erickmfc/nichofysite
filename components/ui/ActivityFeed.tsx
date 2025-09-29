'use client'

import { useState, useEffect } from 'react'

interface Activity {
  id: number
  action: string
  content: string
  time: string
  type: 'success' | 'info' | 'warning' | 'error'
  icon: string
}

const mockActivities: Activity[] = [
  { 
    id: 1, 
    action: "Post criado", 
    content: "Nova lei trabalhista: o que mudou?", 
    time: "2 horas atrás", 
    type: "success",
    icon: "📝"
  },
  { 
    id: 2, 
    action: "Nicho usado", 
    content: "Direito", 
    time: "4 horas atrás", 
    type: "info",
    icon: "🎯"
  },
  { 
    id: 3, 
    action: "Template aplicado", 
    content: "Post motivacional", 
    time: "1 dia atrás", 
    type: "warning",
    icon: "📋"
  },
  { 
    id: 4, 
    action: "Login realizado", 
    content: "Dashboard acessado", 
    time: "2 dias atrás", 
    type: "info",
    icon: "🔐"
  },
  { 
    id: 5, 
    action: "Conteúdo aprovado", 
    content: "Dicas de contratação", 
    time: "3 dias atrás", 
    type: "success",
    icon: "✅"
  }
]

export const ActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setActivities(mockActivities)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const getTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'success': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-blue-500'
    }
  }

  const getTypeBg = (type: Activity['type']) => {
    switch (type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20'
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20'
      case 'error': return 'bg-red-50 dark:bg-red-900/20'
      default: return 'bg-blue-50 dark:bg-blue-900/20'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📊 Atividades Recentes
        </h3>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-start space-x-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 mt-2"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          📊 Atividades Recentes
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {activities.length} atividades
        </span>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map(activity => (
          <div 
            key={activity.id} 
            className={`flex items-start space-x-3 p-3 ${getTypeBg(activity.type)} rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getTypeColor(activity.type)}`} />
              <span className="text-lg">{activity.icon}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 dark:text-white">
                {activity.action}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm truncate">
                {activity.content}
              </div>
              <div className="text-gray-400 dark:text-gray-500 text-xs">
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📭</div>
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma atividade recente
          </p>
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          💡 Suas atividades são atualizadas em tempo real
        </p>
      </div>
    </div>
  )
}
