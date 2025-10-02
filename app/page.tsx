'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import Footer from '@/components/Footer'
import { ImageCarousel } from '@/components/ui/ImageCarousel'
import { Testimonials } from '@/components/ui/Testimonials'
import { TextGeneratorWithPreview } from '@/components/ui/TextGeneratorWithPreview'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navbar */}
      <PublicNavbar />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight mb-8 animate-fade-in">
            Conteúdo profissional{' '}
            <span className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
              em menos de um dia
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-12 max-w-4xl mx-auto animate-fade-in-delay">
            Nossos profissionais especialistas trabalham junto com IA avançada 
            para criar textos irresistíveis que vendem, engajam e convertem. 
            Conteúdo profissional para suas redes sociais, anúncios e campanhas.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-3 animate-bounce-in" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <span className="text-emerald-600 text-2xl">✓</span>
              </div>
              <span className="text-gray-700 font-semibold text-lg">100+ Nichos</span>
            </div>
            <div className="flex flex-col items-center space-y-3 animate-bounce-in" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <span className="text-blue-600 text-2xl">✓</span>
              </div>
              <span className="text-gray-700 font-semibold text-lg">Profissionais + IA</span>
            </div>
            <div className="flex flex-col items-center space-y-3 animate-bounce-in" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <span className="text-purple-600 text-2xl">✓</span>
              </div>
              <span className="text-gray-700 font-semibold text-lg">Menos de 1 dia</span>
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
              className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-10 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 text-center min-w-[200px] hover:shadow-lg hover:-translate-y-1"
            >
              Começar Agora
            </Link>
          </div>

          {/* Problem Section */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-12 mb-20 max-w-6xl mx-auto border border-red-100">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
                🚨 O Problema que Você Conhece Bem
              </h2>
              <p className="text-lg text-gray-600 animate-fade-in-delay">
                Criar conteúdo de qualidade consome tempo e recursos preciosos
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Tempo Limitado</h3>
                <p className="text-gray-600">Horas gastas criando conteúdo que poderiam ser usadas para crescer seu negócio</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Custos Altos</h3>
                <p className="text-gray-600">Contratar redatores especializados custa caro e nem sempre entrega resultados</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">😰</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Falta de Especialização</h3>
                <p className="text-gray-600">Conteúdo genérico que não converte porque não fala a linguagem do seu nicho</p>
              </div>
            </div>
          </div>

          {/* Solution Section */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-3xl p-12 mb-20 max-w-6xl mx-auto border border-emerald-100">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
                ✨ A Solução que Você Precisa
              </h2>
              <p className="text-lg text-gray-600 animate-fade-in-delay">
                Profissionais especialistas + IA avançada para criar conteúdo profissional em menos de um dia
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 text-xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Velocidade Extrema</h3>
                    <p className="text-gray-600">Crie textos profissionais em segundos, não horas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Especialização por Nicho</h3>
                    <p className="text-gray-600">IA treinada especificamente para cada área de atuação</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-xl">📈</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Resultados Comprovados</h3>
                    <p className="text-gray-600">Mais de 10.000 textos criados com alta taxa de conversão</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="text-center">
                  <div className="text-6xl mb-4">🤖</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">IA NichoFy</h3>
                  <p className="text-gray-600 mb-6">A primeira IA brasileira especializada em copywriting por nicho</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-emerald-50 p-3 rounded-lg">
                      <div className="font-bold text-emerald-600">100+</div>
                      <div className="text-gray-600">Nichos</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="font-bold text-blue-600">10K+</div>
                      <div className="text-gray-600">Textos</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="font-bold text-purple-600">500+</div>
                      <div className="text-gray-600">Clientes</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="font-bold text-orange-600">24/7</div>
                      <div className="text-gray-600">Disponível</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 mb-20 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
                🚀 Como Funciona
              </h2>
              <p className="text-lg text-gray-600 animate-fade-in-delay">
                Três passos simples para criar conteúdo profissional
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Escolha seu Nicho</h3>
                <p className="text-gray-600">Selecione entre mais de 100 nichos especializados, desde direito até tecnologia</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Descreva seu Objetivo</h3>
                <p className="text-gray-600">Conte-nos o que você quer comunicar e para quem é direcionado</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Receba seu Conteúdo</h3>
                <p className="text-gray-600">Em menos de um dia, você tem conteúdo profissional pronto para usar</p>
              </div>
            </div>
          </div>

          {/* Nichos Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-12 mb-20 max-w-6xl mx-auto border border-indigo-100">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
                🎯 Nichos Especializados
              </h2>
              <p className="text-lg text-gray-600 animate-fade-in-delay">
                Profissionais especialistas + IA treinada especificamente para cada área de atuação
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Direito', icon: '⚖️', color: 'from-blue-500 to-indigo-500' },
                { name: 'Saúde', icon: '🏥', color: 'from-green-500 to-emerald-500' },
                { name: 'Tecnologia', icon: '💻', color: 'from-purple-500 to-pink-500' },
                { name: 'Educação', icon: '📚', color: 'from-orange-500 to-red-500' },
                { name: 'Finanças', icon: '💰', color: 'from-yellow-500 to-orange-500' },
                { name: 'Marketing', icon: '📢', color: 'from-pink-500 to-rose-500' },
                { name: 'Imóveis', icon: '🏠', color: 'from-teal-500 to-cyan-500' },
                { name: 'E-commerce', icon: '🛒', color: 'from-indigo-500 to-purple-500' }
              ].map((nicho, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-16 h-16 bg-gradient-to-r ${nicho.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl`}>
                    {nicho.icon}
                  </div>
                  <h3 className="font-bold text-gray-900">{nicho.name}</h3>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link 
                href="/nichos" 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
              >
                Ver Todos os Nichos
              </Link>
            </div>
          </div>

          {/* Pricing Preview */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-3xl p-12 mb-20 max-w-6xl mx-auto border border-emerald-100">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
                💎 Escolha Seu Plano
              </h2>
              <p className="text-lg text-gray-600 animate-fade-in-delay">
                Comece grátis ou escolha o plano ideal para você
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="text-4xl mb-4">🆓</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuito</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-4">R$ 0</div>
                  <p className="text-gray-600 mb-6">Perfeito para testar</p>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      3 conteúdos por mês
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Templates básicos
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Suporte por email
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Entrega em menos de 1 dia
                    </li>
                  </ul>
                  <Link 
                    href="/login?mode=signup" 
                    className="w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors block text-center"
                  >
                    Começar Grátis
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-emerald-500 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    MAIS POPULAR
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Básico</h3>
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-emerald-600">R$ 15</span>
                    <span className="text-gray-500 line-through ml-2">R$ 49,90</span>
                  </div>
                  <p className="text-gray-600 mb-6">Ideal para começar</p>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      15 conteúdos por mês
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Templates profissionais
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Suporte prioritário
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Entrega em menos de 1 dia
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Revisões ilimitadas
                    </li>
                  </ul>
                  <a 
                    href="https://pay.kirvano.com/e727b9f0-bf05-4862-b4ec-ba31d0f33c93" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 block text-center"
                  >
                    Comprar Agora
                  </a>
                </div>
              </div>
            </div>
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
                <div className="text-gray-600 font-medium">Conteúdos Profissionais</div>
              </div>
              <div className="text-center animate-bounce-in" style={{animationDelay: '0.2s'}}>
                <div className="text-4xl font-bold text-blue-500 mb-2">500+</div>
                <div className="text-gray-600 font-medium">Clientes Ativos</div>
              </div>
              <div className="text-center animate-bounce-in" style={{animationDelay: '0.3s'}}>
                <div className="text-4xl font-bold text-green-500 mb-2">100+</div>
                <div className="text-gray-600 font-medium">Nichos Especializados</div>
              </div>
              <div className="text-center animate-bounce-in" style={{animationDelay: '0.4s'}}>
                <div className="text-4xl font-bold text-purple-500 mb-2">&lt;1 dia</div>
                <div className="text-gray-600 font-medium">Prazo de Entrega</div>
              </div>
            </div>
          </div>

          {/* Text Generator */}
          <div className="mb-20">
            <TextGeneratorWithPreview />
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Profissionais + IA</h3>
              <p className="text-gray-600 text-center">
                Nossos especialistas trabalham junto com IA avançada para criar conteúdo profissional em menos de um dia.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-6 mx-auto hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Especialização</h3>
              <p className="text-gray-600 text-center">
                Mais de 100 nichos diferentes com IA treinada especificamente para cada área.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 mx-auto hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Resultados</h3>
              <p className="text-gray-600 text-center">
                Mais de 10.000 textos publicitários criados com resultados comprovados em conversão e vendas.
              </p>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
              <h2 className="text-4xl font-bold mb-6 animate-fade-in">
                Pronto para transformar seu conteúdo?
              </h2>
              <p className="text-xl mb-8 opacity-90 animate-fade-in-delay">
                Junte-se a mais de 500 empresas que já usam a NichoFy
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/login?mode=signup" 
                  className="bg-white text-emerald-600 px-12 py-4 rounded-xl font-bold text-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl animate-bounce-in"
                  style={{animationDelay: '0.5s'}}
                >
                  Começar Gratuitamente
                </Link>
                <Link 
                  href="/exemplos" 
                  className="border-2 border-white text-white px-12 py-4 rounded-xl font-bold text-xl hover:bg-white hover:text-emerald-600 transition-all duration-300 animate-bounce-in"
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