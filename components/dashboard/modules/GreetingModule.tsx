'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'

interface GreetingModuleProps {
  userName: string
  suggestionsCount: number
}

export const GreetingModule = ({ userName, suggestionsCount }: GreetingModuleProps) => {
  const { theme } = useTheme()

  return (
    <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
      theme === 'dark'
        ? 'bg-gray-800 border border-gray-700'
        : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Bom dia, {userName}! 🌅
          </h2>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Você tem <span className="font-semibold text-blue-500">{suggestionsCount}</span> sugestões de post para hoje.
          </p>
          <p className={`text-sm mt-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Vamos criar algo incrível?
          </p>
        </div>
        <div className="text-6xl">🚀</div>
      </div>
    </div>
  )
}
