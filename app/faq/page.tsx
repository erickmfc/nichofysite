'use client'

import { Button } from '@/components/ui/Button'

export default function FAQPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
              Perguntas Frequentes
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Encontre respostas para as dúvidas mais comuns sobre o NichoFy.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Busque sua dúvida..."
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Planos */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Planos e Preços</h2>
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-3">Como funciona o período de teste gratuito?</h3>
                  <p className="text-gray-700">
                    Oferecemos 14 dias de teste gratuito com acesso a todas as funcionalidades 
                    do plano Básico. Não é necessário cartão de crédito para começar.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-3">Posso mudar de plano a qualquer momento?</h3>
                  <p className="text-gray-700">
                    Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                    A mudança será aplicada imediatamente e o valor será ajustado proporcionalmente.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-3">Existe desconto para pagamento anual?</h3>
                  <p className="text-gray-700">
                    Sim! Oferecemos 30% de desconto para pagamento anual em todos os planos.
                  </p>
                </div>
              </div>
            </div>

            {/* Funcionamento */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Funcionamento</h2>
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-3">Como é gerado o conteúdo?</h3>
                  <p className="text-gray-700">
                    Utilizamos IA especializada combinada com curadoria humana para gerar 
                    conteúdo de alta qualidade. O processo é totalmente automatizado, mas 
                    conta com revisão humana para garantir a qualidade.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-3">Quanto tempo leva para receber o conteúdo?</h3>
                  <p className="text-gray-700">
                    O conteúdo é gerado em minutos. Para planos Premium e Ultra, incluímos 
                    revisão humana que pode levar até 2 horas em horário comercial.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-3">Posso solicitar ajustes no conteúdo?</h3>
                  <p className="text-gray-700">
                    Sim! O número de ajustes varia conforme o plano. Plano Básico: 2 ajustes, 
                    Premium: 3 ajustes, Ultra: ajustes ilimitados.
                  </p>
                </div>
              </div>
            </div>

            {/* Técnico */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Aspectos Técnicos</h2>
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-3">Como é feita a integração com outras plataformas?</h3>
                  <p className="text-gray-700">
                    Oferecemos API REST para integração com outras plataformas. Documentação 
                    completa está disponível para clientes dos planos Premium e Ultra.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-3">O conteúdo é único e original?</h3>
                  <p className="text-gray-700">
                    Sim! Todo o conteúdo é gerado de forma única e original. Utilizamos 
                    verificadores de plágio para garantir a originalidade.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-3">Como é garantida a qualidade do conteúdo?</h3>
                  <p className="text-gray-700">
                    Combinamos IA especializada com revisão humana. Nossa equipe de 
                    especialistas revisa o conteúdo para garantir qualidade e adequação.
                  </p>
                </div>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Aspectos Legais</h2>
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-3">Quem é o dono do conteúdo gerado?</h3>
                  <p className="text-gray-700">
                    Você é o dono de todo o conteúdo gerado. Não reivindicamos direitos 
                    sobre o conteúdo criado através da plataforma.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-3">Como é feita a proteção de dados?</h3>
                  <p className="text-gray-700">
                    Seguimos todas as diretrizes da LGPD. Seus dados são criptografados e 
                    armazenados de forma segura.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-3">Existe garantia de satisfação?</h3>
                  <p className="text-gray-700">
                    Sim! Oferecemos garantia de satisfação de 7 dias. Se não estiver satisfeito, 
                    devolvemos seu dinheiro.
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
          <h2 className="text-3xl font-bold mb-8">Não encontrou sua dúvida?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudar você a encontrar a resposta.
          </p>
          <Button variant="outline" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
            Fale Conosco
          </Button>
        </div>
      </section>
    </main>
  )
} 