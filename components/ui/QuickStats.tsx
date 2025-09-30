'use client'

import { useState, useEffect, useMemo } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface QuickStatsProps {
  userId: string
}

interface Stats {
  totalPosts: number
  totalNiches: number
  engagementRate: number
  followersGained: number
}

export default function QuickStats({ userId }: QuickStatsProps) {
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    totalNiches: 0,
    engagementRate: 0,
    followersGained: 0
  })
  const [loading, setLoading] = useState(true)

  // Memoizar cores dos cards
  const cardColors = useMemo(() => [
    { bg: 'bg-blue-500', text: 'text-white' },
    { bg: 'bg-green-500', text: 'text-white' },
    { bg: 'bg-purple-500', text: 'text-white' },
    { bg: 'bg-orange-500', text: 'text-white' }
  ], [])

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        
        // Buscar posts do usuário
        const postsQuery = query(
          collection(db, 'posts'),
          where('userId', '==', userId)
        )
        const postsSnapshot = await getDocs(postsQuery)
        const posts = postsSnapshot.docs.map(doc => doc.data())
        
        // Calcular estatísticas
        const totalPosts = posts.length
        const uniqueNiches = new Set(posts.map(post => post.niche)).size
        
        // Simular dados de engajamento (em produção viria de analytics)
        const engagementRate = Math.floor(Math.random() * 20) + 5 // 5-25%
        const followersGained = Math.floor(Math.random() * 1000) + 100 // 100-1100
        
        setStats({
          totalPosts,
          totalNiches: uniqueNiches,
          engagementRate,
          followersGained
        })
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      loadStats()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const statsData = [
    {
      label: 'Posts Criados',
      value: stats.totalPosts,
      icon: '📝',
      color: cardColors[0]
    },
    {
      label: 'Nichos Usados',
      value: stats.totalNiches,
      icon: '🎯',
      color: cardColors[1]
    },
    {
      label: 'Taxa de Engajamento',
      value: `${stats.engagementRate}%`,
      icon: '📈',
      color: cardColors[2]
    },
    {
      label: 'Seguidores Ganhos',
      value: `+${stats.followersGained}`,
      icon: '👥',
      color: cardColors[3]
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className={`${stat.color.bg} rounded-lg shadow-sm p-6 ${stat.color.text} hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className="text-3xl opacity-80">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}