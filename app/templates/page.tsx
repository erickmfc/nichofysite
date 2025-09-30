'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'

interface Template {
  id: string
  title: string
  description: string
  category: string
  icon: string
  content: string
  tags: string[]
  difficulty: 'Fácil' | 'Médio' | 'Difícil'
  estimatedTime: string
}

const templates: Template[] = [
  {
    id: '1',
    title: 'Post Motivacional',
    description: 'Inspire seu público com mensagens positivas',
    category: 'Motivação',
    icon: '✨',
    content: 'Hoje é um novo dia cheio de possibilidades! 🌅\n\nLembre-se: cada pequeno passo conta. Você está mais próximo dos seus objetivos do que imagina.\n\n#motivação #sucesso #inspiração',
    tags: ['motivação', 'inspiração', 'sucesso'],
    difficulty: 'Fácil',
    estimatedTime: '2 min'
  },
  {
    id: '2',
    title: 'Dica Útil',
    description: 'Compartilhe conhecimento prático',
    category: 'Educativo',
    icon: '💡',
    content: '💡 DICA DO DIA:\n\n[Insira sua dica aqui]\n\nEsta simples prática pode fazer toda a diferença na sua rotina!\n\n#dica #conhecimento #prático',
    tags: ['dica', 'educativo', 'prático'],
    difficulty: 'Fácil',
    estimatedTime: '3 min'
  },
  {
    id: '3',
    title: 'Story do Dia',
    description: 'Compartilhe momentos do seu dia',
    category: 'Pessoal',
    icon: '📱',
    content: '📱 STORY DO DIA:\n\n[Descreva algo interessante que aconteceu]\n\nÀs vezes os melhores momentos são os mais simples! ✨\n\n#story #momento #vida',
    tags: ['story', 'pessoal', 'momento'],
    difficulty: 'Fácil',
    estimatedTime: '2 min'
  },
  {
    id: '4',
    title: 'Pergunta para Engajamento',
    description: 'Faça perguntas para aumentar interação',
    category: 'Engajamento',
    icon: '❓',
    content: '❓ PERGUNTA DO DIA:\n\n[Faça uma pergunta interessante para seu público]\n\nCompartilhe sua resposta nos comentários! 👇\n\n#pergunta #engajamento #interação',
    tags: ['pergunta', 'engajamento', 'interação'],
    difficulty: 'Médio',
    estimatedTime: '4 min'
  },
  {
    id: '5',
    title: 'Tutorial Passo a Passo',
    description: 'Ensine algo de forma didática',
    category: 'Educativo',
    icon: '📚',
    content: '📚 COMO FAZER:\n\nPasso 1: [Primeiro passo]\nPasso 2: [Segundo passo]\nPasso 3: [Terceiro passo]\n\nResultado: [O que você consegue]\n\n#tutorial #aprendizado #passoapasso',
    tags: ['tutorial', 'educativo', 'passoapasso'],
    difficulty: 'Difícil',
    estimatedTime: '8 min'
  },
  {
    id: '6',
    title: 'Promoção/Desconto',
    description: 'Anuncie ofertas especiais',
    category: 'Comercial',
    icon: '🎯',
    content: '🎯 OFERTA ESPECIAL!\n\n[Descreva sua oferta]\n\n⏰ Válido até [data]\n💰 Desconto de [%]\n\nNão perca! Link na bio 👆\n\n#oferta #desconto #promoção',
    tags: ['oferta', 'comercial', 'promoção'],
    difficulty: 'Médio',
    estimatedTime: '5 min'
  },
  {
    id: '7',
    title: 'Antes e Depois',
    description: 'Mostre transformações',
    category: 'Resultados',
    icon: '🔄',
    content: '🔄 TRANSFORMAÇÃO INCRÍVEL!\n\nANTES: [Descreva o antes]\nDEPOIS: [Descreva o depois]\n\nO resultado fala por si só! 💪\n\n#transformação #resultado #antesdepois',
    tags: ['transformação', 'resultado', 'antesdepois'],
    difficulty: 'Médio',
    estimatedTime: '4 min'
  },
  {
    id: '8',
    title: 'Curiosidade',
    description: 'Compartilhe fatos interessantes',
    category: 'Educativo',
    icon: '🤔',
    content: '🤔 VOCÊ SABIA?\n\n[Compartilhe uma curiosidade interessante]\n\nIsso pode mudar sua perspectiva sobre [tema]!\n\n#curiosidade #aprendizado #fato',
    tags: ['curiosidade', 'educativo', 'fato'],
    difficulty: 'Fácil',
    estimatedTime: '3 min'
  },
  {
    id: '9',
    title: 'Lista de Benefícios',
    description: 'Destaque vantagens do seu produto/serviço',
    category: 'Comercial',
    icon: '✅',
    content: '✅ POR QUE ESCOLHER [SEU PRODUTO/SERVIÇO]?\n\n✓ Benefício 1\n✓ Benefício 2\n✓ Benefício 3\n\nFaça a escolha certa! 🎯\n\n#benefícios #vantagens #escolha',
    tags: ['benefícios', 'comercial', 'vantagens'],
    difficulty: 'Médio',
    estimatedTime: '5 min'
  },
  {
    id: '10',
    title: 'Testemunhal',
    description: 'Compartilhe depoimentos de clientes',
    category: 'Social Proof',
    icon: '💬',
    content: '💬 DEPOIMENTO REAL:\n\n"[Depoimento do cliente]"\n\n- [Nome do cliente]\n\nVeja como transformamos a vida de quem confia em nós! ❤️\n\n#depoimento #testemunhal #socialproof',
    tags: ['depoimento', 'testemunhal', 'socialproof'],
    difficulty: 'Fácil',
    estimatedTime: '3 min'
  }
]

export default function TemplatesPage() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800'
      case 'Médio': return 'bg-yellow-100 text-yellow-800'
      case 'Difícil': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Template copiado para a área de transferência!')
    } catch (error) {
      console.error('Erro ao copiar:', error)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
                <p className="text-gray-600 mt-1">Modelos prontos para criar posts rapidamente</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{templates.length}</div>
                <div className="text-sm text-gray-500">templates disponíveis</div>
              </div>
            </div>
          </div>
        </header>

        {/* Filtros */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Busca */}
            <div className="w-full md:w-96">
              <input
                type="text"
                placeholder="Buscar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Filtro de categoria */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'Todos' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de Templates */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div 
                key={template.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{template.title}</h3>
                        <p className="text-sm text-gray-600">{template.category}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">{template.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>⏱️ {template.estimatedTime}</span>
                    <span>📝 {template.tags.length} tags</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="p-6 pt-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSelectedTemplate(template)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                    >
                      👁️ Visualizar
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(template.content)}
                      variant="outline"
                      className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    >
                      📋 Copiar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal de Visualização */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              {/* Header do Modal */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                      {selectedTemplate.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedTemplate.title}</h2>
                      <p className="text-gray-600">{selectedTemplate.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Conteúdo do Template */}
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Conteúdo do Template:</h3>
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                    {selectedTemplate.content}
                  </pre>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(selectedTemplate.content)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    📋 Copiar Template
                  </Button>
                  <Button
                    onClick={() => {
                      copyToClipboard(selectedTemplate.content)
                      setSelectedTemplate(null)
                    }}
                    variant="outline"
                    className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    ✨ Usar e Fechar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}