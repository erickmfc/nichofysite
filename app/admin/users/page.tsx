'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminAuthService } from '@/lib/services/AdminAuthService'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  lastLogin?: Date
  status: 'active' | 'inactive' | 'banned'
  postsCount: number
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const admin = await AdminAuthService.getCurrentAdmin()
      if (admin) {
        setIsAuthenticated(true)
        loadUsers()
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

  const loadUsers = async () => {
    try {
      setUsersLoading(true)
      
      // Buscar usuários do Firestore
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(50)
      )
      
      const usersSnapshot = await getDocs(usersQuery)
      const usersData = usersSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name || data.displayName || 'Usuário',
          email: data.email || 'email@exemplo.com',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          lastLogin: data.lastLogin?.toDate ? data.lastLogin.toDate() : undefined,
          status: data.status || 'active',
          postsCount: 0 // Seria calculado com uma query adicional
        }
      })

      // Buscar contagem de posts para cada usuário
      const usersWithPosts = await Promise.all(
        usersData.map(async (user) => {
          try {
            const postsQuery = query(
              collection(db, 'posts'),
              where('userId', '==', user.id)
            )
            const postsSnapshot = await getDocs(postsQuery)
            return {
              ...user,
              postsCount: postsSnapshot.size
            }
          } catch (error) {
            return user
          }
        })
      )

      setUsers(usersWithPosts)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setUsersLoading(false)
    }
  }

  const handleLogout = async () => {
    await AdminAuthService.logout()
    router.push('/admin/login')
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'agora'
    if (diffInMinutes < 60) return `há ${diffInMinutes} min`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `há ${diffInHours}h`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `há ${diffInDays} dias`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">NichoFy Admin</h2>
          <p className="text-gray-400">Carregando usuários...</p>
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
                <p className="text-gray-400">Gerenciamento de Usuários</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
            <a href="/admin" className="text-gray-400 hover:text-white py-4 px-1">
              Dashboard
            </a>
            <a href="/admin/users" className="text-white border-b-2 border-blue-500 py-4 px-1">
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
        {/* Header com busca */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Usuários Registrados</h2>
            <p className="text-gray-400">Total: {users.length} usuários</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={loadUsers}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Atualizar
            </button>
          </div>
        </div>

        {/* Lista de usuários */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          {usersLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-400">Carregando usuários...</span>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Posts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Registrado
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
                    <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{user.name}</div>
                            <div className="text-sm text-gray-400">ID: {user.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">{user.postsCount}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' :
                          user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.status === 'active' ? 'Ativo' :
                           user.status === 'inactive' ? 'Inativo' : 'Banido'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {getTimeAgo(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {user.lastLogin ? getTimeAgo(user.lastLogin) : 'Nunca'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-400 hover:text-blue-300">
                            Ver
                          </button>
                          <button className="text-yellow-400 hover:text-yellow-300">
                            Editar
                          </button>
                          <button className="text-red-400 hover:text-red-300">
                            Banir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhum usuário encontrado</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}