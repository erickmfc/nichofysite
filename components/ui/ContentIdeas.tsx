'use client'

import { useState } from 'react'

interface ContentIdea {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: string
}

interface ContentIdeasProps {
  niche?: string
  className?: string
}

export const ContentIdeas: React.FC<ContentIdeasProps> = ({ 
  niche = 'geral',
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null)

  const ideas: ContentIdea[] = [
    {
      id: '1',
      title: 'Tutorial Passo a Passo',
      description: 'Crie um guia detalhado sobre um tópico específico do seu nicho',
      category: 'educativo',
      difficulty: 'medium',
      estimatedTime: '15-20 min'
    },
    {
      id: '2',
      title: 'Lista de Dicas',
      description: 'Compile 5-10 dicas práticas e úteis para sua audiência',
      category: 'dicas',
      difficulty: 'easy',
      estimatedTime: '10-15 min'
    },
    {
      id: '3',
      title: 'Case de Sucesso',
      description: 'Conte a história de um cliente ou projeto bem-sucedido',
      category: 'cases',
      difficulty: 'medium',
      estimatedTime: '20-25 min'
    },
    {
      id: '4',
      title: 'Perguntas Frequentes',
      description: 'Responda às dúvidas mais comuns do seu nicho',
      category: 'faq',
      difficulty: 'easy',
      estimatedTime: '10-15 min'
    },
    {
      id: '5',
      title: 'Comparação de Produtos',
      description: 'Compare diferentes opções disponíveis no mercado',
      category: 'comparacao',
      difficulty: 'hard',
      estimatedTime: '25-30 min'
    },
    {
      id: '6',
      title: 'Tendências do Mercado',
      description: 'Analise as principais tendências e novidades do setor',
      category: 'tendencias',
      difficulty: 'hard',
      estimatedTime: '30-35 min'
    }
  ]

  const categories = [
    { id: 'all', name: 'Todas', icon: '📋' },
    { id: 'educativo', name: 'Educativo', icon: '📚' },
    { id: 'dicas', name: 'Dicas', icon: '💡' },
    { id: 'cases', name: 'Cases', icon: '🏆' },
    { id: 'faq', name: 'FAQ', icon: '❓' },
    { id: 'comparacao', name: 'Comparação', icon: '⚖️' },
    { id: 'tendencias', name: 'Tendências', icon: '📈' }
  ]

  const filteredIdeas = selectedCategory === 'all' 
    ? ideas 
    : ideas.filter(idea => idea.category === selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil'
      case 'medium': return 'Médio'
      case 'hard': return 'Difícil'
      default: return 'N/A'
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 Ideias de Conteúdo</h3>
        <p className="text-sm text-gray-600">Encontre inspiração para seus próximos posts</p>
      </div>

      {/* Filtros */}
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Ideias */}
      <div className="p-4">
        <div className="space-y-3">
          {filteredIdeas.map(idea => (
            <div
              key={idea.id}
              className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => setSelectedIdea(idea)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{idea.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(idea.difficulty)}`}>
                  {getDifficultyText(idea.difficulty)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{idea.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>⏱️ {idea.estimatedTime}</span>
                <span className="capitalize">{idea.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{selectedIdea.title}</h3>
              <button
                onClick={() => setSelectedIdea(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">{selectedIdea.description}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Dificuldade:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(selectedIdea.difficulty)}`}>
                  {getDifficultyText(selectedIdea.difficulty)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tempo estimado:</span>
                <span className="text-sm text-gray-900">⏱️ {selectedIdea.estimatedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Categoria:</span>
                <span className="text-sm text-gray-900 capitalize">{selectedIdea.category}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm">
                Usar Esta Ideia
              </button>
              <button 
                onClick={() => setSelectedIdea(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg text-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}