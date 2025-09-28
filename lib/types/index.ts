// Tipos principais do sistema NichoFy

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'client' | 'admin' | 'content_creator'
  plan: 'basic' | 'professional' | 'enterprise'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'client' | 'admin' | 'content_creator'
  plan: 'basic' | 'professional' | 'enterprise'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  preferences: {
    language: 'pt' | 'en'
    notifications: boolean
    theme: 'light' | 'dark'
  }
  subscription?: {
    planId: string
    status: 'active' | 'cancelled' | 'expired'
    startDate: Date
    endDate: Date
    autoRenew: boolean
  }
}

export interface Order {
  id: string
  userId: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  niche: string
  description: string
  requirements?: string[]
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'revision'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  contentType: 'post' | 'story' | 'carousel' | 'reel' | 'blog'
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok'
  quantity: number
  deadline?: Date
  assignedTo?: string // ID do content creator
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  feedback?: {
    rating: number // 1-5
    comment?: string
    submittedAt: Date
  }
  revisions?: {
    id: string
    requestedAt: Date
    reason: string
    status: 'pending' | 'completed'
    completedAt?: Date
  }[]
}

export interface Content {
  id: string
  orderId: string
  userId: string
  niche: string
  title: string
  content: string
  hashtags: string[]
  platform: string
  contentType: string
  status: 'draft' | 'review' | 'approved' | 'delivered'
  createdAt: Date
  updatedAt: Date
  deliveredAt?: Date
  media?: {
    type: 'image' | 'video' | 'gif'
    url: string
    alt?: string
    caption?: string
  }[]
  metrics?: {
    likes?: number
    shares?: number
    comments?: number
    views?: number
    engagement?: number
  }
}

export interface Nicho {
  id: string
  name: string
  description: string
  icon: string
  color: string
  isActive: boolean
  topics: string[]
  templates: {
    id: string
    name: string
    content: string
    variables: string[]
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface Template {
  id: string
  nichoId: string
  name: string
  description: string
  content: string
  variables: string[]
  platform: string
  contentType: string
  isActive: boolean
  usageCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Analytics {
  id: string
  userId: string
  period: 'daily' | 'weekly' | 'monthly'
  date: Date
  metrics: {
    ordersCreated: number
    ordersCompleted: number
    contentDelivered: number
    averageRating: number
    totalRevenue: number
    activeUsers: number
  }
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: 'order_update' | 'content_ready' | 'payment' | 'system'
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  createdAt: Date
  readAt?: Date
}

export interface Payment {
  id: string
  userId: string
  orderId?: string
  amount: number
  currency: 'BRL' | 'USD'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  method: 'credit_card' | 'pix' | 'boleto' | 'paypal'
  transactionId?: string
  createdAt: Date
  completedAt?: Date
  metadata?: Record<string, any>
}

export interface Settings {
  id: string
  key: string
  value: any
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  description?: string
  isPublic: boolean
  updatedAt: Date
  updatedBy: string
}

// Tipos para formulários e validação
export interface CreateOrderData {
  clientName: string
  clientEmail: string
  clientPhone?: string
  niche: string
  description: string
  requirements?: string[]
  contentType: string
  platform: string
  quantity: number
  deadline?: Date
}

export interface UpdateOrderData {
  status?: Order['status']
  priority?: Order['priority']
  assignedTo?: string
  feedback?: Order['feedback']
}

export interface CreateContentData {
  orderId: string
  niche: string
  title: string
  content: string
  hashtags: string[]
  platform: string
  contentType: string
  media?: Content['media']
}

// Tipos para filtros e consultas
export interface OrderFilters {
  status?: Order['status']
  priority?: Order['priority']
  niche?: string
  platform?: string
  assignedTo?: string
  dateFrom?: Date
  dateTo?: Date
}

export interface ContentFilters {
  status?: Content['status']
  niche?: string
  platform?: string
  userId?: string
  dateFrom?: Date
  dateTo?: Date
}

// Tipos para respostas da API
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}
