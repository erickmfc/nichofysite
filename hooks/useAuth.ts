'use client'

import { useState, useEffect, useCallback } from 'react'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Otimizar listener do Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      console.log('🔐 useAuth: Estado mudou', { 
        user: !!user, 
        emailVerified: user?.emailVerified,
        isProduction: process.env.NODE_ENV === 'production'
      })
      
      setUser(user)
      setLoading(false)
      
      // Redirecionamento otimizado apenas quando necessário
      if (user && typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        
        // Em produção, permitir acesso mesmo sem email verificado
        const isProduction = process.env.NODE_ENV === 'production'
        const shouldRedirect = isProduction || user.emailVerified
        
        // Redirecionar apenas se estiver na página de login ou inicial E se deve redirecionar
        if ((currentPath === '/login' || currentPath === '/') && shouldRedirect) {
          console.log('🔐 useAuth: Redirecionando para dashboard')
          // Usar setTimeout mínimo para não bloquear a UI
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 100)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  // Otimizar logout com useCallback
  const logout = useCallback(async () => {
    try {
      await signOut(auth)
      // Redirecionamento instantâneo
      window.location.href = '/'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }, [])

  return {
    user,
    loading,
    logout,
    isAuthenticated: !!user
  }
}