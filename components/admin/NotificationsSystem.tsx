'use client'

import { useState, useEffect } from 'react'
import { useAdminRealData } from '@/hooks/useAdminRealData'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: 'system' | 'user' | 'content' | 'security' | 'performance'
  actions?: Array<{
    label: string
    action: string
    type: 'primary' | 'secondary' | 'danger'
  }>
}

interface AlertRule {
  id: string
  name: string
  description: string
  condition: string
  threshold: number
  isActive: boolean
  category: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  lastTriggered?: Date
}

interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  categories: {
    system: boolean
    user: boolean
    content: boolean
    security: boolean
    performance: boolean
  }
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly'
}

export const NotificationsSystem = () => {
  const { stats, systemStatus } = useAdminRealData()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [alertRules, setAlertRules] = useState<AlertRule[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    categories: {
      system: true,
      user: true,
      content: true,
      security: true,
      performance: true
    },
    frequency: 'immediate'
  })
  const [activeTab, setActiveTab] = useState<'notifications' | 'alerts' | 'settings'>('notifications')
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical' | 'system'>('all')

  useEffect(() => {
    loadNotifications()
    loadAlertRules()
    checkSystemAlerts()
  }, [stats, systemStatus])

  const loadNotifications = () => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'warning',
        title: 'Alto Volume de Posts Pendentes',
        message: `${stats.pendingApprovals} posts aguardando aprovação. Considere revisar urgentemente.`,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false,
        priority: 'high',
        category: 'content',
        actions: [
          { label: 'Revisar Posts', action: 'review_posts', type: 'primary' },
          { label: 'Marcar como Lida', action: 'mark_read', type: 'secondary' }
        ]
      },
      {
        id: '2',
        type: 'error',
        title: 'Erro de Conexão com Firestore',
        message: 'Falha temporária na conexão com o banco de dados. Sistema recuperado automaticamente.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: true,
        priority: 'critical',
        category: 'system',
        actions: [
          { label: 'Ver Logs', action: 'view_logs', type: 'primary' },
          { label: 'Testar Conexão', action: 'test_connection', type: 'secondary' }
        ]
      },
      {
        id: '3',
        type: 'success',
        title: 'Backup Concluído com Sucesso',
        message: 'Backup automático realizado com sucesso. Dados salvos em 3 locais diferentes.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isRead: false,
        priority: 'low',
        category: 'system'
      },
      {
        id: '4',
        type: 'info',
        title: 'Novo Usuário Registrado',
        message: 'Usuário "João Silva" se registrou no sistema. Verificar perfil.',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        isRead: false,
        priority: 'medium',
        category: 'user',
        actions: [
          { label: 'Ver Perfil', action: 'view_profile', type: 'primary' }
        ]
      },
      {
        id: '5',
        type: 'warning',
        title: 'Performance Degradada',
        message: 'Tempo de resposta acima de 2 segundos detectado. Investigar causa.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        isRead: true,
        priority: 'high',
        category: 'performance',
        actions: [
          { label: 'Ver Métricas', action: 'view_metrics', type: 'primary' },
          { label: 'Reiniciar Serviços', action: 'restart_services', type: 'danger' }
        ]
      }
    ]
    setNotifications(mockNotifications)
  }

  const loadAlertRules = () => {
    const mockRules: AlertRule[] = [
      {
        id: '1',
        name: 'Posts Pendentes Críticos',
        description: 'Alerta quando há mais de 50 posts pendentes',
        condition: 'pending_posts > 50',
        threshold: 50,
        isActive: true,
        category: 'content',
        priority: 'high',
        lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Erro de Sistema',
        description: 'Alerta para qualquer erro crítico do sistema',
        condition: 'system_error = true',
        threshold: 1,
        isActive: true,
        category: 'system',
        priority: 'critical',
        lastTriggered: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Performance Baixa',
        description: 'Alerta quando tempo de resposta > 2s',
        condition: 'response_time > 2000',
        threshold: 2000,
        isActive: true,
        category: 'performance',
        priority: 'high',
        lastTriggered: new Date(Date.now() - 12 * 60 * 60 * 1000)
      },
      {
        id: '4',
        name: 'Novos Usuários',
        description: 'Notificação para novos registros',
        condition: 'new_user_registered = true',
        threshold: 1,
        isActive: true,
        category: 'user',
        priority: 'medium'
      },
      {
        id: '5',
        name: 'Backup Falhou',
        description: 'Alerta quando backup automático falha',
        condition: 'backup_failed = true',
        threshold: 1,
        isActive: false,
        category: 'system',
        priority: 'critical'
      }
    ]
    setAlertRules(mockRules)
  }

  const checkSystemAlerts = () => {
    // Verificar condições em tempo real
    if (stats.pendingApprovals > 50) {
      createSystemAlert('warning', 'Alto Volume de Posts Pendentes', 
        `${stats.pendingApprovals} posts aguardando aprovação`, 'high', 'content')
    }

    if (systemStatus.performance < 80) {
      createSystemAlert('error', 'Performance Degradada', 
        `Performance do sistema em ${systemStatus.performance}%`, 'high', 'performance')
    }

    if (systemStatus.security === 'critical') {
      createSystemAlert('error', 'Alerta de Segurança', 
        'Sistema de segurança detectou atividade suspeita', 'critical', 'security')
    }
  }

  const createSystemAlert = (type: Notification['type'], title: string, message: string, priority: Notification['priority'], category: Notification['category']) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date(),
      isRead: false,
      priority,
      category
    }

    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
  }

  const handleNotificationAction = (notificationId: string, action: string) => {
    console.log(`Ação ${action} executada para notificação ${notificationId}`)
    markAsRead(notificationId)
  }

  const toggleAlertRule = (ruleId: string) => {
    setAlertRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    )
  }

  const deleteAlertRule = (ruleId: string) => {
    setAlertRules(prev => prev.filter(rule => rule.id !== ruleId))
  }

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread':
        return !notif.isRead
      case 'critical':
        return notif.priority === 'critical'
      case 'system':
        return notif.category === 'system'
      default:
        return true
    }
  })

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <div className={`bg-gray-800 rounded-xl p-6 border transition-colors ${
      notification.isRead ? 'border-gray-700' : 'border-blue-500'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start">
          <div className={`w-3 h-3 rounded-full mr-3 mt-2 ${
            notification.type === 'error' ? 'bg-red-500' :
            notification.type === 'warning' ? 'bg-yellow-500' :
            notification.type === 'success' ? 'bg-green-500' :
            'bg-blue-500'
          }`}></div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{notification.title}</h3>
            <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>{notification.timestamp.toLocaleString('pt-BR')}</span>
              <span className={`px-2 py-1 rounded ${
                notification.priority === 'critical' ? 'bg-red-500' :
                notification.priority === 'high' ? 'bg-orange-500' :
                notification.priority === 'medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}>
                {notification.priority}
              </span>
              <span className="px-2 py-1 bg-gray-700 rounded">
                {notification.category}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!notification.isRead && (
            <button
              onClick={() => markAsRead(notification.id)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              ✓ Marcar como Lida
            </button>
          )}
          <button
            onClick={() => deleteNotification(notification.id)}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            🗑️
          </button>
        </div>
      </div>

      {notification.actions && notification.actions.length > 0 && (
        <div className="flex space-x-2">
          {notification.actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleNotificationAction(notification.id, action.action)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                action.type === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                action.type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' :
                'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  const AlertRuleCard = ({ rule }: { rule: AlertRule }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{rule.name}</h3>
          <p className="text-gray-300 text-sm mb-2">{rule.description}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span>Condição: {rule.condition}</span>
            <span>Limite: {rule.threshold}</span>
            <span className={`px-2 py-1 rounded ${
              rule.priority === 'critical' ? 'bg-red-500' :
              rule.priority === 'high' ? 'bg-orange-500' :
              rule.priority === 'medium' ? 'bg-yellow-500' :
              'bg-green-500'
            }`}>
              {rule.priority}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleAlertRule(rule.id)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              rule.isActive 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {rule.isActive ? 'Ativo' : 'Inativo'}
          </button>
          <button
            onClick={() => deleteAlertRule(rule.id)}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            🗑️
          </button>
        </div>
      </div>

      {rule.lastTriggered && (
        <div className="text-xs text-gray-400">
          Último disparo: {rule.lastTriggered.toLocaleString('pt-BR')}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">🔔 Sistema de Notificações</h1>
            <p className="text-gray-400">Gerencie alertas e notificações do sistema</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {notifications.filter(n => !n.isRead).length} não lidas
            </div>
            <button
              onClick={markAllAsRead}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ✓ Marcar Todas como Lidas
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            🔔 Notificações
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'alerts'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            ⚠️ Regras de Alerta
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            ⚙️ Configurações
          </button>
        </div>

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            {/* Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-gray-400">Filtrar:</span>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                Não Lidas
              </button>
              <button
                onClick={() => setFilter('critical')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filter === 'critical' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                Críticas
              </button>
              <button
                onClick={() => setFilter('system')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filter === 'system' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                Sistema
              </button>
            </div>

            <div className="space-y-4">
              {filteredNotifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>

            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔔</div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhuma notificação encontrada</h3>
                <p className="text-gray-400">Todas as notificações foram processadas</p>
              </div>
            )}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Regras de Alerta</h2>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                ➕ Nova Regra
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {alertRules.map(rule => (
                <AlertRuleCard key={rule.id} rule={rule} />
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Configurações de Notificação</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Métodos de Notificação */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Métodos de Notificação</h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.email}
                      onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.checked }))}
                      className="mr-3"
                    />
                    <span className="text-gray-300">📧 Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.push}
                      onChange={(e) => setSettings(prev => ({ ...prev, push: e.target.checked }))}
                      className="mr-3"
                    />
                    <span className="text-gray-300">🔔 Push Notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.sms}
                      onChange={(e) => setSettings(prev => ({ ...prev, sms: e.target.checked }))}
                      className="mr-3"
                    />
                    <span className="text-gray-300">📱 SMS</span>
                  </label>
                </div>
              </div>

              {/* Categorias */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Categorias</h3>
                <div className="space-y-4">
                  {Object.entries(settings.categories).map(([category, enabled]) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          categories: { ...prev.categories, [category]: e.target.checked }
                        }))}
                        className="mr-3"
                      />
                      <span className="text-gray-300 capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Frequência */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Frequência</h3>
                <select
                  value={settings.frequency}
                  onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="immediate">Imediato</option>
                  <option value="hourly">Por Hora</option>
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                </select>
              </div>

              {/* Salvar Configurações */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Salvar Configurações</h3>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors">
                  💾 Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
