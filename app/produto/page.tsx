'use client'

import { Button } from '@/components/ui/Button'

export default function ProdutoPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
              Conheça o NichoFy
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              A plataforma que combina inteligência artificial especializada com curadoria humana 
              para gerar conteúdo profissional para nichos específicos.
            </p>
          </div>
        </div>
      </section>

      {/* Características Principais */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Por que escolher o NichoFy?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">IA Especializada</h3>
                <p className="text-gray-600">
                  Utilizamos modelos de IA treinados especificamente para cada nicho, 
                  garantindo conteúdo técnico e preciso.
                </p>
              </div>

              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Curadoria Humana</h3>
                <p className="text-gray-600">
                  Especialistas em cada área revisam e refinam o conteúdo, 
                  garantindo qualidade e adequação ao contexto.
                </p>
              </div>

              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Entrega Rápida</h3>
                <p className="text-gray-600">
                  Conteúdo entregue em minutos, não dias. 
                  Ideal para quem precisa de agilidade sem comprometer a qualidade.
                </p>
              </div>

              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Personalização</h3>
                <p className="text-gray-600">
                  Adaptamos o tom, estilo e formato do conteúdo 
                  conforme suas necessidades e preferências.
                </p>
              </div>

              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Multiplataforma</h3>
                <p className="text-gray-600">
                  Conteúdo otimizado para diferentes redes sociais, 
                  blogs, newsletters e outros canais de comunicação.
                </p>
              </div>

              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Analytics</h3>
                <p className="text-gray-600">
                  Acompanhe o desempenho do seu conteúdo e 
                  otimize sua estratégia com dados precisos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
            <div className="space-y-12">
              <div className="flex items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Escolha seu Nicho</h3>
                  <p className="text-gray-600">
                    Selecione entre nossos nichos especializados: Direito, Saúde, Tecnologia, 
                    e muitos outros. Cada nicho tem sua própria IA treinada.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Descreva seu Pedido</h3>
                  <p className="text-gray-600">
                    Seja específico sobre o que você precisa: tipo de conteúdo, 
                    público-alvo, tom de voz e qualquer requisito especial.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">3</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">IA Gera o Conteúdo</h3>
                  <p className="text-gray-600">
                    Nossa IA especializada cria o conteúdo baseado em seu pedido, 
                    utilizando conhecimento específico do nicho escolhido.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">4</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Revisão Humana</h3>
                  <p className="text-gray-600">
                    Especialistas revisam o conteúdo para garantir qualidade, 
                    precisão técnica e adequação ao contexto.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">5</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Entrega Final</h3>
                  <p className="text-gray-600">
                    Receba seu conteúdo pronto para publicação, 
                    otimizado para a plataforma escolhida.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tecnologia */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Nossa Tecnologia</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6">IA Especializada por Nicho</h3>
                <p className="text-gray-600 mb-6">
                  Diferente de IAs genéricas, desenvolvemos modelos específicos para cada área, 
                  treinados com conhecimento técnico e atualizado de cada nicho.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">✓</span>
                    <span>Modelos treinados com dados específicos de cada nicho</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">✓</span>
                    <span>Atualização constante com novas informações</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">✓</span>
                    <span>Validação por especialistas humanos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">✓</span>
                    <span>Otimização para diferentes formatos e plataformas</span>
                  </li>
                </ul>
              </div>
              <div className="p-8 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🧠</span>
                  </div>
                  <h4 className="text-xl font-semibold mb-4">Inteligência Artificial</h4>
                  <p className="text-gray-600">
                    Modelos GPT especializados, treinados especificamente 
                    para gerar conteúdo técnico e preciso.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Pronto para experimentar?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Comece gratuitamente e veja como o NichoFy pode transformar 
            sua estratégia de conteúdo.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              Ver Preços
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
              Ver Exemplos
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}