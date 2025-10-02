'use client'

import { useState, useEffect } from 'react'
import { useAdminRealData } from '@/hooks/useAdminRealData'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, orderBy, limit, updateDoc, doc, deleteDoc } from 'firebase/firestore'

interface Post {
  id: string
  title: string
  content: string
  category: string
  author: {
    id: string
    name: string
    email: string
  }
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  createdAt: Date
  updatedAt?: Date
  rejectionReason?: string
  moderationNotes?: string
  flags?: Array<{
    reason: string
    reportedBy: string
    reportedAt: Date
  }>
  metrics: {
    likes: number
    shares: number
    comments: number
    views: number
  }
  tags: string[]
  imageUrl?: string
}

interface ModerationRule {
  id: string
  name: string
  description: string
  type: 'content' | 'spam' | 'inappropriate' | 'copyright'
  conditions: Array<{
    field: string
    operator: 'contains' | 'equals' | 'regex' | 'length'
    value: string
  }>
  action: 'auto_approve' | 'auto_reject' | 'flag_for_review' | 'send_to_queue'
  isActive: boolean
  priority: number
}

interface ModerationQueue {
  id: string
  postId: string
  reason: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedTo?: string
  createdAt: Date
  status: 'pending' | 'in_review' | 'resolved'
}

export const ModerationSystem = () => {
  const { stats } = useAdminRealData()
  const [posts, setPosts] = useState<Post[]>([])
  const [moderationRules, setModerationRules] = useState<ModerationRule[]>([])
  const [moderationQueue, setModerationQueue] = useState<ModerationQueue[]>([])
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    search: ''
  })
  const [activeTab, setActiveTab] = useState<'queue' | 'posts' | 'rules' | 'analytics'>('queue')
  const [isLoading, setIsLoading] = useState(true)
  const [showBulkActions, setShowBulkActions] = useState(false)

  useEffect(() => {
    loadModerationData()
  }, [])

  const loadModerationData = async () => {
    try {
      setIsLoading(true)
      
      // Buscar posts do Firestore
      const postsSnapshot = await getDocs(query(collection(db, 'posts')))
      const postsData = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
        updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : undefined,
        author: doc.data().author || { id: 'unknown', name: 'Usuário', email: 'user@example.com' },
        metrics: doc.data().metrics || { likes: 0, shares: 0, comments: 0, views: 0 },
        tags: doc.data().tags || [],
        flags: doc.data().flags || []
      })) as Post[]

      setPosts(postsData)
      
      // Carregar regras de moderação
      loadModerationRules()
      
      // Carregar fila de moderação
      loadModerationQueue(postsData)
      
    } catch (error) {
      console.error('Erro ao carregar dados de moderação:', error)
      // Fallback para dados mockados
      setPosts(generateMockPosts())
      loadModerationRules()
      loadModerationQueue(generateMockPosts())
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockPosts = (): Post[] => {
    const mockPosts: Post[] = []
    const categories = ['Tecnologia', 'Saúde', 'Finanças', 'Educação', 'Entretenimento']
    const statuses: Post['status'][] = ['pending', 'approved', 'rejected', 'flagged']
    
    for (let i = 1; i <= 30; i++) {
      mockPosts.push({
        id: `post-${i}`,
        title: `Post de Exemplo ${i}`,
        content: `Este é o conteúdo do post ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        category: categories[Math.floor(Math.random() * categories.length)],
        author: {
          id: `user-${i}`,
          name: `Usuário ${i}`,
          email: `user${i}@example.com`
        },
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        updatedAt: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) : undefined,
        rejectionReason: Math.random() > 0.7 ? 'Conteúdo inadequado' : undefined,
        moderationNotes: Math.random() > 0.8 ? 'Revisar conteúdo' : undefined,
        flags: Math.random() > 0.8 ? [{
          reason: 'Spam',
          reportedBy: 'user-report',
          reportedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
        }] : [],
        metrics: {
          likes: Math.floor(Math.random() * 100),
          shares: Math.floor(Math.random() * 50),
          comments: Math.floor(Math.random() * 20),
          views: Math.floor(Math.random() * 1000)
        },
        tags: [`tag${i}`, `categoria${i}`],
        imageUrl: Math.random() > 0.5 ? `https://picsum.photos/400/300?random=${i}` : undefined
      })
    }
    return mockPosts
  }

  const loadModerationRules = () => {
    const mockRules: ModerationRule[] = [
      {
        id: '1',
        name: 'Detecção de Spam',
        description: 'Detecta posts com características de spam',
        type: 'spam',
        conditions: [
          { field: 'content', operator: 'length', value: '10' },
          { field: 'content', operator: 'contains', value: 'promoção' }
        ],
        action: 'flag_for_review',
        isActive: true,
        priority: 1
      },
      {
        id: '2',
        name: 'Conteúdo Inadequado',
        description: 'Detecta linguagem inadequada ou ofensiva',
        type: 'inappropriate',
        conditions: [
          { field: 'content', operator: 'contains', value: 'palavrão' }
        ],
        action: 'auto_reject',
        isActive: true,
        priority: 2
      },
      {
        id: '3',
        name: 'Posts Curtos',
        description: 'Aprova automaticamente posts muito curtos',
        type: 'content',
        conditions: [
          { field: 'content', operator: 'length', value: '50' }
        ],
        action: 'auto_approve',
        isActive: true,
        priority: 3
      }
    ]
    setModerationRules(mockRules)
  }

  const loadModerationQueue = (postsData: Post[]) => {
    const flaggedPosts = postsData.filter(post => post.status === 'flagged' || post.flags.length > 0)
    const queueItems: ModerationQueue[] = flaggedPosts.map(post => ({
      id: `queue-${post.id}`,
      postId: post.id,
      reason: post.flags[0]?.reason || 'Conteúdo reportado',
      priority: post.flags.length > 2 ? 'critical' : 'high',
      createdAt: post.flags[0]?.reportedAt || post.createdAt,
      status: 'pending' as const
    }))
    setModerationQueue(queueItems)
  }

  const approvePost = async (postId: string) => {
    try {
      await updateDoc(doc(db, 'posts', postId), {
        status: 'approved',
        updatedAt: new Date(),
        moderationNotes: 'Aprovado pelo moderador'
      })
      
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, status: 'approved', updatedAt: new Date() } : post
      ))
      
      // Remover da fila de moderação
      setModerationQueue(prev => prev.filter(item => item.postId !== postId))
      
    } catch (error) {
      console.error('Erro ao aprovar post:', error)
    }
  }

  const rejectPost = async (postId: string, reason: string) => {
    try {
      await updateDoc(doc(db, 'posts', postId), {
        status: 'rejected',
        rejectionReason: reason,
        updatedAt: new Date(),
        moderationNotes: 'Rejeitado pelo moderador'
      })
      
      setPosts(prev => prev.map(post => 
        post.id === postId ? { 
          ...post, 
          status: 'rejected', 
          rejectionReason: reason,
          updatedAt: new Date() 
        } : post
      ))
      
      // Remover da fila de moderação
      setModerationQueue(prev => prev.filter(item => item.postId !== postId))
      
    } catch (error) {
      console.error('Erro ao rejeitar post:', error)
    }
  }

  const flagPost = async (postId: string, reason: string) => {
    try {
      const post = posts.find(p => p.id === postId)
      if (!post) return

      const newFlag = {
        reason,
        reportedBy: 'moderator',
        reportedAt: new Date()
      }

      await updateDoc(doc(db, 'posts', postId), {
        status: 'flagged',
        flags: [...(post.flags || []), newFlag],
        updatedAt: new Date()
      })
      
      setPosts(prev => prev.map(p => 
        p.id === postId ? { 
          ...p, 
          status: 'flagged',
          flags: [...(p.flags || []), newFlag],
          updatedAt: new Date()
        } : p
      ))
      
      // Adicionar à fila de moderação
      const queueItem: ModerationQueue = {
        id: `queue-${postId}`,
        postId,
        reason,
        priority: 'medium',
        createdAt: new Date(),
        status: 'pending'
      }
      setModerationQueue(prev => [queueItem, ...prev])
      
    } catch (error) {
      console.error('Erro ao marcar post:', error)
    }
  }

  const deletePost = async (postId: string) => {
    if (confirm('Tem certeza que deseja excluir este post permanentemente?')) {
      try {
        await deleteDoc(doc(db, 'posts', postId))
        setPosts(prev => prev.filter(post => post.id !== postId))
        setModerationQueue(prev => prev.filter(item => item.postId !== postId))
      } catch (error) {
        console.error('Erro ao excluir post:', error)
      }
    }
  }

  const executeBulkAction = async (action: 'approve' | 'reject' | 'flag' | 'delete') => {
    if (selectedPosts.length === 0) return

    try {
      switch (action) {
        case 'approve':
          await Promise.all(selectedPosts.map(id => approvePost(id)))
          break
        case 'reject':
          const reason = prompt('Motivo da rejeição:') || 'Sem motivo especificado'
          await Promise.all(selectedPosts.map(id => rejectPost(id, reason)))
          break
        case 'flag':
          const flagReason = prompt('Motivo da marcação:') || 'Conteúdo suspeito'
          await Promise.all(selectedPosts.map(id => flagPost(id, flagReason)))
          break
        case 'delete':
          if (confirm(`Tem certeza que deseja excluir ${selectedPosts.length} posts?`)) {
            await Promise.all(selectedPosts.map(id => deletePost(id)))
          }
          break
      }
      
      setSelectedPosts([])
      setShowBulkActions(false)
    } catch (error) {
      console.error('Erro ao executar ação em lote:', error)
    }
  }

  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const filteredPosts = posts.filter(post => {
    if (filters.status !== 'all' && post.status !== filters.status) return false
    if (filters.category !== 'all' && post.category !== filters.category) return false
    if (filters.search && !post.title.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const PostCard = ({ post }: { post: Post }) => (
    <div className={`bg-gray-800 rounded-xl p-6 border transition-colors ${
      selectedPosts.includes(post.id) ? 'border-blue-500' : 'border-gray-700'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            checked={selectedPosts.includes(post.id)}
            onChange={() => togglePostSelection(post.id)}
            className="mr-3 mt-1"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
            <p className="text-gray-300 text-sm mb-3 line-clamp-3">{post.content}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>Por: {post.author.name}</span>
              <span>{post.category}</span>
              <span>{post.createdAt.toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            post.status === 'approved' ? 'bg-green-500' :
            post.status === 'rejected' ? 'bg-red-500' :
            post.status === 'flagged' ? 'bg-orange-500' :
            'bg-yellow-500'
          }`}>
            {post.status}
          </span>
        </div>
      </div>

      {post.imageUrl && (
        <div className="mb-4">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
        <div>
          <span className="text-gray-400">Curtidas:</span>
          <span className="text-white ml-2">{post.metrics.likes}</span>
        </div>
        <div>
          <span className="text-gray-400">Compartilhamentos:</span>
          <span className="text-white ml-2">{post.metrics.shares}</span>
        </div>
        <div>
          <span className="text-gray-400">Comentários:</span>
          <span className="text-white ml-2">{post.metrics.comments}</span>
        </div>
        <div>
          <span className="text-gray-400">Visualizações:</span>
          <span className="text-white ml-2">{post.metrics.views}</span>
        </div>
      </div>

      {post.flags.length > 0 && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg">
          <h4 className="text-red-300 font-medium mb-2">⚠️ Posts Reportados:</h4>
          {post.flags.map((flag, index) => (
            <div key={index} className="text-red-400 text-sm">
              • {flag.reason} - {flag.reportedAt.toLocaleDateString('pt-BR')}
            </div>
          ))}
        </div>
      )}

      {post.rejectionReason && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg">
          <h4 className="text-red-300 font-medium mb-1">Motivo da Rejeição:</h4>
          <p className="text-red-400 text-sm">{post.rejectionReason}</p>
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={() => approvePost(post.id)}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          ✅ Aprovar
        </button>
        <button
          onClick={() => {
            const reason = prompt('Motivo da rejeição:') || 'Sem motivo especificado'
            rejectPost(post.id, reason)
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          ❌ Rejeitar
        </button>
        <button
          onClick={() => {
            const reason = prompt('Motivo da marcação:') || 'Conteúdo suspeito'
            flagPost(post.id, reason)
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          🚩 Marcar
        </button>
        <button
          onClick={() => deletePost(post.id)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          🗑️ Excluir
        </button>
      </div>
    </div>
  )

  const QueueItem = ({ item }: { item: ModerationQueue }) => {
    const post = posts.find(p => p.id === item.postId)
    if (!post) return null

    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
            <p className="text-gray-300 text-sm mb-2">{post.content.substring(0, 100)}...</p>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>Por: {post.author.name}</span>
              <span>{post.category}</span>
              <span>{item.createdAt.toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              item.priority === 'critical' ? 'bg-red-500' :
              item.priority === 'high' ? 'bg-orange-500' :
              item.priority === 'medium' ? 'bg-yellow-500' :
              'bg-green-500'
            }`}>
              {item.priority}
            </span>
            <span className="px-2 py-1 bg-gray-700 rounded text-xs">
              {item.status}
            </span>
          </div>
        </div>

        <div className="mb-4 p-3 bg-orange-900 border border-orange-700 rounded-lg">
          <h4 className="text-orange-300 font-medium mb-1">Motivo do Reporte:</h4>
          <p className="text-orange-400 text-sm">{item.reason}</p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => approvePost(post.id)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            ✅ Aprovar
          </button>
          <button
            onClick={() => {
              const reason = prompt('Motivo da rejeição:') || 'Sem motivo especificado'
              rejectPost(post.id, reason)
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            ❌ Rejeitar
          </button>
          <button
            onClick={() => deletePost(post.id)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            🗑️ Excluir
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Carregando Moderação</h2>
          <p className="text-gray-400">Analisando conteúdo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">🛡️ Sistema de Moderação</h1>
            <p className="text-gray-400">Gerencie conteúdo e mantenha a qualidade da plataforma</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {moderationQueue.length} na fila
            </div>
            <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {posts.filter(p => p.status === 'pending').length} pendentes
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'queue'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            🚨 Fila de Moderação
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'posts'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📝 Posts
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'rules'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            ⚙️ Regras
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📊 Analytics
          </button>
        </div>

        {/* Queue Tab */}
        {activeTab === 'queue' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Fila de Moderação</h2>
              <div className="text-gray-400 text-sm">
                {moderationQueue.length} itens aguardando revisão
              </div>
            </div>

            <div className="space-y-4">
              {moderationQueue.map(item => (
                <QueueItem key={item.id} item={item} />
              ))}
            </div>

            {moderationQueue.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-white mb-2">Fila Vazia</h3>
                <p className="text-gray-400">Todos os posts foram moderados</p>
              </div>
            )}
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div>
            {/* Filters */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">Todos</option>
                    <option value="pending">Pendente</option>
                    <option value="approved">Aprovado</option>
                    <option value="rejected">Rejeitado</option>
                    <option value="flagged">Marcado</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">Todas</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Finanças">Finanças</option>
                    <option value="Educação">Educação</option>
                    <option value="Entretenimento">Entretenimento</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    placeholder="Título do post..."
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {showBulkActions ? 'Ocultar' : 'Mostrar'} Ações em Lote
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {showBulkActions && selectedPosts.length > 0 && (
              <div className="bg-blue-900 border border-blue-700 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-blue-300 font-medium">
                      {selectedPosts.length} posts selecionados
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => executeBulkAction('approve')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      ✅ Aprovar Todos
                    </button>
                    <button
                      onClick={() => executeBulkAction('reject')}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      ❌ Rejeitar Todos
                    </button>
                    <button
                      onClick={() => executeBulkAction('flag')}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      🚩 Marcar Todos
                    </button>
                    <button
                      onClick={() => executeBulkAction('delete')}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      🗑️ Excluir Todos
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Posts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum post encontrado</h3>
                <p className="text-gray-400">Ajuste os filtros para encontrar posts</p>
              </div>
            )}
          </div>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Regras de Moderação</h2>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                ➕ Nova Regra
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moderationRules.map(rule => (
                <div key={rule.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{rule.name}</h3>
                      <p className="text-gray-300 text-sm mb-2">{rule.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          rule.type === 'spam' ? 'bg-red-500' :
                          rule.type === 'inappropriate' ? 'bg-orange-500' :
                          rule.type === 'copyright' ? 'bg-purple-500' :
                          'bg-blue-500'
                        }`}>
                          {rule.type}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          rule.isActive ? 'bg-green-500' : 'bg-gray-500'
                        }`}>
                          {rule.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-gray-300 font-medium mb-2">Condições:</h4>
                    <div className="space-y-1">
                      {rule.conditions.map((condition, index) => (
                        <div key={index} className="text-gray-400 text-sm">
                          {condition.field} {condition.operator} {condition.value}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-gray-300 font-medium mb-1">Ação:</h4>
                    <span className="text-blue-400 text-sm">{rule.action}</span>
                  </div>

                  <div className="flex space-x-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                      ✏️ Editar
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors">
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Posts Pendentes</h3>
                    <p className="text-4xl font-bold text-yellow-500">
                      {posts.filter(p => p.status === 'pending').length}
                    </p>
                    <p className="text-gray-400 text-sm">Aguardando moderação</p>
                  </div>
                  <div className="text-4xl text-yellow-500">⏳</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Posts Aprovados</h3>
                    <p className="text-4xl font-bold text-green-500">
                      {posts.filter(p => p.status === 'approved').length}
                    </p>
                    <p className="text-gray-400 text-sm">Total aprovado</p>
                  </div>
                  <div className="text-4xl text-green-500">✅</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Posts Rejeitados</h3>
                    <p className="text-4xl font-bold text-red-500">
                      {posts.filter(p => p.status === 'rejected').length}
                    </p>
                    <p className="text-gray-400 text-sm">Total rejeitado</p>
                  </div>
                  <div className="text-4xl text-red-500">❌</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Posts Marcados</h3>
                    <p className="text-4xl font-bold text-orange-500">
                      {posts.filter(p => p.status === 'flagged').length}
                    </p>
                    <p className="text-gray-400 text-sm">Reportados</p>
                  </div>
                  <div className="text-4xl text-orange-500">🚩</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Taxa de Aprovação por Categoria</h3>
              <div className="space-y-3">
                {['Tecnologia', 'Saúde', 'Finanças', 'Educação', 'Entretenimento'].map(category => {
                  const categoryPosts = posts.filter(p => p.category === category)
                  const approvedPosts = categoryPosts.filter(p => p.status === 'approved').length
                  const approvalRate = categoryPosts.length > 0 ? (approvedPosts / categoryPosts.length) * 100 : 0
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-gray-300">{category}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${approvalRate}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm w-12 text-right">{approvalRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
