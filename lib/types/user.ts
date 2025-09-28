// Tipos para o banco de dados do usuário
export interface UserPreferences {
  language: 'pt' | 'en' | 'es'
  theme: 'light' | 'dark'
  notifications: {
    email: boolean
    push: boolean
    contentReady: boolean
    weeklyReport: boolean
  }
  contentPreferences: {
    tone: string[]
    length: 'short' | 'medium' | 'long'
    hashtags: boolean
    emojis: boolean
    callToAction: boolean
  }
  favoriteTemplates: string[]
  dislikedContent: string[]
}

export interface BusinessProfile {
  nomeNegocio: string
  nicho: string
  descricaoNegocio: string
  publicoAlvo: string
  tomVoz: string[]
  logo?: string
  coresMarca?: string[]
  contato?: {
    telefone?: string
    email?: string
    endereco?: string
    redesSociais?: {
      instagram?: string
      facebook?: string
      whatsapp?: string
    }
  }
}

export interface GeneratedContent {
  id: string
  prompt: string
  content: {
    text: string
    hashtags: string
    images?: string[]
    templates?: string[]
  }
  metadata: {
    nicho: string
    tomVoz: string[]
    publicoAlvo: string
    createdAt: any
    updatedAt: any
  }
  interactions: {
    liked: boolean
    disliked: boolean
    saved: boolean
    shared: boolean
    used: boolean
  }
  performance?: {
    views?: number
    likes?: number
    shares?: number
    comments?: number
  }
}

export interface ContentTemplate {
  id: string
  name: string
  category: string
  prompt: string
  variables: string[]
  isCustom: boolean
  usageCount: number
  lastUsed?: any
}

export interface UserAnalytics {
  totalContentGenerated: number
  totalLikes: number
  totalShares: number
  favoriteNicho: string
  mostUsedTone: string[]
  averageContentLength: number
  weeklyStats: {
    week: string
    contentGenerated: number
    likes: number
    shares: number
  }[]
}

export interface UserData {
  // Dados básicos
  uid: string
  name: string
  email: string
  avatar?: string
  role: 'client' | 'admin'
  plan: 'free' | 'basic' | 'premium'
  status: 'active' | 'inactive' | 'suspended'
  provider: 'email' | 'google' | 'facebook'
  
  // Timestamps
  createdAt: any
  updatedAt: any
  lastLoginAt?: any
  
  // Onboarding
  onboardingCompleted: boolean
  onboardingData?: {
    completedAt: any
    stepsCompleted: number[]
    skippedSteps: number[]
  }
  
  // Perfil de negócio
  businessProfile?: BusinessProfile
  
  // Preferências
  preferences?: UserPreferences
  
  // Conteúdo gerado
  generatedContent?: GeneratedContent[]
  
  // Templates personalizados
  customTemplates?: ContentTemplate[]
  
  // Analytics
  analytics?: UserAnalytics
  
  // Configurações de conta
  accountSettings?: {
    emailVerified: boolean
    twoFactorEnabled: boolean
    dataRetention: '30days' | '1year' | 'forever'
    exportData: boolean
  }
}
