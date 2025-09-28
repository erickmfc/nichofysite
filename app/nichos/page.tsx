'use client'

import { Button } from '@/components/ui/Button'
import { ResponsiveTemplate } from '@/components/ui/ResponsiveTemplate'
import Link from 'next/link'

interface Nicho {
  id: string
  icon: string
  title: string
  description: string
  topics: string[]
  gradient: string
  isNew?: boolean
}

const nichos: Nicho[] = [
  // Nichos Existentes
  {
    id: 'direito',
    icon: '⚖️',
    title: 'Direito',
    description: 'Conteúdo jurídico especializado e atualizações legislativas',
    topics: [
      'Atualizações legislativas',
      'Jurisprudência e Casos Reais',
      'Direito do Consumidor e Dicas'
    ],
    gradient: 'from-blue-600 to-blue-800'
  },
  {
    id: 'saude',
    icon: '👨‍⚕️',
    title: 'Saúde & Bem-Estar',
    description: 'Conteúdo sobre saúde preventiva e bem-estar',
    topics: [
      'Saúde preventiva e Dicas',
      'Bem-estar mental e físico',
      'Nutrição e Receitas Saudáveis'
    ],
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'tecnologia',
    icon: '💻',
    title: 'Tecnologia',
    description: 'Inovação, desenvolvimento e tendências tech',
    topics: [
      'Desenvolvimento e Ferramentas',
      'Inovação e Inteligência Artificial',
      'Tendências e Notícias do Mercado'
    ],
    gradient: 'from-purple-500 to-indigo-600'
  },
  
  // Novos Nichos
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
    isNew: true
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
    isNew: true
  },
  {
    id: 'varejo',
    icon: '🛍️',
    title: 'Varejo & E-commerce',
    description: 'Conteúdo para lojas físicas e online',
    topics: [
      'Lançamentos e Novidades da Semana',
      'Ofertas, Cupons e Liquidações',
      'Looks, Combinações e Dicas de Uso'
    ],
    gradient: 'from-cyan-500 to-blue-600',
    isNew: true
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
    isNew: true
  },
  {
    id: 'imobiliario',
    icon: '🏠',
    title: 'Mercado Imobiliário',
    description: 'Conteúdo sobre imóveis e investimentos',
    topics: [
      'Imóvel da Semana (Venda/Aluguel)',
      'Dicas de Compra, Venda e Financiamento',
      'Notícias e Tendências do Mercado Local'
    ],
    gradient: 'from-teal-500 to-green-600',
    isNew: true
  },
  {
    id: 'contabilidade',
    icon: '👔',
    title: 'Contabilidade & Finanças',
    description: 'Conteúdo financeiro e contábil',
    topics: [
      'Dicas de Gestão para MEI e PMEs',
      'Prazos e Obrigações Fiscais (ex: IR)',
      'Educação Financeira para Empreendedores'
    ],
    gradient: 'from-gray-600 to-gray-800',
    isNew: true
  },
  {
    id: 'pets',
    icon: '🐾',
    title: 'Pet Shops & Veterinária',
    description: 'Conteúdo sobre cuidados com animais',
    topics: [
      'Dicas de Cuidado e Saúde Animal',
      'Produtos e Novidades da Loja',
      'Fotos de "Clientes" (Pets) e Curiosidades'
    ],
    gradient: 'from-amber-500 to-yellow-600',
    isNew: true
  },
  {
    id: 'educacao',
    icon: '📚',
    title: 'Educação & Cursos',
    description: 'Conteúdo educacional e cursos',
    topics: [
      'Dicas de Estudo e Aprendizado',
      'Divulgação de Cursos, Aulas e Workshops',
      'Depoimentos e Histórias de Sucesso de Alunos'
    ],
    gradient: 'from-indigo-500 to-purple-600',
    isNew: true
  },
  {
    id: 'turismo',
    icon: '✈️',
    title: 'Turismo & Hotelaria',
    description: 'Conteúdo sobre viagens e hospedagem',
    topics: [
      'Promoções de Pacotes e Diárias',
      'Dicas de Viagem e Roteiros Locais',
      'Apresentação da Estrutura (Hotel/Pousada)'
    ],
    gradient: 'from-sky-500 to-blue-600',
    isNew: true
  }
]

export default function NichosPage() {
  return (
    <ResponsiveTemplate
      colorScheme="primary"
      title="Nossos Nichos"
      subtitle="Conteúdo especializado e profissional para cada área de atuação"
      features={["✨ Especialistas certificados", "📚 Conteúdo atualizado", "🎯 Resultados comprovados"]}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {nichos.map((nicho, index) => (
          <div 
            key={nicho.id}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Header com gradiente */}
            <div className={`h-24 bg-gradient-to-r ${nicho.gradient} relative`}>
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-4 left-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl">{nicho.icon}</span>
                </div>
              </div>
              {nicho.isNew && (
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                    NOVO
                  </span>
                </div>
              )}
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

              <Link href={`/exemplos?nicho=${nicho.id}`}>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300"
                >
                  Ver Exemplos
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </ResponsiveTemplate>
  )
}