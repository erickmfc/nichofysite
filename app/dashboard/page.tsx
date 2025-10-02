'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { GreetingModule } from '@/components/dashboard/modules/GreetingModule'
import { RecentPostsModule } from '@/components/dashboard/modules/RecentPostsModule'
import { ActivityModule } from '@/components/dashboard/modules/ActivityModule'
import { CalendarModule } from '@/components/dashboard/modules/CalendarModule'
import { CategoryModule } from '@/components/dashboard/modules/CategoryModule'
import { SuggestionsModule } from '@/components/dashboard/modules/SuggestionsModule'
import { StatsModule } from '@/components/dashboard/modules/StatsModule'
import { QuickActionsModule } from '@/components/dashboard/modules/QuickActionsModule'
import { PlanInfo } from '@/components/dashboard/modules/PlanInfo'
import { usePosts } from '@/hooks/usePosts'
import PostManagementService from '@/lib/services/PostManagementService'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState({
    totalPosts: 0,
    postsThisMonth: 0,
    favoritePosts: 0,
    recentPosts: [],
    suggestions: [],
    activities: [],
    categories: {},
    isLoading: true
  })

  // Hook para posts do usuário
  const { posts, loading: postsLoading } = usePosts(user?.uid || '')

  // Carregar dados do dashboard
  useEffect(() => {
    if (!user) return

    const loadDashboardData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, isLoading: true }))

        // Carregar posts do usuário
        const userPosts = await PostManagementService.getUserPosts(user.uid, {}, { field: 'createdAt', direction: 'desc' }, 50)
        
        // Calcular estatísticas
        const now = new Date()
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        
        const totalPosts = userPosts.length
        const postsThisMonth = userPosts.filter(post => 
          post.createdAt?.toDate?.() >= thisMonth
        ).length
        const favoritePosts = userPosts.filter(post => post.isFavorite).length
        
        // Posts recentes (últimos 5)
        const recentPosts = userPosts.slice(0, 5).map(post => ({
          id: post.id,
          title: post.title,
          content: post.generatedContent.substring(0, 100) + '...',
          createdAt: post.createdAt?.toDate?.()?.toLocaleDateString('pt-BR') || 'Data não disponível',
          category: post.category,
          niche: post.niche,
          image: post.imageUrl
        }))

        // Categorias mais usadas
        const categories = userPosts.reduce((acc, post) => {
          acc[post.category] = (acc[post.category] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        // Sugestões baseadas no histórico
        const suggestions = generateSuggestions(userPosts, categories)

        // Atividades recentes
        const activities = generateActivities(userPosts)

        setDashboardData({
          totalPosts,
          postsThisMonth,
          favoritePosts,
          recentPosts,
          suggestions,
          activities,
          categories,
          isLoading: false
        })
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error)
        setDashboardData(prev => ({ ...prev, isLoading: false }))
      }
    }

    loadDashboardData()
  }, [user])

  // Gerar sugestões baseadas no histórico
  const generateSuggestions = (posts: any[], categories: Record<string, number>) => {
    const topCategories = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)

    const suggestions = []
    
    if (topCategories.length > 0) {
      suggestions.push({
        id: '1',
        title: `Criar post sobre ${topCategories[0]}`,
        description: `Baseado no seu histórico, você posta muito sobre ${topCategories[0]}`,
        type: 'category',
        priority: 'high'
      })
    }

    if (posts.length === 0) {
      suggestions.push({
        id: '2',
        title: 'Criar seu primeiro post',
        description: 'Comece criando conteúdo para sua marca',
        type: 'welcome',
        priority: 'high'
      })
    } else if (posts.length < 5) {
      suggestions.push({
        id: '3',
        title: 'Aumentar frequência de posts',
        description: 'Consistência é chave para o sucesso nas redes sociais',
        type: 'frequency',
        priority: 'medium'
      })
    }

    return suggestions
  }

  // Gerar atividades baseadas nos posts
  const generateActivities = (posts: any[]) => {
    const activities = []
    
    posts.slice(0, 5).forEach(post => {
      activities.push({
        id: post.id,
        type: 'post_created',
        title: `Post criado: ${post.title}`,
        description: post.category,
        timestamp: post.createdAt?.toDate?.() || new Date(),
        icon: '📝'
      })
    })

    return activities.sort((a, b) => b.timestamp - a.timestamp)
  }

  // Memoizar nome do usuário
  const userName = useMemo(() => {
    return user?.displayName || user?.email?.split('@')[0] || 'Usuário'
  }, [user])

  if (loading || dashboardData.isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">NichoFy</h2>
            <p className="text-gray-600">Carregando seu centro de criação profissional...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  NichoFy
                </h1>
                <span className="ml-3 text-sm text-gray-500">
                  Dashboard
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/criar-conteudo')}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  + Criar Post
                </button>
                
                <button
                  onClick={() => router.push('/perfil')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block">{userName}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Grid Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Saudação e Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GreetingModule 
                  userName={userName}
                  suggestionsCount={dashboardData.suggestions.length}
                />
                <StatsModule 
                  totalPosts={dashboardData.totalPosts}
                  postsThisMonth={dashboardData.postsThisMonth}
                  favoritePosts={dashboardData.favoritePosts}
                />
              </div>

              {/* Posts Recentes */}
              <RecentPostsModule posts={dashboardData.recentPosts} />

              {/* Sugestões */}
              <SuggestionsModule suggestions={dashboardData.suggestions} />

            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              
              {/* Informações do Plano */}
              <PlanInfo />

              {/* Ações Rápidas */}
              <QuickActionsModule />

              {/* Calendário */}
              <CalendarModule />

              {/* Categorias */}
              <CategoryModule categories={dashboardData.categories} />

              {/* Atividades */}
              <ActivityModule activities={dashboardData.activities} />

            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}