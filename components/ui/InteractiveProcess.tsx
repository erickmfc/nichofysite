'use client'

import { useState, useEffect } from 'react'

interface InteractiveProcessProps {
  currentStep: number
}

export const InteractiveProcess: React.FC<InteractiveProcessProps> = ({ currentStep }) => {
  const [stepData, setStepData] = useState({
    step1: { completed: false, typing: false, text: '' },
    step2: { completed: false, typing: false, text: '' },
    step3: { completed: false, showing: false }
  })

  useEffect(() => {
    if (currentStep === 1) {
      // Passo 1: Seleção de nicho
      setTimeout(() => {
        setStepData(prev => ({ ...prev, step1: { ...prev.step1, typing: true } }))
        
        const typeText = () => {
          const text = 'Barbearia'
          let index = 0
          const timer = setInterval(() => {
            if (index <= text.length) {
              setStepData(prev => ({ 
                ...prev, 
                step1: { ...prev.step1, text: text.slice(0, index) }
              }))
              index++
            } else {
              clearInterval(timer)
              setTimeout(() => {
                setStepData(prev => ({ 
                  ...prev, 
                  step1: { ...prev.step1, completed: true, typing: false }
                }))
              }, 1000)
            }
          }, 150)
        }
        
        setTimeout(typeText, 500)
      }, 1000)
    }

    if (currentStep === 2) {
      // Passo 2: Pedido de conteúdo
      setTimeout(() => {
        setStepData(prev => ({ ...prev, step2: { ...prev.step2, typing: true } }))
        
        const typeText = () => {
          const text = 'Post de promoção para o Dia dos Pais'
          let index = 0
          const timer = setInterval(() => {
            if (index <= text.length) {
              setStepData(prev => ({ 
                ...prev, 
                step2: { ...prev.step2, text: text.slice(0, index) }
              }))
              index++
            } else {
              clearInterval(timer)
              setTimeout(() => {
                setStepData(prev => ({ 
                  ...prev, 
                  step2: { ...prev.step2, completed: true, typing: false }
                }))
              }, 1000)
            }
          }, 100)
        }
        
        setTimeout(typeText, 500)
      }, 1000)
    }

    if (currentStep === 3) {
      // Passo 3: Mostrar resultado
      setTimeout(() => {
        setStepData(prev => ({ ...prev, step3: { ...prev.step3, showing: true } }))
      }, 1000)
    }
  }, [currentStep])

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Número de fundo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`text-[20rem] font-bold text-white/10 transition-all duration-1000 ${
          currentStep === 1 ? 'opacity-100' : 'opacity-0'
        }`}>
          1
        </div>
        <div className={`text-[20rem] font-bold text-white/10 transition-all duration-1000 ${
          currentStep === 2 ? 'opacity-100' : 'opacity-0'
        }`}>
          2
        </div>
        <div className={`text-[20rem] font-bold text-white/10 transition-all duration-1000 ${
          currentStep === 3 ? 'opacity-100' : 'opacity-0'
        }`}>
          3
        </div>
      </div>

      {/* Conteúdo central */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        {/* Passo 1 */}
        {currentStep === 1 && (
          <div className="animate-text-reveal">
            <h2 className="text-4xl font-bold text-white mb-8">Diga quem você é</h2>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <div className="text-white/60 mb-4">Qual o seu nicho?</div>
              <div className="bg-white/20 rounded-lg p-4 min-h-[60px] flex items-center justify-center">
                <span className="text-white text-xl">
                  {stepData.step1.text}
                  {stepData.step1.typing && <span className="animate-pulse">|</span>}
                </span>
                {stepData.step1.completed && (
                  <span className="ml-4 text-green-400 text-2xl">✅</span>
                )}
              </div>
            </div>
            
            <p className="text-white/80 text-lg">
              Escolha seu nicho para receber conteúdo sob medida.
            </p>
          </div>
        )}

        {/* Passo 2 */}
        {currentStep === 2 && (
          <div className="animate-text-reveal">
            <h2 className="text-4xl font-bold text-white mb-8">Peça o que precisa</h2>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <div className="text-white/60 mb-4">Descreva sua ideia:</div>
              <div className="bg-white/20 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
                <span className="text-white text-lg text-center">
                  {stepData.step2.text}
                  {stepData.step2.typing && <span className="animate-pulse">|</span>}
                </span>
                {stepData.step2.completed && (
                  <span className="ml-4 text-green-400 text-2xl">✅</span>
                )}
              </div>
            </div>
            
            <p className="text-white/80 text-lg">
              Descreva sua ideia de forma simples. A nossa IA faz o resto.
            </p>
          </div>
        )}

        {/* Passo 3 */}
        {currentStep === 3 && (
          <div className="animate-text-reveal">
            <h2 className="text-4xl font-bold text-white mb-8">Veja acontecer</h2>
            
            {stepData.step3.showing && (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Post 1 */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white animate-fly-in">
                  <div className="text-center">
                    <div className="text-2xl mb-2">✂️</div>
                    <h3 className="font-bold mb-2">Dia dos Pais</h3>
                    <p className="text-sm">Corte + Barba = Presente perfeito! Agende já e surpreenda seu pai com um visual incrível. 💙</p>
                  </div>
                </div>

                {/* Post 2 */}
                <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white animate-fly-in" style={{ animationDelay: '0.3s' }}>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎁</div>
                    <h3 className="font-bold mb-2">Promoção Especial</h3>
                    <p className="text-sm">Pacote completo: Corte + Barba + Sobrancelha por apenas R$ 45! Válido até o Dia dos Pais.</p>
                  </div>
                </div>

                {/* Post 3 */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white animate-fly-in" style={{ animationDelay: '0.6s' }}>
                  <div className="text-center">
                    <div className="text-2xl mb-2">👨‍👦</div>
                    <h3 className="font-bold mb-2">Momento Especial</h3>
                    <p className="text-sm">Que tal um corte pai e filho? Crie memórias especiais neste Dia dos Pais conosco!</p>
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-white/80 text-lg">
              Conteúdo profissional e irresistível em minutos.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
