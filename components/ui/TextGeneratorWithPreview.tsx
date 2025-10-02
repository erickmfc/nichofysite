'use client'

import { useState, useEffect } from 'react'
import { PostPreview } from './PostPreview'

interface TextGeneratorProps {
  className?: string
}

interface GeneratedText {
  id: string
  prompt: string
  text: string
  timestamp: Date
  type: 'copy' | 'post' | 'anuncio' | 'email'
}

export const TextGeneratorWithPreview = ({ className = '' }: TextGeneratorProps) => {
  const [prompt, setPrompt] = useState('')
  const [textType, setTextType] = useState<'copy' | 'post' | 'anuncio' | 'email'>('copy')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTexts, setGeneratedTexts] = useState<GeneratedText[]>([])
  const [remainingTexts, setRemainingTexts] = useState(3)
  const [error, setError] = useState('')

  // Carregar dados do localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const savedTexts = localStorage.getItem('nichofy-generated-texts')
    const savedCount = localStorage.getItem('nichofy-text-count')
    
    if (savedTexts) {
      setGeneratedTexts(JSON.parse(savedTexts))
    }
    
    if (savedCount) {
      const count = parseInt(savedCount)
      setRemainingTexts(Math.max(0, 3 - count))
    }
  }, [])

  // Salvar dados no localStorage
  const saveToLocalStorage = (texts: GeneratedText[], count: number) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('nichofy-generated-texts', JSON.stringify(texts))
    localStorage.setItem('nichofy-text-count', count.toString())
  }

  const generateText = async () => {
    if (!prompt.trim() || remainingTexts <= 0) return

    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          type: textType
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar texto')
      }

      const data = await response.json()
      
      const newText: GeneratedText = {
        id: Date.now().toString(),
        prompt: prompt.trim(),
        text: data.text,
        timestamp: new Date(),
        type: textType
      }

      const updatedTexts = [newText, ...generatedTexts]
      setGeneratedTexts(updatedTexts)
      setRemainingTexts(prev => Math.max(0, prev - 1))
      
      const newCount = generatedTexts.length + 1
      saveToLocalStorage(updatedTexts, newCount)

    } catch (error) {
      console.error('Erro ao gerar texto:', error)
      setError('Erro ao gerar texto. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const clearTexts = () => {
    setGeneratedTexts([])
    setRemainingTexts(3)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nichofy-generated-texts')
      localStorage.removeItem('nichofy-text-count')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Aqui você pode adicionar uma notificação de sucesso
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      'copy': 'Copy Publicitário',
      'post': 'Post para Redes Sociais',
      'anuncio': 'Anúncio',
      'email': 'Email Marketing'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      'copy': '📝',
      'post': '📱',
      'anuncio': '📢',
      'email': '📧'
    }
    return icons[type as keyof typeof icons] || '📝'
  }

  return (
    <div className={`bg-white rounded-3xl shadow-2xl p-8 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Teste Grátis - Gerador de Textos Publicitários IA
        </h2>
        <p className="text-lg text-gray-600">
          Crie textos persuasivos e criativos com nossa IA especializada. Limite de 3 textos gratuitos por pessoa.
        </p>
        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-3 inline-block">
          <span className="text-orange-700 font-medium">
            🎁 {remainingTexts} textos restantes
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Descreva o que você quer promover
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de texto
                </label>
                <select
                  value={textType}
                  onChange={(e) => setTextType(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                >
                  <option value="copy">📝 Copy Publicitário</option>
                  <option value="post">📱 Post para Redes Sociais</option>
                  <option value="anuncio">📢 Anúncio</option>
                  <option value="email">📧 Email Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição do produto/serviço
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none"
                  placeholder="Ex: Curso online de marketing digital para iniciantes, com certificado e suporte..."
                  rows={4}
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {prompt.length}/500 caracteres
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={generateText}
                  disabled={isGenerating || remainingTexts <= 0 || !prompt.trim()}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    isGenerating || remainingTexts <= 0 || !prompt.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Gerando...
                    </div>
                  ) : (
                    '✨ Gerar Texto'
                  )}
                </button>

                <button
                  onClick={clearTexts}
                  className="py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  🗑️ Limpar
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Preview em Tempo Real */}
          {prompt && (
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📱 Preview em Tempo Real
              </h3>
              <PostPreview 
                text={prompt}
                type={textType}
                className="max-w-md mx-auto"
              />
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Textos Gerados
            </h3>
            
            {generatedTexts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-600">
                  Nenhum texto gerado ainda. Crie seu primeiro texto!
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {generatedTexts.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getTypeIcon(item.type)}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {getTypeLabel(item.type)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyToClipboard(item.text)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          title="Copiar"
                        >
                          📋
                        </button>
                        <span className="text-xs text-gray-500">
                          {item.timestamp.toLocaleTimeString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-800 leading-relaxed">
                      {item.text}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        <strong>Prompt:</strong> {item.prompt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upgrade Prompt */}
          {remainingTexts === 0 && (
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 text-white text-center">
              <h3 className="text-lg font-semibold mb-2">
                🚀 Limite Gratuito Esgotado
              </h3>
              <p className="text-sm mb-4">
                Você usou todos os seus textos gratuitos. Faça upgrade para continuar criando!
              </p>
              <button className="bg-white text-orange-500 px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                💎 Fazer Upgrade
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
