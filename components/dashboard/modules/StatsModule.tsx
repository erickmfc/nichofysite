'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRealStats } from '@/hooks/useRealStats'
import { useGoals } from '@/hooks/useGoals'
import { SimpleChart } from '@/components/ui/SimpleChart'
import { SkeletonStats, LoadingState } from '@/components/ui/LoadingStates'
import { EmptyStatsState, EmptyChartState } from '@/components/ui/EmptyStates'
import { StatCard, StatChart, StatAlert, GoalProgress } from './StatComponents'
import { InteractiveCard, AnimatedContainer } from '@/components/ui/MicroInteractions'
import { FocusableElement, LiveRegion, AccessibleError } from '@/components/ui/Accessibility'
import { useLazyLoading, useDebounce, useMemoizedCalculation } from '@/hooks/usePerformance'

interface StatsModuleProps {
  totalPosts?: number
  postsThisMonth?: number
  favoritePosts?: number
}

export const StatsModule = ({ totalPosts, postsThisMonth, favoritePosts }: StatsModuleProps) => {
  const { theme } = useTheme()
  const realStats = useRealStats()
  const { activeGoals, goalProgress, alerts, stats: goalsStats } = useGoals()
  const { isVisible, elementRef } = useLazyLoading()
  
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

  // Debounce dos dados para evitar animações excessivas
  const debouncedRealStats = useDebounce(realStats, 100)

  // Memoizar dados calculados para performance
  const statsToAnimate = useMemoizedCalculation(() => {
    return {
      totalPosts: debouncedRealStats.totalPosts || totalPosts || 0,
      postsThisMonth: debouncedRealStats.postsThisMonth || postsThisMonth || 0,
      uniqueCategories: debouncedRealStats.uniqueCategories || 0,
      engagementRate: debouncedRealStats.engagementRate || 0,
      followersGained: debouncedRealStats.followersGained || 0,
      totalLikes: debouncedRealStats.totalLikes || 0,
      totalShares: debouncedRealStats.totalShares || 0,
      totalSaved: debouncedRealStats.totalSaved || 0,
      averagePostLength: debouncedRealStats.averagePostLength || 0
    }
  }, [debouncedRealStats, totalPosts, postsThisMonth, favoritePosts])

  // Memoizar configuração das estatísticas
  const statsConfig = useMemo(() => [
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
  ], [animatedStats, realStats.mostUsedCategory])

  // Animação dos números otimizada
  useEffect(() => {
    if (debouncedRealStats.loading) return

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

    // Usar dados memoizados para animação

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

  // Callbacks otimizados
  const handleCardClick = useCallback((statLabel: string) => {
    console.log(`Card clicked: ${statLabel}`)
    // Implementar ação específica para cada card
  }, [])

  const handleGoalClick = useCallback((goalId: string) => {
    console.log(`Goal clicked: ${goalId}`)
    // Implementar navegação para detalhes da meta
  }, [])

  const handleAlertAction = useCallback((alertId: string) => {
    console.log(`Alert action: ${alertId}`)
    // Implementar ação do alerta
  }, [])

  return (
    <FocusableElement
      className={`rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-200'
      }`}
      ariaLabel="Módulo de estatísticas do usuário"
      role="region"
    >
      {/* Skip link para acessibilidade */}
      <a href="#stats-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg">
        Pular para conteúdo das estatísticas
      </a>

      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          📊 Suas Estatísticas
        </h2>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
        }`}>
          {realStats.loading ? 'Carregando...' : 'Dados Reais'}
        </div>
      </div>
      
      <div id="stats-content" className="grid grid-cols-2 gap-4" role="group" aria-label="Estatísticas principais">
        {statsConfig.map((stat, index) => (
          <StatCard
            key={index}
            stat={stat}
            theme={theme}
            onCardClick={() => handleCardClick(stat.label)}
            delay={index * 100}
          />
        ))}
      </div>
      
      {/* Estados de carregamento e erro */}
      {realStats.loading && (
        <div className="mt-6">
          <SkeletonStats />
        </div>
      )}

      {realStats.error && (
        <div className="mt-6">
          <AccessibleError
            title="Erro ao carregar estatísticas"
            message={realStats.error}
            onRetry={() => window.location.reload()}
          />
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
            <AnimatedContainer delay={400}>
              <InteractiveCard
                variant="default"
                size="md"
                ariaLabel="Progresso das metas ativas"
                className="hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    🎯 Progresso das Metas
                  </h4>
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {goalsStats.activeGoals} ativas
                  </span>
                </div>
                
                <div className="space-y-2">
                  {activeGoals.slice(0, 3).map((goal, index) => {
                    const progress = goalProgress.get(goal.id)
                    return (
                      <GoalProgress
                        key={goal.id}
                        goal={{
                          id: goal.id,
                          title: goal.title,
                          progress: progress?.progress || 0,
                          color: progress?.needsAttention ? '#EF4444' : '#10B981'
                        }}
                        onGoalClick={handleGoalClick}
                        delay={index * 50}
                      />
                    )
                  })}
                </div>
              </InteractiveCard>
            </AnimatedContainer>
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
            <div className="space-y-3">
              <h4 className={`text-md font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                🚨 Alertas Importantes
              </h4>
              {alerts.filter(a => !a.isRead && a.priority === 'high').slice(0, 2).map((alert, index) => (
                <StatAlert
                  key={alert.id}
                  alert={alert}
                  onAction={handleAlertAction}
                  delay={index * 100}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Live region para screen readers */}
      <LiveRegion className="sr-only">
        {realStats.loading && 'Carregando estatísticas...'}
        {realStats.error && `Erro: ${realStats.error}`}
        {!realStats.loading && !realStats.error && `Estatísticas carregadas: ${animatedStats.totalPosts} posts, ${animatedStats.uniqueCategories} nichos`}
      </LiveRegion>
    </FocusableElement>
  )
}
