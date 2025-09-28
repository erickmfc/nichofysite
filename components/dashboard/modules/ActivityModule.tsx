'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'

interface ActivityModuleProps {
  postsData: { day: string; count: number }[]
}

export const ActivityModule = ({ postsData }: ActivityModuleProps) => {
  const { theme } = useTheme()
  
  const maxCount = Math.max(...postsData.map(d => d.count))
  
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
          📈 Atividade dos Últimos 7 Dias
        </h3>
        <span className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Posts criados
        </span>
      </div>
      
      <div className="h-32 flex items-end justify-between space-x-2">
        {postsData.map((data, index) => {
          const height = maxCount > 0 ? (data.count / maxCount) * 100 : 0
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative w-full h-24 flex items-end justify-center">
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 hover:opacity-80 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-t from-blue-600 to-blue-400'
                      : 'bg-gradient-to-t from-blue-500 to-blue-300'
                  }`}
                  style={{ height: `${height}%` }}
                ></div>
                <div className={`absolute -top-6 text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {data.count}
                </div>
              </div>
              <div className={`text-xs mt-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {data.day}
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className={`text-sm ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Total: <span className="font-semibold text-blue-500">
            {postsData.reduce((sum, d) => sum + d.count, 0)} posts
          </span>
        </div>
        <div className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Média: {Math.round(postsData.reduce((sum, d) => sum + d.count, 0) / postsData.length)} por dia
        </div>
      </div>
    </div>
  )
}
