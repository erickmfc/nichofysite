'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  userId?: string
}

export const QuickStats = ({ userId }: QuickStatsProps) => {
  const [stats, setStats] = useState({
    postsCreated: 0,
    nichosUsed: 0,
    engagementRate: 0,
    followersGained: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Simular carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        postsCreated: 23,
        nichosUsed: 5,
        engagementRate: 12.5,
        followersGained: 156
      })
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [userId])

  const StatCard = ({ 
    value, 
    label, 
    color, 
    icon, 
    isLoading: cardLoading 
  }: {
    value: number
    label: string
    color: string
    icon: string
    isLoading: boolean
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 text-center hover:shadow-xl transition-shadow">
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`text-2xl font-bold ${color} mb-1`}>
        {cardLoading ? (
          <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-16 mx-auto rounded"></div>
        ) : (
          value
        )}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  )

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        value={stats.postsCreated}
        label="Posts Criados"
        color="text-blue-600"
        icon="📝"
        isLoading={isLoading}
      />
      
      <StatCard
        value={stats.nichosUsed}
        label="Nichos Ativos"
        color="text-green-600"
        icon="🎯"
        isLoading={isLoading}
      />
      
      <StatCard
        value={stats.engagementRate}
        label="Engajamento (%)"
        color="text-purple-600"
        icon="📈"
        isLoading={isLoading}
      />
      
      <StatCard
        value={stats.followersGained}
        label="Novos Seguidores"
        color="text-orange-600"
        icon="👥"
        isLoading={isLoading}
      />
    </div>
  )
}
