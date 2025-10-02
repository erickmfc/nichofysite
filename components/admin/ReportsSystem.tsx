'use client'

import { useState, useEffect } from 'react'
import { useAdminRealData } from '@/hooks/useAdminRealData'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'

interface ReportData {
  id: string
  title: string
  type: 'users' | 'content' | 'engagement' | 'revenue' | 'system'
  period: string
  generatedAt: Date
  data: any
  summary: string
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: string
  parameters: Array<{
    name: string
    type: 'date' | 'select' | 'number'
    options?: string[]
    required: boolean
  }>
}

export const ReportsSystem = () => {
  const { stats } = useAdminRealData()
  const [reports, setReports] = useState<ReportData[]>([])
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [reportParameters, setReportParameters] = useState<{ [key: string]: any }>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<'templates' | 'reports' | 'schedule'>('templates')

  useEffect(() => {
    loadTemplates()
    loadReports()
  }, [])

  const loadTemplates = () => {
    const defaultTemplates: ReportTemplate[] = [
      {
        id: 'user-analysis',
        name: 'Análise de Usuários',
        description: 'Relatório detalhado sobre crescimento e comportamento dos usuários',
        type: 'users',
        parameters: [
          { name: 'startDate', type: 'date', required: true },
          { name: 'endDate', type: 'date', required: true },
          { name: 'includeInactive', type: 'select', options: ['Sim', 'Não'], required: false }
        ]
      },
      {
        id: 'content-performance',
        name: 'Performance de Conteúdo',
        description: 'Análise de engajamento e aprovação de posts',
        type: 'content',
        parameters: [
          { name: 'startDate', type: 'date', required: true },
          { name: 'endDate', type: 'date', required: true },
          { name: 'category', type: 'select', options: ['Todos', 'Tecnologia', 'Saúde', 'Finanças', 'Educação'], required: false }
        ]
      },
      {
        id: 'engagement-metrics',
        name: 'Métricas de Engajamento',
        description: 'Análise detalhada de likes, compartilhamentos e comentários',
        type: 'engagement',
        parameters: [
          { name: 'period', type: 'select', options: ['7 dias', '30 dias', '90 dias', '1 ano'], required: true },
          { name: 'minEngagement', type: 'number', required: false }
        ]
      },
      {
        id: 'revenue-report',
        name: 'Relatório de Receita',
        description: 'Análise financeira e conversões',
        type: 'revenue',
        parameters: [
          { name: 'startDate', type: 'date', required: true },
          { name: 'endDate', type: 'date', required: true },
          { name: 'currency', type: 'select', options: ['BRL', 'USD', 'EUR'], required: false }
        ]
      },
      {
        id: 'system-health',
        name: 'Saúde do Sistema',
        description: 'Relatório de performance e monitoramento técnico',
        type: 'system',
        parameters: [
          { name: 'period', type: 'select', options: ['24h', '7 dias', '30 dias'], required: true },
          { name: 'includeLogs', type: 'select', options: ['Sim', 'Não'], required: false }
        ]
      }
    ]
    setTemplates(defaultTemplates)
  }

  const loadReports = async () => {
    try {
      // Simular carregamento de relatórios existentes
      const mockReports: ReportData[] = [
        {
          id: '1',
          title: 'Relatório Mensal - Janeiro 2024',
          type: 'users',
          period: 'Janeiro 2024',
          generatedAt: new Date('2024-01-31'),
          data: { totalUsers: 1250, newUsers: 180, growthRate: 16.8 },
          summary: 'Crescimento consistente de usuários com 16.8% de aumento'
        },
        {
          id: '2',
          title: 'Performance de Conteúdo - Q1 2024',
          type: 'content',
          period: 'Q1 2024',
          generatedAt: new Date('2024-03-31'),
          data: { totalPosts: 3420, approvedPosts: 2890, approvalRate: 84.5 },
          summary: 'Taxa de aprovação de 84.5% com qualidade crescente'
        }
      ]
      setReports(mockReports)
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error)
    }
  }

  const generateReport = async () => {
    if (!selectedTemplate) return

    setIsGenerating(true)
    try {
      const template = templates.find(t => t.id === selectedTemplate)
      if (!template) return

      // Simular geração de relatório
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newReport: ReportData = {
        id: Date.now().toString(),
        title: `${template.name} - ${new Date().toLocaleDateString('pt-BR')}`,
        type: template.type as any,
        period: reportParameters.period || 'Período atual',
        generatedAt: new Date(),
        data: generateMockReportData(template.type),
        summary: generateReportSummary(template.type, reportParameters)
      }

      setReports(prev => [newReport, ...prev])
      setSelectedTemplate('')
      setReportParameters({})

    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMockReportData = (type: string) => {
    switch (type) {
      case 'users':
        return {
          totalUsers: stats.totalUsers,
          newUsers: stats.usersThisMonth,
          activeUsers: Math.floor(stats.totalUsers * 0.7),
          retentionRate: 85.2,
          growthRate: 12.5
        }
      case 'content':
        return {
          totalPosts: stats.totalPosts,
          approvedPosts: stats.approvedPosts,
          pendingPosts: stats.pendingApprovals,
          approvalRate: (stats.approvedPosts / stats.totalPosts) * 100,
          avgPostsPerUser: stats.totalPosts / stats.totalUsers
        }
      case 'engagement':
        return {
          totalLikes: 15420,
          totalShares: 3240,
          totalComments: 1890,
          avgEngagementRate: 8.7,
          topPost: 'Como criar conteúdo viral'
        }
      case 'revenue':
        return {
          totalRevenue: 12500,
          monthlyRevenue: 3200,
          conversionRate: 3.2,
          avgOrderValue: 45,
          topProduct: 'Plano Premium'
        }
      case 'system':
        return {
          uptime: 99.9,
          avgResponseTime: 120,
          errorRate: 0.1,
          pageViews: 15420,
          serverLoad: 65
        }
      default:
        return {}
    }
  }

  const generateReportSummary = (type: string, params: any) => {
    switch (type) {
      case 'users':
        return `Análise completa dos usuários mostrando crescimento de ${stats.usersThisMonth} novos usuários este mês.`
      case 'content':
        return `Performance de conteúdo com taxa de aprovação de ${((stats.approvedPosts / stats.totalPosts) * 100).toFixed(1)}%.`
      case 'engagement':
        return 'Métricas de engajamento indicam crescimento consistente na interação dos usuários.'
      case 'revenue':
        return 'Receita mensal de R$ 3.200 com conversão de 3.2% dos visitantes.'
      case 'system':
        return 'Sistema operando com 99.9% de uptime e performance estável.'
      default:
        return 'Relatório gerado com sucesso.'
    }
  }

  const exportReport = (report: ReportData, format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exportando relatório ${report.id} em formato ${format}`)
    // Implementar exportação real
  }

  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId))
  }

  const TemplateCard = ({ template }: { template: ReportTemplate }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
          <p className="text-gray-400 text-sm">{template.description}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          template.type === 'users' ? 'bg-blue-500' :
          template.type === 'content' ? 'bg-green-500' :
          template.type === 'engagement' ? 'bg-purple-500' :
          template.type === 'revenue' ? 'bg-yellow-500' :
          'bg-gray-500'
        }`}>
          {template.type}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-2">Parâmetros necessários:</p>
        <div className="space-y-1">
          {template.parameters.map((param, index) => (
            <div key={index} className="flex items-center text-sm">
              <span className="text-gray-400 w-24">{param.name}:</span>
              <span className={`text-xs px-2 py-1 rounded ${
                param.type === 'date' ? 'bg-blue-100 text-blue-800' :
                param.type === 'select' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {param.type}
              </span>
              {param.required && <span className="text-red-400 ml-2">*</span>}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setSelectedTemplate(template.id)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
      >
        Usar Template
      </button>
    </div>
  )

  const ReportCard = ({ report }: { report: ReportData }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{report.title}</h3>
          <p className="text-gray-400 text-sm">{report.period}</p>
          <p className="text-gray-500 text-xs mt-1">
            Gerado em {report.generatedAt.toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          report.type === 'users' ? 'bg-blue-500' :
          report.type === 'content' ? 'bg-green-500' :
          report.type === 'engagement' ? 'bg-purple-500' :
          report.type === 'revenue' ? 'bg-yellow-500' :
          'bg-gray-500'
        }`}>
          {report.type}
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-4">{report.summary}</p>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => exportReport(report, 'pdf')}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            📄 PDF
          </button>
          <button
            onClick={() => exportReport(report, 'excel')}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            📊 Excel
          </button>
          <button
            onClick={() => exportReport(report, 'csv')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            📋 CSV
          </button>
        </div>
        
        <button
          onClick={() => deleteReport(report.id)}
          className="text-red-400 hover:text-red-300 text-sm transition-colors"
        >
          🗑️ Excluir
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📊 Sistema de Relatórios</h1>
            <p className="text-gray-400">Gere e gerencie relatórios detalhados do sistema</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'templates'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📋 Templates
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'reports'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📊 Relatórios
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'schedule'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            ⏰ Agendamento
          </button>
        </div>

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Templates de Relatórios</h2>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                ➕ Novo Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {templates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>

            {/* Gerador de Relatório */}
            {selectedTemplate && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Gerar Relatório: {templates.find(t => t.id === selectedTemplate)?.name}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {templates.find(t => t.id === selectedTemplate)?.parameters.map((param, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {param.name} {param.required && <span className="text-red-400">*</span>}
                      </label>
                      
                      {param.type === 'date' && (
                        <input
                          type="date"
                          value={reportParameters[param.name] || ''}
                          onChange={(e) => setReportParameters(prev => ({
                            ...prev,
                            [param.name]: e.target.value
                          }))}
                          className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      )}
                      
                      {param.type === 'select' && (
                        <select
                          value={reportParameters[param.name] || ''}
                          onChange={(e) => setReportParameters(prev => ({
                            ...prev,
                            [param.name]: e.target.value
                          }))}
                          className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                          <option value="">Selecione...</option>
                          {param.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                      
                      {param.type === 'number' && (
                        <input
                          type="number"
                          value={reportParameters[param.name] || ''}
                          onChange={(e) => setReportParameters(prev => ({
                            ...prev,
                            [param.name]: e.target.value
                          }))}
                          className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={generateReport}
                    disabled={isGenerating}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {isGenerating ? '🔄 Gerando...' : '📊 Gerar Relatório'}
                  </button>
                  <button
                    onClick={() => setSelectedTemplate('')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Relatórios Gerados</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Buscar relatórios..."
                  className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  🔍 Buscar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map(report => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>

            {reports.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum relatório encontrado</h3>
                <p className="text-gray-400">Gere seu primeiro relatório usando os templates disponíveis</p>
              </div>
            )}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Relatórios Agendados</h2>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                ➕ Novo Agendamento
              </button>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏰</div>
                <h3 className="text-xl font-semibold text-white mb-2">Sistema de Agendamento</h3>
                <p className="text-gray-400 mb-6">
                  Configure relatórios automáticos para serem gerados periodicamente
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                  Configurar Agendamento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
