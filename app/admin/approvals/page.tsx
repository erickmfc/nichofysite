'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminAuthService } from '@/lib/services/AdminAuthService'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, orderBy, limit, updateDoc, doc } from 'firebase/firestore'

interface Post {
  id: string
  title: string
  content: string
  category: string
  userId: string
  userName: string
  userEmail: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

export default function AdminApprovalsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [processingPost, setProcessingPost] = useState<string | null>(null)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const admin = await AdminAuthService.getCurrentAdmin()
      if (admin) {
        setIsAuthenticated(true)
        loadPosts()
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação admin:', error)
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const loadPosts = async () => {
    try {
      setPostsLoading(true)
      
      // Buscar posts do Firestore
      const postsQuery = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(100)
      )
      
      const postsSnapshot = await getDocs(postsQuery)
      const postsData = await Promise.all(
        postsSnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data()
          
          // Buscar dados do usuário
          let userName = 'Usuário'
          let userEmail = 'email@exemplo.com'
          
          try {
            const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', data.userId)))
            if (!userDoc.empty) {
              const userData = userDoc.docs[0].data()
              userName = userData.name || userData.displayName || 'Usuário'
              userEmail = userData.email || 'email@exemplo.com'
            }
          } catch (error) {
            console.log('Erro ao buscar dados do usuário:', error)
          }

          return {
            id: docSnapshot.id,
            title: data.title || 'Sem título',
            content: data.content || '',
            category: data.category || 'Geral',
            userId: data.userId,
            userName,
            userEmail,
            status: data.status || 'pending',
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date()
          }
        })
      )

      setPosts(postsData)
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
    } finally {
      setPostsLoading(false)
    }
  }

  const handleApprovePost = async (postId: string) => {
    try {
      setProcessingPost(postId)
      
      // Atualizar status do post no Firestore
      await updateDoc(doc(db, 'posts', postId), {
        status: 'approved',
        updatedAt: new Date()
      })

      // Atualizar lista local
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, status: 'approved' as const } : post
      ))

      console.log('Post aprovado:', postId)
    } catch (error) {
      console.error('Erro ao aprovar post:', error)
    } finally {
      setProcessingPost(null)
    }
  }

  const handleRejectPost = async (postId: string) => {
    try {
      setProcessingPost(postId)
      
      // Atualizar status do post no Firestore
      await updateDoc(doc(db, 'posts', postId), {
        status: 'rejected',
        updatedAt: new Date()
      })

      // Atualizar lista local
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, status: 'rejected' as const } : post
      ))

      console.log('Post rejeitado:', postId)
    } catch (error) {
      console.error('Erro ao rejeitar post:', error)
    } finally {
      setProcessingPost(null)
    }
  }

  const handleLogout = async () => {
    await AdminAuthService.logout()
    router.push('/admin/login')
  }

  const filteredPosts = posts.filter(post => 
    filter === 'all' || post.status === filter
  )

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'agora'
    if (diffInMinutes < 60) return `há ${diffInMinutes} min`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `há ${diffInHours}h`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `há ${diffInDays} dias`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente'
      case 'approved': return 'Aprovado'
      case 'rejected': return 'Rejeitado'
      default: return 'Desconhecido'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">NichoFy Admin</h2>
          <p className="text-gray-400">Carregando aprovações...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">A</span>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-white">NichoFy Admin</h1>
                <p className="text-gray-400">Sistema de Aprovações</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="/admin" className="text-gray-400 hover:text-white py-4 px-1">
              Dashboard
            </a>
            <a href="/admin/users" className="text-gray-400 hover:text-white py-4 px-1">
              Usuários
            </a>
            <a href="/admin/content" className="text-gray-400 hover:text-white py-4 px-1">
              Conteúdo
            </a>
            <a href="/admin/approvals" className="text-white border-b-2 border-blue-500 py-4 px-1">
              Aprovações
            </a>
            <a href="/admin/settings" className="text-gray-400 hover:text-white py-4 px-1">
              Configurações
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header com filtros */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Posts para Aprovação</h2>
            <p className="text-gray-400">
              {filteredPosts.length} posts • 
              {posts.filter(p => p.status === 'pending').length} pendentes
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Pendentes</option>
              <option value="approved">Aprovados</option>
              <option value="rejected">Rejeitados</option>
              <option value="all">Todos</option>
            </select>
            <button
              onClick={loadPosts}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Atualizar
            </button>
          </div>
        </div>

        {/* Lista de posts */}
        <div className="space-y-4">
          {postsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-400">Carregando posts...</span>
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                      <span>👤 {post.userName}</span>
                      <span>📧 {post.userEmail}</span>
                      <span>🏷️ {post.category}</span>
                      <span>📅 {getTimeAgo(post.createdAt)}</span>
                    </div>
                    <p className="text-gray-300 line-clamp-3">{post.content}</p>
                  </div>
                  <div className="ml-4">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(post.status)}`}>
                      {getStatusText(post.status)}
                    </span>
                  </div>
                </div>
                
                {post.status === 'pending' && (
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => handleRejectPost(post.id)}
                      disabled={processingPost === post.id}
                      className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {processingPost === post.id ? 'Processando...' : 'Rejeitar'}
                    </button>
                    <button
                      onClick={() => handleApprovePost(post.id)}
                      disabled={processingPost === post.id}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {processingPost === post.id ? 'Processando...' : 'Aprovar'}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhum post encontrado</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
