'use client'

import { useState, useEffect } from 'react'

interface InteractiveDemoProps {
  className?: string
}

export const InteractiveDemo = ({ className = '' }: InteractiveDemoProps) => {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [generatedContent, setGeneratedContent] = useState('')

  const demoSteps = [
    {
      title: 'Escolhendo o nicho...',
      content: 'Analisando perfil: Direito Trabalhista',
      icon: '🎯'
    },
    {
      title: 'Analisando tendências...',
      content: 'Identificando tópicos em alta: #DireitoTrabalhista',
      icon: '📊'
    },
    {
      title: 'Criando conteúdo...',
      content: 'Gerando post otimizado para engajamento',
      icon: '✨'
    },
    {
      title: 'Finalizando...',
      content: 'Aplicando tom profissional e hashtags relevantes',
      icon: '🎨'
    }
  ]

  const finalContent = {
    title: 'Demissão via WhatsApp: Você tem direitos!',
    content: `Você sabia que ser demitido via WhatsApp pode render uma indenização de até 40% do FGTS? 

📱 A demissão por mensagem é considerada abusiva pela Justiça do Trabalho
💰 Você tem direito a indenização por danos morais
⚖️ Procure um advogado especializado em direito trabalhista

#DireitoTrabalhista #DemissaoAbusiva #DireitosDoTrabalhador #JusticaTrabalhista #AdvogadoTrabalhista`,
    metrics: {
      engagement: '+340%',
      reach: '+280%',
      saves: '+190%'
    }
  }

  const startDemo = () => {
    setIsRunning(true)
    setCurrentStep(0)
    setGeneratedContent('')
  }

  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= demoSteps.length - 1) {
          setIsRunning(false)
          setGeneratedContent(finalContent.content)
          return prev
        }
        return prev + 1
      })
    }, 2000)

    return () => clearInterval(timer)
  }, [isRunning])

  return (
    <div className={`bg-white rounded-3xl shadow-2xl p-8 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Veja a IA em ação
        </h2>
        <p className="text-lg text-gray-600">
          Demonstração em tempo real da criação de conteúdo profissional
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Demo Area */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Processo de Criação
            </h3>
            
            {isRunning ? (
              <div className="space-y-4">
                {demoSteps.map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-500 ${
                      index <= currentStep 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep ? 'bg-orange-500 text-white' : 'bg-gray-300'
                    }`}>
                      {index < currentStep ? '✓' : step.icon}
                    </div>
                    <div>
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm opacity-80">{step.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚀</span>
                </div>
                <p className="text-gray-600">Clique em "Iniciar Demo" para ver a IA criando conteúdo</p>
              </div>
            )}
          </div>

          <button
            onClick={startDemo}
            disabled={isRunning}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              isRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            }`}
          >
            {isRunning ? 'Demo em andamento...' : 'Iniciar Demo'}
          </button>
        </div>

        {/* Result Area */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resultado Final
            </h3>
            
            {generatedContent ? (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border-l-4 border-orange-500">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {finalContent.title}
                  </h4>
                  <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                    {generatedContent}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 text-green-700 p-3 rounded-xl text-center">
                    <div className="text-lg font-bold">{finalContent.metrics.engagement}</div>
                    <div className="text-xs">Engajamento</div>
                  </div>
                  <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-center">
                    <div className="text-lg font-bold">{finalContent.metrics.reach}</div>
                    <div className="text-xs">Alcance</div>
                  </div>
                  <div className="bg-purple-50 text-purple-700 p-3 rounded-xl text-center">
                    <div className="text-lg font-bold">{finalContent.metrics.saves}</div>
                    <div className="text-xs">Salvamentos</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📝</span>
                </div>
                <p>O conteúdo aparecerá aqui após a demonstração</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Tempo de Criação</h3>
            <div className="text-4xl font-bold mb-2">8 segundos</div>
            <p className="text-white/90">vs. 2 horas manualmente</p>
          </div>
        </div>
      </div>
    </div>
  )
}
