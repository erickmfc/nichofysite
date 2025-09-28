'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { PreLoader } from '@/components/ui/PreLoader'
import { AnimatedPromptBar } from '@/components/ui/AnimatedPromptBar'
import { FlyingContentCards } from '@/components/ui/FlyingContentCards'
import { InfiniteContentFlow } from '@/components/ui/InfiniteContentFlow'
import { ProjectsCarousel } from '@/components/ui/ProjectsCarousel'
import { PainPointSection } from '@/components/ui/PainPointSection'
import { HowItWorksSection } from '@/components/ui/HowItWorksSection'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentContent, setCurrentContent] = useState('')
  const [showCards, setShowCards] = useState(false)

  const handleContentGenerated = (content: string) => {
    setCurrentContent(content)
    setShowCards(true)
    setTimeout(() => setShowCards(false), 3000)
  }

  const handlePreLoaderComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <PreLoader onComplete={handlePreLoaderComplete} />
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section - A Fábrica de Conteúdo */}
      <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 animate-gradient">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Conteúdo Principal */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Título Principal */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6 md:mb-8 animate-text-reveal leading-tight">
              Sua fábrica de conteúdo.
              <br />
              <span className="text-yellow-400">Em instantes.</span>
            </h1>
            
            {/* Subtítulo */}
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 md:mb-12 animate-text-reveal px-4" style={{ animationDelay: '0.8s' }}>
              Veja a mágica acontecer em tempo real
            </p>
            
            {/* Caixa de Texto Animada */}
            <div className="relative animate-text-reveal" style={{ animationDelay: '1.5s' }}>
              <AnimatedPromptBar onContentGenerated={handleContentGenerated} />
              
              {/* Cards Voando */}
              <FlyingContentCards content={currentContent} isActive={showCards} />
            </div>
          </div>
        </div>
        
        {/* Elementos Decorativos */}
        <div className="absolute top-10 left-4 sm:top-20 sm:left-20 w-16 h-16 sm:w-32 sm:h-32 bg-yellow-400/20 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-4 sm:bottom-20 sm:right-20 w-12 h-12 sm:w-24 sm:h-24 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-2 sm:left-10 w-8 h-8 sm:w-16 sm:h-16 bg-yellow-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Seção de Dor Interativa */}
      <PainPointSection />

      {/* Como Funciona - Timeline Interativa */}
      <HowItWorksSection />

      {/* Rio Infinito de Conteúdo */}
      <section className="min-h-screen relative bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 pt-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-text-reveal">
              Conteúdo Infinito
            </h2>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto animate-text-reveal" style={{ animationDelay: '0.5s' }}>
              Para todos os nichos. O tempo todo. Veja nossa IA criando conteúdo em tempo real.
            </p>
          </div>
          
          <div className="relative h-[600px] overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-white/20 shadow-2xl">
            <InfiniteContentFlow />
            
            {/* Overlay com estatísticas */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-md rounded-2xl px-8 py-4 text-white text-center border border-white/20 shadow-lg">
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 drop-shadow-lg">10+</div>
                  <div className="text-sm text-white/90 font-medium">Nichos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 drop-shadow-lg">∞</div>
                  <div className="text-sm text-white/90 font-medium">Conteúdo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 drop-shadow-lg">24/7</div>
                  <div className="text-sm text-white/90 font-medium">Disponível</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carrossel de Projetos */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Nossos Projetos em Destaque
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Veja alguns dos trabalhos incríveis que criamos para nossos clientes
            </p>
          </div>
          
          <ProjectsCarousel projects={[]} />
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Histórias reais de quem transformou seu negócio com a NichoFy
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Depoimento 1 */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow animate-fade-in-up">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <p className="text-gray-700 mb-6 italic">
                "A NichoFy revolucionou nossa presença digital. Em 3 meses, aumentamos nossas vendas em 200% e nossa equipe economizou 15 horas por semana."
              </p>
              <div>
                <p className="font-bold text-gray-900">Carlos Silva</p>
                <p className="text-sm text-gray-600">Proprietário - Cafeteria Artesanal</p>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">✂️</span>
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Nunca pensei que conteúdo pudesse fazer tanta diferença. Agora temos fila de espera e nossos clientes nos indicam constantemente."
              </p>
              <div>
                <p className="font-bold text-gray-900">Marina Santos</p>
                <p className="text-sm text-gray-600">Proprietária - Barbearia Style</p>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚖️</span>
              </div>
              <p className="text-gray-700 mb-6 italic">
                "O conteúdo educativa que criamos estabeleceu nossa autoridade no mercado. Agora somos referência em direito trabalhista na região."
              </p>
              <div>
                <p className="font-bold text-gray-900">Dr. Roberto Lima</p>
                <p className="text-sm text-gray-600">Sócio - Advocacia & Justiça</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Números que impressionam
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Resultados reais de quem confia na NichoFy
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-count-up">
              <div className="text-5xl font-bold text-yellow-400 mb-2">500+</div>
              <p className="text-white/80">Clientes satisfeitos</p>
            </div>
            <div className="animate-count-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl font-bold text-yellow-400 mb-2">50K+</div>
              <p className="text-white/80">Posts criados</p>
            </div>
            <div className="animate-count-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-5xl font-bold text-yellow-400 mb-2">95%</div>
              <p className="text-white/80">Taxa de satisfação</p>
            </div>
            <div className="animate-count-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-5xl font-bold text-yellow-400 mb-2">24h</div>
              <p className="text-white/80">Suporte disponível</p>
            </div>
          </div>
        </div>
      </section>

      {/* Planos e CTA Final */}
      <section className="min-h-screen relative bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-8 animate-text-reveal">
            Sua marca merece ser vista.
          </h2>
          <p className="text-2xl text-white/90 mb-12 animate-text-reveal" style={{ animationDelay: '0.8s' }}>
            Vamos começar?
          </p>
          
          <div className="animate-text-reveal" style={{ animationDelay: '1.2s' }}>
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-12 py-6 text-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
            >
              🚀 Testar o NichoFy de Graça
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
} 