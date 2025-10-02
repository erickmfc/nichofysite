'use client'

import { useState, useEffect } from 'react'
import { AdminAuthService } from '@/lib/services/AdminAuthService'
import { useRouter } from 'next/navigation'

export default function AdminAPIsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adminData, setAdminData] = useState(null)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const admin = await AdminAuthService.getCurrentAdmin()
      if (admin) {
        setIsAuthenticated(true)
        setAdminData(admin)
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação admin:', error)
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await AdminAuthService.logout()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Carregando...</h2>
          <p className="text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">🔌 Integrações e APIs</h1>
              <p className="text-gray-400 mt-1">Gerencie integrações externas e APIs</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ← Voltar
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">APIs Ativas</h3>
                <p className="text-3xl font-bold text-white">12</p>
              </div>
              <div className="text-3xl text-green-500">🔌</div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Integrações</h3>
                <p className="text-3xl font-bold text-white">8</p>
              </div>
              <div className="text-3xl text-blue-500">🔗</div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Requests/Dia</h3>
                <p className="text-3xl font-bold text-white">2.4K</p>
              </div>
              <div className="text-3xl text-purple-500">📊</div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Uptime</h3>
                <p className="text-3xl font-bold text-white">99.9%</p>
              </div>
              <div className="text-3xl text-green-500">✅</div>
            </div>
          </div>
        </div>

        {/* APIs List */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">🔌 APIs Disponíveis</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">OpenAI API</h3>
                  <p className="text-gray-400">Geração de conteúdo com IA</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-green-500 text-green-900 rounded-full text-sm font-medium">
                    Ativa
                  </span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Configurar
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">Instagram API</h3>
                  <p className="text-gray-400">Publicação automática no Instagram</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-yellow-500 text-yellow-900 rounded-full text-sm font-medium">
                    Pendente
                  </span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Configurar
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">LinkedIn API</h3>
                  <p className="text-gray-400">Publicação automática no LinkedIn</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-green-500 text-green-900 rounded-full text-sm font-medium">
                    Ativa
                  </span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Configurar
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">Google Analytics</h3>
                  <p className="text-gray-400">Análise de performance</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-green-500 text-green-900 rounded-full text-sm font-medium">
                    Ativa
                  </span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Configurar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}