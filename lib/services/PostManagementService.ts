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
  limit,
  startAfter,
  getDoc
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
  private cache = new Map<string, { data: Post[], timestamp: number }>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

  static getInstance(): PostManagementService {
    if (!PostManagementService.instance) {
      PostManagementService.instance = new PostManagementService()
    }
    return PostManagementService.instance
  }

  // Cache key generator
  private getCacheKey(userId: string, filters: PostFilters, sortOptions: PostSortOptions, limitCount?: number): string {
    return `${userId}-${JSON.stringify(filters)}-${JSON.stringify(sortOptions)}-${limitCount || 'all'}`
  }

  // Verificar se cache é válido
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION
  }

  // Buscar posts do usuário com cache e paginação
  async getUserPosts(
    userId: string, 
    filters: PostFilters = {}, 
    sortOptions: PostSortOptions = { field: 'createdAt', direction: 'desc' },
    limitCount?: number,
    lastDoc?: any
  ): Promise<Post[]> {
    try {
      const cacheKey = this.getCacheKey(userId, filters, sortOptions, limitCount)
      const cached = this.cache.get(cacheKey)
      
      // Verificar cache apenas para primeira página
      if (!lastDoc && cached && this.isCacheValid(cached.timestamp)) {
        console.log('📦 Usando cache para posts do usuário')
        return cached.data
      }

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

      if (lastDoc) {
        q = query(q, startAfter(lastDoc))
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

      // Cache apenas para primeira página
      if (!lastDoc) {
        this.cache.set(cacheKey, {
          data: posts,
          timestamp: Date.now()
        })
      }

      return posts
    } catch (error) {
      console.error('Erro ao buscar posts do usuário:', error)
      throw error
    }
  }

  // Subscribe com otimizações
  static subscribeToUserPosts(
    userId: string,
    callback: (posts: Post[]) => void,
    filters: PostFilters = {},
    sortOptions: PostSortOptions = { field: 'createdAt', direction: 'desc' },
    limitCount: number = 50
  ): () => void {
    const instance = PostManagementService.getInstance()
    
    let q = query(
      instance.postsCollection,
      where('userId', '==', userId),
      orderBy(sortOptions.field, sortOptions.direction),
      limit(limitCount)
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

      callback(posts)
    }, (error) => {
      console.error('Erro no listener de posts:', error)
    })
  }

  // Criar post com cache invalidation
  async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const newPost = {
        ...postData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      const docRef = await addDoc(this.postsCollection, newPost)
      
      // Invalidar cache
      this.invalidateUserCache(postData.userId)
      
      return docRef.id
    } catch (error) {
      console.error('Erro ao criar post:', error)
      throw error
    }
  }

  // Atualizar post com cache invalidation
  async updatePost(postId: string, updates: Partial<Post>): Promise<void> {
    try {
      const postRef = doc(this.postsCollection, postId)
      await updateDoc(postRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      
      // Invalidar cache
      const postDoc = await getDoc(postRef)
      if (postDoc.exists()) {
        const postData = postDoc.data() as Post
        this.invalidateUserCache(postData.userId)
      }
    } catch (error) {
      console.error('Erro ao atualizar post:', error)
      throw error
    }
  }

  // Deletar post com cache invalidation
  async deletePost(postId: string): Promise<void> {
    try {
      const postRef = doc(this.postsCollection, postId)
      
      // Obter dados do post antes de deletar para invalidar cache
      const postDoc = await getDoc(postRef)
      if (postDoc.exists()) {
        const postData = postDoc.data() as Post
        await deleteDoc(postRef)
        this.invalidateUserCache(postData.userId)
      }
    } catch (error) {
      console.error('Erro ao deletar post:', error)
      throw error
    }
  }

  // Invalidar cache do usuário
  private invalidateUserCache(userId: string): void {
    const keysToDelete: string[] = []
    for (const key of this.cache.keys()) {
      if (key.startsWith(userId)) {
        keysToDelete.push(key)
      }
    }
    keysToDelete.forEach(key => this.cache.delete(key))
  }

  // Limpar cache expirado
  clearExpiredCache(): void {
    for (const [key, value] of this.cache.entries()) {
      if (!this.isCacheValid(value.timestamp)) {
        this.cache.delete(key)
      }
    }
  }
}

// Exportar instância singleton
export default PostManagementService.getInstance()