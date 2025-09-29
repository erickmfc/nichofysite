'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePosts } from '@/hooks/usePosts'
import { ResponsiveTemplate } from '@/components/ui/ResponsiveTemplate'
import { SearchToolbar } from '@/components/ui/SearchToolbar'
import { PostCard } from '@/components/ui/PostCard'

export default function MeuConteudoPage() {
  const { user } = useAuth()
  const { posts, loading, deletePost, toggleFavorite, getStats } = usePosts(user?.uid || '')
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNiche, setSelectedNiche] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent')

  // Filtrar e ordenar posts
  const filteredPosts = useMemo(() => {
    let filtered = posts

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.generatedContent.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por nicho
    if (selectedNiche) {
      filtered = filtered.filter(post => post.niche === selectedNiche)
    }

    // Filtro por categoria
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Ordenação
    if (sortBy === 'oldest') {
      filtered = [...filtered].reverse()
    }

    return filtered
  }, [posts, searchTerm, selectedNiche, selectedCategory, sortBy])

  // Obter estatísticas
  const stats = getStats()

  // Ações dos cards
  const copyText = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      alert('Texto copiado para a área de transferência!')
    } catch (error) {
      console.error('Erro ao copiar texto:', error)
    }
  }

  const downloadImage = (imageUrl: string, title: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return
    try {
      await deletePost(postId)
      alert('Post excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir post:', error)
    }
  }

  if (loading) {
    return (
      <ResponsiveTemplate title="Meu Conteúdo" subtitle="Carregando seus posts..." colorScheme="primary">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </ResponsiveTemplate>
    )
  }

  return (
    <ResponsiveTemplate title="Meu Conteúdo" subtitle="Sua biblioteca pessoal de posts criados" colorScheme="primary">
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Barra de Ferramentas */}
          <SearchToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedNiche={selectedNiche}
            onNicheChange={setSelectedNiche}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            niches={stats.niches}
            categories={stats.categories}
            stats={{
              total: stats.total,
              favorites: stats.favorites,
              showing: filteredPosts.length
            }}
          />

          {/* Galeria de Posts */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {posts.length === 0 ? 'Nenhum post criado ainda' : 'Nenhum post encontrado'}
              </h3>
              <p className="text-gray-500 mb-6">
                {posts.length === 0 
                  ? 'Comece criando seu primeiro post no dashboard!'
                  : 'Tente ajustar os filtros de busca.'
                }
              </p>
              <a
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🚀 Criar Primeiro Post
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onToggleFavorite={toggleFavorite}
                  onDelete={handleDeletePost}
                  onCopyText={copyText}
                  onDownloadImage={downloadImage}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ResponsiveTemplate>
  )
}
