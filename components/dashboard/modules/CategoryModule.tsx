'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'

interface CategoryModuleProps {
  categories: { name: string; count: number; color: string }[]
}

export const CategoryModule = ({ categories }: CategoryModuleProps) => {
  const { theme } = useTheme()
  
  const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0)
  
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
          🎯 Conteúdo por Categoria
        </h3>
        <span className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {totalCount} total
        </span>
      </div>
      
      <div className="space-y-3">
        {categories.map((category, index) => {
          const percentage = totalCount > 0 ? (category.count / totalCount) * 100 : 0
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {category.name}
                </span>
                <span className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {category.count}
                </span>
              </div>
              <div className={`w-full rounded-full h-2 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    category.color === 'blue' 
                      ? theme === 'dark' 
                        ? 'bg-blue-500' 
                        : 'bg-blue-400'
                      : category.color === 'green'
                        ? theme === 'dark'
                          ? 'bg-green-500'
                          : 'bg-green-400'
                        : category.color === 'purple'
                          ? theme === 'dark'
                            ? 'bg-purple-500'
                            : 'bg-purple-400'
                          : theme === 'dark'
                            ? 'bg-orange-500'
                            : 'bg-orange-400'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            Categoria mais usada:
          </span>
          <span className={`font-semibold ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            {categories.reduce((max, cat) => cat.count > max.count ? cat : max, categories[0])?.name}
          </span>
        </div>
      </div>
    </div>
  )
}
