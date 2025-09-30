'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BottomNavigation } from '@/components/ui/BottomNavigation'
import { StatsCard, ModernCard } from '@/components/ui/ModernCard'

export default function MobileProfile() {
  const [userData] = useState({
    name: 'Erick Matheus Ferreira da Costa',
    niche: 'Direito',
    avatar: '/api/placeholder/80/80',
    email: 'erick@exemplo.com',
    joinDate: 'Janeiro 2024',
    monthlyStats: {
      postsCreated: 12,
      plan: 'Básico',
      postsRemaining: 8
    }
  })

  const profileOptions = [
    {
      icon: '🎨',
      title: 'Minha Marca',
      subtitle: 'Editar nicho, tom de voz e preferências',
      href: '/configuracoes/marca'
    },
    {
      icon: '📈',
      title: 'Estatísticas Detalhadas',
      subtitle: 'Relatórios completos de uso',
      href: '/analytics'
    },
    {
      icon: '💳',
      title: 'Gerenciar Assinatura',
      subtitle: 'Upgrade, pagamentos e histórico',
      href: '/configuracoes/assinatura'
    },
    {
      icon: '⚙️',
      title: 'Configurações da Conta',
      subtitle: 'Senha, email e notificações',
      href: '/configuracoes/conta'
    },
    {
      icon: '💬',
      title: 'Suporte',
      subtitle: 'Central de ajuda e contato',
      href: '/suporte'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/mobile-dashboard" className="p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Perfil</h1>
          <button className="p-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 space-y-6">
        {/* User Info */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{userData.name}</h2>
            <p className="text-gray-600 mb-2">{userData.niche}</p>
            <p className="text-sm text-gray-500">Membro desde {userData.joinDate}</p>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-4">
          <StatsCard 
            value={userData.monthlyStats.postsCreated} 
            label="Posts Criados" 
            color="orange" 
          />
          <StatsCard 
            value={userData.monthlyStats.plan} 
            label="Plano Atual" 
            color="blue" 
          />
          <StatsCard 
            value={userData.monthlyStats.postsRemaining} 
            label="Posts Restantes" 
            color="green" 
          />
        </div>

        {/* Profile Options */}
        <div className="space-y-3">
          {profileOptions.map((option, index) => (
            <Link 
              key={index}
              href={option.href}
              className="bg-white rounded-2xl p-4 shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{option.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.subtitle}</p>
              </div>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Upgrade Card */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-6 text-white shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Upgrade para Pro</h3>
            <p className="text-white/90 mb-4">
              Desbloqueie recursos avançados e crie conteúdo ilimitado
            </p>
            <button className="bg-white text-orange-500 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Fazer Upgrade
            </button>
          </div>
        </div>

        {/* Logout */}
        <button className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-semibold hover:bg-red-100 transition-colors">
          Sair da Conta
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Spacer for bottom navigation */}
      <div className="h-20"></div>
    </div>
  )
}
