'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

interface UserPlan {
  plan: string
  planSelectedAt: Date
  planStatus: 'active' | 'inactive' | 'expired'
  planExpiresAt?: Date
}

export const useUserPlan = () => {
  const { user } = useAuth()
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasSelectedPlan, setHasSelectedPlan] = useState(false)

  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }

    loadUserPlan()
  }, [user])

  const loadUserPlan = async () => {
    if (!user) return

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        
        if (data.plan && data.planSelectedAt) {
          setUserPlan({
            plan: data.plan,
            planSelectedAt: data.planSelectedAt.toDate(),
            planStatus: data.planStatus || 'active',
            planExpiresAt: data.planExpiresAt?.toDate()
          })
          setHasSelectedPlan(true)
        } else {
          setHasSelectedPlan(false)
        }
      } else {
        setHasSelectedPlan(false)
      }
    } catch (error) {
      console.error('Erro ao carregar plano do usuário:', error)
      setHasSelectedPlan(false)
    } finally {
      setIsLoading(false)
    }
  }

  const canAccessFeature = (feature: string) => {
    if (!userPlan) return false

    const planLimits = {
      free: {
        postsPerMonth: 3,
        templates: 5,
        analytics: false,
        customBranding: false,
        support: 'email'
      },
      pro: {
        postsPerMonth: 50,
        templates: 25,
        analytics: true,
        customBranding: true,
        support: 'priority'
      },
      enterprise: {
        postsPerMonth: -1, // Ilimitado
        templates: -1, // Ilimitado
        analytics: true,
        customBranding: true,
        support: 'dedicated'
      }
    }

    const limits = planLimits[userPlan.plan as keyof typeof planLimits]
    if (!limits) return false

    switch (feature) {
      case 'analytics':
        return limits.analytics
      case 'customBranding':
        return limits.customBranding
      case 'prioritySupport':
        return limits.support === 'priority' || limits.support === 'dedicated'
      case 'dedicatedSupport':
        return limits.support === 'dedicated'
      default:
        return true
    }
  }

  const getPlanLimits = () => {
    if (!userPlan) return null

    const planLimits = {
      free: {
        postsPerMonth: 3,
        templates: 5,
        analytics: false,
        customBranding: false,
        support: 'email'
      },
      basic: {
        postsPerMonth: 15,
        templates: 15,
        analytics: true,
        customBranding: true,
        support: 'priority'
      },
      pro: {
        postsPerMonth: 50,
        templates: 25,
        analytics: true,
        customBranding: true,
        support: 'priority'
      },
      enterprise: {
        postsPerMonth: -1, // Ilimitado
        templates: -1, // Ilimitado
        analytics: true,
        customBranding: true,
        support: 'dedicated'
      }
    }

    return planLimits[userPlan.plan as keyof typeof planLimits] || planLimits.free
  }

  const getPlanName = () => {
    if (!userPlan) return 'Nenhum'
    
    const planNames = {
      free: 'Gratuito',
      basic: 'Básico',
      pro: 'Profissional',
      enterprise: 'Empresarial'
    }
    
    return planNames[userPlan.plan as keyof typeof planNames] || 'Desconhecido'
  }

  const isPlanActive = () => {
    if (!userPlan) return false
    
    if (userPlan.planStatus !== 'active') return false
    
    if (userPlan.planExpiresAt) {
      return new Date() < userPlan.planExpiresAt
    }
    
    return true
  }

  return {
    userPlan,
    hasSelectedPlan,
    isLoading,
    canAccessFeature,
    getPlanLimits,
    getPlanName,
    isPlanActive,
    refreshPlan: loadUserPlan
  }
}
