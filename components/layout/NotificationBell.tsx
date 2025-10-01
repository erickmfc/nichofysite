'use client'

import { useState, useEffect } from 'react'
import { useGoals } from '@/hooks/useGoals'
import { useTheme } from '@/lib/contexts/ThemeContext'

interface NotificationBellProps {
  className?: string
}

export const NotificationBell = ({ className = '' }: NotificationBellProps) => {
  const { theme } = useTheme()
  const { alerts, markAlertAsRead } = useGoals()
  const [isOpen, setIsOpen] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  const unreadAlerts = alerts.filter(alert => !alert.isRead)
  const highPriorityAlerts = unreadAlerts.filter(alert => alert.priority === 'high')

  // Solicitar permissão para notificações
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setPermission(permission)
        })
      }
    }
  }, [])

  // Mostrar notificação quando há alertas de alta prioridade
  useEffect(() => {
    if (permission === 'granted' && highPriorityAlerts.length > 0) {
      const latestAlert = highPriorityAlerts[0]
      
      // Verificar se já foi mostrada (evitar spam)
      const lastShown = localStorage.getItem(`alert_shown_${latestAlert.id}`)
      if (!lastShown) {
        new Notification(latestAlert.title, {
          body: latestAlert.message,
          icon: '/favicon.ico',
          tag: latestAlert.id
        })
        
        localStorage.setItem(`alert_shown_${latestAlert.id}`, 'true')
      }
    }
  }, [highPriorityAlerts, permission])

  const handleMarkAsRead = async (alertId: string) => {
    await markAlertAsRead(alertId)
    localStorage.removeItem(`alert_shown_${alertId}`)
  }

  const handleMarkAllAsRead = async () => {
    for (const alert of unreadAlerts) {
      await markAlertAsRead(alert.id)
      localStorage.removeItem(`alert_shown_${alert.id}`)
    }
    setIsOpen(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🔵'
      default: return '⚪'
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Botão do sino */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors ${
          theme === 'dark' 
            ? 'hover:bg-gray-700 text-gray-300' 
            : 'hover:bg-gray-100 text-gray-600'
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Badge de notificação */}
        {unreadAlerts.length > 0 && (
          <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
            highPriorityAlerts.length > 0 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-blue-500 text-white'
          }`}>
            {unreadAlerts.length > 9 ? '9+' : unreadAlerts.length}
          </span>
        )}
      </button>

      {/* Dropdown de notificações */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Painel de notificações */}
          <div className={`absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-xl shadow-lg border z-20 ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            {/* Header */}
            <div className={`p-4 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Notificações
                </h3>
                {unreadAlerts.length > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className={`text-sm px-2 py-1 rounded ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    Marcar todas como lidas
                  </button>
                )}
              </div>
            </div>

            {/* Lista de notificações */}
            <div className="max-h-80 overflow-y-auto">
              {unreadAlerts.length === 0 ? (
                <div className={`p-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="text-2xl mb-2">🔔</div>
                  <p className="text-sm">Nenhuma notificação nova</p>
                </div>
              ) : (
                unreadAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-4 border-b transition-colors hover:bg-opacity-50 ${
                      theme === 'dark' 
                        ? 'border-gray-700 hover:bg-gray-700' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <span className="text-lg">{getPriorityIcon(alert.priority)}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {alert.title}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                            {alert.priority}
                          </span>
                        </div>
                        
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {alert.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {alert.createdAt.toDate().toLocaleString('pt-BR')}
                          </span>
                          
                          <button
                            onClick={() => handleMarkAsRead(alert.id)}
                            className={`text-xs px-2 py-1 rounded ${
                              theme === 'dark' 
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            }`}
                          >
                            Marcar como lida
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {unreadAlerts.length > 0 && (
              <div className={`p-3 border-t ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`w-full text-sm py-2 rounded-lg ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  Ver todas as notificações
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// Hook para gerenciar notificações push
export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    if ('Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false
    
    const result = await Notification.requestPermission()
    setPermission(result)
    return result === 'granted'
  }

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        ...options
      })
    }
  }

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification
  }
}