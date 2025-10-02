import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, orderBy, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore'

export interface NotificationPreferences {
  id?: string
  userId: string
  userEmail: string
  
  // Tipos de notificação
  emailNotifications: {
    contentApproved: boolean
    contentRejected: boolean
    newMessages: boolean
    systemUpdates: boolean
    promotions: boolean
    weeklyDigest: boolean
  }
  
  pushNotifications: {
    contentApproved: boolean
    contentRejected: boolean
    newMessages: boolean
    systemUpdates: boolean
    promotions: boolean
  }
  
  smsNotifications: {
    urgentMessages: boolean
    securityAlerts: boolean
    paymentReminders: boolean
  }
  
  // Configurações de horário
  quietHours: {
    enabled: boolean
    startTime: string // HH:MM
    endTime: string // HH:MM
    timezone: string
  }
  
  // Frequência
  frequency: {
    digest: 'daily' | 'weekly' | 'monthly' | 'never'
    reminders: 'immediate' | 'hourly' | 'daily' | 'never'
    promotions: 'immediate' | 'daily' | 'weekly' | 'never'
  }
  
  // Alertas personalizados
  customAlerts: {
    highEngagement: boolean
    lowPerformance: boolean
    newFeatures: boolean
    maintenance: boolean
  }
  
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface PrivacySettings {
  id?: string
  userId: string
  userEmail: string
  
  // Visibilidade do perfil
  profileVisibility: {
    public: boolean
    showStats: boolean
    showBadges: boolean
    showLevel: boolean
    showActivity: boolean
  }
  
  // Dados compartilhados
  dataSharing: {
    analytics: boolean
    marketing: boolean
    thirdParty: boolean
    research: boolean
  }
  
  // Histórico
  historySettings: {
    keepActivityLog: boolean
    keepChatHistory: boolean
    keepFeedbackHistory: boolean
    retentionPeriod: number // dias
  }
  
  // Backup
  backupSettings: {
    autoBackup: boolean
    backupFrequency: 'daily' | 'weekly' | 'monthly'
    cloudStorage: boolean
    localDownload: boolean
  }
  
  // Política de retenção
  dataRetention: {
    deleteAfterInactivity: boolean
    inactivityPeriod: number // dias
    anonymizeData: boolean
    exportBeforeDelete: boolean
  }
  
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface IntegrationSettings {
  id?: string
  userId: string
  userEmail: string
  
  // Redes sociais
  socialMedia: {
    instagram: {
      connected: boolean
      accessToken?: string
      autoPost: boolean
      syncStories: boolean
    }
    linkedin: {
      connected: boolean
      accessToken?: string
      autoPost: boolean
      syncActivity: boolean
    }
    twitter: {
      connected: boolean
      accessToken?: string
      autoPost: boolean
      syncTweets: boolean
    }
    facebook: {
      connected: boolean
      accessToken?: string
      autoPost: boolean
      syncPages: boolean
    }
  }
  
  // Calendário
  calendar: {
    googleCalendar: {
      connected: boolean
      accessToken?: string
      syncEvents: boolean
      createReminders: boolean
    }
    outlook: {
      connected: boolean
      accessToken?: string
      syncEvents: boolean
      createReminders: boolean
    }
  }
  
  // Ferramentas de design
  designTools: {
    canva: {
      connected: boolean
      accessToken?: string
      autoSync: boolean
    }
    figma: {
      connected: boolean
      accessToken?: string
      autoSync: boolean
    }
    adobe: {
      connected: boolean
      accessToken?: string
      autoSync: boolean
    }
  }
  
  // API e Webhooks
  apiSettings: {
    apiKey?: string
    webhookUrl?: string
    webhookSecret?: string
    rateLimit: number
    allowedOrigins: string[]
  }
  
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface UserTypeSettings {
  id?: string
  userId: string
  userEmail: string
  userType: 'microempresario' | 'profissional_livre' | 'influenciador' | 'empresa'
  
  // Configurações específicas por tipo
  settings: {
    // Microempresário
    microempresario?: {
      focusOnSales: boolean
      promotionalTemplates: boolean
      roiAnalysis: boolean
      whatsappIntegration: boolean
      simpleReports: boolean
    }
    
    // Profissional Liberal
    profissional_livre?: {
      focusOnAuthority: boolean
      educationalContent: boolean
      networking: boolean
      linkedinIntegration: boolean
      reputationAnalysis: boolean
    }
    
    // Influenciador
    influenciador?: {
      focusOnEngagement: boolean
      viralContent: boolean
      audienceAnalysis: boolean
      allPlatformsIntegration: boolean
      detailedReports: boolean
    }
    
    // Empresa
    empresa?: {
      focusOnBranding: boolean
      corporateContent: boolean
      teamManagement: boolean
      executiveReports: boolean
      crmIntegration: boolean
    }
  }
  
  // Benefícios ativos
  activeBenefits: string[]
  
  // Configurações personalizadas
  customSettings: {
    [key: string]: any
  }
  
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const AdvancedSettingsService = {
  // ===== NOTIFICATION PREFERENCES =====
  
  // Criar preferências de notificação
  async createNotificationPreferences(userId: string, userEmail: string): Promise<string> {
    const preferences: Omit<NotificationPreferences, 'id'> = {
      userId,
      userEmail,
      emailNotifications: {
        contentApproved: true,
        contentRejected: true,
        newMessages: true,
        systemUpdates: true,
        promotions: false,
        weeklyDigest: true
      },
      pushNotifications: {
        contentApproved: true,
        contentRejected: true,
        newMessages: true,
        systemUpdates: false,
        promotions: false
      },
      smsNotifications: {
        urgentMessages: true,
        securityAlerts: true,
        paymentReminders: false
      },
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00',
        timezone: 'America/Sao_Paulo'
      },
      frequency: {
        digest: 'weekly',
        reminders: 'daily',
        promotions: 'weekly'
      },
      customAlerts: {
        highEngagement: true,
        lowPerformance: true,
        newFeatures: true,
        maintenance: true
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }

    const docRef = await addDoc(collection(db, 'notificationPreferences'), preferences)
    console.log('Preferências de notificação criadas:', docRef.id)
    return docRef.id
  },

  // Buscar preferências de notificação
  async getNotificationPreferences(userId: string): Promise<NotificationPreferences | null> {
    const q = query(
      collection(db, 'notificationPreferences'),
      where('userId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null
    
    const doc = querySnapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data()
    } as NotificationPreferences
  },

  // Atualizar preferências de notificação
  async updateNotificationPreferences(userId: string, updates: Partial<NotificationPreferences>): Promise<void> {
    const q = query(
      collection(db, 'notificationPreferences'),
      where('userId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const docRef = doc(db, 'notificationPreferences', querySnapshot.docs[0].id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      })
      console.log('Preferências de notificação atualizadas:', userId)
    }
  },

  // ===== PRIVACY SETTINGS =====
  
  // Criar configurações de privacidade
  async createPrivacySettings(userId: string, userEmail: string): Promise<string> {
    const settings: Omit<PrivacySettings, 'id'> = {
      userId,
      userEmail,
      profileVisibility: {
        public: true,
        showStats: true,
        showBadges: true,
        showLevel: true,
        showActivity: false
      },
      dataSharing: {
        analytics: true,
        marketing: false,
        thirdParty: false,
        research: false
      },
      historySettings: {
        keepActivityLog: true,
        keepChatHistory: true,
        keepFeedbackHistory: true,
        retentionPeriod: 365
      },
      backupSettings: {
        autoBackup: true,
        backupFrequency: 'weekly',
        cloudStorage: true,
        localDownload: false
      },
      dataRetention: {
        deleteAfterInactivity: false,
        inactivityPeriod: 365,
        anonymizeData: true,
        exportBeforeDelete: true
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }

    const docRef = await addDoc(collection(db, 'privacySettings'), settings)
    console.log('Configurações de privacidade criadas:', docRef.id)
    return docRef.id
  },

  // Buscar configurações de privacidade
  async getPrivacySettings(userId: string): Promise<PrivacySettings | null> {
    const q = query(
      collection(db, 'privacySettings'),
      where('userId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null
    
    const doc = querySnapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data()
    } as PrivacySettings
  },

  // Atualizar configurações de privacidade
  async updatePrivacySettings(userId: string, updates: Partial<PrivacySettings>): Promise<void> {
    const q = query(
      collection(db, 'privacySettings'),
      where('userId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const docRef = doc(db, 'privacySettings', querySnapshot.docs[0].id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      })
      console.log('Configurações de privacidade atualizadas:', userId)
    }
  },

  // ===== INTEGRATION SETTINGS =====
  
  // Criar configurações de integração
  async createIntegrationSettings(userId: string, userEmail: string): Promise<string> {
    const settings: Omit<IntegrationSettings, 'id'> = {
      userId,
      userEmail,
      socialMedia: {
        instagram: { connected: false, autoPost: false, syncStories: false },
        linkedin: { connected: false, autoPost: false, syncActivity: false },
        twitter: { connected: false, autoPost: false, syncTweets: false },
        facebook: { connected: false, autoPost: false, syncPages: false }
      },
      calendar: {
        googleCalendar: { connected: false, syncEvents: false, createReminders: false },
        outlook: { connected: false, syncEvents: false, createReminders: false }
      },
      designTools: {
        canva: { connected: false, autoSync: false },
        figma: { connected: false, autoSync: false },
        adobe: { connected: false, autoSync: false }
      },
      apiSettings: {
        rateLimit: 1000,
        allowedOrigins: []
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }

    const docRef = await addDoc(collection(db, 'integrationSettings'), settings)
    console.log('Configurações de integração criadas:', docRef.id)
    return docRef.id
  },

  // Buscar configurações de integração
  async getIntegrationSettings(userId: string): Promise<IntegrationSettings | null> {
    const q = query(
      collection(db, 'integrationSettings'),
      where('userId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null
    
    const doc = querySnapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data()
    } as IntegrationSettings
  },

  // Conectar rede social
  async connectSocialMedia(userId: string, platform: string, accessToken: string): Promise<void> {
    const q = query(
      collection(db, 'integrationSettings'),
      where('userId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const docRef = doc(db, 'integrationSettings', querySnapshot.docs[0].id)
      await updateDoc(docRef, {
        [`socialMedia.${platform}.connected`]: true,
        [`socialMedia.${platform}.accessToken`]: accessToken,
        updatedAt: Timestamp.now()
      })
      console.log(`Rede social ${platform} conectada para ${userId}`)
    }
  },

  // ===== USER TYPE SETTINGS =====
  
  // Criar configurações por tipo de usuário
  async createUserTypeSettings(userId: string, userEmail: string, userType: string): Promise<string> {
    const settings: Omit<UserTypeSettings, 'id'> = {
      userId,
      userEmail,
      userType: userType as any,
      settings: this.getDefaultSettingsForUserType(userType),
      activeBenefits: this.getDefaultBenefitsForUserType(userType),
      customSettings: {},
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }

    const docRef = await addDoc(collection(db, 'userTypeSettings'), settings)
    console.log('Configurações de tipo de usuário criadas:', docRef.id)
    return docRef.id
  },

  // Buscar configurações por tipo de usuário
  async getUserTypeSettings(userId: string): Promise<UserTypeSettings | null> {
    const q = query(
      collection(db, 'userTypeSettings'),
      where('userId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null
    
    const doc = querySnapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data()
    } as UserTypeSettings
  },

  // Atualizar configurações por tipo de usuário
  async updateUserTypeSettings(userId: string, updates: Partial<UserTypeSettings>): Promise<void> {
    const q = query(
      collection(db, 'userTypeSettings'),
      where('userId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const docRef = doc(db, 'userTypeSettings', querySnapshot.docs[0].id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      })
      console.log('Configurações de tipo de usuário atualizadas:', userId)
    }
  },

  // ===== HELPER FUNCTIONS =====

  getDefaultSettingsForUserType(userType: string): any {
    switch (userType) {
      case 'microempresario':
        return {
          microempresario: {
            focusOnSales: true,
            promotionalTemplates: true,
            roiAnalysis: true,
            whatsappIntegration: true,
            simpleReports: true
          }
        }
      case 'profissional_livre':
        return {
          profissional_livre: {
            focusOnAuthority: true,
            educationalContent: true,
            networking: true,
            linkedinIntegration: true,
            reputationAnalysis: true
          }
        }
      case 'influenciador':
        return {
          influenciador: {
            focusOnEngagement: true,
            viralContent: true,
            audienceAnalysis: true,
            allPlatformsIntegration: true,
            detailedReports: true
          }
        }
      case 'empresa':
        return {
          empresa: {
            focusOnBranding: true,
            corporateContent: true,
            teamManagement: true,
            executiveReports: true,
            crmIntegration: true
          }
        }
      default:
        return {}
    }
  },

  getDefaultBenefitsForUserType(userType: string): string[] {
    switch (userType) {
      case 'microempresario':
        return ['templates-promocionais', 'analise-roi', 'whatsapp-business', 'relatorios-simples']
      case 'profissional_livre':
        return ['conteudo-educativo', 'networking', 'linkedin-integration', 'analise-reputacao']
      case 'influenciador':
        return ['conteudo-viral', 'analise-audiencia', 'todas-plataformas', 'relatorios-detalhados']
      case 'empresa':
        return ['conteudo-corporativo', 'gestao-equipe', 'relatorios-executivos', 'crm-integration']
      default:
        return []
    }
  }
}
