'use client'

import { Button } from '@/components/ui/Button'

export default function ContatoPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
              Fale Conosco
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Estamos aqui para ajudar. Escolha a melhor forma de entrar em contato.
            </p>
          </div>
        </div>
      </section>

      {/* Formulário de Contato */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-8">Envie sua Mensagem</h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departamento
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option>Suporte Técnico</option>
                      <option>Comercial</option>
                      <option>Financeiro</option>
                      <option>Outros</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={4}
                      placeholder="Como podemos ajudar?"
                    />
                  </div>
                  <Button size="lg" className="w-full">
                    Enviar Mensagem
                  </Button>
                </form>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-8">Informações de Contato</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Suporte</h3>
                    <div className="space-y-4">
                      <p className="flex items-center gap-3 text-gray-600">
                        <span className="text-primary-600">•</span>
                        <span>E-mail: suporte@nichofy.com</span>
                      </p>
                      <p className="flex items-center gap-3 text-gray-600">
                        <span className="text-primary-600">•</span>
                        <span>Chat ao vivo: 24/7</span>
                      </p>
                      <p className="flex items-center gap-3 text-gray-600">
                        <span className="text-primary-600">•</span>
                        <span>Tempo médio de resposta: 2 horas</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Comercial</h3>
                    <div className="space-y-4">
                      <p className="flex items-center gap-3 text-gray-600">
                        <span className="text-primary-600">•</span>
                        <span>E-mail: comercial@nichofy.com</span>
                      </p>
                      <p className="flex items-center gap-3 text-gray-600">
                        <span className="text-primary-600">•</span>
                        <span>WhatsApp: (11) 99999-9999</span>
                      </p>
                      <p className="flex items-center gap-3 text-gray-600">
                        <span className="text-primary-600">•</span>
                        <span>Horário: 9h às 18h (GMT-3)</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Financeiro</h3>
                    <div className="space-y-4">
                      <p className="flex items-center gap-3 text-gray-600">
                        <span className="text-primary-600">•</span>
                        <span>E-mail: financeiro@nichofy.com</span>
                      </p>
                      <p className="flex items-center gap-3 text-gray-600">
                        <span className="text-primary-600">•</span>
                        <span>Horário: 9h às 18h (GMT-3)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3">Como posso cancelar meu plano?</h3>
                <p className="text-gray-600">
                  Você pode cancelar seu plano a qualquer momento através do painel de controle 
                  ou entrando em contato com nosso suporte. O cancelamento é imediato e você 
                  não será cobrado no próximo ciclo.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3">Qual o tempo de resposta do suporte?</h3>
                <p className="text-gray-600">
                  Nosso tempo médio de resposta é de 2 horas. Para clientes dos planos Premium 
                  e Ultra, oferecemos suporte prioritário com resposta em até 1 hora.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3">Como funciona o chat ao vivo?</h3>
                <p className="text-gray-600">
                  O chat ao vivo está disponível 24/7 para todos os clientes. Basta clicar no 
                  ícone de chat no canto inferior direito da tela para iniciar uma conversa 
                  com nossa equipe de suporte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ainda tem dúvidas?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudar você a encontrar a melhor solução.
          </p>
          <Button variant="outline" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
            Iniciar Chat
          </Button>
        </div>
      </section>
    </main>
  )
} 