'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'
import PostManagementService, { Post, PostFilters, PostSortOptions } from '@/lib/services/PostManagementService'

export default function MeuConteudoPage() {
  const { user } = useAuth()
  const { addToast } = useToast()
  
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNiche, setSelectedNiche] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent')
  const [hoveredPost, setHoveredPost] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Debounce para busca
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Buscar posts do usuário com paginação
  useEffect(() => {
    if (!user) return

    const loadPosts = async () => {
      try {
        setLoading(true)
        
        const filters: PostFilters = {
          searchTerm: debouncedSearchTerm,
          niche: selectedNiche,
          category: selectedCategory
        }

        const sortOptions: PostSortOptions = {
          field: 'createdAt',
          direction: sortBy === 'recent' ? 'desc' : 'asc'
        }

        // Carregar apenas os primeiros 20 posts
        const postsData = await PostManagementService.getUserPosts(
          user.uid,
          filters,
          sortOptions,
          20
        )
        
        setPosts(postsData)
        setHasMore(postsData.length === 20)
        setPage(1)
      } catch (error) {
        console.error('Erro ao carregar posts:', error)
        addToast({
          type: 'error',
          title: 'Erro',
          message: 'Não foi possível carregar seus posts'
        })
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [user, debouncedSearchTerm, selectedNiche, selectedCategory, sortBy, addToast])

  // Carregar mais posts
  const loadMorePosts = useCallback(async () => {
    if (!user || isLoadingMore || !hasMore) return

    try {
      setIsLoadingMore(true)
      
      const filters: PostFilters = {
        searchTerm: debouncedSearchTerm,
        niche: selectedNiche,
        category: selectedCategory
      }

      const sortOptions: PostSortOptions = {
        field: 'createdAt',
        direction: sortBy === 'recent' ? 'desc' : 'asc'
      }

      const lastPost = posts[posts.length - 1]
      const morePosts = await PostManagementService.getUserPosts(
        user.uid,
        filters,
        sortOptions,
        20,
        lastPost
      )
      
      if (morePosts.length < 20) {
        setHasMore(false)
      }
      
      setPosts(prev => [...prev, ...morePosts])
      setPage(prev => prev + 1)
    } catch (error) {
      console.error('Erro ao carregar mais posts:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [user, posts, debouncedSearchTerm, selectedNiche, selectedCategory, sortBy, isLoadingMore, hasMore])

  // Memoizar dados computados
  const uniqueNiches = useMemo(() => {
    return [...new Set(posts.map(post => post.niche))].sort()
  }, [posts])

  const uniqueCategories = useMemo(() => {
    return [...new Set(posts.map(post => post.category))].sort()
  }, [posts])

  // Otimizar função de cópia
  const copyText = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      addToast({
        type: 'success',
        title: 'Copiado!',
        message: 'Texto copiado para a área de transferência'
      })
    } catch (error) {
      console.error('Erro ao copiar:', error)
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível copiar o texto'
      })
    }
  }, [addToast])

  // Otimizar função de favoritar
  const toggleFavorite = useCallback(async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId)
      if (!post) return

      await PostManagementService.updatePost(postId, { isFavorite: !post.isFavorite })
      
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, isFavorite: !p.isFavorite } : p
      ))
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error)
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível atualizar o favorito'
      })
    }
  }, [posts, addToast])

  // Otimizar função de deletar
  const deletePost = useCallback(async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return

    try {
      await PostManagementService.deletePost(postId)
      setPosts(prev => prev.filter(p => p.id !== postId))
      
      addToast({
        type: 'success',
        title: 'Excluído',
        message: 'Post excluído com sucesso'
      })
    } catch (error) {
      console.error('Erro ao excluir post:', error)
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível excluir o post'
      })
    }
  }, [addToast])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meus Posts</h1>
              <p className="text-gray-600 mt-1">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} encontrados
              </p>
            </div>
          </div>

          {/* Filtros */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div>
              <input
                type="text"
                placeholder="Buscar posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Nicho */}
            <div>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos os nichos</option>
                {uniqueNiches.map(niche => (
                  <option key={niche} value={niche}>{niche}</option>
                ))}
              </select>
            </div>

            {/* Categoria */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas as categorias</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'oldest')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="recent">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum post encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedNiche || selectedCategory 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando seu primeiro post!'
              }
            </p>
            <a
              href="/criar-conteudo"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Primeiro Post
            </a>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  onMouseEnter={() => setHoveredPost(post.id)}
                  onMouseLeave={() => setHoveredPost(null)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {post.niche}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                        <span>
                          {post.createdAt?.toDate?.()?.toLocaleDateString('pt-BR') || 'Data não disponível'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(post.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          post.isFavorite 
                            ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                        title={post.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                      >
                        {post.isFavorite ? '❤️' : '🤍'}
                      </button>
                      
                      <button
                        onClick={() => copyText(post.generatedContent)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Copiar texto"
                      >
                        📋
                      </button>
                      
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir post"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {post.generatedContent}
                    </p>
                  </div>
                  
                  {post.imageUrl && (
                    <div className="mt-4">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Botão Carregar Mais */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMorePosts}
                  disabled={isLoadingMore}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Carregando...
                    </>
                  ) : (
                    'Carregar Mais Posts'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}