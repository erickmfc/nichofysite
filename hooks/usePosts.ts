'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, getDocs, deleteDoc, doc, updateDoc, addDoc, Timestamp } from 'firebase/firestore'

export interface Post {
  id: string
  title: string
  generatedContent: string
  imageUrl: string
  niche: string
  category: string
  createdAt: Timestamp
  isFavorite: boolean
  userId: string
  prompt?: string
}

export const usePosts = (userId: string) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar posts do usuário
  const fetchPosts = async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)
      
      const postsRef = collection(db, 'posts')
      const q = query(
        postsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[]
      
      setPosts(postsData)
    } catch (err) {
      console.error('Erro ao buscar posts:', err)
      setError('Erro ao carregar posts')
    } finally {
      setLoading(false)
    }
  }

  // Criar novo post
  const createPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'isFavorite'>) => {
    try {
      const newPost = {
        ...postData,
        createdAt: Timestamp.now(),
        isFavorite: false
      }

      const docRef = await addDoc(collection(db, 'posts'), newPost)
      
      // Atualizar estado local
      setPosts(prev => [{
        id: docRef.id,
        ...newPost
      }, ...prev])

      return docRef.id
    } catch (err) {
      console.error('Erro ao criar post:', err)
      throw new Error('Erro ao criar post')
    }
  }

  // Atualizar post
  const updatePost = async (postId: string, updates: Partial<Post>) => {
    try {
      const postRef = doc(db, 'posts', postId)
      await updateDoc(postRef, updates)
      
      // Atualizar estado local
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, ...updates } : post
      ))
    } catch (err) {
      console.error('Erro ao atualizar post:', err)
      throw new Error('Erro ao atualizar post')
    }
  }

  // Excluir post
  const deletePost = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'posts', postId))
      
      // Atualizar estado local
      setPosts(prev => prev.filter(post => post.id !== postId))
    } catch (err) {
      console.error('Erro ao excluir post:', err)
      throw new Error('Erro ao excluir post')
    }
  }

  // Toggle favorito
  const toggleFavorite = async (postId: string) => {
    const post = posts.find(p => p.id === postId)
    if (!post) return

    try {
      await updatePost(postId, { isFavorite: !post.isFavorite })
    } catch (err) {
      console.error('Erro ao atualizar favorito:', err)
    }
  }

  // Buscar posts por filtros
  const searchPosts = (searchTerm: string, niche?: string, category?: string) => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.generatedContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.prompt && post.prompt.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (niche) {
      filtered = filtered.filter(post => post.niche === niche)
    }

    if (category) {
      filtered = filtered.filter(post => post.category === category)
    }

    return filtered
  }

  // Obter estatísticas
  const getStats = () => {
    const total = posts.length
    const favorites = posts.filter(p => p.isFavorite).length
    const thisWeek = posts.filter(p => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return p.createdAt.toDate() > weekAgo
    }).length

    const niches = Array.from(new Set(posts.map(p => p.niche))).filter(Boolean)
    const categories = Array.from(new Set(posts.map(p => p.category))).filter(Boolean)

    return {
      total,
      favorites,
      thisWeek,
      niches,
      categories
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [userId])

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    toggleFavorite,
    searchPosts,
    getStats
  }
}
