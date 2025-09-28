'use client'

import { ReactNode } from 'react'

interface ResponsiveTemplateProps {
  children: ReactNode
  colorScheme: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info'
  title: string
  subtitle: string
  features?: string[]
}

const colorSchemes = {
  primary: {
    hero: 'from-blue-600 via-blue-500 to-blue-700',
    accent: 'text-blue-400',
    card: 'from-blue-50 to-blue-100',
    button: 'bg-blue-500 hover:bg-blue-600',
    icon: 'bg-blue-500'
  },
  secondary: {
    hero: 'from-purple-600 via-purple-500 to-purple-700',
    accent: 'text-purple-400',
    card: 'from-purple-50 to-purple-100',
    button: 'bg-purple-500 hover:bg-purple-600',
    icon: 'bg-purple-500'
  },
  accent: {
    hero: 'from-orange-600 via-orange-500 to-orange-700',
    accent: 'text-orange-400',
    card: 'from-orange-50 to-orange-100',
    button: 'bg-orange-500 hover:bg-orange-600',
    icon: 'bg-orange-500'
  },
  success: {
    hero: 'from-green-600 via-green-500 to-green-700',
    accent: 'text-green-400',
    card: 'from-green-50 to-green-100',
    button: 'bg-green-500 hover:bg-green-600',
    icon: 'bg-green-500'
  },
  warning: {
    hero: 'from-yellow-600 via-yellow-500 to-yellow-700',
    accent: 'text-yellow-400',
    card: 'from-yellow-50 to-yellow-100',
    button: 'bg-yellow-500 hover:bg-yellow-600',
    icon: 'bg-yellow-500'
  },
  info: {
    hero: 'from-cyan-600 via-cyan-500 to-cyan-700',
    accent: 'text-cyan-400',
    card: 'from-cyan-50 to-cyan-100',
    button: 'bg-cyan-500 hover:bg-cyan-600',
    icon: 'bg-cyan-500'
  }
}

export const ResponsiveTemplate: React.FC<ResponsiveTemplateProps> = ({ 
  children, 
  colorScheme, 
  title, 
  subtitle, 
  features = [] 
}) => {
  const colors = colorSchemes[colorScheme]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className={`bg-gradient-to-br ${colors.hero} py-20 text-white relative overflow-hidden`}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse" />
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-text-reveal">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-text-reveal" style={{ animationDelay: '0.5s' }}>
              {subtitle}
            </p>
            
            {features.length > 0 && (
              <div className="flex flex-wrap justify-center items-center gap-4 text-white/80 animate-text-reveal" style={{ animationDelay: '1s' }}>
                {features.map((feature, index) => (
                  <span key={index} className="text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                    {feature}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Por que escolher nossa plataforma?
              </h2>
              <p className="text-xl text-gray-600">
                Recursos que fazem a diferença no seu sucesso
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className={`text-center p-8 bg-gradient-to-br ${colors.card} rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2`}>
                <div className={`w-16 h-16 ${colors.icon} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <span className="text-2xl text-white">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Rápido e Eficiente
                </h3>
                <p className="text-gray-600">
                  Conteúdo profissional gerado em minutos, não horas.
                </p>
              </div>

              <div className={`text-center p-8 bg-gradient-to-br ${colors.card} rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2`} style={{ animationDelay: '0.2s' }}>
                <div className={`w-16 h-16 ${colors.icon} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <span className="text-2xl text-white">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Especializado
                </h3>
                <p className="text-gray-600">
                  Conteúdo técnico e especializado para cada nicho.
                </p>
              </div>

              <div className={`text-center p-8 bg-gradient-to-br ${colors.card} rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2`} style={{ animationDelay: '0.4s' }}>
                <div className={`w-16 h-16 ${colors.icon} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <span className="text-2xl text-white">📈</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Resultados Comprovados
                </h3>
                <p className="text-gray-600">
                  Métricas e análises para otimizar seu desempenho.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 bg-gradient-to-r ${colors.hero} text-white`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-white/90">
            Transforme sua presença digital com conteúdo profissional e especializado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className={`${colors.button} text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
              🚀 Saiba Mais
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300">
              📋 Ver Exemplos
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

