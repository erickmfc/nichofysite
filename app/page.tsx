'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import Footer from '@/components/Footer'
import { ImageCarousel } from '@/components/ui/ImageCarousel'
import { Testimonials } from '@/components/ui/Testimonials'
import { InteractiveDemo } from '@/components/ui/InteractiveDemo'

export default function HomePage() {
  // Dados das imagens para o carrossel
  const exampleImages = [
    {
      src: "/Alta do Dólar e Seus Beneficiados.png",
      alt: "Exemplo de conteúdo sobre alta do dólar",
      title: "Economia & Finanças",
      description: "Conteúdo especializado em economia com dados atualizados e análises precisas."
    },
    {
      src: "/Demissão via WhatsApp e Indenização.png",
      alt: "Exemplo de conteúdo sobre direito trabalhista",
      title: "Direito Trabalhista",
      description: "Informações jurídicas claras e acessíveis sobre direitos do trabalhador."
    },
    {
      src: "/Poupança em 2025_ A Perda de Poder.png",
      alt: "Exemplo de conteúdo sobre investimentos",
      title: "Investimentos",
      description: "Análises de mercado e dicas de investimento para diferentes perfis."
    },
    {
      src: "/Exploração é Crime, Denuncie!.png",
      alt: "Exemplo de conteúdo sobre direitos humanos",
      title: "Direitos Humanos",
      description: "Conscientização sobre direitos fundamentais e denúncia de violações."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Navbar */}
      <PublicNavbar />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-8 animate-fade-in">
            Sua marca merece ser{' '}
            <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent animate-gradient">
              vista
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-12 max-w-4xl mx-auto animate-fade-in-delay">
            Crie conteúdo profissional em segundos com nossa IA especializada. 
            Mais de 10 nichos, resultados comprovados e suporte 24/7.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-3 animate-bounce-in" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <span className="text-gray-700 font-semibold text-lg">10+ Nichos</span>
            </div>
            <div className="flex flex-col items-center space-y-3 animate-bounce-in" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <span className="text-blue-600 text-2xl">✓</span>
              </div>
              <span className="text-gray-700 font-semibold text-lg">IA Especializada</span>
            </div>
            <div className="flex flex-col items-center space-y-3 animate-bounce-in" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <span className="text-purple-600 text-2xl">✓</span>
              </div>
              <span className="text-gray-700 font-semibold text-lg">Suporte 24/7</span>
            </div>
            <div className="flex flex-col items-center space-y-3 animate-bounce-in" style={{animationDelay: '0.4s'}}>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <span className="text-orange-600 text-2xl">✓</span>
              </div>
              <span className="text-gray-700 font-semibold text-lg">Resultados Comprovados</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Link 
              href="/exemplos" 
              className="bg-white text-gray-900 px-10 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 border border-gray-200 text-center min-w-[200px] hover:shadow-lg hover:-translate-y-1"
            >
              Ver Exemplos
            </Link>
            <Link 
              href="/login?mode=signup" 
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-10 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 text-center min-w-[200px] hover:shadow-lg hover:-translate-y-1"
            >
              Começar Agora
            </Link>
          </div>

          {/* Examples Section com Carrossel */}
          <div className="mb-20">
            <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
              <ImageCarousel 
                images={exampleImages}
                autoPlay={true}
                interval={4000}
              />
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-20">
            <Testimonials />
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-20 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
                Números que impressionam
              </h2>
              <p className="text-lg text-gray-600 animate-fade-in-delay">
                Resultados reais de quem já usa a NichoFy
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center animate-bounce-in" style={{animationDelay: '0.1s'}}>
                <div className="text-4xl font-bold text-orange-500 mb-2">10K+</div>
                <div className="text-gray-600 font-medium">Posts Criados</div>
              </div>
              <div className="text-center animate-bounce-in" style={{animationDelay: '0.2s'}}>
                <div className="text-4xl font-bold text-blue-500 mb-2">500+</div>
                <div className="text-gray-600 font-medium">Clientes Ativos</div>
              </div>
              <div className="text-center animate-bounce-in" style={{animationDelay: '0.3s'}}>
                <div className="text-4xl font-bold text-green-500 mb-2">15+</div>
                <div className="text-gray-600 font-medium">Nichos Especializados</div>
              </div>
              <div className="text-center animate-bounce-in" style={{animationDelay: '0.4s'}}>
                <div className="text-4xl font-bold text-purple-500 mb-2">24/7</div>
                <div className="text-gray-600 font-medium">Suporte Disponível</div>
              </div>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="mb-20">
            <InteractiveDemo />
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Velocidade</h3>
              <p className="text-gray-600 text-center">
                Crie conteúdo profissional em segundos. Nossa IA especializada trabalha 24/7 para você.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-6 mx-auto hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Especialização</h3>
              <p className="text-gray-600 text-center">
                Mais de 15 nichos diferentes com IA treinada especificamente para cada área.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 mx-auto hover:scale-110 transition-transform duration-300">
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
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-12 text-white shadow-2xl">
              <h2 className="text-4xl font-bold mb-6 animate-fade-in">
                Pronto para transformar seu conteúdo?
              </h2>
              <p className="text-xl mb-8 opacity-90 animate-fade-in-delay">
                Junte-se a mais de 500 empresas que já usam a NichoFy
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/login?mode=signup" 
                  className="bg-white text-orange-500 px-12 py-4 rounded-xl font-bold text-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl animate-bounce-in"
                  style={{animationDelay: '0.5s'}}
                >
                  Começar Gratuitamente
                </Link>
                <Link 
                  href="/exemplos" 
                  className="border-2 border-white text-white px-12 py-4 rounded-xl font-bold text-xl hover:bg-white hover:text-orange-500 transition-all duration-300 animate-bounce-in"
                  style={{animationDelay: '0.6s'}}
                >
                  Ver Mais Exemplos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}