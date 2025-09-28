'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { FirestoreService } from '@/lib/services/FirestoreService'
import { UserProfile, Post, CalendarEvent, Notification } from '@/lib/types/firestore'
import { OnboardingInteligente } from './OnboardingInteligente'
import { ThemeProvider } from '@/lib/contexts/ThemeContext'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { GreetingModule } from '@/components/dashboard/modules/GreetingModule'
import { CalendarModule } from '@/components/dashboard/modules/CalendarModule'
import { ActivityModule } from '@/components/dashboard/modules/ActivityModule'
import { CategoryModule } from '@/components/dashboard/modules/CategoryModule'
import { RecentPostsModule } from '@/components/dashboard/modules/RecentPostsModule'
import { SuggestionsModule } from '@/components/dashboard/modules/SuggestionsModule'

export const UserDashboard = () => {
  const { user, logout } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [firestoreService, setFirestoreService] = useState<FirestoreService | null>(null)

  useEffect(() => {
    if (user) {
      const service = new FirestoreService(user.uid)
      setFirestoreService(service)
      loadUserData(service)
    }
  }, [user])

  const loadUserData = async (service: FirestoreService) => {
    if (!user) return

    try {
      // Carregar perfil do usuário
      const profile = await service.getUserProfile()
      setUserProfile(profile)
      
      // Se não completou onboarding, mostrar
      if (!profile?.onboardingCompleted) {
        setShowOnboarding(true)
      }

      // Carregar dados em paralelo
      await Promise.all([
        loadPosts(service),
        loadCalendarEvents(service),
        loadNotifications(service)
      ])
      
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadPosts = async (service: FirestoreService) => {
    try {
      const userPosts = await service.getUserPosts(50)
      setPosts(userPosts)
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
    }
  }

  const loadCalendarEvents = async (service: FirestoreService) => {
    try {
      const events = await service.getUserCalendarEvents()
      setCalendarEvents(events)
    } catch (error) {
      console.error('Erro ao carregar eventos do calendário:', error)
    }
  }

  const loadNotifications = async (service: FirestoreService) => {
    try {
      const userNotifications = await service.getUserNotifications(20)
      setNotifications(userNotifications)
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    }
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    if (firestoreService) {
      loadUserData(firestoreService)
    }
  }

  const handleCreateContent = async () => {
    if (!firestoreService) return
    
    try {
      console.log('Criando novo conteúdo...')
      
      const newPost = await firestoreService.createPost({
        userId: user!.uid,
        prompt: 'Post de exemplo criado pelo dashboard',
        generatedContent: 'Este é um post de exemplo criado através do dashboard da NichoFy!',
        category: 'Institucional',
        platform: 'instagram',
        hashtags: ['#nichofy', '#conteudo', '#exemplo'],
        interactions: {
          liked: false,
          saved: false,
          used: false,
          shared: false
        },
        metadata: {
          niche: userProfile?.brandInfo.niche || 'geral',
          toneOfVoice: userProfile?.brandInfo.toneOfVoice || ['profissional'],
          targetAudience: userProfile?.brandInfo.targetAudience || 'geral',
          wordCount: 20,
          estimatedReadTime: 1
        }
      })

      console.log('Post criado com ID:', newPost)
      await loadPosts(firestoreService)
      
    } catch (error) {
      console.error('Erro ao criar conteúdo:', error)
    }
  }

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Carregando dashboard...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  if (showOnboarding) {
    return (
      <ThemeProvider>
        <OnboardingInteligente onComplete={handleOnboardingComplete} />
      </ThemeProvider>
    )
  }

  // Dados processados para os módulos
  const processedData = {
    suggestionsCount: notifications.filter(n => !n.read).length,
    contentDays: posts.map(post => {
      const date = post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt.seconds * 1000)
      return date.getDate()
    }),
    activityData: (() => {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date.toLocaleDateString('pt-BR', { weekday: 'short' })
      }).reverse()
      
      return last7Days.map(day => {
        const dayPosts = posts.filter(post => {
          const postDate = post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt.seconds * 1000)
          return postDate.toLocaleDateString('pt-BR', { weekday: 'short' }) === day
        })
        return { day, count: dayPosts.length }
      })
    })(),
    categories: (() => {
      const categoryCount: { [key: string]: number } = {}
      posts.forEach(post => {
        categoryCount[post.category] = (categoryCount[post.category] || 0) + 1
      })
      
      return Object.entries(categoryCount).map(([name, count], index) => ({
        name,
        count,
        color: ['blue', 'green', 'purple', 'orange'][index % 4]
      }))
    })(),
    recentPosts: posts.slice(0, 3).map(post => ({
      id: post.id!,
      title: post.prompt.substring(0, 50) + '...',
      content: post.generatedContent,
      createdAt: post.createdAt instanceof Date 
        ? post.createdAt.toLocaleDateString('pt-BR')
        : new Date(post.createdAt.seconds * 1000).toLocaleDateString('pt-BR'),
      category: post.category
    })),
    suggestions: notifications.slice(0, 3).map(notification => ({
      id: notification.id!,
      time: notification.createdAt instanceof Date 
        ? notification.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        : new Date(notification.createdAt.seconds * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      title: notification.title,
      description: notification.message,
      type: 'post' as const,
      priority: notification.type === 'warning' ? 'high' as const : 
                notification.type === 'info' ? 'medium' as const : 'low' as const
    }))
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar onLogout={logout} />
        
        {/* Header */}
        <Header 
          userName={userProfile?.displayName || user?.displayName || 'Usuário'}
          userEmail={userProfile?.email || user?.email || ''}
          onCreateContent={handleCreateContent}
          onLogout={logout}
        />
        
        {/* Main Content */}
        <main className="ml-64 pt-16 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Grid de Módulos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Saudação - Ocupa 2 colunas */}
              <div className="lg:col-span-2">
                <GreetingModule 
                  userName={userProfile?.displayName || user?.displayName || 'Usuário'}
                  suggestionsCount={processedData.suggestionsCount}
                />
              </div>
              
              {/* Calendário */}
              <div>
                <CalendarModule contentDays={processedData.contentDays} />
              </div>
              
              {/* Atividade */}
              <div>
                <ActivityModule postsData={processedData.activityData} />
              </div>
              
              {/* Categorias */}
              <div>
                <CategoryModule categories={processedData.categories} />
              </div>
              
              {/* Posts Recentes */}
              <div>
                <RecentPostsModule posts={processedData.recentPosts} />
              </div>
              
              {/* Sugestões - Ocupa 2 colunas */}
              <div className="lg:col-span-2">
                <SuggestionsModule suggestions={processedData.suggestions} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}