'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase'
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore'
import { Button } from '@/components/ui/Button'
import { ExecutiveReports } from './ExecutiveReports'

interface ContentPerformance {
  engajamentoMedio: number
  melhoresHorarios: Array<{ hora: string, engajamento: number }>
  conteudoMaisSucesso: string
  comparacaoConcorrentes: {
    mediaNicho: number
    suaPerformance: number
    diferencial: number
  }
  evolucaoPerformance: Array<{
    periodo: string
    engajamento: number
    alcance: number
    conversao: number
  }>
}

interface PersonalInsights {
  relatoriosSemanais: Array<{
    semana: string
    resumo: string
    insights: string[]
    recomendacoes: string[]
  }>
  sugestoesMelhoria: string[]
  alertasOportunidades: Array<{
    tipo: 'tendencia' | 'concorrencia' | 'engajamento' | 'horario'
    titulo: string
    descricao: string
    prioridade: 'alta' | 'media' | 'baixa'
  }>
  analiseTendencias: Array<{
    nicho: string
    tendencia: string
    impacto: 'alto' | 'medio' | 'baixo'
    recomendacao: string
  }>
  recomendacoesEstrategicas: string[]
}

interface GoalsAndKPIs {
  objetivos: Array<{
    id: string
    nome: string
    valorAtual: number
    valorMeta: number
    unidade: string
    prazo: Date
    status: 'em_andamento' | 'concluido' | 'atrasado'
  }>
  alertasProgresso: Array<{
    objetivoId: string
    tipo: 'sucesso' | 'atraso' | 'risco'
    mensagem: string
    data: Date
  }>
  marcosCelebrados: Array<{
    id: string
    titulo: string
    descricao: string
    data: Date
    icone: string
  }>
  ajustesEstrategia: Array<{
    data: Date
    motivo: string
    acao: string
    resultado: string
  }>
}

const HORARIOS_PUBLICACAO = [
  { hora: '06:00', engajamento: 75 },
  { hora: '08:00', engajamento: 85 },
  { hora: '10:00', engajamento: 90 },
  { hora: '12:00', engajamento: 95 },
  { hora: '14:00', engajamento: 80 },
  { hora: '16:00', engajamento: 88 },
  { hora: '18:00', engajamento: 92 },
  { hora: '20:00', engajamento: 87 },
  { hora: '22:00', engajamento: 70 }
]

const TENDENCIAS_NICHO = [
  {
    nicho: 'Marketing Digital',
    tendencia: 'Conteúdo em vídeo cresce 40%',
    impacto: 'alto' as const,
    recomendacao: 'Investir em Reels e Stories'
  },
  {
    nicho: 'Tecnologia',
    tendencia: 'IA e automação em alta',
    impacto: 'alto' as const,
    recomendacao: 'Criar conteúdo sobre IA'
  },
  {
    nicho: 'Saúde',
    tendencia: 'Bem-estar mental em foco',
    impacto: 'medio' as const,
    recomendacao: 'Abordar saúde mental'
  }
]

