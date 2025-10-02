'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Button } from '@/components/ui/Button'

interface BrandIdentity {
  // Paleta de Cores
  cores: {
    primaria: string
    secundaria: string
    accent: string
    neutra: string
    background: string
    texto: string
  }
  
  // Tipografia
  tipografia: {
    titulo: string
    subtitulo: string
    corpo: string
    destaque: string
  }
  
  // Elementos Visuais
  elementosVisuais: {
    icones: string[]
    backgrounds: string[]
    frames: string[]
    templates: string[]
  }
  
  // Estilo de Comunicação
  estiloComunicacao: {
    personalidade: string
    tom: string
    linguagem: string
    exemplos: string[]
  }
}

const CORES_POR_NICHO = {
  direito: {
    primaria: '#1e40af',
    secundaria: '#3b82f6',
    accent: '#f59e0b',
    neutra: '#6b7280',
    background: '#f8fafc',
    texto: '#1f2937'
  },
  saude: {
    primaria: '#059669',
    secundaria: '#10b981',
    accent: '#f59e0b',
    neutra: '#6b7280',
    background: '#f0fdf4',
    texto: '#1f2937'
  },
  tecnologia: {
    primaria: '#7c3aed',
    secundaria: '#a855f7',
    accent: '#06b6d4',
    neutra: '#6b7280',
    background: '#faf5ff',
    texto: '#1f2937'
  },
  gastronomia: {
    primaria: '#dc2626',
    secundaria: '#ef4444',
    accent: '#f59e0b',
    neutra: '#6b7280',
    background: '#fef2f2',
    texto: '#1f2937'
  },
  beleza: {
    primaria: '#ec4899',
    secundaria: '#f472b6',
    accent: '#f59e0b',
    neutra: '#6b7280',
    background: '#fdf2f8',
    texto: '#1f2937'
  }
}

const FONTES_DISPONIVEIS = [
  { id: 'inter', name: 'Inter', category: 'Sans-serif', preview: 'Inter' },
  { id: 'poppins', name: 'Poppins', category: 'Sans-serif', preview: 'Poppins' },
  { id: 'roboto', name: 'Roboto', category: 'Sans-serif', preview: 'Roboto' },
  { id: 'opensans', name: 'Open Sans', category: 'Sans-serif', preview: 'Open Sans' },
  { id: 'lato', name: 'Lato', category: 'Sans-serif', preview: 'Lato' },
  { id: 'montserrat', name: 'Montserrat', category: 'Sans-serif', preview: 'Montserrat' },
  { id: 'playfair', name: 'Playfair Display', category: 'Serif', preview: 'Playfair Display' },
  { id: 'merriweather', name: 'Merriweather', category: 'Serif', preview: 'Merriweather' },
  { id: 'sourcecode', name: 'Source Code Pro', category: 'Monospace', preview: 'Source Code Pro' }
]

const PERSONALIDADES_MARCA = [
  {
    id: 'profissional',
    name: 'Profissional',
    desc: 'Sério, confiável e técnico',
    exemplos: ['Nossa empresa oferece soluções...', 'Com anos de experiência...', 'Garantimos qualidade...'],
    icone: '👔'
  },
  {
    id: 'amigavel',
    name: 'Amigável',
    desc: 'Acolhedor, próximo e humano',
    exemplos: ['Oi! Como você está?', 'Estamos aqui para ajudar...', 'Que tal conversarmos?'],
    icone: '😊'
  },
  {
    id: 'inspirador',
    name: 'Inspirador',
    desc: 'Motivador, positivo e energético',
    exemplos: ['Você pode conseguir!', 'Transforme seus sonhos...', 'Juntos somos mais fortes!'],
    icone: '✨'
  },
  {
    id: 'divertido',
    name: 'Divertido',
    desc: 'Descontraído, criativo e alegre',
    exemplos: ['Que dia lindo! 🌟', 'Vamos fazer acontecer!', 'A vida é uma festa!'],
    icone: '🎉'
  },
  {
    id: 'sofisticado',
    name: 'Sofisticado',
    desc: 'Elegante, exclusivo e refinado',
    exemplos: ['Para quem busca excelência...', 'Uma experiência única...', 'O luxo redefinido...'],
    icone: '💎'
  },
  {
    id: 'autoritario',
    name: 'Autoritário',
    desc: 'Confiante, direto e assertivo',
    exemplos: ['Faça isso agora.', 'Não há tempo a perder.', 'Resultados garantidos.'],
    icone: '👑'
  }
]

