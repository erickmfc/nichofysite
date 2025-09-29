'use client'

import { useState } from 'react'
import { Post } from '@/hooks/usePosts'
import { Timestamp } from 'firebase/firestore'

interface PostCardProps {
  post: Post
  onToggleFavorite: (postId: string) => void
  onDelete: (postId: string) => void
  onCopyText: (content: string) => void
  onDownloadImage: (imageUrl: string, title: string) => void
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onToggleFavorite,
  onDelete,
  onCopyText,
  onDownloadImage
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate()
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Hoje'
    if (diffInDays === 1) return 'Ontem'
    if (diffInDays < 7) return `Há ${diffInDays} dias`
    return date.toLocaleDateString('pt-BR')
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Promoção': 'bg-red-500',
      'Dicas': 'bg-blue-500',
      'Educativo': 'bg-green-500',
      'Entretenimento': 'bg-purple-500',
      'Notícias': 'bg-orange-500',
      'Inspiração': 'bg-pink-500'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-500'
  }

  const getNicheColor = (niche: string) => {
    const colors = {
      'Direito': 'bg-blue-600',
      'Gastronomia': 'bg-orange-600',
      'Saúde': 'bg-green-600',
      'Tecnologia': 'bg-purple-600',
      'Educação': 'bg-indigo-600',
      'Negócios': 'bg-gray-600'
    }
    return colors[niche as keyof typeof colors] || 'bg-gray-600'
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagem do Post */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <span className="text-4xl mb-2 block">🖼️</span>
              <span className="text-sm">Sem imagem</span>
            </div>
          </div>
        )}
        
        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <span className={`px-2 py-1 text-white text-xs rounded-full ${getNicheColor(post.niche)}`}>
            {post.niche}
          </span>
          <span className={`px-2 py-1 text-white text-xs rounded-full ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
        </div>

        {/* Favorito */}
        <button
          onClick={() => onToggleFavorite(post.id)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            post.isFavorite 
              ? 'bg-yellow-500 text-white shadow-lg' 
              : 'bg-white/80 text-gray-600 hover:bg-yellow-500 hover:text-white hover:shadow-lg'
          }`}
          title={post.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          ⭐
        </button>

        {/* Overlay de ações */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex gap-2">
              <button
                onClick={() => onCopyText(post.generatedContent)}
                className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 transform hover:scale-110"
                title="Copiar texto"
              >
                📋
              </button>
              <button
                onClick={() => onDownloadImage(post.imageUrl, post.title)}
                className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200 transform hover:scale-110"
                title="Baixar imagem"
              >
                🖼️
              </button>
              <button
                onClick={() => onDelete(post.id)}
                className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 transform hover:scale-110"
                title="Excluir post"
              >
                🗑️
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo do Card */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg">
          {post.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-3 leading-relaxed">
          {post.generatedContent}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            📅 {formatDate(post.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            📝 {post.generatedContent.length} chars
          </span>
        </div>

        {/* Barra de progresso visual */}
        <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((post.generatedContent.length / 500) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Indicador de favorito */}
      {post.isFavorite && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">⭐</span>
        </div>
      )}
    </div>
  )
}
