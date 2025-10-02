'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAdminRealData } from '@/hooks/useAdminRealData'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore'

interface AnalyticsData {
  users: {
    total: number
    active: number
    newThisMonth: number
    growthRate: number
    retentionRate: number
  }
  content: {
    totalPosts: number
    approvedPosts: number
    pendingPosts: number
    rejectedPosts: number
    postsThisMonth: number
    avgPostsPerUser: number
  }
  engagement: {
    totalLikes: number
    totalShares: number
    totalComments: number
    avgEngagementRate: number
    topCategories: Array<{ name: string; count: number }>
  }
  performance: {
    systemUptime: number
    avgResponseTime: number
    errorRate: number
    pageViews: number
  }
  revenue: {
    totalRevenue: number
    monthlyRevenue: number
    conversionRate: number
    avgOrderValue: number
  }
}

interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string
    fill?: boolean
  }>
}

export const AnalyticsDashboard = () => {
  const { stats, loading, error } = useAdminRealData()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true)
      
      // Buscar dados detalhados do Firestore
      const [usersSnapshot, postsSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'users'))),
        getDocs(query(collection(db, 'posts')))
      ])

      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      // Calcular métricas de usuários
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      
      const newUsersThisMonth = users.filter(user => {
        const userDate = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(user.createdAt)
        return userDate >= startOfMonth
      }).length

      const newUsersLastMonth = users.filter(user => {
        const userDate = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(user.createdAt)
        return userDate >= startOfLastMonth && userDate < startOfMonth
      }).length

      const growthRate = newUsersLastMonth > 0 
        ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100 
        : 0

      // Calcular métricas de conteúdo
      const approvedPosts = posts.filter(post => post.status === 'approved').length
      const pendingPosts = posts.filter(post => post.status === 'pending').length
      const rejectedPosts = posts.filter(post => post.status === 'rejected').length
      
      const postsThisMonth = posts.filter(post => {
        const postDate = post.createdAt?.toDate ? post.createdAt.toDate() : new Date(post.createdAt)
        return postDate >= startOfMonth
      }).length

      const avgPostsPerUser = users.length > 0 ? posts.length / users.length : 0

      // Calcular métricas de engajamento (simuladas por enquanto)
      const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0)
      const totalShares = posts.reduce((sum, post) => sum + (post.shares || 0), 0)
      const totalComments = posts.reduce((sum, post) => sum + (post.comments || 0), 0)
      
      const avgEngagementRate = posts.length > 0 
        ? ((totalLikes + totalShares + totalComments) / posts.length) * 100 
        : 0

      // Categorias mais populares
      const categoryCount: { [key: string]: number } = {}
      posts.forEach(post => {
        if (post.category) {
          categoryCount[post.category] = (categoryCount[post.category] || 0) + 1
        }
      })
      
      const topCategories = Object.entries(categoryCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      const analytics: AnalyticsData = {
        users: {
          total: users.length,
          active: users.filter(user => user.lastActive && 
            new Date(user.lastActive).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
          ).length,
          newThisMonth: newUsersThisMonth,
          growthRate,
          retentionRate: 85 // Simulado
        },
        content: {
          totalPosts: posts.length,
          approvedPosts,
          pendingPosts,
          rejectedPosts,
          postsThisMonth,
          avgPostsPerUser
        },
        engagement: {
          totalLikes,
          totalShares,
          totalComments,
          avgEngagementRate,
          topCategories
        },
        performance: {
          systemUptime: 99.9,
          avgResponseTime: 120,
          errorRate: 0.1,
          pageViews: 15420 // Simulado
        },
        revenue: {
          totalRevenue: 12500, // Simulado
          monthlyRevenue: 3200, // Simulado
          conversionRate: 3.2, // Simulado
          avgOrderValue: 45 // Simulado
        }
      }

      setAnalyticsData(analytics)

      // Gerar dados para gráficos
      const chartLabels = generateChartLabels(timeRange)
      const chartDataGenerated: ChartData = {
        labels: chartLabels,
        datasets: [
          {
            label: 'Usuários Ativos',
            data: generateMockData(chartLabels.length, 50, 200),
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 1)',
            fill: true
          },
          {
            label: 'Posts Criados',
            data: generateMockData(chartLabels.length, 10, 80),
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgba(16, 185, 129, 1)',
            fill: true
          },
          {
            label: 'Engajamento',
            data: generateMockData(chartLabels.length, 20, 150),
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderColor: 'rgba(245, 158, 11, 1)',
            fill: true
          }
        ]
      }

      setChartData(chartDataGenerated)

    } catch (err) {
      console.error('Erro ao carregar analytics:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const generateChartLabels = (range: string): string[] => {
    const now = new Date()
    const labels: string[] = []
    
    switch (range) {
      case '7d':
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
          labels.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }))
        }
        break
      case '30d':
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
          labels.push(date.toLocaleDateString('pt-BR', { day: '2-digit' }))
        }
        break
      case '90d':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
          labels.push(`Sem ${date.getWeek()}`)
        }
        break
      case '1y':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
          labels.push(date.toLocaleDateString('pt-BR', { month: 'short' }))
        }
        break
    }
    
    return labels
  }

  const generateMockData = (length: number, min: number, max: number): number[] => {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min)
  }

  const MetricCard = ({ title, value, change, icon, color }: {
    title: string
    value: string | number
    change?: number
    icon: string
    color: string
  }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <span className="text-2xl">{icon}</span>
        </div>
        {change !== undefined && (
          <div className={`text-sm font-medium ${
            change >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Carregando Analytics</h2>
          <p className="text-gray-400">Analisando dados do sistema...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Erro ao Carregar Analytics</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={loadAnalyticsData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📊 Analytics Avançado</h1>
            <p className="text-gray-400">Insights detalhados do NichoFy</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Último ano</option>
            </select>
            
            <button
              onClick={loadAnalyticsData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🔄 Atualizar
            </button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total de Usuários"
            value={analyticsData?.users.total.toLocaleString() || '0'}
            change={analyticsData?.users.growthRate}
            icon="👥"
            color="bg-blue-500"
          />
          <MetricCard
            title="Posts Criados"
            value={analyticsData?.content.totalPosts.toLocaleString() || '0'}
            change={15.2}
            icon="📝"
            color="bg-green-500"
          />
          <MetricCard
            title="Taxa de Engajamento"
            value={`${analyticsData?.engagement.avgEngagementRate.toFixed(1) || '0'}%`}
            change={8.7}
            icon="📈"
            color="bg-purple-500"
          />
          <MetricCard
            title="Receita Mensal"
            value={`R$ ${analyticsData?.revenue.monthlyRevenue.toLocaleString() || '0'}`}
            change={12.3}
            icon="💰"
            color="bg-yellow-500"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Tendências */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">Tendências de Crescimento</h3>
            {chartData && (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <p className="text-gray-400">Gráfico interativo será implementado</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {chartData.labels.length} pontos de dados • {timeRange}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Categorias Populares */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">Categorias Mais Populares</h3>
            <div className="space-y-4">
              {analyticsData?.engagement.topCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white mr-3">
                      {index + 1}
                    </div>
                    <span className="text-white font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-700 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ 
                          width: `${(category.count / (analyticsData?.engagement.topCategories[0]?.count || 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-gray-400 text-sm w-12 text-right">{category.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Métricas Detalhadas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Usuários */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">👥 Análise de Usuários</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Usuários Ativos</span>
                <span className="text-white font-medium">{analyticsData?.users.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Novos Este Mês</span>
                <span className="text-white font-medium">{analyticsData?.users.newThisMonth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Taxa de Retenção</span>
                <span className="text-white font-medium">{analyticsData?.users.retentionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Taxa de Crescimento</span>
                <span className={`font-medium ${
                  (analyticsData?.users.growthRate || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {(analyticsData?.users.growthRate || 0).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">📝 Análise de Conteúdo</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Posts Aprovados</span>
                <span className="text-green-400 font-medium">{analyticsData?.content.approvedPosts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Posts Pendentes</span>
                <span className="text-yellow-400 font-medium">{analyticsData?.content.pendingPosts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Posts Rejeitados</span>
                <span className="text-red-400 font-medium">{analyticsData?.content.rejectedPosts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Média por Usuário</span>
                <span className="text-white font-medium">{analyticsData?.content.avgPostsPerUser.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">⚡ Performance do Sistema</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Uptime</span>
                <span className="text-green-400 font-medium">{analyticsData?.performance.systemUptime}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tempo de Resposta</span>
                <span className="text-white font-medium">{analyticsData?.performance.avgResponseTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Taxa de Erro</span>
                <span className="text-red-400 font-medium">{analyticsData?.performance.errorRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Visualizações</span>
                <span className="text-white font-medium">{analyticsData?.performance.pageViews.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
