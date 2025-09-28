'use client'

import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { UserData, GeneratedContent, ContentTemplate, UserPreferences, BusinessProfile } from '@/lib/types/user'

export class UserDataService {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  // ===== DADOS BÁSICOS DO USUÁRIO =====
  
  async getUserData(): Promise<UserData | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', this.userId))
      return userDoc.exists() ? userDoc.data() as UserData : null
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
      return null
    }
  }

  async updateUserData(data: Partial<UserData>): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'users', this.userId), {
        ...data,
        updatedAt: serverTimestamp()
      })
      return true
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error)
      return false
    }
  }

  // ===== PERFIL DE NEGÓCIO =====
  
  async saveBusinessProfile(profile: BusinessProfile): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'users', this.userId), {
        businessProfile: profile,
        updatedAt: serverTimestamp()
      })
      return true
    } catch (error) {
      console.error('Erro ao salvar perfil de negócio:', error)
      return false
    }
  }

  async getBusinessProfile(): Promise<BusinessProfile | null> {
    try {
      const userData = await this.getUserData()
      return userData?.businessProfile || null
    } catch (error) {
      console.error('Erro ao buscar perfil de negócio:', error)
      return null
    }
  }

  // ===== PREFERÊNCIAS DO USUÁRIO =====
  
  async savePreferences(preferences: UserPreferences): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'users', this.userId), {
        preferences,
        updatedAt: serverTimestamp()
      })
      return true
    } catch (error) {
      console.error('Erro ao salvar preferências:', error)
      return false
    }
  }

  async getPreferences(): Promise<UserPreferences | null> {
    try {
      const userData = await this.getUserData()
      return userData?.preferences || null
    } catch (error) {
      console.error('Erro ao buscar preferências:', error)
      return null
    }
  }

  // ===== CONTEÚDO GERADO =====
  
  async saveGeneratedContent(content: Omit<GeneratedContent, 'id'>): Promise<string | null> {
    try {
      const contentRef = await addDoc(collection(db, 'users', this.userId, 'generatedContent'), {
        ...content,
        metadata: {
          ...content.metadata,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      })
      
      // Atualizar contador no perfil do usuário
      await this.incrementContentCounter()
      
      return contentRef.id
    } catch (error) {
      console.error('Erro ao salvar conteúdo gerado:', error)
      return null
    }
  }

  async getGeneratedContent(limitCount: number = 20): Promise<GeneratedContent[]> {
    try {
      const contentRef = collection(db, 'users', this.userId, 'generatedContent')
      const q = query(contentRef, orderBy('metadata.createdAt', 'desc'), limit(limitCount))
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GeneratedContent[]
    } catch (error) {
      console.error('Erro ao buscar conteúdo gerado:', error)
      return []
    }
  }

  async updateContentInteraction(contentId: string, interactions: Partial<GeneratedContent['interactions']>): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'users', this.userId, 'generatedContent', contentId), {
        interactions: {
          ...interactions
        },
        'metadata.updatedAt': serverTimestamp()
      })
      return true
    } catch (error) {
      console.error('Erro ao atualizar interações do conteúdo:', error)
      return false
    }
  }

  async likeContent(contentId: string): Promise<boolean> {
    return this.updateContentInteraction(contentId, { liked: true })
  }

  async dislikeContent(contentId: string): Promise<boolean> {
    return this.updateContentInteraction(contentId, { disliked: true })
  }

  async saveContent(contentId: string): Promise<boolean> {
    return this.updateContentInteraction(contentId, { saved: true })
  }

  async markContentAsUsed(contentId: string): Promise<boolean> {
    return this.updateContentInteraction(contentId, { used: true })
  }

  // ===== TEMPLATES PERSONALIZADOS =====
  
  async saveCustomTemplate(template: Omit<ContentTemplate, 'id'>): Promise<string | null> {
    try {
      const templateRef = await addDoc(collection(db, 'users', this.userId, 'customTemplates'), {
        ...template,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return templateRef.id
    } catch (error) {
      console.error('Erro ao salvar template personalizado:', error)
      return null
    }
  }

  async getCustomTemplates(): Promise<ContentTemplate[]> {
    try {
      const templatesRef = collection(db, 'users', this.userId, 'customTemplates')
      const q = query(templatesRef, orderBy('lastUsed', 'desc'))
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContentTemplate[]
    } catch (error) {
      console.error('Erro ao buscar templates personalizados:', error)
      return []
    }
  }

  async updateTemplateUsage(templateId: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'users', this.userId, 'customTemplates', templateId), {
        usageCount: 1, // Incrementar
        lastUsed: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return true
    } catch (error) {
      console.error('Erro ao atualizar uso do template:', error)
      return false
    }
  }

  // ===== ANALYTICS E ESTATÍSTICAS =====
  
  async getAnalytics(): Promise<any> {
    try {
      const userData = await this.getUserData()
      const generatedContent = await this.getGeneratedContent(100)
      
      const analytics = {
        totalContentGenerated: generatedContent.length,
        totalLikes: generatedContent.filter(c => c.interactions.liked).length,
        totalShares: generatedContent.filter(c => c.interactions.shared).length,
        totalSaved: generatedContent.filter(c => c.interactions.saved).length,
        totalUsed: generatedContent.filter(c => c.interactions.used).length,
        favoriteNicho: userData?.businessProfile?.nicho || 'N/A',
        mostUsedTone: userData?.businessProfile?.tomVoz || [],
        averageContentLength: this.calculateAverageLength(generatedContent),
        weeklyStats: this.calculateWeeklyStats(generatedContent)
      }
      
      return analytics
    } catch (error) {
      console.error('Erro ao calcular analytics:', error)
      return null
    }
  }

  // ===== MÉTODOS AUXILIARES =====
  
  private async incrementContentCounter(): Promise<void> {
    try {
      const userData = await this.getUserData()
      const currentCount = userData?.analytics?.totalContentGenerated || 0
      
      await updateDoc(doc(db, 'users', this.userId), {
        'analytics.totalContentGenerated': currentCount + 1,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao incrementar contador de conteúdo:', error)
    }
  }

  private calculateAverageLength(content: GeneratedContent[]): number {
    if (content.length === 0) return 0
    
    const totalLength = content.reduce((sum, item) => {
      return sum + (item.content.text?.length || 0)
    }, 0)
    
    return Math.round(totalLength / content.length)
  }

  private calculateWeeklyStats(content: GeneratedContent[]): any[] {
    // Implementar cálculo de estatísticas semanais
    // Por enquanto, retornar array vazio
    return []
  }

  // ===== BACKUP E EXPORTAÇÃO =====
  
  async exportUserData(): Promise<UserData | null> {
    try {
      const userData = await this.getUserData()
      const generatedContent = await this.getGeneratedContent(1000)
      const customTemplates = await this.getCustomTemplates()
      
      return {
        ...userData,
        generatedContent,
        customTemplates
      } as UserData
    } catch (error) {
      console.error('Erro ao exportar dados do usuário:', error)
      return null
    }
  }

  async deleteUserData(): Promise<boolean> {
    try {
      // Implementar exclusão completa dos dados do usuário
      // Por enquanto, apenas marcar como inativo
      await updateDoc(doc(db, 'users', this.userId), {
        status: 'inactive',
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return true
    } catch (error) {
      console.error('Erro ao excluir dados do usuário:', error)
      return false
    }
  }
}
