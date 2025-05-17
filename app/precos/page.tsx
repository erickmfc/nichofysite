'use client'

import { Button } from '@/components/ui/Button'
import { PricingCard } from '@/components/ui/PricingCard'

export default function PrecosPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
              Planos e Preços
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Escolha o plano ideal para o seu negócio e comece a gerar conteúdo 
              profissional hoje mesmo.
            </p>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <PricingCard
                title="Grátis"
                price="R$0/mês"
                description="Perfeito para começar"
                highlight="Experimente gratuitamente por 14 dias"
                features={[
                  { text: '5 conteúdos/mês', included: true, tooltip: 'Conteúdos de até 500 palavras' },
                  { text: 'Acesso a 1 nicho', included: true, tooltip: 'Escolha entre nossos nichos disponíveis' },
                  { text: 'Personalização básica', included: true, tooltip: 'Ajuste de tom e estilo básico' },
                  { text: 'Entrega via WhatsApp', included: true },
                  { text: 'Suporte por e-mail (48h)', included: true },
                  { text: 'Acesso a múltiplos nichos', included: false },
                  { text: 'Personalização avançada', included: false },
                  { text: 'Revisão humana', included: false },
                  { text: 'Suporte prioritário', included: false }
                ]}
              />

              <PricingCard
                title="Básico"
                price="R$97/mês"
                description="Ideal para profissionais independentes"
                highlight="Economia de 30% no plano anual"
                features={[
                  { text: '35 conteúdos/mês', included: true, tooltip: 'Conteúdos de até 1000 palavras' },
                  { text: 'Acesso a 2 nichos', included: true },
                  { text: 'Personalização interna', included: true, tooltip: 'Ajuste de tom, estilo e formato' },
                  { text: 'Entrega via WhatsApp e painel', included: true },
                  { text: 'Suporte por e-mail (24h)', included: true },
                  { text: 'Ajustes limitados', included: true, tooltip: 'Até 2 revisões por conteúdo' },
                  { text: 'Revisão humana', included: false },
                  { text: 'Personalização avançada', included: false },
                  { text: 'Suporte prioritário', included: false }
                ]}
                paymentLink="https://buy.stripe.com/test_00geXH0zp0lyffy6op"
              />

              <PricingCard
                title="Premium"
                price="R$197/mês"
                description="Perfeito para pequenas empresas"
                highlight="Mais de 1000 clientes satisfeitos"
                features={[
                  { text: '70 conteúdos/mês', included: true, tooltip: 'Conteúdos de até 2000 palavras' },
                  { text: 'Acesso a todos os nichos', included: true },
                  { text: 'Personalização avançada', included: true, tooltip: 'Ajuste completo de tom, estilo e formato' },
                  { text: 'Revisão humana básica', included: true, tooltip: 'Revisão de qualidade e adequação' },
                  { text: 'Entrega em todos os formatos', included: true },
                  { text: 'Suporte prioritário (chat)', included: true },
                  { text: 'Ajustes limitados', included: true, tooltip: 'Até 3 revisões por conteúdo' },
                  { text: 'Calendário editorial', included: true },
                  { text: 'API para integração', included: false },
                  { text: 'Gerente de conta dedicada', included: false }
                ]}
                popular={true}
                paymentLink="https://buy.stripe.com/test_bIY7vf2Hx1pCd7qeUU"
              />

              <PricingCard
                title="Ultra"
                price="R$497/mês"
                description="Solução completa para empresas"
                highlight="Solução personalizada para sua empresa"
                features={[
                  { text: '100+ conteúdos/mês', included: true, tooltip: 'Conteúdos de qualquer tamanho' },
                  { text: 'Acesso a todos os nichos', included: true },
                  { text: 'Personalização total', included: true, tooltip: 'Personalização completa e exclusiva' },
                  { text: 'Revisão humana especializada', included: true, tooltip: 'Revisão por especialistas do nicho' },
                  { text: 'API para integração', included: true },
                  { text: 'Gerente de conta dedicada', included: true },
                  { text: 'Treinamento personalizado', included: true },
                  { text: 'Calendário editorial avançado', included: true },
                  { text: 'Relatórios de desempenho', included: true }
                ]}
                contactSales={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Calculadora de ROI */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Calculadora de ROI</h2>
            <div className="p-8 bg-white rounded-2xl shadow-lg">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Economia de Tempo</h3>
                  <ul className="space-y-4 text-gray-600">
                    <li className="flex items-start gap-3">
                      <span className="text-primary-600">•</span>
                      <span>Redução de 80% no tempo de criação</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary-600">•</span>
                      <span>Entrega em até 2 horas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary-600">•</span>
                      <span>Revisão rápida e eficiente</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Retorno Financeiro</h3>
                  <ul className="space-y-4 text-gray-600">
                    <li className="flex items-start gap-3">
                      <span className="text-primary-600">•</span>
                      <span>Economia de R$2.000/mês em redação</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary-600">•</span>
                      <span>Aumento de 150% no engajamento</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary-600">•</span>
                      <span>ROI médio de 300%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3">Como funciona o cancelamento?</h3>
                <p className="text-gray-600">
                  Você pode cancelar seu plano a qualquer momento. O cancelamento é imediato 
                  e você não será cobrado no próximo ciclo.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3">Posso mudar de plano?</h3>
                <p className="text-gray-600">
                  Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                  A mudança será aplicada imediatamente e o valor será ajustado proporcionalmente.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3">Como é feita a cobrança?</h3>
                <p className="text-gray-600">
                  A cobrança é feita mensalmente através de cartão de crédito. Oferecemos 
                  também a opção de pagamento anual com desconto de 30%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Pronto para transformar sua presença digital?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Comece agora mesmo a gerar conteúdo profissional e especializado.
          </p>
          <Button variant="outline" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
            Começar Gratuitamente
          </Button>
        </div>
      </section>
    </main>
  )
} 