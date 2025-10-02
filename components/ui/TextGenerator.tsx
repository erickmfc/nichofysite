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

export const TextGenerator = ({ className = '' }: TextGeneratorProps) => {
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
    if (!prompt.trim()) {
      setError('Por favor, descreva o produto ou serviço que você quer promover')
      return
    }

    if (remainingTexts <= 0) {
      setError('Você atingiu o limite de 3 textos gratuitos')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, type: textType }),
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar texto')
      }

      const data = await response.json()
      
      const newText: GeneratedText = {
        id: Date.now().toString(),
        prompt: prompt,
        text: data.text,
        timestamp: new Date(),
        type: textType
      }

      const updatedTexts = [...generatedTexts, newText]
      const newCount = generatedTexts.length + 1

      setGeneratedTexts(updatedTexts)
      setRemainingTexts(Math.max(0, 3 - newCount))
      setPrompt('')
      
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

          {/* Sugestões */}
          <div className="bg-blue-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💡 Exemplos de produtos/serviços
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                'Curso online de marketing digital para iniciantes',
                'Consultoria jurídica especializada em direito trabalhista',
                'Produto de skincare natural para pele sensível',
                'Serviço de personal trainer online',
                'E-book sobre investimentos para iniciantes'
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(suggestion)}
                  className="text-left p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Textos Gerados
            </h3>
            
            {generatedTexts.length > 0 ? (
              <div className="space-y-4">
                {generatedTexts.map((text) => (
                  <div key={text.id} className="bg-white rounded-xl p-4 border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getTypeIcon(text.type)}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {getTypeLabel(text.type)}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(text.text)}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        📋 Copiar
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {text.text}
                      </p>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Produto:</strong> {text.prompt}
                    </div>
                    <div className="text-xs text-gray-500">
                      Gerado em: {text.timestamp.toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✍️</span>
                </div>
                <p>Nenhum texto gerado ainda</p>
                <p className="text-sm">Use o formulário ao lado para criar seu primeiro texto publicitário</p>
              </div>
            )}
          </div>

          {/* Upgrade Card */}
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Quer mais textos?</h3>
            <p className="text-white/90 mb-4">
              Faça upgrade para criar textos ilimitados
            </p>
            <button className="bg-white text-orange-500 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Fazer Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
