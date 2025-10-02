'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface UpsellOffer {
  id: string
  title: string
  description: string
  originalPrice: number
  discountPrice: number
  discount: string
  features: string[]
  icon: string
  color: string
  paymentLink: string
  limitedTime?: boolean
}

const UPSELL_OFFERS: UpsellOffer[] = [
  {
    id: 'pro-upgrade',
    title: 'Upgrade para Profissional',
    description: 'Libere todo o potencial da plataforma',
    originalPrice: 49.90,
    discountPrice: 29.90,
    discount: '40% OFF',
    features: [
      '50 textos por mês (vs 15 do Básico)',
      'Templates premium exclusivos',
      'Analytics avançados',
      'Suporte prioritário',
      'Identidade da marca completa',
      'Recursos extras ilimitados'
    ],
    icon: '⭐',
    color: 'from-blue-500 to-purple-600',
    paymentLink: 'https://pay.kirvano.com/pro-upgrade-link',
    limitedTime: true
  },
  {
    id: 'enterprise-upgrade',
    title: 'Upgrade para Empresarial',
    description: 'Para empresas que querem escalar',
    originalPrice: 149.90,
    discountPrice: 99.90,
    discount: '33% OFF',
    features: [
      'Textos ilimitados',
      'Todos os templates',
      'Analytics completos',
      'Suporte dedicado',
      'API personalizada',
      'Integrações avançadas',
      'Dashboard empresarial',
      'Treinamento personalizado'
    ],
    icon: '🏢',
    color: 'from-purple-500 to-pink-600',
    paymentLink: 'https://pay.kirvano.com/enterprise-upgrade-link',
    limitedTime: true
  }
]

export default function UpsellPage() {
  const router = useRouter()
  const [selectedOffer, setSelectedOffer] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleOfferSelection = async (offerId: string) => {
    const offer = UPSELL_OFFERS.find(o => o.id === offerId)
    if (!offer) return

    setIsLoading(true)
    
    try {
      // Abrir link de pagamento
      window.open(offer.paymentLink, '_blank', 'noopener,noreferrer')
      
      // Log do evento
      console.log('🚀 Upsell selecionado:', {
        offer: offer.title,
        price: offer.discountPrice,
        link: offer.paymentLink
      })
      
    } catch (error) {
      console.error('Erro ao processar upsell:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSelectedOffer = () => UPSELL_OFFERS.find(offer => offer.id === selectedOffer)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
              Oferta Especial Exclusiva!
            </h1>
            <p className="text-xl text-gray-600">
              Aproveite esta oportunidade única para maximizar seus resultados
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Banner de Oferta Limitada */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 mb-8 text-center text-white">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl">⏰</span>
            <span className="text-lg font-semibold">OFERTA LIMITADA</span>
            <span className="text-2xl">⏰</span>
          </div>
          <p className="text-lg">
            Esta oferta especial está disponível apenas por tempo limitado!
          </p>
        </div>

        {/* Ofertas */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {UPSELL_OFFERS.map((offer) => (
            <div
              key={offer.id}
              className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 cursor-pointer ${
                selectedOffer === offer.id
                  ? 'border-orange-500 scale-105 shadow-2xl'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-2xl'
              }`}
              onClick={() => setSelectedOffer(offer.id)}
            >
              
              {/* Badge de Tempo Limitado */}
              {offer.limitedTime && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    🔥 TEMPO LIMITADO
                  </div>
                </div>
              )}

              {/* Header da Oferta */}
              <div className={`p-8 rounded-t-2xl bg-gradient-to-r ${offer.color} text-white`}>
                <div className="text-center">
                  <div className="text-4xl mb-4">{offer.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-white/90 mb-4">{offer.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-4xl font-bold">R$ {offer.discountPrice.toFixed(2)}</span>
                      <span className="text-xl text-white/60 line-through">R$ {offer.originalPrice.toFixed(2)}</span>
                    </div>
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                      {offer.discount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="p-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">O que você ganha:</h4>
                <ul className="space-y-3">
                  {offer.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-3 mt-1">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Selection Indicator */}
              {selectedOffer === offer.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Resumo da Seleção */}
        {selectedOffer && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Resumo da Oferta</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getSelectedOffer()?.color} flex items-center justify-center text-2xl text-white`}>
                  {getSelectedOffer()?.icon}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{getSelectedOffer()?.title}</h4>
                  <p className="text-gray-600">{getSelectedOffer()?.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  R$ {getSelectedOffer()?.discountPrice.toFixed(2)}
                </div>
                <div className="text-gray-600">por mês</div>
                <div className="text-green-600 font-semibold">
                  Economia de R$ {(getSelectedOffer()?.originalPrice! - getSelectedOffer()?.discountPrice!).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Garantias */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🛡️ Garantias que Oferecemos
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Garantia de 30 dias</h4>
              <p className="text-gray-600 text-sm">
                Se não ficar satisfeito, devolvemos seu dinheiro
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Pagamento Seguro</h4>
              <p className="text-gray-600 text-sm">
                Transações protegidas pela Kirvano
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Ativação Imediata</h4>
              <p className="text-gray-600 text-sm">
                Acesso liberado instantaneamente
              </p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="text-center space-y-6">
          <Button
            onClick={() => handleOfferSelection(selectedOffer)}
            disabled={!selectedOffer || isLoading}
            className={`px-12 py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
              selectedOffer && !isLoading
                ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processando...
              </div>
            ) : (
              `💳 Aproveitar Oferta - R$ ${getSelectedOffer()?.discountPrice.toFixed(2)}/mês`
            )}
          </Button>
          
          {!selectedOffer && (
            <p className="text-gray-500">
              Selecione uma oferta para continuar
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3"
            >
              Pular por Agora
            </Button>
            
            <Button
              onClick={() => router.push('/planos')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Ver Todos os Planos
            </Button>
          </div>
        </div>

        {/* Urgência */}
        <div className="mt-12 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-4xl mx-auto">
            <h4 className="text-lg font-semibold text-red-900 mb-2">⏰ Última Chance!</h4>
            <p className="text-red-800">
              Esta oferta especial expira em breve. Não perca a oportunidade de maximizar seus resultados!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}