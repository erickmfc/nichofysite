import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, orderBy, getDocs, updateDoc, doc, Timestamp, onSnapshot } from 'firebase/firestore'

export interface Notification {
  id?: string
  userId: string
  userEmail: string
  title: string
  message: string
  type: 'content_approved' | 'content_rejected' | 'content_published' | 'system' | 'admin'
  status: 'unread' | 'read'
  createdAt: Timestamp
  data?: any
}

export const NotificationService = {
  // Criar notificação
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'status'>) {
    const newNotification = await addDoc(collection(db, 'notifications'), {
      ...notification,
      status: 'unread',
      createdAt: Timestamp.now(),
    })
    
    console.log('Notificação criada:', newNotification.id)
    return newNotification.id
  },

  // Notificar usuário sobre aprovação de conteúdo
  async notifyContentApproved(userId: string, userEmail: string, contentTitle: string) {
    await this.createNotification({
      userId,
      userEmail,
      title: '🎉 Conteúdo Aprovado!',
      message: `Seu conteúdo "${contentTitle}" foi aprovado e está pronto para publicação!`,
      type: 'content_approved',
      data: { contentTitle }
    })
  },

  // Notificar usuário sobre rejeição de conteúdo
  async notifyContentRejected(userId: string, userEmail: string, contentTitle: string, reason: string) {
    await this.createNotification({
      userId,
      userEmail,
      title: '❌ Conteúdo Rejeitado',
      message: `Seu conteúdo "${contentTitle}" foi rejeitado. Motivo: ${reason}`,
      type: 'content_rejected',
      data: { contentTitle, reason }
    })
  },

  // Notificar usuário sobre publicação
  async notifyContentPublished(userId: string, userEmail: string, contentTitle: string) {
    await this.createNotification({
      userId,
      userEmail,
      title: '🚀 Conteúdo Publicado!',
      message: `Seu conteúdo "${contentTitle}" foi publicado com sucesso!`,
      type: 'content_published',
      data: { contentTitle }
    })
  },

  // Buscar notificações do usuário
  async getUserNotifications(userId: string) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[]
  },

  // Marcar notificação como lida
  async markAsRead(notificationId: string) {
    const notificationRef = doc(db, 'notifications', notificationId)
    await updateDoc(notificationRef, {
      status: 'read'
    })
  },

  // Contar notificações não lidas
  async getUnreadCount(userId: string) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('status', '==', 'unread')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.size
  },

  // Escutar notificações em tempo real
  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    return onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[]
      callback(notifications)
    })
  }
}
