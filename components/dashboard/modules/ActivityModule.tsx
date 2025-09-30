'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'

interface Activity {
  id: string
  type: string
  title: string
  description: string
  timestamp: Date
  icon: string
}

interface ActivityModuleProps {
  activities: Activity[]
}

export const ActivityModule = ({ activities }: ActivityModuleProps) => {
  const { theme } = useTheme()

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) {
      return `${minutes}min atrás`
    } else if (hours < 24) {
      return `${hours}h atrás`
    } else {
      return `${days}d atrás`
    }
  }

  if (activities.length === 0) {
    return (
      <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          📈 Atividades Recentes
        </h3>
        
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🚀</div>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Suas atividades aparecerão aqui conforme você criar conteúdo.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
      theme === 'dark'
        ? 'bg-gray-800 border border-gray-700'
        : 'bg-white border border-gray-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        📈 Atividades Recentes
      </h3>
      
      <div className="space-y-3">
        {activities.slice(0, 5).map((activity) => (
          <div
            key={activity.id}
            className={`p-3 rounded-xl transition-all duration-200 hover:shadow-md ${
              theme === 'dark'
                ? 'bg-gray-700 border border-gray-600 hover:bg-gray-600'
                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-lg">{activity.icon}</span>
              <div className="flex-1">
                <h4 className={`font-semibold text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {activity.title}
                </h4>
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {activity.description}
                </p>
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}