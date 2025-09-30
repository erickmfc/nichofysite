'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'

interface CategoryModuleProps {
  categories: Record<string, number>
}

export const CategoryModule = ({ categories }: CategoryModuleProps) => {
  const { theme } = useTheme()

  const sortedCategories = Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Instagram': '📸',
      'Facebook': '👥',
      'LinkedIn': '💼',
      'Twitter': '🐦',
      'TikTok': '🎵',
      'YouTube': '📺',
      'WhatsApp': '💬',
      'Telegram': '✈️',
      'Pinterest': '📌',
      'Snapchat': '👻',
      'Dicas': '💡',
      'Promoção': '🎯',
      'Educativo': '📚',
      'Entretenimento': '🎭',
      'Inspiracional': '✨',
      'Notícias': '📰'
    }
    return icons[category] || '📱'
  }

  const getCategoryColor = (index: number) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500'
    ]
    return colors[index % colors.length]
  }

  if (sortedCategories.length === 0) {
    return (
      <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          📊 Categorias Mais Usadas
        </h3>
        
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📝</div>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Crie posts para ver suas categorias mais usadas aqui.
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
        📊 Categorias Mais Usadas
      </h3>
      
      <div className="space-y-3">
        {sortedCategories.map(([category, count], index) => (
          <div
            key={category}
            className={`p-3 rounded-xl bg-gradient-to-r ${getCategoryColor(index)} text-white transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getCategoryIcon(category)}</span>
                <span className="font-semibold text-sm">{category}</span>
              </div>
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-bold">
                {count}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className={`mt-4 p-3 rounded-lg ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <p className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          💡 Baseado nos seus posts mais recentes
        </p>
      </div>
    </div>
  )
}