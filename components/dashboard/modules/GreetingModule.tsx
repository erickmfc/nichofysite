'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'

interface GreetingModuleProps {
  userName: string
  suggestionsCount: number
}

export const GreetingModule = ({ userName, suggestionsCount }: GreetingModuleProps) => {
  const { theme } = useTheme()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const getGreetingIcon = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '🌅'
    if (hour < 18) return '☀️'
    return '🌙'
  }

  return (
    <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
      theme === 'dark'
        ? 'bg-gray-800 border border-gray-700'
        : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center space-x-4">
        <div className="text-4xl">{getGreetingIcon()}</div>
        <div>
          <h2 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {getGreeting()}, {userName.split(' ')[0]}!
          </h2>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {suggestionsCount > 0 
              ? `${suggestionsCount} sugestões de conteúdo para hoje`
              : 'Pronto para criar conteúdo incrível?'
            }
          </p>
        </div>
      </div>
      
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <div className="flex items-center space-x-2">
          <span className="text-blue-600">💡</span>
          <p className="text-sm text-blue-800">
            <strong>Dica:</strong> Consistência é a chave do sucesso nas redes sociais!
          </p>
        </div>
      </div>
    </div>
  )
}