'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { GamificationService, GamificationProfile, BADGES, USER_LEVELS } from '@/lib/services/GamificationService'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GamificacaoPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<GamificationProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'badges' | 'ranking' | 'rewards'>('profile')

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      let userProfile = await GamificationService.getGamificationProfile(user.uid)
      
      if (!userProfile) {
        // Criar perfil de gamificação se não existir
        await GamificationService.createGamificationProfile(user.uid, user.email || '', user.displayName || user.email?.split('@')[0] || 'Usuário')
        userProfile = await GamificationService.getGamificationProfile(user.uid)
      }
      
      setProfile(userProfile)
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTestPoints = async () => {
    if (!user) return
    
    try {
      await GamificationService.addPoints(user.uid, 100, 'Teste de pontos')
      await loadProfile()
      alert('✅ 100 pontos adicionados!')
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error)
      alert('❌ Erro ao adicionar pontos')
    }
  }

  const spendPoints = async () => {
    if (!user || !profile) return
    
    const points = prompt('Quantos pontos deseja gastar?')
    if (points && parseInt(points) > 0) {
      try {
        const success = await GamificationService.spendPoints(user.uid, parseInt(points), 'Compra de benefício')
        if (success) {
          await loadProfile()
          alert('✅ Pontos gastos com sucesso!')
        } else {
          alert('❌ Pontos insuficientes!')
        }
      } catch (error) {
        console.error('Erro ao gastar pontos:', error)
        alert('❌ Erro ao gastar pontos')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Carregando Gamificação</h2>
          <p className="text-gray-600">Preparando seu perfil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao Carregar</h2>
          <p className="text-gray-600 mb-6">Não foi possível carregar seu perfil de gamificação.</p>
          <button
            onClick={loadProfile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button
                  onClick={() => router.back()}
                  className="mr-4 p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                >
                  <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                </button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    🎮 Gamificação
                  </h1>
                  <p className="text-gray-600 mt-1">Conquiste badges, suba de nível e ganhe recompensas!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${profile.level.levelColor} flex items-center justify-center text-3xl text-white font-bold`}>
                  {profile.level.levelName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profile.userName}</h2>
                  <p className={`text-lg font-semibold bg-gradient-to-r ${profile.level.levelColor} bg-clip-text text-transparent`}>
                    {profile.level.levelName}
                  </p>
                  <p className="text-gray-600">{profile.totalBadges} badges conquistados</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{profile.loyaltyPoints.totalPoints}</div>
                <div className="text-gray-600">Pontos Totais</div>
                <div className="text-lg font-semibold text-green-600">{profile.loyaltyPoints.availablePoints}</div>
                <div className="text-gray-600">Disponíveis</div>
              </div>
            </div>

            {/* XP Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progresso para o próximo nível</span>
                <span className="text-sm font-medium text-gray-700">{profile.level.currentXP} / {profile.level.requiredXP} XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`bg-gradient-to-r ${profile.level.levelColor} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${profile.level.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-4">
              <button
                onClick={addTestPoints}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ➕ Adicionar Pontos (Teste)
              </button>
              <button
                onClick={spendPoints}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                💰 Gastar Pontos
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
            <div className="flex border-b border-gray-200">
              {[
                { id: 'profile', label: '👤 Perfil', count: 0 },
                { id: 'badges', label: '🏆 Badges', count: profile.totalBadges },
                { id: 'ranking', label: '📊 Ranking', count: 0 },
                { id: 'rewards', label: '🎁 Recompensas', count: 0 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Estatísticas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{profile.stats.totalPosts}</div>
                        <div className="text-sm text-gray-600">Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{profile.stats.totalEngagement}</div>
                        <div className="text-sm text-gray-600">Engajamento</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{profile.stats.totalFeedback}</div>
                        <div className="text-sm text-gray-600">Feedback</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{profile.stats.streakDays}</div>
                        <div className="text-sm text-gray-600">Sequência</div>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">🎁 Benefícios do Nível {profile.level.levelName}</h3>
                    <div className="space-y-2">
                      {profile.level.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-green-500">✓</span>
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">🏅 Conquistas</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(profile.achievements).map(([key, achieved]) => (
                        <div key={key} className={`p-3 rounded-lg border-2 ${achieved ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                          <div className="flex items-center space-x-2">
                            <span className={achieved ? 'text-green-500' : 'text-gray-400'}>
                              {achieved ? '✓' : '○'}
                            </span>
                            <span className={`text-sm font-medium ${achieved ? 'text-green-800' : 'text-gray-600'}`}>
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Badges Tab */}
              {activeTab === 'badges' && (
                <div className="space-y-6">
                  {/* Earned Badges */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Badges Conquistados</h3>
                    {profile.badges.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">🏆</div>
                        <p className="text-gray-600">Nenhum badge conquistado ainda</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.badges.map((badge, index) => (
                          <div key={index} className={`p-4 rounded-xl border-2 bg-gradient-to-r ${badge.badgeColor} text-white`}>
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{badge.badgeIcon}</span>
                              <div>
                                <h4 className="font-bold">{badge.badgeName}</h4>
                                <p className="text-sm opacity-90">Conquistado em {badge.earnedAt?.toDate().toLocaleDateString('pt-BR')}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Available Badges */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Badges Disponíveis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {BADGES.map((badge) => {
                        const userBadge = profile.badges.find(b => b.badgeId === badge.id)
                        return (
                          <div key={badge.id} className={`p-4 rounded-xl border-2 ${userBadge ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{badge.icon}</span>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900">{badge.name}</h4>
                                <p className="text-sm text-gray-600">{badge.description}</p>
                                <div className="mt-2">
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>{badge.requirements.value} {badge.requirements.type}</span>
                                    <span>{badge.points} pontos</span>
                                  </div>
                                  {userBadge && (
                                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Ranking Tab */}
              {activeTab === 'ranking' && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Ranking Global</h3>
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🏆</div>
                    <p className="text-gray-600">Ranking em desenvolvimento</p>
                    <p className="text-sm text-gray-500">Em breve você poderá ver sua posição no ranking!</p>
                  </div>
                </div>
              )}

              {/* Rewards Tab */}
              {activeTab === 'rewards' && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🎁 Recompensas</h3>
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🎁</div>
                    <p className="text-gray-600">Sistema de recompensas em desenvolvimento</p>
                    <p className="text-sm text-gray-500">Em breve você poderá trocar pontos por benefícios!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Level Progress */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Progresso</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Nível Atual</span>
                      <span>{profile.level.levelName}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${profile.level.levelColor} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${profile.level.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>XP Atual:</span>
                      <span className="font-medium">{profile.level.currentXP}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Próximo Nível:</span>
                      <span className="font-medium">{profile.level.requiredXP}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Faltam:</span>
                      <span className="font-medium text-blue-600">{profile.level.requiredXP - profile.level.currentXP} XP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Points Balance */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">💰 Pontos</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium text-gray-900">{profile.loyaltyPoints.totalPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Disponíveis:</span>
                    <span className="font-medium text-green-600">{profile.loyaltyPoints.availablePoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gastos:</span>
                    <span className="font-medium text-gray-900">{profile.loyaltyPoints.spentPoints}</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-green-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Dicas</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Crie conteúdo regularmente para ganhar pontos</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Dê feedback construtivo para ganhar badges</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Indique amigos para ganhar pontos extras</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Suba de nível para desbloquear benefícios</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
