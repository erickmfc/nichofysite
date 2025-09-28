'use client'

import { useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

export const CredentialsDiagnostic = () => {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (message: string) => {
    console.log('🔍 Credentials Diagnostic:', message)
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testGoogleOAuth = async () => {
    setIsLoading(true)
    setTestResults([])
    
    addResult('🔍 Testando Google OAuth...')
    
    try {
      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')
      
      addResult('📋 Provider configurado')
      addResult(`🔑 Client ID: ${provider.providerId}`)
      
      const result = await signInWithPopup(auth, provider)
      addResult(`✅ Login Google bem-sucedido: ${result.user.email}`)
      
    } catch (error: any) {
      addResult(`❌ Erro Google OAuth: ${error.code}`)
      addResult(`📝 Mensagem: ${error.message}`)
      
      // Análise específica do erro
      switch (error.code) {
        case 'auth/unauthorized-domain':
          addResult('🚨 SOLUÇÃO: Adicione localhost nas configurações do Firebase')
          addResult('📍 Console Firebase → Authentication → Settings → Authorized domains')
          break
        case 'auth/operation-not-allowed':
          addResult('🚨 SOLUÇÃO: Habilite Google Sign-in no Firebase')
          addResult('📍 Console Firebase → Authentication → Sign-in method → Google')
          break
        case 'auth/invalid-credential':
          addResult('🚨 SOLUÇÃO: Verifique Client ID do Google OAuth')
          addResult('📍 Console Firebase → Project Settings → General → Web API Key')
          break
        case 'auth/popup-blocked':
          addResult('🚨 SOLUÇÃO: Desbloqueie popups no navegador')
          break
        case 'auth/popup-closed-by-user':
          addResult('ℹ️ Login cancelado pelo usuário')
          break
        default:
          addResult(`🔍 Erro não mapeado: ${error.code}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const testEmailPassword = async () => {
    setIsLoading(true)
    addResult('🔍 Testando Email/Password...')
    
    try {
      const testEmail = `teste-${Date.now()}@exemplo.com`
      const testPassword = '123456'
      
      addResult(`📧 Tentando criar usuário: ${testEmail}`)
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword)
      addResult(`✅ Usuário criado: ${userCredential.user.email}`)
      
      // Fazer logout
      await auth.signOut()
      addResult('🚪 Logout realizado')
      
      // Tentar login
      addResult('🔑 Tentando login...')
      const loginResult = await signInWithEmailAndPassword(auth, testEmail, testPassword)
      addResult(`✅ Login bem-sucedido: ${loginResult.user.email}`)
      
      // Limpar usuário de teste
      await loginResult.user.delete()
      addResult('🗑️ Usuário de teste removido')
      
    } catch (error: any) {
      addResult(`❌ Erro Email/Password: ${error.code}`)
      addResult(`📝 Mensagem: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkFirebaseConfig = () => {
    addResult('🔍 Verificando configuração Firebase...')
    addResult(`🔑 API Key: ${auth.config.apiKey ? 'Configurada' : 'Não configurada'}`)
    addResult(`🌐 Auth Domain: ${auth.config.authDomain}`)
    addResult(`📦 Project ID: ${auth.config.projectId}`)
    addResult(`📱 App ID: ${auth.config.appId}`)
    
    // Verificar se está em localhost
    const isLocalhost = window.location.hostname === 'localhost'
    addResult(`🏠 Localhost: ${isLocalhost ? 'Sim' : 'Não'}`)
    addResult(`🔗 URL atual: ${window.location.href}`)
  }

  return (
    <div className="fixed top-4 left-4 bg-red-900 text-white p-4 rounded-lg max-w-lg max-h-96 overflow-y-auto text-xs z-50">
      <h3 className="font-bold mb-2">🔍 Credentials Diagnostic</h3>
      
      <div className="space-y-2 mb-3">
        <button
          onClick={testGoogleOAuth}
          disabled={isLoading}
          className="block w-full px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-xs disabled:opacity-50"
        >
          Testar Google OAuth
        </button>
        
        <button
          onClick={testEmailPassword}
          disabled={isLoading}
          className="block w-full px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-xs disabled:opacity-50"
        >
          Testar Email/Password
        </button>
        
        <button
          onClick={checkFirebaseConfig}
          disabled={isLoading}
          className="block w-full px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-xs disabled:opacity-50"
        >
          Verificar Config Firebase
        </button>
      </div>
      
      <div className="space-y-1">
        {testResults.map((result, index) => (
          <div key={index} className="text-gray-300">{result}</div>
        ))}
      </div>
    </div>
  )
}
