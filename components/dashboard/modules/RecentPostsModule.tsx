'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'
import { Button } from '@/components/ui/Button'

interface RecentPostsModuleProps {
  posts: {
    id: string
    title: string
    content: string
    createdAt: string
    category: string
    image?: string
  }[]
}

export const RecentPostsModule = ({ posts }: RecentPostsModuleProps) => {
  const { theme } = useTheme()

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
          📝 Posts Recentes
        </h3>
        <Button
          onClick={() => {/* Navigate to history */}}
          className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Ver Todos
        </Button>
      </div>
      
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className={`p-4 rounded-xl transition-all duration-200 hover:shadow-md ${
            theme === 'dark'
              ? 'bg-gray-700 border border-gray-600'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-start space-x-3">
              {post.image && (
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">
                    📸
                  </div>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-medium truncate ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {post.title}
                  </h4>
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {post.createdAt}
                  </span>
                </div>
                <p className={`text-sm mt-1 line-clamp-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {post.content}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    theme === 'dark'
                      ? 'bg-blue-900 text-blue-300'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {post.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                    }`}>
                      👁️ Ver
                    </button>
                    <button className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                    }`}>
                      ✏️ Editar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📝</div>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Nenhum post criado ainda
          </p>
          <p className={`text-xs mt-1 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Comece criando seu primeiro conteúdo!
          </p>
        </div>
      )}
    </div>
  )
}
