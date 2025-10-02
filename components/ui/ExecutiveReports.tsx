'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

interface ExecutiveReport {
  periodo: string
  resumoExecutivo: string
  metricasPrincipais: {
    engajamento: number
    alcance: number
    conversao: number
    crescimento: number
  }
  insightsChave: string[]
  recomendacoesEstrategicas: string[]
  comparacaoPeriodoAnterior: {
    engajamento: number
    alcance: number
    conversao: number
  }
  proximosPassos: string[]
}

export const ExecutiveReports = () => {
  const { user } = useAuth()
  const [reports, setReports] = useState<ExecutiveReport[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateExecutiveReport = async () => {
    setIsGenerating(true)
    
    // Simular geração de relatório executivo
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const novoRelatorio: ExecutiveReport = {
      periodo: `Relatório ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
      resumoExecutivo: 'Performance excepcional com crescimento consistente de 25% no engajamento e 40% no alcance. Conteúdo sobre IA e automação lidera as métricas.',
      metricasPrincipais: {
        engajamento: 87,
        alcance: 18500,
        conversao: 4.2,
        crescimento: 25
      },
      insightsChave: [
        'Posts sobre IA têm 60% mais engajamento',
        'Horário das 12h-14h é mais eficaz',
        'Conteúdo visual performa 40% melhor',
        'Hashtags específicas aumentam alcance em 30%'
      ],
      recomendacoesEstrategicas: [
        'Aumentar frequência de posts sobre IA',
        'Focar no horário de almoço (12h-14h)',
        'Investir mais em conteúdo visual',
        'Criar série temática sobre automação'
      ],
      comparacaoPeriodoAnterior: {
        engajamento: 15,
        alcance: 40,
        conversao: 8
      },
      proximosPassos: [
        'Implementar estratégia de conteúdo visual',
        'Agendar posts no horário otimizado',
        'Desenvolver série sobre IA',
        'Monitorar métricas de conversão'
      ]
    }
    
    setReports(prev => [novoRelatorio, ...prev])
    setIsGenerating(false)
  }

  const exportReport = (report: ExecutiveReport) => {
    const content = `
RELATÓRIO EXECUTIVO - ${report.periodo}

RESUMO EXECUTIVO:
${report.resumoExecutivo}

MÉTRICAS PRINCIPAIS:
- Engajamento: ${report.metricasPrincipais.engajamento}%
- Alcance: ${report.metricasPrincipais.alcance.toLocaleString()} pessoas
- Conversão: ${report.metricasPrincipais.conversao}%
- Crescimento: ${report.metricasPrincipais.crescimento}%

INSIGHTS CHAVE:
${report.insightsChave.map(insight => `• ${insight}`).join('\n')}

RECOMENDAÇÕES ESTRATÉGICAS:
${report.recomendacoesEstrategicas.map(rec => `• ${rec}`).join('\n')}

COMPARAÇÃO COM PERÍODO ANTERIOR:
- Engajamento: +${report.comparacaoPeriodoAnterior.engajamento}%
- Alcance: +${report.comparacaoPeriodoAnterior.alcance}%
- Conversão: +${report.comparacaoPeriodoAnterior.conversao}%

PRÓXIMOS PASSOS:
${report.proximosPassos.map(passo => `• ${passo}`).join('\n')}
    `
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-executivo-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          📋 Relatórios Executivos
        </h3>
        <Button
          onClick={generateExecutiveReport}
          disabled={isGenerating}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          {isGenerating ? 'Gerando...' : '📊 Gerar Relatório'}
        </Button>
      </div>
      
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-600">
              Nenhum relatório executivo gerado ainda.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Clique em "Gerar Relatório" para criar seu primeiro relatório executivo.
            </p>
          </div>
        ) : (
          reports.map((report, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{report.periodo}</h4>
                <Button
                  onClick={() => exportReport(report)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                >
                  📥 Exportar
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Resumo Executivo */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-gray-900 mb-2">Resumo Executivo</h5>
                  <p className="text-gray-700">{report.resumoExecutivo}</p>
                </div>
                
                {/* Métricas Principais */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{report.metricasPrincipais.engajamento}%</div>
                    <div className="text-sm text-gray-600">Engajamento</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{report.metricasPrincipais.alcance.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Alcance</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{report.metricasPrincipais.conversao}%</div>
                    <div className="text-sm text-gray-600">Conversão</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">+{report.metricasPrincipais.crescimento}%</div>
                    <div className="text-sm text-gray-600">Crescimento</div>
                  </div>
                </div>
                
                {/* Insights e Recomendações */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Insights Chave</h5>
                    <ul className="space-y-1">
                      {report.insightsChave.map((insight, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Recomendações Estratégicas</h5>
                    <ul className="space-y-1">
                      {report.recomendacoesEstrategicas.map((rec, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Comparação e Próximos Passos */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Comparação com Período Anterior</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Engajamento:</span>
                        <span className="text-green-600 font-medium">+{report.comparacaoPeriodoAnterior.engajamento}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Alcance:</span>
                        <span className="text-green-600 font-medium">+{report.comparacaoPeriodoAnterior.alcance}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Conversão:</span>
                        <span className="text-green-600 font-medium">+{report.comparacaoPeriodoAnterior.conversao}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Próximos Passos</h5>
                    <ul className="space-y-1">
                      {report.proximosPassos.map((passo, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start">
                          <span className="text-orange-500 mr-2">→</span>
                          {passo}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
