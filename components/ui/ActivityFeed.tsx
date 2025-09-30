'use client'

import { useState, useEffect, useMemo } from 'react'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface ActivityFeedProps {
  userId: string
}

interface Activity {
  id: string
  type: 'post_created' | 'post_favorited' | 'post_shared' | 'content_approved'
  title: string
  description: string
  timestamp: any
  metadata?: {
    niche?: string
    category?: string
    platform?: string
  }
}

export default function ActivityFeed({ userId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  // Memoizar ícones por tipo de atividade
  const activityIcons = useMemo(() => ({
    post_created: '📝',
    post_favorited: '❤️',
    post_shared: '📤',
    content_approved: '✅'
  }), [])

  // Memoizar cores por tipo de atividade
  const activityColors = useMemo(() => ({
    post_created: 'bg-blue-100 text-blue-800',
    post_favorited: 'bg-red-100 text-red-800',
    post_shared: 'bg-green-100 text-green-800',
    content_approved: 'bg-purple-100 text-purple-800'
  }), [])

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true)
        
        // Buscar posts recentes do usuário
        const postsQuery = query(
          collection(db, 'posts'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(10)
        )
        const postsSnapshot = await getDocs(postsQuery)
        
        // Converter posts em atividades
        const postActivities: Activity[] = postsSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: `post-${doc.id}`,
            type: 'post_created' as const,
            title: `Post criado: ${data.title}`,
            description: `Novo post no nicho ${data.niche}`,
            timestamp: data.createdAt,
            metadata: {
              niche: data.niche,
              category: data.category,
              platform: data.platform
            }
          }
        })

        // Simular outras atividades (em produção viria de uma coleção de atividades)
        const simulatedActivities: Activity[] = [
          {
            id: 'activity-1',
            type: 'content_approved',
            title: 'Conteúdo aprovado',
            description: 'Seu post sobre Direito Trabalhista foi aprovado',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
            metadata: {
              niche: 'Direito',
              category: 'Educativo'
            }
          },
          {
            id: 'activity-2',
            type: 'post_favorited',
            title: 'Post favoritado',
            description: 'Você favoritou um post sobre Marketing Digital',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
            metadata: {
              niche: 'Marketing & Publicidade',
              category: 'Dicas'
            }
          },
          {
            id: 'activity-3',
            type: 'post_shared',
            title: 'Post compartilhado',
            description: 'Seu post sobre Saúde Mental foi compartilhado 5 vezes',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
            metadata: {
              niche: 'Psicologia & Saúde Mental',
              category: 'Educativo'
            }
          }
        ]

        // Combinar e ordenar atividades
        const allActivities = [...postActivities, ...simulatedActivities]
          .sort((a, b) => {
            const aTime = a.timestamp?.toDate?.() || new Date(a.timestamp)
            const bTime = b.timestamp?.toDate?.() || new Date(b.timestamp)
            return bTime.getTime() - aTime.getTime()
          })
          .slice(0, 8) // Limitar a 8 atividades

        setActivities(allActivities)
      } catch (error) {
        console.error('Erro ao carregar atividades:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      loadActivities()
    }
  }, [userId])

  const formatTimestamp = (timestamp: any) => {
    const date = timestamp?.toDate?.() || new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Agora mesmo'
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d atrás`
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Atividades Recentes
      </h3>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-gray-600">Nenhuma atividade recente</p>
          <p className="text-sm text-gray-500 mt-1">
            Suas atividades aparecerão aqui
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                  {activityIcons[activity.type]}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>
                
                {activity.metadata && (
                  <div className="flex items-center gap-2 mt-2">
                    {activity.metadata.niche && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {activity.metadata.niche}
                      </span>
                    )}
                    {activity.metadata.category && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {activity.metadata.category}
                      </span>
                    )}
                    {activity.metadata.platform && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {activity.metadata.platform}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => window.location.href = '/meu-conteudo'}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Ver todas as atividades →
        </button>
      </div>
    </div>
  )
}