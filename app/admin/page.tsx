'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminAuthService } from '@/lib/services/AdminAuthService'

export default function AdminPage() {
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
          <h2 className="text-2xl font-bold text-white mb-2">NichoFy Admin</h2>
          <p className="text-gray-400">Carregando painel administrativo...</p>
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
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">A</span>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-white">NichoFy Admin</h1>
                <p className="text-gray-400">Painel de Controle Administrativo</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{adminData?.name || 'Administrador'}</p>
                <p className="text-gray-400 text-sm">{adminData?.email}</p>
              </div>
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

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="/admin" className="text-white border-b-2 border-blue-500 py-4 px-1">
              Dashboard
            </a>
            <a href="/admin/users" className="text-gray-400 hover:text-white py-4 px-1">
              Usuários
            </a>
            <a href="/admin/content" className="text-gray-400 hover:text-white py-4 px-1">
              Conteúdo
            </a>
            <a href="/admin/approvals" className="text-gray-400 hover:text-white py-4 px-1">
              Aprovações
            </a>
            <a href="/admin/settings" className="text-gray-400 hover:text-white py-4 px-1">
              Configurações
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Total de Usuários</h3>
                <p className="text-4xl font-bold text-white">1,234</p>
                <p className="text-gray-400 text-sm">+12% este mês</p>
              </div>
              <div className="text-4xl text-blue-500">👥</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Posts Criados</h3>
                <p className="text-4xl font-bold text-white">5,678</p>
                <p className="text-gray-400 text-sm">+8% este mês</p>
              </div>
              <div className="text-4xl text-green-500">📝</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Pendentes</h3>
                <p className="text-4xl font-bold text-yellow-500">23</p>
                <p className="text-gray-400 text-sm">Aguardando aprovação</p>
              </div>
              <div className="text-4xl text-yellow-500">⏳</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Aprovados</h3>
                <p className="text-4xl font-bold text-green-500">4,521</p>
                <p className="text-gray-400 text-sm">Este mês</p>
              </div>
              <div className="text-4xl text-green-500">✅</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors text-left">
                📊 Ver Relatórios Detalhados
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors text-left">
                👥 Gerenciar Usuários
              </button>
              <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg transition-colors text-left">
                ⏳ Revisar Pendências
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors text-left">
                ⚙️ Configurações do Sistema
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Atividades Recentes</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-white text-sm">Novo usuário registrado</p>
                  <p className="text-gray-400 text-xs">há 5 minutos</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-white text-sm">Post aprovado</p>
                  <p className="text-gray-400 text-xs">há 12 minutos</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-white text-sm">Conteúdo pendente</p>
                  <p className="text-gray-400 text-xs">há 18 minutos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Status do Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl">✓</span>
              </div>
              <h4 className="text-white font-semibold">Sistema Online</h4>
              <p className="text-gray-400 text-sm">Todos os serviços funcionando</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h4 className="text-white font-semibold">Performance</h4>
              <p className="text-gray-400 text-sm">99.9% de uptime</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl">🔒</span>
              </div>
              <h4 className="text-white font-semibold">Segurança</h4>
              <p className="text-gray-400 text-sm">Sistema protegido</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
