'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase'
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore'
import { Button } from '@/components/ui/Button'

interface PersonalMetrics {
  postsCriadosMes: number
  taxaAprovacao: number
  tempoMedioResposta: number
  conteudoMaisEngajante: string
  evolucaoPerfil: Array<{
    data: Date
    metricas: {
      posts: number
      aprovacoes: number
      engajamento: number
    }
  }>
}

interface GoalsAndTargets {
  metaPostsMes: number
  metaEngajamento: number
  objetivosCrescimento: string[]
  lembretesPersonalizados: Array<{
    id: string
    titulo: string
    descricao: string
    data: Date
    concluido: boolean
  }>
  conquistas: Array<{
    id: string
    titulo: string
    descricao: string
    data: Date
    icone: string
    tipo: 'posts' | 'engajamento' | 'crescimento' | 'especial'
  }>
}

interface ActivityHistory {
  timelinePedidos: Array<{
    id: string
    titulo: string
    status: 'pending' | 'in_progress' | 'completed' | 'rejected'
    dataCriacao: Date
    dataConclusao?: Date
    adminResponsavel?: string
    feedback?: string
  }>
  performanceMensal: Array<{
    mes: string
    posts: number
    aprovacoes: number
    engajamento: number
    satisfacao: number
  }>
  historicoPerfil: Array<{
    data: Date
    tipo: 'nicho' | 'cores' | 'tipografia' | 'personalidade'
    descricao: string
    valorAnterior: string
    valorNovo: string
  }>
  logInteracoes: Array<{
    data: Date
    tipo: 'chat' | 'ticket' | 'feedback' | 'reuniao'
    admin: string
    assunto: string
    resultado: string
  }>
  arquivoConteudos: Array<{
    id: string
    titulo: string
    tipo: string
    dataCriacao: Date
    status: string
    engajamento?: number
    downloadUrl?: string
  }>
}

const CONQUISTAS_DISPONIVEIS = [
  {
    id: 'primeiro-post',
    titulo: 'Primeiro Post',
    descricao: 'Criou seu primeiro conteúdo',
    icone: '🎉',
    tipo: 'posts' as const
  },
  {
    id: '10-posts',
    titulo: 'Produtor Ativo',
    descricao: 'Criou 10 posts',
    icone: '📝',
    tipo: 'posts' as const
  },
  {
    id: '50-posts',
    titulo: 'Criador Experiente',
    descricao: 'Criou 50 posts',
    icone: '🏆',
    tipo: 'posts' as const
  },
  {
    id: '100-posts',
    titulo: 'Mestre do Conteúdo',
    descricao: 'Criou 100 posts',
    icone: '👑',
    tipo: 'posts' as const
  },
  {
    id: 'alta-aprovacao',
    titulo: 'Qualidade Garantida',
    descricao: 'Taxa de aprovação acima de 90%',
    icone: '⭐',
    tipo: 'engajamento' as const
  },
  {
    id: 'crescimento-rapido',
    titulo: 'Crescimento Acelerado',
    descricao: 'Aumentou engajamento em 50%',
    icone: '🚀',
    tipo: 'crescimento' as const
  },
  {
    id: 'perfil-completo',
    titulo: 'Perfil Completo',
    descricao: 'Completou todas as informações do perfil',
    icone: '✅',
    tipo: 'especial' as const
  },
  {
    id: 'identidade-marca',
    titulo: 'Identidade Definida',
    descricao: 'Configurou identidade da marca',
    icone: '🎨',
    tipo: 'especial' as const
  }
]

