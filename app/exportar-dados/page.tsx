'use client'

import React, { useState } from 'react'

interface ExportData {
  analytics: any[]
  content: any[]
  templates: any[]
  calendar: any[]
  user: any
}

export default function DataExportPage() {
  const [isExporting, setIsExporting] = useState(false)
  const [selectedData, setSelectedData] = useState({
    analytics: true,
    content: true,
    templates: true,
    calendar: true,
    user: true
  })
  const [exportFormat, setExportFormat] = useState('json')

  // Dados simulados para demonstração
  const mockData: ExportData = {
    analytics: [
      { date: '2024-01-15', views: 2100, engagement: 4.2, platform: 'Instagram' },
      { date: '2024-01-14', views: 1800, engagement: 3.8, platform: 'Blog' },
      { date: '2024-01-13', views: 1500, engagement: 5.1, platform: 'LinkedIn' }
    ],
    content: [
      { id: 1, title: 'Direito Trabalhista', type: 'Post', status: 'Published', created: '2024-01-15' },
      { id: 2, title: 'Saúde Mental', type: 'Article', status: 'Published', created: '2024-01-14' },
      { id: 3, title: 'IA e Direito', type: 'Post', status: 'Draft', created: '2024-01-13' }
    ],
    templates: [
      { id: 1, name: 'Post Motivacional', category: 'Instagram', usage: 15 },
      { id: 2, name: 'Dica Profissional', category: 'LinkedIn', usage: 12 },
      { id: 3, name: 'Pergunta Engajante', category: 'Instagram', usage: 8 }
    ],
    calendar: [
      { date: '2024-01-20', content: 'Post sobre Tecnologia', platform: 'Instagram' },
      { date: '2024-01-22', content: 'Artigo sobre Marketing', platform: 'Blog' },
      { date: '2024-01-25', content: 'Post sobre Inovação', platform: 'LinkedIn' }
    ],
    user: {
      name: 'João Silva',
      email: 'joao@exemplo.com',
      profession: 'Advogado',
      company: 'Silva & Associados',
      preferences: {
        niches: ['Direito', 'Saúde'],
        platforms: ['Instagram', 'LinkedIn'],
        tone: 'Profissional'
      }
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const dataToExport: any = {}
      
      if (selectedData.analytics) dataToExport.analytics = mockData.analytics
      if (selectedData.content) dataToExport.content = mockData.content
      if (selectedData.templates) dataToExport.templates = mockData.templates
      if (selectedData.calendar) dataToExport.calendar = mockData.calendar
      if (selectedData.user) dataToExport.user = mockData.user

      if (exportFormat === 'json') {
        const jsonData = JSON.stringify(dataToExport, null, 2)
        const blob = new Blob([jsonData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `nichofy-data-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else if (exportFormat === 'csv') {
        // Converter para CSV
        const csvData = convertToCSV(dataToExport)
        const blob = new Blob([csvData], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `nichofy-data-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else if (exportFormat === 'pdf') {
        // Simular geração de PDF
        console.log('PDF gerado com sucesso!')
      }

      console.log('Exportação concluída!')
      
    } catch (err) {
      console.error('Erro na exportação:', err)
    } finally {
      setIsExporting(false)
    }
  }

  const convertToCSV = (data: any) => {
    let csv = ''
    
    // Analytics
    if (data.analytics) {
      csv += 'Analytics\n'
      csv += 'Data,Visualizações,Engajamento,Plataforma\n'
      data.analytics.forEach((item: any) => {
        csv += `${item.date},${item.views},${item.engagement},${item.platform}\n`
      })
      csv += '\n'
    }
    
    // Content
    if (data.content) {
      csv += 'Conteúdos\n'
      csv += 'ID,Título,Tipo,Status,Data de Criação\n'
      data.content.forEach((item: any) => {
        csv += `${item.id},${item.title},${item.type},${item.status},${item.created}\n`
      })
      csv += '\n'
    }
    
    return csv
  }

  const ExportCard: React.FC<{
    title: string
    description: string
    count: number
    checked: boolean
    onChange: (checked: boolean) => void
  }> = ({ title, description, count, checked, onChange }) => {
    return (
      <div className={`border rounded-lg p-4 cursor-pointer transition-all ${
        checked ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`} onClick={() => onChange(!checked)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onChange(!checked)}
              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">{count}</div>
            <div className="text-xs text-gray-500">registros</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Exportação de Dados</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Selecionar Dados para Exportar</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <ExportCard
              title="Analytics"
              description="Métricas de performance e engajamento"
              count={mockData.analytics.length}
              checked={selectedData.analytics}
              onChange={(checked) => setSelectedData(prev => ({ ...prev, analytics: checked }))}
            />
            <ExportCard
              title="Conteúdos"
              description="Todos os conteúdos criados"
              count={mockData.content.length}
              checked={selectedData.content}
              onChange={(checked) => setSelectedData(prev => ({ ...prev, content: checked }))}
            />
            <ExportCard
              title="Templates"
              description="Templates personalizados e uso"
              count={mockData.templates.length}
              checked={selectedData.templates}
              onChange={(checked) => setSelectedData(prev => ({ ...prev, templates: checked }))}
            />
            <ExportCard
              title="Calendário"
              description="Conteúdos programados"
              count={mockData.calendar.length}
              checked={selectedData.calendar}
              onChange={(checked) => setSelectedData(prev => ({ ...prev, calendar: checked }))}
            />
            <ExportCard
              title="Perfil"
              description="Dados pessoais e preferências"
              count={1}
              checked={selectedData.user}
              onChange={(checked) => setSelectedData(prev => ({ ...prev, user: checked }))}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Formato de Exportação</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                exportFormat === 'json' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setExportFormat('json')}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">📄</div>
                <h3 className="font-semibold">JSON</h3>
                <p className="text-sm text-gray-600">Formato estruturado</p>
              </div>
            </div>
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                exportFormat === 'csv' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setExportFormat('csv')}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold">CSV</h3>
                <p className="text-sm text-gray-600">Planilha compatível</p>
              </div>
            </div>
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                exportFormat === 'pdf' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setExportFormat('pdf')}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">📋</div>
                <h3 className="font-semibold">PDF</h3>
                <p className="text-sm text-gray-600">Relatório formatado</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Resumo da Exportação</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Dados selecionados:</strong>
                <ul className="mt-1 space-y-1">
                  {selectedData.analytics && <li>• Analytics ({mockData.analytics.length} registros)</li>}
                  {selectedData.content && <li>• Conteúdos ({mockData.content.length} registros)</li>}
                  {selectedData.templates && <li>• Templates ({mockData.templates.length} registros)</li>}
                  {selectedData.calendar && <li>• Calendário ({mockData.calendar.length} registros)</li>}
                  {selectedData.user && <li>• Perfil (1 registro)</li>}
                </ul>
              </div>
              <div>
                <strong>Formato:</strong> {exportFormat.toUpperCase()}<br/>
                <strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}<br/>
                <strong>Tamanho estimado:</strong> ~2.5 MB
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isExporting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isExporting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Exportando...
              </div>
            ) : (
              'Exportar Dados'
            )}
          </button>
          
          <button
            onClick={() => console.log('Informação sobre privacidade: Os dados são exportados conforme a LGPD. Seus dados pessoais são protegidos.')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
          >
            Informações sobre Privacidade
          </button>
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">ℹ️ Informações Importantes</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Os dados são exportados conforme a Lei Geral de Proteção de Dados (LGPD)</li>
            <li>• Você pode solicitar a exclusão de seus dados a qualquer momento</li>
            <li>• Os dados exportados são apenas seus e não são compartilhados com terceiros</li>
            <li>• Recomendamos manter backups regulares dos seus dados</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
