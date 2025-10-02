'use client'

import { useState, useEffect } from 'react'
import { useAdminRealData } from '@/hooks/useAdminRealData'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, orderBy, limit, updateDoc, doc } from 'firebase/firestore'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'premium' | 'admin' | 'moderator'
  status: 'active' | 'inactive' | 'suspended' | 'banned'
  createdAt: Date
  lastLogin?: Date
  lastActive?: Date
  postsCount: number
  likesCount: number
  followersCount: number
  followingCount: number
  subscription?: {
    plan: string
    status: 'active' | 'expired' | 'cancelled'
    expiresAt?: Date
  }
  profile: {
    bio?: string
    location?: string
    website?: string
    socialLinks?: {
      twitter?: string
      instagram?: string
      linkedin?: string
    }
  }
  preferences: {
    notifications: boolean
    emailMarketing: boolean
    privacy: 'public' | 'private' | 'friends'
  }
  stats: {
    totalPosts: number
    approvedPosts: number
    rejectedPosts: number
    avgEngagement: number
    totalViews: number
  }
}

interface UserFilter {
  role: string
  status: string
  subscription: string
  dateRange: string
  search: string
}

interface BulkAction {
  action: 'activate' | 'deactivate' | 'suspend' | 'delete' | 'sendEmail'
  userIds: string[]
}

