'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('🛡️ ProtectedRoute: Verificando autenticação', { 
      user: !!user, 
      loading, 
      emailVerified: user?.emailVerified,
      isProduction: process.env.NODE_ENV === 'production'
    })
    
    if (!loading && !user) {
      console.log('🛡️ ProtectedRoute: Usuário não autenticado, redirecionando para login')
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    console.log('🛡️ ProtectedRoute: Carregando...')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log('🛡️ ProtectedRoute: Usuário não encontrado, não renderizando')
    return null // Será redirecionado pelo useEffect
  }

  // BYPASS TEMPORÁRIO: Em produção, permitir acesso mesmo sem email verificado
  // TODO: Remover este bypass quando a verificação de email estiver funcionando corretamente
  const isProduction = process.env.NODE_ENV === 'production'
  const shouldAllowAccess = isProduction || user.emailVerified

  if (!shouldAllowAccess) {
    console.log('🛡️ ProtectedRoute: Email não verificado, redirecionando para verificação')
    router.push('/email-verification')
    return null
  }

  console.log('🛡️ ProtectedRoute: Usuário autenticado, renderizando conteúdo')
  return <>{children}</>
}
