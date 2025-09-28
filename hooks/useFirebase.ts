'use client'

import { useState, useEffect } from 'react'
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Hook para gerenciar dados do Firestore
export const useFirestore = (collectionName: string) => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar todos os documentos
  const fetchData = async () => {
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, collectionName))
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setData(documents)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados')
    } finally {
      setLoading(false)
    }
  }

  // Adicionar documento
  const addDocument = async (documentData: any) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...documentData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return docRef.id
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar documento')
      throw err
    }
  }

  // Atualizar documento
  const updateDocument = async (id: string, updateData: any) => {
    try {
      const docRef = doc(db, collectionName, id)
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date()
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar documento')
      throw err
    }
  }

  // Deletar documento
  const deleteDocument = async (id: string) => {
    try {
      const docRef = doc(db, collectionName, id)
      await deleteDoc(docRef)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar documento')
      throw err
    }
  }

  // Buscar documentos com filtros
  const queryDocuments = async (filters: { field: string; operator: any; value: any }[]) => {
    try {
      setLoading(true)
      let q = query(collection(db, collectionName))
      
      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value))
      })
      
      const querySnapshot = await getDocs(q)
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setData(documents)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados')
    } finally {
      setLoading(false)
    }
  }

  // Escutar mudanças em tempo real
  const subscribeToChanges = () => {
    const unsubscribe = onSnapshot(collection(db, collectionName), (snapshot) => {
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setData(documents)
      setLoading(false)
    }, (err) => {
      setError(err.message)
      setLoading(false)
    })

    return unsubscribe
  }

  useEffect(() => {
    fetchData()
  }, [collectionName])

  return {
    data,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
    queryDocuments,
    subscribeToChanges,
    refetch: fetchData
  }
}

// Hook específico para pedidos
export const useOrders = () => {
  return useFirestore('orders')
}

// Hook específico para usuários
export const useUsers = () => {
  return useFirestore('users')
}

// Hook específico para conteúdo
export const useContent = () => {
  return useFirestore('content')
}
