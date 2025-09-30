'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'

interface StatsModuleProps {
  totalPosts: number
  postsThisMonth: number
  favoritePosts: number
}

export const StatsModule = ({ totalPosts, postsThisMonth, favoritePosts }: StatsModuleProps) => {
  const { theme } = useTheme()

  const stats = [
    {
      label: 'Total de Posts',
      value: totalPosts,
      icon: '📝',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Este Mês',
      value: postsThisMonth,
      icon: '📅',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Favoritos',
      value: favoritePosts,
      icon: '❤️',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ]

  return (
    <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
      theme === 'dark'
        ? 'bg-gray-800 border border-gray-700'
        : 'bg-white border border-gray-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        📊 Suas Estatísticas
      </h3>
      
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600'
              : `${stat.bgColor} ${stat.borderColor}`
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : stat.color
                  }`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
