'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'
import { Button } from '@/components/ui/Button'

interface SuggestionsModuleProps {
  suggestions: {
    id: string
    time: string
    title: string
    description: string
    type: 'post' | 'story' | 'reel'
    priority: 'high' | 'medium' | 'low'
  }[]
}

export const SuggestionsModule = ({ suggestions }: SuggestionsModuleProps) => {
  const { theme } = useTheme()

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return '📝'
      case 'story': return '📱'
      case 'reel': return '🎬'
      default: return '📝'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'
      case 'medium':
        return theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
      case 'low':
        return theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
      default:
        return theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
    }
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
          💡 Sugestões para Hoje
        </h3>
        <Button
          onClick={() => {/* Generate new suggestions */}}
          className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔄 Atualizar
        </Button>
      </div>
      
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div key={suggestion.id} className={`p-4 rounded-xl transition-all duration-200 hover:shadow-md ${
            theme === 'dark'
              ? 'bg-gray-700 border border-gray-600'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  {getTypeIcon(suggestion.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {suggestion.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(suggestion.priority)}`}>
                      {suggestion.priority === 'high' ? '🔥' : suggestion.priority === 'medium' ? '⚡' : '💡'}
                    </span>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {suggestion.time}
                    </span>
                  </div>
                </div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {suggestion.description}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {suggestion.type.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => {/* Use suggestion */}}
                      className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200"
                    >
                      ✨ Usar
                    </Button>
                    <button className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                    }`}>
                      ❌ Dispensar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {suggestions.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">💡</div>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Gerando sugestões personalizadas...
          </p>
          <p className={`text-xs mt-1 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Baseadas no seu nicho e tendências
          </p>
        </div>
      )}
    </div>
  )
}