export const PersonalAnalytics = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('performance')
  
  const [performance, setPerformance] = useState<ContentPerformance>({
    engajamentoMedio: 0,
    melhoresHorarios: [],
    conteudoMaisSucesso: '',
    comparacaoConcorrentes: {
      mediaNicho: 0,
      suaPerformance: 0,
      diferencial: 0
    },
    evolucaoPerformance: []
  })
  
  const [insights, setInsights] = useState<PersonalInsights>({
    relatoriosSemanais: [],
    sugestoesMelhoria: [],
    alertasOportunidades: [],
    analiseTendencias: [],
    recomendacoesEstrategicas: []
  })
  
  const [goals, setGoals] = useState<GoalsAndKPIs>({
    objetivos: [],
    alertasProgresso: [],
    marcosCelebrados: [],
    ajustesEstrategia: []
  })

  useEffect(() => {
    if (user) {
      loadAnalyticsData()
    }
  }, [user])

  const loadAnalyticsData = async () => {
    if (!user) return

    try {
      await loadContentPerformance()
      await loadPersonalInsights()
      await loadGoalsAndKPIs()
    } catch (error) {
      console.error('Erro ao carregar analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadContentPerformance = async () => {
    // Simular dados de performance
    const engajamentoMedio = Math.floor(Math.random() * 30) + 70
    const melhoresHorarios = HORARIOS_PUBLICACAO.sort((a, b) => b.engajamento - a.engajamento).slice(0, 5)
    
    const evolucaoPerformance = []
    for (let i = 5; i >= 0; i--) {
      const data = new Date()
      data.setMonth(data.getMonth() - i)
      evolucaoPerformance.push({
        periodo: data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        engajamento: Math.floor(Math.random() * 20) + 80,
        alcance: Math.floor(Math.random() * 1000) + 500,
        conversao: Math.floor(Math.random() * 5) + 2
      })
    }

    setPerformance({
      engajamentoMedio,
      melhoresHorarios,
      conteudoMaisSucesso: 'Post sobre tendências de marketing digital',
      comparacaoConcorrentes: {
        mediaNicho: 75,
        suaPerformance: engajamentoMedio,
        diferencial: engajamentoMedio - 75
      },
      evolucaoPerformance
    })
  }

  const loadPersonalInsights = async () => {
    // Simular insights personalizados
    const relatoriosSemanais = [
      {
        semana: 'Semana atual',
        resumo: 'Performance acima da média com crescimento de 15%',
        insights: [
          'Posts sobre IA tiveram 40% mais engajamento',
          'Horário das 12h-14h é mais eficaz',
          'Conteúdo visual performa melhor'
        ],
        recomendacoes: [
          'Aumentar posts sobre IA',
          'Focar no horário de almoço',
          'Investir mais em conteúdo visual'
        ]
      }
    ]

    const sugestoesMelhoria = [
      'Use mais hashtags específicas do nicho',
      'Poste mais conteúdo educativo',
      'Interaja mais com comentários',
      'Teste diferentes formatos de conteúdo'
    ]

    const alertasOportunidades = [
      {
        tipo: 'tendencia' as const,
        titulo: 'Tendência em alta: Marketing de Influência',
        descricao: 'Conteúdo sobre influenciadores tem 60% mais engajamento',
        prioridade: 'alta' as const
      },
      {
        tipo: 'horario' as const,
        titulo: 'Horário otimizado descoberto',
        descricao: 'Posts às 12h têm 25% mais alcance',
        prioridade: 'media' as const
      }
    ]

    setInsights({
      relatoriosSemanais,
      sugestoesMelhoria,
      alertasOportunidades,
      analiseTendencias: TENDENCIAS_NICHO,
      recomendacoesEstrategicas: [
        'Focar em conteúdo educativo',
        'Aumentar frequência de posts',
        'Investir em storytelling',
        'Criar série de posts temáticos'
      ]
    })
  }

  const loadGoalsAndKPIs = async () => {
    const objetivos = [
      {
        id: '1',
        nome: 'Engajamento Médio',
        valorAtual: 85,
        valorMeta: 90,
        unidade: '%',
        prazo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'em_andamento' as const
      },
      {
        id: '2',
        nome: 'Alcance Mensal',
        valorAtual: 15000,
        valorMeta: 20000,
        unidade: 'pessoas',
        prazo: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 'em_andamento' as const
      }
    ]

    const alertasProgresso = [
      {
        objetivoId: '1',
        tipo: 'sucesso' as const,
        mensagem: 'Meta de engajamento 80% atingida!',
        data: new Date()
      }
    ]

    const marcosCelebrados = [
      {
        id: '1',
        titulo: '10K Seguidores',
        descricao: 'Atingiu 10.000 seguidores',
        data: new Date(),
        icone: '🎉'
      }
    ]

    setGoals({
      objetivos,
      alertasProgresso,
      marcosCelebrados,
      ajustesEstrategia: [
        {
          data: new Date(),
          motivo: 'Baixo engajamento em posts educativos',
          acao: 'Mudança para formato storytelling',
          resultado: 'Aumento de 30% no engajamento'
        }
      ]
    })
  }

  const generateWeeklyReport = () => {
    const novoRelatorio = {
      semana: `Semana ${new Date().getWeek()}`,
      resumo: 'Relatório gerado automaticamente',
      insights: ['Insight 1', 'Insight 2'],
      recomendacoes: ['Recomendação 1', 'Recomendação 2']
    }
    
    setInsights(prev => ({
      ...prev,
      relatoriosSemanais: [novoRelatorio, ...prev.relatoriosSemanais]
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando analytics...</p>
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
                📊 Analytics Pessoais
              </h1>
              <p className="text-gray-600 mt-1">
                Insights profundos sobre sua performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={generateWeeklyReport}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                📈 Gerar Relatório
              </Button>
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
                { id: 'performance', name: 'Performance dos Conteúdos', icon: '📈' },
                { id: 'insights', name: 'Insights Personalizados', icon: '💡' },
                { id: 'metas', name: 'Metas e KPIs', icon: '🎯' },
                { id: 'relatorios', name: 'Relatórios Executivos', icon: '📋' }
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
          
          {/* Performance dos Conteúdos */}
          {activeTab === 'performance' && (
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Métricas Principais */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    📊 Métricas Principais
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {performance.engajamentoMedio}%
                      </div>
                      <div className="text-sm text-gray-600">Engajamento Médio</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {performance.comparacaoConcorrentes.diferencial > 0 ? '+' : ''}{performance.comparacaoConcorrentes.diferencial}%
                      </div>
                      <div className="text-sm text-gray-600">vs Concorrentes</div>
                    </div>
                  </div>
                </div>

                {/* Melhores Horários */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    ⏰ Melhores Horários de Publicação
                  </h3>
                  
                  <div className="space-y-3">
                    {performance.melhoresHorarios.map((horario, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900">{horario.hora}</div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${horario.engajamento}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{horario.engajamento}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conteúdo Mais Bem-Sucedido */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    🏆 Conteúdo Mais Bem-Sucedido
                  </h3>
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <p className="text-gray-800 font-medium">{performance.conteudoMaisSucesso}</p>
                    <p className="text-sm text-gray-600 mt-2">Engajamento: 95% | Alcance: 15K</p>
                  </div>
                </div>
              </div>

              {/* Evolução da Performance */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📈 Evolução da Performance
                </h3>
                
                <div className="space-y-4">
                  {performance.evolucaoPerformance.map((periodo, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900 mb-3">{periodo.periodo}</div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">{periodo.engajamento}%</div>
                          <div className="text-gray-600">Engajamento</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{periodo.alcance}</div>
                          <div className="text-gray-600">Alcance</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-purple-600">{periodo.conversao}%</div>
                          <div className="text-gray-600">Conversão</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Insights Personalizados */}
          {activeTab === 'insights' && (
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Relatórios Semanais */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  📋 Relatórios Semanais Automáticos
                </h2>
                
                <div className="space-y-4">
                  {insights.relatoriosSemanais.map((relatorio, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-gray-900 mb-2">{relatorio.semana}</div>
                      <p className="text-sm text-gray-600 mb-3">{relatorio.resumo}</p>
                      
                      <div className="space-y-2">
                        <div>
                          <div className="text-sm font-medium text-gray-700">Insights:</div>
                          <ul className="text-sm text-gray-600 ml-4">
                            {relatorio.insights.map((insight, i) => (
                              <li key={i}>• {insight}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium text-gray-700">Recomendações:</div>
                          <ul className="text-sm text-gray-600 ml-4">
                            {relatorio.recomendacoes.map((rec, i) => (
                              <li key={i}>• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alertas de Oportunidades */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🚨 Alertas de Oportunidades
                </h3>
                
                <div className="space-y-3">
                  {insights.alertasOportunidades.map((alerta, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      alerta.prioridade === 'alta' ? 'bg-red-50 border-red-200' :
                      alerta.prioridade === 'media' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="font-medium text-gray-900">{alerta.titulo}</div>
                      <p className="text-sm text-gray-600 mt-1">{alerta.descricao}</p>
                      <div className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                        alerta.prioridade === 'alta' ? 'bg-red-100 text-red-800' :
                        alerta.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alerta.prioridade.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Análise de Tendências */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🔍 Análise de Tendências do Nicho
                </h3>
                
                <div className="space-y-3">
                  {insights.analiseTendencias.map((tendencia, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">{tendencia.tendencia}</div>
                      <p className="text-sm text-gray-600 mt-1">{tendencia.recomendacao}</p>
                      <div className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                        tendencia.impacto === 'alto' ? 'bg-red-100 text-red-800' :
                        tendencia.impacto === 'medio' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        Impacto: {tendencia.impacto.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recomendações Estratégicas */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  💡 Recomendações Estratégicas
                </h3>
                
                <div className="space-y-3">
                  {insights.recomendacoesEstrategicas.map((recomendacao, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600 mt-1">💡</span>
                      <span className="text-gray-800">{recomendacao}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Metas e KPIs */}
          {activeTab === 'metas' && (
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Objetivos */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  🎯 Metas e KPIs
                </h2>
                
                <div className="space-y-4">
                  {goals.objetivos.map((objetivo) => (
                    <div key={objetivo.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">{objetivo.nome}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          objetivo.status === 'concluido' ? 'bg-green-100 text-green-800' :
                          objetivo.status === 'atrasado' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {objetivo.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          {objetivo.valorAtual}{objetivo.unidade} / {objetivo.valorMeta}{objetivo.unidade}
                        </span>
                        <span className="text-sm text-gray-500">
                          {Math.round((objetivo.valorAtual / objetivo.valorMeta) * 100)}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((objetivo.valorAtual / objetivo.valorMeta) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alertas de Progresso */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🔔 Alertas de Progresso
                </h3>
                
                <div className="space-y-3">
                  {goals.alertasProgresso.map((alerta, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      alerta.tipo === 'sucesso' ? 'bg-green-50 border-green-200' :
                      alerta.tipo === 'atraso' ? 'bg-red-50 border-red-200' :
                      'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className="font-medium text-gray-900">{alerta.mensagem}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {alerta.data.toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Marcos Celebrados */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🏆 Marcos Celebrados
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {goals.marcosCelebrados.map((marco) => (
                    <div key={marco.id} className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="text-center">
                        <div className="text-3xl mb-2">{marco.icone}</div>
                        <div className="font-semibold text-gray-900 text-sm">{marco.titulo}</div>
                        <div className="text-xs text-gray-600 mt-1">{marco.descricao}</div>
                        <div className="text-xs text-gray-500 mt-2">
                          {marco.data.toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ajustes de Estratégia */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🔄 Ajustes de Estratégia
                </h3>
                
                <div className="space-y-3">
                  {goals.ajustesEstrategia.map((ajuste, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900 mb-2">{ajuste.motivo}</div>
                      <div className="text-sm text-gray-600 mb-1">
                        <strong>Ação:</strong> {ajuste.acao}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Resultado:</strong> {ajuste.resultado}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {ajuste.data.toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Relatórios Executivos */}
          {activeTab === 'relatorios' && (
            <ExecutiveReports />
          )}
        </div>
      </div>
    </div>
  )
}
