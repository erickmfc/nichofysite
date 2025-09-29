'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { sendEmailVerification, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Link from 'next/link'

export default function EmailVerificationPage() {
  const { user, loading } = useAuth()
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login'
    }
  }, [user, loading])

  const handleSendVerification = async () => {
    if (!user) return

    setIsLoading(true)
    setError('')
    
    try {
      await sendEmailVerification(user)
      setIsEmailSent(true)
    } catch (error: any) {
      console.error('Erro ao enviar email de verificação:', error)
      setError('Erro ao enviar email de verificação. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      window.location.href = '/login'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleCheckVerification = async () => {
    if (!user) return
    
    try {
      await user.reload()
      if (user.emailVerified) {
        window.location.href = '/dashboard'
      } else {
        alert('Email ainda não foi verificado. Verifique sua caixa de entrada.')
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Ícone de Email */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifique seu E-mail</h1>
        </div>

        {/* Informações do Email */}
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">Enviamos um e-mail de verificação para:</p>
          <div className="bg-gray-100 rounded-lg p-3 mb-4">
            <p className="text-gray-900 font-medium">{user.email}</p>
          </div>
          <p className="text-gray-600 text-sm">
            Clique no link do e-mail para verificar sua conta e ter acesso completo à plataforma.
          </p>
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Instruções:</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Verifique sua caixa de entrada</li>
            <li>• Procure também na pasta de spam</li>
            <li>• Clique no link de verificação</li>
            <li>• Volte aqui após verificar</li>
          </ul>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-3">
          <button
            onClick={handleSendVerification}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Enviando...' : 'Reenviar E-mail'}
          </button>

          <button
            onClick={handleCheckVerification}
            className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Já Verifiquei - Atualizar
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Voltar ao Login
          </button>
        </div>

        {/* Mensagem de Sucesso */}
        {isEmailSent && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            ✅ E-mail de verificação enviado com sucesso!
          </div>
        )}

        {/* Mensagem de Erro */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            ❌ {error}
          </div>
        )}

        {/* Ajuda */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Precisa de Ajuda?</h4>
          <p className="text-gray-600 text-sm mb-2">
            Se não recebeu o e-mail ou está com problemas:
          </p>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>• Verifique se o e-mail está correto</li>
            <li>• Aguarde alguns minutos</li>
            <li>• Entre em contato: suporte@nichofy.com</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
