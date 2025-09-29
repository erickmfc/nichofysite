'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  className?: string
}

export const QuickStats: React.FC<QuickStatsProps> = ({ className = '' }) => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    thisMonth: 0,
    totalViews: 0,
    engagement: 0
  })

  // Simular carregamento de dados
  useEffect(() => {
    // TODO: Buscar dados reais do Firebase
    setStats({
      totalPosts: 12,
      thisMonth: 8,
      totalViews: 1250,
      engagement: 85
    })
  }, [])

  const statCards = [
    {
      title: 'Posts Criados',
      value: stats.totalPosts,
      icon: '📝',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+2 esta semana'
    },
    {
      title: 'Este Mês',
      value: stats.thisMonth,
      icon: '📅',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+3 vs mês passado'
    },
    {
      title: 'Visualizações',
      value: stats.totalViews.toLocaleString(),
      icon: '👁️',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+15% esta semana'
    },
    {
      title: 'Engajamento',
      value: `${stats.engagement}%`,
      icon: '❤️',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '+5% vs mês passado'
    }
  ]

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              stat.change.startsWith('+') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {stat.change}
            </span>
          </div>
          
          <div className="mb-1">
            <span className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </span>
          </div>
          
          <div className="text-sm text-gray-600">
            {stat.title}
          </div>
        </div>
      ))}
    </div>
  )
}