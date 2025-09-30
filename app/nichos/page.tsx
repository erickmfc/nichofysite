'use client'

import { Button } from '@/components/ui/Button'
import { ResponsiveTemplate } from '@/components/ui/ResponsiveTemplate'
import Link from 'next/link'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { useState } from 'react'

interface Nicho {
  id: string
  icon: string
  title: string
  description: string
  topics: string[]
  gradient: string
  isNew?: boolean
  postsCount?: number
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado'
}

const nichos: Nicho[] = [
  {
    id: 'gastronomia',
    icon: '🍔',
    title: 'Gastronomia & Alimentação',
    description: 'Conteúdo gastronômico e culinário',
    topics: [
      'Prato do dia e Novidades do Cardápio',
      'Bastidores da Cozinha e Ingredientes',
      'Promoções, Eventos e Happy Hour'
    ],
    gradient: 'from-orange-500 to-red-600',
    isNew: true,
    postsCount: 1250,
    difficulty: 'Iniciante'
  },
  {
    id: 'beleza',
    icon: '💇‍♀️',
    title: 'Beleza & Estética',
    description: 'Conteúdo sobre beleza e cuidados pessoais',
    topics: [
      'Transformações (Antes e Depois)',
      'Dicas de Autocuidado (Skincare, Cabelo)',
      'Divulgação de Serviços e Agendamentos'
    ],
    gradient: 'from-pink-500 to-rose-600',
    isNew: true,
    postsCount: 980,
    difficulty: 'Iniciante'
  },
  {
    id: 'direito',
    icon: '⚖️',
    title: 'Direito',
    description: 'Conteúdo jurídico especializado',
    topics: [
      'Atualizações legislativas',
      'Jurisprudência e Casos Reais',
      'Direito do Consumidor e Dicas'
    ],
    gradient: 'from-blue-600 to-blue-800',
    postsCount: 750,
    difficulty: 'Avançado'
  },
  {
    id: 'saude',
    icon: '👨‍⚕️',
    title: 'Saúde & Bem-Estar',
    description: 'Conteúdo sobre saúde preventiva',
    topics: [
      'Saúde preventiva e Dicas',
      'Bem-estar mental e físico',
      'Nutrição e Receitas Saudáveis'
    ],
    gradient: 'from-green-500 to-emerald-600',
    postsCount: 1100,
    difficulty: 'Intermediário'
  },
  {
    id: 'tecnologia',
    icon: '💻',
    title: 'Tecnologia',
    description: 'Inovação e desenvolvimento tech',
    topics: [
      'Desenvolvimento e Ferramentas',
      'Inovação e Inteligência Artificial',
      'Tendências e Notícias do Mercado'
    ],
    gradient: 'from-purple-500 to-indigo-600',
    postsCount: 850,
    difficulty: 'Avançado'
  },
  {
    id: 'fitness',
    icon: '💪',
    title: 'Fitness & Esportes',
    description: 'Conteúdo sobre exercícios e vida saudável',
    topics: [
      'Dicas de Treino e Exercícios',
      'Receitas e Nutrição Esportiva',
      'Motivação e Resultados de Alunos'
    ],
    gradient: 'from-yellow-500 to-orange-500',
    isNew: true,
    postsCount: 920,
    difficulty: 'Intermediário'
  },
  {
    id: 'psicologia',
    icon: '🧠',
    title: 'Psicologia & Saúde Mental',
    description: 'Conteúdo sobre bem-estar mental',
    topics: [
      'Dicas de Autocuidado Mental',
      'Técnicas de Relaxamento',
      'Promoção de Serviços Terapêuticos'
    ],
    gradient: 'from-violet-500 to-purple-600',
    postsCount: 680,
    difficulty: 'Intermediário'
  },
  {
    id: 'odontologia',
    icon: '🦷',
    title: 'Odontologia',
    description: 'Conteúdo sobre saúde bucal',
    topics: [
      'Cuidados Bucais Diários',
      'Procedimentos Odontológicos',
      'Agendamentos e Promoções'
    ],
    gradient: 'from-cyan-500 to-blue-600',
    postsCount: 540,
    difficulty: 'Intermediário'
  },
  {
    id: 'farmacia',
    icon: '💊',
    title: 'Farmácia & Medicamentos',
    description: 'Conteúdo farmacêutico especializado',
    topics: [
      'Orientações sobre Medicamentos',
      'Cuidados com a Saúde',
      'Promoções e Descontos'
    ],
    gradient: 'from-red-500 to-pink-600',
    postsCount: 420,
    difficulty: 'Avançado'
  },
  {
    id: 'marketing',
    icon: '📈',
    title: 'Marketing & Publicidade',
    description: 'Conteúdo sobre estratégias de marketing',
    topics: [
      'Estratégias de Marketing Digital',
      'Cases de Sucesso',
      'Ferramentas e Tendências'
    ],
    gradient: 'from-indigo-500 to-purple-600',
    postsCount: 890,
    difficulty: 'Avançado'
  },
  {
    id: 'educacao',
    icon: '🎓',
    title: 'Educação & Cursos',
    description: 'Conteúdo educacional e cursos',
    topics: [
      'Dicas de Estudo e Aprendizado',
      'Divulgação de Cursos',
      'Conteúdo Educativo'
    ],
    gradient: 'from-emerald-500 to-teal-600',
    postsCount: 720,
    difficulty: 'Intermediário'
  },
  {
    id: 'imobiliario',
    icon: '🏠',
    title: 'Mercado Imobiliário',
    description: 'Conteúdo sobre imóveis e investimentos',
    topics: [
      'Dicas de Investimento Imobiliário',
      'Lançamentos e Oportunidades',
      'Tendências do Mercado'
    ],
    gradient: 'from-amber-500 to-orange-600',
    postsCount: 650,
    difficulty: 'Intermediário'
  }
]

