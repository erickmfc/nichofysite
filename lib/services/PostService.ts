'use client'

import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  doc, 
  getDoc,
  addDoc,
  updateDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface Post {
  id: string
  title: string
  description: string
  category: string
  createdAt: Timestamp
  imageUrl?: string
  userId: string
  status: 'draft' | 'published' | 'scheduled'
  scheduledDate?: Timestamp
}

export interface UserSubscription {
  planName: string
  postsPerMonth: number
  startDate: Timestamp
  endDate: Timestamp
  isActive: boolean
}

export interface DashboardStats {
  postsCreated: number
  postsThisMonth: number
  postsRemaining: number
  currentPlan: string
  planLimit: number
  daysWithPosts: number[]
  recentPosts: Post[]
  loading: boolean
  error?: string
}

export class PostService {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  // ===== CRIAR POST =====
  
  async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'userId'>): Promise<string | null> {
    try {
      const postRef = await addDoc(collection(db, 'posts'), {
        ...postData,
        userId: this.userId,
        createdAt: serverTimestamp(),
        status: postData.status || 'draft'
      })
      
      // Atualizar estatísticas do usuário
      await this.updateUserStats()
      
      return postRef.id
    } catch (error) {
      console.error('Erro ao criar post:', error)
      return null
    }
  }

  // ===== BUSCAR POSTS =====
  
  async getUserPosts(limitCount: number = 50): Promise<Post[]> {
    try {
      const postsRef = collection(db, 'posts')
      const q = query(
        postsRef,
        where('userId', '==', this.userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[]
    } catch (error) {
      console.error('Erro ao buscar posts:', error)
      return []
    }
  }

  async getPostsThisMonth(): Promise<Post[]> {
    try {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      const postsRef = collection(db, 'posts')
      const q = query(
        postsRef,
        where('userId', '==', this.userId),
        where('createdAt', '>=', Timestamp.fromDate(startOfMonth)),
        where('createdAt', '<=', Timestamp.fromDate(endOfMonth)),
        orderBy('createdAt', 'desc')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[]
    } catch (error) {
      console.error('Erro ao buscar posts do mês:', error)
      return []
    }
  }

  async getRecentPosts(count: number = 3): Promise<Post[]> {
    try {
      const postsRef = collection(db, 'posts')
      const q = query(
        postsRef,
        where('userId', '==', this.userId),
        orderBy('createdAt', 'desc'),
        limit(count)
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[]
    } catch (error) {
      console.error('Erro ao buscar posts recentes:', error)
      return []
    }
  }

  // ===== ESTATÍSTICAS =====
  
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [userDoc, allPosts, postsThisMonth] = await Promise.all([
        getDoc(doc(db, 'users', this.userId)),
        this.getUserPosts(),
        this.getPostsThisMonth()
      ])

      const userData = userDoc.data()
      const subscription = userData?.subscription as UserSubscription || {
        planName: 'Básico',
        postsPerMonth: 50,
        isActive: true
      }

      const postsRemaining = Math.max(0, subscription.postsPerMonth - postsThisMonth.length)
      
      // Calcular dias com posts
      const daysWithPosts: number[] = []
      postsThisMonth.forEach(post => {
        const day = post.createdAt.toDate().getDate()
        if (!daysWithPosts.includes(day)) {
          daysWithPosts.push(day)
        }
      })

      return {
        postsCreated: allPosts.length,
        postsThisMonth: postsThisMonth.length,
        postsRemaining,
        currentPlan: subscription.planName,
        planLimit: subscription.postsPerMonth,
        daysWithPosts,
        recentPosts: await this.getRecentPosts(3),
        loading: false
      }
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error)
      return {
        postsCreated: 0,
        postsThisMonth: 0,
        postsRemaining: 50,
        currentPlan: 'Básico',
        planLimit: 50,
        daysWithPosts: [],
        recentPosts: [],
        loading: false,
        error: 'Erro ao carregar estatísticas'
      }
    }
  }

  // ===== ATUALIZAR ESTATÍSTICAS DO USUÁRIO =====
  
  private async updateUserStats(): Promise<void> {
    try {
      const postsThisMonth = await this.getPostsThisMonth()
      const allPosts = await this.getUserPosts()
      
      await updateDoc(doc(db, 'users', this.userId), {
        'analytics.totalPosts': allPosts.length,
        'analytics.postsThisMonth': postsThisMonth.length,
        'analytics.lastUpdated': serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao atualizar estatísticas:', error)
    }
  }

  // ===== GERENCIAR PLANOS =====
  
  async updateSubscription(subscription: UserSubscription): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'users', this.userId), {
        subscription,
        updatedAt: serverTimestamp()
      })
      return true
    } catch (error) {
      console.error('Erro ao atualizar plano:', error)
      return false
    }
  }

  async getSubscription(): Promise<UserSubscription | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', this.userId))
      const userData = userDoc.data()
      return userData?.subscription || null
    } catch (error) {
      console.error('Erro ao buscar plano:', error)
      return null
    }
  }

  // ===== VERIFICAR LIMITE DE POSTS =====
  
  async canCreatePost(): Promise<{ canCreate: boolean; reason?: string }> {
    try {
      // Importar SubscriptionService
      const SubscriptionService = (await import('./SubscriptionService')).SubscriptionService
      const subscriptionService = new SubscriptionService(this.userId)
      
      const limits = await subscriptionService.checkPlanLimits()
      
      return {
        canCreate: limits.canCreatePost,
        reason: limits.reason
      }
    } catch (error) {
      console.error('Erro ao verificar limite:', error)
      return { canCreate: false, reason: 'Erro ao verificar limite' }
    }
  }

  // ===== POSTS POR CATEGORIA =====
  
  async getPostsByCategory(category: string): Promise<Post[]> {
    try {
      const postsRef = collection(db, 'posts')
      const q = query(
        postsRef,
        where('userId', '==', this.userId),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[]
    } catch (error) {
      console.error('Erro ao buscar posts por categoria:', error)
      return []
    }
  }

  // ===== POSTS AGENDADOS =====
  
  async getScheduledPosts(): Promise<Post[]> {
    try {
      const postsRef = collection(db, 'posts')
      const q = query(
        postsRef,
        where('userId', '==', this.userId),
        where('status', '==', 'scheduled'),
        orderBy('scheduledDate', 'asc')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[]
    } catch (error) {
      console.error('Erro ao buscar posts agendados:', error)
      return []
    }
  }

  // ===== BUSCAR POSTS POR DATA =====
  
  async getPostsByDate(date: Date): Promise<Post[]> {
    try {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      
      const postsRef = collection(db, 'posts')
      const q = query(
        postsRef,
        where('userId', '==', this.userId),
        where('createdAt', '>=', Timestamp.fromDate(startOfDay)),
        where('createdAt', '<=', Timestamp.fromDate(endOfDay)),
        orderBy('createdAt', 'desc')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[]
    } catch (error) {
      console.error('Erro ao buscar posts por data:', error)
      return []
    }
  }
}