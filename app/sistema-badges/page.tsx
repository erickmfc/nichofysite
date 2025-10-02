'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  criteria: string
  pointsReward: number
  category: 'content' | 'engagement' | 'growth' | 'loyalty' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface UserBadge {
  id: string
  userId: string
  badgeId: string
  earnedAt: Timestamp
  pointsEarned: number
  metadata?: any
}

interface UserLevel {
  level: number
  name: string
  xpRequired: number
  benefits: string[]
  color: string
}

interface UserGamificationProfile {
  userId: string
  xp: number
  level: number
  badges: string[]
  loyaltyPoints: number
  totalContentCreated: number
  totalEngagement: number
  streakDays: number
  lastActivityAt: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Badges pré-definidos
const PREDEFINED_BADGES: Badge[] = [
  {
    id: 'first_content',
    name: 'Primeiro Conteúdo',
    description: 'Criou seu primeiro conteúdo',
    icon: '🎯',
    color: 'from-green-500 to-emerald-500',
    criteria: 'Criar 1 conteúdo',
    pointsReward: 10,
    category: 'content',
    rarity: 'common'
  },
  {
    id: 'content_creator',
    name: 'Criador de Conteúdo',
    description: 'Criou 10 conteúdos',
    icon: '✍️',
    color: 'from-blue-500 to-indigo-500',
    criteria: 'Criar 10 conteúdos',
    pointsReward: 50,
    category: 'content',
    rarity: 'rare'
  },
  {
    id: 'content_master',
    name: 'Mestre do Conteúdo',
    description: 'Criou 50 conteúdos',
    icon: '👑',
    color: 'from-purple-500 to-pink-500',
    criteria: 'Criar 50 conteúdos',
    pointsReward: 200,
    category: 'content',
    rarity: 'epic'
  },
  {
    id: 'high_engagement',
    name: 'Alto Engajamento',
    description: 'Conteúdo com mais de 10% de engajamento',
    icon: '📈',
    color: 'from-yellow-500 to-orange-500',
    criteria: 'Engajamento > 10%',
    pointsReward: 75,
    category: 'engagement',
    rarity: 'rare'
  },
  {
    id: 'viral_content',
    name: 'Conteúdo Viral',
    description: 'Conteúdo com mais de 1000 interações',
    icon: '🔥',
    color: 'from-red-500 to-pink-500',
    criteria: '1000+ interações',
    pointsReward: 150,
    category: 'engagement',
    rarity: 'epic'
  },
  {
    id: 'loyal_customer',
    name: 'Cliente Fiel',
    description: 'Usuário ativo por 30 dias',
    icon: '🏅',
    color: 'from-gold-500 to-yellow-500',
    criteria: '30 dias ativo',
    pointsReward: 100,
    category: 'loyalty',
    rarity: 'rare'
  },
  {
    id: 'premium_member',
    name: 'Membro Premium',
    description: 'Assinatura premium ativa',
    icon: '⭐',
    color: 'from-purple-500 to-indigo-500',
    criteria: 'Conta premium',
    pointsReward: 200,
    category: 'special',
    rarity: 'epic'
  },
  {
    id: 'early_adopter',
    name: 'Primeiro Usuário',
    description: 'Um dos primeiros usuários da plataforma',
    icon: '🚀',
    color: 'from-cyan-500 to-blue-500',
    criteria: 'Usuário beta',
    pointsReward: 500,
    category: 'special',
    rarity: 'legendary'
  }
]

// Níveis pré-definidos
const PREDEFINED_LEVELS: UserLevel[] = [
  {
    level: 0,
    name: 'Iniciante',
    xpRequired: 0,
    benefits: ['Acesso básico', 'Suporte padrão'],
    color: 'from-gray-500 to-gray-600'
  },
  {
    level: 1,
    name: 'Criador',
    xpRequired: 100,
    benefits: ['Templates básicos', 'Analytics simples'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    level: 2,
    name: 'Especialista',
    xpRequired: 500,
    benefits: ['Templates premium', 'Analytics avançados'],
    color: 'from-blue-500 to-indigo-500'
  },
  {
    level: 3,
    name: 'Mestre',
    xpRequired: 1500,
    benefits: ['Templates exclusivos', 'Suporte prioritário'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    level: 4,
    name: 'Lenda',
    xpRequired: 3000,
    benefits: ['Acesso VIP', 'Recursos exclusivos'],
    color: 'from-yellow-500 to-orange-500'
  }
]

export default function SistemaBadges() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserGamificationProfile | null>(null)
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showBadgeAnimation, setShowBadgeAnimation] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadGamificationProfile()
    }
  }, [user])

  const loadGamificationProfile = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      
      // Carregar perfil de gamificação
      const profileRef = doc(db, 'gamificationProfiles', user.uid)
      const profileSnap = await getDoc(profileRef)
      
      if (profileSnap.exists()) {
        const userProfile = profileSnap.data() as UserGamificationProfile
        setProfile(userProfile)
      } else {
        // Criar perfil inicial
        const newProfile: UserGamificationProfile = {
          userId: user.uid,
          xp: 0,
          level: 0,
          badges: [],
          loyaltyPoints: 0,
          totalContentCreated: 0,
          totalEngagement: 0,
          streakDays: 0,
          lastActivityAt: Timestamp.now(),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        }
        
        await updateDoc(profileRef, newProfile)
        setProfile(newProfile)
      }
      
      // Carregar badges do usuário
      const badgesQuery = query(
        collection(db, 'userBadges'),
        where('userId', '==', user.uid),
        orderBy('earnedAt', 'desc')
      )
      
      const badgesSnapshot = await getDocs(badgesQuery)
      const badgesData = badgesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserBadge[]
      
      setUserBadges(badgesData)
      
    } catch (error) {
      console.error('Erro ao carregar perfil de gamificação:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const awardBadge = async (badgeId: string) => {
    if (!user || !profile) return
    
    try {
      const badge = PREDEFINED_BADGES.find(b => b.id === badgeId)
      if (!badge) return
      
      // Verificar se já possui o badge
      if (profile.badges.includes(badgeId)) return
      
      // Adicionar badge ao perfil
      const updatedBadges = [...profile.badges, badgeId]
      const updatedXP = profile.xp + badge.pointsReward
      const updatedLoyaltyPoints = profile.loyaltyPoints + badge.pointsReward
      
      // Calcular novo nível
      let newLevel = profile.level
      for (let i = PREDEFINED_LEVELS.length - 1; i >= 0; i--) {
        if (updatedXP >= PREDEFINED_LEVELS[i].xpRequired) {
          newLevel = PREDEFINED_LEVELS[i].level
          break
        }
      }
      
      // Atualizar perfil
      const updatedProfile: UserGamificationProfile = {
        ...profile,
        badges: updatedBadges,
        xp: updatedXP,
        level: newLevel,
        loyaltyPoints: updatedLoyaltyPoints,
        updatedAt: Timestamp.now()
      }
      
      const profileRef = doc(db, 'gamificationProfiles', user.uid)
      await updateDoc(profileRef, updatedProfile)
      
      // Registrar badge
      const userBadge: Omit<UserBadge, 'id'> = {
        userId: user.uid,
        badgeId: badgeId,
        earnedAt: Timestamp.now(),
        pointsEarned: badge.pointsReward,
        metadata: { badge }
      }
      
      await addDoc(collection(db, 'userBadges'), userBadge)
      
      setProfile(updatedProfile)
      setShowBadgeAnimation(badgeId)
      
      // Esconder animação após 3 segundos
      setTimeout(() => {
        setShowBadgeAnimation(null)
      }, 3000)
      
      console.log('🏆 Badge concedido:', badge.name)
      
    } catch (error) {
      console.error('Erro ao conceder badge:', error)
    }
  }

  const getBadgeDetails = (badgeId: string): Badge | undefined => {
    return PREDEFINED_BADGES.find(b => b.id === badgeId)
  }

  const getCurrentLevel = (): UserLevel => {
    if (!profile) return PREDEFINED_LEVELS[0]
    return PREDEFINED_LEVELS.find(l => l.level === profile.level) || PREDEFINED_LEVELS[0]
  }

  const getNextLevel = (): UserLevel | null => {
    if (!profile) return null
    const currentLevelIndex = PREDEFINED_LEVELS.findIndex(l => l.level === profile.level)
    return currentLevelIndex < PREDEFINED_LEVELS.length - 1 ? PREDEFINED_LEVELS[currentLevelIndex + 1] : null
  }

  const getProgressToNextLevel = (): number => {
    if (!profile) return 0
    const currentLevel = getCurrentLevel()
    const nextLevel = getNextLevel()
    
    if (!nextLevel) return 100
    
    const xpForCurrentLevel = currentLevel.xpRequired
    const xpNeededForNextLevel = nextLevel.xpRequired - xpForCurrentLevel
    const xpEarnedInCurrentLevel = profile.xp - xpForCurrentLevel
    
    return (xpEarnedInCurrentLevel / xpNeededForNextLevel) * 100
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50'
      case 'rare': return 'border-blue-300 bg-blue-50'
      case 'epic': return 'border-purple-300 bg-purple-50'
      case 'legendary': return 'border-yellow-300 bg-yellow-50'
      default: return 'border-gray-300 bg-gray-50'
    }
  }

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Comum'
      case 'rare': return 'Raro'
      case 'epic': return 'Épico'
      case 'legendary': return 'Lendário'
      default: return 'Comum'
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Carregando Gamificação</h2>
            <p className="text-gray-600">Preparando seus badges e conquistas...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar perfil</h2>
            <p className="text-gray-600">Tente novamente mais tarde</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const currentLevel = getCurrentLevel()
  const nextLevel = getNextLevel()
  const progressToNextLevel = getProgressToNextLevel()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        {/* Badge Animation */}
        {showBadgeAnimation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 text-center animate-bounce">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Badge Conquistado!</h2>
              <p className="text-lg text-gray-600">{getBadgeDetails(showBadgeAnimation)?.name}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  🏆 Sistema de Badges
                </h1>
                <p className="text-gray-600 mt-1">Conquiste badges e suba de nível</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  Nível {profile.level}
                </div>
                <div className="text-sm text-gray-600">{currentLevel.name}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center">
              <div className="text-5xl mb-3">⭐</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">XP Total</h3>
              <p className="text-4xl font-bold text-purple-600">{profile.xp}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center">
              <div className="text-5xl mb-3">🏆</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Badges</h3>
              <p className="text-4xl font-bold text-pink-600">{profile.badges.length}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center">
              <div className="text-5xl mb-3">💰</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Pontos de Fidelidade</h3>
              <p className="text-4xl font-bold text-green-600">{profile.loyaltyPoints}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center">
              <div className="text-5xl mb-3">📝</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Conteúdos Criados</h3>
              <p className="text-4xl font-bold text-blue-600">{profile.totalContentCreated}</p>
            </div>
          </div>

          {/* Level Progress */}
          {nextLevel && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Progresso para o Nível {nextLevel.level} ({nextLevel.name})
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className={`bg-gradient-to-r ${nextLevel.color} h-4 rounded-full transition-all duration-500`}
                  style={{ width: `${progressToNextLevel}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                Faltam {nextLevel.xpRequired - profile.xp} XP para o próximo nível
              </p>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800">Benefícios do Próximo Nível:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {nextLevel.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Earned Badges */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">🏆 Badges Conquistados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.badges.map((badgeId) => {
                const badge = getBadgeDetails(badgeId)
                if (!badge) return null
                
                return (
                  <div key={badgeId} className={`p-4 rounded-xl border-2 ${getRarityColor(badge.rarity)} transition-all duration-200 hover:shadow-lg`}>
                    <div className="flex items-center space-x-3">
                      <div className="text-4xl">{badge.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{badge.name}</h4>
                        <p className="text-sm text-gray-600">{badge.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(badge.rarity)}`}>
                            {getRarityText(badge.rarity)}
                          </span>
                          <span className="text-xs text-green-600 font-medium">
                            +{badge.pointsReward} XP
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Available Badges */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">🎯 Badges Disponíveis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PREDEFINED_BADGES.map((badge) => {
                const hasBadge = profile.badges.includes(badge.id)
                
                return (
                  <div 
                    key={badge.id} 
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      hasBadge 
                        ? 'border-green-400 bg-green-50 shadow-md' 
                        : 'border-gray-200 opacity-60 hover:opacity-80'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`text-4xl ${hasBadge ? '' : 'grayscale'}`}>
                        {badge.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{badge.name}</h4>
                        <p className="text-sm text-gray-600">{badge.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(badge.rarity)}`}>
                            {getRarityText(badge.rarity)}
                          </span>
                          <span className="text-xs text-blue-600 font-medium">
                            +{badge.pointsReward} XP
                          </span>
                        </div>
                        {hasBadge && (
                          <span className="text-xs text-green-700 mt-1 block">✅ Conquistado!</span>
                        )}
                        {!hasBadge && (
                          <p className="text-xs text-gray-500 mt-1">Critério: {badge.criteria}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Test Badge Award */}
          <div className="mt-8 text-center">
            <button
              onClick={() => awardBadge('first_content')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              🏆 Testar Conquista de Badge
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
