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
      loading
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

  console.log('🛡️ ProtectedRoute: Usuário autenticado, renderizando conteúdo')
  return <>{children}</>
}
