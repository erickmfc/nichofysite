'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { sendEmailVerification, onAuthStateChanged } from 'firebase/auth'

export const EmailVerificationHandler = () => {
  const [user, setUser] = useState<any>(null)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  const handleSendVerification = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      await sendEmailVerification(user)
      setIsEmailSent(true)
      alert('Email de verificação enviado! Verifique sua caixa de entrada.')
    } catch (error: any) {
      console.error('Erro ao enviar email de verificação:', error)
      alert('Erro ao enviar email de verificação. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await auth.signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  if (!user || user.emailVerified) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📧</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verifique seu Email
          </h2>
          <p className="text-gray-600">
            Enviamos um email de verificação para:
          </p>
          <p className="font-semibold text-blue-600 mt-2">
            {user.email}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Próximos passos:</strong>
          </p>
          <ol className="text-sm text-blue-700 mt-2 text-left">
            <li>1. Verifique sua caixa de entrada</li>
            <li>2. Clique no link de verificação</li>
            <li>3. Volte aqui e atualize a página</li>
          </ol>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSendVerification}
            disabled={isLoading || isEmailSent}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Enviando...
              </div>
            ) : isEmailSent ? (
              'Email Enviado ✓'
            ) : (
              'Reenviar Email de Verificação'
            )}
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Atualizar Página
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-gray-500 hover:text-gray-700 text-sm py-2"
          >
            Usar outra conta
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>
            Não recebeu o email? Verifique sua pasta de spam ou lixo eletrônico.
          </p>
        </div>
      </div>
    </div>
  )
}
