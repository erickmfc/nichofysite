'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ContentApprovalService, ContentRequest } from '@/lib/services/ContentApprovalService'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Timestamp } from 'firebase/firestore'

export default function MeusPedidosPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<ContentRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadUserRequests()
    }
  }, [user])

  const loadUserRequests = async () => {
    try {
      setLoading(true)
      const userRequests = await ContentApprovalService.getUserRequests(user?.uid || '')
      setRequests(userRequests)
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'published': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '⏳ Pendente'
      case 'approved': return '✅ Aprovado'
      case 'rejected': return '❌ Rejeitado'
      case 'published': return '🚀 Publicado'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'approved': return '✅'
      case 'rejected': return '❌'
      case 'published': return '🚀'
      default: return '📄'
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-24 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📋 Meus Pedidos de Conteúdo
            </h1>
            <p className="text-gray-600">
              Acompanhe o status dos seus pedidos de conteúdo
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-yellow-600">
                {requests.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Aprovados</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-red-600">
                {requests.filter(r => r.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-600">Rejeitados</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">
                {requests.filter(r => r.status === 'published').length}
              </div>
              <div className="text-sm text-gray-600">Publicados</div>
            </div>
          </div>

          {/* Lista de Pedidos */}
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {request.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span>🏷️ {request.category}</span>
                      <span>📱 {request.platform}</span>
                      <span>📅 {formatDate(request.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 mb-3">
                      {request.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <strong>Conteúdo:</strong>
                  <p className="mt-2 text-gray-800 whitespace-pre-wrap">
                    {request.content}
                  </p>
                </div>

                {/* Notas do Admin */}
                {request.adminNotes && (
                  <div className={`p-4 rounded-lg mb-4 ${
                    request.status === 'rejected' 
                      ? 'bg-red-50 border-l-4 border-red-400' 
                      : 'bg-blue-50 border-l-4 border-blue-400'
                  }`}>
                    <strong className={request.status === 'rejected' ? 'text-red-800' : 'text-blue-800'}>
                      {request.status === 'rejected' ? 'Motivo da Rejeição:' : 'Notas do Administrador:'}
                    </strong>
                    <p className={`mt-2 ${request.status === 'rejected' ? 'text-red-700' : 'text-blue-700'}`}>
                      {request.adminNotes}
                    </p>
                  </div>
                )}

                {/* Informações de Revisão */}
                {request.reviewedAt && (
                  <div className="text-sm text-gray-500">
                    Revisado em: {formatDate(request.reviewedAt)}
                  </div>
                )}

                {/* Ações baseadas no status */}
                <div className="mt-4 flex items-center space-x-2">
                  {getStatusIcon(request.status)}
                  <span className="text-sm text-gray-600">
                    {request.status === 'pending' && 'Aguardando aprovação do administrador...'}
                    {request.status === 'approved' && 'Conteúdo aprovado! Aguardando publicação...'}
                    {request.status === 'rejected' && 'Conteúdo rejeitado. Verifique as notas acima.'}
                    {request.status === 'published' && 'Conteúdo publicado com sucesso! 🎉'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {requests.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Você ainda não enviou nenhum pedido de conteúdo.
              </p>
              <a 
                href="/criar-conteudo"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar Primeiro Conteúdo
              </a>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
