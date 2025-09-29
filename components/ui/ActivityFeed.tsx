'use client'

import { useState, useEffect } from 'react'

interface Activity {
  id: string
  type: 'post_created' | 'post_published' | 'template_used' | 'plan_upgraded'
  title: string
  description: string
  timestamp: Date
  icon: string
  color: string
}

interface ActivityFeedProps {
  className?: string
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ className = '' }) => {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    // TODO: Buscar atividades reais do Firebase
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'post_created',
        title: 'Post criado',
        description: 'Tutorial sobre React Hooks',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        icon: '📝',
        color: 'text-blue-600'
      },
      {
        id: '2',
        type: 'template_used',
        title: 'Template usado',
        description: 'Template "Lista de Dicas" aplicado',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
        icon: '🚀',
        color: 'text-green-600'
      },
      {
        id: '3',
        type: 'post_published',
        title: 'Post publicado',
        description: '5 dicas para melhorar produtividade',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
        icon: '📤',
        color: 'text-purple-600'
      },
      {
        id: '4',
        type: 'plan_upgraded',
        title: 'Plano atualizado',
        description: 'Upgrade para plano Pro realizado',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
        icon: '⭐',
        color: 'text-yellow-600'
      }
    ]
    setActivities(mockActivities)
  }, [])

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Agora mesmo'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h atrás`
    return `${Math.floor(diffInSeconds / 86400)} dias atrás`
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Atividades Recentes</h3>
        <p className="text-sm text-gray-600">Acompanhe suas últimas ações</p>
      </div>

      <div className="p-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-gray-500">Nenhuma atividade recente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`text-xl ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activities.length > 0 && (
        <div className="p-4 border-t">
          <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
            Ver todas as atividades →
          </button>
        </div>
      )}
    </div>
  )
}