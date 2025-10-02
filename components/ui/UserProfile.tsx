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

const TOM_VOZ_OPTIONS = [
  { id: 'amigavel', name: 'Amigável', icon: '😊' },
  { id: 'profissional', name: 'Profissional', icon: '👔' },
  { id: 'divertido', name: 'Divertido', icon: '🎉' },
  { id: 'inspirador', name: 'Inspirador', icon: '✨' },
  { id: 'tecnico', name: 'Técnico', icon: '🔧' },
  { id: 'sofisticado', name: 'Sofisticado', icon: '💎' }
]

export const UserProfile = () => {
  const { user, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  
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

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
                Meu Perfil
              </h1>
              <p className="text-gray-600 mt-1">
                Gerencie as informações da sua marca
              </p>
            </div>
            <div className="flex items-center space-x-4">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
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
                  <p className="text-gray-900">{formData.nicho || 'Não definido'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
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
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                🎨 Identidade da Marca
              </h2>

              <div className="space-y-6">
                {/* Nome do Negócio */}
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

                {/* Nicho */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nicho de Atuação
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {NICHOS.map((nicho) => (
                      <button
                        key={nicho.id}
                        onClick={() => handleInputChange('nicho', nicho.id)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          formData.nicho === nicho.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-lg mb-1">{nicho.icon}</div>
                        <div className="text-sm font-medium text-gray-700">{nicho.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Descrição */}
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

                {/* Público-Alvo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Público-Alvo
                  </label>
                  <input
                    type="text"
                    value={formData.publicoAlvo}
                    onChange={(e) => handleInputChange('publicoAlvo', e.target.value)}
                    placeholder="Ex: Jovens universitários, mulheres de 30 a 50 anos"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Tom de Voz */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tom de Voz (Selecione até 3)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {TOM_VOZ_OPTIONS.map((tom) => (
                      <button
                        key={tom.id}
                        onClick={() => {
                          const newTomVoz = formData.tomVoz.includes(tom.id)
                            ? formData.tomVoz.filter(t => t !== tom.id)
                            : formData.tomVoz.length < 3
                              ? [...formData.tomVoz, tom.id]
                              : formData.tomVoz
                          handleInputChange('tomVoz', newTomVoz)
                        }}
                        disabled={!formData.tomVoz.includes(tom.id) && formData.tomVoz.length >= 3}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                          formData.tomVoz.includes(tom.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${!formData.tomVoz.includes(tom.id) && formData.tomVoz.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="text-lg mb-1">{tom.icon}</div>
                        <div className="text-sm font-medium text-gray-700">{tom.name}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Selecionados: {formData.tomVoz.length}/3
                  </p>
                </div>

                {/* Save Button */}
                <div className="pt-6 border-t border-gray-200">
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
    </div>
  )
}
