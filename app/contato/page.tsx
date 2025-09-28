'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'suporte',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar envio do formulário
    console.log('Form submitted:', formData)
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
  }

  const handleStartChat = () => {
    alert('Funcionalidade em desenvolvimento. Entre em contato via WhatsApp!')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Fale Conosco
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Estamos aqui para ajudar. Escolha a melhor forma de entrar em contato.
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Formulário de Contato */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Envie sua Mensagem
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>

                {/* E-mail */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>

                {/* Departamento */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="suporte">Suporte Técnico</option>
                    <option value="comercial">Comercial</option>
                    <option value="financeiro">Financeiro</option>
                    <option value="geral">Geral</option>
                  </select>
                </div>

                {/* Mensagem */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                    placeholder="Como podemos ajudar?"
                  />
                </div>

                {/* Botão Enviar */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Enviar Mensagem
                </Button>
              </form>
            </div>

            {/* Informações de Contato */}
            <div className="space-y-8">
              {/* Informações de Contato */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Informações de Contato
                </h2>
                
                <div className="space-y-6">
                  {/* Suporte */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Suporte</h3>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-center">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        E-mail: <a href="mailto:suporte@nichofy.com" className="text-primary-600 hover:text-primary-700 ml-1">suporte@nichofy.com</a>
                      </p>
                      <p className="flex items-center">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        Chat ao vivo: 24/7
                      </p>
                      <p className="flex items-center">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        Tempo médio de resposta: 2 horas
                      </p>
                    </div>
                  </div>

                  {/* Comercial */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Comercial</h3>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-center">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        E-mail: <a href="mailto:comercial@nichofy.com" className="text-primary-600 hover:text-primary-700 ml-1">comercial@nichofy.com</a>
                      </p>
                      <p className="flex items-center">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        WhatsApp: <a href="https://wa.me/5511999999999" className="text-primary-600 hover:text-primary-700 ml-1">(11) 99999-9999</a>
                      </p>
                      <p className="flex items-center">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        Horário: 9h às 18h (GMT-3)
                      </p>
                    </div>
                  </div>

                  {/* Financeiro */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Financeiro</h3>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-center">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        E-mail: <a href="mailto:financeiro@nichofy.com" className="text-primary-600 hover:text-primary-700 ml-1">financeiro@nichofy.com</a>
                      </p>
                      <p className="flex items-center">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        Horário: 9h às 18h (GMT-3)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perguntas Frequentes */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Perguntas Frequentes
                </h2>
                
                <div className="space-y-6">
                  {/* FAQ 1 */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Como posso cancelar meu plano?
                    </h3>
                    <p className="text-gray-600">
                      Você pode cancelar seu plano a qualquer momento através do painel de controle ou entrando em contato com nosso suporte. O cancelamento é imediato e você não será cobrado no próximo ciclo.
                    </p>
                  </div>

                  {/* FAQ 2 */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Qual o tempo de resposta do suporte?
                    </h3>
                    <p className="text-gray-600">
                      Nosso tempo médio de resposta é de 2 horas. Para clientes dos planos Premium e Ultra, oferecemos suporte prioritário com resposta em até 1 hora.
                    </p>
                  </div>

                  {/* FAQ 3 */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Como funciona o chat ao vivo?
                    </h3>
                    <p className="text-gray-600">
                      O chat ao vivo está disponível 24/7 para todos os clientes. Basta clicar no ícone de chat no canto inferior direito da tela para iniciar uma conversa com nossa equipe de suporte.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ainda tem dúvidas?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudar você a encontrar a melhor solução.
          </p>
          <Button
            onClick={handleStartChat}
            className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            Iniciar Chat
          </Button>
        </div>
      </section>
    </main>
  )
}