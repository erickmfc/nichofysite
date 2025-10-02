'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Button } from '@/components/ui/Button'

interface BusinessProfile {
  // Informações Básicas
  nomeNegocio: string
  logoUrl?: string
  descricaoNegocio: string
  siteUrl?: string
  instagramUrl?: string
  linkedinUrl?: string
  whatsappUrl?: string
  localizacao: {
    cidade: string
    estado: string
    pais: string
  }
  
  // Nicho Inteligente
  nicho: string
  nichosSecundarios: string[]
  tagsPersonalizadas: string[]
  historicoNichos: Array<{
    nicho: string
    dataMudanca: Date
    motivo?: string
  }>
  
  // Informações Avançadas
  publicoAlvo: {
    idade: string
    genero: string
    renda: string
    interesses: string[]
  }
  objetivosNegocio: string[]
  orcamentoMarketing: string
  experienciaRedesSociais: string
  principaisConcorrentes: string[]
  
  // Tom de Voz
  tomVoz: string[]
}

const NICHOS = [
  { id: 'gastronomia', name: 'Gastronomia & Alimentação', icon: '🍔' },
  { id: 'beleza', name: 'Beleza & Estética', icon: '💇‍♀️' },
  { id: 'direito', name: 'Direito', icon: '⚖️' },
  { id: 'saude', name: 'Saúde & Bem-Estar', icon: '👨‍⚕️' },
  { id: 'tecnologia', name: 'Tecnologia', icon: '💻' },
  { id: 'fitness', name: 'Fitness & Esportes', icon: '💪' },
  { id: 'imobiliario', name: 'Mercado Imobiliário', icon: '🏠' },
  { id: 'contabilidade', name: 'Contabilidade & Finanças', icon: '👔' },
  { id: 'pets', name: 'Pet Shops & Veterinária', icon: '🐾' },
  { id: 'educacao', name: 'Educação & Cursos', icon: '📚' },
  { id: 'turismo', name: 'Turismo & Hotelaria', icon: '✈️' },
  { id: 'varejo', name: 'Varejo & E-commerce', icon: '🛍️' }
]

const OBJETIVOS_NEGOCIO = [
  { id: 'vendas', name: 'Aumentar Vendas', icon: '💰' },
  { id: 'engajamento', name: 'Engajamento', icon: '💬' },
  { id: 'autoridade', name: 'Autoridade', icon: '👑' },
  { id: 'conscientizacao', name: 'Conscientização', icon: '📢' },
  { id: 'leads', name: 'Geração de Leads', icon: '🎯' },
  { id: 'fidelizacao', name: 'Fidelização', icon: '❤️' }
]

const EXPERIENCIA_REDES = [
  { id: 'iniciante', name: 'Iniciante', desc: 'Pouco conhecimento' },
  { id: 'intermediario', name: 'Intermediário', desc: 'Conhecimento básico' },
  { id: 'avancado', name: 'Avançado', desc: 'Experiência sólida' },
  { id: 'expert', name: 'Expert', desc: 'Muito experiente' }
]

const ORCAMENTO_OPCOES = [
  { id: 'ate-500', name: 'Até R$ 500/mês' },
  { id: '500-1000', name: 'R$ 500 - R$ 1.000/mês' },
  { id: '1000-3000', name: 'R$ 1.000 - R$ 3.000/mês' },
  { id: '3000-5000', name: 'R$ 3.000 - R$ 5.000/mês' },
  { id: 'acima-5000', name: 'Acima de R$ 5.000/mês' }
]

const TOM_VOZ_OPTIONS = [
  { id: 'amigavel', name: 'Amigável', icon: '😊' },
  { id: 'profissional', name: 'Profissional', icon: '👔' },
  { id: 'divertido', name: 'Divertido', icon: '🎉' },
  { id: 'inspirador', name: 'Inspirador', icon: '✨' },
  { id: 'tecnico', name: 'Técnico', icon: '🔧' },
  { id: 'sofisticado', name: 'Sofisticado', icon: '💎' }
]

