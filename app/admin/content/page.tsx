'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore'
import { AdminAuthService } from '@/lib/services/AdminAuthService'

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
  createdAt: Timestamp
  assignedTo?: string
  reviewedAt?: Timestamp
  reviewedBy?: string
  adminNotes?: string
  generatedContent?: string
  generatedImageUrl?: string
  hashtags?: string[]
  callToAction?: string
  userFeedback?: string
  userRating?: number
  publishedAt?: Timestamp
}

export default function AdminContentPage() {
  const [requests, setRequests] = useState<ContentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<ContentRequest | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'ready_for_review'>('pending')
  const [currentAdmin, setCurrentAdmin] = useState<any>(null)

  useEffect(() => {
    loadAdmin()
    loadRequests()
  }, [filter])

  const loadAdmin = async () => {
    try {
      const admin = await AdminAuthService.getCurrentAdmin()
      setCurrentAdmin(admin)
    } catch (error) {
      console.error('Erro ao carregar admin:', error)
    }
  }

  const loadRequests = async () => {
    try {
      setLoading(true)
      const q = query(
        collection(db, 'contentRequests'),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const allRequests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContentRequest[]
      
      if (filter === 'all') {
        setRequests(allRequests)
      } else {
        setRequests(allRequests.filter(req => req.status === filter))
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignRequest = async (requestId: string) => {
    try {
      if (!currentAdmin) return
      
      const requestRef = doc(db, 'contentRequests', requestId)
      await updateDoc(requestRef, {
        status: 'in_progress',
        assignedTo: currentAdmin.id,
      })
      
      await loadRequests()
      alert('✅ Pedido atribuído com sucesso!')
    } catch (error) {
      console.error('Erro ao atribuir pedido:', error)
      alert('❌ Erro ao atribuir pedido')
    }
  }

  const handleCreateContent = async (requestId: string, contentData: {
    generatedContent: string
    generatedImageUrl?: string
    hashtags?: string[]
    callToAction?: string
    adminNotes?: string
  }) => {
    try {
      setIsCreating(true)
      
      const requestRef = doc(db, 'contentRequests', requestId)
      await updateDoc(requestRef, {
        status: 'ready_for_review',
        ...contentData,
      })
      
      await loadRequests()
      setSelectedRequest(null)
      alert('✅ Conteúdo criado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar conteúdo:', error)
      alert('❌ Erro ao criar conteúdo')
    } finally {
      setIsCreating(false)
    }
  }

  const handleApproveContent = async (requestId: string, notes?: string) => {
    try {
      if (!currentAdmin) return
      
      const requestRef = doc(db, 'contentRequests', requestId)
      await updateDoc(requestRef, {
        status: 'approved',
        reviewedAt: Timestamp.now(),
        reviewedBy: currentAdmin.id,
        adminNotes: notes || '',
      })
      
      await loadRequests()
      alert('✅ Conteúdo aprovado!')
    } catch (error) {
      console.error('Erro ao aprovar conteúdo:', error)
      alert('❌ Erro ao aprovar conteúdo')
    }
  }

  const handleRejectContent = async (requestId: string, reason: string) => {
    try {
      if (!currentAdmin) return
      
      const requestRef = doc(db, 'contentRequests', requestId)
      await updateDoc(requestRef, {
        status: 'rejected',
        reviewedAt: Timestamp.now(),
        reviewedBy: currentAdmin.id,
        adminNotes: reason,
      })
      
      await loadRequests()
      alert('❌ Conteúdo rejeitado')
    } catch (error) {
      console.error('Erro ao rejeitar conteúdo:', error)
      alert('❌ Erro ao rejeitar conteúdo')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-yellow-900'
      case 'in_progress': return 'bg-blue-500 text-blue-900'
      case 'ready_for_review': return 'bg-green-500 text-green-900'
      case 'approved': return 'bg-emerald-500 text-emerald-900'
      case 'rejected': return 'bg-red-500 text-red-900'
      case 'published': return 'bg-purple-500 text-purple-900'
      default: return 'bg-gray-500 text-gray-900'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente'
      case 'in_progress': return 'Em Progresso'
      case 'ready_for_review': return 'Pronto para Revisão'
      case 'approved': return 'Aprovado'
      case 'rejected': return 'Rejeitado'
      case 'published': return 'Publicado'
      default: return 'Desconhecido'
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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">🎨 Criação de Conteúdo</h1>
              <p className="text-gray-400 mt-1">Crie conteúdo profissional para os usuários</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
              >
                <option value="pending">Pendentes</option>
                <option value="in_progress">Em Progresso</option>
                <option value="ready_for_review">Prontos para Revisão</option>
                <option value="all">Todos</option>
              </select>
              <button
                onClick={loadRequests}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🔄 Atualizar
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Total</h3>
                <p className="text-3xl font-bold text-white">{requests.length}</p>
              </div>
              <div className="text-3xl text-blue-500">📝</div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Pendentes</h3>
                <p className="text-3xl font-bold text-yellow-500">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="text-3xl text-yellow-500">⏳</div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Em Progresso</h3>
                <p className="text-3xl font-bold text-blue-500">
                  {requests.filter(r => r.status === 'in_progress').length}
                </p>
              </div>
              <div className="text-3xl text-blue-500">🔄</div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Prontos</h3>
                <p className="text-3xl font-bold text-green-500">
                  {requests.filter(r => r.status === 'ready_for_review').length}
                </p>
              </div>
              <div className="text-3xl text-green-500">✅</div>
            </div>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Lista de Pedidos */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                📋 Pedidos ({requests.length})
              </h2>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      onClick={() => setSelectedRequest(request)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedRequest?.id === request.id
                          ? 'border-blue-400 bg-blue-900/20'
                          : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white text-sm">
                          {request.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-400 space-y-1">
                        <div>👤 {request.userName}</div>
                        <div>📱 {request.platform}</div>
                        <div>🏷️ {request.category}</div>
                        <div>📅 {request.createdAt?.toDate().toLocaleDateString('pt-BR')}</div>
                        <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Detalhes do Pedido */}
          <div className="lg:col-span-2">
            {selectedRequest ? (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedRequest.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>👤 {selectedRequest.userName}</span>
                      <span>📧 {selectedRequest.userEmail}</span>
                      <span>📅 {selectedRequest.createdAt?.toDate().toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {getStatusText(selectedRequest.status)}
                  </span>
                </div>

                {/* Informações do Pedido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">📱 Plataforma</h3>
                      <p className="text-white">{selectedRequest.platform}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">🏷️ Categoria</h3>
                      <p className="text-white">{selectedRequest.category}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">🎯 Objetivo</h3>
                      <p className="text-white">{selectedRequest.objective}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">🎭 Tom</h3>
                      <p className="text-white">{selectedRequest.tone}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">👥 Público-Alvo</h3>
                      <p className="text-white">{selectedRequest.targetAudience || 'Não especificado'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">🔑 Palavras-Chave</h3>
                      <p className="text-white">{selectedRequest.keywords || 'Não especificado'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">📏 Tamanho</h3>
                      <p className="text-white">{selectedRequest.size}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">⏰ Urgência</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(selectedRequest.urgency)}`}>
                        {selectedRequest.urgency.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">📝 Descrição</h3>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-white whitespace-pre-wrap">{selectedRequest.description}</p>
                  </div>
                </div>

                {/* Observações */}
                {selectedRequest.notes && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">📝 Observações</h3>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-white whitespace-pre-wrap">{selectedRequest.notes}</p>
                    </div>
                  </div>
                )}

                {/* Conteúdo Gerado */}
                {selectedRequest.generatedContent && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">📄 Conteúdo Gerado</h3>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <pre className="text-white whitespace-pre-wrap text-sm">{selectedRequest.generatedContent}</pre>
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex flex-wrap gap-3">
                  {selectedRequest.status === 'pending' && (
                    <button
                      onClick={() => handleAssignRequest(selectedRequest.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      📝 Atribuir a Mim
                    </button>
                  )}
                  
                  {selectedRequest.status === 'in_progress' && (
                    <button
                      onClick={() => {
                        const content = prompt('Digite o conteúdo gerado:')
                        if (content) {
                          handleCreateContent(selectedRequest.id, {
                            generatedContent: content,
                            hashtags: selectedRequest.includeHashtags ? ['#conteudo', '#profissional'] : [],
                            callToAction: selectedRequest.includeCTA ? 'Entre em contato conosco!' : undefined
                          })
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      ✍️ Criar Conteúdo
                    </button>
                  )}
                  
                  {selectedRequest.status === 'ready_for_review' && (
                    <>
                      <button
                        onClick={() => {
                          const notes = prompt('Observações (opcional):')
                          handleApproveContent(selectedRequest.id, notes || undefined)
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        ✅ Aprovar
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Motivo da rejeição:')
                          if (reason) {
                            handleRejectContent(selectedRequest.id, reason)
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        ❌ Rejeitar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-white mb-2">Selecione um pedido</h3>
                <p className="text-gray-400">Escolha um pedido da lista para ver os detalhes e tomar ações</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}