'use client'

import { useState } from 'react'
import { useTheme } from '@/lib/contexts/ThemeContext'
import { useGoals } from '@/hooks/useGoals'
import { Goal } from '@/lib/services/GoalsService'
import { SimpleChart, GoalProgressChart } from '@/components/ui/SimpleChart'

interface GoalsModuleProps {
  className?: string
}

export const GoalsModule = ({ className = '' }: GoalsModuleProps) => {
  const { theme } = useTheme()
  const { 
    activeGoals, 
    goalProgress, 
    alerts, 
    loading, 
    stats, 
    createGoal, 
    updateGoal, 
    deleteGoal,
    markAlertAsRead 
  } = useGoals()
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

  // Preparar dados para gráficos
  const progressData = activeGoals.map(goal => {
    const progress = goalProgress.get(goal.id)
    return {
      id: goal.id,
      title: goal.title,
      progress: progress?.progress || 0,
      color: getGoalColor(goal.priority, progress?.progress || 0)
    }
  })

  const getGoalColor = (priority: string, progress: number) => {
    if (progress >= 100) return '#10B981' // Verde para concluído
    if (progress >= 75) return '#3B82F6' // Azul para quase concluído
    if (priority === 'high') return '#EF4444' // Vermelho para alta prioridade
    if (priority === 'medium') return '#F59E0B' // Amarelo para média prioridade
    return '#6B7280' // Cinza para baixa prioridade
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const getStatusText = (progress: number, daysRemaining: number) => {
    if (progress >= 100) return 'Concluída ✅'
    if (daysRemaining < 0) return 'Atrasada ⚠️'
    if (daysRemaining <= 3) return 'Prazo próximo ⏰'
    if (progress >= 75) return 'Quase lá! 🎯'
    return 'Em andamento 📈'
  }

  const handleCreateGoal = async (goalData: Partial<Goal>) => {
    const newGoal = {
      title: goalData.title || '',
      description: goalData.description || '',
      type: goalData.type || 'posts',
      targetValue: goalData.targetValue || 0,
      unit: goalData.unit || '',
      deadline: goalData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      priority: goalData.priority || 'medium',
      notifications: {
        enabled: true,
        frequency: 'weekly'
      }
    } as Omit<Goal, 'id' | 'userId' | 'currentValue' | 'isCompleted' | 'createdAt' | 'updatedAt'>

    await createGoal(newGoal)
    setShowCreateForm(false)
  }

  const handleMarkAlertAsRead = async (alertId: string) => {
    await markAlertAsRead(alertId)
  }

  if (loading) {
    return (
      <div className={`rounded-2xl p-6 shadow-lg ${className} ${
        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className={`ml-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Carregando metas...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl p-6 shadow-lg ${className} ${
      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          🎯 Metas Personalizadas
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreateForm(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              theme === 'dark' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            + Nova Meta
          </button>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {stats.activeGoals}
          </div>
          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Metas Ativas
          </div>
        </div>
        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-2xl font-bold text-green-600`}>
            {stats.completedGoals}
          </div>
          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Concluídas
          </div>
        </div>
        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-2xl font-bold text-red-600`}>
            {stats.overdueGoals}
          </div>
          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Atrasadas
          </div>
        </div>
        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-2xl font-bold text-yellow-600`}>
            {stats.unreadAlerts}
          </div>
          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Alertas
          </div>
        </div>
      </div>

      {/* Gráfico de progresso */}
      {progressData.length > 0 && (
        <div className="mb-6">
          <GoalProgressChart goals={progressData} />
        </div>
      )}

      {/* Lista de metas */}
      <div className="space-y-4 mb-6">
        {activeGoals.length === 0 ? (
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm">Nenhuma meta ativa</p>
            <p className="text-xs">Crie sua primeira meta para começar!</p>
          </div>
        ) : (
          activeGoals.map(goal => {
            const progress = goalProgress.get(goal.id)
            return (
              <div 
                key={goal.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                    : 'bg-gray-50 border-gray-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getPriorityIcon(goal.priority)}</span>
                    <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {goal.title}
                    </h4>
                  </div>
                  <div className={`text-sm font-medium ${
                    progress?.needsAttention ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {getStatusText(progress?.progress || 0, progress?.daysRemaining || 0)}
                  </div>
                </div>
                
                <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {goal.description}
                </p>
                
                {/* Barra de progresso */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                    </span>
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                      {Math.round(progress?.progress || 0)}%
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    <div
                      className={`h-2 rounded-full transition-all duration-500`}
                      style={{
                        width: `${progress?.progress || 0}%`,
                        backgroundColor: getGoalColor(goal.priority, progress?.progress || 0)
                      }}
                    />
                  </div>
                </div>
                
                {/* Informações adicionais */}
                <div className="flex justify-between text-xs">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    Prazo: {goal.deadline.toDate().toLocaleDateString('pt-BR')}
                  </span>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    {progress?.daysRemaining || 0} dias restantes
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Alertas */}
      {alerts.filter(a => !a.isRead).length > 0 && (
        <div className="space-y-3">
          <h4 className={`text-md font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            🔔 Alertas Recentes
          </h4>
          {alerts.filter(a => !a.isRead).slice(0, 3).map(alert => (
            <div 
              key={alert.id}
              className={`p-3 rounded-lg border-l-4 ${
                alert.priority === 'high' 
                  ? 'border-red-500 bg-red-50' 
                  : alert.priority === 'medium'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-blue-500 bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-gray-900">{alert.title}</h5>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                </div>
                <button
                  onClick={() => handleMarkAlertAsRead(alert.id)}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de criação de meta */}
      {showCreateForm && (
        <CreateGoalModal
          onClose={() => setShowCreateForm(false)}
          onCreate={handleCreateGoal}
        />
      )}
    </div>
  )
}

// Modal para criar nova meta
interface CreateGoalModalProps {
  onClose: () => void
  onCreate: (goalData: Partial<Goal>) => void
}

const CreateGoalModal = ({ onClose, onCreate }: CreateGoalModalProps) => {
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'posts' as const,
    targetValue: 0,
    unit: '',
    priority: 'medium' as const,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-xl p-6 w-full max-w-md mx-4 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Criar Nova Meta
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Tipo
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="posts">Posts</option>
                <option value="engagement">Engajamento</option>
                <option value="categories">Categorias</option>
                <option value="followers">Seguidores</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Meta
              </label>
              <input
                type="number"
                value={formData.targetValue}
                onChange={(e) => setFormData(prev => ({ ...prev, targetValue: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                theme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Criar Meta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