export default function NichosPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredNichos = nichos.filter(nicho => {
    const matchesSearch = nicho.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nicho.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === 'all' || nicho.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-100 text-green-800'
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800'
      case 'Avançado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <div className="pt-16">
        <ResponsiveTemplate
          colorScheme="primary"
          title="Nichos Especializados"
          subtitle="Conteúdo profissional criado por IA treinada especificamente para cada área de negócio"
          features={["🤖 IA especializada por nicho", "📈 Resultados comprovados", "⚡ Criação em segundos"]}
        >
          
          {/* Filtros */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Busca */}
              <div className="w-full md:w-96">
                <input
                  type="text"
                  placeholder="Buscar nichos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Filtro de dificuldade */}
              <div className="flex gap-2">
                {['all', 'Iniciante', 'Intermediário', 'Avançado'].map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedDifficulty === difficulty
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {difficulty === 'all' ? 'Todos' : difficulty}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid de Nichos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNichos.map((nicho, index) => (
              <div 
                key={nicho.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header com gradiente */}
                <div className={`h-32 bg-gradient-to-r ${nicho.gradient} relative`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <span className="text-2xl">{nicho.icon}</span>
                    </div>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {nicho.isNew && (
                      <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                        NOVO
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(nicho.difficulty)}`}>
                      {nicho.difficulty}
                    </span>
                  </div>
                  
                  {/* Contador de posts */}
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className="text-white text-sm font-bold">
                        {nicho.postsCount?.toLocaleString()} posts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {nicho.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    {nicho.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {nicho.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex items-start gap-2">
                        <span className="text-blue-500 text-sm mt-0.5">•</span>
                        <span className="text-sm text-gray-700">{topic}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/criar-conteudo?nicho=${nicho.id}`} className="flex-1">
                      <Button 
                        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        ✨ Criar Post
                      </Button>
                    </Link>
                    <Link href={`/exemplos?nicho=${nicho.id}`}>
                      <Button 
                        variant="outline" 
                        className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        Ver Exemplos
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Não encontrou seu nicho?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Nossa IA pode se adaptar a qualquer área de negócio. Entre em contato conosco para criar conteúdo personalizado para seu setor.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contato">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                    Solicitar Nicho Personalizado
                  </Button>
                </Link>
                <Link href="/criar-conteudo">
                  <Button variant="outline" className="px-8 py-3 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-200">
                    Criar Conteúdo Geral
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ResponsiveTemplate>
      </div>
    </div>
  )
}