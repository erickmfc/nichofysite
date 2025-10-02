'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAdminRealData } from '@/hooks/useAdminRealData'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore'

interface RealTimeMetric {
  id: string
  label: string
  value: number
  previousValue: number
  change: number
  changeType: 'increase' | 'decrease' | 'stable'
  icon: string
  color: string
  trend: number[]
  unit?: string
  format?: 'number' | 'percentage' | 'currency' | 'time'
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  color: string
  href: string
  badge?: string
  isNew?: boolean
}

interface SystemAlert {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  action?: {
    label: string
    href: string
  }
}

interface PerformanceMetric {
  uptime: number
  responseTime: number
  errorRate: number
  throughput: number
  memoryUsage: number
  cpuUsage: number
}

export const AdvancedResponsiveDashboard = () => {
  const { stats, systemStatus, recentActivities } = useAdminRealData()
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetric[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric>({
    uptime: 99.9,
    responseTime: 120,
    errorRate: 0.1,
    throughput: 1500,
    memoryUsage: 68,
    cpuUsage: 35
  })
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30000) // 30 segundos
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')

  const quickActions: QuickAction[] = [
    {
      id: 'analytics',
      title: 'Analytics Avançado',
      description: 'Métricas detalhadas e insights',
      icon: '📈',
      color: 'bg-blue-500',
      href: '/admin/analytics',
      badge: 'Novo'
    },
    {
      id: 'reports',
      title: 'Relatórios',
      description: 'Gere relatórios personalizados',
      icon: '📊',
      color: 'bg-green-500',
      href: '/admin/reports'
    },
    {
      id: 'users',
      title: 'Gestão de Usuários',
      description: 'Gerencie usuários e permissões',
      icon: '👥',
      color: 'bg-purple-500',
      href: '/admin/users',
      badge: '50+'
    },
    {
      id: 'moderation',
      title: 'Moderação',
      description: 'Aprove conteúdo rapidamente',
      icon: '🛡️',
      color: 'bg-red-500',
      href: '/admin/moderation',
      badge: '12'
    },
    {
      id: 'notifications',
      title: 'Notificações',
      description: 'Configure alertas inteligentes',
      icon: '🔔',
      color: 'bg-orange-500',
      href: '/admin/notifications',
      badge: '3'
    },
    {
      id: 'settings',
      title: 'Configurações',
      description: 'Configure o sistema',
      icon: '⚙️',
      color: 'bg-gray-500',
      href: '/admin/settings'
    },
    {
      id: 'backup',
      title: 'Backup',
      description: 'Gerencie backups',
      icon: '💾',
      color: 'bg-indigo-500',
      href: '/admin/backup'
    },
    {
      id: 'logs',
      title: 'Logs',
      description: 'Monitore atividades',
      icon: '📋',
      color: 'bg-pink-500',
      href: '/admin/logs'
    }
  ]

  useEffect(() => {
    loadRealTimeData()
    
    if (isRealTimeEnabled) {
      const interval = setInterval(loadRealTimeData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [isRealTimeEnabled, refreshInterval])

  const loadRealTimeData = async () => {
    try {
      setIsLoading(true)
      
      // Simular carregamento de métricas em tempo real
      const mockMetrics: RealTimeMetric[] = [
        {
          id: 'users',
          label: 'Usuários Ativos',
          value: stats.totalUsers + Math.floor(Math.random() * 10),
          previousValue: stats.totalUsers,
          change: Math.floor(Math.random() * 20) - 10,
          changeType: Math.random() > 0.5 ? 'increase' : 'decrease',
          icon: '👥',
          color: 'text-blue-500',
          trend: generateTrendData(),
          unit: 'usuários'
        },
        {
          id: 'posts',
          label: 'Posts Criados',
          value: stats.totalPosts + Math.floor(Math.random() * 5),
          previousValue: stats.totalPosts,
          change: Math.floor(Math.random() * 15) - 5,
          changeType: Math.random() > 0.3 ? 'increase' : 'decrease',
          icon: '📝',
          color: 'text-green-500',
          trend: generateTrendData(),
          unit: 'posts'
        },
        {
          id: 'engagement',
          label: 'Taxa de Engajamento',
          value: Math.floor(Math.random() * 20) + 80,
          previousValue: 75,
          change: Math.floor(Math.random() * 10) - 5,
          changeType: Math.random() > 0.4 ? 'increase' : 'decrease',
          icon: '📈',
          color: 'text-purple-500',
          trend: generateTrendData(),
          unit: '%',
          format: 'percentage'
        },
        {
          id: 'revenue',
          label: 'Receita Hoje',
          value: Math.floor(Math.random() * 1000) + 500,
          previousValue: 450,
          change: Math.floor(Math.random() * 200) - 100,
          changeType: Math.random() > 0.3 ? 'increase' : 'decrease',
          icon: '💰',
          color: 'text-yellow-500',
          trend: generateTrendData(),
          unit: 'R$',
          format: 'currency'
        },
        {
          id: 'response_time',
          label: 'Tempo de Resposta',
          value: performanceMetrics.responseTime + Math.floor(Math.random() * 50) - 25,
          previousValue: performanceMetrics.responseTime,
          change: Math.floor(Math.random() * 20) - 10,
          changeType: Math.random() > 0.6 ? 'decrease' : 'increase',
          icon: '⚡',
          color: 'text-orange-500',
          trend: generateTrendData(),
          unit: 'ms',
          format: 'time'
        },
        {
          id: 'uptime',
          label: 'Uptime',
          value: performanceMetrics.uptime + (Math.random() * 0.1 - 0.05),
          previousValue: performanceMetrics.uptime,
          change: Math.random() * 0.2 - 0.1,
          changeType: Math.random() > 0.5 ? 'increase' : 'decrease',
          icon: '🟢',
          color: 'text-green-500',
          trend: generateTrendData(),
          unit: '%',
          format: 'percentage'
        }
      ]

      setRealTimeMetrics(mockMetrics)

      // Simular alertas do sistema
      const mockAlerts: SystemAlert[] = [
        {
          id: '1',
          type: 'warning',
          title: 'Alto Volume de Posts',
          message: `${stats.pendingApprovals} posts aguardando aprovação`,
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          isRead: false,
          action: {
            label: 'Revisar Posts',
            href: '/admin/moderation'
          }
        },
        {
          id: '2',
          type: 'info',
          title: 'Backup Concluído',
          message: 'Backup automático realizado com sucesso',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true
        },
        {
          id: '3',
          type: 'success',
          title: 'Sistema Otimizado',
          message: 'Performance melhorada em 15%',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          isRead: false
        }
      ]

      setSystemAlerts(mockAlerts)

    } catch (error) {
      console.error('Erro ao carregar dados em tempo real:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateTrendData = (): number[] => {
    return Array.from({ length: 12 }, () => Math.floor(Math.random() * 100))
  }

  const formatValue = (value: number, format?: string, unit?: string): string => {
    switch (format) {
      case 'currency':
        return `R$ ${value.toLocaleString('pt-BR')}`
      case 'percentage':
        return `${value.toFixed(1)}%`
      case 'time':
        return `${value}ms`
      default:
        return `${value.toLocaleString('pt-BR')}${unit ? ` ${unit}` : ''}`
    }
  }

  const MetricCard = ({ metric }: { metric: RealTimeMetric }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`text-2xl mr-3 ${metric.color}`}>
            {metric.icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-300">{metric.label}</h3>
            <p className="text-2xl font-bold text-white">
              {formatValue(metric.value, metric.format, metric.unit)}
            </p>
          </div>
        </div>
        
        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          metric.changeType === 'increase' ? 'bg-green-500' :
          metric.changeType === 'decrease' ? 'bg-red-500' :
          'bg-gray-500'
        }`}>
          <span className="mr-1">
            {metric.changeType === 'increase' ? '↗' : 
             metric.changeType === 'decrease' ? '↘' : '→'}
          </span>
          {Math.abs(metric.change).toFixed(1)}%
        </div>
      </div>

      {/* Mini gráfico de tendência */}
      <div className="h-12 flex items-end space-x-1">
        {metric.trend.map((value, index) => (
          <div
            key={index}
            className={`flex-1 rounded-t ${
              metric.changeType === 'increase' ? 'bg-green-500' :
              metric.changeType === 'decrease' ? 'bg-red-500' :
              'bg-gray-500'
            }`}
            style={{ height: `${(value / 100) * 100}%` }}
          />
        ))}
      </div>
    </div>
  )

  const QuickActionCard = ({ action }: { action: QuickAction }) => (
    <a
      href={action.href}
      className="group bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
    >
      <div className="flex items-center mb-3">
        <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
          <span className="text-white text-lg">{action.icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
            {action.title}
          </h3>
          <p className="text-xs text-gray-400">{action.description}</p>
        </div>
        {action.badge && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            action.isNew ? 'bg-blue-500' : 'bg-gray-600'
          }`}>
            {action.badge}
          </span>
        )}
      </div>
    </a>
  )

  const AlertCard = ({ alert }: { alert: SystemAlert }) => (
    <div className={`p-4 rounded-lg border transition-colors ${
      alert.type === 'error' ? 'bg-red-900 border-red-700' :
      alert.type === 'warning' ? 'bg-yellow-900 border-yellow-700' :
      alert.type === 'success' ? 'bg-green-900 border-green-700' :
      'bg-blue-900 border-blue-700'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className={`w-2 h-2 rounded-full mr-3 mt-2 ${
            alert.type === 'error' ? 'bg-red-500' :
            alert.type === 'warning' ? 'bg-yellow-500' :
            alert.type === 'success' ? 'bg-green-500' :
            'bg-blue-500'
          }`} />
          <div>
            <h4 className={`font-medium text-sm ${
              alert.type === 'error' ? 'text-red-300' :
              alert.type === 'warning' ? 'text-yellow-300' :
              alert.type === 'success' ? 'text-green-300' :
              'text-blue-300'
            }`}>
              {alert.title}
            </h4>
            <p className={`text-xs mt-1 ${
              alert.type === 'error' ? 'text-red-400' :
              alert.type === 'warning' ? 'text-yellow-400' :
              alert.type === 'success' ? 'text-green-400' :
              'text-blue-400'
            }`}>
              {alert.message}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {alert.timestamp.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
        
        {alert.action && (
          <a
            href={alert.action.href}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              alert.type === 'error' ? 'bg-red-600 hover:bg-red-700 text-white' :
              alert.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
              alert.type === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' :
              'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {alert.action.label}
          </a>
        )}
      </div>
    </div>
  )

  const PerformanceIndicator = ({ label, value, threshold, unit = '%', color = 'green' }: {
    label: string
    value: number
    threshold: number
    unit?: string
    color?: string
  }) => (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-sm font-medium text-white">
          {value.toFixed(1)}{unit}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            color === 'green' ? 'bg-green-500' :
            color === 'yellow' ? 'bg-yellow-500' :
            color === 'red' ? 'bg-red-500' :
            'bg-blue-500'
          }`}
          style={{ width: `${Math.min((value / threshold) * 100, 100)}%` }}
        />
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Carregando Dashboard</h2>
          <p className="text-gray-400">Sincronizando dados em tempo real...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-white mb-2">📊 Dashboard Avançado</h1>
            <p className="text-gray-400">Visão geral em tempo real do sistema</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isRealTimeEnabled}
                  onChange={(e) => setIsRealTimeEnabled(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-gray-300 text-sm">Tempo Real</span>
              </label>
              {isRealTimeEnabled && (
                <div className="flex items-center text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Ativo
                </div>
              )}
            </div>
            
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="1h">Última Hora</option>
              <option value="24h">Últimas 24h</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
            </select>
            
            <button
              onClick={loadRealTimeData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🔄 Atualizar
            </button>
          </div>
        </div>

        {/* Métricas em Tempo Real */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 mb-8">
          {realTimeMetrics.map(metric => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>

        {/* Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Ações Rápidas */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Ações Rápidas</h2>
                <span className="text-gray-400 text-sm">{quickActions.length} ferramentas</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map(action => (
                  <QuickActionCard key={action.id} action={action} />
                ))}
              </div>
            </div>
          </div>

          {/* Alertas do Sistema */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Alertas do Sistema</h2>
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {systemAlerts.filter(a => !a.isRead).length}
                </span>
              </div>
              
              <div className="space-y-3">
                {systemAlerts.map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance e Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance do Sistema */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Performance do Sistema</h2>
            
            <div className="space-y-4">
              <PerformanceIndicator
                label="Uptime"
                value={performanceMetrics.uptime}
                threshold={100}
                color="green"
              />
              <PerformanceIndicator
                label="Tempo de Resposta"
                value={performanceMetrics.responseTime}
                threshold={2000}
                unit="ms"
                color={performanceMetrics.responseTime < 500 ? 'green' : performanceMetrics.responseTime < 1000 ? 'yellow' : 'red'}
              />
              <PerformanceIndicator
                label="Taxa de Erro"
                value={performanceMetrics.errorRate}
                threshold={5}
                color={performanceMetrics.errorRate < 1 ? 'green' : performanceMetrics.errorRate < 3 ? 'yellow' : 'red'}
              />
              <PerformanceIndicator
                label="Uso de Memória"
                value={performanceMetrics.memoryUsage}
                threshold={100}
                color={performanceMetrics.memoryUsage < 70 ? 'green' : performanceMetrics.memoryUsage < 85 ? 'yellow' : 'red'}
              />
            </div>
          </div>

          {/* Atividades Recentes */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Atividades Recentes</h2>
            
            <div className="space-y-4">
              {recentActivities.slice(0, 5).map((activity, index) => (
                <div key={activity.id || index} className="flex items-center p-3 bg-gray-700 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.type === 'user_registered' ? 'bg-green-500' :
                    activity.type === 'post_approved' ? 'bg-blue-500' :
                    activity.type === 'post_created' ? 'bg-purple-500' :
                    'bg-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(activity.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer com Status */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="flex items-center text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm">Sistema Online</span>
              </div>
              <div className="text-gray-400 text-sm">
                Última atualização: {new Date().toLocaleString('pt-BR')}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Uptime: {performanceMetrics.uptime.toFixed(2)}%</span>
              <span>•</span>
              <span>Resposta: {performanceMetrics.responseTime}ms</span>
              <span>•</span>
              <span>Erros: {performanceMetrics.errorRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
