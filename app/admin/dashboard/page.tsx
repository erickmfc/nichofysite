'use client'

import { ResponsiveTemplate } from '@/components/ui/ResponsiveTemplate'
import { Button } from '@/components/ui/Button'

export default function AdminDashboardPage() {
  return (
    <ResponsiveTemplate
      colorScheme="warning"
      title="Painel Administrativo"
      subtitle="Gerencie sua conta e acompanhe o desempenho dos seus conteúdos"
      features={["📊 Dashboard completo", "⚙️ Configurações", "📈 Relatórios detalhados"]}
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao Dashboard
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Aqui você pode gerenciar sua conta, visualizar estatísticas e configurar suas preferências.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Estatísticas */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">📝</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">1,247</h3>
          <p className="text-gray-600">Posts Criados</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">👥</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">89</h3>
          <p className="text-gray-600">Clientes Ativos</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">📈</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">+45%</h3>
          <p className="text-gray-600">Crescimento</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">⭐</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">4.9</h3>
          <p className="text-gray-600">Avaliação</p>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Ações Rápidas</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Button className="h-20 bg-yellow-500 hover:bg-yellow-600 text-white text-lg">
            📝 Criar Novo Conteúdo
          </Button>
          <Button variant="outline" className="h-20 text-lg">
            📊 Ver Relatórios
          </Button>
          <Button variant="outline" className="h-20 text-lg">
            ⚙️ Configurações
          </Button>
        </div>
      </div>
    </ResponsiveTemplate>
  )
}
