import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function CalendarioPage() {
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
  
  const calendarDays = [
    { day: 1, content: 'Post sobre Direito Trabalhista', type: 'instagram' },
    { day: 3, content: 'Artigo sobre Saúde Mental', type: 'blog' },
    { day: 5, content: 'Story sobre Tecnologia', type: 'story' },
    { day: 8, content: 'Post LinkedIn Profissional', type: 'linkedin' },
    { day: 12, content: 'Thread sobre Educação', type: 'twitter' },
    { day: 15, content: 'Post Motivacional', type: 'instagram' },
    { day: 18, content: 'Artigo sobre Marketing', type: 'blog' },
    { day: 22, content: 'Story sobre Negócios', type: 'story' },
    { day: 25, content: 'Post sobre Inovação', type: 'linkedin' },
    { day: 28, content: 'Thread sobre Sustentabilidade', type: 'twitter' },
  ]

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'instagram': return 'bg-pink-100 text-pink-800'
      case 'linkedin': return 'bg-blue-100 text-blue-800'
      case 'blog': return 'bg-green-100 text-green-800'
      case 'story': return 'bg-purple-100 text-purple-800'
      case 'twitter': return 'bg-sky-100 text-sky-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Calendário de Conteúdo</h1>
          
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{currentMonth}</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Mês Anterior
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Próximo Mês
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="p-2 text-center font-semibold text-gray-600">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                const dayContent = calendarDays.find(d => d.day === day)
                return (
                  <div key={day} className="min-h-[80px] p-2 border rounded-lg hover:bg-gray-50">
                    <div className="font-semibold text-sm mb-1">{day}</div>
                    {dayContent && (
                      <div className={`text-xs p-1 rounded ${getTypeColor(dayContent.type)}`}>
                        {dayContent.content}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Próximos Conteúdos</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium">Post sobre Direito</span>
                    <div className="text-sm text-gray-500">Instagram</div>
                  </div>
                  <span className="text-sm text-gray-500">Amanhã</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium">Artigo sobre Saúde</span>
                    <div className="text-sm text-gray-500">Blog</div>
                  </div>
                  <span className="text-sm text-gray-500">3 dias</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-medium">Story Tecnologia</span>
                    <div className="text-sm text-gray-500">Instagram</div>
                  </div>
                  <span className="text-sm text-gray-500">5 dias</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Estatísticas do Mês</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Conteúdos Programados</span>
                  <span className="font-semibold">10</span>
                </div>
                <div className="flex justify-between">
                  <span>Conteúdos Publicados</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between">
                  <span>Engajamento Médio</span>
                  <span className="font-semibold">4.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Alcance Total</span>
                  <span className="font-semibold">2.4K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