const ICONES_DISPONIVEIS = [
  '🎯', '💡', '🚀', '⭐', '🔥', '💎', '🎨', '📱', '💻', '📊',
  '🎪', '🎭', '🎨', '🎵', '🎬', '📚', '🏆', '🎖️', '🌟', '✨',
  '💪', '🎯', '🎪', '🎨', '🎵', '🎬', '📚', '🏆', '🎖️', '🌟'
]

const BACKGROUNDS_DISPONIVEIS = [
  'gradient-blue', 'gradient-purple', 'gradient-green', 'gradient-orange',
  'pattern-dots', 'pattern-lines', 'pattern-grid', 'pattern-waves',
  'solid-white', 'solid-gray', 'solid-black', 'texture-paper'
]

const FRAMES_DISPONIVEIS = [
  'frame-modern', 'frame-classic', 'frame-minimal', 'frame-bold',
  'frame-rounded', 'frame-square', 'frame-circle', 'frame-hexagon'
]

export const BrandIdentityManager = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('cores')
  const [userNicho, setUserNicho] = useState('')
  
  const [brandData, setBrandData] = useState<BrandIdentity>({
    cores: {
      primaria: '#3b82f6',
      secundaria: '#10b981',
      accent: '#f59e0b',
      neutra: '#6b7280',
      background: '#f8fafc',
      texto: '#1f2937'
    },
    tipografia: {
      titulo: 'inter',
      subtitulo: 'poppins',
      corpo: 'roboto',
      destaque: 'montserrat'
    },
    elementosVisuais: {
      icones: ['🎯', '💡', '🚀'],
      backgrounds: ['gradient-blue'],
      frames: ['frame-modern'],
      templates: ['template-minimal']
    },
    estiloComunicacao: {
      personalidade: 'profissional',
      tom: 'neutro',
      linguagem: 'formal',
      exemplos: []
    }
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
        
        // Carregar nicho do usuário
        if (data.businessProfile?.nicho) {
          setUserNicho(data.businessProfile.nicho)
          
          // Aplicar cores sugeridas por nicho
          const coresNicho = CORES_POR_NICHO[data.businessProfile.nicho as keyof typeof CORES_POR_NICHO]
          if (coresNicho) {
            setBrandData(prev => ({
              ...prev,
              cores: coresNicho
            }))
          }
        }
        
        // Carregar identidade da marca se existir
        if (data.brandIdentity) {
          setBrandData(data.brandIdentity)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleColorChange = (colorType: string, color: string) => {
    setBrandData(prev => ({
      ...prev,
      cores: {
        ...prev.cores,
        [colorType]: color
      }
    }))
  }

  const handleFontChange = (fontType: string, font: string) => {
    setBrandData(prev => ({
      ...prev,
      tipografia: {
        ...prev.tipografia,
        [fontType]: font
      }
    }))
  }

  const handleElementChange = (elementType: string, elements: string[]) => {
    setBrandData(prev => ({
      ...prev,
      elementosVisuais: {
        ...prev.elementosVisuais,
        [elementType]: elements
      }
    }))
  }

  const handlePersonalityChange = (personalidade: string) => {
    const personalidadeData = PERSONALIDADES_MARCA.find(p => p.id === personalidade)
    setBrandData(prev => ({
      ...prev,
      estiloComunicacao: {
        ...prev.estiloComunicacao,
        personalidade,
        exemplos: personalidadeData?.exemplos || []
      }
    }))
  }

  const applyNichoColors = () => {
    const coresNicho = CORES_POR_NICHO[userNicho as keyof typeof CORES_POR_NICHO]
    if (coresNicho) {
      setBrandData(prev => ({
        ...prev,
        cores: coresNicho
      }))
    }
  }

  const checkAccessibility = (color1: string, color2: string) => {
    // Função simples para verificar contraste
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null
    }

    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)
    
    if (!rgb1 || !rgb2) return { ratio: 0, status: 'Erro' }
    
    const luminance1 = (0.299 * rgb1.r + 0.587 * rgb1.g + 0.114 * rgb1.b) / 255
    const luminance2 = (0.299 * rgb2.r + 0.587 * rgb2.g + 0.114 * rgb2.b) / 255
    
    const ratio = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05)
    
    if (ratio >= 7) return { ratio: ratio.toFixed(1), status: 'Excelente' }
    if (ratio >= 4.5) return { ratio: ratio.toFixed(1), status: 'Bom' }
    if (ratio >= 3) return { ratio: ratio.toFixed(1), status: 'Aceitável' }
    return { ratio: ratio.toFixed(1), status: 'Ruim' }
  }

  const handleSave = async () => {
    if (!user) return
    
    setIsSaving(true)
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        brandIdentity: brandData,
        updatedAt: serverTimestamp()
      }, { merge: true })

      alert('Identidade da marca salva com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar identidade da marca:', error)
      alert('Erro ao salvar identidade da marca. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando identidade da marca...</p>
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
                🎨 Identidade da Marca
              </h1>
              <p className="text-gray-600 mt-1">
                Crie uma identidade visual única e profissional
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.location.href = '/perfil'}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
              >
                ← Voltar ao Perfil
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
                🎯 Preview da Marca
              </h2>
              <div className="space-y-4">
                {/* Preview das Cores */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Paleta de Cores</h3>
                  <div className="flex space-x-1">
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: brandData.cores.primaria }}
                      title="Primária"
                    ></div>
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: brandData.cores.secundaria }}
                      title="Secundária"
                    ></div>
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: brandData.cores.accent }}
                      title="Accent"
                    ></div>
                  </div>
                </div>

                {/* Preview da Tipografia */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Tipografia</h3>
                  <div className="space-y-1">
                    <div 
                      className="text-sm font-bold"
                      style={{ 
                        fontFamily: FONTES_DISPONIVEIS.find(f => f.id === brandData.tipografia.titulo)?.name,
                        color: brandData.cores.texto
                      }}
                    >
                      Título
                    </div>
                    <div 
                      className="text-xs"
                      style={{ 
                        fontFamily: FONTES_DISPONIVEIS.find(f => f.id === brandData.tipografia.corpo)?.name,
                        color: brandData.cores.texto
                      }}
                    >
                      Texto do corpo
                    </div>
                  </div>
                </div>

                {/* Preview do Estilo */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Personalidade</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {PERSONALIDADES_MARCA.find(p => p.id === brandData.estiloComunicacao.personalidade)?.icone}
                    </span>
                    <span className="text-sm text-gray-600">
                      {PERSONALIDADES_MARCA.find(p => p.id === brandData.estiloComunicacao.personalidade)?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sugestões por Nicho */}
            {userNicho && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  💡 Sugestões para {userNicho}
                </h2>
                <div className="space-y-3">
                  <Button
                    onClick={applyNichoColors}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                  >
                    Aplicar Cores do Nicho
                  </Button>
                  <p className="text-xs text-gray-600">
                    Cores otimizadas para o nicho {userNicho}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {[
                    { id: 'cores', name: 'Paleta de Cores', icon: '🎨' },
                    { id: 'tipografia', name: 'Tipografia', icon: '📝' },
                    { id: 'elementos', name: 'Elementos Visuais', icon: '🖼️' },
                    { id: 'comunicacao', name: 'Estilo de Comunicação', icon: '💬' }
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
              
              {/* Paleta de Cores */}
              {activeTab === 'cores' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    🎨 Paleta de Cores
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(brandData.cores).map(([colorType, color]) => (
                      <div key={colorType} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          {colorType === 'primaria' ? 'Primária' : 
                           colorType === 'secundaria' ? 'Secundária' :
                           colorType === 'accent' ? 'Accent' :
                           colorType === 'neutra' ? 'Neutra' :
                           colorType === 'background' ? 'Background' :
                           colorType === 'texto' ? 'Texto' : colorType}
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => handleColorChange(colorType, e.target.value)}
                            className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={color}
                            onChange={(e) => handleColorChange(colorType, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Teste de Acessibilidade */}
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      🔍 Teste de Acessibilidade
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700">Texto sobre Background</h4>
                        <div 
                          className="p-4 rounded-lg text-center font-medium"
                          style={{ 
                            backgroundColor: brandData.cores.background,
                            color: brandData.cores.texto
                          }}
                        >
                          Exemplo de texto
                        </div>
                        <p className="text-sm text-gray-600">
                          Contraste: {checkAccessibility(brandData.cores.texto, brandData.cores.background).ratio} 
                          ({checkAccessibility(brandData.cores.texto, brandData.cores.background).status})
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700">Botão Primário</h4>
                        <div 
                          className="p-4 rounded-lg text-center font-medium text-white"
                          style={{ backgroundColor: brandData.cores.primaria }}
                        >
                          Botão de Ação
                        </div>
                        <p className="text-sm text-gray-600">
                          Contraste: {checkAccessibility('#ffffff', brandData.cores.primaria).ratio} 
                          ({checkAccessibility('#ffffff', brandData.cores.primaria).status})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tipografia */}
              {activeTab === 'tipografia' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    📝 Tipografia
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(brandData.tipografia).map(([fontType, fontId]) => (
                      <div key={fontType} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          {fontType === 'titulo' ? 'Título' : 
                           fontType === 'subtitulo' ? 'Subtítulo' :
                           fontType === 'corpo' ? 'Corpo do Texto' :
                           fontType === 'destaque' ? 'Destaque' : fontType}
                        </label>
                        <select
                          value={fontId}
                          onChange={(e) => handleFontChange(fontType, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {FONTES_DISPONIVEIS.map((font) => (
                            <option key={font.id} value={font.id}>
                              {font.name} ({font.category})
                            </option>
                          ))}
                        </select>
                        <div 
                          className="p-3 bg-gray-50 rounded-lg text-sm"
                          style={{ 
                            fontFamily: FONTES_DISPONIVEIS.find(f => f.id === fontId)?.name,
                            color: brandData.cores.texto
                          }}
                        >
                          Preview: {FONTES_DISPONIVEIS.find(f => f.id === fontId)?.preview}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Preview Completo */}
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      📱 Preview Completo
                    </h3>
                    <div className="space-y-4">
                      <div 
                        className="text-2xl font-bold"
                        style={{ 
                          fontFamily: FONTES_DISPONIVEIS.find(f => f.id === brandData.tipografia.titulo)?.name,
                          color: brandData.cores.texto
                        }}
                      >
                        Título Principal do Post
                      </div>
                      <div 
                        className="text-lg font-semibold"
                        style={{ 
                          fontFamily: FONTES_DISPONIVEIS.find(f => f.id === brandData.tipografia.subtitulo)?.name,
                          color: brandData.cores.texto
                        }}
                      >
                        Subtítulo Explicativo
                      </div>
                      <div 
                        className="text-base"
                        style={{ 
                          fontFamily: FONTES_DISPONIVEIS.find(f => f.id === brandData.tipografia.corpo)?.name,
                          color: brandData.cores.texto
                        }}
                      >
                        Este é um exemplo de como ficará o texto do corpo do seu post. 
                        A tipografia escolhida será aplicada em todos os conteúdos gerados.
                      </div>
                      <div 
                        className="text-sm font-medium px-3 py-1 rounded-full inline-block"
                        style={{ 
                          fontFamily: FONTES_DISPONIVEIS.find(f => f.id === brandData.tipografia.destaque)?.name,
                          backgroundColor: brandData.cores.primaria,
                          color: '#ffffff'
                        }}
                      >
                        Destaque Especial
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Elementos Visuais */}
              {activeTab === 'elementos' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    🖼️ Elementos Visuais
                  </h2>

                  {/* Ícones */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Ícones Personalizados
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {ICONES_DISPONIVEIS.map((icone) => (
                        <button
                          key={icone}
                          onClick={() => {
                            const novosIcones = brandData.elementosVisuais.icones.includes(icone)
                              ? brandData.elementosVisuais.icones.filter(i => i !== icone)
                              : [...brandData.elementosVisuais.icones, icone]
                            handleElementChange('icones', novosIcones)
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            brandData.elementosVisuais.icones.includes(icone)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-2xl">{icone}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Selecionados: {brandData.elementosVisuais.icones.length} ícones
                    </p>
                  </div>

                  {/* Backgrounds */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Padrões de Fundo
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {BACKGROUNDS_DISPONIVEIS.map((background) => (
                        <button
                          key={background}
                          onClick={() => {
                            const novosBackgrounds = brandData.elementosVisuais.backgrounds.includes(background)
                              ? brandData.elementosVisuais.backgrounds.filter(b => b !== background)
                              : [...brandData.elementosVisuais.backgrounds, background]
                            handleElementChange('backgrounds', novosBackgrounds)
                          }}
                          className={`p-4 rounded-lg border-2 transition-all text-center ${
                            brandData.elementosVisuais.backgrounds.includes(background)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-sm font-medium text-gray-700">
                            {background.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frames */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Frames e Bordas
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {FRAMES_DISPONIVEIS.map((frame) => (
                        <button
                          key={frame}
                          onClick={() => {
                            const novosFrames = brandData.elementosVisuais.frames.includes(frame)
                              ? brandData.elementosVisuais.frames.filter(f => f !== frame)
                              : [...brandData.elementosVisuais.frames, frame]
                            handleElementChange('frames', novosFrames)
                          }}
                          className={`p-4 rounded-lg border-2 transition-all text-center ${
                            brandData.elementosVisuais.frames.includes(frame)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-sm font-medium text-gray-700">
                            {frame.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Estilo de Comunicação */}
              {activeTab === 'comunicacao' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    💬 Estilo de Comunicação
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Personalidade da Marca
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {PERSONALIDADES_MARCA.map((personalidade) => (
                        <button
                          key={personalidade.id}
                          onClick={() => handlePersonalityChange(personalidade.id)}
                          className={`p-4 rounded-lg border-2 transition-all text-center ${
                            brandData.estiloComunicacao.personalidade === personalidade.id
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">{personalidade.icone}</div>
                          <h3 className="font-semibold text-gray-900">{personalidade.name}</h3>
                          <p className="text-sm text-gray-600">{personalidade.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Exemplos Práticos */}
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      📝 Exemplos Práticos
                    </h3>
                    <div className="space-y-3">
                      {brandData.estiloComunicacao.exemplos.map((exemplo, index) => (
                        <div 
                          key={index}
                          className="p-4 bg-white rounded-lg border border-gray-200"
                          style={{ color: brandData.cores.texto }}
                        >
                          <p className="text-sm">{exemplo}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Teste de Compatibilidade */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      ✅ Teste de Compatibilidade
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Nicho: {userNicho || 'Não definido'}</h4>
                        <p className="text-sm text-gray-600">
                          {userNicho ? 'Personalidade compatível com o nicho' : 'Defina um nicho para ver sugestões'}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Personalidade: {PERSONALIDADES_MARCA.find(p => p.id === brandData.estiloComunicacao.personalidade)?.name}</h4>
                        <p className="text-sm text-gray-600">
                          Estilo adequado para comunicação profissional
                        </p>
                      </div>
                    </div>
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
                  {isSaving ? '💾 Salvando...' : '💾 Salvar Identidade da Marca'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
