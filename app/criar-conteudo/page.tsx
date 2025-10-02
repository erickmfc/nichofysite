'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase'
import { collection, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore'
import { ContentPreferencesService, ContentPreferences } from '@/lib/services/ContentPreferencesService'

export default function CriarConteudoPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [userPreferences, setUserPreferences] = useState<ContentPreferences | null>(null)
  const [formData, setFormData] = useState({
    // Informações básicas
    tipo: 'Post para Instagram',
    nicho: '',
    topico: '',
    descricao: '',
    
    // Detalhes avançados
    objetivo: 'educar',
    tom: 'profissional',
    publico: '',
    palavrasChave: '',
    
    // Especificações técnicas
    tamanho: 'padrao',
    incluirHashtags: true,
    incluirCallToAction: true,
    urgencia: 'normal',
    
    // Referências
    referencias: '',
    observacoes: ''
  })

  const objetivos = [
    { id: 'educar', label: 'Educar', icon: '📚', desc: 'Compartilhar conhecimento' },
    { id: 'engajar', label: 'Engajar', icon: '💬', desc: 'Gerar interação' },
    { id: 'vender', label: 'Vender', icon: '💰', desc: 'Promover produto/serviço' },
    { id: 'divulgar', label: 'Divulgar', icon: '📢', desc: 'Divulgar marca' },
    { id: 'motivar', label: 'Motivar', icon: '💪', desc: 'Inspirar ação' }
  ]

  const tons = [
    { id: 'profissional', label: 'Profissional', desc: 'Formal e técnico' },
    { id: 'casual', label: 'Casual', desc: 'Descontraído' },
    { id: 'autoritario', label: 'Autoritário', desc: 'Confiante e direto' },
    { id: 'amigavel', label: 'Amigável', desc: 'Acolhedor' }
  ]

  // Carregar perfil do usuário para definir nicho automaticamente
  useEffect(() => {
    if (user) {
      loadUserProfile()
      loadUserPreferences()
    }
  }, [user])

  const loadUserPreferences = async () => {
    if (!user) return
    
    try {
      const preferences = await ContentPreferencesService.getUserPreferences(user.uid)
      setUserPreferences(preferences)
      
      // Aplicar preferências ao formulário se existirem
      if (preferences) {
        setFormData(prev => ({
          ...prev,
          tipo: preferences.platformPreferences[0]?.platform || 'Post para Instagram',
          objetivo: preferences.contentStyle.contentType,
          tom: preferences.contentStyle.formalityLevel,
          urgencia: preferences.contentStyle.postingFrequency === 'daily' ? 'alta' : 'normal'
        }))
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error)
    }
  }

  const loadUserProfile = async () => {
    if (!user) return

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        
        if (data.businessProfile?.nicho) {
          setFormData(prev => ({
            ...prev,
            nicho: data.businessProfile.nicho
          }))
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handleSubmit = async () => {
    if (!user) return

    setIsSubmitting(true)
    try {
      // Criar pedido detalhado para o admin
      const requestData = {
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || user.email?.split('@')[0] || 'Usuário',
        
        // Informações básicas
        title: `${formData.topico} - ${formData.tipo}`,
        description: formData.descricao,
        category: formData.nicho,
        platform: formData.tipo,
        
        // Detalhes avançados
        objective: formData.objetivo,
        tone: formData.tom,
        targetAudience: formData.publico,
        keywords: formData.palavrasChave,
        
        // Especificações técnicas
        size: formData.tamanho,
        includeHashtags: formData.incluirHashtags,
        includeCTA: formData.incluirCallToAction,
        urgency: formData.urgencia,
        
        // Referências e observações
        references: formData.referencias,
        notes: formData.observacoes,
        
        // Status inicial
        status: 'pending',
        createdAt: Timestamp.now()
      }

      const docRef = await addDoc(collection(db, 'contentRequests'), requestData)
      
      console.log('Pedido enviado com ID:', docRef.id)
      
      // Mostrar confirmação
      alert('✅ Pedido enviado com sucesso! Você receberá uma notificação quando estiver pronto.')
      
      // Redirecionar para acompanhamento
      setTimeout(() => {
        router.push(`/meus-pedidos?pedido=${docRef.id}`)
      }, 2000)

    } catch (error) {
      console.error('Erro ao enviar pedido:', error)
      alert('❌ Erro ao enviar pedido. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mostrar loading enquanto carrega o perfil
  if (isLoadingProfile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando seu perfil...</p>
            <p className="text-sm text-gray-500 mt-2">Preparando nicho automático</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        
        {/* Header Moderno */}
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
                    Criar Pedido de Conteúdo
                  </h1>
                  <p className="text-gray-600 mt-1">Descreva seu pedido e nossa equipe criará conteúdo profissional</p>
                </div>
              </div>
              
              {/* Progress Indicator */}
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500 font-medium">
                  Passo {currentStep} de 4
                </div>
                <div className="w-40 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
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
                
                {/* Step 1: Informações Básicas */}
                {currentStep === 1 && (
                  <div className="p-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">📋 Informações Básicas</h2>
                      <p className="text-gray-600">Conte-nos sobre o conteúdo que você precisa</p>
                    </div>

                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            📱 Tipo de Conteúdo
                          </label>
                          <select 
                            name="tipo"
                            value={formData.tipo}
                            onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                          >
                            <option>Post para Instagram</option>
                            <option>Post para LinkedIn</option>
                            <option>Artigo para Blog</option>
                            <option>Story para Instagram</option>
                            <option>Thread para Twitter</option>
                            <option>Reel para Instagram</option>
                            <option>Vídeo para YouTube</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            🎯 Nicho/Área
                            {formData.nicho && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                ✓ Selecionado automaticamente
                              </span>
                            )}
                          </label>
                          <select 
                            name="nicho"
                            value={formData.nicho}
                            onChange={(e) => setFormData({...formData, nicho: e.target.value})}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                          >
                            <option value="">Selecione um nicho</option>
                            <option value="direito">Direito</option>
                            <option value="saude">Saúde & Bem-Estar</option>
                            <option value="tecnologia">Tecnologia</option>
                            <option value="gastronomia">Gastronomia</option>
                            <option value="beleza">Beleza & Estética</option>
                            <option value="marketing">Marketing & Publicidade</option>
                            <option value="psicologia">Psicologia & Saúde Mental</option>
                            <option value="odontologia">Odontologia</option>
                            <option value="farmacia">Farmácia & Medicamentos</option>
                            <option value="educacao">Educação & Cursos</option>
                            <option value="fitness">Fitness & Esportes</option>
                            <option value="imobiliario">Mercado Imobiliário</option>
                            <option value="contabilidade">Contabilidade & Finanças</option>
                            <option value="pets">Pet Shops & Veterinária</option>
                            <option value="turismo">Turismo & Hotelaria</option>
                            <option value="varejo">Varejo & E-commerce</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          💡 Tópico Principal
                        </label>
                        <input 
                          name="topico"
                          type="text" 
                          value={formData.topico}
                          onChange={(e) => setFormData({...formData, topico: e.target.value})}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                          placeholder="Ex: Direito trabalhista, saúde mental, IA..."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          📝 Descrição Detalhada
                        </label>
                        <textarea 
                          name="descricao"
                          value={formData.descricao}
                          onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl h-32 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 resize-none" 
                          placeholder="Descreva detalhadamente o que você quer criar..."
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button 
                        onClick={() => setCurrentStep(2)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Próximo →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Objetivo e Tom */}
                {currentStep === 2 && (
                  <div className="p-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">🎯 Objetivo e Tom</h2>
                      <p className="text-gray-600">Defina o propósito e estilo do seu conteúdo</p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-4">
                          🎯 Qual é o objetivo principal?
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {objetivos.map((objetivo) => (
                            <div
                              key={objetivo.id}
                              onClick={() => setFormData({...formData, objetivo: objetivo.id})}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                                formData.objetivo === objetivo.id
                                  ? 'border-blue-400 bg-blue-50 shadow-md'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="text-2xl mb-2">{objetivo.icon}</div>
                              <h3 className="font-semibold text-gray-900">{objetivo.label}</h3>
                              <p className="text-sm text-gray-600">{objetivo.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-4">
                          🎭 Qual tom você prefere?
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {tons.map((tom) => (
                            <div
                              key={tom.id}
                              onClick={() => setFormData({...formData, tom: tom.id})}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                                formData.tom === tom.id
                                  ? 'border-blue-400 bg-blue-50 shadow-md'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <h3 className="font-semibold text-gray-900">{tom.label}</h3>
                              <p className="text-sm text-gray-600">{tom.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          👥 Público-Alvo
                        </label>
                        <input 
                          name="publico"
                          type="text" 
                          value={formData.publico}
                          onChange={(e) => setFormData({...formData, publico: e.target.value})}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                          placeholder="Ex: Profissionais de 25-40 anos, estudantes de direito..."
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button 
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all duration-200"
                      >
                        ← Anterior
                      </button>
                      <button 
                        onClick={() => setCurrentStep(3)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Próximo →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Especificações Técnicas */}
                {currentStep === 3 && (
                  <div className="p-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">⚙️ Especificações Técnicas</h2>
                      <p className="text-gray-600">Configure os detalhes técnicos do seu conteúdo</p>
                    </div>

                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            📏 Tamanho do Conteúdo
                          </label>
                          <select 
                            name="tamanho"
                            value={formData.tamanho}
                            onChange={(e) => setFormData({...formData, tamanho: e.target.value})}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                          >
                            <option value="curto">Curto (1-2 parágrafos)</option>
                            <option value="padrao">Padrão (3-4 parágrafos)</option>
                            <option value="longo">Longo (5+ parágrafos)</option>
                            <option value="thread">Thread (múltiplos posts)</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            ⏰ Urgência
                          </label>
                          <select 
                            name="urgencia"
                            value={formData.urgencia}
                            onChange={(e) => setFormData({...formData, urgencia: e.target.value})}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                          >
                            <option value="baixa">Baixa (1-2 semanas)</option>
                            <option value="normal">Normal (3-5 dias)</option>
                            <option value="alta">Alta (1-2 dias)</option>
                            <option value="urgente">Urgente (mesmo dia)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          🔑 Palavras-Chave
                        </label>
                        <input 
                          name="palavrasChave"
                          type="text" 
                          value={formData.palavrasChave}
                          onChange={(e) => setFormData({...formData, palavrasChave: e.target.value})}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                          placeholder="Ex: direito trabalhista, CLT, rescisão..."
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <h3 className="font-semibold text-gray-900"># Hashtags</h3>
                            <p className="text-sm text-gray-600">Incluir hashtags relevantes</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.incluirHashtags}
                              onChange={(e) => setFormData({...formData, incluirHashtags: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <h3 className="font-semibold text-gray-900">📞 Call-to-Action</h3>
                            <p className="text-sm text-gray-600">Incluir chamada para ação</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.incluirCallToAction}
                              onChange={(e) => setFormData({...formData, incluirCallToAction: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button 
                        onClick={() => setCurrentStep(2)}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all duration-200"
                      >
                        ← Anterior
                      </button>
                      <button 
                        onClick={() => setCurrentStep(4)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Próximo →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Revisão e Envio */}
                {currentStep === 4 && (
                  <div className="p-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">📋 Revisão Final</h2>
                      <p className="text-gray-600">Revise seu pedido antes de enviar para nossa equipe</p>
                    </div>

                    <div className="space-y-6">
                      {/* Resumo do Pedido */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Resumo do Pedido</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Tipo:</span>
                              <span className="text-gray-900">{formData.tipo}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Nicho:</span>
                              <span className="text-gray-900">{formData.nicho}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Objetivo:</span>
                              <span className="text-gray-900">{objetivos.find(o => o.id === formData.objetivo)?.label}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Tom:</span>
                              <span className="text-gray-900">{tons.find(t => t.id === formData.tom)?.label}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Tamanho:</span>
                              <span className="text-gray-900">{formData.tamanho}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Urgência:</span>
                              <span className="text-gray-900">{formData.urgencia}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Hashtags:</span>
                              <span className="text-gray-900">{formData.incluirHashtags ? 'Sim' : 'Não'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">CTA:</span>
                              <span className="text-gray-900">{formData.incluirCallToAction ? 'Sim' : 'Não'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detalhes do Conteúdo */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">📄 Detalhes do Conteúdo</h3>
                        <div className="space-y-3">
                          <div>
                            <span className="font-medium text-gray-600">Tópico:</span>
                            <p className="text-gray-900 mt-1">{formData.topico}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Descrição:</span>
                            <p className="text-gray-900 mt-1">{formData.descricao}</p>
                          </div>
                          {formData.publico && (
                            <div>
                              <span className="font-medium text-gray-600">Público-Alvo:</span>
                              <p className="text-gray-900 mt-1">{formData.publico}</p>
                            </div>
                          )}
                          {formData.palavrasChave && (
                            <div>
                              <span className="font-medium text-gray-600">Palavras-Chave:</span>
                              <p className="text-gray-900 mt-1">{formData.palavrasChave}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Observações Adicionais */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          📝 Observações Adicionais (Opcional)
                        </label>
                        <textarea 
                          name="observacoes"
                          value={formData.observacoes}
                          onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl h-24 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 resize-none" 
                          placeholder="Alguma observação especial para nossa equipe?"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button 
                        onClick={() => setCurrentStep(3)}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all duration-200"
                      >
                        ← Anterior
                      </button>
                      
                      <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Enviando...
                          </div>
                        ) : (
                          '🚀 Enviar Pedido'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar com Informações */}
            <div className="space-y-6">
              
              {/* Processo */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🔄 Como Funciona</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Você descreve</h4>
                      <p className="text-sm text-gray-600">Detalhe seu pedido</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Nossa equipe cria</h4>
                      <p className="text-sm text-gray-600">Conteúdo profissional</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Você aprova</h4>
                      <p className="text-sm text-gray-600">E publica</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tempo Estimado */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-green-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">⏱️ Tempo Estimado</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Urgente:</span>
                    <span className="font-semibold text-green-600">Mesmo dia</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alta:</span>
                    <span className="font-semibold text-blue-600">1-2 dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Normal:</span>
                    <span className="font-semibold text-gray-600">3-5 dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Baixa:</span>
                    <span className="font-semibold text-gray-500">1-2 semanas</span>
                  </div>
                </div>
              </div>

              {/* Progresso */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Progresso</h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {step === 1 && 'Informações Básicas'}
                        {step === 2 && 'Objetivo e Tom'}
                        {step === 3 && 'Especificações'}
                        {step === 4 && 'Revisão Final'}
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