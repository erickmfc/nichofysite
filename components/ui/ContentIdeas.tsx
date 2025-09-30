'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useToast } from '@/components/ui/Toast'

interface ContentIdeasProps {
  userId: string
}

interface ContentIdea {
  id: string
  title: string
  description: string
  niche: string
  category: string
  platform: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export default function ContentIdeas({ userId }: ContentIdeasProps) {
  const { addToast } = useToast()
  const [ideas, setIdeas] = useState<ContentIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNiche, setSelectedNiche] = useState('')

  // Memoizar ideias baseadas no nicho selecionado
  const filteredIdeas = useMemo(() => {
    if (!selectedNiche) return ideas
    return ideas.filter(idea => idea.niche === selectedNiche)
  }, [ideas, selectedNiche])

  // Memoizar nichos únicos
  const availableNiches = useMemo(() => {
    return [...new Set(ideas.map(idea => idea.niche))].sort()
  }, [ideas])

  // Gerar ideias de conteúdo
  const generateIdeas = useCallback(() => {
    const niches = [
      'Direito', 'Saúde & Bem-Estar', 'Tecnologia', 'Gastronomia', 'Beleza & Estética',
      'Varejo & E-commerce', 'Fitness & Esportes', 'Mercado Imobiliário', 'Contabilidade & Finanças',
      'Psicologia & Saúde Mental', 'Odontologia', 'Farmácia & Medicamentos', 'Marketing & Publicidade'
    ]

    const categories = [
      'Dicas', 'Promoção', 'Educativo', 'Entretenimento', 'Inspiracional', 'Notícias'
    ]

    const platforms = [
      'Instagram', 'LinkedIn', 'Facebook', 'Twitter', 'TikTok', 'YouTube'
    ]

    const ideaTemplates = [
      {
        title: 'Dicas de {category} para {niche}',
        description: 'Compartilhe conhecimento prático e útil para seu público.',
        difficulty: 'easy' as const
      },
      {
        title: 'Tendências em {niche} para 2024',
        description: 'Mantenha seu público atualizado com as últimas tendências.',
        difficulty: 'medium' as const
      },
      {
        title: 'Case de sucesso: {niche}',
        description: 'Compartilhe histórias inspiradoras e resultados reais.',
        difficulty: 'hard' as const
      },
      {
        title: 'FAQ: Perguntas frequentes sobre {niche}',
        description: 'Responda dúvidas comuns do seu público.',
        difficulty: 'easy' as const
      },
      {
        title: 'Guia completo de {niche}',
        description: 'Crie um conteúdo educativo e detalhado.',
        difficulty: 'hard' as const
      }
    ]

    const generatedIdeas: ContentIdea[] = []

    for (let i = 0; i < 12; i++) {
      const niche = niches[Math.floor(Math.random() * niches.length)]
      const category = categories[Math.floor(Math.random() * categories.length)]
      const platform = platforms[Math.floor(Math.random() * platforms.length)]
      const template = ideaTemplates[Math.floor(Math.random() * ideaTemplates.length)]

      generatedIdeas.push({
        id: `idea-${i}`,
        title: template.title.replace('{category}', category).replace('{niche}', niche),
        description: template.description,
        niche,
        category,
        platform,
        difficulty: template.difficulty
      })
    }

    return generatedIdeas
  }, [])

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        setLoading(true)
        
        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const generatedIdeas = generateIdeas()
        setIdeas(generatedIdeas)
      } catch (error) {
        console.error('Erro ao carregar ideias:', error)
      } finally {
        setLoading(false)
      }
    }

    loadIdeas()
  }, [generateIdeas])

  const useIdea = useCallback((idea: ContentIdea) => {
    addToast({
      type: 'success',
      title: 'Ideia Selecionada!',
      message: `"${idea.title}" foi adicionada ao seu criador de conteúdo.`,
      action: {
        label: 'Criar Post',
        onClick: () => window.location.href = '/criar-conteudo'
      }
    })
  }, [addToast])

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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Ideias de Conteúdo
        </h3>
        
        <select
          value={selectedNiche}
          onChange={(e) => setSelectedNiche(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos os nichos</option>
          {availableNiches.map(niche => (
            <option key={niche} value={niche}>{niche}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filteredIdeas.slice(0, 6).map((idea) => (
          <div
            key={idea.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">
                  {idea.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {idea.description}
                </p>
                
                <div className="flex items-center gap-3 text-xs">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {idea.niche}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {idea.category}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    {idea.platform}
                  </span>
                  <span className={`px-2 py-1 rounded-full ${getDifficultyColor(idea.difficulty)}`}>
                    {getDifficultyText(idea.difficulty)}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => useIdea(idea)}
                className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Usar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            const newIdeas = generateIdeas()
            setIdeas(newIdeas)
            addToast({
              type: 'info',
              title: 'Ideias Atualizadas!',
              message: 'Novas ideias foram geradas para você.'
            })
          }}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          🔄 Gerar Novas Ideias
        </button>
      </div>
    </div>
  )
}