export const UserManagementSystem = () => {
  const { stats } = useAdminRealData()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [filters, setFilters] = useState<UserFilter>({
    role: 'all',
    status: 'all',
    subscription: 'all',
    dateRange: 'all',
    search: ''
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'roles' | 'analytics'>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [showBulkActions, setShowBulkActions] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [users, filters])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      
      // Buscar usuários reais do Firestore
      const usersSnapshot = await getDocs(query(collection(db, 'users')))
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
        lastLogin: doc.data().lastLogin?.toDate ? doc.data().lastLogin.toDate() : undefined,
        lastActive: doc.data().lastActive?.toDate ? doc.data().lastActive.toDate() : undefined,
        postsCount: doc.data().postsCount || 0,
        likesCount: doc.data().likesCount || 0,
        followersCount: doc.data().followersCount || 0,
        followingCount: doc.data().followingCount || 0,
        role: doc.data().role || 'user',
        status: doc.data().status || 'active',
        profile: doc.data().profile || {},
        preferences: doc.data().preferences || { notifications: true, emailMarketing: false, privacy: 'public' },
        stats: doc.data().stats || { totalPosts: 0, approvedPosts: 0, rejectedPosts: 0, avgEngagement: 0, totalViews: 0 }
      })) as User[]

      setUsers(usersData)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      // Fallback para dados mockados
      setUsers(generateMockUsers())
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockUsers = (): User[] => {
    const mockUsers: User[] = []
    for (let i = 1; i <= 50; i++) {
      mockUsers.push({
        id: `user-${i}`,
        email: `user${i}@example.com`,
        name: `Usuário ${i}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
        role: ['user', 'premium', 'admin', 'moderator'][Math.floor(Math.random() * 4)] as any,
        status: ['active', 'inactive', 'suspended', 'banned'][Math.floor(Math.random() * 4)] as any,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        postsCount: Math.floor(Math.random() * 100),
        likesCount: Math.floor(Math.random() * 1000),
        followersCount: Math.floor(Math.random() * 500),
        followingCount: Math.floor(Math.random() * 200),
        subscription: Math.random() > 0.5 ? {
          plan: ['basic', 'premium', 'pro'][Math.floor(Math.random() * 3)],
          status: ['active', 'expired', 'cancelled'][Math.floor(Math.random() * 3)] as any,
          expiresAt: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000)
        } : undefined,
        profile: {
          bio: `Bio do usuário ${i}`,
          location: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador'][Math.floor(Math.random() * 4)],
          website: `https://user${i}.com`,
          socialLinks: {
            twitter: `@user${i}`,
            instagram: `@user${i}`,
            linkedin: `user${i}`
          }
        },
        preferences: {
          notifications: Math.random() > 0.3,
          emailMarketing: Math.random() > 0.7,
          privacy: ['public', 'private', 'friends'][Math.floor(Math.random() * 3)] as any
        },
        stats: {
          totalPosts: Math.floor(Math.random() * 50),
          approvedPosts: Math.floor(Math.random() * 45),
          rejectedPosts: Math.floor(Math.random() * 5),
          avgEngagement: Math.random() * 100,
          totalViews: Math.floor(Math.random() * 10000)
        }
      })
    }
    return mockUsers
  }

  const applyFilters = () => {
    let filtered = [...users]

    if (filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role)
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(user => user.status === filters.status)
    }

    if (filters.subscription !== 'all') {
      if (filters.subscription === 'none') {
        filtered = filtered.filter(user => !user.subscription)
      } else {
        filtered = filtered.filter(user => user.subscription?.plan === filters.subscription)
      }
    }

    if (filters.dateRange !== 'all') {
      const now = new Date()
      const daysAgo = filters.dateRange === '7d' ? 7 : filters.dateRange === '30d' ? 30 : 90
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(user => user.createdAt >= cutoffDate)
    }

    if (filters.search) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    setFilteredUsers(filtered)
  }

  const updateUserStatus = async (userId: string, status: User['status']) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        status,
        updatedAt: new Date()
      })
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status } : user
      ))
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error)
    }
  }

  const updateUserRole = async (userId: string, role: User['role']) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role,
        updatedAt: new Date()
      })
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role } : user
      ))
    } catch (error) {
      console.error('Erro ao atualizar role do usuário:', error)
    }
  }

  const deleteUser = async (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        // Em um sistema real, aqui seria feita a exclusão do Firestore
        setUsers(prev => prev.filter(user => user.id !== userId))
        setSelectedUsers(prev => prev.filter(id => id !== userId))
      } catch (error) {
        console.error('Erro ao excluir usuário:', error)
      }
    }
  }

  const executeBulkAction = async (action: BulkAction['action']) => {
    if (selectedUsers.length === 0) return

    try {
      switch (action) {
        case 'activate':
          await Promise.all(selectedUsers.map(id => updateUserStatus(id, 'active')))
          break
        case 'deactivate':
          await Promise.all(selectedUsers.map(id => updateUserStatus(id, 'inactive')))
          break
        case 'suspend':
          await Promise.all(selectedUsers.map(id => updateUserStatus(id, 'suspended')))
          break
        case 'delete':
          if (confirm(`Tem certeza que deseja excluir ${selectedUsers.length} usuários?`)) {
            await Promise.all(selectedUsers.map(id => deleteUser(id)))
          }
          break
        case 'sendEmail':
          console.log('Enviando email para usuários:', selectedUsers)
          break
      }
      
      setSelectedUsers([])
      setShowBulkActions(false)
    } catch (error) {
      console.error('Erro ao executar ação em lote:', error)
    }
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const selectAllUsers = () => {
    setSelectedUsers(filteredUsers.map(user => user.id))
  }

  const clearSelection = () => {
    setSelectedUsers([])
  }

  const UserCard = ({ user }: { user: User }) => (
    <div className={`bg-gray-800 rounded-xl p-6 border transition-colors ${
      selectedUsers.includes(user.id) ? 'border-blue-500' : 'border-gray-700'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            checked={selectedUsers.includes(user.id)}
            onChange={() => toggleUserSelection(user.id)}
            className="mr-3 mt-1"
          />
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
            alt={user.name}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{user.name}</h3>
            <p className="text-gray-400 text-sm mb-2">{user.email}</p>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                user.role === 'admin' ? 'bg-red-500' :
                user.role === 'moderator' ? 'bg-orange-500' :
                user.role === 'premium' ? 'bg-purple-500' :
                'bg-gray-500'
              }`}>
                {user.role}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                user.status === 'active' ? 'bg-green-500' :
                user.status === 'inactive' ? 'bg-yellow-500' :
                user.status === 'suspended' ? 'bg-orange-500' :
                'bg-red-500'
              }`}>
                {user.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={user.status}
            onChange={(e) => updateUserStatus(user.id, e.target.value as User['status'])}
            className="bg-gray-700 border border-gray-600 text-white px-2 py-1 rounded text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="suspended">Suspenso</option>
            <option value="banned">Banido</option>
          </select>
          
          <select
            value={user.role}
            onChange={(e) => updateUserRole(user.id, e.target.value as User['role'])}
            className="bg-gray-700 border border-gray-600 text-white px-2 py-1 rounded text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="user">Usuário</option>
            <option value="premium">Premium</option>
            <option value="moderator">Moderador</option>
            <option value="admin">Admin</option>
          </select>
          
          <button
            onClick={() => deleteUser(user.id)}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-gray-400">Posts:</span>
          <span className="text-white ml-2">{user.stats.totalPosts}</span>
        </div>
        <div>
          <span className="text-gray-400">Seguidores:</span>
          <span className="text-white ml-2">{user.followersCount}</span>
        </div>
        <div>
          <span className="text-gray-400">Engajamento:</span>
          <span className="text-white ml-2">{user.stats.avgEngagement.toFixed(1)}%</span>
        </div>
        <div>
          <span className="text-gray-400">Último Login:</span>
          <span className="text-white ml-2">
            {user.lastLogin ? user.lastLogin.toLocaleDateString('pt-BR') : 'Nunca'}
          </span>
        </div>
      </div>

      {user.subscription && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Assinatura:</span>
            <span className={`text-sm font-medium ${
              user.subscription.status === 'active' ? 'text-green-400' :
              user.subscription.status === 'expired' ? 'text-red-400' :
              'text-yellow-400'
            }`}>
              {user.subscription.plan} - {user.subscription.status}
            </span>
          </div>
        </div>
      )}
    </div>
  )

  const OverviewStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Total de Usuários</h3>
            <p className="text-4xl font-bold text-white">{users.length}</p>
            <p className="text-gray-400 text-sm">+{users.filter(u => u.status === 'active').length} ativos</p>
          </div>
          <div className="text-4xl text-blue-500">👥</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Usuários Premium</h3>
            <p className="text-4xl font-bold text-white">
              {users.filter(u => u.role === 'premium').length}
            </p>
            <p className="text-gray-400 text-sm">
              {((users.filter(u => u.role === 'premium').length / users.length) * 100).toFixed(1)}% do total
            </p>
          </div>
          <div className="text-4xl text-purple-500">👑</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Novos Este Mês</h3>
            <p className="text-4xl font-bold text-white">
              {users.filter(u => {
                const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                return u.createdAt >= monthAgo
              }).length}
            </p>
            <p className="text-gray-400 text-sm">Crescimento mensal</p>
          </div>
          <div className="text-4xl text-green-500">📈</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Usuários Suspensos</h3>
            <p className="text-4xl font-bold text-red-500">
              {users.filter(u => u.status === 'suspended' || u.status === 'banned').length}
            </p>
            <p className="text-gray-400 text-sm">Requer atenção</p>
          </div>
          <div className="text-4xl text-red-500">⚠️</div>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Carregando Usuários</h2>
          <p className="text-gray-400">Buscando dados do sistema...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">👥 Gestão de Usuários</h1>
            <p className="text-gray-400">Gerencie usuários, roles e permissões do sistema</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {selectedUsers.length > 0 && (
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {selectedUsers.length} selecionados
              </div>
            )}
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
              ➕ Novo Usuário
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📊 Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            👥 Usuários
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'roles'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            🔐 Roles
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📈 Analytics
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <OverviewStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Distribuição por Role</h3>
                <div className="space-y-3">
                  {['user', 'premium', 'moderator', 'admin'].map(role => {
                    const count = users.filter(u => u.role === role).length
                    const percentage = (count / users.length) * 100
                    return (
                      <div key={role} className="flex items-center justify-between">
                        <span className="text-gray-300 capitalize">{role}</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-white text-sm w-12 text-right">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Status dos Usuários</h3>
                <div className="space-y-3">
                  {['active', 'inactive', 'suspended', 'banned'].map(status => {
                    const count = users.filter(u => u.status === status).length
                    const percentage = (count / users.length) * 100
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-gray-300 capitalize">{status}</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                            <div 
                              className={`h-2 rounded-full ${
                                status === 'active' ? 'bg-green-500' :
                                status === 'inactive' ? 'bg-yellow-500' :
                                status === 'suspended' ? 'bg-orange-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-white text-sm w-12 text-right">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            {/* Filters */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    placeholder="Nome ou email..."
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                  <select
                    value={filters.role}
                    onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">Todos</option>
                    <option value="user">Usuário</option>
                    <option value="premium">Premium</option>
                    <option value="moderator">Moderador</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="suspended">Suspenso</option>
                    <option value="banned">Banido</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Assinatura</label>
                  <select
                    value={filters.subscription}
                    onChange={(e) => setFilters(prev => ({ ...prev, subscription: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">Todas</option>
                    <option value="none">Sem assinatura</option>
                    <option value="basic">Básica</option>
                    <option value="premium">Premium</option>
                    <option value="pro">Pro</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Período</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">Todos</option>
                    <option value="7d">Últimos 7 dias</option>
                    <option value="30d">Últimos 30 dias</option>
                    <option value="90d">Últimos 90 dias</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="bg-blue-900 border border-blue-700 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-blue-300 font-medium">
                      {selectedUsers.length} usuários selecionados
                    </span>
                    <button
                      onClick={selectAllUsers}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Selecionar Todos
                    </button>
                    <button
                      onClick={clearSelection}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Limpar Seleção
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => executeBulkAction('activate')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      ✅ Ativar
                    </button>
                    <button
                      onClick={() => executeBulkAction('suspend')}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      ⏸️ Suspender
                    </button>
                    <button
                      onClick={() => executeBulkAction('sendEmail')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      📧 Enviar Email
                    </button>
                    <button
                      onClick={() => executeBulkAction('delete')}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum usuário encontrado</h3>
                <p className="text-gray-400">Ajuste os filtros para encontrar usuários</p>
              </div>
            )}
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔐</div>
                <h3 className="text-xl font-semibold text-white mb-2">Sistema de Roles</h3>
                <p className="text-gray-400 mb-6">
                  Configure permissões e roles personalizados para diferentes tipos de usuários
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                  Configurar Roles
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-white mb-2">Analytics de Usuários</h3>
                <p className="text-gray-400 mb-6">
                  Análise detalhada do comportamento e engajamento dos usuários
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                  Ver Analytics Detalhados
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
