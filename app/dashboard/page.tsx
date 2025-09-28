'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const { user } = useAuth()
  const [theme, setTheme] = useState<'light' | 'dark'>('dark') // Padrão modo escuro
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Usuário'

  return (
    <ProtectedRoute>
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'
      }`}>
        {/* Header Superior */}
        <header className={`border-b transition-colors duration-300 ${
          theme === 'light' 
            ? 'bg-white border-gray-200' 
            : 'bg-gray-800 border-gray-700'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className={`text-3xl font-black transition-colors duration-300 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  NichoFy Dashboard
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Botão de Busca */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar posts, templates..."
                    className={`px-4 py-2 rounded-lg border transition-colors duration-300 ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    }`}
                  />
                </div>

                {/* Botão de Notificações */}
                <button className={`p-2 rounded-lg transition-colors duration-300 ${
                  theme === 'light' 
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5L19.5 4.5" />
                  </svg>
                </button>

                {/* Botão Principal de Criação - CORAL ATÔMICO */}
                <button className="bg-[#FF7A59] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#FF6B47] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  ✨ Criar Post
                </button>

                {/* Toggle de Tema */}
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    theme === 'light' 
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Grid de Módulos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Módulo 1: Saudação e Resumo do Dia */}
            <div className={`lg:col-span-2 p-6 rounded-xl shadow-lg transition-colors duration-300 ${
              theme === 'light' ? 'bg-white' : 'bg-gray-800'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-2xl font-bold transition-colors duration-300 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {getGreeting()}, {userName}! 👋
                </h2>
                <span className={`text-sm transition-colors duration-300 ${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {currentTime.toLocaleTimeString('pt-BR')}
                </span>
              </div>
              
              <div className={`p-6 rounded-lg transition-colors duration-300 ${
                theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/30'
              }`}>
                <p className={`text-xl transition-colors duration-300 ${
                  theme === 'light' ? 'text-blue-800' : 'text-blue-200'
                }`}>
                  🎯 Você tem <span className="text-4xl font-black text-[#FF7A59]">3</span> <strong className="text-[#FF7A59]">sugestões de post</strong> para hoje. Vamos criar algo incrível?
                </p>
                <div className="mt-4 flex space-x-3">
                  <button className="bg-[#22D3EE] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#06B6D4] transition-all duration-300 shadow-lg">
                    Ver Sugestões
                  </button>
                  <button className={`px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-300 ${
                    theme === 'light' 
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-50' 
                      : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}>
                    Personalizar
                  </button>
                </div>
              </div>
            </div>

            {/* Módulo 2: Resumo da Atividade */}
            <div className={`p-6 rounded-xl shadow-lg transition-colors duration-300 ${
              theme === 'light' ? 'bg-white' : 'bg-gray-800'
            }`}>
              <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                📈 Posts Criados (7 dias)
              </h3>
              
              {/* Gráfico de Barras Melhorado */}
              <div className="h-32 flex items-end justify-between space-x-1 mb-4">
                {[65, 45, 80, 60, 90, 75, 85].map((height, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-gradient-to-t from-[#22D3EE] to-[#06B6D4] rounded-t w-6 transition-all duration-500 hover:from-[#06B6D4] hover:to-[#0891B2] hover:scale-105 cursor-pointer"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index]}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <span className={`text-4xl font-black transition-colors duration-300 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  85
                </span>
                <div className={`text-sm font-medium transition-colors duration-300 ${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  posts esta semana
                </div>
              </div>
            </div>

            {/* Módulo 3: Calendário de Conteúdo */}
            <div className={`lg:col-span-2 p-6 rounded-xl shadow-lg transition-colors duration-300 ${
              theme === 'light' ? 'bg-white' : 'bg-gray-800'
            }`}>
              <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                📅 Calendário de Conteúdo
              </h3>
              
              <div className="grid grid-cols-7 gap-2">
                {/* Cabeçalho dos dias */}
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className={`text-center py-2 font-bold transition-colors duration-300 ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {day}
                  </div>
                ))}
                
                {/* Dias do mês */}
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                  const hasContent = [3, 7, 12, 15, 18, 22, 25, 28].includes(day)
                  const isToday = day === new Date().getDate()
                  const isImportant = [8, 15, 22, 29].includes(day) // Datas importantes
                  
                  return (
                    <div
                      key={day}
                      className={`text-center py-2 rounded-lg cursor-pointer transition-all duration-300 relative ${
                        isToday 
                          ? 'bg-[#C084FC] text-white font-bold ring-2 ring-[#C084FC] ring-opacity-50' 
                          : hasContent
                            ? theme === 'light'
                              ? 'bg-[#22D3EE] bg-opacity-20 text-[#06B6D4] hover:bg-opacity-30'
                              : 'bg-[#22D3EE] bg-opacity-30 text-white hover:bg-opacity-40'
                            : theme === 'light'
                              ? 'hover:bg-gray-100'
                              : 'hover:bg-gray-700'
                      }`}
                    >
                      {day}
                      {hasContent && (
                        <div className="w-1 h-1 bg-current rounded-full mx-auto mt-1"></div>
                      )}
                      {isImportant && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#FACC15] rounded-full"></div>
                      )}
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#22D3EE] rounded-full"></div>
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Conteúdo criado
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#FACC15] rounded-full"></div>
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Datas importantes
                    </span>
                  </div>
                </div>
                <button className={`text-sm font-bold transition-colors duration-300 ${
                  theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-[#22D3EE] hover:text-[#06B6D4]'
                }`}>
                  Ver calendário completo
                </button>
              </div>
            </div>

            {/* Módulo 4: Conteúdo por Categoria */}
            <div className={`p-6 rounded-xl shadow-lg transition-colors duration-300 ${
              theme === 'light' ? 'bg-white' : 'bg-gray-800'
            }`}>
              <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                📊 Conteúdo por Categoria
              </h3>
              
              <div className="space-y-4">
                {[
                  { name: 'Promoção', count: 15, color: 'bg-[#FF7A59]' },
                  { name: 'Dicas', count: 10, color: 'bg-[#22D3EE]' },
                  { name: 'Institucional', count: 5, color: 'bg-blue-500' },
                  { name: 'Entretenimento', count: 8, color: 'bg-[#C084FC]' },
                  { name: 'Educativo', count: 12, color: 'bg-[#FACC15]' }
                ].map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                      <span className={`font-semibold transition-colors duration-300 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        {category.name}
                      </span>
                    </div>
                    <span className={`text-xl font-black transition-colors duration-300 ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Módulo 5: Últimos Posts Criados */}
            <div className={`lg:col-span-2 p-6 rounded-xl shadow-lg transition-colors duration-300 ${
              theme === 'light' ? 'bg-white' : 'bg-gray-800'
            }`}>
              <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                📝 Últimos Posts Criados
              </h3>
              
              <div className="space-y-4">
                {[
                  {
                    title: 'Post sobre Direito Trabalhista',
                    preview: 'Descubra seus direitos trabalhistas e como protegê-los...',
                    time: 'Hoje',
                    category: 'Educativo',
                    image: '📚',
                    color: 'bg-[#FACC15]'
                  },
                  {
                    title: 'Artigo sobre Saúde Mental',
                    preview: 'Cuidar da saúde mental é fundamental para o bem-estar...',
                    time: 'Ontem',
                    category: 'Dicas',
                    image: '🧠',
                    color: 'bg-[#22D3EE]'
                  },
                  {
                    title: 'Template LinkedIn',
                    preview: 'Como criar um perfil profissional que se destaca...',
                    time: '2 dias atrás',
                    category: 'Institucional',
                    image: '💼',
                    color: 'bg-blue-500'
                  }
                ].map((post, index) => (
                  <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                    theme === 'light' ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-700 hover:bg-gray-600'
                  }`}>
                    <div className="text-2xl">{post.image}</div>
                    <div className="flex-1">
                      <h4 className={`font-bold transition-colors duration-300 ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        {post.title}
                      </h4>
                      <p className={`text-sm transition-colors duration-300 ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {post.preview}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors duration-300 ${
                          post.color
                        } text-white`}>
                          {post.category}
                        </span>
                        <span className={`text-xs font-medium transition-colors duration-300 ${
                          theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {post.time}
                        </span>
                      </div>
                    </div>
                    <button className={`p-2 rounded-lg transition-colors duration-300 ${
                      theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Módulo 6: Sugestões para Hoje */}
            <div className={`lg:col-span-3 p-6 rounded-xl shadow-lg transition-colors duration-300 ${
              theme === 'light' ? 'bg-white' : 'bg-gray-800'
            }`}>
              <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                🎯 Sugestões para Hoje
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    time: '09:00',
                    title: 'Post de "bom dia" para sua cafeteria',
                    description: 'Comece o dia com energia e convide seus clientes para um café especial',
                    type: 'Instagram',
                    color: 'bg-[#FF7A59]'
                  },
                  {
                    time: '14:00',
                    title: 'Enquete nos stories sobre sabor preferido',
                    description: 'Engaje sua audiência perguntando qual sabor de café eles preferem',
                    type: 'Stories',
                    color: 'bg-[#22D3EE]'
                  },
                  {
                    time: '18:00',
                    title: 'Post de happy hour',
                    description: 'Promova o happy hour da sua cafeteria com drinks especiais',
                    type: 'Instagram',
                    color: 'bg-[#C084FC]'
                  }
                ].map((suggestion, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 transition-all duration-300 ${
                    theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-700 border-gray-600'
                  }`} style={{ borderLeftColor: suggestion.color.replace('bg-', '#') }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-black text-lg transition-colors duration-300 ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        {suggestion.time}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold transition-colors duration-300 ${
                        theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-600 text-gray-300'
                      }`}>
                        {suggestion.type}
                      </span>
                    </div>
                    <h4 className={`font-bold mb-1 transition-colors duration-300 ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {suggestion.title}
                    </h4>
                    <p className={`text-sm transition-colors duration-300 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {suggestion.description}
                    </p>
                    <button className={`mt-3 text-sm font-bold transition-colors duration-300 ${
                      theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-[#22D3EE] hover:text-[#06B6D4]'
                    }`}>
                      Usar sugestão →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}