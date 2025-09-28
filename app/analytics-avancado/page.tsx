'use client'

import React, { useState, useEffect } from 'react'
import { useAnimatedCounter, useAnimatedProgress, StaggeredAnimation } from '@/hooks/useMicroInteractions'

interface AnalyticsData {
  totalViews: number
  engagement: number
  newFollowers: number
  contentCreated: number
  topPlatforms: Array<{
    name: string
    views: number
    percentage: number
    color: string
  }>
  topContent: Array<{
    title: string
    platform: string
    views: number
    engagement: number
  }>
  monthlyTrend: Array<{
    month: string
    views: number
    engagement: number
    followers: number
  }>
  demographics: {
    ageGroups: Array<{ age: string; percentage: number }>
    locations: Array<{ location: string; percentage: number }>
    devices: Array<{ device: string; percentage: number }>
  }
}

export default function AdvancedAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('views')
  const [isLoading, setIsLoading] = useState(false)

  // Dados simulados para demonstração
  const analyticsData: AnalyticsData = {
    totalViews: 12450,
    engagement: 4.2,
    newFollowers: 156,
    contentCreated: 24,
    topPlatforms: [
      { name: 'Instagram', views: 8200, percentage: 66, color: 'bg-pink-500' },
      { name: 'LinkedIn', views: 3100, percentage: 25, color: 'bg-blue-500' },
      { name: 'Blog', views: 1150, percentage: 9, color: 'bg-green-500' }
    ],
    topContent: [
      { title: 'Direito Trabalhista', platform: 'Instagram', views: 2100, engagement: 4.2 },
      { title: 'Saúde Mental', platform: 'Blog', views: 1800, engagement: 3.8 },
      { title: 'IA e Direito', platform: 'LinkedIn', views: 1500, engagement: 5.1 },
      { title: 'Marketing Digital', platform: 'Instagram', views: 1200, engagement: 6.3 }
    ],
    monthlyTrend: [
      { month: 'Jan', views: 8500, engagement: 3.8, followers: 120 },
      { month: 'Fev', views: 9200, engagement: 4.1, followers: 135 },
      { month: 'Mar', views: 10800, engagement: 4.3, followers: 142 },
      { month: 'Abr', views: 12450, engagement: 4.2, followers: 156 }
    ],
    demographics: {
      ageGroups: [
        { age: '18-24', percentage: 25 },
        { age: '25-34', percentage: 35 },
        { age: '35-44', percentage: 28 },
        { age: '45+', percentage: 12 }
      ],
      locations: [
        { location: 'São Paulo', percentage: 40 },
        { location: 'Rio de Janeiro', percentage: 25 },
        { location: 'Minas Gerais', percentage: 15 },
        { location: 'Outros', percentage: 20 }
      ],
      devices: [
        { device: 'Mobile', percentage: 65 },
        { device: 'Desktop', percentage: 30 },
        { device: 'Tablet', percentage: 5 }
      ]
    }
  }

  const MetricCard: React.FC<{
    title: string
    value: number
    change: number
    icon: string
    color: string
  }> = ({ title, value, change, icon, color }) => {
    const animatedValue = useAnimatedCounter(value)
    const isPositive = change > 0

    return (
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{animatedValue.count.toLocaleString()}</p>
            <div className="flex items-center mt-1">
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </div>
          <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-2xl`}>
            {icon}
          </div>
        </div>
      </div>
    )
  }

  const ProgressBar: React.FC<{
    label: string
    percentage: number
    color: string
  }> = ({ label, percentage, color }) => {
    const { progress, ref } = useAnimatedProgress(percentage)

    return (
      <div ref={ref} className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ease-out ${color}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    )
  }

  const ChartPlaceholder: React.FC<{
    title: string
    data: any[]
    type: 'line' | 'bar' | 'pie'
  }> = ({ title, data, type }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">
              {type === 'line' ? '📈' : type === 'bar' ? '📊' : '🥧'}
            </div>
            <p className="text-gray-600 font-medium">{title}</p>
            <p className="text-sm text-gray-500">Gráfico interativo</p>
            <div className="mt-4 text-xs text-gray-400">
              {data.length} pontos de dados
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Analytics Avançado</h1>
          <div className="flex gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Último ano</option>
            </select>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
              Exportar Relatório
            </button>
          </div>
        </div>

        {/* Métricas Principais */}
        <StaggeredAnimation delay={100} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total de Visualizações"
            value={analyticsData.totalViews}
            change={15}
            icon="👁️"
            color="bg-blue-100"
          />
          <MetricCard
            title="Taxa de Engajamento"
            value={analyticsData.engagement}
            change={8}
            icon="💬"
            color="bg-green-100"
          />
          <MetricCard
            title="Novos Seguidores"
            value={analyticsData.newFollowers}
            change={12}
            icon="👥"
            color="bg-purple-100"
          />
          <MetricCard
            title="Conteúdos Criados"
            value={analyticsData.contentCreated}
            change={20}
            icon="📝"
            color="bg-orange-100"
          />
        </StaggeredAnimation>

        {/* Gráficos Principais */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartPlaceholder
            title="Evolução Mensal"
            data={analyticsData.monthlyTrend}
            type="line"
          />
          <ChartPlaceholder
            title="Performance por Plataforma"
            data={analyticsData.topPlatforms}
            type="pie"
          />
        </div>

        {/* Análise Detalhada */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Top Conteúdos */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Top Conteúdos</h3>
            <div className="space-y-4">
              {analyticsData.topContent.map((content, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-medium text-sm">{content.title}</div>
                    <div className="text-xs text-gray-500">{content.platform}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{content.views.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{content.engagement}% eng.</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demografia - Idade */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Faixa Etária</h3>
            <div className="space-y-3">
              {analyticsData.demographics.ageGroups.map((group, index) => (
                <ProgressBar
                  key={index}
                  label={group.age}
                  percentage={group.percentage}
                  color="bg-blue-500"
                />
              ))}
            </div>
          </div>

          {/* Demografia - Localização */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Localização</h3>
            <div className="space-y-3">
              {analyticsData.demographics.locations.map((location, index) => (
                <ProgressBar
                  key={index}
                  label={location.location}
                  percentage={location.percentage}
                  color="bg-green-500"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Comparações Mensais */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-6">Comparação Mensal</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Mês</th>
                  <th className="text-right py-3 px-4">Visualizações</th>
                  <th className="text-right py-3 px-4">Engajamento</th>
                  <th className="text-right py-3 px-4">Novos Seguidores</th>
                  <th className="text-right py-3 px-4">Crescimento</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.monthlyTrend.map((month, index) => {
                  const previousMonth = index > 0 ? analyticsData.monthlyTrend[index - 1] : null
                  const growth = previousMonth 
                    ? ((month.views - previousMonth.views) / previousMonth.views * 100)
                    : 0

                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{month.month}</td>
                      <td className="py-3 px-4 text-right">{month.views.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{month.engagement}%</td>
                      <td className="py-3 px-4 text-right">{month.followers}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`text-sm font-medium ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights e Recomendações */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-green-600">✅ Insights Positivos</h3>
            <ul className="space-y-2 text-sm">
              <li>• Crescimento consistente de 15% nas visualizações</li>
              <li>• Instagram representa 66% do tráfego total</li>
              <li>• Conteúdo sobre Direito tem maior engajamento</li>
              <li>• Audiência jovem (25-34 anos) é predominante</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">💡 Oportunidades</h3>
            <ul className="space-y-2 text-sm">
              <li>• Expandir conteúdo no LinkedIn (apenas 25%)</li>
              <li>• Criar mais conteúdo para faixa 35-44 anos</li>
              <li>• Aumentar frequência de posts sobre Saúde</li>
              <li>• Testar novos formatos de conteúdo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