export const AdvancedPersonalDashboard = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('metricas')
  
  const [metrics, setMetrics] = useState<PersonalMetrics>({
    postsCriadosMes: 0,
    taxaAprovacao: 0,
    tempoMedioResposta: 0,
    conteudoMaisEngajante: '',
    evolucaoPerfil: []
  })
  
  const [goals, setGoals] = useState<GoalsAndTargets>({
    metaPostsMes: 10,
    metaEngajamento: 80,
    objetivosCrescimento: [],
    lembretesPersonalizados: [],
    conquistas: []
  })
  
  const [activity, setActivity] = useState<ActivityHistory>({
    timelinePedidos: [],
    performanceMensal: [],
    historicoPerfil: [],
    logInteracoes: [],
    arquivoConteudos: []
  })

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      // Carregar métricas pessoais
      await loadPersonalMetrics()
      
      // Carregar objetivos e metas
      await loadGoalsAndTargets()
      
      // Carregar histórico de atividade
      await loadActivityHistory()
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadPersonalMetrics = async () => {
    if (!user) return

    try {
      // Buscar pedidos do usuário
      const pedidosQuery = query(
        collection(db, 'contentRequests'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      const pedidosSnapshot = await getDocs(pedidosQuery)
      
      const pedidos = pedidosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate()
      }))

      // Calcular métricas
      const agora = new Date()
      const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1)
      
      const postsMes = pedidos.filter(p => 
        p.createdAt >= inicioMes
      ).length
      
      const pedidosCompletos = pedidos.filter(p => p.status === 'completed')
      const taxaAprovacao = pedidos.length > 0 
        ? (pedidosCompletos.length / pedidos.length) * 100 
        : 0
      
      const temposResposta = pedidosCompletos
        .filter(p => p.completedAt)
        .map(p => p.completedAt!.getTime() - p.createdAt.getTime())
      
      const tempoMedioResposta = temposResposta.length > 0
        ? temposResposta.reduce((a, b) => a + b, 0) / temposResposta.length / (1000 * 60 * 60 * 24) // em dias
        : 0

      // Simular conteúdo mais engajante (em um sistema real, viria de analytics)
      const conteudoMaisEngajante = pedidosCompletos.length > 0 
        ? pedidosCompletos[0].title || 'Primeiro conteúdo aprovado'
        : 'Nenhum conteúdo ainda'

      // Simular evolução do perfil (últimos 6 meses)
      const evolucaoPerfil = []
      for (let i = 5; i >= 0; i--) {
        const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1)
        const postsMes = pedidos.filter(p => 
          p.createdAt.getMonth() === data.getMonth() && 
          p.createdAt.getFullYear() === data.getFullYear()
        ).length
        
        evolucaoPerfil.push({
          data,
          metricas: {
            posts: postsMes,
            aprovacoes: Math.floor(postsMes * 0.8), // Simular 80% de aprovação
            engajamento: Math.floor(Math.random() * 100) // Simular engajamento
          }
        })
      }

      setMetrics({
        postsCriadosMes: postsMes,
        taxaAprovacao: Math.round(taxaAprovacao),
        tempoMedioResposta: Math.round(tempoMedioResposta * 10) / 10,
        conteudoMaisEngajante,
        evolucaoPerfil
      })

    } catch (error) {
      console.error('Erro ao carregar métricas pessoais:', error)
    }
  }

  const loadGoalsAndTargets = async () => {
    if (!user) return

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        
        if (data.goalsAndTargets) {
          setGoals(data.goalsAndTargets)
        } else {
          // Inicializar com conquistas básicas
          const conquistasIniciais = CONQUISTAS_DISPONIVEIS.slice(0, 2).map(conquista => ({
            ...conquista,
            data: new Date(),
            descricao: conquista.descricao
          }))
          
          setGoals({
            metaPostsMes: 10,
            metaEngajamento: 80,
            objetivosCrescimento: ['Aumentar engajamento', 'Criar mais conteúdo'],
            lembretesPersonalizados: [],
            conquistas: conquistasIniciais
          })
        }
      }
    } catch (error) {
      console.error('Erro ao carregar objetivos e metas:', error)
    }
  }

  const loadActivityHistory = async () => {
    if (!user) return

    try {
      // Buscar pedidos para timeline
      const pedidosQuery = query(
        collection(db, 'contentRequests'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(20)
      )
      const pedidosSnapshot = await getDocs(pedidosQuery)
      
      const timelinePedidos = pedidosSnapshot.docs.map(doc => ({
        id: doc.id,
        titulo: doc.data().title || 'Pedido sem título',
        status: doc.data().status || 'pending',
        dataCriacao: doc.data().createdAt?.toDate() || new Date(),
        dataConclusao: doc.data().completedAt?.toDate(),
        adminResponsavel: doc.data().adminResponsavel,
        feedback: doc.data().feedback
      }))

      // Simular performance mensal
      const performanceMensal = []
      const agora = new Date()
      for (let i = 5; i >= 0; i--) {
        const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1)
        performanceMensal.push({
          mes: data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
          posts: Math.floor(Math.random() * 20) + 5,
          aprovacoes: Math.floor(Math.random() * 15) + 3,
          engajamento: Math.floor(Math.random() * 40) + 60,
          satisfacao: Math.floor(Math.random() * 20) + 80
        })
      }

      // Simular histórico do perfil
      const historicoPerfil = [
        {
          data: new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000),
          tipo: 'nicho' as const,
          descricao: 'Mudança de nicho',
          valorAnterior: 'Tecnologia',
          valorNovo: 'Marketing'
        },
        {
          data: new Date(agora.getTime() - 14 * 24 * 60 * 60 * 1000),
          tipo: 'cores' as const,
          descricao: 'Atualização da paleta de cores',
          valorAnterior: 'Azul',
          valorNovo: 'Verde'
        }
      ]

      // Simular log de interações
      const logInteracoes = [
        {
          data: new Date(agora.getTime() - 2 * 24 * 60 * 60 * 1000),
          tipo: 'chat' as const,
          admin: 'Admin João',
          assunto: 'Dúvida sobre conteúdo',
          resultado: 'Resolvido'
        },
        {
          data: new Date(agora.getTime() - 5 * 24 * 60 * 60 * 1000),
          tipo: 'feedback' as const,
          admin: 'Admin Maria',
          assunto: 'Feedback sobre post',
          resultado: 'Aplicado'
        }
      ]

      // Simular arquivo de conteúdos
      const arquivoConteudos = timelinePedidos.map(pedido => ({
        id: pedido.id,
        titulo: pedido.titulo,
        tipo: 'Post Instagram',
        dataCriacao: pedido.dataCriacao,
        status: pedido.status,
        engajamento: Math.floor(Math.random() * 100),
        downloadUrl: pedido.status === 'completed' ? '#download' : undefined
      }))

      setActivity({
        timelinePedidos,
        performanceMensal,
        historicoPerfil,
        logInteracoes,
        arquivoConteudos
      })

    } catch (error) {
      console.error('Erro ao carregar histórico de atividade:', error)
    }
  }

  const addReminder = () => {
    const novoLembrete = {
      id: Date.now().toString(),
      titulo: 'Novo lembrete',
      descricao: 'Descrição do lembrete',
      data: new Date(),
      concluido: false
    }
    
    setGoals(prev => ({
      ...prev,
      lembretesPersonalizados: [...prev.lembretesPersonalizados, novoLembrete]
    }))
  }

  const addGrowthGoal = () => {
    const novoObjetivo = 'Novo objetivo de crescimento'
    setGoals(prev => ({
      ...prev,
      objetivosCrescimento: [...prev.objetivosCrescimento, novoObjetivo]
    }))
  }

  const checkAchievements = () => {
    const novasConquistas = []
    
    // Verificar conquistas baseadas em métricas
    if (metrics.postsCriadosMes >= 10 && !goals.conquistas.find(c => c.id === '10-posts')) {
      novasConquistas.push({
        ...CONQUISTAS_DISPONIVEIS.find(c => c.id === '10-posts')!,
        data: new Date()
      })
    }
    
    if (metrics.taxaAprovacao >= 90 && !goals.conquistas.find(c => c.id === 'alta-aprovacao')) {
      novasConquistas.push({
        ...CONQUISTAS_DISPONIVEIS.find(c => c.id === 'alta-aprovacao')!,
        data: new Date()
      })
    }
    
    if (novasConquistas.length > 0) {
      setGoals(prev => ({
        ...prev,
        conquistas: [...prev.conquistas, ...novasConquistas]
      }))
      
      // Mostrar notificação de conquista
      alert(`🎉 Nova conquista desbloqueada: ${novasConquistas[0].titulo}!`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard pessoal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📊 Dashboard Pessoal Avançado
              </h1>
              <p className="text-gray-600 mt-1">
                Acompanhe seu progresso e conquiste seus objetivos
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                ← Voltar ao Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'metricas', name: 'Métricas Pessoais', icon: '📈' },
                { id: 'objetivos', name: 'Objetivos e Metas', icon: '🎯' },
                { id: 'historico', name: 'Histórico de Atividade', icon: '📅' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          
          {/* Métricas Pessoais */}
          {activeTab === 'metricas' && (
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Cards de Métricas */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    📊 Métricas do Mês
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {metrics.postsCriadosMes}
                      </div>
                      <div className="text-sm text-gray-600">Posts Criados</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {metrics.taxaAprovacao}%
                      </div>
                      <div className="text-sm text-gray-600">Taxa de Aprovação</div>
                    </div>
                    
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {metrics.tempoMedioResposta}d
                      </div>
                      <div className="text-sm text-gray-600">Tempo Médio</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        ⭐
                      </div>
                      <div className="text-sm text-gray-600">Mais Engajante</div>
                    </div>
                  </div>
                </div>

                {/* Conteúdo Mais Engajante */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    🔥 Conteúdo Mais Engajante
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-800">{metrics.conteudoMaisEngajante}</p>
                  </div>
                </div>
              </div>

              {/* Gráfico de Evolução */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📈 Evolução do Perfil
                </h3>
                
                <div className="space-y-4">
                  {metrics.evolucaoPerfil.map((periodo, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700">
                        {periodo.data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex space-x-4 text-sm text-gray-600">
                        <span>{periodo.metricas.posts} posts</span>
                        <span>{periodo.metricas.aprovacoes} aprov.</span>
                        <span>{periodo.metricas.engajamento}% eng.</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Objetivos e Metas */}
          {activeTab === 'objetivos' && (
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Metas Principais */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    🎯 Metas Principais
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">Posts por Mês</span>
                        <span className="text-sm text-gray-600">
                          {metrics.postsCriadosMes}/{goals.metaPostsMes}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((metrics.postsCriadosMes / goals.metaPostsMes) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">Meta de Engajamento</span>
                        <span className="text-sm text-gray-600">
                          {metrics.taxaAprovacao}%/{goals.metaEngajamento}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((metrics.taxaAprovacao / goals.metaEngajamento) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Objetivos de Crescimento */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      🚀 Objetivos de Crescimento
                    </h3>
                    <Button
                      onClick={addGrowthGoal}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                    >
                      + Adicionar
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {goals.objetivosCrescimento.map((objetivo, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-700">{objetivo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lembretes Personalizados */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      ⏰ Lembretes Personalizados
                    </h3>
                    <Button
                      onClick={addReminder}
                      className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm"
                    >
                      + Adicionar
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {goals.lembretesPersonalizados.map((lembrete) => (
                      <div key={lembrete.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-700">{lembrete.titulo}</div>
                          <div className="text-sm text-gray-600">{lembrete.descricao}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {lembrete.data.toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Conquistas */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    🏆 Conquistas
                  </h3>
                  <Button
                    onClick={checkAchievements}
                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm"
                  >
                    Verificar
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {goals.conquistas.map((conquista) => (
                    <div key={conquista.id} className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="text-center">
                        <div className="text-3xl mb-2">{conquista.icone}</div>
                        <div className="font-semibold text-gray-900 text-sm">{conquista.titulo}</div>
                        <div className="text-xs text-gray-600 mt-1">{conquista.descricao}</div>
                        <div className="text-xs text-gray-500 mt-2">
                          {conquista.data.toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Histórico de Atividade */}
          {activeTab === 'historico' && (
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Timeline de Pedidos */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📅 Timeline de Pedidos
                </h3>
                
                <div className="space-y-3">
                  {activity.timelinePedidos.map((pedido) => (
                    <div key={pedido.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        pedido.status === 'completed' ? 'bg-green-500' :
                        pedido.status === 'in_progress' ? 'bg-blue-500' :
                        pedido.status === 'rejected' ? 'bg-red-500' :
                        'bg-gray-400'
                      }`}></div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{pedido.titulo}</div>
                        <div className="text-sm text-gray-600">
                          {pedido.dataCriacao.toLocaleDateString('pt-BR')} - 
                          Status: {pedido.status}
                        </div>
                        {pedido.feedback && (
                          <div className="text-sm text-gray-500 mt-1">
                            Feedback: {pedido.feedback}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Mensal */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📊 Performance Mensal
                </h3>
                
                <div className="space-y-3">
                  {activity.performanceMensal.map((mes, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900 mb-2">{mes.mes}</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Posts:</span>
                          <span className="font-medium">{mes.posts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Aprovações:</span>
                          <span className="font-medium">{mes.aprovacoes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Engajamento:</span>
                          <span className="font-medium">{mes.engajamento}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Satisfação:</span>
                          <span className="font-medium">{mes.satisfacao}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Histórico do Perfil */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🔄 Histórico do Perfil
                </h3>
                
                <div className="space-y-3">
                  {activity.historicoPerfil.map((mudanca, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">{mudanca.descricao}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {mudanca.valorAnterior} → {mudanca.valorNovo}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {mudanca.data.toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Log de Interações */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  💬 Log de Interações
                </h3>
                
                <div className="space-y-3">
                  {activity.logInteracoes.map((interacao, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">{interacao.assunto}</div>
                          <div className="text-sm text-gray-600">
                            {interacao.tipo} com {interacao.admin}
                          </div>
                          <div className="text-sm text-gray-500">
                            Resultado: {interacao.resultado}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {interacao.data.toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arquivo de Conteúdos */}
              <div className="bg-white rounded-lg shadow-sm border p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📁 Arquivo de Conteúdos
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2">Título</th>
                        <th className="text-left py-2">Tipo</th>
                        <th className="text-left py-2">Data</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Engajamento</th>
                        <th className="text-left py-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activity.arquivoConteudos.map((conteudo) => (
                        <tr key={conteudo.id} className="border-b border-gray-100">
                          <td className="py-2 font-medium text-gray-900">{conteudo.titulo}</td>
                          <td className="py-2 text-gray-600">{conteudo.tipo}</td>
                          <td className="py-2 text-gray-600">
                            {conteudo.dataCriacao.toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              conteudo.status === 'completed' ? 'bg-green-100 text-green-800' :
                              conteudo.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              conteudo.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {conteudo.status}
                            </span>
                          </td>
                          <td className="py-2 text-gray-600">{conteudo.engajamento}%</td>
                          <td className="py-2">
                            {conteudo.downloadUrl && (
                              <button className="text-blue-600 hover:text-blue-800 text-sm">
                                📥 Download
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
