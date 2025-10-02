'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore'

interface PremiumAnalytics {
  totalContent: number
  contentThisMonth: number
  averageEngagement: number
  topPerformingContent: any[]
  monthlyGrowth: number
  conversionRate: number
  revenue: number
  activeUsers: number
}

interface ContentPerformance {
  id: string
  title: string
  platform: string
  engagement: number
  reach: number
  conversions: number
  createdAt: Timestamp
}

interface UserActivity {
  id: string
  action: string
  timestamp: Timestamp
  details: any
}

export default function DashboardPremium() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<PremiumAnalytics | null>(null)
  const [recentContent, setRecentContent] = useState<ContentPerformance[]>([])
  const [userActivity, setUserActivity] = useState<UserActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  useEffect(() => {
    if (user) {
      loadPremiumAnalytics()
    }
  }, [user, selectedPeriod])

  const loadPremiumAnalytics = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      
      // Simular dados de analytics premium
      const mockAnalytics: PremiumAnalytics = {
        totalContent: 47,
        contentThisMonth: 15,
        averageEngagement: 8.7,
        topPerformingContent: [
          { title: 'Nova Lei Trabalhista', engagement: 12.5, platform: 'Instagram' },
          { title: 'Dicas de Investimento', engagement: 11.2, platform: 'LinkedIn' },
          { title: 'Direitos do Consumidor', engagement: 9.8, platform: 'Facebook' }
        ],
        monthlyGrowth: 23.5,
        conversionRate: 4.2,
        revenue: 1250.00,
        activeUsers: 1250
      }
      
      setAnalytics(mockAnalytics)
      
      // Carregar conteúdo recente
      const contentQuery = query(
        collection(db, 'contentPerformance'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(10)
      )
      
      const contentSnapshot = await getDocs(contentQuery)
      const contentData = contentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContentPerformance[]
      
      setRecentContent(contentData)
      
      // Carregar atividade do usuário
      const activityQuery = query(
        collection(db, 'userActivity'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(20)
      )
      
      const activitySnapshot = await getDocs(activityQuery)
      const activityData = activitySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserActivity[]
      
      setUserActivity(activityData)
      
    } catch (error) {
      console.error('Erro ao carregar analytics premium:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 10) return 'text-green-600'
    if (engagement >= 7) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600'
    if (growth < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Carregando Dashboard Premium</h2>
            <p className="text-gray-600">Analisando seus dados...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  📊 Dashboard Premium
                </h1>
                <p className="text-gray-600 mt-1">Analytics avançados e insights inteligentes</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="7d">Últimos 7 dias</option>
                  <option value="30d">Últimos 30 dias</option>
                  <option value="90d">Últimos 90 dias</option>
                  <option value="1y">Último ano</option>
                </select>
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  ⭐ Premium
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Conteúdo</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics?.totalContent}</p>
                </div>
                <div className="text-4xl">📝</div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">
                  +{analytics?.contentThisMonth} este mês
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Engajamento Médio</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics?.averageEngagement}%</p>
                </div>
                <div className="text-4xl">📈</div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${getGrowthColor(analytics?.monthlyGrowth || 0)}`}>
                  {analytics?.monthlyGrowth > 0 ? '+' : ''}{analytics?.monthlyGrowth}% vs mês anterior
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics?.conversionRate}%</p>
                </div>
                <div className="text-4xl">🎯</div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-blue-600 font-medium">
                  +0.8% vs mês anterior
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Gerada</p>
                  <p className="text-3xl font-bold text-gray-900">R$ {analytics?.revenue}</p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">
                  +15% vs mês anterior
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Performing Content */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">🏆 Conteúdo com Melhor Performance</h3>
              <div className="space-y-4">
                {analytics?.topPerformingContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{content.title}</p>
                        <p className="text-sm text-gray-600">{content.platform}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getEngagementColor(content.engagement)}`}>
                        {content.engagement}%
                      </p>
                      <p className="text-xs text-gray-500">Engajamento</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">⚡ Atividade Recente</h3>
              <div className="space-y-4">
                {userActivity.length > 0 ? (
                  userActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">📝</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">
                          {activity.timestamp?.toDate().toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📊</div>
                    <p className="text-gray-600">Nenhuma atividade recente</p>
                    <p className="text-sm text-gray-500">Comece criando conteúdo para ver suas métricas</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Advanced Analytics */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">📊 Analytics Avançados</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="font-bold text-gray-900 mb-2">Segmentação de Audiência</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Análise detalhada do seu público-alvo e comportamento
                </p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                  Ver Análise
                </button>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
                <div className="text-4xl mb-4">📈</div>
                <h4 className="font-bold text-gray-900 mb-2">Tendências de Mercado</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Identifique oportunidades e tendências em seu nicho
                </p>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                  Ver Tendências
                </button>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="text-4xl mb-4">🤖</div>
                <h4 className="font-bold text-gray-900 mb-2">IA Insights</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Recomendações inteligentes baseadas em seus dados
                </p>
                <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors">
                  Ver Insights
                </button>
              </div>
            </div>
          </div>

          {/* Premium Features */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">⭐ Recursos Premium Disponíveis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🎨</div>
                <h4 className="font-bold mb-2">Templates Premium</h4>
                <p className="text-sm opacity-90">Acesso a templates exclusivos</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-3">📊</div>
                <h4 className="font-bold mb-2">Analytics Avançados</h4>
                <p className="text-sm opacity-90">Métricas detalhadas e insights</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-3">💬</div>
                <h4 className="font-bold mb-2">Suporte Prioritário</h4>
                <p className="text-sm opacity-90">Atendimento rápido e eficiente</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-3">🔌</div>
                <h4 className="font-bold mb-2">Integrações</h4>
                <p className="text-sm opacity-90">Conecte suas redes sociais</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                🚀 Explorar Recursos Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
