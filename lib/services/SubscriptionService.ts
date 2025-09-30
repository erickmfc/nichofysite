'use client'

import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  postsPerMonth: number
  price: number
  features: string[]
  isPopular?: boolean
  isActive: boolean
}

export interface UserSubscription {
  planId: string
  planName: string
  postsPerMonth: number
  startDate: Timestamp
  endDate: Timestamp
  isActive: boolean
  autoRenew: boolean
  price: number
}

export interface PlanLimits {
  postsRemaining: number
  canCreatePost: boolean
  reason?: string
}

export class SubscriptionService {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  // ===== PLANOS DISPONÍVEIS =====
  
  static async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    try {
      const plansRef = collection(db, 'subscriptionPlans')
      const q = query(plansRef, where('isActive', '==', true), orderBy('price', 'asc'))
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SubscriptionPlan[]
    } catch (error) {
      console.error('Erro ao buscar planos:', error)
      // Retornar planos padrão em caso de erro
      return this.getDefaultPlans()
    }
  }

  private static getDefaultPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'basic',
        name: 'Básico',
        description: 'Perfeito para começar',
        postsPerMonth: 50,
        price: 29.90,
        features: [
          '50 posts por mês',
          'Templates profissionais',
          'Suporte por email',
          'Dashboard completo'
        ],
        isActive: true
      },
      {
        id: 'professional',
        name: 'Profissional',
        description: 'Para negócios em crescimento',
        postsPerMonth: 150,
        price: 79.90,
        features: [
          '150 posts por mês',
          'Templates premium',
          'Suporte prioritário',
          'Analytics avançados',
          'Agendamento de posts'
        ],
        isPopular: true,
        isActive: true
      },
      {
        id: 'enterprise',
        name: 'Empresarial',
        description: 'Para grandes empresas',
        postsPerMonth: 500,
        price: 199.90,
        features: [
          '500 posts por mês',
          'Templates exclusivos',
          'Suporte dedicado',
          'Analytics completos',
          'Agendamento avançado',
          'API personalizada'
        ],
        isActive: true
      }
    ]
  }

  // ===== GERENCIAR ASSINATURA DO USUÁRIO =====
  
  async subscribeToPlan(planId: string): Promise<boolean> {
    try {
      const plans = await SubscriptionService.getAvailablePlans()
      const selectedPlan = plans.find(plan => plan.id === planId)
      
      if (!selectedPlan) {
        throw new Error('Plano não encontrado')
      }

      const now = new Date()
      const endDate = new Date(now)
      endDate.setMonth(endDate.getMonth() + 1) // 1 mês de assinatura

      const subscription: UserSubscription = {
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        postsPerMonth: selectedPlan.postsPerMonth,
        startDate: Timestamp.fromDate(now),
        endDate: Timestamp.fromDate(endDate),
        isActive: true,
        autoRenew: true,
        price: selectedPlan.price
      }

      await updateDoc(doc(db, 'users', this.userId), {
        subscription,
        updatedAt: serverTimestamp()
      })

      return true
    } catch (error) {
      console.error('Erro ao assinar plano:', error)
      return false
    }
  }

  async getCurrentSubscription(): Promise<UserSubscription | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', this.userId))
      const userData = userDoc.data()
      return userData?.subscription || null
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error)
      return null
    }
  }

  async cancelSubscription(): Promise<boolean> {
    try {
      const subscription = await this.getCurrentSubscription()
      if (!subscription) return false

      await updateDoc(doc(db, 'users', this.userId), {
        'subscription.isActive': false,
        'subscription.autoRenew': false,
        updatedAt: serverTimestamp()
      })

      return true
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error)
      return false
    }
  }

  // ===== VERIFICAR LIMITES =====
  
  async checkPlanLimits(): Promise<PlanLimits> {
    try {
      const subscription = await this.getCurrentSubscription()
      
      if (!subscription || !subscription.isActive) {
        return {
          postsRemaining: 0,
          canCreatePost: false,
          reason: 'Assinatura inativa'
        }
      }

      // Verificar se a assinatura não expirou
      const now = new Date()
      const endDate = subscription.endDate.toDate()
      
      if (now > endDate) {
        return {
          postsRemaining: 0,
          canCreatePost: false,
          reason: 'Assinatura expirada'
        }
      }

      // Contar posts deste mês
      const postsThisMonth = await this.getPostsThisMonth()
      const postsRemaining = Math.max(0, subscription.postsPerMonth - postsThisMonth)

      return {
        postsRemaining,
        canCreatePost: postsRemaining > 0,
        reason: postsRemaining === 0 ? 'Limite mensal atingido' : undefined
      }
    } catch (error) {
      console.error('Erro ao verificar limites:', error)
      return {
        postsRemaining: 0,
        canCreatePost: false,
        reason: 'Erro ao verificar limites'
      }
    }
  }

  private async getPostsThisMonth(): Promise<number> {
    try {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      const postsRef = collection(db, 'posts')
      const q = query(
        postsRef,
        where('userId', '==', this.userId),
        where('createdAt', '>=', Timestamp.fromDate(startOfMonth)),
        where('createdAt', '<=', Timestamp.fromDate(endOfMonth))
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.length
    } catch (error) {
      console.error('Erro ao contar posts do mês:', error)
      return 0
    }
  }

  // ===== UPGRADE/DOWNGRADE DE PLANO =====
  
  async upgradePlan(newPlanId: string): Promise<boolean> {
    try {
      const currentSubscription = await this.getCurrentSubscription()
      if (!currentSubscription) return false

      const plans = await SubscriptionService.getAvailablePlans()
      const newPlan = plans.find(plan => plan.id === newPlanId)
      
      if (!newPlan) {
        throw new Error('Novo plano não encontrado')
      }

      // Calcular proratação se necessário
      const now = new Date()
      const daysRemaining = Math.ceil((currentSubscription.endDate.toDate().getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      const subscription: UserSubscription = {
        planId: newPlan.id,
        planName: newPlan.name,
        postsPerMonth: newPlan.postsPerMonth,
        startDate: Timestamp.fromDate(now),
        endDate: currentSubscription.endDate, // Manter a mesma data de fim
        isActive: true,
        autoRenew: true,
        price: newPlan.price
      }

      await updateDoc(doc(db, 'users', this.userId), {
        subscription,
        updatedAt: serverTimestamp()
      })

      return true
    } catch (error) {
      console.error('Erro ao fazer upgrade:', error)
      return false
    }
  }

  // ===== HISTÓRICO DE PAGAMENTOS =====
  
  async getPaymentHistory(): Promise<any[]> {
    try {
      const paymentsRef = collection(db, 'users', this.userId, 'payments')
      const q = query(paymentsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Erro ao buscar histórico de pagamentos:', error)
      return []
    }
  }

  // ===== ESTATÍSTICAS DE USO =====
  
  async getUsageStats(): Promise<{
    postsUsed: number
    postsRemaining: number
    usagePercentage: number
    daysUntilReset: number
  }> {
    try {
      const subscription = await this.getCurrentSubscription()
      const postsThisMonth = await this.getPostsThisMonth()
      
      if (!subscription) {
        return {
          postsUsed: 0,
          postsRemaining: 0,
          usagePercentage: 0,
          daysUntilReset: 0
        }
      }

      const postsRemaining = Math.max(0, subscription.postsPerMonth - postsThisMonth)
      const usagePercentage = (postsThisMonth / subscription.postsPerMonth) * 100
      
      const now = new Date()
      const endDate = subscription.endDate.toDate()
      const daysUntilReset = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      return {
        postsUsed: postsThisMonth,
        postsRemaining,
        usagePercentage: Math.round(usagePercentage),
        daysUntilReset: Math.max(0, daysUntilReset)
      }
    } catch (error) {
      console.error('Erro ao calcular estatísticas de uso:', error)
      return {
        postsUsed: 0,
        postsRemaining: 0,
        usagePercentage: 0,
        daysUntilReset: 0
      }
    }
  }

  // ===== INICIALIZAR USUÁRIO COM PLANO GRATUITO =====
  
  async initializeWithFreePlan(): Promise<boolean> {
    try {
      const existingSubscription = await this.getCurrentSubscription()
      if (existingSubscription) return true // Já tem assinatura

      const now = new Date()
      const endDate = new Date(now)
      endDate.setMonth(endDate.getMonth() + 1)

      const freeSubscription: UserSubscription = {
        planId: 'free',
        planName: 'Gratuito',
        postsPerMonth: 5, // 5 posts gratuitos por mês
        startDate: Timestamp.fromDate(now),
        endDate: Timestamp.fromDate(endDate),
        isActive: true,
        autoRenew: true,
        price: 0
      }

      await updateDoc(doc(db, 'users', this.userId), {
        subscription: freeSubscription,
        updatedAt: serverTimestamp()
      })

      return true
    } catch (error) {
      console.error('Erro ao inicializar plano gratuito:', error)
      return false
    }
  }
}
