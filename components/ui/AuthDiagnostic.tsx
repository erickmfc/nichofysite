'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

export const AuthDiagnostic: React.FC = () => {
  const [results, setResults] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const addResult = (message: string) => {
    setResults(prev => [...prev, message])
  }

  const clearResults = () => {
    setResults([])
  }

  const runDiagnostic = async () => {
    setIsRunning(true)
    clearResults()
    
    addResult('🔍 Iniciando diagnóstico de autenticação...')
    addResult('')

    // 1. Verificar configuração Firebase
    addResult('📋 1. Verificando configuração Firebase:')
    addResult(`🔑 API Key: ${auth.config.apiKey ? 'Configurada' : 'Não configurada'}`)
    addResult(`🌐 Auth Domain: ${auth.config.authDomain}`)
    addResult(`📦 Project ID: ${(auth.config as any).projectId || 'Não configurado'}`)
    addResult(`📱 App ID: ${(auth.config as any).appId || 'Não configurado'}`)
    addResult('')

    // 2. Verificar ambiente
    addResult('🌍 2. Verificando ambiente:')
    addResult(`🏠 Localhost: ${window.location.hostname === 'localhost'}`)
    addResult(`🔗 URL atual: ${window.location.href}`)
    addResult(`🌐 Protocolo: ${window.location.protocol}`)
    addResult('')

    // 3. Verificar domínios autorizados
    addResult('🔒 3. Verificando domínios autorizados:')
    const authorizedDomains = [
      'localhost',
      'nichofy.shop',
      'nichofy-cb282.firebaseapp.com',
      'nichofy-cb282.web.app'
    ]
    
    const currentDomain = window.location.hostname
    const isAuthorized = authorizedDomains.includes(currentDomain)
    addResult(`✅ Domínio atual: ${currentDomain}`)
    addResult(`${isAuthorized ? '✅' : '❌'} Domínio autorizado: ${isAuthorized}`)
    addResult('')

    // 4. Teste de credenciais inválidas
    addResult('🧪 4. Testando credenciais inválidas:')
    try {
      await signInWithEmailAndPassword(auth, 'test@invalid.com', 'wrongpassword')
      addResult('❌ ERRO: Login com credenciais inválidas funcionou (não deveria)')
    } catch (error: any) {
      addResult(`✅ Login com credenciais inválidas falhou corretamente: ${error.code}`)
      if (error.code === 'auth/invalid-credential') {
        addResult('🎯 PROBLEMA IDENTIFICADO: auth/invalid-credential')
        addResult('💡 Possíveis causas:')
        addResult('   - Email/Password não habilitado no Firebase Console')
        addResult('   - Domínio não autorizado')
        addResult('   - Configuração incorreta do projeto')
        addResult('   - API Key inválida ou expirada')
      }
    }
    addResult('')

    // 5. Verificar métodos de autenticação
    addResult('🔐 5. Verificando métodos de autenticação:')
    addResult('📧 Email/Password: Verificar no Firebase Console > Authentication > Sign-in method')
    addResult('🔍 Google Sign-in: Verificar configuração OAuth')
    addResult('')

    // 6. Instruções de correção
    addResult('🛠️ 6. Instruções para corrigir:')
    addResult('1. Acesse: https://console.firebase.google.com/project/nichofy-cb282/authentication/providers')
    addResult('2. Habilite "Email/Password" se não estiver habilitado')
    addResult('3. Verifique se o domínio está na lista de domínios autorizados')
    addResult('4. Teste com credenciais válidas')
    addResult('')

    setIsRunning(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🔍 Diagnóstico de Autenticação Firebase</h2>
      
      <div className="mb-4">
        <button
          onClick={runDiagnostic}
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {isRunning ? 'Executando...' : 'Executar Diagnóstico'}
        </button>
        
        <button
          onClick={clearResults}
          className="ml-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
        >
          Limpar
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Resultados:</h3>
        <div className="space-y-1 text-sm font-mono">
          {results.length === 0 ? (
            <p className="text-gray-500">Clique em "Executar Diagnóstico" para começar</p>
          ) : (
            results.map((result, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Erro auth/invalid-credential</h3>
        <p className="text-yellow-700 text-sm">
          Este erro geralmente indica que as credenciais fornecidas são inválidas ou que 
          o método de autenticação não está configurado corretamente no Firebase Console.
        </p>
      </div>
    </div>
  )
}
