// app/admin/monitoring/page.tsx
// Dashboard de monitoramento para admin

'use client'

import { useState, useEffect } from 'react'
import { ResponsiveTemplate } from '@/components/ui/ResponsiveTemplate'

interface MonitoringStats {
  errors: {
    total: number
    byType: Record<string, number>
    bySeverity: Record<string, number>
    recent: any[]
    last24h: number
  }
  cache: {
    memory: string
    keyspace: string
    connected: boolean
  }
  backups: any[]
}

export default function MonitoringPage() {
  const [stats, setStats] = useState<MonitoringStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      const [errorsRes, cacheRes, backupsRes] = await Promise.all([
        fetch('/api/monitoring/errors'),
        fetch('/api/cache/stats'),
        fetch('/api/backup')
      ])
      
      const [errors, cache, backups] = await Promise.all([
        errorsRes.json(),
        cacheRes.json(),
        backupsRes.json()
      ])
      
      setStats({
        errors: errors.data,
        cache: cache.data,
        backups: backups.data
      })
    } catch (err) {
      setError('Erro ao carregar estatísticas')
    } finally {
      setLoading(false)
    }
  }

  const executeBackup = async (type: string) => {
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })
      
      if (response.ok) {
        alert(`Backup ${type} executado com sucesso!`)
        fetchStats()
      } else {
        alert('Erro ao executar backup')
      }
    } catch (err) {
      alert('Erro ao executar backup')
    }
  }

  const clearCache = async (pattern: string) => {
    try {
      const response = await fetch(`/api/cache/stats?pattern=${pattern}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        alert(`Cache limpo para o padrão: ${pattern}`)
        fetchStats()
      } else {
        alert('Erro ao limpar cache')
      }
    } catch (err) {
      alert('Erro ao limpar cache')
    }
  }

  if (loading) {
    return (
      <ResponsiveTemplate colorScheme="warning">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
        </div>
      </ResponsiveTemplate>
    )
  }

  if (error) {
    return (
      <ResponsiveTemplate colorScheme="warning">
        <div className="text-center py-8">
          <div className="text-red-600 text-xl mb-4">❌ {error}</div>
          <button
            onClick={fetchStats}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg"
          >
            Tentar Novamente
          </button>
        </div>
      </ResponsiveTemplate>
    )
  }

  return (
    <ResponsiveTemplate colorScheme="warning">
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📊 Monitoramento do Sistema
            </h1>
            <p className="text-gray-600">
              Dashboard completo de monitoramento, cache e backups
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            
            {/* Erros */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                🚨 Erros
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  stats?.errors.last24h > 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {stats?.errors.last24h || 0} últimas 24h
                </span>
              </h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-semibold">{stats?.errors.total || 0}</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  <div>Por Severidade:</div>
                  {Object.entries(stats?.errors.bySeverity || {}).map(([severity, count]) => (
                    <div key={severity} className="flex justify-between">
                      <span className="capitalize">{severity}:</span>
                      <span>{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cache */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                💾 Cache Redis
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  stats?.cache.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {stats?.cache.connected ? 'Conectado' : 'Desconectado'}
                </span>
              </h2>
              
              <div className="space-y-2">
                <button
                  onClick={() => clearCache('user:*')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Limpar Cache Usuários
                </button>
                <button
                  onClick={() => clearCache('projects:*')}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
                >
                  Limpar Cache Projetos
                </button>
                <button
                  onClick={() => clearCache('*')}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Limpar Todo Cache
                </button>
              </div>
            </div>

            {/* Backups */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">🔄 Backups</h2>
              
              <div className="space-y-2">
                <button
                  onClick={() => executeBackup('daily')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
                >
                  Backup Diário
                </button>
                <button
                  onClick={() => executeBackup('weekly')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                >
                  Backup Semanal
                </button>
                <button
                  onClick={() => executeBackup('monthly')}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded"
                >
                  Backup Mensal
                </button>
              </div>
            </div>
          </div>

          {/* Recent Errors */}
          {stats?.errors.recent && stats.errors.recent.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">🔍 Erros Recentes</h2>
              
              <div className="space-y-3">
                {stats.errors.recent.slice(0, 5).map((error: any, index: number) => (
                  <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-red-800">{error.message}</div>
                        <div className="text-sm text-gray-600">
                          {error.type} • {error.severity} • {new Date(error.context.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        error.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        error.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        error.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {error.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">⚡ Ações Rápidas</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={fetchStats}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                🔄 Atualizar Estatísticas
              </button>
              
              <button
                onClick={() => window.open('/api/monitoring/errors', '_blank')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                📊 Ver API de Erros
              </button>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveTemplate>
  )
}
