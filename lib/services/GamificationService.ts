import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, orderBy, getDocs, updateDoc, doc, Timestamp, increment } from 'firebase/firestore'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: 'loyalty' | 'activity' | 'engagement' | 'collaboration' | 'innovation'
  requirements: {
    type: 'time' | 'posts' | 'engagement' | 'feedback' | 'suggestions'
    value: number
    period?: 'month' | 'year' | 'all_time'
  }
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
}

export interface UserBadge {
  id?: string
  userId: string
  badgeId: string
  badgeName: string
  badgeIcon: string
  badgeColor: string
  earnedAt: Timestamp
  progress: number
  completed: boolean
}

export interface UserLevel {
  id?: string
  userId: string
  level: 'bronze' | 'silver' | 'gold' | 'diamond'
  levelName: string
  levelColor: string
  currentXP: number
  requiredXP: number
  progress: number
  benefits: string[]
  unlockedAt: Timestamp
}

export interface LoyaltyPoints {
  id?: string
  userId: string
  totalPoints: number
  availablePoints: number
  spentPoints: number
  lastEarned: Timestamp
  transactions: {
    type: 'earned' | 'spent' | 'bonus'
    amount: number
    reason: string
    timestamp: Timestamp
  }[]
}

export interface GamificationProfile {
  id?: string
  userId: string
  userEmail: string
  userName: string
  
  // Badges
  badges: UserBadge[]
  totalBadges: number
  
  // Level
  level: UserLevel
  
  // Points
  loyaltyPoints: LoyaltyPoints
  
  // Statistics
  stats: {
    totalPosts: number
    totalEngagement: number
    totalFeedback: number
    totalReferrals: number
    streakDays: number
    lastActivity: Timestamp
  }
  
