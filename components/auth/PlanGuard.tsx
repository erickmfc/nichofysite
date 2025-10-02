'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUserPlan } from '@/hooks/useUserPlan'
import { PlanSelection } from '@/components/auth/PlanSelection'
import { useRouter } from 'next/navigation'

interface PlanGuardProps {
  children: React.ReactNode
  requirePlan?: boolean
}

export const PlanGuard = ({ children, requirePlan = true }: PlanGuardProps) => {
  const { user, loading: authLoading } = useAuth()
  const { hasSelectedPlan, isLoading: planLoading } = useUserPlan()
  const [showPlanSelection, setShowPlanSelection] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (authLoading || planLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    if (requirePlan && !hasSelectedPlan) {
      setShowPlanSelection(true)
    }
  }, [user, authLoading, planLoading, hasSelectedPlan, requirePlan, router])

  const handlePlanSelected = (planId: string) => {
    setShowPlanSelection(false)
    // Recarregar a página para aplicar as mudanças
    window.location.reload()
  }

  // Mostrar loading enquanto verifica autenticação e plano
  if (authLoading || planLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando seu plano...</p>
        </div>
      </div>
    )
  }

  // Mostrar seleção de plano se necessário
  if (showPlanSelection) {
    return <PlanSelection onPlanSelected={handlePlanSelected} />
  }

  // Se não há usuário, redirecionar para login
  if (!user) {
    return null
  }

  // Se usuário tem plano ou não é necessário, mostrar conteúdo
  return <>{children}</>
}
