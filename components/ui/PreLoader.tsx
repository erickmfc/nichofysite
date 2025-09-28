'use client'

import { useState, useEffect } from 'react'

interface PreLoaderProps {
  onComplete: () => void
}

export const PreLoader: React.FC<PreLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [showLogo, setShowLogo] = useState(false)

  useEffect(() => {
    // Animação do logo
    const logoTimer = setTimeout(() => setShowLogo(true), 200)
    
    // Progresso da barra
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    return () => {
      clearTimeout(logoTimer)
      clearInterval(progressTimer)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo Animado */}
        <div className="mb-8">
          <div className={`transition-all duration-1000 ${showLogo ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="text-6xl font-bold text-white animate-pulse">N</div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
              </div>
              <div className="text-6xl font-bold text-white mx-2 animate-pulse delay-200">F</div>
              <div className="text-6xl font-bold text-white animate-pulse delay-400">y</div>
            </div>
            <div className="text-white text-lg font-medium tracking-wider">
              FÁBRICA DE CONTEÚDO
            </div>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-white rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Texto de Carregamento */}
        <div className="mt-4 text-white/80 text-sm">
          Preparando sua experiência...
        </div>
      </div>
    </div>
  )
}
