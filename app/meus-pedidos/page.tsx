'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'

interface ContentRequest {
  id: string
  userId: string
  userEmail: string
  userName: string
  title: string
  description: string
  category: string
  platform: string
  objective: string
  tone: string
  targetAudience: string
  keywords: string
  size: string
  includeHashtags: boolean
  includeCTA: boolean
  urgency: string
  references: string
  notes: string
  status: 'pending' | 'in_progress' | 'ready_for_review' | 'approved' | 'rejected' | 'published'
  createdAt: any
  assignedTo?: string
  reviewedAt?: any
  reviewedBy?: string
  adminNotes?: string
  generatedContent?: string
  generatedImageUrl?: string
  hashtags?: string[]
  callToAction?: string
  userFeedback?: string
  userRating?: number
  publishedAt?: any
}

export default function MeusPedidosPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<ContentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    if (user) {
      loadUserRequests()
    }
  }, [user])

  const loadUserRequests = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const q = query(
        collection(db, 'contentRequests'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const userRequests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContentRequest[]
      
      setRequests(userRequests)
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = requests.filter(request => {
    if (filterStatus === 'all') return true
    return request.status === filterStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500'
      case 'rejected': return 'bg-red-500'
      case 'pending': return 'bg-yellow-500'
      case 'in_progress': return 'bg-blue-500'
      case 'ready_for_review': return 'bg-purple-500'
      case 'published': return 'bg-indigo-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado'
      case 'rejected': return 'Rejeitado'
      case 'pending': return 'Pendente'
      case 'in_progress': return 'Em Progresso'
      case 'ready_for_review': return 'Pronto para Revisão'
      case 'published': return 'Publicado'
      default: return 'Desconhecido'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return '✅'
      case 'rejected': return '❌'
      case 'pending': return '⏳'
      case 'in_progress': return '🔄'
      case 'ready_for_review': return '📋'
      case 'published': return '🚀'
      default: return '❓'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgente': return 'text-red-600 bg-red-100'
      case 'alta': return 'text-orange-600 bg-orange-100'
      case 'normal': return 'text-blue-600 bg-blue-100'
      case 'baixa': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Carregando Pedidos</h2>
          <p className="text-gray-600">Aguarde enquanto buscamos seus dados...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button
                  onClick={() => router.back()}
                  className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  ← Voltar
                </button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Meus Pedidos
                  </h1>
                  <p className="text-gray-600 mt-1">Acompanhe o status dos seus conteúdos</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/criar-conteudo')}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  ➕ Novo Pedido
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Total</h3>
                  <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
                </div>
                <div className="text-3xl text-blue-500">📝</div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Pendentes</h3>
                  <p className="text-3xl font-bold text-yellow-500">
                    {requests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <div className="text-3xl text-yellow-500">⏳</div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Aprovados</h3>
                  <p className="text-3xl font-bold text-green-500">
                    {requests.filter(r => r.status === 'approved').length}
                  </p>
                </div>
                <div className="text-3xl text-green-500">✅</div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Publicados</h3>
                  <p className="text-3xl font-bold text-blue-500">
                    {requests.filter(r => r.status === 'published').length}
                  </p>
                </div>
                <div className="text-3xl text-blue-500">🚀</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-semibold text-gray-700">Filtrar por status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendentes</option>
                <option value="in_progress">Em Progresso</option>
                <option value="ready_for_review">Prontos para Revisão</option>
                <option value="approved">Aprovados</option>
                <option value="rejected">Rejeitados</option>
                <option value="published">Publicados</option>
              </select>
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-6">
            {filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{request.title}</h3>
                    <p className="text-gray-600 mb-3">{request.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📱 {request.platform}</span>
                      <span>🏷️ {request.category}</span>
                      <span>📅 {request.createdAt?.toDate().toLocaleDateString('pt-BR')}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full text-white ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)} {getStatusText(request.status)}
                    </span>
                  </div>
                </div>
                
                {/* Conteúdo Gerado */}
                {request.generatedContent && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Conteúdo Gerado:</h4>
                    <pre className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                      {request.generatedContent}
                    </pre>
                  </div>
                )}
                
                {/* Hashtags */}
                {request.hashtags && request.hashtags.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <h4 className="text-sm font-semibold text-blue-700 mb-2">Hashtags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {request.hashtags.map((hashtag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Call to Action */}
                {request.callToAction && (
                  <div className="bg-green-50 rounded-xl p-4 mb-4">
                    <h4 className="text-sm font-semibold text-green-700 mb-2">Call-to-Action:</h4>
                    <p className="text-green-800 text-sm">{request.callToAction}</p>
                  </div>
                )}
                
                {/* Observações do Admin */}
                {request.adminNotes && (
                  <div className="bg-yellow-50 rounded-xl p-4 mb-4">
                    <h4 className="text-sm font-semibold text-yellow-700 mb-2">Observações do Admin:</h4>
                    <p className="text-yellow-800 text-sm">{request.adminNotes}</p>
                  </div>
                )}
                
                {/* Informações de Revisão */}
                {request.reviewedAt && (
                  <div className="text-sm text-gray-500 border-t pt-4">
                    <span>Revisado em {request.reviewedAt?.toDate().toLocaleDateString('pt-BR')}</span>
                    {request.reviewedBy && <span> por {request.reviewedBy}</span>}
                  </div>
                )}

                {/* Ações */}
                {request.status === 'approved' && (
                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={() => {
                        // Simular publicação
                        alert('🚀 Conteúdo publicado com sucesso!')
                      }}
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      🚀 Publicar Conteúdo
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-600 mb-6">Você ainda não fez nenhum pedido de conteúdo.</p>
              <button
                onClick={() => router.push('/criar-conteudo')}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                ➕ Criar Primeiro Pedido
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}