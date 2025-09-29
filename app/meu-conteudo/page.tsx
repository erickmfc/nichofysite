'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  category: string
  status: 'draft' | 'published' | 'scheduled'
  createdAt: Date
  updatedAt: Date
}

export default function MeuConteudoPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'scheduled'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadPosts()
    }
  }, [user])

  const loadPosts = async () => {
    setIsLoading(true)
    // TODO: Buscar posts reais do Firebase
    const mockPosts: Post[] = [
      {
        id: '1',
        title: 'Tutorial sobre React Hooks',
        content: 'Neste tutorial, vamos aprender sobre os principais hooks do React...',
        category: 'tecnologia',
        status: 'published',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        title: '5 Dicas para Melhorar Produtividade',
        content: 'Aqui estão 5 dicas práticas para aumentar sua produtividade...',
        category: 'produtividade',
        status: 'draft',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '3',
        title: 'Case de Sucesso: Como Aumentei as Vendas em 300%',
        content: 'Neste case, vou compartilhar como consegui aumentar as vendas...',
        category: 'marketing',
        status: 'scheduled',
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22')
      }
    ]
    
    setTimeout(() => {
      setPosts(mockPosts)
      setIsLoading(false)
    }, 1000)
  }

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.status === filter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado'
      case 'draft': return 'Rascunho'
      case 'scheduled': return 'Agendado'
      default: return 'Desconhecido'
    }
  }

  const handleDeletePost = (postId: string) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      setPosts(posts.filter(post => post.id !== postId))
      // TODO: Deletar do Firebase
    }
  }

  if (loading || isLoading) {
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meu Conteúdo</h1>
              <p className="text-gray-600">Gerencie todos os seus posts</p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/dashboard"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                ← Voltar ao Dashboard
              </Link>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                + Novo Post
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'Todos', count: posts.length },
            { key: 'draft', label: 'Rascunhos', count: posts.filter(p => p.status === 'draft').length },
            { key: 'published', label: 'Publicados', count: posts.filter(p => p.status === 'published').length },
            { key: 'scheduled', label: 'Agendados', count: posts.filter(p => p.status === 'scheduled').length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Posts */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'Nenhum post criado ainda' : `Nenhum post ${getStatusText(filter).toLowerCase()}`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Comece criando seu primeiro post para ver ele aqui.'
                : `Você não tem posts com status "${getStatusText(filter).toLowerCase()}" ainda.`
              }
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
              Criar Primeiro Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                    {post.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                    {getStatusText(post.status)}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>📁 {post.category}</span>
                  <span>📅 {post.createdAt.toLocaleDateString('pt-BR')}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors">
                    Editar
                  </button>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm transition-colors">
                    {post.status === 'draft' ? 'Publicar' : 'Ver'}
                  </button>
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}