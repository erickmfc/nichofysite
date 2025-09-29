'use client'

import { useState } from 'react'

interface Post {
  id: string
  title: string
  date: Date
  status: 'draft' | 'scheduled' | 'published'
  category: string
}

interface PostCalendarProps {
  className?: string
}

export const PostCalendar: React.FC<PostCalendarProps> = ({ className = '' }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [posts, setPosts] = useState<Post[]>([])

  // TODO: Buscar posts reais do Firebase
  const mockPosts: Post[] = [
    {
      id: '1',
      title: 'Tutorial React Hooks',
      date: new Date(2024, 0, 15),
      status: 'published',
      category: 'tecnologia'
    },
    {
      id: '2',
      title: '5 Dicas de Produtividade',
      date: new Date(2024, 0, 18),
      status: 'scheduled',
      category: 'produtividade'
    },
    {
      id: '3',
      title: 'Case de Sucesso',
      date: new Date(2024, 0, 22),
      status: 'draft',
      category: 'cases'
    }
  ]

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
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

  const getPostsForDate = (day: number) => {
    if (!day) return []
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return mockPosts.filter(post => 
      post.date.toDateString() === date.toDateString()
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500'
      case 'scheduled': return 'bg-blue-500'
      case 'draft': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            📅 Calendário de Posts
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              →
            </button>
          </div>
        </div>
        
        <h4 className="text-lg font-medium text-gray-900 text-center">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
      </div>

      <div className="p-4">
        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Dias do calendário */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayPosts = getPostsForDate(day || 0)
            const isSelected = selectedDate && day && 
              new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString() === selectedDate.toDateString()
            
            return (
              <div
                key={index}
                className={`
                  aspect-square flex flex-col items-center justify-center text-sm cursor-pointer rounded-lg transition-colors relative
                  ${day === null 
                    ? 'bg-gray-50' 
                    : isSelected
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-white hover:bg-gray-50 text-gray-900'
                  }
                `}
                onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
              >
                {day && (
                  <>
                    <span className="font-medium">{day}</span>
                    {dayPosts.length > 0 && (
                      <div className="flex space-x-1 mt-1">
                        {dayPosts.slice(0, 3).map((post, postIndex) => (
                          <div
                            key={postIndex}
                            className={`w-2 h-2 rounded-full ${getStatusColor(post.status)}`}
                            title={post.title}
                          />
                        ))}
                        {dayPosts.length > 3 && (
                          <div className="w-2 h-2 rounded-full bg-gray-400" title={`+${dayPosts.length - 3} mais`} />
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Detalhes do dia selecionado */}
      {selectedDate && (
        <div className="p-4 border-t bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-2">
            Posts para {selectedDate.toLocaleDateString('pt-BR')}
          </h4>
          {getPostsForDate(selectedDate.getDate()).length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum post agendado para este dia.</p>
          ) : (
            <div className="space-y-2">
              {getPostsForDate(selectedDate.getDate()).map(post => (
                <div key={post.id} className="flex items-center space-x-2 text-sm">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(post.status)}`} />
                  <span className="text-gray-900">{post.title}</span>
                  <span className="text-gray-500 capitalize">({post.status})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}