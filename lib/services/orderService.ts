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
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface Order {
  id?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  niche: string
  contentType: string
  description: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  createdAt?: Timestamp
  updatedAt?: Timestamp
  completedAt?: Timestamp
  price?: number
  notes?: string
}

export class OrderService {
  private collectionName = 'orders'

  // Criar novo pedido
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...orderData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
      return docRef.id
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      throw error
    }
  }

  // Buscar todos os pedidos
  async getAllOrders(): Promise<Order[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order))
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
      throw error
    }
  }

  // Buscar pedidos por status
  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order))
    } catch (error) {
      console.error('Erro ao buscar pedidos por status:', error)
      throw error
    }
  }

  // Buscar pedidos por nicho
  async getOrdersByNiche(niche: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('niche', '==', niche),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order))
    } catch (error) {
      console.error('Erro ao buscar pedidos por nicho:', error)
      throw error
    }
  }

  // Atualizar status do pedido
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      const orderRef = doc(db, this.collectionName, orderId)
      const updateData: any = {
        status,
        updatedAt: Timestamp.now()
      }
      
      if (status === 'completed') {
        updateData.completedAt = Timestamp.now()
      }
      
      await updateDoc(orderRef, updateData)
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error)
      throw error
    }
  }

  // Atualizar pedido
  async updateOrder(orderId: string, updateData: Partial<Order>): Promise<void> {
    try {
      const orderRef = doc(db, this.collectionName, orderId)
      await updateDoc(orderRef, {
        ...updateData,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error)
      throw error
    }
  }

  // Deletar pedido
  async deleteOrder(orderId: string): Promise<void> {
    try {
      const orderRef = doc(db, this.collectionName, orderId)
      await deleteDoc(orderRef)
    } catch (error) {
      console.error('Erro ao deletar pedido:', error)
      throw error
    }
  }

  // Buscar pedidos recentes (últimos 7 dias)
  async getRecentOrders(): Promise<Order[]> {
    try {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const q = query(
        collection(db, this.collectionName),
        where('createdAt', '>=', Timestamp.fromDate(sevenDaysAgo)),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order))
    } catch (error) {
      console.error('Erro ao buscar pedidos recentes:', error)
      throw error
    }
  }

  // Estatísticas dos pedidos
  async getOrderStats(): Promise<{
    total: number
    pending: number
    processing: number
    completed: number
    cancelled: number
  }> {
    try {
      const orders = await this.getAllOrders()
      return {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      throw error
    }
  }
}

export const orderService = new OrderService()
