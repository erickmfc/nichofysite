'use client'

import { PlanSelection } from '@/components/auth/PlanSelection'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useRouter } from 'next/navigation'

export default function PlanosPage() {
  const router = useRouter()

  const handlePlanSelected = (planId: string) => {
    // Redirecionar para o dashboard após seleção do plano
    router.push('/dashboard')
  }

  return (
    <ProtectedRoute>
      <PlanSelection onPlanSelected={handlePlanSelected} />
    </ProtectedRoute>
  )
}
