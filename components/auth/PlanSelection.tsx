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
    name: 'Teste Grátis',
    price: 0,
    period: '14 dias',
    features: [
      '10 posts criados por profissionais',
      'Válido por 14 dias',
      '1 nicho especializado à sua escolha',
      'Sugestão de hashtags para cada post',
      'Suporte via chat de texto'
    ],
    color: 'from-blue-500 to-blue-600',
    icon: '🎯',
    description: 'Perfeito para experimentar',
    limitations: {
      postsPerMonth: 10,
      templates: 5,
      analytics: false,
      support: 'chat',
      customBranding: false
    }
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 49.90,
    period: 'por mês',
    features: [
      '20 posts profissionais por mês',
      '1 nicho especializado à sua escolha',
      'Acesso a templates padrão',
      'Sugestão de hashtags para cada post',
      'Suporte via e-mail'
    ],
    color: 'from-green-500 to-emerald-600',
    icon: '🚀',
    description: 'Ideal para autônomos e projetos iniciantes',
    paymentLink: 'https://pay.kirvano.com/e727b9f0-bf05-4862-b4ec-ba31d0f33c93',
    limitations: {
      postsPerMonth: 20,
      templates: 10,
      analytics: false,
      support: 'email',
      customBranding: false
    }
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: 149.90,
    period: 'por mês',
    features: [
      '50 posts profissionais por mês',
      'Até 3 nichos especializados',
      'Suporte prioritário via WhatsApp',
      'Acesso a todos os templates (Padrão + Premium)',
      'Sugestão de hashtags estratégicas',
      '"Paleta de Ideias Rápidas" no dashboard',
      'Agendador de Posts (BETA)',
      'Relatórios de performance simplificados'
    ],
    popular: true,
    color: 'from-orange-500 to-orange-600',
    icon: '⭐',
    description: 'Solução completa para crescer e se destacar',
    limitations: {
      postsPerMonth: 50,
      templates: -1, // Ilimitado
      analytics: true,
      support: 'whatsapp',
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
    
    // Se o plano tem link de pagamento (Kirvano), redirecionar diretamente
    if (selectedPlanData?.paymentLink) {
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
              className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer ${
                selectedPlan === plan.id
                  ? 'ring-2 ring-blue-500 scale-105'
                  : ''
              } ${plan.popular ? 'border-2 border-orange-500 relative' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    ⭐ MAIS POPULAR ⭐
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    R$ {plan.price.toFixed(2)}<span className="text-lg text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="text-gray-700">{plan.description}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="text-green-500">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Selection Indicator */}
                {selectedPlan === plan.id && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">✓ Plano Selecionado</span>
                    </div>
                  </div>
                )}
              </div>
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
            ) : selectedPlan === 'free' ? (
              'Começar meu teste grátis'
            ) : selectedPlan === 'basic' ? (
              'Assinar Plano Básico'
            ) : (
              'Assinar Plano Profissional'
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
