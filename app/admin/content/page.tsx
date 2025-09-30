'use client'

import { useState, useEffect } from 'react'
import { AdminAuthService } from '@/lib/services/AdminAuthService'

interface ContentItem {
  id: string
  title: string
  description: string
  content: string
  category: string
  platform: string
  status: 'pending' | 'approved' | 'rejected'
  userId: string
  userName: string
  userEmail: string
  createdAt: Date
  reviewedAt?: Date
  reviewedBy?: string
}

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPlatform, setFilterPlatform] = useState<string>('all')

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      setLoading(true)
      // Simular carregamento de conteúdo
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockContent: ContentItem[] = [
        {
          id: 'content-001',
          title: 'Direito Trabalhista - Nova Lei',
          description: 'Post sobre as mudanças na legislação trabalhista',
          content: '🎯 Nova Lei Trabalhista\n\nAs principais mudanças que afetam empresas e trabalhadores...',
          category: 'Direito',
          platform: 'Instagram',
          status: 'pending',
          userId: 'user-001',
          userName: 'João Silva',
          userEmail: 'joao@email.com',
          createdAt: new Date('2024-01-20'),
        },
        {
          id: 'content-002',
          title: 'Dicas de Saúde Mental',
          description: 'Conteúdo educativo sobre bem-estar mental',
          content: '💡 Dicas de Saúde Mental\n\n5 estratégias para manter sua saúde mental em dia...',
          category: 'Saúde',
          platform: 'LinkedIn',
          status: 'approved',
          userId: 'user-002',
          userName: 'Maria Santos',
          userEmail: 'maria@email.com',
          createdAt: new Date('2024-01-19'),
          reviewedAt: new Date('2024-01-19'),
          reviewedBy: 'admin@nichofy.com'
        },
        {
          id: 'content-003',
          title: 'Tecnologia e IA',
          description: 'Post sobre inteligência artificial',
          content: '🤖 Inteligência Artificial\n\nComo a IA está transformando o mundo dos negócios...',
          category: 'Tecnologia',
          platform: 'Instagram',
          status: 'rejected',
          userId: 'user-003',
          userName: 'Pedro Costa',
          userEmail: 'pedro@email.com',
          createdAt: new Date('2024-01-18'),
          reviewedAt: new Date('2024-01-18'),
          reviewedBy: 'admin@nichofy.com'
        }
      ]
      
      setContent(mockContent)
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.userName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    const matchesPlatform = filterPlatform === 'all' || item.platform === filterPlatform
    return matchesSearch && matchesStatus && matchesPlatform
  })

  const handleContentAction = async (contentId: string, action: 'approve' | 'reject') => {
    try {
      // Simular ação
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setContent(prev => prev.map(item => {
        if (item.id === contentId) {
          return {
            ...item,
            status: action === 'approve' ? 'approved' : 'rejected',
            reviewedAt: new Date(),
            reviewedBy: 'admin@nichofy.com'
          }
        }
        return item
      }))
      
      showNotification(`Conteúdo ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`)
    } catch (error) {
      console.error('Erro ao executar ação:', error)
      showNotification('Erro ao executar ação', 'error')
    }
  }

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const notification = document.createElement('div')
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`
    notification.innerHTML = `
      <div class="flex items-center">
        <span class="text-xl mr-2">${type === 'success' ? '✅' : '❌'}</span>
        <div class="font-semibold">${message}</div>
      </div>
    `
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => document.body.removeChild(notification), 300)
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500'
      case 'rejected': return 'bg-red-500'
      case 'pending': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado'
      case 'rejected': return 'Rejeitado'
      case 'pending': return 'Pendente'
      default: return 'Desconhecido'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Carregando Conteúdo</h2>
          <p className="text-gray-400">Aguarde enquanto buscamos os dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Gestão de Conteúdo</h1>
              <p className="text-gray-400 mt-1">Aprove ou rejeite conteúdo enviado pelos usuários</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                📊 Relatório
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                📈 Analytics
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                🔍 Buscar Conteúdo
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Título, descrição ou usuário..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                📊 Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendentes</option>
                <option value="approved">Aprovados</option>
                <option value="rejected">Rejeitados</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                📱 Plataforma
              </label>
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
              >
                <option value="all">Todas</option>
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Facebook">Facebook</option>
                <option value="Twitter">Twitter</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={loadContent}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🔄 Atualizar
              </button>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="space-y-6">
          {filteredContent.map((item) => (
            <div key={item.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 mb-3">{item.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>👤 {item.userName}</span>
                    <span>📱 {item.platform}</span>
                    <span>🏷️ {item.category}</span>
                    <span>📅 {item.createdAt.toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full text-white ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                  {item.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleContentAction(item.id, 'approve')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        ✅ Aprovar
                      </button>
                      <button
                        onClick={() => handleContentAction(item.id, 'reject')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        ❌ Rejeitar
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Conteúdo:</h4>
                <pre className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">
                  {item.content}
                </pre>
              </div>
              
              {item.reviewedAt && (
                <div className="text-sm text-gray-500">
                  <span>Revisado em {item.reviewedAt.toLocaleDateString('pt-BR')} por {item.reviewedBy}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum conteúdo encontrado</h3>
            <p className="text-gray-400">Tente ajustar os filtros ou aguarde novos envios.</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Total</h3>
                <p className="text-3xl font-bold text-white">{content.length}</p>
              </div>
              <div className="text-3xl text-blue-500">📝</div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Pendentes</h3>
                <p className="text-3xl font-bold text-yellow-500">
                  {content.filter(c => c.status === 'pending').length}
                </p>
              </div>
              <div className="text-3xl text-yellow-500">⏳</div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Aprovados</h3>
                <p className="text-3xl font-bold text-green-500">
                  {content.filter(c => c.status === 'approved').length}
                </p>
              </div>
              <div className="text-3xl text-green-500">✅</div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Rejeitados</h3>
                <p className="text-3xl font-bold text-red-500">
                  {content.filter(c => c.status === 'rejected').length}
                </p>
              </div>
              <div className="text-3xl text-red-500">❌</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
