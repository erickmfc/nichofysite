import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function SuportePage() {
  const faqs = [
    {
      pergunta: "Como criar meu primeiro conteúdo?",
      resposta: "Acesse a página 'Criar Conteúdo', escolha o tipo de conteúdo, selecione seu nicho e descreva o que você quer criar. Clique em 'Gerar Conteúdo' e pronto!"
    },
    {
      pergunta: "Posso usar templates personalizados?",
      resposta: "Sim! Na página 'Templates' você pode criar seus próprios templates personalizados ou usar os templates pré-definidos disponíveis."
    },
    {
      pergunta: "Como funciona o calendário de conteúdo?",
      resposta: "O calendário permite programar seus conteúdos com antecedência. Você pode visualizar todos os conteúdos agendados e acompanhar sua estratégia de publicação."
    },
    {
      pergunta: "Posso exportar meus dados?",
      resposta: "Sim, na página 'Configurações' você pode exportar todos os seus dados, incluindo conteúdos criados, templates e histórico de uso."
    },
    {
      pergunta: "Como cancelar minha assinatura?",
      resposta: "Acesse 'Configurações' > 'Conta' e clique em 'Gerenciar Assinatura'. Você pode cancelar a qualquer momento sem taxas adicionais."
    }
  ]

  const contatos = [
    {
      tipo: "Email",
      valor: "suporte@nichofy.com",
      descricao: "Resposta em até 24h",
      icone: "📧"
    },
    {
      tipo: "WhatsApp",
      valor: "+55 (11) 99999-9999",
      descricao: "Resposta em até 2h",
      icone: "💬"
    },
    {
      tipo: "Chat Online",
      valor: "Disponível 24/7",
      descricao: "Suporte instantâneo",
      icone: "💻"
    }
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Suporte</h1>
          
          {/* Contatos */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {contatos.map((contato, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow text-center">
                <div className="text-4xl mb-4">{contato.icone}</div>
                <h3 className="text-lg font-semibold mb-2">{contato.tipo}</h3>
                <p className="text-blue-600 font-medium mb-2">{contato.valor}</p>
                <p className="text-sm text-gray-500">{contato.descricao}</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
                  Entrar em Contato
                </button>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-6">Perguntas Frequentes</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{faq.pergunta}</h3>
                  <p className="text-gray-600 text-sm">{faq.resposta}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Formulário de Suporte */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">Enviar Mensagem</h2>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Assunto</label>
                <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Dúvida sobre funcionalidade</option>
                  <option>Problema técnico</option>
                  <option>Sugestão de melhoria</option>
                  <option>Cancelamento de conta</option>
                  <option>Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mensagem</label>
                <textarea 
                  className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descreva sua dúvida ou problema..."
                ></textarea>
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                Enviar Mensagem
              </button>
            </form>
          </div>

          {/* Recursos Úteis */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Recursos Úteis</h2>
              <div className="space-y-3">
                <a href="#" className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <span className="text-2xl mr-3">📚</span>
                  <div>
                    <div className="font-medium">Guia de Início</div>
                    <div className="text-sm text-gray-500">Aprenda a usar todas as funcionalidades</div>
                  </div>
                </a>
                <a href="#" className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <span className="text-2xl mr-3">🎥</span>
                  <div>
                    <div className="font-medium">Tutoriais em Vídeo</div>
                    <div className="text-sm text-gray-500">Vídeos explicativos passo a passo</div>
                  </div>
                </a>
                <a href="#" className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <span className="text-2xl mr-3">💡</span>
                  <div>
                    <div className="font-medium">Dicas e Truques</div>
                    <div className="text-sm text-gray-500">Maximize seu uso da plataforma</div>
                  </div>
                </a>
                <a href="#" className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <span className="text-2xl mr-3">🆕</span>
                  <div>
                    <div className="font-medium">Novidades</div>
                    <div className="text-sm text-gray-500">Últimas atualizações e funcionalidades</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Status do Sistema</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Serviços Principais</span>
                  <span className="text-green-600 font-semibold">✅ Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Geração de Conteúdo</span>
                  <span className="text-green-600 font-semibold">✅ Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Calendário</span>
                  <span className="text-green-600 font-semibold">✅ Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Analytics</span>
                  <span className="text-green-600 font-semibold">✅ Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Templates</span>
                  <span className="text-green-600 font-semibold">✅ Online</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Última atualização:</strong> Todos os sistemas funcionando normalmente
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
