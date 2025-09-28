'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { UserDataService } from '@/lib/services/UserDataService'
import { BusinessProfile, UserPreferences } from '@/lib/types/user'

interface OnboardingProps {
  onComplete: () => void
}

const NICHOS = [
  { id: 'gastronomia', name: 'Gastronomia & Alimentação', icon: '🍔', color: 'from-orange-500 to-red-600' },
  { id: 'beleza', name: 'Beleza & Estética', icon: '💇‍♀️', color: 'from-pink-500 to-rose-600' },
  { id: 'direito', name: 'Direito', icon: '⚖️', color: 'from-blue-600 to-blue-800' },
  { id: 'saude', name: 'Saúde & Bem-Estar', icon: '👨‍⚕️', color: 'from-green-500 to-emerald-600' },
  { id: 'tecnologia', name: 'Tecnologia', icon: '💻', color: 'from-purple-500 to-indigo-600' },
  { id: 'fitness', name: 'Fitness & Esportes', icon: '💪', color: 'from-yellow-500 to-orange-500' },
  { id: 'imobiliario', name: 'Mercado Imobiliário', icon: '🏠', color: 'from-teal-500 to-green-600' },
  { id: 'contabilidade', name: 'Contabilidade & Finanças', icon: '👔', color: 'from-gray-600 to-gray-800' },
  { id: 'pets', name: 'Pet Shops & Veterinária', icon: '🐾', color: 'from-amber-500 to-yellow-600' },
  { id: 'educacao', name: 'Educação & Cursos', icon: '📚', color: 'from-indigo-500 to-purple-600' },
  { id: 'turismo', name: 'Turismo & Hotelaria', icon: '✈️', color: 'from-sky-500 to-blue-600' },
  { id: 'varejo', name: 'Varejo & E-commerce', icon: '🛍️', color: 'from-cyan-500 to-blue-600' }
]

const TOM_VOZ_OPTIONS = [
  { id: 'amigavel', name: 'Amigável', icon: '😊' },
  { id: 'profissional', name: 'Profissional', icon: '👔' },
  { id: 'divertido', name: 'Divertido', icon: '🎉' },
  { id: 'inspirador', name: 'Inspirador', icon: '✨' },
  { id: 'tecnico', name: 'Técnico', icon: '🔧' },
  { id: 'sofisticado', name: 'Sofisticado', icon: '💎' }
]

