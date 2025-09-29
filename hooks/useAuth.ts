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
      setUser(user)
      setLoading(false)
      
      // Redirecionamento otimizado apenas quando necessário
      if (user && typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        
        // Redirecionar apenas se estiver na página de login ou inicial
        if (currentPath === '/login' || currentPath === '/') {
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