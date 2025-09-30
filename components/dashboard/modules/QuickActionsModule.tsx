'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'
import { useRouter } from 'next/navigation'

export const QuickActionsModule = () => {
  const { theme } = useTheme()
  const router = useRouter()

  const actions = [
    {
      title: 'Criar Post',
      description: 'Gerar novo conteúdo',
      icon: '✨',
      color: 'from-orange-500 to-pink-500',
      hoverColor: 'from-orange-600 to-pink-600',
      onClick: () => router.push('/criar-conteudo')
    },
    {
      title: 'Meus Posts',
      description: 'Ver todos os posts',
      icon: '📝',
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'from-blue-600 to-cyan-600',
      onClick: () => router.push('/meu-conteudo')
    },
    {
      title: 'Templates',
      description: 'Usar templates prontos',
      icon: '📋',
      color: 'from-purple-500 to-indigo-500',
      hoverColor: 'from-purple-600 to-indigo-600',
      onClick: () => router.push('/templates')
    },
    {
      title: 'Configurações',
      description: 'Ajustar perfil',
      icon: '⚙️',
      color: 'from-gray-500 to-slate-500',
      hoverColor: 'from-gray-600 to-slate-600',
      onClick: () => router.push('/configuracoes')
    }
  ]

  return (
    <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
      theme === 'dark'
        ? 'bg-gray-800 border border-gray-700'
        : 'bg-white border border-gray-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        ⚡ Ações Rápidas
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-4 rounded-xl bg-gradient-to-r ${action.color} hover:${action.hoverColor} text-white transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{action.icon}</div>
              <h4 className="font-semibold text-sm">{action.title}</h4>
              <p className="text-xs opacity-90">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
