'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'
import { useRouter } from 'next/navigation'

interface Suggestion {
  id: string
  title: string
  description: string
  type: string
  priority: 'high' | 'medium' | 'low'
}

interface SuggestionsModuleProps {
  suggestions: Suggestion[]
}

export const SuggestionsModule = ({ suggestions }: SuggestionsModuleProps) => {
  const { theme } = useTheme()
  const router = useRouter()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥'
      case 'medium': return '⭐'
      case 'low': return '💡'
      default: return '📌'
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    switch (suggestion.type) {
      case 'category':
      case 'welcome':
      case 'frequency':
        router.push('/criar-conteudo')
        break
      default:
        break
    }
  }

  if (suggestions.length === 0) {
    return (
      <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          💡 Sugestões Inteligentes
        </h3>
        
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎉</div>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Você está indo muito bem! Continue criando conteúdo de qualidade.
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
        💡 Sugestões Inteligentes
      </h3>
      
      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => handleSuggestionClick(suggestion)}
            className={`w-full p-4 rounded-xl border transition-all duration-200 hover:shadow-md text-left ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                : `${getPriorityColor(suggestion.priority)} hover:shadow-lg`
            }`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-lg">{getPriorityIcon(suggestion.priority)}</span>
              <div className="flex-1">
                <h4 className={`font-semibold text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {suggestion.title}
                </h4>
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {suggestion.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}