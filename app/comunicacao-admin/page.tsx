'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { AdminCommunicationService, ChatSession, Ticket, Feedback, ServicePreferences } from '@/lib/services/AdminCommunicationService'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ComunicacaoAdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets' | 'feedback' | 'preferences'>('chat')
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [servicePreferences, setServicePreferences] = useState<ServicePreferences | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user, activeTab])

  const loadData = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      
      switch (activeTab) {
        case 'chat':
          const sessions = await AdminCommunicationService.getUserChatSessions(user.uid)
          setChatSessions(sessions)
          break
        case 'tickets':
          const userTickets = await AdminCommunicationService.getUserTickets(user.uid)
          setTickets(userTickets)
          break
        case 'feedback':
          const userFeedback = await AdminCommunicationService.getUserFeedback(user.uid)
          setFeedback(userFeedback)
          break
        case 'preferences':
          const preferences = await AdminCommunicationService.getServicePreferences(user.uid)
          setServicePreferences(preferences)
          break
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewChat = async () => {
    if (!user) return
    
    const subject = prompt('Assunto da conversa:')
    if (subject) {
      try {
        const chatId = await AdminCommunicationService.createChatSession(
          user.uid,
          user.email || '',
          user.displayName || user.email?.split('@')[0] || 'Usuário',
          subject,
          'general'
        )
        alert('✅ Chat criado! Um administrador entrará em contato em breve.')
        loadData()
      } catch (error) {
        console.error('Erro ao criar chat:', error)
        alert('❌ Erro ao criar chat')
      }
    }
  }

  const createNewTicket = async () => {
    if (!user) return
    
    const title = prompt('Título do ticket:')
    const description = prompt('Descrição detalhada:')
    
    if (title && description) {
      try {
        await AdminCommunicationService.createTicket(
          user.uid,
          user.email || '',
          user.displayName || user.email?.split('@')[0] || 'Usuário',
          title,
          description,
          'general'
        )
        alert('✅ Ticket criado! Você receberá uma resposta em breve.')
        loadData()
      } catch (error) {
        console.error('Erro ao criar ticket:', error)
        alert('❌ Erro ao criar ticket')
      }
    }
  }

  const submitFeedback = async () => {
    if (!user) return
    
    const rating = prompt('Avaliação (1-5):')
    const comment = prompt('Comentário:')
    
    if (rating && comment) {
      try {
        await AdminCommunicationService.submitFeedback(
          user.uid,
          user.email || '',
          user.displayName || user.email?.split('@')[0] || 'Usuário',
          'service',
          parseInt(rating),
          comment,
          'satisfaction'
        )
        alert('✅ Feedback enviado! Obrigado pela sua opinião.')
        loadData()
      } catch (error) {
        console.error('Erro ao enviar feedback:', error)
        alert('❌ Erro ao enviar feedback')
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'waiting': return 'bg-yellow-500'
      case 'closed': return 'bg-gray-500'
      case 'open': return 'bg-blue-500'
      case 'in_progress': return 'bg-orange-500'
      case 'resolved': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo'
      case 'waiting': return 'Aguardando'
      case 'closed': return 'Fechado'
      case 'open': return 'Aberto'
      case 'in_progress': return 'Em Progresso'
      case 'resolved': return 'Resolvido'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Carregando Comunicação</h2>
          <p className="text-gray-600">Buscando suas conversas e tickets...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button
                  onClick={() => router.back()}
                  className="mr-4 p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                >
                  <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                </button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Comunicação com Admin
                  </h1>
                  <p className="text-gray-600 mt-1">Converse diretamente com nossa equipe</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
            <div className="flex border-b border-gray-200">
              {[
                { id: 'chat', label: '💬 Chat Direto', count: chatSessions.length },
                { id: 'tickets', label: '🎫 Tickets', count: tickets.length },
                { id: 'feedback', label: '⭐ Feedback', count: feedback.length },
                { id: 'preferences', label: '⚙️ Preferências', count: 0 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              
              {/* Chat Tab */}
              {activeTab === 'chat' && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">💬 Conversas Ativas</h2>
                    <button
                      onClick={createNewChat}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      ➕ Nova Conversa
                    </button>
                  </div>
                  
                  {chatSessions.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">💬</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma conversa</h3>
                      <p className="text-gray-600 mb-6">Inicie uma conversa com nossa equipe</p>
                      <button
                        onClick={createNewChat}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Iniciar Conversa
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatSessions.map((session) => (
                        <div key={session.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{session.subject}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(session.status)}`}>
                              {getStatusText(session.status)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Categoria: {session.category}</div>
                            <div>Criado em: {session.createdAt?.toDate().toLocaleDateString('pt-BR')}</div>
                            {session.adminName && <div>Admin: {session.adminName}</div>}
                            {session.unreadCount > 0 && (
                              <div className="text-blue-600 font-medium">
                                {session.unreadCount} mensagem(s) não lida(s)
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tickets Tab */}
              {activeTab === 'tickets' && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">🎫 Seus Tickets</h2>
                    <button
                      onClick={createNewTicket}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      ➕ Novo Ticket
                    </button>
                  </div>
                  
                  {tickets.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎫</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum ticket</h3>
                      <p className="text-gray-600 mb-6">Crie um ticket para solicitar suporte</p>
                      <button
                        onClick={createNewTicket}
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Criar Ticket
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tickets.map((ticket) => (
                        <div key={ticket.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(ticket.status)}`}>
                              {getStatusText(ticket.status)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{ticket.description}</p>
                          <div className="text-sm text-gray-500 space-y-1">
                            <div>Categoria: {ticket.category}</div>
                            <div>Criado em: {ticket.createdAt?.toDate().toLocaleDateString('pt-BR')}</div>
                            {ticket.adminName && <div>Atribuído a: {ticket.adminName}</div>}
                            {ticket.resolution && (
                              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                <strong>Resolução:</strong> {ticket.resolution}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Tab */}
              {activeTab === 'feedback' && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">⭐ Seu Feedback</h2>
                    <button
                      onClick={submitFeedback}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      ➕ Enviar Feedback
                    </button>
                  </div>
                  
                  {feedback.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">⭐</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum feedback</h3>
                      <p className="text-gray-600 mb-6">Compartilhe sua opinião sobre nosso serviço</p>
                      <button
                        onClick={submitFeedback}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Enviar Feedback
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {feedback.map((item) => (
                        <div key={item.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">⭐</span>
                              <span className="font-semibold text-gray-900">{item.rating}/5</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              item.resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.resolved ? 'Respondido' : 'Pendente'}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{item.comment}</p>
                          <div className="text-sm text-gray-500 space-y-1">
                            <div>Categoria: {item.category}</div>
                            <div>Enviado em: {item.createdAt?.toDate().toLocaleDateString('pt-BR')}</div>
                            {item.adminResponse && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <strong>Resposta do Admin:</strong> {item.adminResponse}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">⚙️ Preferências de Atendimento</h2>
                  
                  {!servicePreferences ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">⚙️</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Configure suas preferências</h3>
                      <p className="text-gray-600 mb-6">Personalize como você quer ser atendido</p>
                      <button
                        onClick={() => {
                          // Implementar criação de preferências
                          alert('Funcionalidade em desenvolvimento')
                        }}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Configurar Preferências
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Horários Preferidos</h3>
                          <div className="flex flex-wrap gap-2">
                            {servicePreferences.preferredHours.map((hour, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {hour}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Nível de Detalhamento</h3>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            {servicePreferences.detailLevel}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Frequência de Check-ins</h3>
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                            {servicePreferences.checkInFrequency}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Tipo de Suporte</h3>
                          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                            {servicePreferences.supportType}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">⚡ Ações Rápidas</h3>
                <div className="space-y-3">
                  <button
                    onClick={createNewChat}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors text-left"
                  >
                    💬 Iniciar Chat
                  </button>
                  <button
                    onClick={createNewTicket}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors text-left"
                  >
                    🎫 Criar Ticket
                  </button>
                  <button
                    onClick={submitFeedback}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg transition-colors text-left"
                  >
                    ⭐ Enviar Feedback
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Estatísticas</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversas:</span>
                    <span className="font-medium text-gray-900">{chatSessions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tickets:</span>
                    <span className="font-medium text-gray-900">{tickets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Feedback:</span>
                    <span className="font-medium text-gray-900">{feedback.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resolvidos:</span>
                    <span className="font-medium text-green-600">
                      {tickets.filter(t => t.status === 'resolved').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-green-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Dicas</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Use o chat para dúvidas rápidas</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Crie tickets para problemas complexos</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Compartilhe feedback regularmente</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Configure suas preferências de atendimento</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
