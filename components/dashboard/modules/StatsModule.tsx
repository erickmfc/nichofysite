'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'
import { useState, useEffect } from 'react'

interface StatsModuleProps {
  totalPosts: number
  postsThisMonth: number
  favoritePosts: number
}

export const StatsModule = ({ totalPosts, postsThisMonth, favoritePosts }: StatsModuleProps) => {
  const { theme } = useTheme()
  const [animatedStats, setAnimatedStats] = useState({
    totalPosts: 0,
    postsThisMonth: 0,
    favoritePosts: 0,
    engagementRate: 0,
    followersGained: 0
  })

  // Animação dos números
  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const current = start + (end - start) * progress
        callback(Math.floor(current))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      animate()
    }

    // Animar estatísticas
    animateValue(0, totalPosts, 1000, (value) => {
      setAnimatedStats(prev => ({ ...prev, totalPosts: value }))
    })
    
    animateValue(0, postsThisMonth, 1200, (value) => {
      setAnimatedStats(prev => ({ ...prev, postsThisMonth: value }))
    })
    
    animateValue(0, favoritePosts, 800, (value) => {
      setAnimatedStats(prev => ({ ...prev, favoritePosts: value }))
    })

    // Simular taxa de engajamento baseada nos posts
    const engagementRate = totalPosts > 0 ? Math.min(totalPosts * 2.5, 100) : 0
    animateValue(0, engagementRate, 1500, (value) => {
      setAnimatedStats(prev => ({ ...prev, engagementRate: value }))
    })

    // Simular seguidores ganhos
    const followersGained = totalPosts > 0 ? Math.floor(totalPosts * 1.8) : 0
    animateValue(0, followersGained, 2000, (value) => {
      setAnimatedStats(prev => ({ ...prev, followersGained: value }))
    })
  }, [totalPosts, postsThisMonth, favoritePosts])

  const stats = [
    {
      label: 'Posts Criados',
      value: animatedStats.totalPosts,
      icon: '📝',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Conteúdo publicado'
    },
    {
      label: 'Nichos Usados',
      value: animatedStats.postsThisMonth,
      icon: '🎯',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      gradient: 'from-purple-500 to-pink-500',
      description: 'Categorias exploradas'
    },
    {
      label: 'Taxa de Engajamento',
      value: animatedStats.engagementRate,
      icon: '📈',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      gradient: 'from-green-500 to-emerald-500',
      description: 'Interação média',
      suffix: '%'
    },
    {
      label: 'Seguidores Ganhos',
      value: animatedStats.followersGained,
      icon: '👥',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      gradient: 'from-orange-500 to-red-500',
      description: 'Novos seguidores',
      prefix: '+',
      badge: 'Em Breve',
      badgeColor: 'bg-yellow-500'
    }
  ]

  return (
    <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
      theme === 'dark'
        ? 'bg-gray-800 border border-gray-700'
        : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          📊 Suas Estatísticas
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
        }`}>
          Tempo real
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`relative p-4 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-105 group ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                : `${stat.bgColor} ${stat.borderColor} hover:shadow-xl`
            }`}
          >
            {/* Badge para "Em Breve" */}
            {stat.badge && (
              <div className={`absolute -top-2 -right-2 ${stat.badgeColor} text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-pulse`}>
                {stat.badge}
              </div>
            )}
            
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : stat.color
                }`}>
                  {stat.prefix || ''}{stat.value}{stat.suffix || ''}
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {stat.description}
                </p>
              </div>
            </div>
            
            <div className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {stat.label}
            </div>
            
            {/* Barra de progresso animada */}
            <div className={`mt-3 w-full rounded-full h-2 ${
              theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
            }`}>
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 ease-out`}
                style={{ 
                  width: `${Math.min((stat.value / (stat.label === 'Taxa de Engajamento' ? 100 : Math.max(stat.value, 10))) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Resumo */}
      <div className={`mt-6 p-4 rounded-lg ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Performance Geral
            </p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Baseado nos seus posts
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            totalPosts > 10 
              ? 'bg-green-100 text-green-800' 
              : totalPosts > 5 
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
          }`}>
            {totalPosts > 10 ? 'Excelente' : totalPosts > 5 ? 'Bom' : 'Iniciante'}
          </div>
        </div>
      </div>
    </div>
  )
}
