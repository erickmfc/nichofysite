'use client'

import { ResponsiveTemplate } from '@/components/ui/ResponsiveTemplate'
import { Button } from '@/components/ui/Button'

export default function PrecosPage() {
  return (
    <ResponsiveTemplate
      colorScheme="success"
      title="Nossos Preços"
      subtitle="Planos flexíveis para atender desde pequenos negócios até grandes empresas"
      features={["💰 Sem taxas ocultas", "🔄 Cancelamento flexível", "📞 Suporte 24/7"]}
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Escolha seu Plano
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Planos transparentes e sem surpresas. Escolha o que melhor se adapta ao seu negócio.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Plano Básico */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up">
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Básico</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                R$ 97<span className="text-lg text-gray-600">/mês</span>
              </div>
              <p className="text-gray-600">Perfeito para começar</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>50 posts por mês</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>3 nichos incluídos</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Suporte por email</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Templates básicos</span>
              </li>
            </ul>
            
            <Button 
              variant="outline" 
              className="w-full group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all duration-300"
            >
              Escolher Plano
            </Button>
          </div>
        </div>

        {/* Plano Profissional */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up border-2 border-green-500 relative" style={{ animationDelay: '0.1s' }}>
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              MAIS POPULAR
            </span>
          </div>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Profissional</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                R$ 197<span className="text-lg text-gray-600">/mês</span>
              </div>
              <p className="text-gray-600">Para negócios em crescimento</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>200 posts por mês</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>10 nichos incluídos</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Suporte prioritário</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Templates premium</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Análise de métricas</span>
              </li>
            </ul>
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
            >
              Escolher Plano
            </Button>
          </div>
        </div>

        {/* Plano Empresarial */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Empresarial</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                R$ 497<span className="text-lg text-gray-600">/mês</span>
              </div>
              <p className="text-gray-600">Para grandes empresas</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Posts ilimitados</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Todos os nichos</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Suporte dedicado</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Templates exclusivos</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Consultoria estratégica</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Integração com APIs</span>
              </li>
            </ul>
            
            <Button 
              variant="outline" 
              className="w-full group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all duration-300"
            >
              Escolher Plano
            </Button>
          </div>
        </div>
      </div>

      {/* Garantia */}
      <div className="text-center mt-16 p-8 bg-green-50 rounded-2xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          🛡️ Garantia de 30 dias
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Não gostou? Cancele em até 30 dias e receba seu dinheiro de volta. 
          Sem perguntas, sem complicações.
        </p>
      </div>
    </ResponsiveTemplate>
  )
}