'use client'

import { useState, useEffect, useMemo } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface PostsCounterProps {
  userId: string
}

interface Plan {
  name: string
  postsPerMonth: number
  color: string
}

export default function PostsCounter({ userId }: PostsCounterProps) {
  const [postsThisMonth, setPostsThisMonth] = useState(0)
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState<Plan>({
    name: 'Básico',
    postsPerMonth: 50,
    color: 'bg-blue-500'
  })

  // Calcular progresso
  const progress = useMemo(() => {
    return Math.min((postsThisMonth / plan.postsPerMonth) * 100, 100)
  }, [postsThisMonth, plan.postsPerMonth])

  // Calcular posts restantes
  const remainingPosts = useMemo(() => {
    return Math.max(plan.postsPerMonth - postsThisMonth, 0)
  }, [postsThisMonth, plan.postsPerMonth])

  useEffect(() => {
    const loadPostsCount = async () => {
      try {
        setLoading(true)
        
        // Calcular início do mês atual
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        
        // Buscar posts do usuário deste mês
        const postsQuery = query(
          collection(db, 'posts'),
          where('userId', '==', userId),
          where('createdAt', '>=', startOfMonth)
        )
        const postsSnapshot = await getDocs(postsQuery)
        
        setPostsThisMonth(postsSnapshot.docs.length)
        
        // Simular plano do usuário (em produção viria do perfil)
        setPlan({
          name: 'Básico',
          postsPerMonth: 50,
          color: 'bg-blue-500'
        })
      } catch (error) {
        console.error('Erro ao carregar contagem de posts:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      loadPostsCount()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }

  const isNearLimit = progress >= 80
  const isAtLimit = progress >= 100

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Posts Restantes
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isAtLimit ? 'bg-red-100 text-red-800' :
          isNearLimit ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {plan.name}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>{postsThisMonth} de {plan.postsPerMonth} posts</span>
          <span className="font-medium">{remainingPosts} restantes</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isAtLimit ? 'bg-red-500' :
              isNearLimit ? 'bg-yellow-500' :
              plan.color
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {isNearLimit && !isAtLimit && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            ⚠️ Você está próximo do limite do seu plano. Considere fazer upgrade.
          </p>
        </div>
      )}
      
      {isAtLimit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">
            🚫 Você atingiu o limite do seu plano. Faça upgrade para continuar criando posts.
          </p>
        </div>
      )}
      
      {!isNearLimit && (
        <div className="text-sm text-gray-600">
          <p>💡 Você ainda tem {remainingPosts} posts disponíveis este mês.</p>
        </div>
      )}
    </div>
  )
}