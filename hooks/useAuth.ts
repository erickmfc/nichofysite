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
      
      // Remover redirecionamento automático para evitar conflitos
      // O redirecionamento deve ser controlado apenas pelas páginas específicas
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