'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase'
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore'
import { Button } from '@/components/ui/Button'
import { AdvancedTools } from './AdvancedTools'

interface SavedTemplate {
  id: string
  nome: string
  conteudo: string
  categoria: string
  tags: string[]
  dataCriacao: Date
  favorito: boolean
}

interface HashtagCollection {
  id: string
  nicho: string
  hashtags: string[]
  descricao: string
  dataAtualizacao: Date
}

interface ContentIdea {
  id: string
  titulo: string
  descricao: string
  nicho: string
  tipo: 'post' | 'story' | 'reel' | 'carousel'
  status: 'nova' | 'em_desenvolvimento' | 'publicada' | 'arquivada'
  dataCriacao: Date
  tags: string[]
}

interface ImportantDate {
  id: string
  titulo: string
  data: Date
  tipo: 'feriado' | 'evento' | 'promocao' | 'personalizado'
  descricao: string
  repetir: boolean
}

interface VisualReference {
  id: string
  titulo: string
  url: string
  categoria: string
  tags: string[]
  dataSalvamento: Date
}

const NICHO_HASHTAGS = {
  'marketing': ['#marketingdigital', '#marketing', '#empreendedorismo', '#negocios', '#vendas'],
  'tecnologia': ['#tecnologia', '#inovacao', '#startup', '#programacao', '#ia'],
  'saude': ['#saude', '#bemestar', '#fitness', '#nutricao', '#vidaativa'],
  'beleza': ['#beleza', '#estetica', '#skincare', '#makeup', '#moda'],
  'educacao': ['#educacao', '#aprendizado', '#conhecimento', '#cursos', '#desenvolvimento']
}

const CONTENT_TYPES = [
  { value: 'post', label: 'Post Feed', icon: '📱' },
  { value: 'story', label: 'Story', icon: '📸' },
  { value: 'reel', label: 'Reel', icon: '🎬' },
  { value: 'carousel', label: 'Carrossel', icon: '🔄' }
]

