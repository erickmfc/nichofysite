// lib/services/PostManagementService.ts
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  addDoc,
  serverTimestamp,
  getDocs,
  limit
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface Post {
  id: string
  userId: string
  title: string
  generatedContent: string
  imageUrl: string
  category: string
  niche: string
  createdAt: any
  updatedAt: any
  isFavorite: boolean
  prompt: string
  tags?: string[]
}

export interface PostFilters {
  searchTerm?: string
  niche?: string
  category?: string
  isFavorite?: boolean
  dateFrom?: Date
  dateTo?: Date
}

export interface PostSortOptions {
  field: 'createdAt' | 'title' | 'category' | 'niche'
  direction: 'asc' | 'desc'
}

export class PostManagementService {
  private static instance: PostManagementService
  private postsCollection = collection(db, 'posts')

  static getInstance(): PostManagementService {
    if (!PostManagementService.instance) {
      PostManagementService.instance = new PostManagementService()
    }
    return PostManagementService.instance
  }

  // Buscar posts do usuário com filtros
  async getUserPosts(
    userId: string, 
    filters: PostFilters = {}, 
    sortOptions: PostSortOptions = { field: 'createdAt', direction: 'desc' },
    limitCount?: number
  ): Promise<Post[]> {
    try {
      let q = query(
        this.postsCollection,
        where('userId', '==', userId),
        orderBy(sortOptions.field, sortOptions.direction)
      )

      // Aplicar filtros
      if (filters.niche) {
        q = query(q, where('niche', '==', filters.niche))
      }
      
      if (filters.category) {
        q = query(q, where('category', '==', filters.category))
      }
      
      if (filters.isFavorite !== undefined) {
        q = query(q, where('isFavorite', '==', filters.isFavorite))
      }

      if (limitCount) {
        q = query(q, limit(limitCount))
      }

      const snapshot = await getDocs(q)
      let posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[]

      // Aplicar filtros de busca no cliente (para campos de texto)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        posts = posts.filter(post => 
          post.title.toLowerCase().includes(searchLower) ||
          post.generatedContent.toLowerCase().includes(searchLower) ||
          post.prompt.toLowerCase().includes(searchLower)
        )
      }

      // Aplicar filtros de data
      if (filters.dateFrom || filters.dateTo) {
        posts = posts.filter(post => {
          const postDate = post.createdAt?.toDate ? post.createdAt.toDate() : new Date(post.createdAt)
          
          if (filters.dateFrom && postDate < filters.dateFrom) return false
          if (filters.dateTo && postDate > filters.dateTo) return false
          
          return true
        })
      }

      return posts
    } catch (error) {
      console.error('Erro ao buscar posts:', error)
      throw error
    }
  }

  // Escutar mudanças nos posts do usuário
  subscribeToUserPosts(
    userId: string,
    callback: (posts: Post[]) => void,
    filters: PostFilters = {},
    sortOptions: PostSortOptions = { field: 'createdAt', direction: 'desc' }
  ): () => void {
    let q = query(
      this.postsCollection,
      where('userId', '==', userId),
      orderBy(sortOptions.field, sortOptions.direction)
    )

    // Aplicar filtros básicos
    if (filters.niche) {
      q = query(q, where('niche', '==', filters.niche))
    }
    
    if (filters.category) {
      q = query(q, where('category', '==', filters.category))
    }
    
    if (filters.isFavorite !== undefined) {
      q = query(q, where('isFavorite', '==', filters.isFavorite))
    }

    return onSnapshot(q, (snapshot) => {
      let posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[]

      // Aplicar filtros de busca no cliente
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        posts = posts.filter(post => 
          post.title.toLowerCase().includes(searchLower) ||
          post.generatedContent.toLowerCase().includes(searchLower) ||
          post.prompt.toLowerCase().includes(searchLower)
        )
      }

      // Aplicar filtros de data
      if (filters.dateFrom || filters.dateTo) {
        posts = posts.filter(post => {
          const postDate = post.createdAt?.toDate ? post.createdAt.toDate() : new Date(post.createdAt)
          
          if (filters.dateFrom && postDate < filters.dateFrom) return false
          if (filters.dateTo && postDate > filters.dateTo) return false
          
          return true
        })
      }

      callback(posts)
    })
  }

  // Criar novo post
  async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(this.postsCollection, {
        ...postData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isFavorite: false
      })
      return docRef.id
    } catch (error) {
      console.error('Erro ao criar post:', error)
      throw error
    }
  }

  // Atualizar post
  async updatePost(postId: string, updates: Partial<Post>): Promise<void> {
    try {
      const postRef = doc(this.postsCollection, postId)
      await updateDoc(postRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao atualizar post:', error)
      throw error
    }
  }

  // Marcar/desmarcar como favorito
  async toggleFavorite(postId: string, isFavorite: boolean): Promise<void> {
    try {
      const postRef = doc(this.postsCollection, postId)
      await updateDoc(postRef, {
        isFavorite: !isFavorite,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error)
      throw error
    }
  }

  // Excluir post
  async deletePost(postId: string): Promise<void> {
    try {
      const postRef = doc(this.postsCollection, postId)
      await deleteDoc(postRef)
    } catch (error) {
      console.error('Erro ao excluir post:', error)
      throw error
    }
  }

  // Obter estatísticas do usuário
  async getUserStats(userId: string): Promise<{
    totalPosts: number
    favoritePosts: number
    postsThisMonth: number
    uniqueNiches: number
    uniqueCategories: number
  }> {
    try {
      const posts = await this.getUserPosts(userId)
      
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const postsThisMonth = posts.filter(post => {
        const postDate = post.createdAt?.toDate ? post.createdAt.toDate() : new Date(post.createdAt)
        return postDate >= startOfMonth
      }).length

      const uniqueNiches = new Set(posts.map(post => post.niche)).size
      const uniqueCategories = new Set(posts.map(post => post.category)).size

      return {
        totalPosts: posts.length,
        favoritePosts: posts.filter(post => post.isFavorite).length,
        postsThisMonth,
        uniqueNiches,
        uniqueCategories
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      throw error
    }
  }

  // Obter nichos únicos do usuário
  async getUserNiches(userId: string): Promise<string[]> {
    try {
      const posts = await this.getUserPosts(userId)
      return [...new Set(posts.map(post => post.niche))].sort()
    } catch (error) {
      console.error('Erro ao obter nichos:', error)
      throw error
    }
  }

  // Obter categorias únicas do usuário
  async getUserCategories(userId: string): Promise<string[]> {
    try {
      const posts = await this.getUserPosts(userId)
      return [...new Set(posts.map(post => post.category))].sort()
    } catch (error) {
      console.error('Erro ao obter categorias:', error)
      throw error
    }
  }
}

export default PostManagementService.getInstance()
