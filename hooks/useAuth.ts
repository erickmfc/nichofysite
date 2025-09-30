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
    // Listener do Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      console.log('🔐 useAuth: Estado mudou', { 
        user: !!user,
        email: user?.email
      })
      
      setUser(user)
      setLoading(false)
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