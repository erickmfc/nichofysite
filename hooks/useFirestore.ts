// hooks/useFirestore.ts
import { useState, useEffect } from 'react'
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Hook para gerenciar conteúdo
export const useContent = (userId?: string) => {
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const q = query(
      collection(db, 'content'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setContent(contentData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  const addContent = async (contentData: any) => {
    try {
      const docRef = await addDoc(collection(db, 'content'), {
        ...contentData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
      return { success: true, id: docRef.id }
    } catch (error: any) {
      return { success: false, error: error?.message || 'Erro desconhecido' }
    }
  }

  const updateContent = async (id: string, updates: any) => {
    try {
      await updateDoc(doc(db, 'content', id), {
        ...updates,
        updatedAt: Timestamp.now()
      })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error?.message || 'Erro desconhecido' }
    }
  }

  const deleteContent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'content', id))
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error?.message || 'Erro desconhecido' }
    }
  }

  return {
    content,
    loading,
    addContent,
    updateContent,
    deleteContent
  }
}

// Hook para gerenciar projetos
export const useProjects = () => {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      orderBy('order', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProjects(projectsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { projects, loading }
}

// Hook para gerenciar templates
export const useTemplates = (niche?: string) => {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let q = query(collection(db, 'templates'))
    
    if (niche) {
      q = query(collection(db, 'templates'), where('niche', '==', niche))
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const templatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTemplates(templatesData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [niche])

  return { templates, loading }
}
