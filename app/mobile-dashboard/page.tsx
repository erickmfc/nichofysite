'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function MobileDashboard() {
  const [currentDate] = useState(new Date())
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Dados mockados para demonstração
  const userData = {
    name: 'Erick',
    avatar: '/api/placeholder/60/60',
    suggestions: 3,
    lastPost: {
      title: 'Direito Trabalhista',
      preview: 'Demissão via WhatsApp pode render indenização...',
      date: 'Hoje, 14:30'
    },
    trends: [
      { hashtag: '#DiadoCafe', trending: true },
      { hashtag: '#DireitoTrabalhista', trending: false },
      { hashtag: '#Consumidor', trending: true }
    ],
    monthlyStats: {
      postsCreated: 12,
      plan: 'Básico',
      postsRemaining: 8
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Olá, {userData.name}!</h1>
              <p className="text-sm text-gray-600">{formatDate(currentDate)}</p>
            </div>
          </div>
          <button className="p-2 bg-gray-100 rounded-full">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Hero Card - Sugestões para Hoje */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-6 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Sugestões para Hoje</h2>
                <p className="text-white/90">Você tem {userData.suggestions} novas sugestões!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{userData.suggestions}</div>
              <div className="text-sm text-white/80">novas</div>
            </div>
          </div>
          
          {/* Floating Icons */}
          <div className="flex justify-center space-x-4 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '0.1s'}}>
              <span className="text-sm">📱</span>
            </div>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '0.2s'}}>
              <span className="text-sm">📝</span>
            </div>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '0.3s'}}>
              <span className="text-sm">🎯</span>
            </div>
          </div>
          
          <button className="w-full bg-white text-orange-500 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
            Ver Sugestões
          </button>
        </div>

        {/* Calendário Compacto */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendário de Conteúdo</h3>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date()
              date.setDate(date.getDate() + i)
              const isToday = i === 0
              const hasContent = i % 3 === 0 // Mock: alguns dias têm conteúdo
              
              return (
                <div key={i} className={`flex-shrink-0 text-center ${isToday ? 'bg-orange-100 rounded-xl p-2' : ''}`}>
                  <div className={`text-sm font-medium ${isToday ? 'text-orange-600' : 'text-gray-600'}`}>
                    {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg font-bold ${isToday ? 'text-orange-600' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </div>
                  {hasContent && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full mx-auto mt-1"></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Cards de Atividade */}
        <div className="grid grid-cols-1 gap-4">
          {/* Último Post Criado */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">📝 Último Post Criado</h3>
              <span className="text-sm text-gray-500">{userData.lastPost.date}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 mb-3">
              <h4 className="font-medium text-gray-900 mb-1">{userData.lastPost.title}</h4>
              <p className="text-sm text-gray-600">{userData.lastPost.preview}</p>
            </div>
            <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              Ver Detalhes
            </button>
          </div>

          {/* Radar de Tendências */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">📡 Radar de Tendências</h3>
            <div className="space-y-2">
              {userData.trends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{trend.hashtag}</span>
                  {trend.trending && (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                      🔥 Em alta
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Paleta de Ideias Rápidas */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Ideias Rápidas</h3>
          <div className="grid grid-cols-3 gap-3">
            <button className="bg-blue-50 text-blue-600 p-4 rounded-xl text-center hover:bg-blue-100 transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium">Enquete</div>
            </button>
            <button className="bg-green-50 text-green-600 p-4 rounded-xl text-center hover:bg-green-100 transition-colors">
              <div className="text-2xl mb-2">🎬</div>
              <div className="text-sm font-medium">Bastidores</div>
            </button>
            <button className="bg-purple-50 text-purple-600 p-4 rounded-xl text-center hover:bg-purple-100 transition-colors">
              <div className="text-2xl mb-2">💡</div>
              <div className="text-sm font-medium">Dica Rápida</div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-around">
          <Link href="/mobile-dashboard" className="flex flex-col items-center space-y-1 text-orange-500">
            <div className="w-6 h-6">🏠</div>
            <span className="text-xs font-medium">Home</span>
          </Link>
          
          <Link href="/meu-conteudo" className="flex flex-col items-center space-y-1 text-gray-400">
            <div className="w-6 h-6">📝</div>
            <span className="text-xs font-medium">Histórico</span>
          </Link>
          
          <Link href="/criar-conteudo" className="flex flex-col items-center space-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">✨</span>
            </div>
            <span className="text-xs font-medium text-orange-500">Criar</span>
          </Link>
          
          <Link href="/analytics" className="flex flex-col items-center space-y-1 text-gray-400">
            <div className="w-6 h-6">📈</div>
            <span className="text-xs font-medium">Analytics</span>
          </Link>
          
          <Link href="/mobile-profile" className="flex flex-col items-center space-y-1 text-gray-400">
            <div className="w-6 h-6">👤</div>
            <span className="text-xs font-medium">Perfil</span>
          </Link>
        </div>
      </div>

      {/* Spacer for bottom navigation */}
      <div className="h-20"></div>
    </div>
  )
}
