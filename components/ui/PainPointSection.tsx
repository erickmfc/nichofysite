'use client'

import { useState } from 'react'

interface PainCardProps {
  icon: string
  title: string
  problem: string
  solution: string
  delay?: number
}

const PainCard: React.FC<PainCardProps> = ({ icon, title, problem, solution, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`group relative cursor-pointer transition-all duration-700 transform hover:scale-105 ${
        isHovered ? 'z-10' : ''
      }`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Principal */}
      <div className={`
        relative bg-white rounded-2xl shadow-xl p-8 h-64 flex flex-col justify-center items-center text-center
        transition-all duration-700 overflow-hidden
        ${isHovered 
          ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-2xl' 
          : 'hover:shadow-2xl'
        }
      `}>
        {/* Ícone */}
        <div className={`
          text-6xl mb-4 transition-all duration-500 transform
          ${isHovered ? 'scale-110 rotate-12' : 'group-hover:scale-105'}
        `}>
          {icon}
        </div>

        {/* Conteúdo */}
        <div className="relative z-10">
          <h3 className={`
            text-xl font-bold mb-3 transition-all duration-500
            ${isHovered ? 'text-white' : 'text-gray-800'}
          `}>
            {title}
          </h3>
          
          <div className="relative overflow-hidden">
            {/* Problema */}
            <p className={`
              text-lg transition-all duration-500 absolute inset-0
              ${isHovered 
                ? 'opacity-0 transform translate-y-4' 
                : 'opacity-100 transform translate-y-0'
              }
              ${isHovered ? 'text-white' : 'text-gray-600'}
            `}>
              {problem}
            </p>
            
            {/* Solução */}
            <p className={`
              text-lg font-medium transition-all duration-500 absolute inset-0
              ${isHovered 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-0 transform -translate-y-4'
              }
              text-white
            `}>
              {solution}
            </p>
          </div>
        </div>

        {/* Efeito de quebra */}
        <div className={`
          absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 opacity-0
          transition-all duration-700 transform
          ${isHovered ? 'opacity-100 scale-110' : 'scale-95'}
        `} />
        
        {/* Partículas de quebra */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-2 h-2 bg-white/30 rounded-full
                transition-all duration-1000
                ${isHovered 
                  ? 'opacity-100' 
                  : 'opacity-0'
                }
              `}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 100}ms`,
                animation: isHovered ? 'float 2s ease-in-out infinite' : 'none'
              }}
            />
          ))}
        </div>
      </div>

      {/* Seta indicativa */}
      <div className={`
        absolute -bottom-4 left-1/2 transform -translate-x-1/2
        transition-all duration-500
        ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
      `}>
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-primary-500" />
      </div>
    </div>
  )
}

export const PainPointSection: React.FC = () => {
  const painPoints = [
    {
      icon: '⏰',
      title: 'Falta de Tempo',
      problem: 'Horas no Canva tentando montar posts...',
      solution: 'Receba posts prontos em minutos.',
      delay: 0
    },
    {
      icon: '🎯',
      title: 'Falta de Ideias',
      problem: 'O que postar hoje?',
      solution: 'Sugestões criadas sob medida para o seu nicho.',
      delay: 200
    },
    {
      icon: '💸',
      title: 'Custo Alto',
      problem: 'Agência cobra R$1.000+/mês...',
      solution: 'Planos a partir de R$97.',
      delay: 400
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-500/10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-yellow-400/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-primary-500/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-text-reveal">
            Ainda perdendo horas criando posts que{' '}
            <span className="text-yellow-400">ninguém curte?</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto animate-text-reveal" style={{ animationDelay: '0.5s' }}>
            Pare de desperdiçar tempo e dinheiro. Veja como o NichoFy resolve seus problemas:
          </p>
        </div>

        {/* Cards de Dor */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {painPoints.map((point, index) => (
            <PainCard
              key={index}
              icon={point.icon}
              title={point.title}
              problem={point.problem}
              solution={point.solution}
              delay={point.delay}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-text-reveal" style={{ animationDelay: '1s' }}>
          <p className="text-2xl text-white/90 mb-8">
            <span className="text-yellow-400 font-bold">Verdade, isso acontece comigo!</span>
          </p>
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-105">
              🚀 Quero resolver isso agora!
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
