'use client'

import { useState, useEffect } from 'react'

interface BackupJob {
  id: string
  name: string
  type: 'full' | 'incremental' | 'differential'
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  createdAt: Date
  completedAt?: Date
  size: number
  location: string
  description: string
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    time: string
    days?: number[]
  }
}

interface MaintenanceTask {
  id: string
  name: string
  description: string
  type: 'database' | 'cache' | 'storage' | 'security' | 'performance'
  status: 'pending' | 'running' | 'completed' | 'failed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimatedDuration: number
  lastRun?: Date
  nextRun?: Date
  isScheduled: boolean
}

interface SystemHealth {
  database: {
    status: 'healthy' | 'warning' | 'critical'
    connections: number
    maxConnections: number
    responseTime: number
    diskUsage: number
  }
  storage: {
    status: 'healthy' | 'warning' | 'critical'
    totalSpace: number
    usedSpace: number
    freeSpace: number
  }
  cache: {
    status: 'healthy' | 'warning' | 'critical'
    hitRate: number
    memoryUsage: number
    maxMemory: number
  }
  performance: {
    status: 'healthy' | 'warning' | 'critical'
    cpuUsage: number
    memoryUsage: number
    diskIO: number
    networkIO: number
  }
}

export const BackupMaintenanceSystem = () => {
  const [backups, setBackups] = useState<BackupJob[]>([])
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([])
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [activeTab, setActiveTab] = useState<'backup' | 'maintenance' | 'health' | 'logs'>('backup')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateBackup, setShowCreateBackup] = useState(false)
  const [showCreateTask, setShowCreateTask] = useState(false)

  useEffect(() => {
    loadData()
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Carregar backups
      loadBackups()
      
      // Carregar tarefas de manutenção
      loadMaintenanceTasks()
      
      // Carregar saúde do sistema
      loadSystemHealth()
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadBackups = () => {
    const mockBackups: BackupJob[] = [
      {
        id: '1',
        name: 'Backup Completo Diário',
        type: 'full',
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        size: 2048,
        location: 's3://backups/nichofy/full-2024-01-15.tar.gz',
        description: 'Backup completo do banco de dados e arquivos',
        schedule: {
          frequency: 'daily',
          time: '02:00',
          days: [1, 2, 3, 4, 5, 6, 7]
        }
      },
      {
        id: '2',
        name: 'Backup Incremental',
        type: 'incremental',
        status: 'running',
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        size: 512,
        location: 's3://backups/nichofy/incremental-2024-01-15.tar.gz',
        description: 'Backup incremental das últimas alterações'
      },
      {
        id: '3',
        name: 'Backup Semanal',
        type: 'full',
        status: 'pending',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        size: 0,
        location: '',
        description: 'Backup completo semanal',
        schedule: {
          frequency: 'weekly',
          time: '03:00',
          days: [1] // Segunda-feira
        }
      }
    ]
    setBackups(mockBackups)
  }

  const loadMaintenanceTasks = () => {
    const mockTasks: MaintenanceTask[] = [
      {
        id: '1',
        name: 'Limpeza de Cache',
        description: 'Remove arquivos de cache antigos e otimiza performance',
        type: 'cache',
        status: 'completed',
        priority: 'medium',
        estimatedDuration: 15,
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 22 * 60 * 60 * 1000),
        isScheduled: true
      },
      {
        id: '2',
        name: 'Otimização do Banco de Dados',
        description: 'Executa VACUUM e ANALYZE no PostgreSQL',
        type: 'database',
        status: 'running',
        priority: 'high',
        estimatedDuration: 45,
        isScheduled: false
      },
      {
        id: '3',
        name: 'Limpeza de Arquivos Temporários',
        description: 'Remove arquivos temporários e logs antigos',
        type: 'storage',
        status: 'pending',
        priority: 'low',
        estimatedDuration: 30,
        nextRun: new Date(Date.now() + 6 * 60 * 60 * 1000),
        isScheduled: true
      },
      {
        id: '4',
        name: 'Verificação de Segurança',
        description: 'Executa verificação de vulnerabilidades',
        type: 'security',
        status: 'pending',
        priority: 'critical',
        estimatedDuration: 60,
        nextRun: new Date(Date.now() + 12 * 60 * 60 * 1000),
        isScheduled: true
      }
    ]
    setMaintenanceTasks(mockTasks)
  }

  const loadSystemHealth = () => {
    const mockHealth: SystemHealth = {
      database: {
        status: 'healthy',
        connections: 45,
        maxConnections: 100,
        responseTime: 12,
        diskUsage: 65
      },
      storage: {
        status: 'warning',
        totalSpace: 1000,
        usedSpace: 850,
        freeSpace: 150
      },
      cache: {
        status: 'healthy',
        hitRate: 94.5,
        memoryUsage: 256,
        maxMemory: 512
      },
      performance: {
        status: 'healthy',
        cpuUsage: 35,
        memoryUsage: 68,
        diskIO: 120,
        networkIO: 45
      }
    }
    setSystemHealth(mockHealth)
  }

  const createBackup = async (backupData: Partial<BackupJob>) => {
    try {
      const newBackup: BackupJob = {
        id: Date.now().toString(),
        name: backupData.name || 'Backup Manual',
        type: backupData.type || 'full',
        status: 'running',
        createdAt: new Date(),
        size: 0,
        location: '',
        description: backupData.description || 'Backup criado manualmente'
      }
      
      setBackups(prev => [newBackup, ...prev])
      setShowCreateBackup(false)
      
      // Simular progresso do backup
      setTimeout(() => {
        setBackups(prev => prev.map(backup => 
          backup.id === newBackup.id 
            ? { ...backup, status: 'completed', size: 1024, completedAt: new Date() }
            : backup
        ))
      }, 5000)
      
    } catch (error) {
      console.error('Erro ao criar backup:', error)
    }
  }

  const runMaintenanceTask = async (taskId: string) => {
    try {
      setMaintenanceTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'running' }
          : task
      ))
      
      // Simular execução da tarefa
      setTimeout(() => {
        setMaintenanceTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { ...task, status: 'completed', lastRun: new Date() }
            : task
        ))
      }, 3000)
      
    } catch (error) {
      console.error('Erro ao executar tarefa:', error)
    }
  }

  const deleteBackup = async (backupId: string) => {
    if (confirm('Tem certeza que deseja excluir este backup?')) {
      setBackups(prev => prev.filter(backup => backup.id !== backupId))
    }
  }

  const cancelBackup = async (backupId: string) => {
    setBackups(prev => prev.map(backup => 
      backup.id === backupId 
        ? { ...backup, status: 'cancelled' }
        : backup
    ))
  }

  const BackupCard = ({ backup }: { backup: BackupJob }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{backup.name}</h3>
          <p className="text-gray-300 text-sm mb-2">{backup.description}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span>Criado: {backup.createdAt.toLocaleString('pt-BR')}</span>
            {backup.completedAt && (
              <span>Concluído: {backup.completedAt.toLocaleString('pt-BR')}</span>
            )}
            <span>Tamanho: {backup.size} MB</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            backup.status === 'completed' ? 'bg-green-500' :
            backup.status === 'running' ? 'bg-blue-500' :
            backup.status === 'failed' ? 'bg-red-500' :
            backup.status === 'cancelled' ? 'bg-gray-500' :
            'bg-yellow-500'
          }`}>
            {backup.status}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            backup.type === 'full' ? 'bg-purple-500' :
            backup.type === 'incremental' ? 'bg-blue-500' :
            'bg-green-500'
          }`}>
            {backup.type}
          </span>
        </div>
      </div>

      {backup.location && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-gray-300 text-sm">
            <strong>Localização:</strong> {backup.location}
          </p>
        </div>
      )}

      {backup.schedule && (
        <div className="mb-4 p-3 bg-blue-900 border border-blue-700 rounded-lg">
          <h4 className="text-blue-300 font-medium mb-1">Agendamento:</h4>
          <p className="text-blue-400 text-sm">
            {backup.schedule.frequency === 'daily' ? 'Diário' :
             backup.schedule.frequency === 'weekly' ? 'Semanal' : 'Mensal'} às {backup.schedule.time}
          </p>
        </div>
      )}

      <div className="flex space-x-2">
        {backup.status === 'running' && (
          <button
            onClick={() => cancelBackup(backup.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            ⏹️ Cancelar
          </button>
        )}
        {backup.status === 'completed' && (
          <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
            📥 Download
          </button>
        )}
        <button
          onClick={() => deleteBackup(backup.id)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          🗑️ Excluir
        </button>
      </div>
    </div>
  )

  const MaintenanceTaskCard = ({ task }: { task: MaintenanceTask }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{task.name}</h3>
          <p className="text-gray-300 text-sm mb-2">{task.description}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span>Tipo: {task.type}</span>
            <span>Duração: {task.estimatedDuration} min</span>
            {task.lastRun && (
              <span>Última execução: {task.lastRun.toLocaleString('pt-BR')}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            task.priority === 'critical' ? 'bg-red-500' :
            task.priority === 'high' ? 'bg-orange-500' :
            task.priority === 'medium' ? 'bg-yellow-500' :
            'bg-green-500'
          }`}>
            {task.priority}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            task.status === 'completed' ? 'bg-green-500' :
            task.status === 'running' ? 'bg-blue-500' :
            task.status === 'failed' ? 'bg-red-500' :
            'bg-yellow-500'
          }`}>
            {task.status}
          </span>
        </div>
      </div>

      {task.nextRun && (
        <div className="mb-4 p-3 bg-blue-900 border border-blue-700 rounded-lg">
          <h4 className="text-blue-300 font-medium mb-1">Próxima Execução:</h4>
          <p className="text-blue-400 text-sm">
            {task.nextRun.toLocaleString('pt-BR')}
          </p>
        </div>
      )}

      <div className="flex space-x-2">
        {task.status === 'pending' && (
          <button
            onClick={() => runMaintenanceTask(task.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            ▶️ Executar
          </button>
        )}
        {task.status === 'running' && (
          <button
            disabled
            className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
          >
            ⏳ Executando...
          </button>
        )}
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors">
          ⚙️ Configurar
        </button>
      </div>
    </div>
  )

  const HealthIndicator = ({ 
    title, 
    status, 
    value, 
    max, 
    unit = '', 
    color 
  }: {
    title: string
    status: 'healthy' | 'warning' | 'critical'
    value: number
    max: number
    unit?: string
    color: string
  }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          status === 'healthy' ? 'bg-green-500' :
          status === 'warning' ? 'bg-yellow-500' :
          'bg-red-500'
        }`}>
          {status}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{value} {unit}</span>
          <span>{max} {unit}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${color}`}
            style={{ width: `${(value / max) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="text-center">
        <span className="text-2xl font-bold text-white">
          {((value / max) * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Carregando Sistema</h2>
          <p className="text-gray-400">Verificando backup e manutenção...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">💾 Backup e Manutenção</h1>
            <p className="text-gray-400">Gerencie backups e tarefas de manutenção do sistema</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateBackup(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ➕ Novo Backup
            </button>
            <button
              onClick={() => setShowCreateTask(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ➕ Nova Tarefa
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'backup'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            💾 Backup
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'maintenance'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            🔧 Manutenção
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'health'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            ❤️ Saúde do Sistema
          </button>
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
        </div>

        {/* Backup Tab */}
        {activeTab === 'backup' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Backups do Sistema</h2>
              <div className="text-gray-400 text-sm">
                {backups.length} backups • {backups.filter(b => b.status === 'completed').length} concluídos
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {backups.map(backup => (
                <BackupCard key={backup.id} backup={backup} />
              ))}
            </div>

            {backups.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💾</div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum backup encontrado</h3>
                <p className="text-gray-400">Crie seu primeiro backup do sistema</p>
              </div>
            )}
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Tarefas de Manutenção</h2>
              <div className="text-gray-400 text-sm">
                {maintenanceTasks.length} tarefas • {maintenanceTasks.filter(t => t.status === 'completed').length} concluídas
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {maintenanceTasks.map(task => (
                <MaintenanceTaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {/* Health Tab */}
        {activeTab === 'health' && systemHealth && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Saúde do Sistema</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <HealthIndicator
                title="Banco de Dados"
                status={systemHealth.database.status}
                value={systemHealth.database.connections}
                max={systemHealth.database.maxConnections}
                unit="conexões"
                color="bg-blue-500"
              />
              
              <HealthIndicator
                title="Armazenamento"
                status={systemHealth.storage.status}
                value={systemHealth.storage.usedSpace}
                max={systemHealth.storage.totalSpace}
                unit="GB"
                color="bg-green-500"
              />
              
              <HealthIndicator
                title="Cache"
                status={systemHealth.cache.status}
                value={systemHealth.cache.memoryUsage}
                max={systemHealth.cache.maxMemory}
                unit="MB"
                color="bg-purple-500"
              />
              
              <HealthIndicator
                title="CPU"
                status={systemHealth.performance.status}
                value={systemHealth.performance.cpuUsage}
                max={100}
                unit="%"
                color="bg-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Métricas de Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Uso de Memória:</span>
                    <span className="text-white">{systemHealth.performance.memoryUsage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Disk I/O:</span>
                    <span className="text-white">{systemHealth.performance.diskIO} MB/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network I/O:</span>
                    <span className="text-white">{systemHealth.performance.networkIO} MB/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tempo de Resposta DB:</span>
                    <span className="text-white">{systemHealth.database.responseTime}ms</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Taxa de Hit do Cache</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-500 mb-2">
                    {systemHealth.cache.hitRate}%
                  </div>
                  <p className="text-gray-400 text-sm">
                    Taxa de acerto do cache Redis
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Logs do Sistema</h2>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-white mb-2">Sistema de Logs</h3>
                <p className="text-gray-400 mb-6">
                  Visualize logs de backup, manutenção e erros do sistema
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                  Ver Logs Detalhados
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Backup Modal */}
        {showCreateBackup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">Criar Novo Backup</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                  <input
                    type="text"
                    placeholder="Nome do backup"
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
                  <select className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                    <option value="full">Completo</option>
                    <option value="incremental">Incremental</option>
                    <option value="differential">Diferencial</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                  <textarea
                    placeholder="Descrição do backup"
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowCreateBackup(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => createBackup({})}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  Criar Backup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