  // Achievements
  achievements: {
    firstPost: boolean
    firstBadge: boolean
    levelUp: boolean
    referralMaster: boolean
    feedbackChampion: boolean
  }
  
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const BADGES: Badge[] = [
  {
    id: 'loyal-customer',
    name: 'Cliente Fiel',
    description: 'Usuário ativo há mais de 6 meses',
    icon: '🏆',
    color: 'from-yellow-500 to-orange-500',
    category: 'loyalty',
    requirements: { type: 'time', value: 6, period: 'month' },
    rarity: 'rare',
    points: 100
  },
  {
    id: 'active-creator',
    name: 'Criador Ativo',
    description: 'Criou 10+ posts em um mês',
    icon: '📝',
    color: 'from-blue-500 to-purple-500',
    category: 'activity',
    requirements: { type: 'posts', value: 10, period: 'month' },
    rarity: 'common',
    points: 50
  },
  {
    id: 'high-engagement',
    name: 'Engajamento Alto',
    description: 'Alta performance de engajamento',
    icon: '🔥',
    color: 'from-red-500 to-pink-500',
    category: 'engagement',
    requirements: { type: 'engagement', value: 80 },
    rarity: 'epic',
    points: 200
  },
  {
    id: 'collaborator',
    name: 'Colaborador',
    description: 'Feedback construtivo regular',
    icon: '🤝',
    color: 'from-green-500 to-teal-500',
    category: 'collaboration',
    requirements: { type: 'feedback', value: 5 },
    rarity: 'common',
    points: 75
  },
  {
    id: 'innovator',
    name: 'Inovador',
    description: 'Sugestões implementadas pela equipe',
    icon: '💡',
    color: 'from-purple-500 to-indigo-500',
    category: 'innovation',
    requirements: { type: 'suggestions', value: 3 },
    rarity: 'legendary',
    points: 500
  }
]

export const USER_LEVELS = {
  bronze: {
    name: 'Bronze',
    color: 'from-amber-600 to-orange-600',
    requiredXP: 0,
    benefits: [
      'Acesso básico ao sistema',
      'Suporte por email',
      'Templates básicos'
    ]
  },
  silver: {
    name: 'Prata',
    color: 'from-gray-400 to-gray-600',
    requiredXP: 500,
    benefits: [
      'Todos os benefícios Bronze',
      'Suporte prioritário',
      'Templates premium',
      'Análises básicas'
    ]
  },
  gold: {
    name: 'Ouro',
    color: 'from-yellow-500 to-yellow-600',
    requiredXP: 1500,
    benefits: [
      'Todos os benefícios Prata',
      'Suporte VIP',
      'Templates exclusivos',
      'Análises avançadas',
      'Desconto 10%'
    ]
  },
  diamond: {
    name: 'Diamante',
    color: 'from-blue-400 to-purple-500',
    requiredXP: 3000,
    benefits: [
      'Todos os benefícios Ouro',
      'Suporte 24/7',
      'Templates personalizados',
      'Análises premium',
      'Desconto 20%',
      'Acesso antecipado a recursos'
    ]
  }
}

export const GamificationService = {
  // ===== BADGES =====
  
  // Criar perfil de gamificação
  async createGamificationProfile(userId: string, userEmail: string, userName: string): Promise<string> {
    const profile: Omit<GamificationProfile, 'id'> = {
      userId,
      userEmail,
      userName,
      badges: [],
      totalBadges: 0,
      level: {
        userId,
        level: 'bronze',
        levelName: 'Bronze',
        levelColor: 'from-amber-600 to-orange-600',
        currentXP: 0,
        requiredXP: 0,
        progress: 0,
        benefits: USER_LEVELS.bronze.benefits,
        unlockedAt: Timestamp.now()
      },
      loyaltyPoints: {
        userId,
        totalPoints: 0,
        availablePoints: 0,
        spentPoints: 0,
        lastEarned: Timestamp.now(),
        transactions: []
      },
      stats: {
        totalPosts: 0,
        totalEngagement: 0,
        totalFeedback: 0,
        totalReferrals: 0,
        streakDays: 0,
        lastActivity: Timestamp.now()
      },
      achievements: {
        firstPost: false,
        firstBadge: false,
        levelUp: false,
        referralMaster: false,
        feedbackChampion: false
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }

    const docRef = await addDoc(collection(db, 'gamificationProfiles'), profile)
    console.log('Perfil de gamificação criado:', docRef.id)
    return docRef.id
  },

  // Buscar perfil de gamificação
  async getGamificationProfile(userId: string): Promise<GamificationProfile | null> {
    const q = query(
      collection(db, 'gamificationProfiles'),
      where('userId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null
    
    const doc = querySnapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data()
    } as GamificationProfile
  },

  // Adicionar pontos
  async addPoints(userId: string, points: number, reason: string): Promise<void> {
    const profile = await this.getGamificationProfile(userId)
    if (!profile) return

    const profileRef = doc(db, 'gamificationProfiles', profile.id!)
    
    // Adicionar pontos
    await updateDoc(profileRef, {
      'loyaltyPoints.totalPoints': increment(points),
      'loyaltyPoints.availablePoints': increment(points),
      'level.currentXP': increment(points),
      'stats.lastActivity': Timestamp.now(),
      updatedAt: Timestamp.now()
    })

    // Adicionar transação
    const transaction = {
      type: 'earned' as const,
      amount: points,
      reason,
      timestamp: Timestamp.now()
    }

    await updateDoc(profileRef, {
      'loyaltyPoints.transactions': [...profile.loyaltyPoints.transactions, transaction]
    })

    // Verificar badges e nível
    await this.checkBadges(userId)
    await this.checkLevelUp(userId)

    console.log(`Pontos adicionados: ${points} para ${userId}`)
  },

  // Gastar pontos
  async spendPoints(userId: string, points: number, reason: string): Promise<boolean> {
    const profile = await this.getGamificationProfile(userId)
    if (!profile || profile.loyaltyPoints.availablePoints < points) return false

    const profileRef = doc(db, 'gamificationProfiles', profile.id!)
    
    await updateDoc(profileRef, {
      'loyaltyPoints.availablePoints': increment(-points),
      'loyaltyPoints.spentPoints': increment(points),
      updatedAt: Timestamp.now()
    })

    // Adicionar transação
    const transaction = {
      type: 'spent' as const,
      amount: points,
      reason,
      timestamp: Timestamp.now()
    }

    await updateDoc(profileRef, {
      'loyaltyPoints.transactions': [...profile.loyaltyPoints.transactions, transaction]
    })

    console.log(`Pontos gastos: ${points} por ${userId}`)
    return true
  },

  // Verificar badges
  async checkBadges(userId: string): Promise<void> {
    const profile = await this.getGamificationProfile(userId)
    if (!profile) return

    const earnedBadges: UserBadge[] = []

    for (const badge of BADGES) {
      // Verificar se já tem o badge
      const hasBadge = profile.badges.some(b => b.badgeId === badge.id)
      if (hasBadge) continue

      let earned = false
      let progress = 0

      switch (badge.requirements.type) {
        case 'time':
          const monthsActive = this.calculateMonthsActive(profile.createdAt)
          progress = Math.min(monthsActive, badge.requirements.value)
          earned = monthsActive >= badge.requirements.value
          break

        case 'posts':
          const postsThisMonth = await this.getPostsThisMonth(userId)
          progress = Math.min(postsThisMonth, badge.requirements.value)
          earned = postsThisMonth >= badge.requirements.value
          break

        case 'engagement':
          const avgEngagement = await this.getAverageEngagement(userId)
          progress = Math.min(avgEngagement, badge.requirements.value)
          earned = avgEngagement >= badge.requirements.value
          break

        case 'feedback':
          const feedbackCount = profile.stats.totalFeedback
          progress = Math.min(feedbackCount, badge.requirements.value)
          earned = feedbackCount >= badge.requirements.value
          break

        case 'suggestions':
          const suggestionsCount = await this.getSuggestionsCount(userId)
          progress = Math.min(suggestionsCount, badge.requirements.value)
          earned = suggestionsCount >= badge.requirements.value
          break
      }

      if (earned) {
        earnedBadges.push({
          userId,
          badgeId: badge.id,
          badgeName: badge.name,
          badgeIcon: badge.icon,
          badgeColor: badge.color,
          earnedAt: Timestamp.now(),
          progress: 100,
          completed: true
        })

        // Adicionar pontos do badge
        await this.addPoints(userId, badge.points, `Badge: ${badge.name}`)
      }
    }

    // Atualizar perfil com novos badges
    if (earnedBadges.length > 0) {
      const profileRef = doc(db, 'gamificationProfiles', profile.id!)
      await updateDoc(profileRef, {
        badges: [...profile.badges, ...earnedBadges],
        totalBadges: profile.totalBadges + earnedBadges.length,
        'achievements.firstBadge': profile.totalBadges === 0,
        updatedAt: Timestamp.now()
      })

      console.log(`Novos badges conquistados: ${earnedBadges.length} para ${userId}`)
    }
  },

  // Verificar subida de nível
  async checkLevelUp(userId: string): Promise<void> {
    const profile = await this.getGamificationProfile(userId)
    if (!profile) return

    const currentLevel = profile.level.level
    const currentXP = profile.level.currentXP

    let newLevel: keyof typeof USER_LEVELS = currentLevel
    let levelUp = false

    if (currentXP >= USER_LEVELS.diamond.requiredXP && currentLevel !== 'diamond') {
      newLevel = 'diamond'
      levelUp = true
    } else if (currentXP >= USER_LEVELS.gold.requiredXP && currentLevel !== 'gold') {
      newLevel = 'gold'
      levelUp = true
    } else if (currentXP >= USER_LEVELS.silver.requiredXP && currentLevel !== 'silver') {
      newLevel = 'silver'
      levelUp = true
    }

    if (levelUp) {
      const profileRef = doc(db, 'gamificationProfiles', profile.id!)
      const newLevelData = USER_LEVELS[newLevel]
      
      await updateDoc(profileRef, {
        'level.level': newLevel,
        'level.levelName': newLevelData.name,
        'level.levelColor': newLevelData.color,
        'level.requiredXP': newLevelData.requiredXP,
        'level.progress': Math.min(100, (currentXP / newLevelData.requiredXP) * 100),
        'level.benefits': newLevelData.benefits,
        'level.unlockedAt': Timestamp.now(),
        'achievements.levelUp': true,
        updatedAt: Timestamp.now()
      })

      // Bônus por subir de nível
      const bonusPoints = newLevel === 'diamond' ? 1000 : newLevel === 'gold' ? 500 : 250
      await this.addPoints(userId, bonusPoints, `Subida de nível: ${newLevelData.name}`)

      console.log(`Level up! ${userId} agora é ${newLevelData.name}`)
    }
  },

  // Atualizar estatísticas
  async updateStats(userId: string, stats: Partial<GamificationProfile['stats']>): Promise<void> {
    const profile = await this.getGamificationProfile(userId)
    if (!profile) return

    const profileRef = doc(db, 'gamificationProfiles', profile.id!)
    await updateDoc(profileRef, {
      stats: { ...profile.stats, ...stats },
      updatedAt: Timestamp.now()
    })

    // Verificar badges após atualizar stats
    await this.checkBadges(userId)
  },

  // Buscar ranking de usuários
  async getUserRanking(limit: number = 10): Promise<GamificationProfile[]> {
    const q = query(
      collection(db, 'gamificationProfiles'),
      orderBy('level.currentXP', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const profiles = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GamificationProfile[]

    return profiles.slice(0, limit)
  },

  // ===== HELPER FUNCTIONS =====

  calculateMonthsActive(createdAt: Timestamp): number {
    const now = new Date()
    const created = createdAt.toDate()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
    return diffMonths
  },

  async getPostsThisMonth(userId: string): Promise<number> {
    // Implementar busca de posts do mês atual
    // Por enquanto, retornar valor simulado
    return Math.floor(Math.random() * 15)
  },

  async getAverageEngagement(userId: string): Promise<number> {
    // Implementar cálculo de engajamento médio
    // Por enquanto, retornar valor simulado
    return Math.floor(Math.random() * 100)
  },

  async getSuggestionsCount(userId: string): Promise<number> {
    // Implementar busca de sugestões implementadas
    // Por enquanto, retornar valor simulado
    return Math.floor(Math.random() * 5)
  }
}
