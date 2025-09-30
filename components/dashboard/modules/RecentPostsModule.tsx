'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'
import { useRouter } from 'next/navigation'

interface RecentPost {
  id: string
  title: string
  content: string
  createdAt: string
  category: string
  niche: string
  image?: string
}

interface RecentPostsModuleProps {
  posts: RecentPost[]
}

export const RecentPostsModule = ({ posts }: RecentPostsModuleProps) => {
  const { theme } = useTheme()
  const router = useRouter()

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
      'Snapchat': '👻'
    }
    return icons[category] || '📱'
  }

  const getNicheColor = (niche: string) => {
    const colors: Record<string, string> = {
      'Direito': 'bg-blue-100 text-blue-800',
      'Saúde & Bem-Estar': 'bg-green-100 text-green-800',
      'Tecnologia': 'bg-purple-100 text-purple-800',
      'Gastronomia': 'bg-orange-100 text-orange-800',
      'Beleza & Estética': 'bg-pink-100 text-pink-800',
      'Marketing & Publicidade': 'bg-indigo-100 text-indigo-800',
      'Psicologia & Saúde Mental': 'bg-violet-100 text-violet-800',
      'Odontologia': 'bg-cyan-100 text-cyan-800',
      'Farmácia & Medicamentos': 'bg-red-100 text-red-800'
    }
    return colors[niche] || 'bg-gray-100 text-gray-800'
  }

  if (posts.length === 0) {
    return (
      <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          📝 Posts Recentes
        </h3>
        
        <div className="text-center py-8">
          <div className="text-4xl mb-4">✨</div>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Você ainda não criou nenhum post. Que tal começar agora?
          </p>
          <button
            onClick={() => router.push('/criar-conteudo')}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
          >
            Criar Primeiro Post
          </button>
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
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          📝 Posts Recentes
        </h3>
        <button
          onClick={() => router.push('/meu-conteudo')}
          className={`text-sm ${
            theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          } transition-colors`}
        >
          Ver todos →
        </button>
      </div>
      
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
            onClick={() => router.push('/meu-conteudo')}
          >
            <div className="flex items-start space-x-3">
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {post.title}
                </h4>
                
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {post.content}
                </p>
                
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getNicheColor(post.niche)}`}>
                    {post.niche}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {getCategoryIcon(post.category)} {post.category}
                  </span>
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {post.createdAt}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}