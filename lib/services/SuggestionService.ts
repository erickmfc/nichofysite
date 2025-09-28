'use client'

import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface CreateSuggestionData {
  title: string
  description: string
  time: string
  type: string
  prompt: string
  userId: string
  date: string
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
  createdAt: Timestamp
  used: boolean
}

export class SuggestionService {
  // Criar nova sugestão
  static async createSuggestion(data: CreateSuggestionData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'suggestions'), {
        ...data,
        createdAt: Timestamp.now(),
        used: false
      })
      return docRef.id
    } catch (error) {
      console.error('Erro ao criar sugestão:', error)
      throw error
    }
  }

  // Buscar sugestões do usuário para uma data específica
  static async getSuggestionsByDate(userId: string, date: string): Promise<Suggestion[]> {
    try {
      const q = query(
        collection(db, 'suggestions'),
        where('userId', '==', userId),
        where('date', '==', date),
        orderBy('time', 'asc')
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Suggestion[]
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error)
      throw error
    }
  }

  // Marcar sugestão como usada
  static async markAsUsed(suggestionId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'suggestions', suggestionId), {
        used: true,
        usedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('Erro ao marcar sugestão como usada:', error)
      throw error
    }
  }

  // Gerar sugestões automáticas para o dia
  static async generateDailySuggestions(userId: string, date: string): Promise<void> {
    try {
      // Verificar se já existem sugestões para hoje
      const existingSuggestions = await this.getSuggestionsByDate(userId, date)
      if (existingSuggestions.length > 0) {
        return // Já existem sugestões para hoje
      }

      // Gerar sugestões baseadas no nicho do usuário (exemplo)
      const suggestions = [
        {
          title: 'Post de "bom dia" para sua cafeteria',
          description: 'Comece o dia com energia e convide seus clientes para um café especial',
          time: '09:00',
          type: 'Instagram',
          prompt: 'Crie um post de bom dia para uma cafeteria, com tom acolhedor e convidativo',
          userId,
          date
        },
        {
          title: 'Enquete nos stories sobre sabor preferido',
          description: 'Engaje sua audiência perguntando qual sabor de café eles preferem',
          time: '14:00',
          type: 'Stories',
          prompt: 'Crie uma enquete para stories do Instagram sobre sabores de café preferidos',
          userId,
          date
        },
        {
          title: 'Post de happy hour',
          description: 'Promova o happy hour da sua cafeteria com drinks especiais',
          time: '18:00',
          type: 'Instagram',
          prompt: 'Crie um post promocional para happy hour de uma cafeteria com drinks especiais',
          userId,
          date
        }
      ]

      // Criar todas as sugestões
      for (const suggestion of suggestions) {
        await this.createSuggestion(suggestion)
      }
    } catch (error) {
      console.error('Erro ao gerar sugestões diárias:', error)
      throw error
    }
  }

  // Deletar sugestão
  static async deleteSuggestion(suggestionId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'suggestions', suggestionId))
    } catch (error) {
      console.error('Erro ao deletar sugestão:', error)
      throw error
    }
  }
}
