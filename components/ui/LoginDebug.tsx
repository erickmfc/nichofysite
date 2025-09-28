'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export const LoginDebug = () => {
  const [authState, setAuthState] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const addLog = (message: string) => {
      console.log('🐛 Login Debug:', message)
      setLogs(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`])
    }

    addLog('Iniciando debug de login...')
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        addLog(`✅ Usuário logado: ${user.email}`)
        addLog(`🔄 Redirecionando em 1 segundo...`)
        setTimeout(() => {
          addLog(`🚀 Executando redirecionamento...`)
          window.location.href = '/dashboard'
        }, 1000)
      } else {
        addLog('❌ Usuário não logado')
      }
      setAuthState(user)
    })

    return () => {
      addLog('🛑 Debug finalizado')
      unsubscribe()
    }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-lg max-w-sm text-xs z-50">
      <h3 className="font-bold mb-2">🐛 Login Debug</h3>
      <div className="mb-2">
        <strong>Estado:</strong> {authState ? `Logado (${authState.email})` : 'Não logado'}
      </div>
      <div className="space-y-1">
        {logs.map((log, index) => (
          <div key={index} className="text-gray-300">{log}</div>
        ))}
      </div>
    </div>
  )
}
