'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToastNotifications } from '@/components/ui/Toast'
import PostManagementService, { Post, PostFilters, PostSortOptions } from '@/lib/services/PostManagementService'


export default function MeuConteudoPage() {
  const { user } = useAuth()
  const { showToast } = useToastNotifications()
  
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNiche, setSelectedNiche] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent')
  const [hoveredPost, setHoveredPost] = useState<string | null>(null)

  // Buscar posts do usuário
  useEffect(() => {
    if (!user) return

    const filters: PostFilters = {
      searchTerm,
      niche: selectedNiche,
      category: selectedCategory
    }

    const sortOptions: PostSortOptions = {
      field: 'createdAt',
      direction: sortBy === 'recent' ? 'desc' : 'asc'
    }

    const unsubscribe = PostManagementService.subscribeToUserPosts(
      user.uid,
      (postsData) => {
        setPosts(postsData)
        setLoading(false)
      },
      filters,
      sortOptions
    )

    return () => unsubscribe()
  }, [user, searchTerm, selectedNiche, selectedCategory, sortBy])

  // Os posts já vêm filtrados do serviço
  const filteredPosts = posts

  // Obter nichos únicos
  const uniqueNiches = useMemo(() => {
    return [...new Set(posts.map(post => post.niche))].sort()
  }, [posts])

  // Obter categorias únicas
  const uniqueCategories = useMemo(() => {
    return [...new Set(posts.map(post => post.category))].sort()
  }, [posts])

  // Copiar texto
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast('Texto copiado para a área de transferência!', 'success')
    } catch (error) {
      showToast('Erro ao copiar texto', 'error')
    }
  }

  // Baixar imagem
  const downloadImage = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      showToast('Imagem baixada com sucesso!', 'success')
    } catch (error) {
      showToast('Erro ao baixar imagem', 'error')
    }
  }

  // Marcar como favorito
  const toggleFavorite = async (postId: string, isFavorite: boolean) => {
    try {
      await PostManagementService.toggleFavorite(postId, isFavorite)
      showToast(isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos!', 'success')
    } catch (error) {
      showToast('Erro ao atualizar favorito', 'error')
    }
  }

  // Excluir post
  const deletePost = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return
    
    try {
      await PostManagementService.deletePost(postId)
      showToast('Post excluído com sucesso!', 'success')
    } catch (error) {
      showToast('Erro ao excluir post', 'error')
    }
  }

  // Formatar data
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Data não disponível'
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Criado hoje'
    if (diffDays === 2) return 'Criado ontem'
    if (diffDays <= 7) return `Criado há ${diffDays - 1} dias`
    
    return date.toLocaleDateString('pt-BR')
  }

  // Cores para categorias
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Promoção': 'bg-red-100 text-red-800 border-red-200',
      'Dicas': 'bg-blue-100 text-blue-800 border-blue-200',
      'Educativo': 'bg-green-100 text-green-800 border-green-200',
      'Entretenimento': 'bg-purple-100 text-purple-800 border-purple-200',
      'Notícias': 'bg-orange-100 text-orange-800 border-orange-200',
      'Inspiração': 'bg-pink-100 text-pink-800 border-pink-200'
    }
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Cores para nichos
  const getNicheColor = (niche: string) => {
    const colors: { [key: string]: string } = {
      'Direito': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Gastronomia': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Tecnologia': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Saúde': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Educação': 'bg-violet-100 text-violet-800 border-violet-200',
      'Negócios': 'bg-slate-100 text-slate-800 border-slate-200'
    }
    return colors[niche] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seu conteúdo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meu Conteúdo</h1>
              <p className="text-gray-600 mt-1">Gerencie e organize todos os seus posts criados</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
              <div className="text-sm text-gray-500">Posts criados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Ferramentas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Busca */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔎 Buscar conteúdo
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título, texto ou prompt..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Filtro por Nicho */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nicho
              </label>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Todos os nichos</option>
                {uniqueNiches.map(niche => (
                  <option key={niche} value={niche}>{niche}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Todas as categorias</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Ordenar por */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'oldest')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="recent">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
              </select>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div>
                <span className="font-medium">{filteredPosts.length}</span> posts encontrados
              </div>
              <div>
                <span className="font-medium">{posts.filter(p => p.isFavorite).length}</span> favoritos
              </div>
              <div>
                <span className="font-medium">{uniqueNiches.length}</span> nichos diferentes
              </div>
              <div>
                <span className="font-medium">{uniqueCategories.length}</span> categorias
              </div>
            </div>
          </div>
        </div>

        {/* Galeria de Posts */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {posts.length === 0 ? 'Nenhum conteúdo criado ainda' : 'Nenhum post encontrado'}
            </h3>
            <p className="text-gray-600 mb-6">
              {posts.length === 0 
                ? 'Comece criando seu primeiro post no dashboard!' 
                : 'Tente ajustar os filtros para encontrar o que procura.'
              }
            </p>
            {posts.length === 0 && (
              <a
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Criar Primeiro Post
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                onMouseEnter={() => setHoveredPost(post.id)}
                onMouseLeave={() => setHoveredPost(null)}
              >
                {/* Imagem */}
                <div className="relative h-48 bg-gray-100">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-4xl">🖼️</div>
                    </div>
                  )}
                  
                  {/* Overlay de ações */}
                  {hoveredPost === post.id && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyText(post.generatedContent)}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                          title="Copiar texto"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => downloadImage(post.imageUrl, post.title)}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                          title="Baixar imagem"
                        >
                          🖼️
                        </button>
                        <button
                          onClick={() => toggleFavorite(post.id, post.isFavorite)}
                          className={`p-2 rounded-full transition-colors ${
                            post.isFavorite 
                              ? 'bg-yellow-400 hover:bg-yellow-500' 
                              : 'bg-white hover:bg-gray-100'
                          }`}
                          title={post.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        >
                          ⭐
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-2 bg-white rounded-full hover:bg-red-100 transition-colors"
                          title="Excluir post"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getNicheColor(post.niche)}`}>
                      {post.niche}
                    </span>
                  </div>

                  {/* Título */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Trecho do texto */}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                    {post.generatedContent}
                  </p>

                  {/* Data */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(post.createdAt)}</span>
                    {post.isFavorite && (
                      <span className="text-yellow-500">⭐</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}