import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, orderBy, getDocs, updateDoc, doc, Timestamp, onSnapshot } from 'firebase/firestore'

export interface ChatMessage {
  id?: string
  chatId: string
  senderId: string
  senderName: string
  senderType: 'user' | 'admin'
  message: string
  messageType: 'text' | 'image' | 'file' | 'system'
  timestamp: Timestamp
  read: boolean
  attachments?: {
    url: string
    name: string
    type: string
  }[]
}

export interface ChatSession {
  id?: string
  userId: string
  userEmail: string
  userName: string
  adminId?: string
  adminName?: string
  status: 'active' | 'waiting' | 'closed' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  subject: string
  category: 'general' | 'content' | 'technical' | 'billing' | 'feedback'
  createdAt: Timestamp
  updatedAt: Timestamp
  lastMessage?: Timestamp
  unreadCount: number
  tags: string[]
}

export interface Ticket {
  id?: string
  userId: string
  userEmail: string
  userName: string
  adminId?: string
  adminName?: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'general' | 'content' | 'technical' | 'billing' | 'feature_request'
  createdAt: Timestamp
  updatedAt: Timestamp
  resolvedAt?: Timestamp
  resolution?: string
  attachments?: {
    url: string
    name: string
    type: string
  }[]
}

export interface Feedback {
  id?: string
  userId: string
  userEmail: string
  userName: string
  contentId?: string
  contentType: 'content' | 'service' | 'admin' | 'general'
  rating: number // 1-5
  comment: string
  category: 'quality' | 'timing' | 'communication' | 'satisfaction'
  createdAt: Timestamp
  adminResponse?: string
  adminResponseAt?: Timestamp
  resolved: boolean
}

