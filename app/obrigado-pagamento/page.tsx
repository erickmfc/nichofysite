'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ObrigadoPagamentoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'error' | 'pending'>('pending')
  const [paymentData, setPaymentData] = useState<any>(null)

  useEffect(() => {
    const status = searchParams.get('status') || 'success'
    const plano = searchParams.get('plano') || 'básico'
    const transactionId = searchParams.get('transaction_id')
    
    setPaymentStatus(status as any)
    
    setPaymentData({
      plano,
      transactionId: transactionId || 'TXN' + Date.now(),
      amount: '15.00',
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR')
    })

    // Log do evento
    console.log('🎉 Retorno do pagamento Kirvano:', { status, plano, transactionId })
  }, [searchParams])

  const handleGoToLogin = () => {
    router.push('/login')
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  if (paymentStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 text-center text-white">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-3xl font-bold mb-2">Pagamento Não Processado</h2>
              <p className="text-xl opacity-90">Ocorreu um problema com seu pagamento</p>
            </div>
            
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">O que fazer agora?</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <span className="text-red-600 mt-1">1️⃣</span>
                  <span className="text-gray-700">Verifique os dados do seu cartão</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-red-600 mt-1">2️⃣</span>
                  <span className="text-gray-700">Tente novamente com outro método de pagamento</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-red-600 mt-1">3️⃣</span>
                  <span className="text-gray-700">Entre em contato conosco se o problema persistir</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/planos')}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  🔄 Tentar Novamente
                </button>
                <Link
                  href="/suporte"
                  className="bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  📞 Suporte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                🎉 Pagamento Confirmado!
              </h1>
              <p className="text-gray-600 mt-2">Bem-vindo ao Plano {paymentData?.plano}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
          
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 text-center text-white">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold mb-2">Parabéns!</h2>
            <p className="text-xl opacity-90">Seu pagamento foi processado com sucesso</p>
          </div>

          {/* Payment Details */}
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Detalhes do Pagamento</h3>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Plano:</span>
                    <span className="font-bold text-gray-900">Plano {paymentData?.plano}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Valor:</span>
                    <span className="font-bold text-green-600">R$ {paymentData?.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Data:</span>
                    <span className="font-bold text-gray-900">{paymentData?.date}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Horário:</span>
                    <span className="font-bold text-gray-900">{paymentData?.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Status:</span>
                    <span className="font-bold text-green-600">✅ Aprovado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">ID da Transação:</span>
                    <span className="font-bold text-blue-600 text-sm">{paymentData?.transactionId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <h4 className="text-lg font-bold text-blue-900 mb-4">🚀 Próximos Passos</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 mt-1">1️⃣</span>
                  <span className="text-blue-800">Faça login na sua conta para acessar todos os recursos</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 mt-1">2️⃣</span>
                  <span className="text-blue-800">Configure seu perfil e preferências</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 mt-1">3️⃣</span>
                  <span className="text-blue-800">Comece a criar conteúdo profissional</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 mt-1">4️⃣</span>
                  <span className="text-blue-800">Explore todos os recursos do Plano Básico</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGoToLogin}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                🔐 Fazer Login
              </button>
              <button
                onClick={handleGoToDashboard}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                📊 Ir para Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">🎁 O que você ganhou com o Plano Básico</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-4xl mb-3">📝</div>
              <h4 className="font-bold text-gray-900 mb-2">15 Textos por Mês</h4>
              <p className="text-gray-600 text-sm">Crie conteúdo profissional mensalmente</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🎨</div>
              <h4 className="font-bold text-gray-900 mb-2">Templates Profissionais</h4>
              <p className="text-gray-600 text-sm">Acesso a templates exclusivos</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">📊</div>
              <h4 className="font-bold text-gray-900 mb-2">Analytics Básicos</h4>
              <p className="text-gray-600 text-sm">Acompanhe performance dos seus posts</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">💬</div>
              <h4 className="font-bold text-gray-900 mb-2">Suporte Prioritário</h4>
              <p className="text-gray-600 text-sm">Atendimento rápido e eficiente</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🔌</div>
              <h4 className="font-bold text-gray-900 mb-2">Integração Social</h4>
              <p className="text-gray-600 text-sm">Conecte com suas redes sociais</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🎯</div>
              <h4 className="font-bold text-gray-900 mb-2">Identidade da Marca</h4>
              <p className="text-gray-600 text-sm">Personalize sua identidade visual</p>
            </div>
          </div>
        </div>

        {/* Kirvano Trust */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">🔒 Pagamento Processado pela Kirvano</h3>
          <p className="text-lg mb-6 opacity-90">
            Seu pagamento foi processado com segurança pela plataforma Kirvano, garantindo máxima proteção dos seus dados.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm opacity-80">
            <span>✅ Compra 100% segura</span>
            <span>✅ Tecnologia Kirvano © 2025</span>
            <span>✅ Todos os direitos reservados</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p>Precisa de ajuda? <Link href="/suporte" className="text-blue-600 hover:text-blue-800">Entre em contato</Link></p>
          <p className="text-sm mt-2">Bem-vindo à família NichoFy! 🎉</p>
        </div>
      </div>
    </div>
  )
}

export default function ObrigadoPagamentoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processando...</h2>
          <p className="text-gray-600">Verificando dados do pagamento...</p>
        </div>
      </div>
    }>
      <ObrigadoPagamentoContent />
    </Suspense>
  )
}
