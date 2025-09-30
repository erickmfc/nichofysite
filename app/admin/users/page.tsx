'use client'

import { useState, useEffect } from 'react'
import { AdminAuthService } from '@/lib/services/AdminAuthService'

interface User {
  id: string
  email: string
  displayName: string
  createdAt: Date
  lastLogin?: Date
  postsCount: number
  status: 'active' | 'suspended' | 'pending'
  plan: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      // Simular carregamento de usuários
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUsers: User[] = [
        {
          id: 'user-001',
          email: 'joao@email.com',
          displayName: 'João Silva',
          createdAt: new Date('2024-01-15'),
          lastLogin: new Date('2024-01-20'),
          postsCount: 15,
          status: 'active',
          plan: 'Premium'
        },
        {
          id: 'user-002',
          email: 'maria@email.com',
          displayName: 'Maria Santos',
          createdAt: new Date('2024-01-10'),
          lastLogin: new Date('2024-01-19'),
          postsCount: 8,
          status: 'active',
          plan: 'Básico'
        },
        {
          id: 'user-003',
          email: 'pedro@email.com',
          displayName: 'Pedro Costa',
          createdAt: new Date('2024-01-05'),
          lastLogin: new Date('2024-01-18'),
          postsCount: 0,
          status: 'pending',
          plan: 'Gratuito'
        },
        {
          id: 'user-004',
          email: 'ana@email.com',
          displayName: 'Ana Oliveira',
          createdAt: new Date('2024-01-01'),
          lastLogin: new Date('2024-01-17'),
          postsCount: 25,
          status: 'suspended',
          plan: 'Premium'
        }
      ]
      
      setUsers(mockUsers)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleUserAction = async (userId: string, action: 'suspend' | 'activate' | 'delete') => {
    try {
      // Simular ação
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUsers(prev => prev.map(user => {
        if (user.id === userId) {
          switch (action) {
            case 'suspend':
              return { ...user, status: 'suspended' as const }
            case 'activate':
              return { ...user, status: 'active' as const }
            case 'delete':
              return user // Em um sistema real, seria removido da lista
            default:
              return user
          }
        }
        return user
      }))
      
      // Mostrar notificação de sucesso
      showNotification(`Ação ${action} executada com sucesso!`)
    } catch (error) {
      console.error('Erro ao executar ação:', error)
      showNotification('Erro ao executar ação', 'error')
    }
  }

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const notification = document.createElement('div')
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`
    notification.innerHTML = `
      <div class="flex items-center">
        <span class="text-xl mr-2">${type === 'success' ? '✅' : '❌'}</span>
        <div class="font-semibold">${message}</div>
      </div>
    `
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => document.body.removeChild(notification), 300)
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'suspended': return 'bg-red-500'
      case 'pending': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo'
      case 'suspended': return 'Suspenso'
      case 'pending': return 'Pendente'
      default: return 'Desconhecido'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Carregando Usuários</h2>
          <p className="text-gray-400">Aguarde enquanto buscamos os dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Gestão de Usuários</h1>
              <p className="text-gray-400 mt-1">Gerencie todos os usuários da plataforma</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                + Novo Usuário
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                📊 Relatório
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                🔍 Buscar Usuário
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome ou email..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                📊 Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="suspended">Suspensos</option>
                <option value="pending">Pendentes</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={loadUsers}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🔄 Atualizar
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">
              Usuários ({filteredUsers.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Posts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Último Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {user.displayName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.plan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.postsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.lastLogin ? user.lastLogin.toLocaleDateString('pt-BR') : 'Nunca'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleUserAction(user.id, 'suspend')}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                            title="Suspender usuário"
                          >
                            ⏸️
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction(user.id, 'activate')}
                            className="text-green-400 hover:text-green-300 transition-colors"
                            title="Ativar usuário"
                          >
                            ▶️
                          </button>
                        )}
                        <button
                          onClick={() => handleUserAction(user.id, 'delete')}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Excluir usuário"
                        >
                          🗑️
                        </button>
                        <button
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Ver detalhes"
                        >
                          👁️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Total</h3>
                <p className="text-3xl font-bold text-white">{users.length}</p>
              </div>
              <div className="text-3xl text-blue-500">👥</div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Ativos</h3>
                <p className="text-3xl font-bold text-green-500">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <div className="text-3xl text-green-500">✅</div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Suspensos</h3>
                <p className="text-3xl font-bold text-red-500">
                  {users.filter(u => u.status === 'suspended').length}
                </p>
              </div>
              <div className="text-3xl text-red-500">⏸️</div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Pendentes</h3>
                <p className="text-3xl font-bold text-yellow-500">
                  {users.filter(u => u.status === 'pending').length}
                </p>
              </div>
              <div className="text-3xl text-yellow-500">⏳</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
