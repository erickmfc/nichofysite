'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/Button'

interface Plan {
  id: string
  name: string
  price: number
  originalPrice?: number
  period: string
  features: string[]
  popular?: boolean
  color: string
  icon: string
  description: string
  discount?: string
  paymentLink?: string
  limitations: {
    postsPerMonth: number
    templates: number
    analytics: boolean
    support: string
    customBranding: boolean
  }
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    period: 'Sempre grátis',
    features: [
      '3 textos por mês',
      'Templates básicos',
      'Suporte por email',
      'Dashboard básico',
      'Identidade da marca'
    ],
    color: 'from-gray-500 to-gray-600',
    icon: '🆓',
    description: 'Perfeito para começar e testar nossa plataforma',
    limitations: {
      postsPerMonth: 3,
      templates: 5,
      analytics: false,
      support: 'email',
      customBranding: false
    }
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 15.00,
    originalPrice: 49.90,
    period: 'por mês',
    features: [
      '15 textos por mês',
      'Templates profissionais',
      'Suporte prioritário',
      'Dashboard completo',
      'Identidade da marca',
      'Analytics básicos',
      'Integração com redes sociais'
    ],
    color: 'from-green-500 to-emerald-600',
    icon: '🚀',
    description: 'Ideal para começar com recursos profissionais',
    discount: '5% OFF',
    paymentLink: 'https://pay.kirvano.com/e727b9f0-bf05-4862-b4ec-ba31d0f33c93',
    limitations: {
      postsPerMonth: 15,
      templates: 15,
      analytics: true,
      support: 'priority',
      customBranding: true
    }
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: 29.90,
    period: 'por mês',
    features: [
      '50 textos por mês',
      'Templates premium',
      'Analytics avançados',
      'Suporte prioritário',
      'Identidade da marca completa',
      'Recursos extras',
      'Dashboard pessoal'
    ],
    popular: true,
    color: 'from-blue-500 to-purple-600',
    icon: '⭐',
    description: 'Ideal para profissionais e pequenos negócios',
    limitations: {
      postsPerMonth: 50,
      templates: 25,
      analytics: true,
      support: 'priority',
      customBranding: true
    }
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: 99.90,
    period: 'por mês',
    features: [
      'Textos ilimitados',
      'Todos os templates',
      'Analytics completos',
      'Suporte dedicado',
      'Identidade da marca premium',
      'Todos os recursos',
      'Dashboard empresarial',
      'API personalizada',
      'Integrações avançadas'
    ],
    color: 'from-purple-500 to-pink-600',
    icon: '🏢',
    description: 'Para empresas que precisam de escala e personalização',
    limitations: {
      postsPerMonth: -1, // Ilimitado
      templates: -1, // Ilimitado
      analytics: true,
      support: 'dedicated',
      customBranding: true
    }
  }
]

