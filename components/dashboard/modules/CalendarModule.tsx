'use client'

import { useState } from 'react'
import { useTheme } from '@/lib/contexts/ThemeContext'

interface CalendarModuleProps {
  contentDays: number[] // Dias do mês que têm conteúdo
}

export const CalendarModule = ({ contentDays }: CalendarModuleProps) => {
  const { theme } = useTheme()
  const [currentDate] = useState(new Date())
  
  const today = currentDate.getDate()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  
  const days = []
  
  // Dias vazios do início do mês
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  
  // Dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  return (
    <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
      theme === 'dark'
        ? 'bg-gray-800 border border-gray-700'
        : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          📅 Calendário de Conteúdo
        </h3>
        <span className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {monthNames[currentMonth]} {currentYear}
        </span>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className={`text-center text-xs font-medium py-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="h-8"></div>
          }
          
          const hasContent = contentDays.includes(day)
          const isToday = day === today
          
          return (
            <div
              key={day}
              className={`h-8 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-all duration-200 ${
                isToday
                  ? 'bg-blue-500 text-white font-semibold'
                  : hasContent
                    ? theme === 'dark'
                      ? 'bg-green-600 text-white hover:bg-green-500'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {day}
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              Com conteúdo
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              Hoje
            </span>
          </div>
        </div>
        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
          {contentDays.length} dias com conteúdo
        </span>
      </div>
    </div>
  )
}
