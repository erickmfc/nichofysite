'use client'

import { useState } from 'react'

interface Template {
  id: string
  name: string
  description: string
  category: string
  icon: string
  color: string
  estimatedTime: string
}

interface QuickTemplatesProps {
  className?: string
}

export const QuickTemplates: React.FC<QuickTemplatesProps> = ({ className = '' }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const templates: Template[] = [
    {
      id: '1',
      name: 'Post Educativo',
      description: 'Template para posts que ensinam algo novo',
      category: 'educativo',
      icon: '📚',
      color: 'bg-blue-500',
      estimatedTime: '10 min'
    },
    {
      id: '2',
      name: 'Lista de Dicas',
      description: 'Template para compilar dicas úteis',
      category: 'dicas',
      icon: '💡',
      color: 'bg-yellow-500',
      estimatedTime: '8 min'
    },
    {
      id: '3',
      name: 'Case de Sucesso',
      description: 'Template para contar histórias de sucesso',
      category: 'cases',
      icon: '🏆',
      color: 'bg-green-500',
      estimatedTime: '15 min'
    },
    {
      id: '4',
      name: 'Pergunta Interativa',
      description: 'Template para engajar a audiência',
      category: 'interativo',
      icon: '❓',
      color: 'bg-purple-500',
      estimatedTime: '5 min'
    },
    {
      id: '5',
      name: 'Comparação',
      description: 'Template para comparar opções',
      category: 'comparacao',
      icon: '⚖️',
      color: 'bg-orange-500',
      estimatedTime: '12 min'
    },
    {
      id: '6',
      name: 'Tendência',
      description: 'Template para falar sobre novidades',
      category: 'tendencias',
      icon: '📈',
      color: 'bg-red-500',
      estimatedTime: '18 min'
    }
  ]

  const handleUseTemplate = (template: Template) => {
    // TODO: Implementar lógica para usar o template
    alert(`Usando template: ${template.name}`)
    setSelectedTemplate(null)
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 Templates Rápidos</h3>
        <p className="text-sm text-gray-600">Escolha um template e crie conteúdo em minutos</p>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {templates.map(template => (
            <div
              key={template.id}
              className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${template.color} text-white`}>
                  <span className="text-lg">{template.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>⏱️ {template.estimatedTime}</span>
                    <span className="capitalize">{template.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Confirmação */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-3 rounded-lg ${selectedTemplate.color} text-white`}>
                <span className="text-2xl">{selectedTemplate.icon}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedTemplate.name}</h3>
                <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tempo estimado:</span>
                <span className="text-sm text-gray-900">⏱️ {selectedTemplate.estimatedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Categoria:</span>
                <span className="text-sm text-gray-900 capitalize">{selectedTemplate.category}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => handleUseTemplate(selectedTemplate)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm"
              >
                Usar Template
              </button>
              <button 
                onClick={() => setSelectedTemplate(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}