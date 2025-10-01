'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'
import { useState, useEffect } from 'react'
import { useRealStats } from '@/hooks/useRealStats'
import { useGoals } from '@/hooks/useGoals'
import { SimpleChart } from '@/components/ui/SimpleChart'
import { SkeletonStats, LoadingState } from '@/components/ui/LoadingStates'
import { EmptyStatsState, EmptyChartState } from '@/components/ui/EmptyStates'

interface StatsModuleProps {
  totalPosts?: number
  postsThisMonth?: number
  favoritePosts?: number
}

export const StatsModule = ({ totalPosts, postsThisMonth, favoritePosts }: StatsModuleProps) => {
  const { theme } = useTheme()
  const realStats = useRealStats()
  const { activeGoals, goalProgress, alerts, stats: goalsStats } = useGoals()
  const [animatedStats, setAnimatedStats] = useState({
    totalPosts: 0,
    postsThisMonth: 0,
    uniqueCategories: 0,
    engagementRate: 0,
    followersGained: 0,
    totalLikes: 0,
    totalShares: 0,
    totalSaved: 0,
    averagePostLength: 0
  })

  // Animação dos números
  useEffect(() => {
    if (realStats.loading) return

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

    // Usar dados reais ou fallback para props
    const statsToAnimate = {
      totalPosts: realStats.totalPosts || totalPosts || 0,
      postsThisMonth: realStats.postsThisMonth || postsThisMonth || 0,
      uniqueCategories: realStats.uniqueCategories || 0,
      engagementRate: realStats.engagementRate || 0,
      followersGained: realStats.followersGained || 0,
      totalLikes: realStats.totalLikes || 0,
      totalShares: realStats.totalShares || 0,
      totalSaved: realStats.totalSaved || 0,
      averagePostLength: realStats.averagePostLength || 0
    }

    // Animar estatísticas com dados reais
    animateValue(0, statsToAnimate.totalPosts, 1000, (value) => {
      setAnimatedStats(prev => ({ ...prev, totalPosts: value }))
    })
    
    animateValue(0, statsToAnimate.uniqueCategories, 1200, (value) => {
      setAnimatedStats(prev => ({ ...prev, uniqueCategories: value }))
    })
    
    animateValue(0, statsToAnimate.engagementRate, 1500, (value) => {
      setAnimatedStats(prev => ({ ...prev, engagementRate: value }))
    })

    animateValue(0, statsToAnimate.followersGained, 2000, (value) => {
      setAnimatedStats(prev => ({ ...prev, followersGained: value }))
    })

    animateValue(0, statsToAnimate.totalLikes, 800, (value) => {
      setAnimatedStats(prev => ({ ...prev, totalLikes: value }))
    })

    animateValue(0, statsToAnimate.totalShares, 1000, (value) => {
      setAnimatedStats(prev => ({ ...prev, totalShares: value }))
    })

    animateValue(0, statsToAnimate.totalSaved, 1200, (value) => {
      setAnimatedStats(prev => ({ ...prev, totalSaved: value }))
    })

    animateValue(0, statsToAnimate.averagePostLength, 1400, (value) => {
      setAnimatedStats(prev => ({ ...prev, averagePostLength: value }))
    })

  }, [realStats.loading, realStats.totalPosts, realStats.uniqueCategories, realStats.engagementRate, realStats.followersGained, realStats.totalLikes, realStats.totalShares, realStats.totalSaved, realStats.averagePostLength, totalPosts, postsThisMonth, favoritePosts])

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
      value: animatedStats.uniqueCategories,
      icon: '🎯',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      gradient: 'from-purple-500 to-pink-500',
      description: realStats.mostUsedCategory ? `Mais usado: ${realStats.mostUsedCategory}` : 'Categorias exploradas'
    },
    {
      label: 'Taxa de Engajamento',
      value: animatedStats.engagementRate,
      icon: '📈',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      gradient: 'from-green-500 to-emerald-500',
      description: 'Baseado em dados reais',
      suffix: '%'
    },
    {
      label: 'Interações Totais',
      value: animatedStats.totalLikes + animatedStats.totalShares + animatedStats.totalSaved,
      icon: '❤️',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      gradient: 'from-red-500 to-pink-500',
      description: `${animatedStats.totalLikes} curtidas, ${animatedStats.totalShares} compartilhamentos`,
      prefix: '+'
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
          {realStats.loading ? 'Carregando...' : 'Dados Reais'}
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
            {/* Badge para funcionalidades especiais */}
            {stat.label === 'Interações Totais' && (
              <div className={`absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-pulse`}>
                Novo!
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
      
      {/* Estados de carregamento e erro */}
      {realStats.loading && (
        <div className="mt-6">
          <SkeletonStats />
        </div>
      )}

      {realStats.error && (
        <div className={`mt-6 p-6 rounded-lg border-l-4 border-red-500 ${
          theme === 'dark' ? 'bg-red-900/20 border-red-400' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="text-2xl">⚠️</div>
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                theme === 'dark' ? 'text-red-300' : 'text-red-800'
              }`}>
                Erro ao carregar estatísticas
              </h3>
              <p className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-700'
              }`}>
                {realStats.error}
              </p>
              <div className="mt-3">
                <button
                  onClick={() => window.location.reload()}
                  className={`text-sm px-3 py-1 rounded-md font-medium transition-colors ${
                    theme === 'dark' 
                      ? 'bg-red-800 hover:bg-red-700 text-red-200' 
                      : 'bg-red-200 hover:bg-red-300 text-red-800'
                  }`}
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumo com dados reais */}
      {!realStats.loading && !realStats.error && (
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
                Baseado em dados reais • {animatedStats.averagePostLength} caracteres/posto
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              animatedStats.totalPosts > 20 
                ? 'bg-green-100 text-green-800' 
                : animatedStats.totalPosts > 10 
                  ? 'bg-yellow-100 text-yellow-800'
                  : animatedStats.totalPosts > 5
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
            }`}>
              {animatedStats.totalPosts > 20 
                ? 'Excelente' 
                : animatedStats.totalPosts > 10 
                  ? 'Bom' 
                  : animatedStats.totalPosts > 5
                    ? 'Regular'
                    : 'Iniciante'}
            </div>
          </div>
          
          {/* Estatísticas adicionais */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              📊 {animatedStats.totalPosts} posts • {animatedStats.uniqueCategories} nichos
            </div>
            <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              📈 {animatedStats.engagementRate}% engajamento • {animatedStats.followersGained} seguidores
            </div>
          </div>
        </div>
      )}

      {/* Seção de Metas e Gráficos */}
      {!realStats.loading && !realStats.error && (
        <div className="mt-6 space-y-4">
          {/* Resumo de Metas */}
          {activeGoals.length > 0 && (
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  🎯 Progresso das Metas
                </h4>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {goalsStats.activeGoals} ativas
                </span>
              </div>
              
              <div className="space-y-2">
                {activeGoals.slice(0, 3).map(goal => {
                  const progress = goalProgress.get(goal.id)
                  return (
                    <div key={goal.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {goal.title}
                        </span>
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {Math.round(progress?.progress || 0)}%
                        </span>
                      </div>
                      <div className={`w-full rounded-full h-1.5 ${
                        theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                      }`}>
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            progress?.needsAttention ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(progress?.progress || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Gráfico de Categorias */}
          {realStats.mostUsedCategory && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SimpleChart
                data={[
                  {
                    label: 'Posts Criados',
                    value: animatedStats.totalPosts,
                    color: '#3B82F6',
                    percentage: 100
                  },
                  {
                    label: 'Nichos Usados',
                    value: animatedStats.uniqueCategories,
                    color: '#8B5CF6',
                    percentage: (animatedStats.uniqueCategories / Math.max(animatedStats.totalPosts, 1)) * 100
                  },
                  {
                    label: 'Taxa de Engajamento',
                    value: animatedStats.engagementRate,
                    color: '#10B981',
                    percentage: animatedStats.engagementRate
                  }
                ]}
                title="Resumo de Performance"
                type="bar"
                height={150}
                showValues={true}
                showPercentages={false}
              />
              
              <SimpleChart
                data={[
                  {
                    label: 'Curtidas',
                    value: animatedStats.totalLikes,
                    color: '#EF4444',
                    percentage: (animatedStats.totalLikes / Math.max(animatedStats.totalLikes + animatedStats.totalShares + animatedStats.totalSaved, 1)) * 100
                  },
                  {
                    label: 'Compartilhamentos',
                    value: animatedStats.totalShares,
                    color: '#F59E0B',
                    percentage: (animatedStats.totalShares / Math.max(animatedStats.totalLikes + animatedStats.totalShares + animatedStats.totalSaved, 1)) * 100
                  },
                  {
                    label: 'Salvamentos',
                    value: animatedStats.totalSaved,
                    color: '#06B6D4',
                    percentage: (animatedStats.totalSaved / Math.max(animatedStats.totalLikes + animatedStats.totalShares + animatedStats.totalSaved, 1)) * 100
                  }
                ]}
                title="Interações por Tipo"
                type="pie"
                height={150}
                showValues={true}
                showPercentages={true}
              />
            </div>
          )}

          {/* Alertas Importantes */}
          {alerts.filter(a => !a.isRead && a.priority === 'high').length > 0 && (
            <div className={`p-4 rounded-lg border-l-4 border-red-500 bg-red-50`}>
              <h4 className="font-medium text-red-900 mb-2">🚨 Alertas Importantes</h4>
              <div className="space-y-2">
                {alerts.filter(a => !a.isRead && a.priority === 'high').slice(0, 2).map(alert => (
                  <div key={alert.id} className="text-sm text-red-800">
                    • {alert.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