export const OnboardingInteligente: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    nomeNegocio: '',
    nicho: '',
    descricaoNegocio: '',
    publicoAlvo: '',
    tomVoz: [] as string[]
  })

  const steps = [
    {
      id: 1,
      title: 'Bem-vindo(a) à NichoFy!',
      subtitle: 'Vamos configurar a identidade da sua marca em 2 minutos para começar a criar conteúdo incrível.',
      component: 'welcome'
    },
    {
      id: 2,
      title: 'A Essência do seu Negócio',
      subtitle: 'Conte-nos sobre sua empresa para personalizarmos seus posts.',
      component: 'business'
    },
    {
      id: 3,
      title: 'A Personalidade da sua Marca',
      subtitle: 'Defina como sua marca se comunica com o público.',
      component: 'brand'
    }
  ]

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    if (!user) {
      console.error('Erro: Usuário não encontrado')
      return
    }
    
    console.log('Iniciando conclusão do onboarding...')
    console.log('Dados do formulário:', formData)
    
    setIsLoading(true)
    
    try {
      const userDataService = new UserDataService(user.uid)
      
      console.log('Salvando perfil de negócio...')
      
      // Criar perfil de negócio
      const businessProfile: BusinessProfile = {
        nomeNegocio: formData.nomeNegocio,
        nicho: formData.nicho,
        descricaoNegocio: formData.descricaoNegocio,
        publicoAlvo: formData.publicoAlvo,
        tomVoz: formData.tomVoz
      }
      
      await userDataService.saveBusinessProfile(businessProfile)
      console.log('Perfil de negócio salvo!')

      console.log('Salvando preferências padrão...')
      
      // Criar preferências padrão
      const defaultPreferences: UserPreferences = {
        language: 'pt',
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          contentReady: true,
          weeklyReport: false
        },
        contentPreferences: {
          tone: formData.tomVoz,
          length: 'medium',
          hashtags: true,
          emojis: true,
          callToAction: true
        },
        favoriteTemplates: [],
        dislikedContent: []
      }
      
      await userDataService.savePreferences(defaultPreferences)
      console.log('Preferências salvas!')

      console.log('Marcando onboarding como completo...')
      
      // Marcar onboarding como completo
      await userDataService.updateUserData({
        onboardingCompleted: true,
        onboardingData: {
          completedAt: new Date(),
          stepsCompleted: [1, 2, 3],
          skippedSteps: []
        }
      })
      
      console.log('Onboarding marcado como completo!')

      console.log('Gerando primeira sugestão...')
      
      // Gerar primeira sugestão de conteúdo
      const primeiraSugestao = generateFirstSuggestion()
      console.log('Primeira sugestão gerada:', primeiraSugestao)
      
      // Salvar primeira sugestão como conteúdo gerado
      await userDataService.saveGeneratedContent({
        prompt: primeiraSugestao,
        content: {
          text: `Bem-vindo(a) à ${formData.nomeNegocio}! 🎉\n\nEstamos animados para começar esta jornada de criação de conteúdo com você. Sua primeira sugestão personalizada está pronta!\n\n${primeiraSugestao}`,
          hashtags: `#${formData.nicho} #${formData.nomeNegocio.replace(/\s+/g, '')} #conteudo #marketing`,
          images: []
        },
        metadata: {
          nicho: formData.nicho,
          tomVoz: formData.tomVoz,
          publicoAlvo: formData.publicoAlvo,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        interactions: {
          liked: false,
          disliked: false,
          saved: false,
          shared: false,
          used: false
        }
      })
      
      console.log('Primeira sugestão salva!')
      console.log('Chamando onComplete...')

      onComplete()
    } catch (error) {
      console.error('Erro ao salvar onboarding:', error)
      alert('Erro ao salvar dados. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const generateFirstSuggestion = () => {
    const nicho = NICHOS.find(n => n.id === formData.nicho)
    const nomeNegocio = formData.nomeNegocio
    
    if (nicho?.id === 'gastronomia') {
      return `Criar um post de "bom dia" convidando para tomar o primeiro café da semana em ${nomeNegocio}.`
    } else if (nicho?.id === 'beleza') {
      return `Criar um post motivacional sobre autoestima e cuidados pessoais para ${nomeNegocio}.`
    } else if (nicho?.id === 'fitness') {
      return `Criar um post motivacional para começar a semana com energia em ${nomeNegocio}.`
    } else {
      return `Criar um post de apresentação da ${nomeNegocio} destacando os principais benefícios.`
    }
  }

  const canProceed = () => {
    const result = (() => {
      switch (currentStep) {
        case 1:
          return true
        case 2:
          return formData.nomeNegocio && formData.nicho && formData.descricaoNegocio
        case 3:
          return formData.publicoAlvo && formData.tomVoz.length > 0
        default:
          return false
      }
    })()
    
    console.log(`canProceed - Step ${currentStep}:`, result)
    console.log('Form data:', formData)
    
    return result
  }

  const renderStepContent = () => {
    const step = steps[currentStep - 1]
    
    switch (step.component) {
      case 'welcome':
        return (
          <div className="text-center">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {step.title}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {step.subtitle}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-800 mb-2">✨ O que você vai conseguir:</h3>
              <ul className="text-blue-700 space-y-1">
                <li>• Conteúdo personalizado para sua marca</li>
                <li>• Posts prontos em segundos</li>
                <li>• Sugestões inteligentes baseadas no seu nicho</li>
                <li>• Economia de tempo e criatividade</li>
              </ul>
            </div>
          </div>
        )

      case 'business':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {step.title}
              </h2>
              <p className="text-gray-600">
                {step.subtitle}
              </p>
            </div>

            {/* Nome do Negócio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qual o nome do seu negócio ou marca?
              </label>
              <input
                type="text"
                value={formData.nomeNegocio}
                onChange={(e) => handleInputChange('nomeNegocio', e.target.value)}
                placeholder="Ex: Cafeteria do João"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Usaremos isso para personalizar seus posts e legendas.
              </p>
            </div>

            {/* Nicho */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Em qual nicho você atua?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {NICHOS.map((nicho) => (
                  <button
                    key={nicho.id}
                    onClick={() => handleInputChange('nicho', nicho.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.nicho === nicho.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{nicho.icon}</div>
                    <div className="text-sm font-medium text-gray-700">{nicho.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descreva seu negócio em uma ou duas frases.
              </label>
              <textarea
                value={formData.descricaoNegocio}
                onChange={(e) => handleInputChange('descricaoNegocio', e.target.value)}
                placeholder="Ex: Cafeteria em Saquarema com foco em grãos especiais e ambiente aconchegante."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Quanto mais soubermos, mais autêntico será o seu conteúdo.
              </p>
            </div>
          </div>
        )

      case 'brand':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {step.title}
              </h2>
              <p className="text-gray-600">
                {step.subtitle}
              </p>
            </div>

            {/* Público-Alvo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quem é o seu cliente ideal?
              </label>
              <input
                type="text"
                value={formData.publicoAlvo}
                onChange={(e) => handleInputChange('publicoAlvo', e.target.value)}
                placeholder="Ex: Jovens universitários, mulheres de 30 a 50 anos, outras empresas (B2B)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Tom de Voz */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qual tom de voz sua marca usa para se comunicar? (Selecione até 3)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.tomVoz.includes(tom.id)
                        ? 'border-blue-500 bg-blue-50'
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
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Passo {currentStep} de {steps.length}
              </h1>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <button
              onClick={() => onComplete()}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6">
          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg"
            >
              ← Anterior
            </Button>

            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg"
              >
                Próximo →
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed() || isLoading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg"
              >
                {isLoading ? 'Concluindo...' : '✨ Concluir e Começar a Criar!'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
