'use client'

import { useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export default function CreateTestUser() {
  const [isCreating, setIsCreating] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const createTestUser = async () => {
    setIsCreating(true)
    setResult(null)

    try {
      const testEmail = 'avaliacao.plataforma@nichofy.shop'
      const testPassword = 'avaliar12345'
      const testName = 'Conta de Avaliação'

      console.log('🚀 Criando conta de teste...')

      // Criar usuário
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword)
      console.log('✅ Usuário criado:', userCredential.user.uid)

      // Atualizar perfil
      await updateProfile(userCredential.user, { 
        displayName: testName 
      })
      console.log('👤 Perfil atualizado')

      // Salvar dados no Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: testEmail,
        displayName: testName,
        createdAt: serverTimestamp(),
        role: 'user',
        provider: 'email',
        plan: 'pro', // Plano profissional para teste completo
        planStatus: 'active',
        planSelectedAt: serverTimestamp(),
        isTestAccount: true,
        testAccountCreatedAt: serverTimestamp()
      })
      console.log('💾 Dados salvos no Firestore')

      setResult('✅ Conta de teste criada com sucesso!')
      
    } catch (error: any) {
      console.error('❌ Erro:', error)
      
      if (error.code === 'auth/email-already-in-use') {
        setResult('ℹ️ A conta de teste já existe!')
      } else {
        setResult(`❌ Erro: ${error.message}`)
      }
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          🧪 Criar Conta de Teste
        </h1>

        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Credenciais de Teste:</h3>
            <div className="text-sm text-blue-700">
              <div><strong>E-mail:</strong> avaliacao.plataforma@nichofy.shop</div>
              <div><strong>Senha:</strong> avaliar12345</div>
              <div><strong>Plano:</strong> Profissional (acesso completo)</div>
            </div>
          </div>
        </div>

        <button
          onClick={createTestUser}
          disabled={isCreating}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            isCreating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isCreating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Criando conta...
            </div>
          ) : (
            'Criar Conta de Teste'
          )}
        </button>

        {result && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            result.includes('✅') || result.includes('ℹ️')
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {result}
          </div>
        )}

        <div className="mt-6 text-center">
          <a 
            href="/login" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Voltar para Login
          </a>
        </div>
      </div>
    </div>
  )
}
