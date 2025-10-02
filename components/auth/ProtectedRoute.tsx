'use client'

import { useAuth } from '@/hooks/useAuth'
import { useUserPlan } from '@/hooks/useUserPlan'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AuthLoadingSpinner } from '@/components/ui/LoadingSpinner'
import { PlanSelection } from './PlanSelection'

interface ProtectedRouteProps {
  children: React.ReactNode
  requirePlan?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requirePlan = true 
}) => {
  const { user, loading } = useAuth()
  const { hasSelectedPlan, isLoading: planLoading } = useUserPlan()
  const router = useRouter()

  useEffect(() => {
    console.log('🛡️ ProtectedRoute: Verificando autenticação', { 
      user: !!user, 
      loading,
      hasSelectedPlan,
      planLoading
    })
    
    // CORREÇÃO: Evitar redirecionamento desnecessário
    if (!loading && !user && typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/') {
        console.log('🛡️ ProtectedRoute: Usuário não autenticado, redirecionando para login')
        router.push('/login')
      }
    }
  }, [user, loading, hasSelectedPlan, planLoading, router])

  const handlePlanSelected = (planId: string) => {
    console.log('🎯 Plano selecionado:', planId)
    // Recarregar a página para aplicar as mudanças
    window.location.reload()
  }

  // CORREÇÃO: Melhorar estado de carregamento
  if (loading || planLoading) {
    console.log('🛡️ ProtectedRoute: Carregando...')
    return <AuthLoadingSpinner />
  }

  // CORREÇÃO: Renderizar conteúdo apenas se usuário estiver autenticado
  if (!user) {
    console.log('🛡️ ProtectedRoute: Usuário não encontrado')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Acesso Negado</h2>
          <p className="text-gray-600 mb-4">Você precisa estar logado para acessar esta página.</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    )
  }

  // Verificar se precisa selecionar plano
  if (requirePlan && !hasSelectedPlan) {
    console.log('🎯 ProtectedRoute: Usuário precisa selecionar plano')
    return <PlanSelection onPlanSelected={handlePlanSelected} />
  }

  console.log('🛡️ ProtectedRoute: Usuário autenticado e com plano, renderizando conteúdo')
  return <>{children}</>
}
