import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, orderBy, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore'

export interface ContentRequest {
  id?: string
  userId: string
  userEmail: string
  userName: string
  title: string
  description: string
  category: string
  content: string
  platform: string
  status: 'pending' | 'approved' | 'rejected' | 'published'
  createdAt: Timestamp
  reviewedAt?: Timestamp
  reviewedBy?: string
  adminNotes?: string
  imageUrl?: string
}

export const ContentApprovalService = {
  // Usuário envia conteúdo para aprovação
  async submitForApproval(contentData: Omit<ContentRequest, 'id' | 'createdAt' | 'status'>) {
    const newRequest = await addDoc(collection(db, 'contentRequests'), {
      ...contentData,
      status: 'pending',
      createdAt: Timestamp.now(),
    })
    
    console.log('Conteúdo enviado para aprovação:', newRequest.id)
    return newRequest.id
  },

  // Admin busca pedidos pendentes
  async getPendingRequests() {
    const q = query(
      collection(db, 'contentRequests'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ContentRequest[]
  },

  // Admin aprova conteúdo
  async approveContent(requestId: string, adminId: string, notes?: string) {
    const requestRef = doc(db, 'contentRequests', requestId)
    await updateDoc(requestRef, {
      status: 'approved',
      reviewedAt: Timestamp.now(),
      reviewedBy: adminId,
      adminNotes: notes || '',
    })
    
    console.log(`Conteúdo ${requestId} aprovado pelo admin ${adminId}`)
  },

  // Admin rejeita conteúdo
  async rejectContent(requestId: string, adminId: string, notes: string) {
    const requestRef = doc(db, 'contentRequests', requestId)
    await updateDoc(requestRef, {
      status: 'rejected',
      reviewedAt: Timestamp.now(),
      reviewedBy: adminId,
      adminNotes: notes,
    })
    
    console.log(`Conteúdo ${requestId} rejeitado pelo admin ${adminId}`)
  },

  // Admin publica conteúdo aprovado
  async publishContent(requestId: string, adminId: string) {
    const requestRef = doc(db, 'contentRequests', requestId)
    await updateDoc(requestRef, {
      status: 'published',
      reviewedAt: Timestamp.now(),
      reviewedBy: adminId,
    })
    
    console.log(`Conteúdo ${requestId} publicado pelo admin ${adminId}`)
  },

  // Usuário busca status dos seus pedidos
  async getUserRequests(userId: string) {
    const q = query(
      collection(db, 'contentRequests'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ContentRequest[]
  },

  // Buscar todos os pedidos (admin)
  async getAllRequests() {
    const q = query(
      collection(db, 'contentRequests'),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ContentRequest[]
  }
}
