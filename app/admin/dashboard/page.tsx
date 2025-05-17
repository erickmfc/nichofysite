'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('pedidos')
  const supabase = createClientComponentClient()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Olá, Admin!</h1>
        <p className="text-gray-600">
          Bem-vindo ao painel administrativo, gerencie todos os aspectos do NichoFy.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="p-6 bg-white rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-70">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total de Pedidos</h3>
          <p className="text-3xl font-bold">1,234</p>
          <p className="text-sm text-green-600">+12% vs. mês anterior</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-70">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pendentes</h3>
          <p className="text-3xl font-bold">45</p>
          <p className="text-sm text-yellow-600">5 em alta prioridade</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-70">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Em Produção</h3>
          <p className="text-3xl font-bold">28</p>
          <p className="text-sm text-blue-600">12 em revisão</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-70">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Concluídos</h3>
          <p className="text-3xl font-bold">1,161</p>
          <p className="text-sm text-green-600">98% satisfação</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-70">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Usuários Ativos</h3>
          <p className="text-3xl font-bold">789</p>
          <p className="text-sm text-green-600">+8% vs. mês anterior</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'pedidos'
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Pedidos Recentes
          </button>
          <button
            onClick={() => setActiveTab('estatisticas')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'estatisticas'
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Estatísticas
          </button>
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'usuarios'
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Usuários
          </button>
        </div>

        {/* Pedidos Recentes */}
        {activeTab === 'pedidos' && (
          <div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Post para Instagram - Clínica Saúde</h4>
                    <p className="text-sm text-gray-600">Solicitado há 2 horas</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Em produção
                    </span>
                    <Button variant="outline" size="sm">
                      Ver detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline">
                Ver Todos os Pedidos
              </Button>
            </div>
          </div>
        )}

        {/* Estatísticas */}
        {activeTab === 'estatisticas' && (
          <div className="h-96 flex items-center justify-center text-gray-500">
            Gráficos de desempenho e tendências serão exibidos aqui
          </div>
        )}

        {/* Usuários */}
        {activeTab === 'usuarios' && (
          <div className="h-96 flex items-center justify-center text-gray-500">
            Lista de usuários ativos será exibida aqui
          </div>
        )}
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Button className="h-32 flex flex-col items-center justify-center">
          <span className="text-2xl mb-2">📝</span>
          Gerenciar Pedidos
        </Button>
        <Button className="h-32 flex flex-col items-center justify-center">
          <span className="text-2xl mb-2">👥</span>
          Gerenciar Equipe
        </Button>
        <Button className="h-32 flex flex-col items-center justify-center">
          <span className="text-2xl mb-2">📚</span>
          Biblioteca de Conteúdos
        </Button>
        <Button className="h-32 flex flex-col items-center justify-center">
          <span className="text-2xl mb-2">💰</span>
          Dados Financeiros
        </Button>
      </div>

      {/* Links Úteis */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Links Úteis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Supabase</h3>
            <div className="space-y-2">
              <a href="#" className="block text-primary-600 hover:underline">Dashboard</a>
              <a href="#" className="block text-primary-600 hover:underline">Editor SQL</a>
              <a href="#" className="block text-primary-600 hover:underline">Autenticação</a>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Stripe</h3>
            <div className="space-y-2">
              <a href="#" className="block text-primary-600 hover:underline">Dashboard</a>
              <a href="#" className="block text-primary-600 hover:underline">Clientes</a>
              <a href="#" className="block text-primary-600 hover:underline">Assinaturas</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 