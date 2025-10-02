import { db } from '@/lib/firebase'
import { collection, doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'

export interface ContentStylePreferences {
  templatePreference: 'visual' | 'text' | 'mixed'
  postingFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  preferredHours: string[]
  contentType: 'educational' | 'promotional' | 'engaging' | 'mixed'
  formalityLevel: 'casual' | 'professional' | 'formal' | 'mixed'
}

export interface PlatformPreferences {
  platform: string
  priority: number // 1-10, onde 10 é mais importante
  specificSettings: {
    format: 'stories' | 'posts' | 'reels' | 'mixed'
    idealHours: string[]
    strategy: string
    hashtagStyle: 'minimal' | 'moderate' | 'extensive'
    callToActionStyle: 'subtle' | 'direct' | 'aggressive'
  }
}

export interface InterestThemes {
  topicsToCover: string[]
  topicsToAvoid: string[]
  nicheTrends: string[]
  referenceInfluencers: string[]
  inspirationSources: string[]
  brandVoice: string
  targetEmotions: string[]
}

export interface ContentPreferences {
  id?: string
  userId: string
  userEmail: string
  
  // Estilo de Conteúdo
  contentStyle: ContentStylePreferences
  
  // Plataformas Prioritárias
  platformPreferences: PlatformPreferences[]
  
  // Temas de Interesse
  interestThemes: InterestThemes
  
  // Configurações Gerais
  language: string
  timezone: string
  autoGenerate: boolean
  reviewRequired: boolean
  
  // Metadados
  createdAt: Timestamp
  updatedAt: Timestamp
  version: number
}

export const ContentPreferencesService = {
  // Criar preferências iniciais
  async createInitialPreferences(userId: string, userEmail: string): Promise<string> {
    const preferencesId = `preferences_${userId}`
    
    const initialPreferences: ContentPreferences = {
      userId,
      userEmail,
      contentStyle: {
        templatePreference: 'mixed',
        postingFrequency: 'weekly',
        preferredHours: ['09:00', '14:00', '18:00'],
        contentType: 'mixed',
        formalityLevel: 'professional'
      },
      platformPreferences: [
        {
          platform: 'Instagram',
          priority: 8,
          specificSettings: {
            format: 'mixed',
            idealHours: ['09:00', '18:00'],
            strategy: 'Visual storytelling with educational content',
            hashtagStyle: 'moderate',
            callToActionStyle: 'direct'
          }
        },
        {
          platform: 'LinkedIn',
          priority: 7,
          specificSettings: {
            format: 'posts',
            idealHours: ['08:00', '12:00', '17:00'],
            strategy: 'Professional insights and industry knowledge',
            hashtagStyle: 'minimal',
            callToActionStyle: 'subtle'
          }
        }
      ],
      interestThemes: {
        topicsToCover: [],
        topicsToAvoid: [],
        nicheTrends: [],
        referenceInfluencers: [],
        inspirationSources: [],
        brandVoice: 'Professional yet approachable',
        targetEmotions: ['trust', 'confidence', 'curiosity']
      },
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      autoGenerate: false,
      reviewRequired: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      version: 1
    }

    await setDoc(doc(db, 'contentPreferences', preferencesId), initialPreferences)
    
    console.log('Preferências iniciais criadas para:', userId)
    return preferencesId
  },

  // Buscar preferências do usuário
  async getUserPreferences(userId: string): Promise<ContentPreferences | null> {
    try {
      const preferencesId = `preferences_${userId}`
      const docRef = doc(db, 'contentPreferences', preferencesId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as ContentPreferences
      }
      
      return null
    } catch (error) {
      console.error('Erro ao buscar preferências:', error)
      return null
    }
  },

  // Atualizar preferências
  async updatePreferences(userId: string, updates: Partial<ContentPreferences>): Promise<void> {
    const preferencesId = `preferences_${userId}`
    const docRef = doc(db, 'contentPreferences', preferencesId)
    
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
      version: (updates.version || 0) + 1
    })
    
    console.log('Preferências atualizadas para:', userId)
  },

  // Atualizar estilo de conteúdo
  async updateContentStyle(userId: string, contentStyle: ContentStylePreferences): Promise<void> {
    await this.updatePreferences(userId, { contentStyle })
  },

  // Atualizar preferências de plataforma
  async updatePlatformPreferences(userId: string, platformPreferences: PlatformPreferences[]): Promise<void> {
    await this.updatePreferences(userId, { platformPreferences })
  },

  // Atualizar temas de interesse
  async updateInterestThemes(userId: string, interestThemes: InterestThemes): Promise<void> {
    await this.updatePreferences(userId, { interestThemes })
  },

  // Adicionar nova plataforma
  async addPlatform(userId: string, platformPreference: PlatformPreferences): Promise<void> {
    const preferences = await this.getUserPreferences(userId)
    if (preferences) {
      const updatedPlatforms = [...preferences.platformPreferences, platformPreference]
      await this.updatePlatformPreferences(userId, updatedPlatforms)
    }
  },

  // Remover plataforma
  async removePlatform(userId: string, platform: string): Promise<void> {
    const preferences = await this.getUserPreferences(userId)
    if (preferences) {
      const updatedPlatforms = preferences.platformPreferences.filter(p => p.platform !== platform)
      await this.updatePlatformPreferences(userId, updatedPlatforms)
    }
  },

  // Reordenar plataformas por prioridade
  async reorderPlatforms(userId: string, platformPriorities: { platform: string; priority: number }[]): Promise<void> {
    const preferences = await this.getUserPreferences(userId)
    if (preferences) {
      const updatedPlatforms = preferences.platformPreferences.map(platform => {
        const newPriority = platformPriorities.find(p => p.platform === platform.platform)
        return {
          ...platform,
          priority: newPriority?.priority || platform.priority
        }
      }).sort((a, b) => b.priority - a.priority)
      
      await this.updatePlatformPreferences(userId, updatedPlatforms)
    }
  },

  // Obter plataformas ordenadas por prioridade
  async getPlatformsByPriority(userId: string): Promise<PlatformPreferences[]> {
    const preferences = await this.getUserPreferences(userId)
    if (preferences) {
      return preferences.platformPreferences.sort((a, b) => b.priority - a.priority)
    }
    return []
  },

  // Obter configurações específicas de uma plataforma
  async getPlatformSettings(userId: string, platform: string): Promise<PlatformPreferences | null> {
    const preferences = await this.getUserPreferences(userId)
    if (preferences) {
      return preferences.platformPreferences.find(p => p.platform === platform) || null
    }
    return null
  },

  // Gerar sugestões baseadas nas preferências
  async generateContentSuggestions(userId: string): Promise<{
    suggestedTopics: string[]
    optimalPostingTimes: string[]
    recommendedFormats: string[]
    hashtagSuggestions: string[]
  }> {
    const preferences = await this.getUserPreferences(userId)
    if (!preferences) return {
      suggestedTopics: [],
      optimalPostingTimes: [],
      recommendedFormats: [],
      hashtagSuggestions: []
    }

    const suggestions = {
      suggestedTopics: preferences.interestThemes.topicsToCover.slice(0, 5),
      optimalPostingTimes: preferences.contentStyle.preferredHours,
      recommendedFormats: preferences.platformPreferences.map(p => p.specificSettings.format),
      hashtagSuggestions: this.generateHashtagSuggestions(preferences)
    }

    return suggestions
  },

  // Gerar sugestões de hashtags baseadas nas preferências
  generateHashtagSuggestions(preferences: ContentPreferences): string[] {
    const hashtags: string[] = []
    
    // Hashtags baseadas nos temas de interesse
    preferences.interestThemes.topicsToCover.forEach(topic => {
      hashtags.push(`#${topic.toLowerCase().replace(/\s+/g, '')}`)
    })
    
    // Hashtags baseadas no nível de formalidade
    switch (preferences.contentStyle.formalityLevel) {
      case 'professional':
        hashtags.push('#profissional', '#negocios', '#carreira')
        break
      case 'casual':
        hashtags.push('#casual', '#lifestyle', '#pessoal')
        break
      case 'formal':
        hashtags.push('#formal', '#corporativo', '#executivo')
        break
    }
    
    // Hashtags baseadas no tipo de conteúdo
    switch (preferences.contentStyle.contentType) {
      case 'educational':
        hashtags.push('#educacao', '#aprendizado', '#conhecimento')
        break
      case 'promotional':
        hashtags.push('#promocao', '#oferta', '#vendas')
        break
      case 'engaging':
        hashtags.push('#engajamento', '#interacao', '#comunidade')
        break
    }
    
    return hashtags.slice(0, 10) // Limitar a 10 hashtags
  }
}
