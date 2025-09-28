'use client'

import { useState, useEffect, useRef } from 'react'
import { User, onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    console.log('🔐 useAuth: Iniciando listener de autenticação')
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔐 onAuthStateChanged chamado:', user ? `usuário logado: ${user.email}` : 'usuário não logado')
      setUser(user)
      setLoading(false)
      
      // Redirecionar para dashboard após login
      if (user && typeof window !== 'undefined' && !hasRedirected.current) {
        const currentPath = window.location.pathname
        console.log('🔐 useAuth: Usuário logado, path atual:', currentPath)
        
        // Redirecionar apenas se estiver na página de login ou home
        if (currentPath === '/login' || currentPath === '/') {
          console.log('🔐 useAuth: Redirecionando para /dashboard')
          hasRedirected.current = true
          
          // Usar router.push em vez de window.location.href
          router.push('/dashboard')
        }
      }
      
      // Reset do flag quando usuário faz logout
      if (!user) {
        hasRedirected.current = false
        console.log('🔐 useAuth: Usuário deslogado, resetando flag')
      }
    })

    return () => {
      console.log('🔐 useAuth: Limpando listener')
      unsubscribe()
    }
  }, [router])

  const logout = async () => {
    try {
      console.log('🔐 useAuth: Fazendo logout')
      await signOut(auth)
      hasRedirected.current = false
      router.push('/')
    } catch (error) {
      console.error('🔐 Erro ao fazer logout:', error)
    }
  }

  return {
    user,
    loading,
    logout,
    isAuthenticated: !!user
  }
}
