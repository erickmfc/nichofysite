'use client'

import { useState, useEffect, useCallback } from 'react'
import PostManagementService, { Post, PostFilters, PostSortOptions } from '@/lib/services/PostManagementService'

export const usePosts = (userId: string) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPosts = useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)

      const filters: PostFilters = {}
      const sortOptions: PostSortOptions = {
        field: 'createdAt',
        direction: 'desc'
      }

      const userPosts = await PostManagementService.getUserPosts(
        userId,
        filters,
        sortOptions,
        100 // Carregar mais posts para o dashboard
      )

      setPosts(userPosts)
    } catch (err) {
      console.error('Erro ao carregar posts:', err)
      setError('Erro ao carregar posts')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const refreshPosts = useCallback(() => {
    loadPosts()
  }, [loadPosts])

  const addPost = useCallback((newPost: Post) => {
    setPosts(prev => [newPost, ...prev])
  }, [])

  const updatePost = useCallback((postId: string, updates: Partial<Post>) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    ))
  }, [])

  const deletePost = useCallback((postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId))
  }, [])

  return {
    posts,
    loading,
    error,
    refreshPosts,
    addPost,
    updatePost,
    deletePost
  }
}