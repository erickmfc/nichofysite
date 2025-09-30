'use client'

import Link from 'next/link'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Navbar */}
      <PublicNavbar />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 leading-tight mb-8">
            Sua marca merece ser{' '}
            <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              vista
            </span>
          </h1>
          
          <p className="text-2xl text-gray-600 leading-relaxed mb-12 max-w-4xl mx-auto">
            Crie conteúdo profissional em segundos com nossa IA especializada. 
            Mais de 10 nichos, resultados comprovados e suporte 24/7.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <span className="text-gray-700 font-semibold text-lg">10+ Nichos</span>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-2xl">✓</span>
              </div>
              <span className="text-gray-700 font-semibold text-lg">IA Especializada</span>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-2xl">✓</span>
              </div>
              <span className="text-gray-700 font-semibold text-lg">Suporte 24/7</span>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-2xl">✓</span>
              </div>
              <span className="text-gray-700 font-semibold text-lg">Resultados Comprovados</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Link 
              href="/exemplos" 
              className="bg-white text-gray-900 px-10 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200 text-center min-w-[200px]"
            >
              Ver Exemplos
            </Link>
            <Link 
              href="/login?mode=signup" 
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-10 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all text-center min-w-[200px]"
            >
              Começar Agora
            </Link>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <span className="text-4xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Velocidade</h3>
              <p className="text-gray-600 text-center">
                Crie conteúdo profissional em segundos. Nossa IA especializada trabalha 24/7 para você.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Especialização</h3>
              <p className="text-gray-600 text-center">
                Mais de 10 nichos diferentes com IA treinada especificamente para cada área.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <span className="text-4xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Resultados</h3>
              <p className="text-gray-600 text-center">
                Mais de 10.000 posts criados com resultados comprovados em engajamento e vendas.
              </p>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-20 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Pronto para transformar seu conteúdo?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Junte-se a milhares de empresas que já usam a NichoFy
            </p>
            <Link 
              href="/login?mode=signup" 
              className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white px-12 py-4 rounded-xl font-bold text-xl hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Começar Gratuitamente
            </Link>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}