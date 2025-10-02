'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function ObrigadoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🙏</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Muito Obrigado!
            </h1>
            <p className="text-xl text-gray-600">
              Sua confiança em nós é o que nos motiva todos os dias
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">💝</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Você faz parte da nossa família!
            </h2>
            
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Obrigado por escolher o NichoFy para transformar sua presença digital. 
              Estamos aqui para ajudar você a criar conteúdo incrível e alcançar seus objetivos.
            </p>

            {/* Estatísticas */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
                <div className="text-gray-600">Usuários Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">50K+</div>
                <div className="text-gray-600">Textos Criados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                <div className="text-gray-600">Satisfação</div>
              </div>
            </div>
          </div>
        </div>

        {/* Depoimentos */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            💬 O que nossos usuários dizem
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  M
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Maria Silva</h4>
                  <p className="text-gray-600 text-sm">Empreendedora</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "O NichoFy revolucionou minha estratégia de conteúdo. 
                Agora consigo criar posts profissionais em minutos!"
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  J
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">João Santos</h4>
                  <p className="text-gray-600 text-sm">Influencer</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "A qualidade dos textos gerados é impressionante. 
                Meu engajamento aumentou 300% desde que comecei a usar!"
              </p>
            </div>
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email de Boas-vindas</h3>
              <p className="text-gray-600 text-sm mb-4">
                Enviamos um email com dicas exclusivas para você começar
              </p>
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Verificar Email
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Guia de Início</h3>
              <p className="text-gray-600 text-sm mb-4">
                Acesse nosso guia completo para aproveitar ao máximo
              </p>
              <Button
                onClick={() => router.push('/exemplos')}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                Ver Guia
              </Button>
            </div>
          </div>
        </div>

        {/* Comunidade */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🌟 Junte-se à Nossa Comunidade
            </h3>
            <p className="text-gray-600 mb-6">
              Conecte-se com outros criadores e troque experiências
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.open('https://instagram.com/nichofy', '_blank')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                📸 Instagram
              </Button>
              <Button
                onClick={() => window.open('https://linkedin.com/company/nichofy', '_blank')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                💼 LinkedIn
              </Button>
              <Button
                onClick={() => window.open('https://discord.gg/nichofy', '_blank')}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
              >
                💬 Discord
              </Button>
            </div>
          </div>
        </div>

        {/* Ação Principal */}
        <div className="text-center">
          <Button
            onClick={() => router.push('/dashboard')}
            className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            🚀 Começar Minha Jornada
          </Button>
          
          <p className="text-gray-500 mt-4">
            Obrigado por fazer parte da nossa história! 💜
          </p>
        </div>
      </div>
    </div>
  )
}