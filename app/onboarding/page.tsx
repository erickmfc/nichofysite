'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: string
  completed: boolean
  required: boolean
  action?: string
  url?: string
}

interface OnboardingProgress {
  userId: string
  currentStep: number
  totalSteps: number
  completedSteps: string[]
  startedAt: Timestamp
  completedAt?: Timestamp
  skippedSteps: string[]
}

export default function OnboardingInteligente() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState<OnboardingProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showTour, setShowTour] = useState(false)

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bem-vindo ao NichoFy Premium!',
      description: 'Vamos configurar sua conta para aproveitar ao máximo todos os recursos.',
      icon: '🎉',
      completed: false,
      required: true
    },
    {
      id: 'profile',
      title: 'Complete seu Perfil',
      description: 'Adicione informações sobre você e seu negócio para personalizar sua experiência.',
      icon: '👤',
      completed: false,
      required: true,
      action: 'Completar Perfil',
      url: '/perfil'
    },
    {
      id: 'preferences',
      title: 'Configure suas Preferências',
      description: 'Defina seu estilo de conteúdo, nichos de interesse e plataformas preferidas.',
      icon: '⚙️',
      completed: false,
      required: true,
      action: 'Configurar Preferências',
      url: '/preferencias-conteudo'
    },
    {
      id: 'first_content',
      title: 'Crie seu Primeiro Conteúdo',
      description: 'Experimente nossa IA e crie seu primeiro post profissional.',
      icon: '✍️',
      completed: false,
      required: true,
      action: 'Criar Conteúdo',
      url: '/criar-conteudo'
    },
    {
      id: 'dashboard_tour',
      title: 'Explore o Dashboard',
      description: 'Conheça todas as funcionalidades disponíveis na sua área premium.',
      icon: '📊',
      completed: false,
      required: false,
      action: 'Iniciar Tour',
      url: '#'
    },
    {
      id: 'notifications',
      title: 'Configure Notificações',
      description: 'Escolha como e quando receber atualizações sobre seus conteúdos.',
      icon: '🔔',
      completed: false,
      required: false,
      action: 'Configurar Notificações',
      url: '/configuracoes'
    },
    {
      id: 'integrations',
      title: 'Conecte suas Redes Sociais',
      description: 'Integre suas contas do Instagram, LinkedIn e outras plataformas.',
      icon: '🔌',
      completed: false,
      required: false,
      action: 'Conectar Redes',
      url: '/redes-sociais'
    },
    {
      id: 'support',
      title: 'Conheça o Suporte',
      description: 'Saiba como acessar nossa equipe de suporte prioritário.',
      icon: '💬',
      completed: false,
      required: false,
      action: 'Conhecer Suporte',
      url: '/comunicacao-admin'
    }
  ]

  useEffect(() => {
    if (user) {
      loadOnboardingProgress()
    }
  }, [user])

  const loadOnboardingProgress = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      const userRef = doc(db, 'onboardingProgress', user.uid)
      const docSnap = await getDoc(userRef)
      
      if (docSnap.exists()) {
        const userProgress = docSnap.data() as OnboardingProgress
        setProgress(userProgress)
        
        // Encontrar o próximo passo não completado
        const nextStepIndex = onboardingSteps.findIndex(step => 
          !userProgress.completedSteps.includes(step.id)
        )
        setCurrentStep(nextStepIndex >= 0 ? nextStepIndex : onboardingSteps.length - 1)
      } else {
        // Primeira vez - inicializar progresso
        const newProgress: OnboardingProgress = {
          userId: user.uid,
          currentStep: 0,
          totalSteps: onboardingSteps.length,
          completedSteps: [],
          startedAt: Timestamp.now(),
          skippedSteps: []
        }
        setProgress(newProgress)
        setCurrentStep(0)
      }
    } catch (error) {
      console.error('Erro ao carregar progresso do onboarding:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const completeStep = async (stepId: string) => {
    if (!user || !progress) return
    
    try {
      const updatedCompletedSteps = [...progress.completedSteps, stepId]
      const nextStepIndex = onboardingSteps.findIndex(step => 
        !updatedCompletedSteps.includes(step.id)
      )
      
      const updatedProgress: OnboardingProgress = {
        ...progress,
        currentStep: nextStepIndex >= 0 ? nextStepIndex : onboardingSteps.length - 1,
        completedSteps: updatedCompletedSteps,
        completedAt: updatedCompletedSteps.length === onboardingSteps.length ? Timestamp.now() : undefined
      }
      
      // Atualizar no Firebase
      const userRef = doc(db, 'onboardingProgress', user.uid)
      await updateDoc(userRef, updatedProgress)
      
      setProgress(updatedProgress)
      setCurrentStep(updatedProgress.currentStep)
      
      console.log('✅ Passo completado:', stepId)
      
    } catch (error) {
      console.error('Erro ao completar passo:', error)
    }
  }

  const skipStep = async (stepId: string) => {
    if (!user || !progress) return
    
    try {
      const updatedSkippedSteps = [...progress.skippedSteps, stepId]
      const nextStepIndex = onboardingSteps.findIndex(step => 
        !progress.completedSteps.includes(step.id) && !updatedSkippedSteps.includes(step.id)
      )
      
      const updatedProgress: OnboardingProgress = {
        ...progress,
        currentStep: nextStepIndex >= 0 ? nextStepIndex : onboardingSteps.length - 1,
        skippedSteps: updatedSkippedSteps
      }
      
      const userRef = doc(db, 'onboardingProgress', user.uid)
      await updateDoc(userRef, updatedProgress)
      
      setProgress(updatedProgress)
      setCurrentStep(updatedProgress.currentStep)
      
      console.log('⏭️ Passo pulado:', stepId)
      
    } catch (error) {
      console.error('Erro ao pular passo:', error)
    }
  }

  const startDashboardTour = () => {
    setShowTour(true)
    // Aqui você implementaria um tour guiado real
    // Por enquanto, vamos apenas mostrar um modal
    alert('🎯 Tour do Dashboard iniciado! Em breve você terá um tour interativo completo.')
    completeStep('dashboard_tour')
  }

  const handleStepAction = (step: OnboardingStep) => {
    if (step.id === 'dashboard_tour') {
      startDashboardTour()
    } else if (step.url && step.url !== '#') {
      router.push(step.url)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Preparando seu Onboarding</h2>
          <p className="text-gray-600">Configurando sua experiência personalizada...</p>
        </div>
      </div>
    )
  }

  if (!progress || currentStep >= onboardingSteps.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Parabéns!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Você completou o onboarding e está pronto para aproveitar todos os recursos do NichoFy Premium!
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            🚀 Ir para Dashboard
          </button>
        </div>
      </div>
    )
  }

  const currentStepData = onboardingSteps[currentStep]
  const progressPercentage = ((progress.completedSteps.length / onboardingSteps.length) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎓 Onboarding Inteligente
              </h1>
              <p className="text-gray-600 mt-1">Configure sua conta para aproveitar ao máximo</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {progress.completedSteps.length}/{onboardingSteps.length}
              </div>
              <div className="text-sm text-gray-600">Passos Completos</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {Math.round(progressPercentage)}% concluído
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Current Step */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 text-center text-white">
            <div className="text-6xl mb-4">{currentStepData.icon}</div>
            <h2 className="text-3xl font-bold mb-2">{currentStepData.title}</h2>
            <p className="text-xl opacity-90">{currentStepData.description}</p>
          </div>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                Passo {currentStep + 1} de {onboardingSteps.length}
              </div>
              <p className="text-gray-600">
                {currentStepData.required ? 'Este passo é obrigatório' : 'Este passo é opcional'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentStepData.action && (
                <button
                  onClick={() => handleStepAction(currentStepData)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {currentStepData.action}
                </button>
              )}
              
              {!currentStepData.required && (
                <button
                  onClick={() => skipStep(currentStepData.id)}
                  className="bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  ⏭️ Pular
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Steps Overview */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Roteiro Completo</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {onboardingSteps.map((step, index) => (
              <div
                key={step.id}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  index === currentStep
                    ? 'border-blue-500 bg-blue-50'
                    : progress?.completedSteps.includes(step.id)
                    ? 'border-green-500 bg-green-50'
                    : progress?.skippedSteps.includes(step.id)
                    ? 'border-gray-300 bg-gray-50 opacity-60'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{step.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {progress?.completedSteps.includes(step.id) && (
                        <span className="text-green-600 text-sm font-medium">✅ Concluído</span>
                      )}
                      {progress?.skippedSteps.includes(step.id) && (
                        <span className="text-gray-500 text-sm font-medium">⏭️ Pulado</span>
                      )}
                      {index === currentStep && (
                        <span className="text-blue-600 text-sm font-medium">🎯 Atual</span>
                      )}
                      {step.required && (
                        <span className="text-red-500 text-sm font-medium">* Obrigatório</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Dicas para aproveitar ao máximo:</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Complete todos os passos obrigatórios para desbloquear recursos premium</li>
            <li>• Configure suas preferências para receber conteúdo personalizado</li>
            <li>• Explore o dashboard para conhecer todas as funcionalidades</li>
            <li>• Use o suporte prioritário sempre que precisar de ajuda</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
