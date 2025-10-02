'use client'

import { useAuth } from '@/hooks/useAuth'
import { useUserPlan } from '@/hooks/useUserPlan'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'

export default function PagamentoAprovadoPage() {
  const { user } = useAuth()
  const { userPlan, getPlanName } = useUserPlan()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Processando seu pagamento...</h2>
          <p className="text-gray-600 mt-2">Aguarde um momento</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Pagamento Aprovado!
            </h1>
            <p className="text-xl text-gray-600">
              Sua assinatura foi ativada com sucesso
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Card de Sucesso */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-green-600">✅</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bem-vindo ao NichoFy!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Seu pagamento foi processado com sucesso e sua conta foi ativada. 
              Agora você tem acesso completo a todos os recursos do seu plano.
            </p>

            {/* Informações do Plano */}
            {userPlan && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Seu Plano Ativo</h3>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl text-white">
                    {userPlan.plan === 'basic' ? '🚀' : userPlan.plan === 'pro' ? '⭐' : '🏢'}
                  </div>
                  <div className="text-left">
                    <h4 className="text-xl font-bold text-gray-900">{getPlanName()}</h4>
                    <p className="text-gray-600">Plano ativo desde hoje</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Configure seu Perfil</h3>
            <p className="text-gray-600 text-sm mb-4">
              Complete seu perfil para personalizar sua experiência
            </p>
            <Button
              onClick={() => router.push('/perfil')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Ir para Perfil
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
            <div className="text-3xl mb-4">✨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Crie seu Primeiro Conteúdo</h3>
            <p className="text-gray-600 text-sm mb-4">
              Comece criando textos incríveis para suas redes sociais
            </p>
            <Button
              onClick={() => router.push('/criar-conteudo')}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Criar Conteúdo
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Explore o Dashboard</h3>
            <p className="text-gray-600 text-sm mb-4">
              Acesse todas as funcionalidades da plataforma
            </p>
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Ver Dashboard
            </Button>
          </div>
        </div>

        {/* Recursos Disponíveis */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 Recursos Disponíveis
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">Geração de textos com IA</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">Templates profissionais</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">Identidade da marca</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">Dashboard personalizado</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">Analytics avançados</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">Suporte prioritário</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">Recursos extras</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">Integração com redes sociais</span>
              </div>
            </div>
          </div>
        </div>

        {/* Suporte */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            💬 Precisa de Ajuda?
          </h3>
          <p className="text-gray-600 mb-6">
            Nossa equipe está pronta para ajudar você a aproveitar ao máximo sua assinatura
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/suporte')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Entrar em Contato
            </Button>
            <Button
              onClick={() => router.push('/faq')}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Ver FAQ
            </Button>
          </div>
        </div>

        {/* Ação Principal */}
        <div className="text-center mt-8">
          <Button
            onClick={() => router.push('/dashboard')}
            className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            🎯 Começar a Usar Agora
          </Button>
        </div>
      </div>
    </div>
  )
}