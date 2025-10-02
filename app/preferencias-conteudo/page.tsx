'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { ContentPreferencesService, ContentPreferences, ContentStylePreferences, PlatformPreferences, InterestThemes } from '@/lib/services/ContentPreferencesService'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PreferenciasConteudoPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [preferences, setPreferences] = useState<ContentPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    if (user) {
      loadPreferences()
    }
  }, [user])

  const loadPreferences = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      let userPreferences = await ContentPreferencesService.getUserPreferences(user.uid)
      
      if (!userPreferences) {
        // Criar preferências iniciais se não existirem
        await ContentPreferencesService.createInitialPreferences(user.uid, user.email || '')
        userPreferences = await ContentPreferencesService.getUserPreferences(user.uid)
      }
      
      setPreferences(userPreferences)
    } catch (error) {
      console.error('Erro ao carregar preferências:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async (updates: Partial<ContentPreferences>) => {
    if (!user || !preferences) return
    
    try {
      setSaving(true)
      await ContentPreferencesService.updatePreferences(user.uid, updates)
      setPreferences({ ...preferences, ...updates })
      alert('✅ Preferências salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar preferências:', error)
      alert('❌ Erro ao salvar preferências')
    } finally {
      setSaving(false)
    }
  }

  const updateContentStyle = async (contentStyle: ContentStylePreferences) => {
    await savePreferences({ contentStyle })
  }

  const updatePlatformPreferences = async (platformPreferences: PlatformPreferences[]) => {
    await savePreferences({ platformPreferences })
  }

  const updateInterestThemes = async (interestThemes: InterestThemes) => {
    await savePreferences({ interestThemes })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Carregando Preferências</h2>
          <p className="text-gray-600">Configurando suas preferências de conteúdo...</p>
        </div>
      </div>
    )
  }

  if (!preferences) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao Carregar</h2>
          <p className="text-gray-600 mb-6">Não foi possível carregar suas preferências.</p>
          <button
            onClick={loadPreferences}
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
                    Preferências de Conteúdo
                  </h1>
                  <p className="text-gray-600 mt-1">Personalize como seu conteúdo será criado</p>
                </div>
              </div>
              
              {/* Progress Indicator */}
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500 font-medium">
                  Etapa {currentStep} de 3
                </div>
                <div className="w-40 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Formulário Principal */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                
                {/* Step 1: Estilo de Conteúdo */}
                {currentStep === 1 && (
                  <ContentStyleStep 
                    preferences={preferences}
                    onUpdate={updateContentStyle}
                    onNext={() => setCurrentStep(2)}
                    saving={saving}
                  />
                )}

                {/* Step 2: Plataformas Prioritárias */}
                {currentStep === 2 && (
                  <PlatformPreferencesStep 
                    preferences={preferences}
                    onUpdate={updatePlatformPreferences}
                    onNext={() => setCurrentStep(3)}
                    onBack={() => setCurrentStep(1)}
                    saving={saving}
                  />
                )}

                {/* Step 3: Temas de Interesse */}
                {currentStep === 3 && (
                  <InterestThemesStep 
                    preferences={preferences}
                    onUpdate={updateInterestThemes}
                    onBack={() => setCurrentStep(2)}
                    saving={saving}
                  />
                )}
              </div>
            </div>

            {/* Sidebar com Informações */}
            <div className="space-y-6">
              
              {/* Resumo das Preferências */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Resumo</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estilo:</span>
                    <span className="font-medium text-gray-900">{preferences.contentStyle.templatePreference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frequência:</span>
                    <span className="font-medium text-gray-900">{preferences.contentStyle.postingFrequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium text-gray-900">{preferences.contentStyle.contentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plataformas:</span>
                    <span className="font-medium text-gray-900">{preferences.platformPreferences.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tópicos:</span>
                    <span className="font-medium text-gray-900">{preferences.interestThemes.topicsToCover.length}</span>
                  </div>
                </div>
              </div>

              {/* Dicas */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-green-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Dicas</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Seja específico sobre seus interesses</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Configure horários ideais para cada plataforma</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Defina o tom da sua marca</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Revise e atualize regularmente</span>
                  </div>
                </div>
              </div>

              {/* Progresso */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Progresso</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {step === 1 && 'Estilo de Conteúdo'}
                        {step === 2 && 'Plataformas'}
                        {step === 3 && 'Temas de Interesse'}
                      </span>
                      <span className={`text-sm ${currentStep >= step ? 'text-green-500' : 'text-gray-400'}`}>
                        {currentStep >= step ? '✓' : '○'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

// Componente para Step 1: Estilo de Conteúdo
const ContentStyleStep: React.FC<{
  preferences: ContentPreferences
  onUpdate: (contentStyle: ContentStylePreferences) => void
  onNext: () => void
  saving: boolean
}> = ({ preferences, onUpdate, onNext, saving }) => {
  const [formData, setFormData] = useState(preferences.contentStyle)

  const handleSave = () => {
    onUpdate(formData)
    onNext()
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🎨 Estilo de Conteúdo</h2>
        <p className="text-gray-600">Configure como você quer que seu conteúdo seja criado</p>
      </div>

      <div className="space-y-8">
        {/* Preferência por Templates */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            📋 Preferência por Templates
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'visual', label: 'Visual', desc: 'Foco em imagens e design', icon: '🖼️' },
              { id: 'text', label: 'Texto', desc: 'Conteúdo escrito detalhado', icon: '📝' },
              { id: 'mixed', label: 'Misto', desc: 'Equilíbrio entre texto e visual', icon: '🎭' }
            ].map((option) => (
              <div
                key={option.id}
                onClick={() => setFormData({...formData, templatePreference: option.id as any})}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  formData.templatePreference === option.id
                    ? 'border-blue-400 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <h3 className="font-semibold text-gray-900">{option.label}</h3>
                <p className="text-sm text-gray-600">{option.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Frequência de Postagem */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            📅 Frequência de Postagem Desejada
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'daily', label: 'Diária', desc: 'Todos os dias' },
              { id: 'weekly', label: 'Semanal', desc: '1x por semana' },
              { id: 'biweekly', label: 'Quinzenal', desc: '2x por mês' },
              { id: 'monthly', label: 'Mensal', desc: '1x por mês' }
            ].map((option) => (
              <div
                key={option.id}
                onClick={() => setFormData({...formData, postingFrequency: option.id as any})}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  formData.postingFrequency === option.id
                    ? 'border-blue-400 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900 text-sm">{option.label}</h3>
                <p className="text-xs text-gray-600">{option.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Horários Preferidos */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            ⏰ Horários Preferidos para Receber Conteúdo
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'
            ].map((hour) => (
              <button
                key={hour}
                onClick={() => {
                  const newHours = formData.preferredHours.includes(hour)
                    ? formData.preferredHours.filter(h => h !== hour)
                    : [...formData.preferredHours, hour]
                  setFormData({...formData, preferredHours: newHours})
                }}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  formData.preferredHours.includes(hour)
                    ? 'border-blue-400 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {hour}
              </button>
            ))}
          </div>
        </div>

        {/* Tipo de Conteúdo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            🎯 Tipo de Conteúdo Favorito
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'educational', label: 'Educativo', desc: 'Compartilhar conhecimento', icon: '📚' },
              { id: 'promotional', label: 'Promocional', desc: 'Promover produtos/serviços', icon: '💰' },
              { id: 'engaging', label: 'Engajante', desc: 'Gerar interação', icon: '💬' },
              { id: 'mixed', label: 'Misto', desc: 'Combinação de tipos', icon: '🎭' }
            ].map((option) => (
              <div
                key={option.id}
                onClick={() => setFormData({...formData, contentType: option.id as any})}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  formData.contentType === option.id
                    ? 'border-blue-400 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <h3 className="font-semibold text-gray-900">{option.label}</h3>
                <p className="text-sm text-gray-600">{option.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nível de Formalidade */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            🎭 Nível de Formalidade
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'casual', label: 'Casual', desc: 'Descontraído' },
              { id: 'professional', label: 'Profissional', desc: 'Equilibrado' },
              { id: 'formal', label: 'Formal', desc: 'Sério' },
              { id: 'mixed', label: 'Misto', desc: 'Variado' }
            ].map((option) => (
              <div
                key={option.id}
                onClick={() => setFormData({...formData, formalityLevel: option.id as any})}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  formData.formalityLevel === option.id
                    ? 'border-blue-400 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900 text-sm">{option.label}</h3>
                <p className="text-xs text-gray-600">{option.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
        >
          {saving ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Salvando...
            </div>
          ) : (
            'Próximo →'
          )}
        </button>
      </div>
    </div>
  )
}

// Componente para Step 2: Plataformas Prioritárias
const PlatformPreferencesStep: React.FC<{
  preferences: ContentPreferences
  onUpdate: (platformPreferences: PlatformPreferences[]) => void
  onNext: () => void
  onBack: () => void
  saving: boolean
}> = ({ preferences, onUpdate, onNext, onBack, saving }) => {
  const [platforms, setPlatforms] = useState(preferences.platformPreferences)

  const handleSave = () => {
    onUpdate(platforms)
    onNext()
  }

  const updatePlatformPriority = (platform: string, priority: number) => {
    setPlatforms(platforms.map(p => 
      p.platform === platform ? { ...p, priority } : p
    ))
  }

  const updatePlatformSettings = (platform: string, settings: any) => {
    setPlatforms(platforms.map(p => 
      p.platform === platform ? { ...p, specificSettings: { ...p.specificSettings, ...settings } } : p
    ))
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📱 Plataformas Prioritárias</h2>
        <p className="text-gray-600">Configure suas redes sociais e suas especificidades</p>
      </div>

      <div className="space-y-6">
        {platforms.map((platform, index) => (
          <div key={platform.platform} className="bg-gray-50 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{platform.platform}</h3>
              <div className="flex items-center space-x-3">
                <label className="text-sm text-gray-600">Prioridade:</label>
                <select
                  value={platform.priority}
                  onChange={(e) => updatePlatformPriority(platform.platform, parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Formato Preferido
                </label>
                <select
                  value={platform.specificSettings.format}
                  onChange={(e) => updatePlatformSettings(platform.platform, { format: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="stories">Stories</option>
                  <option value="posts">Posts</option>
                  <option value="reels">Reels</option>
                  <option value="mixed">Misto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Horários Ideais
                </label>
                <div className="flex space-x-2">
                  {['08:00', '12:00', '18:00'].map(hour => (
                    <button
                      key={hour}
                      onClick={() => {
                        const newHours = platform.specificSettings.idealHours.includes(hour)
                          ? platform.specificSettings.idealHours.filter(h => h !== hour)
                          : [...platform.specificSettings.idealHours, hour]
                        updatePlatformSettings(platform.platform, { idealHours: newHours })
                      }}
                      className={`px-3 py-1 rounded text-sm ${
                        platform.specificSettings.idealHours.includes(hour)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estilo de Hashtags
                </label>
                <select
                  value={platform.specificSettings.hashtagStyle}
                  onChange={(e) => updatePlatformSettings(platform.platform, { hashtagStyle: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="minimal">Mínimo (1-3)</option>
                  <option value="moderate">Moderado (4-8)</option>
                  <option value="extensive">Extenso (9+)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Call-to-Action
                </label>
                <select
                  value={platform.specificSettings.callToActionStyle}
                  onChange={(e) => updatePlatformSettings(platform.platform, { callToActionStyle: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="subtle">Sutil</option>
                  <option value="direct">Direto</option>
                  <option value="aggressive">Agressivo</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estratégia Específica
              </label>
              <textarea
                value={platform.specificSettings.strategy}
                onChange={(e) => updatePlatformSettings(platform.platform, { strategy: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg h-20 resize-none"
                placeholder="Descreva sua estratégia para esta plataforma..."
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button 
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all duration-200"
        >
          ← Anterior
        </button>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
        >
          {saving ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Salvando...
            </div>
          ) : (
            'Próximo →'
          )}
        </button>
      </div>
    </div>
  )
}

// Componente para Step 3: Temas de Interesse
const InterestThemesStep: React.FC<{
  preferences: ContentPreferences
  onUpdate: (interestThemes: InterestThemes) => void
  onBack: () => void
  saving: boolean
}> = ({ preferences, onUpdate, onBack, saving }) => {
  const [themes, setThemes] = useState(preferences.interestThemes)
  const [newTopic, setNewTopic] = useState('')
  const [newAvoidTopic, setNewAvoidTopic] = useState('')
  const [newInfluencer, setNewInfluencer] = useState('')

  const handleSave = () => {
    onUpdate(themes)
    alert('✅ Preferências salvas com sucesso!')
  }

  const addTopic = () => {
    if (newTopic.trim()) {
      setThemes({
        ...themes,
        topicsToCover: [...themes.topicsToCover, newTopic.trim()]
      })
      setNewTopic('')
    }
  }

  const removeTopic = (topic: string) => {
    setThemes({
      ...themes,
      topicsToCover: themes.topicsToCover.filter(t => t !== topic)
    })
  }

  const addAvoidTopic = () => {
    if (newAvoidTopic.trim()) {
      setThemes({
        ...themes,
        topicsToAvoid: [...themes.topicsToAvoid, newAvoidTopic.trim()]
      })
      setNewAvoidTopic('')
    }
  }

  const removeAvoidTopic = (topic: string) => {
    setThemes({
      ...themes,
      topicsToAvoid: themes.topicsToAvoid.filter(t => t !== topic)
    })
  }

  const addInfluencer = () => {
    if (newInfluencer.trim()) {
      setThemes({
        ...themes,
        referenceInfluencers: [...themes.referenceInfluencers, newInfluencer.trim()]
      })
      setNewInfluencer('')
    }
  }

  const removeInfluencer = (influencer: string) => {
    setThemes({
      ...themes,
      referenceInfluencers: themes.referenceInfluencers.filter(i => i !== influencer)
    })
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🎯 Temas de Interesse</h2>
        <p className="text-gray-600">Defina os tópicos que você quer abordar e evitar</p>
      </div>

      <div className="space-y-8">
        {/* Tópicos para Cobrir */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            📝 Tópicos que Você Quer Abordar
          </label>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Ex: Inteligência Artificial, Marketing Digital..."
              className="flex-1 p-3 border border-gray-300 rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && addTopic()}
            />
            <button
              onClick={addTopic}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
            >
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {themes.topicsToCover.map((topic, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
              >
                <span>{topic}</span>
                <button
                  onClick={() => removeTopic(topic)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Tópicos para Evitar */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            🚫 Assuntos a Evitar
          </label>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newAvoidTopic}
              onChange={(e) => setNewAvoidTopic(e.target.value)}
              placeholder="Ex: Política, Religião..."
              className="flex-1 p-3 border border-gray-300 rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && addAvoidTopic()}
            />
            <button
              onClick={addAvoidTopic}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors"
            >
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {themes.topicsToAvoid.map((topic, index) => (
              <span
                key={index}
                className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
              >
                <span>{topic}</span>
                <button
                  onClick={() => removeAvoidTopic(topic)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Influenciadores de Referência */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            👥 Influenciadores de Referência
          </label>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newInfluencer}
              onChange={(e) => setNewInfluencer(e.target.value)}
              placeholder="Ex: @usuario, Nome do Influenciador..."
              className="flex-1 p-3 border border-gray-300 rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && addInfluencer()}
            />
            <button
              onClick={addInfluencer}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors"
            >
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {themes.referenceInfluencers.map((influencer, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
              >
                <span>{influencer}</span>
                <button
                  onClick={() => removeInfluencer(influencer)}
                  className="text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Voz da Marca */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🎤 Voz da Marca
          </label>
          <textarea
            value={themes.brandVoice}
            onChange={(e) => setThemes({...themes, brandVoice: e.target.value})}
            className="w-full p-4 border border-gray-300 rounded-xl h-24 resize-none"
            placeholder="Descreva como sua marca se comunica..."
          />
        </div>

        {/* Emoções Alvo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            💭 Emoções que Você Quer Despertar
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              'confiança', 'curiosidade', 'alegria', 'motivação',
              'tranquilidade', 'inspiração', 'confiança', 'satisfação'
            ].map((emotion) => (
              <button
                key={emotion}
                onClick={() => {
                  const newEmotions = themes.targetEmotions.includes(emotion)
                    ? themes.targetEmotions.filter(e => e !== emotion)
                    : [...themes.targetEmotions, emotion]
                  setThemes({...themes, targetEmotions: newEmotions})
                }}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  themes.targetEmotions.includes(emotion)
                    ? 'border-purple-400 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button 
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all duration-200"
        >
          ← Anterior
        </button>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
        >
          {saving ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Salvando...
            </div>
          ) : (
            '✅ Finalizar Configuração'
          )}
        </button>
      </div>
    </div>
  )
}
