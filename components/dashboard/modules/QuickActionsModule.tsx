'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const QuickActionsModule = () => {
  const { theme } = useTheme()
  const router = useRouter()
  const [hoveredAction, setHoveredAction] = useState<string | null>(null)

  const actions = [
    {
      id: 'create',
      title: 'Criar Conteúdo',
      description: 'Gerar novo post',
      icon: '✨',
      color: 'from-orange-500 to-pink-500',
      hoverColor: 'from-orange-600 to-pink-600',
      onClick: () => router.push('/criar-conteudo'),
      badge: 'Novo',
      badgeColor: 'bg-green-500'
    },
    {
      id: 'posts',
      title: 'Meus Posts',
      description: 'Ver todos os posts',
      icon: '📚',
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'from-blue-600 to-cyan-600',
      onClick: () => router.push('/meu-conteudo'),
      badge: null,
      badgeColor: ''
    },
    {
      id: 'nichos',
      title: 'Nichos',
      description: 'Explorar categorias',
      icon: '🎯',
      color: 'from-purple-500 to-indigo-500',
      hoverColor: 'from-purple-600 to-indigo-600',
      onClick: () => router.push('/nichos'),
      badge: '12+',
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'templates',
      title: 'Templates',
      description: 'Modelos prontos',
      icon: '📋',
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'from-green-600 to-emerald-600',
      onClick: () => router.push('/templates'),
      badge: '50+',
      badgeColor: 'bg-green-500'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Ver métricas',
      icon: '📊',
      color: 'from-red-500 to-rose-500',
      hoverColor: 'from-red-600 to-rose-600',
      onClick: () => router.push('/analytics-pessoais'),
      badge: 'Pro',
      badgeColor: 'bg-red-500'
    },
    {
      id: 'gamification',
      title: 'Gamificação',
      description: 'Badges e níveis',
      icon: '🎮',
      color: 'from-purple-500 to-pink-600',
      hoverColor: 'from-purple-600 to-pink-700',
      onClick: () => router.push('/gamificacao'),
      badge: 'Novo',
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'personal-dashboard',
      title: 'Dashboard Pessoal',
      description: 'Métricas avançadas',
      icon: '📊',
      color: 'from-teal-500 to-cyan-500',
      hoverColor: 'from-teal-600 to-cyan-600',
      onClick: () => router.push('/dashboard-pessoal'),
      badge: 'Avançado',
      badgeColor: 'bg-teal-500'
    },
    {
      id: 'extra-resources',
      title: 'Recursos Extras',
      description: 'Biblioteca completa',
      icon: '🛠️',
      color: 'from-indigo-500 to-purple-500',
      hoverColor: 'from-indigo-600 to-purple-600',
      onClick: () => router.push('/recursos-extras'),
      badge: 'Novo',
      badgeColor: 'bg-indigo-500'
    },
    {
      id: 'payment-approved',
      title: 'Pagamento Aprovado',
      description: 'Página de sucesso',
      icon: '✅',
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'from-green-600 to-emerald-600',
      onClick: () => router.push('/pagamento-aprovado'),
      badge: 'Demo',
      badgeColor: 'bg-green-500'
    },
    {
      id: 'thank-you',
      title: 'Página Obrigado',
      description: 'Agradecimento personalizado',
      icon: '🎉',
      color: 'from-blue-500 to-purple-500',
      hoverColor: 'from-blue-600 to-purple-600',
      onClick: () => router.push('/obrigado'),
      badge: 'Demo',
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'upsell',
      title: 'Página Upsell',
      description: 'Ofertas especiais',
      icon: '🚀',
      color: 'from-purple-500 to-pink-500',
      hoverColor: 'from-purple-600 to-pink-600',
      onClick: () => router.push('/upsell'),
      badge: 'Demo',
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'plans',
      title: 'Planos',
      description: 'Ver e alterar plano',
      icon: '💎',
      color: 'from-yellow-500 to-orange-500',
      hoverColor: 'from-yellow-600 to-orange-600',
      onClick: () => router.push('/planos'),
      badge: 'Upgrade',
      badgeColor: 'bg-yellow-500'
    },
  ]

  return (
    <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
      theme === 'dark'
        ? 'bg-gray-800 border border-gray-700'
        : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          ⚡ Ações Rápidas
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
        }`}>
          {actions.length} opções
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            onMouseEnter={() => setHoveredAction(action.id)}
            onMouseLeave={() => setHoveredAction(null)}
            className={`relative p-4 rounded-xl bg-gradient-to-r ${action.color} hover:${action.hoverColor} text-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 group overflow-hidden`}
          >
            {/* Efeito de brilho no hover */}
            <div className={`absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
              hoveredAction === action.id ? 'opacity-10' : ''
            }`}></div>
            
            {/* Badge */}
            {action.badge && (
              <div className={`absolute -top-2 -right-2 ${action.badgeColor} text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg`}>
                {action.badge}
              </div>
            )}
            
            <div className="relative z-10 text-center">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {action.icon}
              </div>
              <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
              <p className="text-xs opacity-90">{action.description}</p>
            </div>
            
            {/* Indicador de hover */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-white opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${
              hoveredAction === action.id ? 'opacity-30' : ''
            }`}></div>
          </button>
        ))}
      </div>
      
      {/* Dica */}
      <div className={`mt-4 p-3 rounded-lg ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <p className={`text-xs text-center ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          💡 <strong>Dica:</strong> Use os templates para criar posts mais rapidamente
        </p>
      </div>
    </div>
  )
}
