'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme } from '@/lib/contexts/ThemeContext'

interface NotificationBellProps {
  notificationCount?: number
}

export const NotificationBell = ({ notificationCount = 0 }: NotificationBellProps) => {
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Mock notifications for demonstration
  const notifications = [
    {
      id: 1,
      title: 'Post gerado com sucesso!',
      message: 'Seu post sobre "Café da manhã" está pronto.',
      time: '2 min atrás',
      type: 'success',
      read: false
    },
    {
      id: 2,
      title: 'Nova sugestão disponível',
      message: 'Temos uma ideia para seu próximo post promocional.',
      time: '1 hora atrás',
      type: 'info',
      read: false
    },
    {
      id: 3,
      title: 'Lembrete de publicação',
      message: 'Não esqueça de publicar o post agendado para hoje.',
      time: '3 horas atrás',
      type: 'warning',
      read: true
    }
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅'
      case 'info': return '💡'
      case 'warning': return '⚠️'
      default: return '🔔'
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-all duration-200 ${
          theme === 'dark'
            ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-5 5v-5zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-xl border z-50 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Notificações
              </h3>
              {unreadCount > 0 && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  theme === 'dark'
                    ? 'bg-red-900 text-red-300'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {unreadCount} não lidas
                </span>
              )}
            </div>

            {/* Notifications List */}
            <div className="py-2 max-h-64 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    notification.read
                      ? theme === 'dark'
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                      : theme === 'dark'
                        ? 'bg-blue-900/20 hover:bg-blue-900/30'
                        : 'bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </p>
                      <p className={`text-xs mt-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      <p className={`text-xs mt-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsOpen(false)}
                className={`w-full text-center text-sm py-2 rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                Ver todas as notificações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
