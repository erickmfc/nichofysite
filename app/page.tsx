'use client'

import { Button } from '@/components/ui/Button'
import { PricingCard } from '@/components/ui/PricingCard'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
                  Conteúdo especializado para seu nicho em minutos
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Conteúdo certo, no tempo certo. Textos profissionais para redes sociais, 
                  blogs e newsletters.
                </p>
                <div className="flex gap-4">
                  <Button size="lg">
                    Começar Grátis
                  </Button>
                  <Button variant="outline" size="lg">
                    Ver Exemplos
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="p-6 bg-white rounded-2xl shadow-lg">
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-600">Solicitação:</h3>
                    <p className="text-gray-800">
                      "Preciso de um post sobre prevenção de doenças cardíacas para Instagram"
                    </p>
                  </div>
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h3 className="font-medium text-gray-600 mb-2">Conteúdo Gerado:</h3>
                    <p className="text-gray-800">
                      "💓 Cuidar do coração é essencial! Confira 5 hábitos que podem 
                      prevenir doenças cardíacas: 1. Alimentação balanceada 2. Exercícios 
                      regulares 3. Controle do estresse..."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problema-Solução */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Desafios na Criação de Conteúdo Especializado</h2>
            <p className="text-xl text-gray-600">
              Profissionais e empresas enfrentam diversos obstáculos ao criar conteúdo 
              técnico e especializado. O NichoFy resolve esses problemas.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Tempo Limitado</h3>
              <p className="text-gray-600">
                Profissionais não têm tempo para criar conteúdo técnico de qualidade.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Conhecimento Técnico</h3>
              <p className="text-gray-600">
                Falta de expertise em comunicação para nichos específicos.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Consistência</h3>
              <p className="text-gray-600">
                Dificuldade em manter uma presença digital constante e relevante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nichos */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Nichos Atendidos</h2>
            <p className="text-xl text-gray-600">
              Conteúdo especializado para diferentes áreas, desenvolvido por 
              profissionais com profundo conhecimento em cada nicho.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">⚖️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Direito</h3>
              <p className="text-gray-600">
                Conteúdo jurídico especializado para advogados e escritórios.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">👨‍⚕️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Saúde</h3>
              <p className="text-gray-600">
                Conteúdo médico e de bem-estar para profissionais da saúde.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">💻</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Tecnologia</h3>
              <p className="text-gray-600">
                Conteúdo técnico e inovador para empresas de tecnologia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Como Funciona</h2>
            <p className="text-xl text-gray-600">
              Processo simples e eficiente para gerar conteúdo especializado.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Escolha o Nicho</h3>
              <p className="text-gray-600">
                Selecione sua área de atuação e o tipo de conteúdo desejado.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Faça o Pedido</h3>
              <p className="text-gray-600">
                Descreva o conteúdo que você precisa de forma simples e objetiva.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Receba o Conteúdo</h3>
              <p className="text-gray-600">
                Em minutos, receba seu conteúdo pronto para publicação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">O que nossos clientes dizem</h2>
            <p className="text-xl text-gray-600">
              Histórias reais de profissionais que transformaram sua presença digital.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">👨‍⚕️</span>
                </div>
                <div>
                  <h3 className="font-semibold">Dr. Carlos Silva</h3>
                  <p className="text-gray-600">Clínica Médica</p>
                </div>
              </div>
              <p className="text-gray-600">
                "O NichoFy revolucionou nossa presença digital. Conseguimos aumentar 
                nosso engajamento em 300% em apenas 3 meses."
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">⚖️</span>
                </div>
                <div>
                  <h3 className="font-semibold">Dra. Ana Santos</h3>
                  <p className="text-gray-600">Escritório de Advocacia</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Conteúdo jurídico de alta qualidade, entregue rapidamente. 
                Perfeito para manter nossa autoridade no mercado."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Planos e Preços</h2>
            <p className="text-xl text-gray-600">
              Escolha o plano ideal para o seu negócio e comece a gerar conteúdo 
              profissional hoje mesmo.
            </p>
          </div>
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
      </section>

      {/* CTA Final */}
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