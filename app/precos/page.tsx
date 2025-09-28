'use client'

import { ResponsiveTemplate } from '@/components/ui/ResponsiveTemplate'
import { Button } from '@/components/ui/Button'
import { PublicNavbar } from '@/components/layout/PublicNavbar'

export default function PrecosPage() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <div className="pt-16">
        <ResponsiveTemplate
          colorScheme="success"
          title="Nossos Preços"
          subtitle="Planos flexíveis para atender desde pequenos negócios até grandes empresas"
          features={["💰 Sem taxas ocultas", "🔄 Cancelamento flexível", "📞 Suporte 24/7"]}
        >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Planos que se adaptam ao seu crescimento
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Comece pequeno, cresça grande. Sem taxas ocultas, sem surpresas. 
          Cancele quando quiser.
        </p>
        
        {/* Comparação rápida */}
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-green-600 font-semibold mb-2">🚀 Para Começar</div>
            <div className="text-sm text-gray-700">Ideal para pequenos negócios e freelancers</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-blue-600 font-semibold mb-2">📈 Para Crescer</div>
            <div className="text-sm text-gray-700">Perfeito para empresas em expansão</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-purple-600 font-semibold mb-2">🏢 Para Escalar</div>
            <div className="text-sm text-gray-700">Solução completa para grandes empresas</div>
          </div>
        </div>
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
              <p className="text-gray-700">Perfeito para começar</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>50 posts profissionais por mês</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>3 nichos especializados</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Suporte por email (24h)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>10+ templates otimizados</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Hashtags estratégicas</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>7 dias grátis para testar</span>
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
              <p className="text-gray-700">Para negócios em crescimento</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>200 posts profissionais por mês</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>10 nichos especializados</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Suporte prioritário (WhatsApp)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>50+ templates premium</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Relatórios de performance</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Agendamento automático</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Consultoria mensal (30min)</span>
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
              <p className="text-gray-700">Para grandes empresas</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Posts ilimitados por mês</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Todos os nichos disponíveis</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Gerente de conta dedicado</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Templates exclusivos personalizados</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Consultoria estratégica semanal</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Integração com suas ferramentas</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Treinamento da equipe</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Relatórios executivos mensais</span>
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

      {/* Garantia e FAQ */}
      <div className="mt-16 space-y-12">
        {/* Garantia */}
        <div className="text-center p-8 bg-green-50 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🛡️ Garantia de 30 dias - Sem Risco
          </h3>
          <p className="text-gray-700 max-w-2xl mx-auto mb-6">
            Teste todos os recursos por 30 dias completos. Se não ficar satisfeito, 
            devolvemos 100% do seu dinheiro. Sem perguntas, sem complicações.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Cancelamento em 1 clique
            </span>
            <span className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Reembolso em até 5 dias úteis
            </span>
            <span className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Sem taxas de cancelamento
            </span>
          </div>
        </div>

        {/* FAQ Rápido */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Perguntas Frequentes
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Posso cancelar a qualquer momento?</h4>
              <p className="text-gray-600 text-sm">Sim! Você pode cancelar seu plano a qualquer momento sem taxas ou multas.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Os posts são únicos?</h4>
              <p className="text-gray-600 text-sm">Absolutamente! Cada post é criado exclusivamente para você usando nossa IA especializada.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Posso mudar de plano depois?</h4>
              <p className="text-gray-600 text-sm">Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Há limite de nichos?</h4>
              <p className="text-gray-600 text-sm">Depende do plano. O Básico inclui 3 nichos, Profissional 10, e Empresarial todos os disponíveis.</p>
            </div>
          </div>
        </div>
      </div>
        </ResponsiveTemplate>
      </div>
    </div>
  )
}