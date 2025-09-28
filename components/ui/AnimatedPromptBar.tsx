'use client'

import { useState, useEffect } from 'react'
import { Button } from './Button'

interface AnimatedPromptBarProps {
  onContentGenerated: (content: string) => void
}

const examplePrompts = [
  "post sobre o dia do café para minha cafeteria",
  "ideias de stories para promover o corte da semana na minha barbearia",
  "conteúdo sobre direito trabalhista para meu escritório",
  "posts sobre saúde preventiva para minha clínica",
  "conteúdo sobre investimentos para meu perfil financeiro"
]

export const AnimatedPromptBar: React.FC<AnimatedPromptBarProps> = ({ onContentGenerated }) => {
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [showCursor, setShowCursor] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const prompt = examplePrompts[currentIndex]
    let charIndex = 0
    let timeoutId: NodeJS.Timeout

    const typeText = () => {
      if (charIndex <= prompt.length) {
        setCurrentPrompt(prompt.slice(0, charIndex))
        charIndex++
        timeoutId = setTimeout(typeText, 150)
      } else {
        // Texto completo - pausa para mostrar
        setIsPaused(true)
        onContentGenerated(prompt)
        
        // Após mostrar, apaga o texto
        setTimeout(() => {
          setIsPaused(false)
          setIsTyping(false)
          
          // Apaga o texto
          const eraseText = () => {
            if (charIndex >= 0) {
              setCurrentPrompt(prompt.slice(0, charIndex))
              charIndex--
              timeoutId = setTimeout(eraseText, 100)
            } else {
              // Texto apagado - muda para próximo
              setTimeout(() => {
                setIsTyping(true)
                setCurrentIndex((prev) => (prev + 1) % examplePrompts.length)
              }, 1000)
            }
          }
          eraseText()
        }, 3000) // Mostra por 3 segundos
      }
    }

    timeoutId = setTimeout(typeText, 1000)
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [currentIndex, onContentGenerated, isPaused])

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 600) // Cursor mais lento
    return () => clearInterval(cursorTimer)
  }, [])

  return (
    <div className="relative max-w-2xl mx-auto px-4">
      <div className="relative">
        <input
          type="text"
          value={currentPrompt}
          readOnly
          className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
          placeholder="Digite sua solicitação..."
        />
        {isTyping && (
          <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2">
            <div className={`w-0.5 h-4 sm:h-6 bg-white transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        )}
      </div>
      
      <div className="mt-4 sm:mt-6 text-center">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
        >
          ✨ Criar meu conteúdo (Grátis)
        </Button>
      </div>
    </div>
  )
}
