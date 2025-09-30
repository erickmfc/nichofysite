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
          subtitle="Planos estratégicos para atrair, converter e escalar seu negócio"
          features={["💰 Sem taxas ocultas", "🔄 Cancelamento flexível", "📞 Suporte especializado"]}
        >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Escolha o plano ideal para seu crescimento
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Comece com nosso teste grátis, evolua com o básico e escale com o profissional. 
          Sem compromisso, sem surpresas.
        </p>
        
        {/* Estratégia dos planos */}
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-blue-600 font-semibold mb-2">🎯 Teste Grátis</div>
            <div className="text-sm text-gray-700">Experimente sem compromisso por 14 dias</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-green-600 font-semibold mb-2">🚀 Básico</div>
            <div className="text-sm text-gray-700">Acesso super acessível para começar</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-orange-600 font-semibold mb-2">⭐ Profissional</div>
            <div className="text-sm text-gray-700">Solução completa para crescer</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Plano Teste Grátis */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up">
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Teste Grátis</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                R$ 0<span className="text-lg text-gray-600">/14 dias</span>
              </div>
              <p className="text-gray-700">Perfeito para experimentar</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>10 posts criados por profissionais</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Válido por 14 dias</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>1 nicho especializado à sua escolha</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Sugestão de hashtags para cada post</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Suporte via chat de texto</span>
              </li>
            </ul>
            
            <Button 
              variant="outline" 
              className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300"
            >
              Começar meu teste grátis
            </Button>
          </div>
        </div>

        {/* Plano Básico */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Básico</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                R$ 49,90<span className="text-lg text-gray-600">/mês</span>
              </div>
              <p className="text-gray-700">Ideal para autônomos e projetos iniciantes</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>20 posts profissionais por mês</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>1 nicho especializado à sua escolha</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Acesso a templates padrão</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Sugestão de hashtags para cada post</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Suporte via e-mail</span>
              </li>
            </ul>
            
            <Button 
              variant="outline" 
              className="w-full group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all duration-300"
            >
              Assinar Plano Básico
            </Button>
          </div>
        </div>

        {/* ⭐ MAIS POPULAR ⭐ Plano Profissional */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up border-2 border-orange-500 relative" style={{ animationDelay: '0.2s' }}>
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              ⭐ MAIS POPULAR ⭐
            </span>
          </div>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Profissional</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                R$ 149,90<span className="text-lg text-gray-600">/mês</span>
              </div>
              <p className="text-gray-700">Solução completa para crescer e se destacar</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>50 posts profissionais por mês</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Até 3 nichos especializados</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Suporte prioritário via WhatsApp</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Acesso a todos os templates (Padrão + Premium)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Sugestão de hashtags estratégicas</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>"Paleta de Ideias Rápidas" no dashboard</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Agendador de Posts (BETA)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Relatórios de performance simplificados</span>
              </li>
            </ul>
            
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300"
            >
              Assinar Plano Profissional
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
              <h4 className="font-semibold text-gray-900 mb-2">Posso mudar de plano a qualquer momento?</h4>
              <p className="text-gray-600 text-sm">Sim! Você pode fazer upgrade, downgrade ou cancelar quando quiser, de forma simples pelo seu painel.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">O que acontece se eu precisar de mais posts em um mês?</h4>
              <p className="text-gray-600 text-sm">Você pode fazer um upgrade para o plano seguinte ou comprar pacotes de posts avulsos.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Quais são as formas de pagamento?</h4>
              <p className="text-gray-600 text-sm">Aceitamos Cartão de Crédito (principais bandeiras) e Pix.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Os posts são únicos e personalizados?</h4>
              <p className="text-gray-600 text-sm">Absolutamente! Cada post é criado exclusivamente para você usando nossa IA especializada.</p>
            </div>
          </div>
        </div>
      </div>
        </ResponsiveTemplate>
      </div>
    </div>
  )
}