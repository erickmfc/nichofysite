'use client'

import { useState, useEffect } from 'react'

interface LogEntry {
  id: string
  timestamp: Date
  level: 'info' | 'warning' | 'error' | 'debug' | 'critical'
  category: 'auth' | 'api' | 'database' | 'security' | 'system' | 'user' | 'admin'
  message: string
  details?: any
  userId?: string
  ipAddress?: string
  userAgent?: string
  sessionId?: string
  requestId?: string
  duration?: number
  statusCode?: number
  endpoint?: string
  method?: string
}

interface AuditTrail {
  id: string
  timestamp: Date
  userId: string
  userName: string
  action: string
  resource: string
  resourceId?: string
  oldValue?: any
  newValue?: any
  ipAddress: string
  userAgent: string
  success: boolean
  reason?: string
}

interface LogFilter {
  level: string
  category: string
  dateRange: string
  search: string
  userId?: string
}

interface LogStats {
  totalLogs: number
  errorsToday: number
  warningsToday: number
  criticalIssues: number
  avgResponseTime: number
  topErrors: Array<{ message: string; count: number }>
  categoryDistribution: Array<{ category: string; count: number }>
}

export const LogsAuditSystem = () => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [auditTrails, setAuditTrails] = useState<AuditTrail[]>([])
  const [logStats, setLogStats] = useState<LogStats | null>(null)
  const [filters, setFilters] = useState<LogFilter>({
    level: 'all',
    category: 'all',
    dateRange: '24h',
    search: ''
  })
  const [activeTab, setActiveTab] = useState<'logs' | 'audit' | 'stats' | 'alerts'>('logs')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [isRealTime, setIsRealTime] = useState(false)

  useEffect(() => {
    loadLogs()
    loadAuditTrails()
    loadLogStats()
  }, [])

  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        loadLogs()
        loadLogStats()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  const loadLogs = () => {
    const mockLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        level: 'error',
        category: 'api',
        message: 'Failed to process payment request',
        details: { error: 'Payment gateway timeout', amount: 99.99 },
        userId: 'user-123',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        sessionId: 'sess-abc123',
        requestId: 'req-xyz789',
        duration: 5000,
        statusCode: 500,
        endpoint: '/api/payments/process',
        method: 'POST'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        level: 'warning',
        category: 'security',
        message: 'Multiple failed login attempts detected',
        details: { attempts: 5, username: 'admin@example.com' },
        ipAddress: '192.168.1.200',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        level: 'info',
        category: 'user',
        message: 'User profile updated successfully',
        userId: 'user-456',
        ipAddress: '192.168.1.150',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        sessionId: 'sess-def456',
        requestId: 'req-abc123',
        duration: 250,
        statusCode: 200,
        endpoint: '/api/users/profile',
        method: 'PUT'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        level: 'critical',
        category: 'database',
        message: 'Database connection pool exhausted',
        details: { activeConnections: 100, maxConnections: 100 },
        ipAddress: '127.0.0.1'
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        level: 'debug',
        category: 'system',
        message: 'Cache miss for user session data',
        details: { cacheKey: 'session:user-789', ttl: 3600 },
        userId: 'user-789'
      },
      {
        id: '6',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        level: 'info',
        category: 'admin',
        message: 'Admin user logged in successfully',
        userId: 'admin-001',
        ipAddress: '192.168.1.50',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        sessionId: 'sess-admin123',
        requestId: 'req-admin456',
        duration: 100,
        statusCode: 200,
        endpoint: '/admin/login',
        method: 'POST'
      }
    ]
    setLogs(mockLogs)
  }

  const loadAuditTrails = () => {
    const mockAuditTrails: AuditTrail[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        userId: 'admin-001',
        userName: 'Administrador',
        action: 'UPDATE',
        resource: 'user',
        resourceId: 'user-123',
        oldValue: { status: 'active', role: 'user' },
        newValue: { status: 'suspended', role: 'user' },
        ipAddress: '192.168.1.50',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        success: true,
        reason: 'Violation of terms of service'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        userId: 'admin-002',
        userName: 'Moderador',
        action: 'DELETE',
        resource: 'post',
        resourceId: 'post-456',
        oldValue: { title: 'Inappropriate content', status: 'published' },
        newValue: null,
        ipAddress: '192.168.1.51',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        success: true,
        reason: 'Content violates community guidelines'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        userId: 'user-789',
        userName: 'João Silva',
        action: 'CREATE',
        resource: 'post',
        resourceId: 'post-789',
        oldValue: null,
        newValue: { title: 'New blog post', category: 'technology' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        success: true
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        userId: 'admin-001',
        userName: 'Administrador',
        action: 'LOGIN',
        resource: 'admin',
        oldValue: null,
        newValue: { loginTime: new Date() },
        ipAddress: '192.168.1.50',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        success: true
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        userId: 'user-456',
        userName: 'Maria Santos',
        action: 'UPDATE',
        resource: 'profile',
        resourceId: 'profile-456',
        oldValue: { email: 'old@example.com', name: 'Maria' },
        newValue: { email: 'new@example.com', name: 'Maria Santos' },
        ipAddress: '192.168.1.150',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        success: true
      }
    ]
    setAuditTrails(mockAuditTrails)
  }

  const loadLogStats = () => {
    const mockStats: LogStats = {
      totalLogs: 15420,
      errorsToday: 23,
      warningsToday: 45,
      criticalIssues: 2,
      avgResponseTime: 245,
      topErrors: [
        { message: 'Database connection timeout', count: 15 },
        { message: 'Payment gateway error', count: 8 },
        { message: 'File upload failed', count: 5 },
        { message: 'Email service unavailable', count: 3 },
        { message: 'Cache miss error', count: 2 }
      ],
      categoryDistribution: [
        { category: 'api', count: 4500 },
        { category: 'user', count: 3200 },
        { category: 'system', count: 2800 },
        { category: 'security', count: 1500 },
        { category: 'database', count: 1200 },
        { category: 'admin', count: 800 },
        { category: 'auth', count: 420 }
      ]
    }
    setLogStats(mockStats)
  }

  const filteredLogs = logs.filter(log => {
    if (filters.level !== 'all' && log.level !== filters.level) return false
    if (filters.category !== 'all' && log.category !== filters.category) return false
    if (filters.search && !log.message.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.userId && log.userId !== filters.userId) return false
    
    // Filtrar por data
    const now = new Date()
    const cutoffTime = new Date(now.getTime() - getDateRangeMs(filters.dateRange))
    if (log.timestamp < cutoffTime) return false
    
    return true
  })

  const getDateRangeMs = (range: string): number => {
    switch (range) {
      case '1h': return 60 * 60 * 1000
      case '24h': return 24 * 60 * 60 * 1000
      case '7d': return 7 * 24 * 60 * 60 * 1000
      case '30d': return 30 * 24 * 60 * 60 * 1000
      default: return 24 * 60 * 60 * 1000
    }
  }

  const LogCard = ({ log }: { log: LogEntry }) => (
    <div 
      className={`bg-gray-800 rounded-xl p-4 border cursor-pointer transition-colors ${
        selectedLog?.id === log.id ? 'border-blue-500' : 'border-gray-700'
      }`}
      onClick={() => setSelectedLog(log)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            log.level === 'critical' ? 'bg-red-500' :
            log.level === 'error' ? 'bg-red-600' :
            log.level === 'warning' ? 'bg-yellow-500' :
            log.level === 'info' ? 'bg-blue-500' :
            'bg-gray-500'
          }`}>
            {log.level.toUpperCase()}
          </span>
          <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
            {log.category}
          </span>
          {log.statusCode && (
            <span className={`px-2 py-1 rounded text-xs ${
              log.statusCode >= 200 && log.statusCode < 300 ? 'bg-green-500' :
              log.statusCode >= 300 && log.statusCode < 400 ? 'bg-yellow-500' :
              log.statusCode >= 400 && log.statusCode < 500 ? 'bg-orange-500' :
              'bg-red-500'
            }`}>
              {log.statusCode}
            </span>
          )}
        </div>
        <span className="text-gray-400 text-xs">
          {log.timestamp.toLocaleString('pt-BR')}
        </span>
      </div>
      
      <p className="text-white text-sm mb-2">{log.message}</p>
      
      <div className="flex items-center space-x-4 text-xs text-gray-400">
        {log.userId && <span>User: {log.userId}</span>}
        {log.ipAddress && <span>IP: {log.ipAddress}</span>}
        {log.endpoint && <span>Endpoint: {log.method} {log.endpoint}</span>}
        {log.duration && <span>Duration: {log.duration}ms</span>}
      </div>
    </div>
  )

  const AuditTrailCard = ({ trail }: { trail: AuditTrail }) => (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            trail.action === 'CREATE' ? 'bg-green-500' :
            trail.action === 'UPDATE' ? 'bg-blue-500' :
            trail.action === 'DELETE' ? 'bg-red-500' :
            trail.action === 'LOGIN' ? 'bg-purple-500' :
            'bg-gray-500'
          }`}>
            {trail.action}
          </span>
          <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
            {trail.resource}
          </span>
          <span className={`px-2 py-1 rounded text-xs ${
            trail.success ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {trail.success ? 'SUCCESS' : 'FAILED'}
          </span>
        </div>
        <span className="text-gray-400 text-xs">
          {trail.timestamp.toLocaleString('pt-BR')}
        </span>
      </div>
      
      <div className="mb-2">
        <p className="text-white text-sm">
          <strong>{trail.userName}</strong> ({trail.userId}) performed {trail.action} on {trail.resource}
          {trail.resourceId && ` (ID: ${trail.resourceId})`}
        </p>
        {trail.reason && (
          <p className="text-gray-300 text-xs mt-1">Reason: {trail.reason}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-4 text-xs text-gray-400">
        <span>IP: {trail.ipAddress}</span>
        <span>User Agent: {trail.userAgent.substring(0, 50)}...</span>
      </div>
    </div>
  )

  const LogDetailModal = ({ log }: { log: LogEntry }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Detalhes do Log</h3>
          <button
            onClick={() => setSelectedLog(null)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-gray-300 font-medium mb-2">Informações Básicas</h4>
            <div className="bg-gray-700 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Timestamp:</span>
                <span className="text-white">{log.timestamp.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Level:</span>
                <span className="text-white">{log.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>
                <span className="text-white">{log.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Message:</span>
                <span className="text-white">{log.message}</span>
              </div>
            </div>
          </div>
          
          {log.details && (
            <div>
              <h4 className="text-gray-300 font-medium mb-2">Detalhes</h4>
              <div className="bg-gray-700 rounded-lg p-4">
                <pre className="text-white text-sm whitespace-pre-wrap">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </div>
            </div>
          )}
          
          {(log.userId || log.ipAddress || log.userAgent) && (
            <div>
              <h4 className="text-gray-300 font-medium mb-2">Informações do Usuário</h4>
              <div className="bg-gray-700 rounded-lg p-4 space-y-2 text-sm">
                {log.userId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">User ID:</span>
                    <span className="text-white">{log.userId}</span>
                  </div>
                )}
                {log.ipAddress && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">IP Address:</span>
                    <span className="text-white">{log.ipAddress}</span>
                  </div>
                )}
                {log.userAgent && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">User Agent:</span>
                    <span className="text-white text-xs">{log.userAgent}</span>
                  </div>
                )}
                {log.sessionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Session ID:</span>
                    <span className="text-white">{log.sessionId}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {(log.endpoint || log.method || log.statusCode || log.duration) && (
            <div>
              <h4 className="text-gray-300 font-medium mb-2">Informações da Requisição</h4>
              <div className="bg-gray-700 rounded-lg p-4 space-y-2 text-sm">
                {log.method && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Method:</span>
                    <span className="text-white">{log.method}</span>
                  </div>
                )}
                {log.endpoint && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Endpoint:</span>
                    <span className="text-white">{log.endpoint}</span>
                  </div>
                )}
                {log.statusCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status Code:</span>
                    <span className="text-white">{log.statusCode}</span>
                  </div>
                )}
                {log.duration && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{log.duration}ms</span>
                  </div>
                )}
                {log.requestId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Request ID:</span>
                    <span className="text-white">{log.requestId}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Carregando Logs</h2>
          <p className="text-gray-400">Buscando logs e auditoria...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📋 Logs e Auditoria</h1>
            <p className="text-gray-400">Monitore logs do sistema e trilha de auditoria</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isRealTime}
                onChange={(e) => setIsRealTime(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-300">Tempo Real</span>
            </label>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              📥 Exportar Logs
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'logs'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📋 Logs
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'audit'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            🔍 Auditoria
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'stats'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📊 Estatísticas
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'alerts'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            🚨 Alertas
          </button>
        </div>

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div>
            {/* Filters */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nível</label>
                  <select
                    value={filters.level}
                    onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">Todos</option>
                    <option value="critical">Critical</option>
                    <option value="error">Error</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">Todas</option>
                    <option value="auth">Auth</option>
                    <option value="api">API</option>
                    <option value="database">Database</option>
                    <option value="security">Security</option>
                    <option value="system">System</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Período</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="1h">Última Hora</option>
                    <option value="24h">Últimas 24h</option>
                    <option value="7d">Últimos 7 dias</option>
                    <option value="30d">Últimos 30 dias</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    placeholder="Mensagem..."
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ level: 'all', category: 'all', dateRange: '24h', search: '' })}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    🔄 Limpar
                  </button>
                </div>
              </div>
            </div>

            {/* Logs List */}
            <div className="space-y-3">
              {filteredLogs.map(log => (
                <LogCard key={log.id} log={log} />
              ))}
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum log encontrado</h3>
                <p className="text-gray-400">Ajuste os filtros para encontrar logs</p>
              </div>
            )}
          </div>
        )}

        {/* Audit Tab */}
        {activeTab === 'audit' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Trilha de Auditoria</h2>
              <div className="text-gray-400 text-sm">
                {auditTrails.length} eventos registrados
              </div>
            </div>

            <div className="space-y-3">
              {auditTrails.map(trail => (
                <AuditTrailCard key={trail.id} trail={trail} />
              ))}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && logStats && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Estatísticas de Logs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Total de Logs</h3>
                    <p className="text-4xl font-bold text-white">{logStats.totalLogs.toLocaleString()}</p>
                  </div>
                  <div className="text-4xl text-blue-500">📋</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Erros Hoje</h3>
                    <p className="text-4xl font-bold text-red-500">{logStats.errorsToday}</p>
                  </div>
                  <div className="text-4xl text-red-500">❌</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Avisos Hoje</h3>
                    <p className="text-4xl font-bold text-yellow-500">{logStats.warningsToday}</p>
                  </div>
                  <div className="text-4xl text-yellow-500">⚠️</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Críticos</h3>
                    <p className="text-4xl font-bold text-red-600">{logStats.criticalIssues}</p>
                  </div>
                  <div className="text-4xl text-red-600">🚨</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Top Erros</h3>
                <div className="space-y-3">
                  {logStats.topErrors.map((error, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{error.message}</span>
                      <span className="text-white font-medium">{error.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Distribuição por Categoria</h3>
                <div className="space-y-3">
                  {logStats.categoryDistribution.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm capitalize">{category.category}</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-700 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ 
                              width: `${(category.count / logStats.categoryDistribution[0].count) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-white font-medium text-sm">{category.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Alertas de Logs</h2>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚨</div>
                <h3 className="text-xl font-semibold text-white mb-2">Sistema de Alertas</h3>
                <p className="text-gray-400 mb-6">
                  Configure alertas baseados em padrões de logs e métricas
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                  Configurar Alertas
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Log Detail Modal */}
        {selectedLog && <LogDetailModal log={selectedLog} />}
      </div>
    </div>
  )
}