export const ExtraResources = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('biblioteca')
  
  const [templates, setTemplates] = useState<SavedTemplate[]>([])
  const [hashtags, setHashtags] = useState<HashtagCollection[]>([])
  const [ideas, setIdeas] = useState<ContentIdea[]>([])
  const [dates, setDates] = useState<ImportantDate[]>([])
  const [references, setReferences] = useState<VisualReference[]>([])

  useEffect(() => {
    if (user) {
      loadResources()
    }
  }, [user])

  const loadResources = async () => {
    if (!user) return

    try {
      await loadTemplates()
      await loadHashtags()
      await loadIdeas()
      await loadDates()
      await loadReferences()
    } catch (error) {
      console.error('Erro ao carregar recursos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadTemplates = async () => {
    // Simular templates salvos
    const mockTemplates: SavedTemplate[] = [
      {
        id: '1',
        nome: 'Template de Lançamento',
        conteudo: '🚀 NOVIDADE INCRÍVEL!\n\nApresentamos [PRODUTO/SERVIÇO] que vai revolucionar [ÁREA]!\n\n✨ Benefícios:\n• [BENEFÍCIO 1]\n• [BENEFÍCIO 2]\n• [BENEFÍCIO 3]\n\n🎯 Não perca! Oferta por tempo limitado!\n\n#lançamento #novidade #oportunidade',
        categoria: 'Lançamento',
        tags: ['lançamento', 'promoção', 'vendas'],
        dataCriacao: new Date(),
        favorito: true
      },
      {
        id: '2',
        nome: 'Template Educativo',
        conteudo: '💡 DICA DO DIA!\n\nHoje vamos falar sobre [TÓPICO] e como isso pode ajudar você.\n\n📚 O que você precisa saber:\n1. [PONTO 1]\n2. [PONTO 2]\n3. [PONTO 3]\n\n❓ Tem alguma dúvida? Comente abaixo!\n\n#educativo #dica #aprendizado',
        categoria: 'Educativo',
        tags: ['educativo', 'dica', 'conteúdo'],
        dataCriacao: new Date(),
        favorito: false
      }
    ]
    setTemplates(mockTemplates)
  }

  const loadHashtags = async () => {
    // Simular coleções de hashtags
    const mockHashtags: HashtagCollection[] = [
      {
        id: '1',
        nicho: 'Marketing Digital',
        hashtags: NICHO_HASHTAGS.marketing,
        descricao: 'Hashtags essenciais para conteúdo de marketing',
        dataAtualizacao: new Date()
      },
      {
        id: '2',
        nicho: 'Tecnologia',
        hashtags: NICHO_HASHTAGS.tecnologia,
        descricao: 'Hashtags para conteúdo tech e inovação',
        dataAtualizacao: new Date()
      }
    ]
    setHashtags(mockHashtags)
  }

  const loadIdeas = async () => {
    // Simular banco de ideias
    const mockIdeas: ContentIdea[] = [
      {
        id: '1',
        titulo: 'Como a IA está mudando o marketing',
        descricao: 'Post explicando as principais mudanças que a IA está trazendo para o marketing digital',
        nicho: 'marketing',
        tipo: 'post',
        status: 'nova',
        dataCriacao: new Date(),
        tags: ['ia', 'marketing', 'futuro']
      },
      {
        id: '2',
        titulo: '5 dicas para aumentar engajamento',
        descricao: 'Carrossel com dicas práticas para melhorar o engajamento nas redes sociais',
        nicho: 'marketing',
        tipo: 'carousel',
        status: 'em_desenvolvimento',
        dataCriacao: new Date(),
        tags: ['engajamento', 'dicas', 'redes sociais']
      }
    ]
    setIdeas(mockIdeas)
  }

  const loadDates = async () => {
    // Simular datas importantes
    const mockDates: ImportantDate[] = [
      {
        id: '1',
        titulo: 'Black Friday',
        data: new Date(2024, 10, 29), // Novembro
        tipo: 'promocao',
        descricao: 'Maior evento de vendas do ano',
        repetir: true
      },
      {
        id: '2',
        titulo: 'Dia do Marketing Digital',
        data: new Date(2024, 8, 14), // Setembro
        tipo: 'evento',
        descricao: 'Data para celebrar o marketing digital',
        repetir: true
      }
    ]
    setDates(mockDates)
  }

  const loadReferences = async () => {
    // Simular referências visuais
    const mockReferences: VisualReference[] = [
      {
        id: '1',
        titulo: 'Paleta de cores moderna',
        url: 'https://example.com/palette1.jpg',
        categoria: 'Design',
        tags: ['cores', 'moderno', 'paleta'],
        dataSalvamento: new Date()
      },
      {
        id: '2',
        titulo: 'Layout de post educacional',
        url: 'https://example.com/layout1.jpg',
        categoria: 'Layout',
        tags: ['layout', 'educativo', 'post'],
        dataSalvamento: new Date()
      }
    ]
    setReferences(mockReferences)
  }

  const addNewIdea = () => {
    const novaIdeia: ContentIdea = {
      id: Date.now().toString(),
      titulo: 'Nova ideia de conteúdo',
      descricao: 'Descreva sua ideia aqui...',
      nicho: 'marketing',
      tipo: 'post',
      status: 'nova',
      dataCriacao: new Date(),
      tags: []
    }
    setIdeas(prev => [novaIdeia, ...prev])
  }

  const addNewTemplate = () => {
    const novoTemplate: SavedTemplate = {
      id: Date.now().toString(),
      nome: 'Novo template',
      conteudo: 'Digite seu template aqui...',
      categoria: 'Geral',
      tags: [],
      dataCriacao: new Date(),
      favorito: false
    }
    setTemplates(prev => [novoTemplate, ...prev])
  }

  const toggleFavorite = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, favorito: !template.favorito }
        : template
    ))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando recursos extras...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🛠️ Recursos Extras
              </h1>
              <p className="text-gray-600 mt-1">
                Biblioteca completa de recursos para criar conteúdo incrível
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                ← Voltar ao Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'biblioteca', name: 'Biblioteca de Recursos', icon: '📚' },
                { id: 'ferramentas', name: 'Ferramentas Auxiliares', icon: '🔧' },
                { id: 'avancadas', name: 'Ferramentas Avançadas', icon: '⚡' },
                { id: 'comunidade', name: 'Comunidade', icon: '👥' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          
          {/* Biblioteca de Recursos */}
          {activeTab === 'biblioteca' && (
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Templates Salvos */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    📝 Templates Salvos
                  </h2>
                  <Button
                    onClick={addNewTemplate}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                  >
                    + Novo Template
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{template.nome}</h3>
                          <p className="text-sm text-gray-600">{template.categoria}</p>
                        </div>
                        <button
                          onClick={() => toggleFavorite(template.id)}
                          className={`text-2xl ${template.favorito ? 'text-red-500' : 'text-gray-300'}`}
                        >
                          {template.favorito ? '❤️' : '🤍'}
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 mb-3 line-clamp-3">{template.conteudo}</p>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coleção de Hashtags */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  #️⃣ Coleção de Hashtags
                </h2>
                
                <div className="space-y-4">
                  {hashtags.map((collection) => (
                    <div key={collection.id} className="p-4 bg-gray-50 rounded-lg border">
                      <h3 className="font-semibold text-gray-900 mb-2">{collection.nicho}</h3>
                      <p className="text-sm text-gray-600 mb-3">{collection.descricao}</p>
                      <div className="flex flex-wrap gap-1">
                        {collection.hashtags.map((hashtag, index) => (
                          <span key={index} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Banco de Ideias */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    💡 Banco de Ideias
                  </h2>
                  <Button
                    onClick={addNewIdea}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                  >
                    + Nova Ideia
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {ideas.map((idea) => (
                    <div key={idea.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{idea.titulo}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          idea.status === 'nova' ? 'bg-green-100 text-green-800' :
                          idea.status === 'em_desenvolvimento' ? 'bg-yellow-100 text-yellow-800' :
                          idea.status === 'publicada' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {idea.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{idea.descricao}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span>{CONTENT_TYPES.find(t => t.value === idea.tipo)?.icon} {CONTENT_TYPES.find(t => t.value === idea.tipo)?.label}</span>
                        <span>📅 {idea.dataCriacao.toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendário de Datas */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  📅 Calendário de Datas Importantes
                </h2>
                
                <div className="space-y-4">
                  {dates.map((date) => (
                    <div key={date.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{date.titulo}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          date.tipo === 'feriado' ? 'bg-red-100 text-red-800' :
                          date.tipo === 'evento' ? 'bg-blue-100 text-blue-800' :
                          date.tipo === 'promocao' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {date.tipo}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{date.descricao}</p>
                      <div className="text-sm text-gray-600">
                        📅 {date.data.toLocaleDateString('pt-BR')}
                        {date.repetir && <span className="ml-2">🔄 Repete anualmente</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referências Visuais */}
              <div className="bg-white rounded-lg shadow-sm border p-6 lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  🎨 Referências Visuais Salvas
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {references.map((ref) => (
                    <div key={ref.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-4xl">🖼️</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{ref.titulo}</h3>
                      <p className="text-xs text-gray-600 mb-2">{ref.categoria}</p>
                      <div className="flex flex-wrap gap-1">
                        {ref.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-200 text-gray-700 px-1 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Ferramentas Auxiliares */}
          {activeTab === 'ferramentas' && (
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Gerador de Ideias */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  💡 Gerador de Ideias de Conteúdo
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nicho/Área
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="marketing">Marketing Digital</option>
                      <option value="tecnologia">Tecnologia</option>
                      <option value="saude">Saúde & Bem-estar</option>
                      <option value="beleza">Beleza & Estética</option>
                      <option value="educacao">Educação</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Conteúdo
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="post">Post Feed</option>
                      <option value="story">Story</option>
                      <option value="reel">Reel</option>
                      <option value="carousel">Carrossel</option>
                    </select>
                  </div>
                  
                  <Button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg">
                    ✨ Gerar Ideias
                  </Button>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Ideias Geradas:</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• "5 tendências de marketing para 2024"</li>
                      <li>• "Como criar campanhas virais"</li>
                      <li>• "Erros comuns em marketing digital"</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Calculadora de Engajamento */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  📊 Calculadora de Engajamento
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Seguidores
                    </label>
                    <input 
                      type="number" 
                      placeholder="10000"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Curtidas
                    </label>
                    <input 
                      type="number" 
                      placeholder="500"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comentários
                    </label>
                    <input 
                      type="number" 
                      placeholder="50"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <Button className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg">
                    🧮 Calcular
                  </Button>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Resultado:</h3>
                    <div className="text-2xl font-bold text-green-600 mb-1">5.5%</div>
                    <p className="text-sm text-gray-700">Taxa de engajamento</p>
                    <div className="mt-2 text-xs text-gray-600">
                      <p>• Acima da média do nicho (3.2%)</p>
                      <p>• Performance: Excelente</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Planejador de Posts */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  📅 Planejador de Posts
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Período
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="semana">Esta Semana</option>
                      <option value="mes">Este Mês</option>
                      <option value="trimestre">Este Trimestre</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequência
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="diario">Diário</option>
                      <option value="alternado">Dia sim, dia não</option>
                      <option value="3x-semana">3x por semana</option>
                      <option value="semanal">Semanal</option>
                    </select>
                  </div>
                  
                  <Button className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg">
                    📋 Gerar Cronograma
                  </Button>
                  
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Cronograma Sugerido:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Segunda-feira</span>
                        <span className="text-blue-600">Post Educativo</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quarta-feira</span>
                        <span className="text-green-600">Story Interativo</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sexta-feira</span>
                        <span className="text-purple-600">Reel Divertido</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analisador de Hashtags */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  🔍 Analisador de Hashtags
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hashtags para Analisar
                    </label>
                    <textarea 
                      placeholder="#marketing #vendas #empreendedorismo"
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <Button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg">
                    🔍 Analisar
                  </Button>
                  
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Análise:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>#marketing</span>
                        <span className="text-green-600">Alto volume</span>
                      </div>
                      <div className="flex justify-between">
                        <span>#vendas</span>
                        <span className="text-yellow-600">Médio volume</span>
                      </div>
                      <div className="flex justify-between">
                        <span>#empreendedorismo</span>
                        <span className="text-red-600">Baixo volume</span>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-600">
                      <p>💡 Sugestão: Use hashtags com volume médio para melhor alcance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ferramentas Avançadas */}
          {activeTab === 'avancadas' && (
            <AdvancedTools />
          )}

          {/* Comunidade */}
          {activeTab === 'comunidade' && (
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Perfil Público */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  👤 Perfil Público
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {user?.displayName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user?.displayName || 'Usuário'}</h3>
                      <p className="text-sm text-gray-600">@usuario_nichofy</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Bio Pública</h4>
                    <p className="text-sm text-gray-700">
                      Especialista em marketing digital com foco em crescimento de negócios online.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">1.2K</div>
                      <div className="text-xs text-gray-600">Seguidores</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">856</div>
                      <div className="text-xs text-gray-600">Seguindo</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">234</div>
                      <div className="text-xs text-gray-600">Posts</div>
                    </div>
                  </div>
                  
                  <Button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                    ✏️ Editar Perfil
                  </Button>
                </div>
              </div>

              {/* Grupos por Nicho */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  🎯 Grupos por Nicho
                </h2>
                
                <div className="space-y-4">
                  {[
                    { nome: 'Marketing Digital Brasil', membros: '2.5K', nicho: 'marketing' },
                    { nome: 'Tech Innovators', membros: '1.8K', nicho: 'tecnologia' },
                    { nome: 'Saúde & Bem-estar', membros: '3.2K', nicho: 'saude' },
                    { nome: 'Beleza & Estética', membros: '1.9K', nicho: 'beleza' }
                  ].map((grupo, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-900">{grupo.nome}</h3>
                          <p className="text-sm text-gray-600">{grupo.membros} membros</p>
                        </div>
                        <Button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                          Entrar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fórum de Discussões */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  💬 Fórum de Discussões
                </h2>
                
                <div className="space-y-4">
                  {[
                    { titulo: 'Melhores práticas para engajamento', respostas: 23, autor: 'Maria Silva' },
                    { titulo: 'Como criar conteúdo viral?', respostas: 45, autor: 'João Santos' },
                    { titulo: 'Ferramentas de análise recomendadas', respostas: 18, autor: 'Ana Costa' },
                    { titulo: 'Estratégias para Black Friday', respostas: 67, autor: 'Carlos Lima' }
                  ].map((topico, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{topico.titulo}</h3>
                          <p className="text-sm text-gray-600">por {topico.autor}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-600">{topico.respostas}</div>
                          <div className="text-xs text-gray-600">respostas</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eventos e Webinars */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  🎪 Eventos e Webinars Exclusivos
                </h2>
                
                <div className="space-y-4">
                  {[
                    { titulo: 'Masterclass: Marketing Digital 2024', data: '15/12/2024', tipo: 'webinar' },
                    { titulo: 'Workshop: Criação de Conteúdo', data: '22/12/2024', tipo: 'evento' },
                    { titulo: 'Live: Tendências 2025', data: '05/01/2025', tipo: 'live' },
                    { titulo: 'Networking: NichoFy Meetup', data: '12/01/2025', tipo: 'networking' }
                  ].map((evento, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{evento.titulo}</h3>
                          <p className="text-sm text-gray-600">📅 {evento.data}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          evento.tipo === 'webinar' ? 'bg-blue-100 text-blue-800' :
                          evento.tipo === 'evento' ? 'bg-green-100 text-green-800' :
                          evento.tipo === 'live' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {evento.tipo}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
