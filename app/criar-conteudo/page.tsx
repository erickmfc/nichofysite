'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useState } from 'react'

export default function CriarConteudoPage() {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      // Simular geração de conteúdo
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Conteúdo gerado com sucesso!')
    } catch (err) {
      alert('Erro ao gerar conteúdo. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Criar Conteúdo</h1>
          
          <div className="bg-white p-8 rounded-lg shadow">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Conteúdo</label>
                <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Post para Instagram</option>
                  <option>Post para LinkedIn</option>
                  <option>Artigo para Blog</option>
                  <option>Story para Instagram</option>
                  <option>Thread para Twitter</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Nicho</label>
                <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Direito</option>
                  <option>Saúde</option>
                  <option>Tecnologia</option>
                  <option>Educação</option>
                  <option>Negócios</option>
                  <option>Marketing</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tópico</label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Direito trabalhista, saúde mental, IA..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea 
                  className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Descreva o que você quer criar..."
                ></textarea>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? 'Gerando...' : 'Gerar Conteúdo'}
                </button>
                <button 
                  onClick={() => alert('Rascunho salvo!')}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Salvar Rascunho
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Templates Rápidos</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div 
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all hover:shadow-md"
                onClick={() => alert('Template Post Motivacional aplicado!')}
              >
                <h3 className="font-semibold">Post Motivacional</h3>
                <p className="text-sm text-gray-600">Template para posts inspiracionais</p>
              </div>
              <div 
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all hover:shadow-md"
                onClick={() => alert('Template Dica Profissional aplicado!')}
              >
                <h3 className="font-semibold">Dica Profissional</h3>
                <p className="text-sm text-gray-600">Template para compartilhar conhecimento</p>
              </div>
              <div 
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all hover:shadow-md"
                onClick={() => alert('Template Pergunta Engajante aplicado!')}
              >
                <h3 className="font-semibold">Pergunta Engajante</h3>
                <p className="text-sm text-gray-600">Template para aumentar interação</p>
              </div>
              <div 
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all hover:shadow-md"
                onClick={() => alert('Template Case de Sucesso aplicado!')}
              >
                <h3 className="font-semibold">Case de Sucesso</h3>
                <p className="text-sm text-gray-600">Template para contar histórias</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