export const UserProfileExpanded = () => {
  const { user, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('basicas')
  
  const [formData, setFormData] = useState({
    // Informações Básicas
    nomeNegocio: '',
    logoUrl: '',
    descricaoNegocio: '',
    siteUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    whatsappUrl: '',
    localizacao: {
      cidade: '',
      estado: '',
      pais: 'Brasil'
    },
    
    // Nicho Inteligente
    nicho: '',
    nichosSecundarios: [] as string[],
    tagsPersonalizadas: [] as string[],
    historicoNichos: [] as Array<{
      nicho: string
      dataMudanca: Date
      motivo?: string
    }>,
    
    // Informações Avançadas
    publicoAlvo: {
      idade: '',
      genero: '',
      renda: '',
      interesses: [] as string[]
    },
    objetivosNegocio: [] as string[],
    orcamentoMarketing: '',
    experienciaRedesSociais: '',
    principaisConcorrentes: [] as string[],
    
    // Tom de Voz
    tomVoz: [] as string[]
  })

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        setUserData(data)
        
        if (data.businessProfile) {
          setFormData({
            // Informações Básicas
            nomeNegocio: data.businessProfile.nomeNegocio || '',
            logoUrl: data.businessProfile.logoUrl || '',
            descricaoNegocio: data.businessProfile.descricaoNegocio || '',
            siteUrl: data.businessProfile.siteUrl || '',
            instagramUrl: data.businessProfile.instagramUrl || '',
            linkedinUrl: data.businessProfile.linkedinUrl || '',
            whatsappUrl: data.businessProfile.whatsappUrl || '',
            localizacao: data.businessProfile.localizacao || {
              cidade: '',
              estado: '',
              pais: 'Brasil'
            },
            
            // Nicho Inteligente
            nicho: data.businessProfile.nicho || '',
            nichosSecundarios: data.businessProfile.nichosSecundarios || [],
            tagsPersonalizadas: data.businessProfile.tagsPersonalizadas || [],
            historicoNichos: data.businessProfile.historicoNichos || [],
            
            // Informações Avançadas
            publicoAlvo: data.businessProfile.publicoAlvo || {
              idade: '',
              genero: '',
              renda: '',
              interesses: []
            },
            objetivosNegocio: data.businessProfile.objetivosNegocio || [],
            orcamentoMarketing: data.businessProfile.orcamentoMarketing || '',
            experienciaRedesSociais: data.businessProfile.experienciaRedesSociais || '',
            principaisConcorrentes: data.businessProfile.principaisConcorrentes || [],
            
            // Tom de Voz
            tomVoz: data.businessProfile.tomVoz || []
          })
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedInputChange = (parentField: string, childField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField as keyof typeof prev],
        [childField]: value
      }
    }))
  }

  const handleArrayChange = (field: string, value: string, add: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: add 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }))
  }

  const handleNichoChange = (novoNicho: string) => {
    const nichoAnterior = formData.nicho
    
    // Adicionar ao histórico se mudou
    if (nichoAnterior && nichoAnterior !== novoNicho) {
      const novoHistorico = [...formData.historicoNichos, {
        nicho: nichoAnterior,
        dataMudanca: new Date(),
        motivo: 'Mudança de nicho'
      }]
      
      setFormData(prev => ({
        ...prev,
        nicho: novoNicho,
        historicoNichos: novoHistorico
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        nicho: novoNicho
      }))
    }
  }

  const handleSave = async () => {
    if (!user) return
    
    setIsSaving(true)
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        businessProfile: {
          // Informações Básicas
          nomeNegocio: formData.nomeNegocio,
          logoUrl: formData.logoUrl,
          descricaoNegocio: formData.descricaoNegocio,
          siteUrl: formData.siteUrl,
          instagramUrl: formData.instagramUrl,
          linkedinUrl: formData.linkedinUrl,
          whatsappUrl: formData.whatsappUrl,
          localizacao: formData.localizacao,
          
          // Nicho Inteligente
          nicho: formData.nicho,
          nichosSecundarios: formData.nichosSecundarios,
          tagsPersonalizadas: formData.tagsPersonalizadas,
          historicoNichos: formData.historicoNichos,
          
          // Informações Avançadas
          publicoAlvo: formData.publicoAlvo,
          objetivosNegocio: formData.objetivosNegocio,
          orcamentoMarketing: formData.orcamentoMarketing,
          experienciaRedesSociais: formData.experienciaRedesSociais,
          principaisConcorrentes: formData.principaisConcorrentes,
          
          // Tom de Voz
          tomVoz: formData.tomVoz
        },
        updatedAt: serverTimestamp()
      }, { merge: true })

      alert('Perfil atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      alert('Erro ao salvar perfil. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Perfil Completo - NichoFy
              </h1>
              <p className="text-gray-600 mt-1">
                Centro de controle completo da sua marca
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.location.href = '/identidade-marca'}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                🎨 Identidade da Marca
              </Button>
              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                ← Voltar ao Dashboard
              </Button>
              <Button
                onClick={logout}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                🚀 Meu Negócio
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Nome:</span>
                  <p className="text-gray-900">{formData.nomeNegocio || 'Não definido'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Nicho:</span>
                  <p className="text-gray-900">
                    {formData.nicho ? NICHOS.find(n => n.id === formData.nicho)?.name : 'Não definido'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Localização:</span>
                  <p className="text-gray-900">
                    {formData.localizacao.cidade && formData.localizacao.estado 
                      ? `${formData.localizacao.cidade}, ${formData.localizacao.estado}`
                      : 'Não definida'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                ⚙️ Minha Conta
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Nome:</span>
                  <p className="text-gray-900">{user?.displayName || 'Não definido'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {[
                    { id: 'basicas', name: 'Informações Básicas', icon: '📋' },
                    { id: 'nicho', name: 'Nicho Inteligente', icon: '🎯' },
                    { id: 'avancadas', name: 'Informações Avançadas', icon: '⚙️' },
                    { id: 'tom', name: 'Tom de Voz', icon: '🎭' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              
              {/* Informações Básicas */}
              {activeTab === 'basicas' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    📋 Informações Básicas
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Negócio
                      </label>
                      <input
                        type="text"
                        value={formData.nomeNegocio}
                        onChange={(e) => handleInputChange('nomeNegocio', e.target.value)}
                        placeholder="Ex: Cafeteria do João"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo/URL da Imagem
                      </label>
                      <input
                        type="url"
                        value={formData.logoUrl}
                        onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                        placeholder="https://exemplo.com/logo.png"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição do Negócio
                    </label>
                    <textarea
                      value={formData.descricaoNegocio}
                      onChange={(e) => handleInputChange('descricaoNegocio', e.target.value)}
                      placeholder="Ex: Cafeteria em Saquarema com foco em grãos especiais e ambiente aconchegante."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site
                      </label>
                      <input
                        type="url"
                        value={formData.siteUrl}
                        onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                        placeholder="https://meusite.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={formData.instagramUrl}
                        onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                        placeholder="https://instagram.com/meuperfil"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                        placeholder="https://linkedin.com/in/meuperfil"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp
                      </label>
                      <input
                        type="url"
                        value={formData.whatsappUrl}
                        onChange={(e) => handleInputChange('whatsappUrl', e.target.value)}
                        placeholder="https://wa.me/5521999999999"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={formData.localizacao.cidade}
                        onChange={(e) => handleNestedInputChange('localizacao', 'cidade', e.target.value)}
                        placeholder="Ex: Saquarema"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado
                      </label>
                      <input
                        type="text"
                        value={formData.localizacao.estado}
                        onChange={(e) => handleNestedInputChange('localizacao', 'estado', e.target.value)}
                        placeholder="Ex: RJ"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País
                      </label>
                      <input
                        type="text"
                        value={formData.localizacao.pais}
                        onChange={(e) => handleNestedInputChange('localizacao', 'pais', e.target.value)}
                        placeholder="Ex: Brasil"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Nicho Inteligente */}
              {activeTab === 'nicho' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    🎯 Nicho Inteligente
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Nicho Principal
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {NICHOS.map((nicho) => (
                        <button
                          key={nicho.id}
                          onClick={() => handleNichoChange(nicho.id)}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            formData.nicho === nicho.id
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">{nicho.icon}</div>
                          <div className="text-sm font-medium text-gray-700">{nicho.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nichos Secundários (até 3)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {NICHOS.filter(n => n.id !== formData.nicho).map((nicho) => (
                        <button
                          key={nicho.id}
                          onClick={() => {
                            const isSelected = formData.nichosSecundarios.includes(nicho.id)
                            if (isSelected) {
                              handleArrayChange('nichosSecundarios', nicho.id, false)
                            } else if (formData.nichosSecundarios.length < 3) {
                              handleArrayChange('nichosSecundarios', nicho.id, true)
                            }
                          }}
                          disabled={!formData.nichosSecundarios.includes(nicho.id) && formData.nichosSecundarios.length >= 3}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            formData.nichosSecundarios.includes(nicho.id)
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${!formData.nichosSecundarios.includes(nicho.id) && formData.nichosSecundarios.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="text-lg mb-1">{nicho.icon}</div>
                          <div className="text-sm font-medium text-gray-700">{nicho.name}</div>
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Selecionados: {formData.nichosSecundarios.length}/3
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags Personalizadas
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tagsPersonalizadas.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button
                            onClick={() => handleArrayChange('tagsPersonalizadas', tag, false)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Adicionar tag personalizada"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const value = e.currentTarget.value.trim()
                            if (value && !formData.tagsPersonalizadas.includes(value)) {
                              handleArrayChange('tagsPersonalizadas', value, true)
                              e.currentTarget.value = ''
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {formData.historicoNichos.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Histórico de Mudanças de Nicho
                      </label>
                      <div className="space-y-2">
                        {formData.historicoNichos.map((historico, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-medium text-gray-900">
                                  {NICHOS.find(n => n.id === historico.nicho)?.name}
                                </span>
                                <p className="text-sm text-gray-600">
                                  {historico.dataMudanca.toLocaleDateString('pt-BR')}
                                </p>
                                {historico.motivo && (
                                  <p className="text-sm text-gray-500">{historico.motivo}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Informações Avançadas */}
              {activeTab === 'avancadas' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    ⚙️ Informações Avançadas
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Público-Alvo Detalhado
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Idade</label>
                        <input
                          type="text"
                          value={formData.publicoAlvo.idade}
                          onChange={(e) => handleNestedInputChange('publicoAlvo', 'idade', e.target.value)}
                          placeholder="Ex: 25-40 anos"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Gênero</label>
                        <input
                          type="text"
                          value={formData.publicoAlvo.genero}
                          onChange={(e) => handleNestedInputChange('publicoAlvo', 'genero', e.target.value)}
                          placeholder="Ex: Feminino, Masculino, Todos"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Renda</label>
                        <input
                          type="text"
                          value={formData.publicoAlvo.renda}
                          onChange={(e) => handleNestedInputChange('publicoAlvo', 'renda', e.target.value)}
                          placeholder="Ex: R$ 3.000 - R$ 8.000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Interesses</label>
                        <input
                          type="text"
                          placeholder="Ex: tecnologia, moda, viagem"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = e.currentTarget.value.trim()
                              if (value && !formData.publicoAlvo.interesses.includes(value)) {
                                handleNestedInputChange('publicoAlvo', 'interesses', [...formData.publicoAlvo.interesses, value])
                                e.currentTarget.value = ''
                              }
                            }
                          }}
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.publicoAlvo.interesses.map((interesse, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800"
                            >
                              {interesse}
                              <button
                                onClick={() => {
                                  const novosInteresses = formData.publicoAlvo.interesses.filter(i => i !== interesse)
                                  handleNestedInputChange('publicoAlvo', 'interesses', novosInteresses)
                                }}
                                className="ml-1 text-purple-600 hover:text-purple-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Objetivos de Negócio
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {OBJETIVOS_NEGOCIO.map((objetivo) => (
                        <button
                          key={objetivo.id}
                          onClick={() => {
                            const isSelected = formData.objetivosNegocio.includes(objetivo.id)
                            if (isSelected) {
                              handleArrayChange('objetivosNegocio', objetivo.id, false)
                            } else {
                              handleArrayChange('objetivosNegocio', objetivo.id, true)
                            }
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            formData.objetivosNegocio.includes(objetivo.id)
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-lg mb-1">{objetivo.icon}</div>
                          <div className="text-sm font-medium text-gray-700">{objetivo.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Orçamento Mensal para Marketing
                      </label>
                      <select
                        value={formData.orcamentoMarketing}
                        onChange={(e) => handleInputChange('orcamentoMarketing', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Selecione uma faixa</option>
                        {ORCAMENTO_OPCOES.map((opcao) => (
                          <option key={opcao.id} value={opcao.id}>{opcao.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experiência com Redes Sociais
                      </label>
                      <select
                        value={formData.experienciaRedesSociais}
                        onChange={(e) => handleInputChange('experienciaRedesSociais', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Selecione seu nível</option>
                        {EXPERIENCIA_REDES.map((nivel) => (
                          <option key={nivel.id} value={nivel.id}>{nivel.name} - {nivel.desc}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Principais Concorrentes
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.principaisConcorrentes.map((concorrente, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                        >
                          {concorrente}
                          <button
                            onClick={() => handleArrayChange('principaisConcorrentes', concorrente, false)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Adicionar concorrente"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const value = e.currentTarget.value.trim()
                            if (value && !formData.principaisConcorrentes.includes(value)) {
                              handleArrayChange('principaisConcorrentes', value, true)
                              e.currentTarget.value = ''
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tom de Voz */}
              {activeTab === 'tom' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    🎭 Tom de Voz
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Selecione até 3 tons de voz para sua marca
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {TOM_VOZ_OPTIONS.map((tom) => (
                        <button
                          key={tom.id}
                          onClick={() => {
                            const isSelected = formData.tomVoz.includes(tom.id)
                            if (isSelected) {
                              handleArrayChange('tomVoz', tom.id, false)
                            } else if (formData.tomVoz.length < 3) {
                              handleArrayChange('tomVoz', tom.id, true)
                            }
                          }}
                          disabled={!formData.tomVoz.includes(tom.id) && formData.tomVoz.length >= 3}
                          className={`p-4 rounded-lg border-2 transition-all text-center ${
                            formData.tomVoz.includes(tom.id)
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${!formData.tomVoz.includes(tom.id) && formData.tomVoz.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="text-2xl mb-2">{tom.icon}</div>
                          <div className="text-sm font-medium text-gray-700">{tom.name}</div>
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Selecionados: {formData.tomVoz.length}/3
                    </p>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-6 border-t border-gray-200 mt-8">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg"
                >
                  {isSaving ? '💾 Salvando...' : '💾 Salvar Alterações'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