export interface ServicePreferences {
  id?: string
  userId: string
  userEmail: string
  preferredAdminId?: string
  preferredAdminName?: string
  preferredHours: string[]
  detailLevel: 'basic' | 'detailed' | 'comprehensive'
  checkInFrequency: 'daily' | 'weekly' | 'monthly' | 'as_needed'
  supportType: 'chat' | 'email' | 'video_call' | 'mixed'
  communicationStyle: 'formal' | 'casual' | 'mixed'
  language: string
  timezone: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface InteractionHistory {
  id?: string
  userId: string
  userEmail: string
  interactionType: 'chat' | 'ticket' | 'feedback' | 'content_review' | 'call'
  adminId?: string
  adminName?: string
  description: string
  outcome: string
  satisfaction?: number
  createdAt: Timestamp
  metadata?: any
}

export const AdminCommunicationService = {
  // ===== CHAT SYSTEM =====
  
  // Criar nova sessão de chat
  async createChatSession(userId: string, userEmail: string, userName: string, subject: string, category: string = 'general'): Promise<string> {
    const chatSession: Omit<ChatSession, 'id'> = {
      userId,
      userEmail,
      userName,
      status: 'waiting',
      priority: 'medium',
      subject,
      category: category as any,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      unreadCount: 0,
      tags: []
    }

    const docRef = await addDoc(collection(db, 'chatSessions'), chatSession)
    console.log('Sessão de chat criada:', docRef.id)
    return docRef.id
  },

  // Enviar mensagem no chat
  async sendChatMessage(chatId: string, senderId: string, senderName: string, senderType: 'user' | 'admin', message: string): Promise<string> {
    const chatMessage: Omit<ChatMessage, 'id'> = {
      chatId,
      senderId,
      senderName,
      senderType,
      message,
      messageType: 'text',
      timestamp: Timestamp.now(),
      read: false
    }

    const docRef = await addDoc(collection(db, 'chatMessages'), chatMessage)
    
    // Atualizar última mensagem da sessão
    const chatRef = doc(db, 'chatSessions', chatId)
    await updateDoc(chatRef, {
      updatedAt: Timestamp.now(),
      lastMessage: Timestamp.now(),
      unreadCount: senderType === 'user' ? 1 : 0
    })

    console.log('Mensagem enviada:', docRef.id)
    return docRef.id
  },

  // Buscar mensagens do chat
  async getChatMessages(chatId: string): Promise<ChatMessage[]> {
    const q = query(
      collection(db, 'chatMessages'),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[]
  },

  // Buscar sessões de chat do usuário
  async getUserChatSessions(userId: string): Promise<ChatSession[]> {
    const q = query(
      collection(db, 'chatSessions'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatSession[]
  },

  // Escutar mensagens em tempo real
  subscribeToChatMessages(chatId: string, callback: (messages: ChatMessage[]) => void) {
    const q = query(
      collection(db, 'chatMessages'),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    )
    
    return onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[]
      callback(messages)
    })
  },

  // ===== TICKET SYSTEM =====

  // Criar novo ticket
  async createTicket(userId: string, userEmail: string, userName: string, title: string, description: string, category: string = 'general'): Promise<string> {
    const ticket: Omit<Ticket, 'id'> = {
      userId,
      userEmail,
      userName,
      title,
      description,
      status: 'open',
      priority: 'medium',
      category: category as any,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }

    const docRef = await addDoc(collection(db, 'tickets'), ticket)
    console.log('Ticket criado:', docRef.id)
    return docRef.id
  },

  // Buscar tickets do usuário
  async getUserTickets(userId: string): Promise<Ticket[]> {
    const q = query(
      collection(db, 'tickets'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Ticket[]
  },

  // Atualizar status do ticket
  async updateTicketStatus(ticketId: string, status: string, adminId?: string, adminName?: string, resolution?: string): Promise<void> {
    const ticketRef = doc(db, 'tickets', ticketId)
    const updates: any = {
      status,
      updatedAt: Timestamp.now()
    }

    if (adminId) updates.adminId = adminId
    if (adminName) updates.adminName = adminName
    if (resolution) updates.resolution = resolution
    if (status === 'resolved' || status === 'closed') {
      updates.resolvedAt = Timestamp.now()
    }

    await updateDoc(ticketRef, updates)
    console.log('Status do ticket atualizado:', ticketId)
  },

  // ===== FEEDBACK SYSTEM =====

  // Enviar feedback
  async submitFeedback(userId: string, userEmail: string, userName: string, contentType: string, rating: number, comment: string, category: string = 'satisfaction', contentId?: string): Promise<string> {
    const feedback: Omit<Feedback, 'id'> = {
      userId,
      userEmail,
      userName,
      contentId,
      contentType: contentType as any,
      rating,
      comment,
      category: category as any,
      createdAt: Timestamp.now(),
      resolved: false
    }

    const docRef = await addDoc(collection(db, 'feedback'), feedback)
    console.log('Feedback enviado:', docRef.id)
    return docRef.id
  },

  // Buscar feedback do usuário
  async getUserFeedback(userId: string): Promise<Feedback[]> {
    const q = query(
      collection(db, 'feedback'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Feedback[]
  },

  // Responder ao feedback (admin)
  async respondToFeedback(feedbackId: string, adminResponse: string, adminId: string): Promise<void> {
    const feedbackRef = doc(db, 'feedback', feedbackId)
    await updateDoc(feedbackRef, {
      adminResponse,
      adminResponseAt: Timestamp.now(),
      resolved: true
    })
    console.log('Resposta ao feedback enviada:', feedbackId)
  },

  // ===== SERVICE PREFERENCES =====

  // Criar preferências de serviço
  async createServicePreferences(userId: string, userEmail: string, preferences: Partial<ServicePreferences>): Promise<string> {
    const servicePreferences: Omit<ServicePreferences, 'id'> = {
      userId,
      userEmail,
      preferredHours: preferences.preferredHours || ['09:00', '14:00', '18:00'],
      detailLevel: preferences.detailLevel || 'detailed',
      checkInFrequency: preferences.checkInFrequency || 'weekly',
      supportType: preferences.supportType || 'mixed',
      communicationStyle: preferences.communicationStyle || 'casual',
      language: preferences.language || 'pt-BR',
      timezone: preferences.timezone || 'America/Sao_Paulo',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }

    const docRef = await addDoc(collection(db, 'servicePreferences'), servicePreferences)
    console.log('Preferências de serviço criadas:', docRef.id)
    return docRef.id
  },

  // Buscar preferências de serviço
  async getServicePreferences(userId: string): Promise<ServicePreferences | null> {
    const q = query(
      collection(db, 'servicePreferences'),
      where('userId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null
    
    const doc = querySnapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data()
    } as ServicePreferences
  },

  // Atualizar preferências de serviço
  async updateServicePreferences(userId: string, updates: Partial<ServicePreferences>): Promise<void> {
    const q = query(
      collection(db, 'servicePreferences'),
      where('userId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const docRef = doc(db, 'servicePreferences', querySnapshot.docs[0].id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      })
      console.log('Preferências de serviço atualizadas:', userId)
    }
  },

  // ===== INTERACTION HISTORY =====

  // Registrar interação
  async recordInteraction(userId: string, userEmail: string, interactionType: string, description: string, outcome: string, adminId?: string, adminName?: string, satisfaction?: number): Promise<string> {
    const interaction: Omit<InteractionHistory, 'id'> = {
      userId,
      userEmail,
      interactionType: interactionType as any,
      adminId,
      adminName,
      description,
      outcome,
      satisfaction,
      createdAt: Timestamp.now()
    }

    const docRef = await addDoc(collection(db, 'interactionHistory'), interaction)
    console.log('Interação registrada:', docRef.id)
    return docRef.id
  },

  // Buscar histórico de interações
  async getInteractionHistory(userId: string): Promise<InteractionHistory[]> {
    const q = query(
      collection(db, 'interactionHistory'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as InteractionHistory[]
  },

  // ===== ADMIN FUNCTIONS =====

  // Buscar todas as sessões de chat (admin)
  async getAllChatSessions(): Promise<ChatSession[]> {
    const q = query(
      collection(db, 'chatSessions'),
      orderBy('updatedAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatSession[]
  },

  // Buscar todos os tickets (admin)
  async getAllTickets(): Promise<Ticket[]> {
    const q = query(
      collection(db, 'tickets'),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Ticket[]
  },

  // Buscar todos os feedbacks (admin)
  async getAllFeedback(): Promise<Feedback[]> {
    const q = query(
      collection(db, 'feedback'),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Feedback[]
  },

  // Atribuir chat a admin
  async assignChatToAdmin(chatId: string, adminId: string, adminName: string): Promise<void> {
    const chatRef = doc(db, 'chatSessions', chatId)
    await updateDoc(chatRef, {
      adminId,
      adminName,
      status: 'active',
      updatedAt: Timestamp.now()
    })
    console.log('Chat atribuído ao admin:', adminId)
  },

  // Fechar sessão de chat
  async closeChatSession(chatId: string): Promise<void> {
    const chatRef = doc(db, 'chatSessions', chatId)
    await updateDoc(chatRef, {
      status: 'closed',
      updatedAt: Timestamp.now()
    })
    console.log('Sessão de chat fechada:', chatId)
  }
}
