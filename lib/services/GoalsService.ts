'use client'

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface Goal {
  id: string
  userId: string
  title: string
  description: string
  type: 'posts' | 'engagement' | 'categories' | 'followers' | 'custom'
  targetValue: number
  currentValue: number
  unit: string
  deadline: Timestamp
  isActive: boolean
  isCompleted: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  category?: string
  priority: 'low' | 'medium' | 'high'
  notifications: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'monthly'
    lastSent?: Timestamp
  }
}

export interface GoalProgress {
  goalId: string
  progress: number // 0-100
  daysRemaining: number
  isOnTrack: boolean
  projectedCompletion: Date | null
  needsAttention: boolean
}

export interface SmartAlert {
  id: string
  userId: string
  type: 'goal_achieved' | 'goal_behind' | 'milestone_reached' | 'performance_trend' | 'deadline_approaching'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high'
  isRead: boolean
  createdAt: Timestamp
  goalId?: string
  actionRequired: boolean
  actionUrl?: string
}

export class GoalsService {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  // ===== CRIAÇÃO E GESTÃO DE METAS =====

  async createGoal(goalData: Omit<Goal, 'id' | 'userId' | 'currentValue' | 'isCompleted' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const goalRef = await addDoc(collection(db, 'users', this.userId, 'goals'), {
        ...goalData,
        userId: this.userId,
        currentValue: 0,
        isCompleted: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      return goalRef.id
    } catch (error) {
      console.error('Erro ao criar meta:', error)
      return null
    }
  }

  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'users', this.userId, 'goals', goalId), {
        ...updates,
        updatedAt: serverTimestamp()
      })
      return true
    } catch (error) {
      console.error('Erro ao atualizar meta:', error)
      return false
    }
  }

  async deleteGoal(goalId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'users', this.userId, 'goals', goalId))
      return true
    } catch (error) {
      console.error('Erro ao excluir meta:', error)
      return false
    }
  }

  async getUserGoals(): Promise<Goal[]> {
    try {
      const goalsRef = collection(db, 'users', this.userId, 'goals')
      const q = query(goalsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Goal[]
    } catch (error) {
      console.error('Erro ao buscar metas:', error)
      return []
    }
  }

  async getActiveGoals(): Promise<Goal[]> {
    try {
      const goalsRef = collection(db, 'users', this.userId, 'goals')
      const q = query(
        goalsRef, 
        where('isActive', '==', true),
        where('isCompleted', '==', false),
        orderBy('deadline', 'asc')
      )
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Goal[]
    } catch (error) {
      console.error('Erro ao buscar metas ativas:', error)
      return []
    }
  }

  // ===== ATUALIZAÇÃO DE PROGRESSO =====

  async updateGoalProgress(goalId: string, newValue: number): Promise<boolean> {
    try {
      const goalDoc = await getDoc(doc(db, 'users', this.userId, 'goals', goalId))
      if (!goalDoc.exists()) return false

      const goal = goalDoc.data() as Goal
      const isCompleted = newValue >= goal.targetValue

      await updateDoc(doc(db, 'users', this.userId, 'goals', goalId), {
        currentValue: newValue,
        isCompleted,
        updatedAt: serverTimestamp()
      })

      // Criar alerta se meta foi concluída
      if (isCompleted && !goal.isCompleted) {
        await this.createAlert({
          type: 'goal_achieved',
          title: '🎉 Meta Concluída!',
          message: `Parabéns! Você alcançou sua meta "${goal.title}"`,
          priority: 'high',
          goalId
        })
      }

      return true
    } catch (error) {
      console.error('Erro ao atualizar progresso da meta:', error)
      return false
    }
  }

  async syncGoalsWithRealData(): Promise<void> {
    try {
      const activeGoals = await this.getActiveGoals()
      
      for (const goal of activeGoals) {
        let currentValue = 0
        
        switch (goal.type) {
          case 'posts':
            currentValue = await this.getCurrentPostsCount()
            break
          case 'engagement':
            currentValue = await this.getCurrentEngagementRate()
            break
          case 'categories':
            currentValue = await this.getCurrentCategoriesCount()
            break
          case 'followers':
            currentValue = await this.getCurrentFollowersCount()
            break
        }
        
        await this.updateGoalProgress(goal.id, currentValue)
      }
    } catch (error) {
      console.error('Erro ao sincronizar metas com dados reais:', error)
    }
  }

  // ===== CÁLCULO DE PROGRESSO =====

  async calculateGoalProgress(goalId: string): Promise<GoalProgress | null> {
    try {
      const goalDoc = await getDoc(doc(db, 'users', this.userId, 'goals', goalId))
      if (!goalDoc.exists()) return null

      const goal = goalDoc.data() as Goal
      const now = new Date()
      const deadline = goal.deadline.toDate()
      
      const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100)
      const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      // Calcular se está no caminho certo
      const daysElapsed = Math.ceil((now.getTime() - goal.createdAt.toDate().getTime()) / (1000 * 60 * 60 * 24))
      const totalDays = Math.ceil((deadline.getTime() - goal.createdAt.toDate().getTime()) / (1000 * 60 * 60 * 24))
      const expectedProgress = (daysElapsed / totalDays) * 100
      
      const isOnTrack = progress >= expectedProgress - 10 // Margem de 10%
      const needsAttention = !isOnTrack && daysRemaining < 7
      
      // Projetar data de conclusão
      let projectedCompletion: Date | null = null
      if (progress > 0 && progress < 100) {
        const ratePerDay = progress / daysElapsed
        const remainingProgress = 100 - progress
        const daysToComplete = remainingProgress / ratePerDay
        projectedCompletion = new Date(now.getTime() + (daysToComplete * 24 * 60 * 60 * 1000))
      }

      return {
        goalId,
        progress,
        daysRemaining,
        isOnTrack,
        projectedCompletion,
        needsAttention
      }
    } catch (error) {
      console.error('Erro ao calcular progresso da meta:', error)
      return null
    }
  }

  // ===== ALERTAS INTELIGENTES =====

  async createAlert(alertData: Omit<SmartAlert, 'id' | 'userId' | 'isRead' | 'createdAt'>): Promise<string | null> {
    try {
      const alertRef = await addDoc(collection(db, 'users', this.userId, 'alerts'), {
        ...alertData,
        userId: this.userId,
        isRead: false,
        createdAt: serverTimestamp()
      })
      
      return alertRef.id
    } catch (error) {
      console.error('Erro ao criar alerta:', error)
      return null
    }
  }

  async getUserAlerts(): Promise<SmartAlert[]> {
    try {
      const alertsRef = collection(db, 'users', this.userId, 'alerts')
      const q = query(alertsRef, orderBy('createdAt', 'desc'), limit(50))
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SmartAlert[]
    } catch (error) {
      console.error('Erro ao buscar alertas:', error)
      return []
    }
  }

  async markAlertAsRead(alertId: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'users', this.userId, 'alerts', alertId), {
        isRead: true
      })
      return true
    } catch (error) {
      console.error('Erro ao marcar alerta como lido:', error)
      return false
    }
  }

  async generateSmartAlerts(): Promise<void> {
    try {
      const activeGoals = await this.getActiveGoals()
      
      for (const goal of activeGoals) {
        const progress = await this.calculateGoalProgress(goal.id)
        if (!progress) continue

        // Alerta de meta atrasada
        if (progress.needsAttention && !progress.isOnTrack) {
          await this.createAlert({
            type: 'goal_behind',
            title: '⚠️ Meta Atrasada',
            message: `Sua meta "${goal.title}" está atrasada. ${progress.daysRemaining} dias restantes.`,
            priority: 'high',
            goalId: goal.id,
            actionRequired: true,
            actionUrl: '/dashboard/goals'
          })
        }

        // Alerta de prazo se aproximando
        if (progress.daysRemaining <= 3 && !goal.isCompleted) {
          await this.createAlert({
            type: 'deadline_approaching',
            title: '⏰ Prazo Próximo',
            message: `Sua meta "${goal.title}" vence em ${progress.daysRemaining} dias!`,
            priority: 'medium',
            goalId: goal.id,
            actionRequired: true,
            actionUrl: '/dashboard/goals'
          })
        }

        // Alerta de marco alcançado (50%, 75%)
        const milestones = [50, 75]
        for (const milestone of milestones) {
          if (progress.progress >= milestone && progress.progress < milestone + 5) {
            await this.createAlert({
              type: 'milestone_reached',
              title: `🎯 ${milestone}% Concluído!`,
              message: `Você alcançou ${milestone}% da sua meta "${goal.title}"!`,
              priority: 'medium',
              goalId: goal.id
            })
            break
          }
        }
      }
    } catch (error) {
      console.error('Erro ao gerar alertas inteligentes:', error)
    }
  }

  // ===== MÉTODOS AUXILIARES PARA DADOS REAIS =====

  private async getCurrentPostsCount(): Promise<number> {
    try {
      const postsRef = collection(db, 'posts')
      const q = query(postsRef, where('userId', '==', this.userId))
      const snapshot = await getDocs(q)
      return snapshot.size
    } catch (error) {
      console.error('Erro ao contar posts:', error)
      return 0
    }
  }

  private async getCurrentEngagementRate(): Promise<number> {
    try {
      // Implementar cálculo baseado em dados reais
      // Por enquanto, retornar valor simulado baseado em posts
      const postsCount = await this.getCurrentPostsCount()
      return Math.min(postsCount * 1.2, 100)
    } catch (error) {
      console.error('Erro ao calcular taxa de engajamento:', error)
      return 0
    }
  }

  private async getCurrentCategoriesCount(): Promise<number> {
    try {
      const postsRef = collection(db, 'posts')
      const q = query(postsRef, where('userId', '==', this.userId))
      const snapshot = await getDocs(q)
      
      const categories = new Set()
      snapshot.docs.forEach(doc => {
        const data = doc.data()
        if (data.category) categories.add(data.category)
      })
      
      return categories.size
    } catch (error) {
      console.error('Erro ao contar categorias:', error)
      return 0
    }
  }

  private async getCurrentFollowersCount(): Promise<number> {
    try {
      // Implementar quando sistema de seguidores estiver disponível
      return 0
    } catch (error) {
      console.error('Erro ao contar seguidores:', error)
      return 0
    }
  }

  // ===== TEMPLATES DE METAS =====

  getGoalTemplates(): Partial<Goal>[] {
    return [
      {
        title: 'Meta de Posts Mensais',
        description: 'Criar posts consistentemente durante o mês',
        type: 'posts',
        targetValue: 30,
        unit: 'posts',
        priority: 'medium',
        notifications: {
          enabled: true,
          frequency: 'weekly'
        }
      },
      {
        title: 'Taxa de Engajamento',
        description: 'Aumentar a taxa de engajamento dos posts',
        type: 'engagement',
        targetValue: 80,
        unit: '%',
        priority: 'high',
        notifications: {
          enabled: true,
          frequency: 'weekly'
        }
      },
      {
        title: 'Diversidade de Nichos',
        description: 'Explorar diferentes categorias de conteúdo',
        type: 'categories',
        targetValue: 10,
        unit: 'nichos',
        priority: 'low',
        notifications: {
          enabled: true,
          frequency: 'monthly'
        }
      }
    ]
  }
}
