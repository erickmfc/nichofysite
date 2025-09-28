'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'

export default function TestDashboardPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Teste Dashboard</h1>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Informações do Usuário</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Nome:</strong> {user?.displayName || 'Não definido'}</p>
              <p><strong>UID:</strong> {user?.uid}</p>
              <p><strong>Email verificado:</strong> {user?.emailVerified ? 'Sim' : 'Não'}</p>
            </div>
          </div>

          <div className="mt-6 bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-800">✅ Login Funcionando!</h2>
            <p className="text-green-700">
              Se você está vendo esta página, o sistema de autenticação está funcionando corretamente.
            </p>
          </div>

          <div className="mt-6">
            <a 
              href="/dashboard" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ir para Dashboard Principal
            </a>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
