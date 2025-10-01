'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { GoalsService, Goal, GoalProgress, SmartAlert } from '@/lib/services/GoalsService'

export const useGoals = () => {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [activeGoals, setActiveGoals] = useState<Goal[]>([])
  const [goalProgress, setGoalProgress] = useState<Map<string, GoalProgress>>(new Map())
  const [alerts, setAlerts] = useState<SmartAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const goalsService = user ? new GoalsService(user.uid) : null

  // Carregar metas do usuário
  const loadGoals = useCallback(async () => {
    if (!goalsService) return

    try {
      setLoading(true)
      setError(null)

      const [userGoals, activeGoalsList] = await Promise.all([
        goalsService.getUserGoals(),
        goalsService.getActiveGoals()
      ])

      setGoals(userGoals)
      setActiveGoals(activeGoalsList)

      // Calcular progresso para cada meta ativa
      const progressMap = new Map<string, GoalProgress>()
      for (const goal of activeGoalsList) {
        const progress = await goalsService.calculateGoalProgress(goal.id)
        if (progress) {
          progressMap.set(goal.id, progress)
        }
      }
      setGoalProgress(progressMap)

    } catch (err) {
      console.error('Erro ao carregar metas:', err)
      setError('Erro ao carregar metas')
    } finally {
      setLoading(false)
    }
  }, [goalsService])

  // Carregar alertas
  const loadAlerts = useCallback(async () => {
    if (!goalsService) return

    try {
      const userAlerts = await goalsService.getUserAlerts()
      setAlerts(userAlerts)
    } catch (err) {
      console.error('Erro ao carregar alertas:', err)
    }
  }, [goalsService])

  // Criar nova meta
  const createGoal = useCallback(async (goalData: Omit<Goal, 'id' | 'userId' | 'currentValue' | 'isCompleted' | 'createdAt' | 'updatedAt'>) => {
    if (!goalsService) return null

    try {
      const goalId = await goalsService.createGoal(goalData)
      if (goalId) {
        await loadGoals() // Recarregar metas
      }
      return goalId
    } catch (err) {
      console.error('Erro ao criar meta:', err)
      return null
    }
  }, [goalsService, loadGoals])

  // Atualizar meta
  const updateGoal = useCallback(async (goalId: string, updates: Partial<Goal>) => {
    if (!goalsService) return false

    try {
      const success = await goalsService.updateGoal(goalId, updates)
      if (success) {
        await loadGoals() // Recarregar metas
      }
      return success
    } catch (err) {
      console.error('Erro ao atualizar meta:', err)
      return false
    }
  }, [goalsService, loadGoals])

  // Excluir meta
  const deleteGoal = useCallback(async (goalId: string) => {
    if (!goalsService) return false

    try {
      const success = await goalsService.deleteGoal(goalId)
      if (success) {
        await loadGoals() // Recarregar metas
      }
      return success
    } catch (err) {
      console.error('Erro ao excluir meta:', err)
      return false
    }
  }, [goalsService, loadGoals])

  // Marcar alerta como lido
  const markAlertAsRead = useCallback(async (alertId: string) => {
    if (!goalsService) return false

    try {
      const success = await goalsService.markAlertAsRead(alertId)
      if (success) {
        await loadAlerts() // Recarregar alertas
      }
      return success
    } catch (err) {
      console.error('Erro ao marcar alerta como lido:', err)
      return false
    }
  }, [goalsService, loadAlerts])

  // Sincronizar metas com dados reais
  const syncGoalsWithData = useCallback(async () => {
    if (!goalsService) return

    try {
      await goalsService.syncGoalsWithRealData()
      await loadGoals() // Recarregar metas atualizadas
    } catch (err) {
      console.error('Erro ao sincronizar metas:', err)
    }
  }, [goalsService, loadGoals])

  // Gerar alertas inteligentes
  const generateSmartAlerts = useCallback(async () => {
    if (!goalsService) return

    try {
      await goalsService.generateSmartAlerts()
      await loadAlerts() // Recarregar alertas
    } catch (err) {
      console.error('Erro ao gerar alertas:', err)
    }
  }, [goalsService, loadAlerts])

  // Carregar dados iniciais
  useEffect(() => {
    if (user) {
      loadGoals()
      loadAlerts()
    }
  }, [user, loadGoals, loadAlerts])

  // Sincronizar automaticamente a cada 5 minutos
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      syncGoalsWithData()
      generateSmartAlerts()
    }, 5 * 60 * 1000) // 5 minutos

    return () => clearInterval(interval)
  }, [user, syncGoalsWithData, generateSmartAlerts])

  // Estatísticas calculadas
  const stats = {
    totalGoals: goals.length,
    activeGoals: activeGoals.length,
    completedGoals: goals.filter(g => g.isCompleted).length,
    overdueGoals: Array.from(goalProgress.values()).filter(p => p.needsAttention).length,
    unreadAlerts: alerts.filter(a => !a.isRead).length,
    highPriorityAlerts: alerts.filter(a => !a.isRead && a.priority === 'high').length
  }

  return {
    goals,
    activeGoals,
    goalProgress,
    alerts,
    loading,
    error,
    stats,
    createGoal,
    updateGoal,
    deleteGoal,
    markAlertAsRead,
    syncGoalsWithData,
    generateSmartAlerts,
    refreshGoals: loadGoals,
    refreshAlerts: loadAlerts
  }
}
