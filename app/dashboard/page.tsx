'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
// Componentes de UI removidos temporariamente para evitar conflitos
// import { PostsCounter } from '@/components/ui/PostsCounter'
// import { ContentIdeas } from '@/components/ui/ContentIdeas'
// import { QuickStats } from '@/components/ui/QuickStats'
// import { QuickTemplates } from '@/components/ui/QuickTemplates'
// import { ActivityFeed } from '@/components/ui/ActivityFeed'
// import { PostCalendar } from '@/components/ui/PostCalendar'

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedNiche, setSelectedNiche] = useState('')
  const [topic, setTopic] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    console.log('📊 Dashboard: Verificando autenticação', { 
      user: !!user, 
      loading
    })
    
    if (!loading && !user) {
      console.log('📊 Dashboard: Usuário não autenticado, redirecionando para login')
      router.push('/login')
    }
  }, [user, loading, router])

  // Paleta de cores da NichoFy
  const colors = {
    light: {
      background: 'bg-gray-50',
      cardBackground: 'bg-white',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      border: 'border-gray-200',
      // Cores da marca
      royalBlue: 'text-blue-600',
      teal: 'text-teal-600', 
      cosmicPurple: 'text-purple-600',
      coralVibrant: 'text-orange-500',
      electricCyan: 'text-cyan-500',
      // Gradientes
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
      // Cores da marca (mais vibrantes no escuro)
      royalBlue: 'text-cyan-400',
      teal: 'text-emerald-400',
      cosmicPurple: 'text-purple-400',
      coralVibrant: 'text-orange-400',
      electricCyan: 'text-cyan-300',
      // Gradientes
      primaryGradient: 'from-orange-500 to-pink-500',
      headerBg: 'bg-gray-800',
      headerBorder: 'border-gray-700'
    }
  }

  const currentColors = isDarkMode ? colors.dark : colors.light

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

  // Função para gerar dias do mês
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Dias vazios do início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const calendarDays = generateCalendarDays()
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  // Simular posts criados (em produção viria do banco)
  const postsCreated = 12
  const postsThisMonth = 8
  const postsRemaining = 42

  // Simular dias com posts (em produção viria do banco)
  const daysWithPosts = [3, 7, 12, 15, 18, 22, 25, 28]

  const handleGenerateContent = async () => {
    setIsGenerating(true)
    // Simular geração de conteúdo
    setTimeout(() => {
      setIsGenerating(false)
      alert('Conteúdo gerado com sucesso! 🎉')
    }, 2000)
  }

  const quickIdeas = [
    { type: 'Enquete', icon: '📊', color: 'bg-blue-500' },
    { type: 'Bastidores', icon: '🎬', color: 'bg-purple-500' },
    { type: 'Dica', icon: '💡', color: 'bg-yellow-500' },
    { type: 'Case', icon: '📈', color: 'bg-green-500' },
    { type: 'FAQ', icon: '❓', color: 'bg-red-500' },
    { type: 'Tutorial', icon: '🎯', color: 'bg-indigo-500' }
  ]

  const todaySuggestions = [
    'Nova lei trabalhista: o que mudou para empresas',
    '5 dicas para contratar o primeiro funcionário',
    'Como calcular férias proporcionais corretamente',
    'Entenda o eSocial: obrigações e prazos'
  ]

  return (
    <div className={`min-h-screen ${currentColors.background}`}>
      {/* Header com identidade NichoFy refinada */}
      <header className={`${currentColors.headerBg} shadow-lg border-b-4 ${isDarkMode ? 'border-gray-700' : 'border-orange-400'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-400 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">N</span>
              </div>
              <div>
                <h1 className={`text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent`}>
                  NichoFy
                </h1>
                <p className={`${currentColors.textSecondary} font-medium`}>Bem-vindo, {user.displayName || user.email}!</p>
              </div>
            </div>
            
            {/* Menu de perfil e controles */}
            <div className="flex items-center space-x-4">
              {/* Toggle Dark Mode */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title={isDarkMode ? 'Modo claro' : 'Modo escuro'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              
              {/* Menu de perfil */}
              <div className="relative group">
                <button className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className={`text-sm ${currentColors.textSecondary}`}>Perfil</span>
                </button>
                
                {/* Dropdown do menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className={`text-sm font-medium ${currentColors.textPrimary}`}>{user.displayName || 'Usuário'}</p>
                      <p className={`text-xs ${currentColors.textMuted}`}>{user.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas com identidade visual refinada */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${currentColors.cardBackground} rounded-2xl shadow-xl p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-all`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${currentColors.textSecondary} mb-2`}>Posts Criados</h3>
                <p className={`text-4xl font-bold ${currentColors.royalBlue}`}>{postsCreated}</p>
                <p className={`${currentColors.textMuted} text-sm`}>Total de conteúdo gerado</p>
              </div>
              <div className={`text-4xl ${currentColors.royalBlue}`}>📝</div>
            </div>
          </div>

          <div className={`${currentColors.cardBackground} rounded-2xl shadow-xl p-6 border-l-4 border-teal-500 transform hover:scale-105 transition-all`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${currentColors.textSecondary} mb-2`}>Este Mês</h3>
                <p className={`text-4xl font-bold ${currentColors.teal}`}>{postsThisMonth}</p>
                <p className={`${currentColors.textMuted} text-sm`}>Posts criados em {monthNames[new Date().getMonth()]}</p>
              </div>
              <div className={`text-4xl ${currentColors.teal}`}>📅</div>
            </div>
          </div>

          <div className={`${currentColors.cardBackground} rounded-2xl shadow-xl p-6 border-l-4 border-purple-500 transform hover:scale-105 transition-all`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${currentColors.textSecondary} mb-2`}>Plano Atual</h3>
                <p className={`text-4xl font-bold ${currentColors.cosmicPurple}`}>Básico</p>
                <p className={`${currentColors.textMuted} text-sm`}>50 posts/mês</p>
              </div>
              <div className={`text-4xl ${currentColors.cosmicPurple}`}>💎</div>
            </div>
          </div>

          <div className={`${currentColors.cardBackground} rounded-2xl shadow-xl p-6 border-l-4 border-orange-500 transform hover:scale-105 transition-all`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${currentColors.textSecondary} mb-2`}>Posts Restantes</h3>
                <p className={`text-4xl font-bold ${currentColors.coralVibrant}`}>{postsRemaining}</p>
                <p className={`${currentColors.textMuted} text-sm`}>Este mês</p>
              </div>
              <div className={`text-4xl ${currentColors.coralVibrant}`}>⚡</div>
            </div>
          </div>
        </div>

        {/* Layout Principal - Gerador como herói */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gerador de Conteúdo - ÁREA PRINCIPAL */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gerador Principal */}
            <div className={`${currentColors.cardBackground} rounded-2xl shadow-2xl p-8 border ${currentColors.border} ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-orange-50'}`}>
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold ${currentColors.textPrimary} mb-2`}>🚀 Gerador de Conteúdo</h2>
                <p className={`${currentColors.textSecondary} text-lg`}>Crie conteúdo profissional em segundos</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className={`block text-lg font-semibold ${currentColors.textPrimary} mb-3`}>
                    🎯 Escolha seu Nicho
                  </label>
                  <select 
                    value={selectedNiche}
                    onChange={(e) => setSelectedNiche(e.target.value)}
                    className={`w-full px-4 py-4 border-2 ${currentColors.border} rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 text-lg ${currentColors.cardBackground} ${currentColors.textPrimary}`}
                  >
                    <option value="">Selecione um nicho</option>
                    <option value="direito">⚖️ Direito</option>
                    <option value="saude">🏥 Saúde</option>
                    <option value="tecnologia">💻 Tecnologia</option>
                    <option value="gastronomia">🍽️ Gastronomia</option>
                    <option value="fitness">💪 Fitness</option>
                    <option value="educacao">📚 Educação</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-lg font-semibold ${currentColors.textPrimary} mb-3`}>
                    💡 Tópico ou Ideia
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Nova lei trabalhista, dicas de contratação..."
                    className={`w-full px-4 py-4 border-2 ${currentColors.border} rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 text-lg ${currentColors.cardBackground} ${currentColors.textPrimary}`}
                  />
                </div>
                
                <a 
                  href="/criar-conteudo"
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-4 px-6 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-lg text-center inline-block"
                >
                  🚀 Criar Conteúdo Agora
                </a>
              </div>
            </div>

            {/* Sugestões para Hoje */}
            <div className={`${currentColors.cardBackground} rounded-2xl shadow-xl p-6`}>
              <h3 className={`text-xl font-bold ${currentColors.textPrimary} mb-4 flex items-center`}>
                💡 Sugestões para Hoje
                <span className={`ml-2 ${isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-600'} px-2 py-1 rounded-full text-sm font-semibold`}>
                  {todaySuggestions.length} ideias
                </span>
              </h3>
              <div className="space-y-3">
                {todaySuggestions.map((suggestion, index) => (
                  <div key={index} className={`p-4 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gradient-to-r from-orange-50 to-pink-50 hover:shadow-md'} rounded-xl border ${currentColors.border} transition-all cursor-pointer`}>
                    <p className={`${currentColors.textPrimary} font-medium`}>{suggestion}</p>
                    <p className={`text-sm ${currentColors.textMuted} mt-1`}>Clique para gerar conteúdo sobre este tópico</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Paleta de Ideias Rápidas */}
            <div className={`${currentColors.cardBackground} rounded-2xl shadow-xl p-6`}>
              <h3 className={`text-xl font-bold ${currentColors.textPrimary} mb-4 flex items-center`}>
                🎨 Paleta de Ideias Rápidas
                <span className={`ml-2 ${isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'} px-2 py-1 rounded-full text-sm font-semibold`}>
                  Vença o bloqueio criativo
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickIdeas.map((idea, index) => (
                  <button
                    key={index}
                    className={`${idea.color} text-white p-4 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg`}
                  >
                    <div className="text-2xl mb-2">{idea.icon}</div>
                    <div>{idea.type}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendário */}
            <div className={`${currentColors.cardBackground} rounded-2xl shadow-xl p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-bold ${currentColors.textPrimary}`}>
                  📅 {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  >
                    ←
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Cabeçalho dos dias da semana */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className={`text-center text-sm font-semibold ${currentColors.textMuted} py-2`}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Dias do calendário */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      aspect-square flex items-center justify-center text-sm cursor-pointer rounded-lg transition-colors relative
                      ${day === null 
                        ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}` 
                        : day === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth()
                        ? 'bg-blue-600 text-white'
                        : `${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-50' : 'bg-white hover:bg-gray-100 text-gray-900'}`
                      }
                    `}
                    onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                  >
                    {day}
                    {/* Indicador de posts */}
                    {day && daysWithPosts.includes(day) && (
                      <div className="absolute bottom-1 w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Posts agendados para o dia selecionado */}
              <div className={`mt-6 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-orange-50 to-pink-50'} rounded-xl border ${currentColors.border}`}>
                <h3 className={`font-semibold ${currentColors.textPrimary} mb-2`}>
                  📝 Posts para {selectedDate.toLocaleDateString('pt-BR')}
                </h3>
                <p className={`${currentColors.textSecondary} text-sm`}>
                  {daysWithPosts.includes(selectedDate.getDate()) 
                    ? 'Você tem posts criados neste dia!' 
                    : 'Nenhum post agendado para este dia.'
                  }
                </p>
              </div>
            </div>

            {/* Posts Recentes */}
            <div className={`${currentColors.cardBackground} rounded-2xl shadow-xl p-6`}>
              <h2 className={`text-xl font-bold ${currentColors.textPrimary} mb-4 flex items-center`}>
                📚 Posts Recentes
                <span className={`ml-2 ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'} px-2 py-1 rounded-full text-sm font-semibold`}>
                  {postsCreated} total
                </span>
              </h2>
              <div className="space-y-3">
                {postsCreated > 0 ? (
                  <>
                    <div className={`p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-50 to-purple-50'} rounded-xl border ${isDarkMode ? 'border-gray-600' : 'border-blue-200'}`}>
                      <p className={`font-semibold ${currentColors.textPrimary}`}>Nova lei trabalhista: o que mudou</p>
                      <p className={`text-sm ${currentColors.textMuted}`}>Direito • 2 dias atrás</p>
                    </div>
                    <div className={`p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-green-50 to-blue-50'} rounded-xl border ${isDarkMode ? 'border-gray-600' : 'border-green-200'}`}>
                      <p className={`font-semibold ${currentColors.textPrimary}`}>5 dicas para contratar funcionários</p>
                      <p className={`text-sm ${currentColors.textMuted}`}>Direito • 5 dias atrás</p>
                    </div>
                    <div className={`p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-purple-50 to-pink-50'} rounded-xl border ${isDarkMode ? 'border-gray-600' : 'border-purple-200'}`}>
                      <p className={`font-semibold ${currentColors.textPrimary}`}>Como calcular férias proporcionais</p>
                      <p className={`text-sm ${currentColors.textMuted}`}>Direito • 1 semana atrás</p>
                    </div>
                  </>
                ) : (
                  <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl text-center`}>
                    <p className={`${currentColors.textSecondary} mb-2`}>🎯 Comece criando seu primeiro post!</p>
                    <p className={`text-sm ${currentColors.textMuted} mb-4`}>Use o gerador acima para criar conteúdo profissional</p>
                    <a 
                      href="/meus-pedidos"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Ver Meus Pedidos
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Widgets adicionais - implementados separadamente */}
            <div className="space-y-6">
              {/* Link para página de conteúdo */}
              <div className={`${currentColors.cardBackground} rounded-2xl shadow-xl p-6`}>
                <h3 className={`text-lg font-semibold ${currentColors.textPrimary} mb-4`}>
                  📚 Meu Conteúdo
                </h3>
                <p className={`${currentColors.textSecondary} text-sm mb-4`}>
                  Gerencie todos os seus posts em um só lugar
                </p>
                <a 
                  href="/meu-conteudo"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Ver Meus Posts →
                </a>
              </div>
              
              {/* Link para criar conteúdo */}
              <div className={`${currentColors.cardBackground} rounded-2xl shadow-xl p-6`}>
                <h3 className={`text-lg font-semibold ${currentColors.textPrimary} mb-4`}>
                  ✨ Criar Conteúdo
                </h3>
                <p className={`${currentColors.textSecondary} text-sm mb-4`}>
                  Use nossos templates e ideias para criar posts
                </p>
                <a 
                  href="/criar-conteudo"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Criar Novo Post →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}