export const PlanSelection = ({ onPlanSelected }: { onPlanSelected: (planId: string) => void }) => {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handlePlanSelection = async () => {
    if (!selectedPlan || !user) return

    const selectedPlanData = PLANS.find(plan => plan.id === selectedPlan)
    
    // Registrar evento de seleção de plano
    await ConversionTrackingService.trackPlanSelection({
      userId: user.uid,
      planId: selectedPlan,
      planName: selectedPlanData?.name || '',
      amount: selectedPlanData?.price.toString() || '0',
      userAgent: navigator.userAgent,
      referrer: document.referrer
    })
    
    // Se o plano tem link de pagamento (Kirvano), redirecionar diretamente
    if (selectedPlanData?.paymentLink) {
      // Registrar evento de redirecionamento para pagamento
      await ConversionTrackingService.trackPaymentRedirect({
        userId: user.uid,
        planId: selectedPlan,
        planName: selectedPlanData.name,
        amount: selectedPlanData.price.toString(),
        paymentLink: selectedPlanData.paymentLink,
        userAgent: navigator.userAgent
      })
      
      // Abrir link de pagamento em nova aba
      window.open(selectedPlanData.paymentLink, '_blank', 'noopener,noreferrer')
      
      // Log do evento de conversão
      console.log('🚀 Redirecionando para pagamento Kirvano:', {
        plan: selectedPlanData.name,
        price: selectedPlanData.price,
        link: selectedPlanData.paymentLink,
        userId: user.uid
      })
      
      return
    }

    // Para planos sem pagamento (gratuito), continuar com o fluxo normal
    setIsLoading(true)
    
    try {
      // Atualizar o plano do usuário no Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        plan: selectedPlan,
        planSelectedAt: new Date(),
        planStatus: 'active',
        updatedAt: new Date()
      })

      // Chamar callback para continuar o fluxo
      onPlanSelected(selectedPlan)
      
    } catch (error) {
      console.error('Erro ao selecionar plano:', error)
      alert('Erro ao selecionar plano. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const getSelectedPlan = () => PLANS.find(plan => plan.id === selectedPlan)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Selecione o plano que melhor se adapta às suas necessidades e comece a criar conteúdo incrível!
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 cursor-pointer ${
                selectedPlan === plan.id
                  ? 'border-blue-500 scale-105 shadow-2xl'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-2xl'
              } ${plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    ⭐ Mais Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className={`p-8 rounded-t-2xl bg-gradient-to-r ${plan.color} text-white`}>
                <div className="text-center">
                  <div className="text-4xl mb-4">{plan.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-white/90 mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-4xl font-bold">R$ {plan.price.toFixed(2)}</span>
                      {plan.originalPrice && (
                        <span className="text-xl text-white/60 line-through">R$ {plan.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <span className="text-white/80 ml-2">{plan.period}</span>
                    {plan.discount && (
                      <div className="mt-2">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {plan.discount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Plan Features */}
              <div className="p-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">O que está incluído:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-3 mt-1">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Limitations */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-2">Limitações:</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>📝 {plan.limitations.postsPerMonth === -1 ? 'Textos ilimitados' : `${plan.limitations.postsPerMonth} textos/mês`}</div>
                    <div>📋 {plan.limitations.templates === -1 ? 'Templates ilimitados' : `${plan.limitations.templates} templates`}</div>
                    <div>📊 {plan.limitations.analytics ? 'Analytics completos' : 'Analytics básicos'}</div>
                    <div>🎨 {plan.limitations.customBranding ? 'Branding personalizado' : 'Branding padrão'}</div>
                    <div>💬 Suporte: {plan.limitations.support}</div>
                  </div>
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedPlan === plan.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selection Summary */}
        {selectedPlan && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Resumo da Seleção</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getSelectedPlan()?.color} flex items-center justify-center text-2xl text-white`}>
                  {getSelectedPlan()?.icon}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{getSelectedPlan()?.name}</h4>
                  <p className="text-gray-600">{getSelectedPlan()?.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  R$ {getSelectedPlan()?.price.toFixed(2)}
                </div>
                <div className="text-gray-600">{getSelectedPlan()?.period}</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center">
          <Button
            onClick={handlePlanSelection}
            disabled={!selectedPlan || isLoading}
            className={`px-12 py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
              selectedPlan && !isLoading
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processando...
              </div>
            ) : getSelectedPlan()?.paymentLink ? (
              `💳 Assinar ${getSelectedPlan()?.name} - R$ ${getSelectedPlan()?.price.toFixed(2)}/mês`
            ) : (
              'Continuar com este Plano'
            )}
          </Button>
          
          {!selectedPlan && (
            <p className="text-gray-500 mt-4">
              Selecione um plano para continuar
            </p>
          )}
          
          {getSelectedPlan()?.paymentLink && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2 text-green-800">
                <span className="text-lg">🔒</span>
                <span className="text-sm font-medium">Pagamento 100% seguro via Kirvano</span>
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-4xl mx-auto">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">💡 Dica Importante</h4>
            <p className="text-blue-800">
              Você pode alterar seu plano a qualquer momento. Comece com o plano gratuito e faça upgrade conforme suas necessidades crescem!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
