'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simular cadastro
    setTimeout(() => {
      setIsLoading(false)
      alert('Conta criada com sucesso! 🎉')
    }, 2000)
  }

  // Dados dos cards de conteúdo para a animação
  const contentCards = [
    {
      id: 1,
      type: 'gastronomia',
      title: 'Receita do Dia',
      content: 'Risotto de Camarão com Açafrão',
      image: '🍤',
      color: 'from-orange-400 to-red-500',
      delay: '0s'
    },
    {
      id: 2,
      type: 'beleza',
      title: 'Tutorial',
      content: 'Corte Bob Moderno - Passo a Passo',
      image: '💇‍♀️',
      color: 'from-pink-400 to-purple-500',
      delay: '2s'
    },
    {
      id: 3,
      type: 'direito',
      title: 'Jurisprudência',
      content: 'Nova Lei Trabalhista: O que mudou?',
      image: '⚖️',
      color: 'from-blue-400 to-indigo-500',
      delay: '4s'
    },
    {
      id: 4,
      type: 'tecnologia',
      title: 'Tutorial',
      content: 'Como criar um App em React Native',
      image: '📱',
      color: 'from-cyan-400 to-blue-500',
      delay: '6s'
    },
    {
      id: 5,
      type: 'fitness',
      title: 'Dica',
      content: '5 Exercícios para Definir o Abdômen',
      image: '💪',
      color: 'from-green-400 to-teal-500',
      delay: '8s'
    },
    {
      id: 6,
      type: 'educacao',
      title: 'Infográfico',
      content: 'História do Brasil: Período Colonial',
      image: '📚',
      color: 'from-yellow-400 to-orange-500',
      delay: '10s'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">N</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              NichoFy
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/nichos" className="text-gray-600 hover:text-gray-900 transition-colors">
              Nichos
            </Link>
            <Link href="/exemplos" className="text-gray-600 hover:text-gray-900 transition-colors">
              Exemplos
            </Link>
            <Link href="/precos" className="text-gray-600 hover:text-gray-900 transition-colors">
              Preços
            </Link>
            <Link href="/login" className="text-orange-600 hover:text-orange-700 transition-colors">
              Entrar
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen flex">
        {/* Left Side - Creative Showcase */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-teal-900"></div>
          
          {/* Content River Animation */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Floating Content Cards */}
            <div className="absolute inset-0 overflow-hidden">
              {contentCards.map((card) => (
                <div
                  key={card.id}
                  className="absolute w-80 h-48 rounded-2xl shadow-2xl transform transition-all duration-1000 hover:scale-105"
                  style={{
                    animation: `floatUp 20s linear infinite`,
                    animationDelay: card.delay,
                    left: `${20 + (card.id * 15) % 60}%`,
                    top: '100%'
                  }}
                >
                  <div className={`w-full h-full bg-gradient-to-br ${card.color} rounded-2xl p-6 flex flex-col justify-between text-white relative overflow-hidden`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 text-6xl">{card.image}</div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="text-sm font-medium opacity-90 mb-2">{card.title}</div>
                      <h3 className="text-xl font-bold leading-tight">{card.content}</h3>
                    </div>
                    
                    {/* Footer */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="text-sm opacity-80">@{card.type}</div>
                      <div className="text-sm opacity-80">✨ NichoFy</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Overlay Text */}
            <div className="relative z-20 text-center text-white px-8">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Sua marca merece ser vista.
              </h1>
              <p className="text-xl opacity-90 max-w-md mx-auto">
                Crie conteúdo profissional em segundos.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Action Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">N</span>
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                  NichoFy
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Sua marca merece ser vista.
              </h1>
              <p className="text-gray-600">
                Crie conteúdo profissional em segundos.
              </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Crie sua conta grátis
              </h2>

              {/* Social Login */}
              <div className="space-y-3 mb-6">
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar com Google
                </button>
                
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continuar com Facebook
                </button>
              </div>

              {/* Separator */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou cadastre-se com seu email</span>
                </div>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Sua senha"
                    required
                    minLength={6}
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    Eu concordo com os{' '}
                    <Link href="/termos" className="text-orange-600 hover:text-orange-700">
                      Termos de Uso
                    </Link>{' '}
                    e a{' '}
                    <Link href="/privacidade" className="text-orange-600 hover:text-orange-700">
                      Política de Privacidade
                    </Link>
                    .
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !agreedToTerms}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Criando conta...
                    </div>
                  ) : (
                    'Criar Conta Agora'
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Já tem uma conta?{' '}
                  <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
                    Acesse aqui
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Animation */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-teal-900"></div>
        
        {/* Mobile Content Cards */}
        <div className="absolute inset-0 overflow-hidden">
          {contentCards.slice(0, 4).map((card) => (
            <div
              key={card.id}
              className="absolute w-64 h-36 rounded-xl shadow-xl transform"
              style={{
                animation: `floatUpMobile 15s linear infinite`,
                animationDelay: card.delay,
                left: `${15 + (card.id * 20) % 70}%`,
                top: '100%'
              }}
            >
              <div className={`w-full h-full bg-gradient-to-br ${card.color} rounded-xl p-4 flex flex-col justify-between text-white relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-2 right-2 text-4xl">{card.image}</div>
                </div>
                
                <div className="relative z-10">
                  <div className="text-xs font-medium opacity-90 mb-1">{card.title}</div>
                  <h3 className="text-sm font-bold leading-tight">{card.content}</h3>
                </div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="text-xs opacity-80">@{card.type}</div>
                  <div className="text-xs opacity-80">✨</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes floatUpMobile {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}