'use client'

import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface CreatePostData {
  title: string
  description: string
  category: string
  content: string
  imageUrl?: string
  userId: string
  scheduledFor?: Timestamp
}

export interface Post {
  id: string
  title: string
  description: string
  category: string
  content: string
  imageUrl?: string
  userId: string
  createdAt: Timestamp
  scheduledFor?: Timestamp
  published: boolean
}

export class PostService {
  // Criar novo post
  static async createPost(data: CreatePostData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        ...data,
        createdAt: Timestamp.now(),
        published: false
      })
      
      // Atualizar analytics do usuário
      await this.updateUserAnalytics(data.userId)
      
      return docRef.id
    } catch (error) {
      console.error('Erro ao criar post:', error)
      throw error
    }
  }

  // Buscar posts recentes do usuário
  static async getRecentPosts(userId: string, limitCount: number = 5): Promise<Post[]> {
    try {
      const q = query(
        collection(db, 'posts'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[]
    } catch (error) {
      console.error('Erro ao buscar posts recentes:', error)
      throw error
    }
  }

  // Buscar posts por categoria
  static async getPostsByCategory(userId: string, category: string): Promise<Post[]> {
    try {
      const q = query(
        collection(db, 'posts'),
        where('userId', '==', userId),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[]
    } catch (error) {
      console.error('Erro ao buscar posts por categoria:', error)
      throw error
    }
  }

  // Buscar posts do mês para calendário
  static async getPostsByMonth(userId: string, year: number, month: number): Promise<Post[]> {
    try {
      const startOfMonth = new Date(year, month, 1)
      const endOfMonth = new Date(year, month + 1, 0)
      
      const q = query(
        collection(db, 'posts'),
        where('userId', '==', userId),
        where('createdAt', '>=', Timestamp.fromDate(startOfMonth)),
        where('createdAt', '<=', Timestamp.fromDate(endOfMonth))
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[]
    } catch (error) {
      console.error('Erro ao buscar posts do mês:', error)
      throw error
    }
  }

  // Atualizar post
  static async updatePost(postId: string, data: Partial<CreatePostData>): Promise<void> {
    try {
      await updateDoc(doc(db, 'posts', postId), {
        ...data,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('Erro ao atualizar post:', error)
      throw error
    }
  }

  // Deletar post
  static async deletePost(postId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'posts', postId))
    } catch (error) {
      console.error('Erro ao deletar post:', error)
      throw error
    }
  }

  // Atualizar analytics do usuário (contadores)
  static async updateUserAnalytics(userId: string): Promise<void> {
    try {
      // Buscar todos os posts do usuário dos últimos 7 dias
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const postsQuery = query(
        collection(db, 'posts'),
        where('userId', '==', userId),
        where('createdAt', '>=', Timestamp.fromDate(sevenDaysAgo))
      )
      
      const postsSnapshot = await getDocs(postsQuery)
      const posts = postsSnapshot.docs.map(doc => doc.data()) as Post[]
      
      // Calcular contadores
      const postsLast7Days = posts.length
      const categoryCounts: { [key: string]: number } = {}
      
      posts.forEach(post => {
        categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1
      })
      
      // Salvar analytics no documento do usuário
      const analyticsRef = doc(db, 'users', userId, 'analytics', 'summary')
      await updateDoc(analyticsRef, {
        postsLast7Days,
        categoryCounts,
        lastUpdated: Timestamp.now()
      }).catch(async () => {
        // Se o documento não existir, criar
        await addDoc(collection(db, 'users', userId, 'analytics'), {
          postsLast7Days,
          categoryCounts,
          lastUpdated: Timestamp.now()
        })
      })
    } catch (error) {
      console.error('Erro ao atualizar analytics:', error)
      throw error
    }
  }
}
