'use client'

import { useState, useEffect } from 'react'

interface ImageGeneratorProps {
  className?: string
}

interface GeneratedImage {
  id: string
  prompt: string
  imageUrl: string
  timestamp: Date
}

export const ImageGenerator = ({ className = '' }: ImageGeneratorProps) => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [remainingImages, setRemainingImages] = useState(2)
  const [error, setError] = useState('')

  // Carregar dados do localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const savedImages = localStorage.getItem('nichofy-generated-images')
    const savedCount = localStorage.getItem('nichofy-image-count')
    
    if (savedImages) {
      setGeneratedImages(JSON.parse(savedImages))
    }
    
    if (savedCount) {
      const count = parseInt(savedCount)
      setRemainingImages(Math.max(0, 2 - count))
    }
  }, [])

  // Salvar dados no localStorage
  const saveToLocalStorage = (images: GeneratedImage[], count: number) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('nichofy-generated-images', JSON.stringify(images))
    localStorage.setItem('nichofy-image-count', count.toString())
  }

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Por favor, digite uma descrição para a imagem')
      return
    }

    if (remainingImages <= 0) {
      setError('Você atingiu o limite de 2 imagens gratuitas')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      // Simular chamada para API do Gemini (substituir pela API real)
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar imagem')
      }

      const data = await response.json()
      
      // Para demonstração, usar uma imagem placeholder
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt: prompt,
        imageUrl: `https://picsum.photos/400/400?random=${Date.now()}`,
        timestamp: new Date()
      }

      const updatedImages = [...generatedImages, newImage]
      const newCount = generatedImages.length + 1

      setGeneratedImages(updatedImages)
      setRemainingImages(Math.max(0, 2 - newCount))
      setPrompt('')
      
      saveToLocalStorage(updatedImages, newCount)

    } catch (error) {
      console.error('Erro ao gerar imagem:', error)
      setError('Erro ao gerar imagem. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const clearImages = () => {
    setGeneratedImages([])
    setRemainingImages(2)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nichofy-generated-images')
      localStorage.removeItem('nichofy-image-count')
    }
  }

  return (
    <div className={`bg-white rounded-3xl shadow-2xl p-8 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Teste Grátis - Gerador de Imagens IA
        </h2>
        <p className="text-lg text-gray-600">
          Crie imagens profissionais com nossa IA. Limite de 2 imagens gratuitas por pessoa.
        </p>
        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-3 inline-block">
          <span className="text-orange-700 font-medium">
            🎁 {remainingImages} imagens restantes
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Descreva a imagem que você quer criar
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição da imagem
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none"
                  placeholder="Ex: Um advogado profissional em um escritório moderno, sorrindo confiante..."
                  rows={4}
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {prompt.length}/500 caracteres
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={generateImage}
                  disabled={isGenerating || remainingImages <= 0 || !prompt.trim()}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    isGenerating || remainingImages <= 0 || !prompt.trim()
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
                    '✨ Gerar Imagem'
                  )}
                </button>

                <button
                  onClick={clearImages}
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
              💡 Sugestões de prompts
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                'Advogado profissional em escritório moderno',
                'Nutricionista explicando alimentação saudável',
                'Personal trainer motivando cliente na academia',
                'Psicóloga em consultório aconchegante',
                'Contador organizando documentos importantes'
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
              Imagens Geradas
            </h3>
            
            {generatedImages.length > 0 ? (
              <div className="space-y-4">
                {generatedImages.map((image) => (
                  <div key={image.id} className="bg-white rounded-xl p-4 border">
                    <div className="mb-3">
                      <img
                        src={image.imageUrl}
                        alt={image.prompt}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Prompt:</strong> {image.prompt}
                    </div>
                    <div className="text-xs text-gray-500">
                      Gerado em: {image.timestamp.toLocaleString('pt-BR')}
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="flex-1 bg-orange-100 text-orange-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors">
                        📥 Baixar
                      </button>
                      <button className="flex-1 bg-blue-100 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                        🔗 Compartilhar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎨</span>
                </div>
                <p>Nenhuma imagem gerada ainda</p>
                <p className="text-sm">Use o formulário ao lado para criar sua primeira imagem</p>
              </div>
            )}
          </div>

          {/* Upgrade Card */}
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Quer mais imagens?</h3>
            <p className="text-white/90 mb-4">
              Faça upgrade para criar imagens ilimitadas
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
