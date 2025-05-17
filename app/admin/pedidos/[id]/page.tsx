'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function PedidoDetalhePage({
  params
}: {
  params: { id: string }
}) {
  const [status, setStatus] = useState('em_producao')
  const [comentario, setComentario] = useState('')
  const supabase = createClientComponentClient()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pedido #123</h1>
          <p className="text-gray-600">
            Post para Instagram - Clínica Saúde
          </p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">
            Voltar
          </Button>
          <Button>
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações do Pedido */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Informações do Pedido</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="pendente">Pendente</option>
                  <option value="em_producao">Em Produção</option>
                  <option value="em_revisao">Em Revisão</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solicitação do Cliente
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800">
                    Preciso de um post para Instagram sobre prevenção de doenças cardíacas. 
                    O público-alvo são adultos entre 30-50 anos. Incluir dicas práticas e 
                    um call-to-action para agendamento de consulta.
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conteúdo Gerado
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={6}
                  placeholder="Digite o conteúdo gerado aqui..."
                />
              </div>
            </div>
          </div>

          {/* Histórico de Versões */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Histórico de Versões</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600">👨‍💻</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          João Silva
                        </div>
                        <div className="text-sm text-gray-500">
                          Há 2 horas
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Versão {i}
                    </span>
                  </div>
                  <p className="text-gray-800">
                    Versão inicial do conteúdo com foco em prevenção e dicas práticas.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          {/* Informações do Cliente */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Cliente</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600">👤</span>
                </div>
                <div className="ml-4">
                  <div className="text-lg font-medium text-gray-900">
                    Clínica Saúde
                  </div>
                  <div className="text-sm text-gray-500">
                    clínica@email.com
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Plano Atual
                </h3>
                <div className="px-3 py-2 bg-primary-50 text-primary-700 rounded-lg">
                  Premium
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Contato
                </h3>
                <div className="space-y-2">
                  <a href="#" className="block text-primary-600 hover:underline">
                    Enviar E-mail
                  </a>
                  <a href="#" className="block text-primary-600 hover:underline">
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Comentários */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Comentários</h2>
            <div className="space-y-4">
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600">👨‍💻</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          João Silva
                        </div>
                        <div className="text-sm text-gray-500">
                          Há 1 hora
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-800">
                      Precisamos adicionar mais informações sobre os sintomas.
                    </p>
                  </div>
                ))}
              </div>
              <div>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                  placeholder="Adicione um comentário..."
                />
                <div className="mt-2 flex justify-end">
                  <Button size="sm">
                    Enviar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Ações</h2>
            <div className="space-y-3">
              <Button className="w-full">
                Enviar para Aprovação
              </Button>
              <Button variant="outline" className="w-full">
                Solicitar Ajustes
              </Button>
              <Button variant="outline" className="w-full">
                Marcar como Concluído
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 