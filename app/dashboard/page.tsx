'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo, useCallback, Suspense, lazy } from 'react'

// Lazy loading para componentes pesados
const PostsCounter = lazy(() => import('@/components/ui/PostsCounter'))
const ContentIdeas = lazy(() => import('@/components/ui/ContentIdeas'))
const QuickStats = lazy(() => import('@/components/ui/QuickStats'))
const ActivityFeed = lazy(() => import('@/components/ui/ActivityFeed'))

// Componente de loading
const LoadingSpinner = () => (
  <div className="animate-pulse bg-gray-200 rounded-lg h-32 w-full"></div>
)

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Memoizar cores para evitar recálculos
  const colors = useMemo(() => ({
    light: {
      background: 'bg-gray-50',
      cardBackground: 'bg-white',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      border: 'border-gray-200',
      royalBlue: 'text-blue-600',
      teal: 'text-teal-600', 
      cosmicPurple: 'text-purple-600',
      coralVibrant: 'text-orange-500',
      electricCyan: 'text-cyan-500',
      primaryGradient: 'from-orange-500 to-pink-500',
      headerBg: 'bg-white',
      headerBorder: 'border-gray-200'
    },
    dark: {
      background: 'bg-gray-900',
      cardBackground: 'bg-gray-800',
      textPrimary: 'text-gray-50',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-400',
      border: 'border-gray-700',
      royalBlue: 'text-cyan-400',
      teal: 'text-emerald-400',
      cosmicPurple: 'text-purple-400',
      coralVibrant: 'text-orange-400',
      electricCyan: 'text-cyan-300',
      primaryGradient: 'from-orange-500 to-pink-500',
      headerBg: 'bg-gray-800',
      headerBorder: 'border-gray-700'
    }
  }), [])

  const currentColors = isDarkMode ? colors.dark : colors.light

  // Otimizar verificação de autenticação
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Memoizar função de gerar dias do calendário
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Dias vazios do mês anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }, [currentDate])

  // Otimizar função de logout
  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  if (loading) {
    return (
      <div className={`min-h-screen ${currentColors.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-b-4 ${isDarkMode ? 'border-cyan-400' : 'border-orange-500'} mx-auto mb-6`}></div>
          <h2 className={`text-2xl font-bold mb-2 ${currentColors.textPrimary}`}>NichoFy</h2>
          <p className={currentColors.textSecondary}>Carregando seu centro criativo...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className={`min-h-screen ${currentColors.background}`}>
      {/* Header otimizado */}
      <header className={`${currentColors.headerBg} shadow-sm border-b ${currentColors.headerBorder}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className={`text-2xl font-bold ${currentColors.textPrimary}`}>
                NichoFy
              </h1>
              <span className={`ml-3 text-sm ${currentColors.textMuted}`}>
                Dashboard
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${currentColors.textMuted} hover:${currentColors.textPrimary} transition-colors`}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              
              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded-lg ${currentColors.textMuted} hover:${currentColors.textPrimary} transition-colors`}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal com lazy loading */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats rápidas */}
            <Suspense fallback={<LoadingSpinner />}>
              <QuickStats userId={user.uid} />
            </Suspense>

            {/* Contador de posts */}
            <Suspense fallback={<LoadingSpinner />}>
              <PostsCounter userId={user.uid} />
            </Suspense>

            {/* Ideias de conteúdo */}
            <Suspense fallback={<LoadingSpinner />}>
              <ContentIdeas userId={user.uid} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Feed de atividades */}
            <Suspense fallback={<LoadingSpinner />}>
              <ActivityFeed userId={user.uid} />
            </Suspense>

            {/* Calendário simplificado */}
            <div className={`${currentColors.cardBackground} rounded-lg shadow-sm border ${currentColors.border} p-6`}>
              <h3 className={`text-lg font-semibold ${currentColors.textPrimary} mb-4`}>
                Calendário
              </h3>
              
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className={`p-2 font-medium ${currentColors.textMuted}`}>
                    {day}
                  </div>
                ))}
                
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg cursor-pointer transition-colors ${
                      day === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth()
                        ? 'bg-blue-600 text-white'
                        : day 
                          ? `${currentColors.textPrimary} hover:bg-gray-100`
                          : 'invisible'
                    }`}
                    onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Links rápidos */}
            <div className={`${currentColors.cardBackground} rounded-lg shadow-sm border ${currentColors.border} p-6`}>
              <h3 className={`text-lg font-semibold ${currentColors.textPrimary} mb-4`}>
                Links Rápidos
              </h3>
              
              <div className="space-y-3">
                <a
                  href="/criar-conteudo"
                  className={`block p-3 rounded-lg border ${currentColors.border} hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">✨</span>
                    <div>
                      <div className={`font-medium ${currentColors.textPrimary}`}>Criar Conteúdo</div>
                      <div className={`text-sm ${currentColors.textMuted}`}>Gerar novo post</div>
                    </div>
                  </div>
                </a>
                
                <a
                  href="/meu-conteudo"
                  className={`block p-3 rounded-lg border ${currentColors.border} hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📚</span>
                    <div>
                      <div className={`font-medium ${currentColors.textPrimary}`}>Meus Posts</div>
                      <div className={`text-sm ${currentColors.textMuted}`}>Ver todos os posts</div>
                    </div>
                  </div>
                </a>
                
                <a
                  href="/nichos"
                  className={`block p-3 rounded-lg border ${currentColors.border} hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    <div>
                      <div className={`font-medium ${currentColors.textPrimary}`}>Nichos</div>
                      <div className={`text-sm ${currentColors.textMuted}`}>Explorar categorias</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}