'use client'

import { useState, useEffect } from 'react'

interface AdminStats {
  totalUsers: number
  totalPosts: number
  pendingApprovals: number
  approvedPosts: number
  postsThisMonth: number
  usersThisMonth: number
  systemUptime: number
  performanceScore: number
  securityStatus: 'protected' | 'warning' | 'critical'
}

interface RecentActivity {
  id: string
  type: 'user_registered' | 'post_created' | 'post_approved' | 'post_rejected' | 'system_event'
  message: string
  timestamp: Date
  userId?: string
  postId?: string
}

interface SystemStatus {
  isOnline: boolean
  uptime: number
  performance: number
  security: 'protected' | 'warning' | 'critical'
  lastBackup?: Date
  activeUsers: number
}

export function useAdminRealData() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPosts: 0,
    pendingApprovals: 0,
    approvedPosts: 0,
    postsThisMonth: 0,
    usersThisMonth: 0,
    systemUptime: 99.9,
    performanceScore: 99.9,
    securityStatus: 'protected'
  })
  
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    isOnline: true,
    uptime: 99.9,
    performance: 99.9,
    security: 'protected',
    activeUsers: 0
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Carregar dados mockados para demonstração
    loadMockData()
    
    // Simular atualização a cada 30 segundos
    const interval = setInterval(() => {
      updateMockData()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const loadMockData = () => {
    setLoading(true)
    setError(null)

    // Dados mockados realistas para demonstração
    const mockStats: AdminStats = {
      totalUsers: Math.floor(Math.random() * 200) + 100,
      totalPosts: Math.floor(Math.random() * 500) + 300,
      pendingApprovals: Math.floor(Math.random() * 20) + 5,
      approvedPosts: Math.floor(Math.random() * 400) + 250,
      postsThisMonth: Math.floor(Math.random() * 50) + 20,
      usersThisMonth: Math.floor(Math.random() * 30) + 10,
      systemUptime: 99.9,
      performanceScore: 99.9,
      securityStatus: 'protected'
    }

    const mockActivities: RecentActivity[] = [
      {
        id: '1',
        type: 'user_registered',
        message: 'Novo usuário registrado: João Silva',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        userId: 'user1'
      },
      {
        id: '2',
        type: 'post_approved',
        message: 'Post aprovado: "Dicas de Marketing Digital"',
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        postId: 'post1'
      },
      {
        id: '3',
        type: 'post_created',
        message: 'Novo post criado: "Tendências 2024"',
        timestamp: new Date(Date.now() - 18 * 60 * 1000),
        postId: 'post2'
      },
      {
        id: '4',
        type: 'user_registered',
        message: 'Novo usuário registrado: Maria Santos',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        userId: 'user2'
      },
      {
        id: '5',
        type: 'post_approved',
        message: 'Post aprovado: "Estratégias de Vendas"',
        timestamp: new Date(Date.now() - 32 * 60 * 1000),
        postId: 'post3'
      }
    ]

    const mockSystemStatus: SystemStatus = {
      isOnline: true,
      uptime: 99.9,
      performance: 99.9,
      security: 'protected',
      activeUsers: Math.floor(Math.random() * 50) + 10,
      lastBackup: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
    }

    setStats(mockStats)
    setRecentActivities(mockActivities)
    setSystemStatus(mockSystemStatus)
    setLoading(false)
  }

  const updateMockData = () => {
    // Simular pequenas mudanças nos dados
    setStats(prev => ({
      ...prev,
      totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
      totalPosts: prev.totalPosts + Math.floor(Math.random() * 5),
      pendingApprovals: Math.max(0, prev.pendingApprovals + Math.floor(Math.random() * 3) - 1),
      approvedPosts: prev.approvedPosts + Math.floor(Math.random() * 2)
    }))

    setSystemStatus(prev => ({
      ...prev,
      activeUsers: Math.floor(Math.random() * 50) + 10
    }))
  }

  const approvePost = async (postId: string) => {
    try {
      console.log('Aprovando post:', postId)
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Atualizar estatísticas locais
      setStats(prev => ({
        ...prev,
        pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
        approvedPosts: prev.approvedPosts + 1
      }))

      // Adicionar atividade
      const newActivity: RecentActivity = {
        id: Date.now().toString(),
        type: 'post_approved',
        message: `Post aprovado: ID ${postId}`,
        timestamp: new Date(),
        postId
      }

      setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)])
      
      return true
    } catch (error) {
      console.error('Erro ao aprovar post:', error)
      return false
    }
  }

  const rejectPost = async (postId: string, reason?: string) => {
    try {
      console.log('Rejeitando post:', postId, 'Motivo:', reason)
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Atualizar estatísticas locais
      setStats(prev => ({
        ...prev,
        pendingApprovals: Math.max(0, prev.pendingApprovals - 1)
      }))

      // Adicionar atividade
      const newActivity: RecentActivity = {
        id: Date.now().toString(),
        type: 'post_rejected',
        message: `Post rejeitado: ID ${postId}${reason ? ` - ${reason}` : ''}`,
        timestamp: new Date(),
        postId
      }

      setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)])
      
      return true
    } catch (error) {
      console.error('Erro ao rejeitar post:', error)
      return false
    }
  }

  return {
    stats,
    recentActivities,
    systemStatus,
    loading,
    error,
    approvePost,
    rejectPost,
    refreshData: loadMockData
  }
}