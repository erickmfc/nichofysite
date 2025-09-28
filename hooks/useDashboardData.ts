'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  doc, 
  getDoc,
  Timestamp 
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
}

export interface Suggestion {
  id: string
  title: string
  description: string
  time: string
  type: string
  prompt: string
  userId: string
  date: string
}

export interface CalendarEvent {
  id: string
  title: string
  date: Timestamp
  isHoliday: boolean
  userId: string
}

export interface UserAnalytics {
  postsLast7Days: number
  categoryCounts: {
    [key: string]: number
  }
  lastUpdated: Timestamp
}

export interface DashboardData {
  user: {
    displayName: string
    photoURL?: string
  }
  suggestions: Suggestion[]
  postsLast7Days: number
  categoryCounts: { [key: string]: number }
  recentPosts: Post[]
  calendarEvents: CalendarEvent[]
  postsByDay: { [day: number]: boolean }
  loading: boolean
  error: string | null
}

export const useDashboardData = () => {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData>({
    user: { displayName: '' },
    suggestions: [],
    postsLast7Days: 0,
    categoryCounts: {},
    recentPosts: [],
    calendarEvents: [],
    postsByDay: {},
    loading: true,
    error: null
  })

  useEffect(() => {
    if (!user) {
      setData(prev => ({ ...prev, loading: false }))
      return
    }

    const loadDashboardData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))

        // Carregar dados essenciais primeiro (mais rápido)
        const [userDoc, analyticsDoc] = await Promise.all([
          getDoc(doc(db, 'users', user.uid)),
          getDoc(doc(db, 'users', user.uid, 'analytics', 'summary'))
        ])

        const userData = userDoc.data()
        const analyticsData = analyticsDoc.data() as UserAnalytics || {
          postsLast7Days: 0,
          categoryCounts: {},
          lastUpdated: Timestamp.now()
        }

        // Carregar dados secundários em paralelo
        const today = new Date().toISOString().split('T')[0]
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        const [suggestionsSnapshot, recentPostsSnapshot, calendarSnapshot, postsSnapshot] = await Promise.all([
          // Sugestões
          getDocs(query(
            collection(db, 'suggestions'),
            where('userId', '==', user.uid),
            where('date', '==', today),
            orderBy('time', 'asc')
          )),
          // Posts recentes
          getDocs(query(
            collection(db, 'posts'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(3)
          )),
          // Eventos do calendário
          getDocs(query(
            collection(db, 'calendarEvents'),
            where('userId', '==', user.uid),
            where('date', '>=', Timestamp.fromDate(startOfMonth)),
            where('date', '<=', Timestamp.fromDate(endOfMonth))
          )),
          // Posts do mês para calendário
          getDocs(query(
            collection(db, 'posts'),
            where('userId', '==', user.uid),
            where('createdAt', '>=', Timestamp.fromDate(startOfMonth)),
            where('createdAt', '<=', Timestamp.fromDate(endOfMonth))
          ))
        ])

        // Processar dados
        const suggestions = suggestionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Suggestion[]

        const recentPosts = recentPostsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[]

        const calendarEvents = calendarSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CalendarEvent[]

        const postsByDay: { [day: number]: boolean } = {}
        postsSnapshot.docs.forEach(doc => {
          const post = doc.data()
          const day = post.createdAt.toDate().getDate()
          postsByDay[day] = true
        })

        setData({
          user: {
            displayName: userData?.displayName || user.displayName || 'Usuário',
            photoURL: userData?.photoURL || user.photoURL
          },
          suggestions,
          postsLast7Days: analyticsData.postsLast7Days,
          categoryCounts: analyticsData.categoryCounts,
          recentPosts,
          calendarEvents,
          postsByDay,
          loading: false,
          error: null
        })

      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error)
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Erro ao carregar dados do dashboard'
        }))
      }
    }

    // Debounce para evitar múltiplas chamadas
    const timeoutId = setTimeout(loadDashboardData, 100)
    return () => clearTimeout(timeoutId)
  }, [user])

  return data
}
