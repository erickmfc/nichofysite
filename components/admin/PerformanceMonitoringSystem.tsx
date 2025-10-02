'use client'

import { useState, useEffect, useCallback } from 'react'

interface PerformanceMetrics {
  responseTime: number
  uptime: number
  errorRate: number
  throughput: number
  memoryUsage: number
  cpuUsage: number
  databaseLatency: number
  cacheHitRate: number
  activeConnections: number
  queueSize: number
}

interface PerformanceAlert {
  id: string
  type: 'warning' | 'error' | 'info'
  message: string
  timestamp: Date
  resolved: boolean
}

interface PerformanceGoal {
  metric: string
  target: number
  current: number
  status: 'good' | 'warning' | 'critical'
  description: string
}

export const PerformanceMonitoringSystem = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    responseTime: 120,
    uptime: 99.95,
    errorRate: 0.05,
    throughput: 1500,
    memoryUsage: 68,
    cpuUsage: 35,
    databaseLatency: 45,
    cacheHitRate: 92,
    activeConnections: 250,
    queueSize: 12
  })

  const [alerts, setAlerts] = useState<PerformanceAlert[]>([])
  const [goals, setGoals] = useState<PerformanceGoal[]>([])
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(5000) // 5 segundos

  useEffect(() => {
    initializeGoals()
    loadInitialAlerts()
    
    if (isMonitoring) {
      const interval = setInterval(updateMetrics, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [isMonitoring, refreshInterval])

  const initializeGoals = () => {
    const performanceGoals: PerformanceGoal[] = [
      {
        metric: 'responseTime',
        target: 2000,
        current: metrics.responseTime,
        status: metrics.responseTime < 500 ? 'good' : metrics.responseTime < 1000 ? 'warning' : 'critical',
        description: 'Tempo de resposta < 2 segundos'
      },
      {
        metric: 'uptime',
        target: 99.9,
        current: metrics.uptime,
        status: metrics.uptime > 99.9 ? 'good' : metrics.uptime > 99.5 ? 'warning' : 'critical',
        description: 'Uptime > 99.9%'
      },
      {
        metric: 'errorRate',
        target: 1,
        current: metrics.errorRate,
        status: metrics.errorRate < 1 ? 'good' : metrics.errorRate < 3 ? 'warning' : 'critical',
        description: 'Taxa de erro < 1%'
      },
      {
        metric: 'memoryUsage',
        target: 80,
        current: metrics.memoryUsage,
        status: metrics.memoryUsage < 70 ? 'good' : metrics.memoryUsage < 85 ? 'warning' : 'critical',
        description: 'Uso de memória < 80%'
      },
      {
        metric: 'cpuUsage',
        target: 70,
        current: metrics.cpuUsage,
        status: metrics.cpuUsage < 50 ? 'good' : metrics.cpuUsage < 70 ? 'warning' : 'critical',
        description: 'Uso de CPU < 70%'
      }
    ]
    setGoals(performanceGoals)
  }

  const loadInitialAlerts = () => {
    const initialAlerts: PerformanceAlert[] = [
      {
        id: '1',
        type: 'info',
        message: 'Sistema otimizado - Performance melhorada em 15%',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        resolved: true
      },
      {
        id: '2',
        type: 'warning',
        message: 'Uso de memória elevado - 75%',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        resolved: false
      },
      {
        id: '3',
        type: 'error',
        message: 'Erro 500 detectado na API de pagamento',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        resolved: false
      }
    ]
    setAlerts(initialAlerts)
  }

  const updateMetrics = useCallback(() => {
    setMetrics(prev => {
      const newMetrics = { ...prev }
      
      // Simular variações realistas nos métricas
      newMetrics.responseTime = Math.max(50, prev.responseTime + (Math.random() * 100 - 50))
      newMetrics.uptime = Math.min(100, Math.max(99.5, prev.uptime + (Math.random() * 0.1 - 0.05)))
      newMetrics.errorRate = Math.max(0, prev.errorRate + (Math.random() * 0.2 - 0.1))
      newMetrics.throughput = Math.max(500, prev.throughput + (Math.random() * 200 - 100))
      newMetrics.memoryUsage = Math.max(20, Math.min(95, prev.memoryUsage + (Math.random() * 10 - 5)))
      newMetrics.cpuUsage = Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() * 20 - 10)))
      newMetrics.databaseLatency = Math.max(10, prev.databaseLatency + (Math.random() * 20 - 10))
      newMetrics.cacheHitRate = Math.max(70, Math.min(100, prev.cacheHitRate + (Math.random() * 5 - 2.5)))
      newMetrics.activeConnections = Math.max(50, prev.activeConnections + (Math.random() * 100 - 50))
      newMetrics.queueSize = Math.max(0, prev.queueSize + (Math.random() * 10 - 5))

      // Verificar se algum métrica atingiu um threshold crítico
      checkPerformanceThresholds(newMetrics)
      
      return newMetrics
    })
  }, [])

  const checkPerformanceThresholds = (newMetrics: PerformanceMetrics) => {
    const newAlerts: PerformanceAlert[] = []

    if (newMetrics.responseTime > 2000) {
      newAlerts.push({
        id: Date.now().toString(),
        type: 'error',
        message: `Tempo de resposta crítico: ${newMetrics.responseTime.toFixed(0)}ms`,
        timestamp: new Date(),
        resolved: false
      })
    }

    if (newMetrics.uptime < 99.9) {
      newAlerts.push({
        id: (Date.now() + 1).toString(),
        type: 'warning',
        message: `Uptime abaixo do objetivo: ${newMetrics.uptime.toFixed(2)}%`,
        timestamp: new Date(),
        resolved: false
      })
    }

    if (newMetrics.errorRate > 5) {
      newAlerts.push({
        id: (Date.now() + 2).toString(),
        type: 'error',
        message: `Taxa de erro elevada: ${newMetrics.errorRate.toFixed(2)}%`,
        timestamp: new Date(),
        resolved: false
      })
    }

    if (newMetrics.memoryUsage > 85) {
      newAlerts.push({
        id: (Date.now() + 3).toString(),
        type: 'warning',
        message: `Uso de memória elevado: ${newMetrics.memoryUsage.toFixed(1)}%`,
        timestamp: new Date(),
        resolved: false
      })
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev.slice(0, 9)])
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'good': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusBg = (status: string): string => {
    switch (status) {
      case 'good': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'critical': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getAlertColor = (type: string): string => {
    switch (type) {
      case 'error': return 'bg-red-900 border-red-700'
      case 'warning': return 'bg-yellow-900 border-yellow-700'
      case 'info': return 'bg-blue-900 border-blue-700'
      default: return 'bg-gray-900 border-gray-700'
    }
  }

  const MetricCard = ({ title, value, unit, status, target, description }: {
    title: string
    value: number
    unit: string
    status: string
    target?: number
    description?: string
  }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className={`w-3 h-3 rounded-full ${getStatusBg(status)}`} />
      </div>
      
      <div className="mb-4">
        <p className="text-3xl font-bold text-white">
          {value.toFixed(value < 1 ? 2 : 0)}{unit}
        </p>
        {target && (
          <p className="text-sm text-gray-400">
            Meta: {target}{unit}
          </p>
        )}
      </div>

      {description && (
        <p className="text-sm text-gray-300">{description}</p>
      )}

      {/* Barra de progresso */}
      {target && (
        <div className="mt-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getStatusBg(status)}`}
              style={{ width: `${Math.min((value / target) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )

  const AlertCard = ({ alert }: { alert: PerformanceAlert }) => (
    <div className={`p-4 rounded-lg border transition-colors ${getAlertColor(alert.type)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className={`w-2 h-2 rounded-full mr-3 mt-2 ${
            alert.type === 'error' ? 'bg-red-500' :
            alert.type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          }`} />
          <div>
            <h4 className={`font-medium text-sm ${
              alert.type === 'error' ? 'text-red-300' :
              alert.type === 'warning' ? 'text-yellow-300' :
              'text-blue-300'
            }`}>
              {alert.message}
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              {alert.timestamp.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {alert.resolved ? (
            <span className="text-green-400 text-xs">✓ Resolvido</span>
          ) : (
            <button
              onClick={() => {
                setAlerts(prev => prev.map(a => 
                  a.id === alert.id ? { ...a, resolved: true } : a
                ))
              }}
              className="text-xs text-gray-400 hover:text-white"
            >
              Marcar como resolvido
            </button>
          )}
        </div>
      </div>
    </div>
  )

  const GoalCard = ({ goal }: { goal: PerformanceGoal }) => (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-medium">{goal.description}</h4>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBg(goal.status)}`}>
          {goal.status}
        </span>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-300 text-sm">Atual</span>
        <span className="text-white font-semibold">
          {goal.current.toFixed(goal.metric === 'uptime' || goal.metric === 'errorRate' ? 2 : 0)}
          {goal.metric === 'responseTime' ? 'ms' : 
           goal.metric === 'uptime' || goal.metric === 'errorRate' ? '%' : ''}
        </span>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getStatusBg(goal.status)}`}
          style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-white mb-2">⚡ Monitoramento de Performance</h1>
            <p className="text-gray-400">Métricas em tempo real e objetivos de performance</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isMonitoring}
                  onChange={(e) => setIsMonitoring(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-gray-300 text-sm">Monitoramento Ativo</span>
              </label>
            </div>
            
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value={1000}>1 segundo</option>
              <option value={5000}>5 segundos</option>
              <option value={10000}>10 segundos</option>
              <option value={30000}>30 segundos</option>
            </select>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Tempo de Resposta"
            value={metrics.responseTime}
            unit="ms"
            status={metrics.responseTime < 500 ? 'good' : metrics.responseTime < 1000 ? 'warning' : 'critical'}
            target={2000}
            description="Meta: < 2 segundos"
          />
          <MetricCard
            title="Uptime"
            value={metrics.uptime}
            unit="%"
            status={metrics.uptime > 99.9 ? 'good' : metrics.uptime > 99.5 ? 'warning' : 'critical'}
            target={99.9}
            description="Meta: > 99.9%"
          />
          <MetricCard
            title="Taxa de Erro"
            value={metrics.errorRate}
            unit="%"
            status={metrics.errorRate < 1 ? 'good' : metrics.errorRate < 3 ? 'warning' : 'critical'}
            target={1}
            description="Meta: < 1%"
          />
          <MetricCard
            title="Throughput"
            value={metrics.throughput}
            unit=" req/s"
            status={metrics.throughput > 1000 ? 'good' : metrics.throughput > 500 ? 'warning' : 'critical'}
            description="Requisições por segundo"
          />
        </div>

        {/* Métricas Secundárias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Uso de Memória"
            value={metrics.memoryUsage}
            unit="%"
            status={metrics.memoryUsage < 70 ? 'good' : metrics.memoryUsage < 85 ? 'warning' : 'critical'}
            target={80}
          />
          <MetricCard
            title="Uso de CPU"
            value={metrics.cpuUsage}
            unit="%"
            status={metrics.cpuUsage < 50 ? 'good' : metrics.cpuUsage < 70 ? 'warning' : 'critical'}
            target={70}
          />
          <MetricCard
            title="Latência do Banco"
            value={metrics.databaseLatency}
            unit="ms"
            status={metrics.databaseLatency < 50 ? 'good' : metrics.databaseLatency < 100 ? 'warning' : 'critical'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Objetivos de Performance */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Objetivos de Performance</h2>
            <div className="space-y-4">
              {goals.map(goal => (
                <GoalCard key={goal.metric} goal={goal} />
              ))}
            </div>
          </div>

          {/* Alertas */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Alertas de Performance</h2>
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {alerts.filter(a => !a.resolved).length}
              </span>
            </div>
            
            <div className="space-y-3">
              {alerts.slice(0, 5).map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        </div>

        {/* Métricas Adicionais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Cache Hit Rate"
            value={metrics.cacheHitRate}
            unit="%"
            status={metrics.cacheHitRate > 90 ? 'good' : metrics.cacheHitRate > 80 ? 'warning' : 'critical'}
          />
          <MetricCard
            title="Conexões Ativas"
            value={metrics.activeConnections}
            unit=""
            status={metrics.activeConnections < 500 ? 'good' : metrics.activeConnections < 1000 ? 'warning' : 'critical'}
          />
          <MetricCard
            title="Tamanho da Fila"
            value={metrics.queueSize}
            unit=""
            status={metrics.queueSize < 10 ? 'good' : metrics.queueSize < 50 ? 'warning' : 'critical'}
          />
        </div>
      </div>
    </div>
  )
}
