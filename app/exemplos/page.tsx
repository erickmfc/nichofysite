'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { PublicNavbar } from '@/components/layout/PublicNavbar'

interface Example {
  id: string
  title: string
  content: string
  niche: string
  type: 'post' | 'story' | 'article' | 'carousel'
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter'
  image?: string
  hashtags: string[]
  engagement: {
    likes: number
    comments: number
    shares: number
  }
  createdAt: string
}

const examples: Example[] = [
  // Direito
  {
    id: '1',
    title: 'Nova Lei Trabalhista 2024',
    content: '📋 ATENÇÃO EMPRESÁRIOS!\n\nA nova lei trabalhista entra em vigor em 01/01/2024 e traz mudanças importantes:\n\n✅ Jornada de trabalho flexível\n✅ Home office regulamentado\n✅ Férias coletivas facilitadas\n\n💡 O que você precisa saber:\n• Adapte seus contratos\n• Treine sua equipe\n• Documente tudo\n\n⚠️ Não deixe para depois! Evite multas e problemas trabalhistas.\n\n📞 Precisa de ajuda? Agende uma consulta!',
    niche: 'Direito',
    type: 'post',
    platform: 'instagram',
    hashtags: ['#DireitoTrabalhista', '#NovaLei', '#Empresarios', '#ConsultoriaJuridica'],
    engagement: { likes: 245, comments: 18, shares: 12 },
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Direitos do Consumidor',
    content: '⚖️ VOCÊ SABIA?\n\nTodo consumidor tem direito a:\n\n🛡️ Produtos seguros e de qualidade\n💰 Preços justos e transparentes\n📞 Atendimento adequado\n🔄 Troca em até 7 dias\n\n❌ Não aceite:\n• Produtos vencidos\n• Cobranças indevidas\n• Atendimento ruim\n\n✅ Exija seus direitos!\n\n📱 Salve este post e compartilhe com quem precisa!',
    niche: 'Direito',
    type: 'story',
    platform: 'instagram',
    hashtags: ['#DireitosConsumidor', '#CDC', '#ProtecaoConsumidor'],
    engagement: { likes: 189, comments: 23, shares: 8 },
    createdAt: '2024-01-12'
  },
  {
    id: '3',
    title: 'Reforma Tributária: Impactos',
    content: '📊 REFORMA TRIBUTÁRIA: O QUE MUDA PARA SUA EMPRESA?\n\nA nova reforma tributária promete simplificar o sistema, mas traz mudanças importantes:\n\n🔹 Substituição de impostos\n🔹 Nova base de cálculo\n🔹 Prazos alterados\n\n💼 Para empresários:\n• Revisão de processos\n• Treinamento da equipe\n• Adaptação de sistemas\n\n📈 Prepare-se para as mudanças!\n\n#ReformaTributaria #Empresarios #Contabilidade',
    niche: 'Direito',
    type: 'article',
    platform: 'linkedin',
    hashtags: ['#ReformaTributaria', '#Empresarios', '#Contabilidade', '#DireitoTributario'],
    engagement: { likes: 156, comments: 31, shares: 19 },
    createdAt: '2024-01-10'
  },

  // Saúde
  {
    id: '4',
    title: 'Prevenção de Doenças',
    content: '🏥 PREVENÇÃO É O MELHOR REMÉDIO!\n\nCuide da sua saúde com estas dicas:\n\n🥗 Alimentação balanceada\n💪 Exercícios regulares\n😴 Sono de qualidade\n🧘 Controle do estresse\n\n⚠️ Sinais de alerta:\n• Cansaço excessivo\n• Dores persistentes\n• Mudanças no apetite\n\n✅ Faça check-ups regulares!\n\n📞 Agende sua consulta preventiva!',
    niche: 'Saúde',
    type: 'post',
    platform: 'instagram',
    hashtags: ['#SaudePreventiva', '#BemEstar', '#MedicinaPreventiva', '#QualidadeDeVida'],
    engagement: { likes: 312, comments: 28, shares: 15 },
    createdAt: '2024-01-14'
  },
  {
    id: '5',
    title: 'Receita Saudável',
    content: '🥗 RECEITA DO DIA: SALADA DETOX\n\nIngredientes:\n• Rúcula\n• Tomate cereja\n• Abacate\n• Quinoa\n• Azeite extra virgem\n\nModo de preparo:\n1. Misture todos os ingredientes\n2. Tempere com azeite e limão\n3. Sirva fresca\n\n✅ Benefícios:\n• Rica em antioxidantes\n• Fonte de fibras\n• Baixa caloria\n\n#ReceitaSaudavel #Detox #AlimentacaoSaudavel',
    niche: 'Saúde',
    type: 'story',
    platform: 'instagram',
    hashtags: ['#ReceitaSaudavel', '#Detox', '#AlimentacaoSaudavel', '#Nutricao'],
    engagement: { likes: 278, comments: 35, shares: 22 },
    createdAt: '2024-01-11'
  },
  {
    id: '6',
    title: 'Exercícios em Casa',
    content: '💪 TREINO EM CASA: 15 MINUTOS POR DIA\n\nVocê não precisa de academia para se exercitar!\n\n🏃‍♀️ Exercícios simples:\n• Polichinelos (3x 30s)\n• Agachamentos (3x 15)\n• Flexões (3x 10)\n• Prancha (3x 30s)\n\n✅ Benefícios:\n• Fortalece músculos\n• Melhora condicionamento\n• Queima calorias\n• Aumenta energia\n\n🎯 Comece hoje mesmo!\n\n#ExerciciosEmCasa #Fitness #Saude #BemEstar',
    niche: 'Saúde',
    type: 'carousel',
    platform: 'instagram',
    hashtags: ['#ExerciciosEmCasa', '#Fitness', '#Saude', '#BemEstar', '#TreinoEmCasa'],
    engagement: { likes: 445, comments: 42, shares: 28 },
    createdAt: '2024-01-09'
  },

  // Tecnologia
  {
    id: '7',
    title: 'Inteligência Artificial',
    content: '🤖 IA REVOLUCIONANDO O MUNDO DOS NEGÓCIOS\n\nA Inteligência Artificial não é mais futuro, é presente!\n\n🚀 Aplicações práticas:\n• Chatbots para atendimento\n• Análise de dados avançada\n• Automação de processos\n• Previsão de tendências\n\n💡 Para sua empresa:\n• Reduza custos operacionais\n• Melhore a experiência do cliente\n• Tome decisões mais precisas\n\n📈 Invista em IA e fique à frente!\n\n#InteligenciaArtificial #IA #Inovacao #Tecnologia',
    niche: 'Tecnologia',
    type: 'post',
    platform: 'linkedin',
    hashtags: ['#InteligenciaArtificial', '#IA', '#Inovacao', '#Tecnologia', '#TransformacaoDigital'],
    engagement: { likes: 523, comments: 67, shares: 45 },
    createdAt: '2024-01-13'
  },
  {
    id: '8',
    title: 'Dica de Programação',
    content: '💻 DICA DE PROGRAMAÇÃO: REACT HOOKS\n\nUse useEffect corretamente:\n\n```javascript\nuseEffect(() => {\n  // Código aqui\n  return () => {\n    // Cleanup\n  };\n}, [dependencies]);\n```\n\n✅ Boas práticas:\n• Sempre limpe subscriptions\n• Use array de dependências\n• Evite loops infinitos\n\n🎯 Resultado: Código mais limpo e eficiente!\n\n#React #JavaScript #Programacao #WebDevelopment',
    niche: 'Tecnologia',
    type: 'story',
    platform: 'twitter',
    hashtags: ['#React', '#JavaScript', '#Programacao', '#WebDevelopment', '#ReactHooks'],
    engagement: { likes: 234, comments: 19, shares: 12 },
    createdAt: '2024-01-08'
  },
  {
    id: '9',
    title: 'Tendências Tech 2024',
    content: '🔮 TENDÊNCIAS TECH PARA 2024\n\nO que esperar do mundo tecnológico:\n\n🌐 Web3 e Blockchain\n🤖 IA Generativa\n📱 Apps Nativos\n☁️ Edge Computing\n🔒 Zero Trust Security\n\n💼 Impacto nos negócios:\n• Novas oportunidades\n• Maior eficiência\n• Experiências imersivas\n\n🚀 Prepare-se para o futuro!\n\n#TendenciasTech #Inovacao #Tecnologia #Futuro',
    niche: 'Tecnologia',
    type: 'article',
    platform: 'linkedin',
    hashtags: ['#TendenciasTech', '#Inovacao', '#Tecnologia', '#Futuro', '#TransformacaoDigital'],
    engagement: { likes: 389, comments: 52, shares: 31 },
    createdAt: '2024-01-07'
  },

  // Gastronomia
  {
    id: '10',
    title: 'Prato do Dia',
    content: '🍽️ PRATO DO DIA: RISOTTO DE CAMARÃO\n\nDelicioso risotto cremoso com camarões frescos!\n\n💰 Valor: R$ 45,90\n⏰ Disponível até: 20h\n\n✨ Ingredientes:\n• Arroz arbóreo\n• Camarões frescos\n• Queijo parmesão\n• Vinho branco\n• Ervas frescas\n\n🍷 Harmonização: Vinho branco seco\n\n📞 Faça seu pedido: (11) 99999-9999\n\n#RisottoDeCamarao #PratodoDia #Gastronomia #Restaurante',
    niche: 'Gastronomia',
    type: 'post',
    platform: 'instagram',
    hashtags: ['#RisottoDeCamarao', '#PratodoDia', '#Gastronomia', '#Restaurante', '#ComidaItaliana'],
    engagement: { likes: 567, comments: 43, shares: 29 },
    createdAt: '2024-01-16'
  },
  {
    id: '11',
    title: 'Promoção Especial',
    content: '🎉 PROMOÇÃO IMPERDÍVEL!\n\n🍕 PIZZA GRANDE + REFRIGERANTE\n💰 De: R$ 35,90\n💰 Por: R$ 24,90\n\n⏰ Válido até: Domingo\n📍 Apenas para delivery\n\n📱 Peça pelo app ou WhatsApp\n\n#PromocaoPizza #Delivery #Oferta #Gastronomia',
    niche: 'Gastronomia',
    type: 'story',
    platform: 'instagram',
    hashtags: ['#PromocaoPizza', '#Delivery', '#Oferta', '#Gastronomia', '#Pizza'],
    engagement: { likes: 423, comments: 38, shares: 25 },
    createdAt: '2024-01-15'
  },

  // Beleza
  {
    id: '12',
    title: 'Transformação Capilar',
    content: '✨ TRANSFORMAÇÃO INCRÍVEL!\n\nAntes: Cabelo danificado e sem vida\nDepois: Cabelo saudável e brilhoso!\n\n💇‍♀️ Tratamento realizado:\n• Hidratação profunda\n• Reconstrução\n• Selagem\n\n⏱️ Tempo: 2 horas\n💰 Investimento: R$ 120\n\n📅 Agende sua transformação!\n\n#TransformacaoCapilar #Cabelo #Beleza #Salon',
    niche: 'Beleza',
    type: 'post',
    platform: 'instagram',
    hashtags: ['#TransformacaoCapilar', '#Cabelo', '#Beleza', '#Salon', '#Hidratacao'],
    engagement: { likes: 678, comments: 56, shares: 34 },
    createdAt: '2024-01-14'
  },

  // Fitness
  {
    id: '13',
    title: 'Treino HIIT',
    content: '🔥 TREINO HIIT: QUEIME CALORIAS EM 20 MIN!\n\nExercícios de alta intensidade:\n\n1️⃣ Burpees (45s)\n2️⃣ Mountain Climbers (45s)\n3️⃣ Jump Squats (45s)\n4️⃣ Push-ups (45s)\n\n🔄 Repita 4x com 15s de descanso\n\n✅ Queima até 300 calorias!\n\n#HIIT #Treino #Fitness #QueimaCalorias',
    niche: 'Fitness',
    type: 'carousel',
    platform: 'instagram',
    hashtags: ['#HIIT', '#Treino', '#Fitness', '#QueimaCalorias', '#Exercicio'],
    engagement: { likes: 512, comments: 47, shares: 33 },
    createdAt: '2024-01-13'
  }
]

const niches = ['Todos', 'Direito', 'Saúde', 'Tecnologia', 'Gastronomia', 'Beleza', 'Fitness']
const types = ['Posts', 'Stories', 'Artigos', 'Carrosséis']

export default function ExemplosPage() {
  const [selectedNiche, setSelectedNiche] = useState('Todos')
  const [selectedType, setSelectedType] = useState('Posts')
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrar exemplos
  const filteredExamples = examples.filter(example => {
    const matchesNiche = selectedNiche === 'Todos' || example.niche === selectedNiche
    const matchesType = selectedType === 'Posts' || 
      (selectedType === 'Stories' && example.type === 'story') ||
      (selectedType === 'Artigos' && example.type === 'article') ||
      (selectedType === 'Carrosséis' && example.type === 'carousel')
    const matchesSearch = example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         example.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesNiche && matchesType && matchesSearch
  })

  const getPlatformIcon = (platform: string) => {
    const icons = {
      instagram: '📷',
      facebook: '👥',
      linkedin: '💼',
      twitter: '🐦'
    }
    return icons[platform as keyof typeof icons] || '📱'
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      post: '📝',
      story: '📸',
      article: '📄',
      carousel: '🎠'
    }
    return icons[type as keyof typeof icons] || '📱'
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 py-20 pt-36">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Galeria de Exemplos
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Explore nossa biblioteca de conteúdo criado para diferentes nichos e veja a qualidade profissional.
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          {/* Busca */}
          <div className="mb-6">
            <div className="max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Buscar exemplos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filtros por Nicho */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Filtrar por Nicho:</h3>
            <div className="flex flex-wrap gap-2">
              {niches.map((niche) => (
                <button
                  key={niche}
                  onClick={() => setSelectedNiche(niche)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedNiche === niche
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {niche}
                </button>
              ))}
            </div>
          </div>

          {/* Filtros por Tipo */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Filtrar por Tipo:</h3>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedType === type
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Contador de resultados */}
          <div className="mb-8">
            <p className="text-gray-600">
              Mostrando <span className="font-semibold text-primary-600">{filteredExamples.length}</span> exemplo(s)
              {selectedNiche !== 'Todos' && ` em ${selectedNiche}`}
              {selectedType !== 'Posts' && ` do tipo ${selectedType}`}
            </p>
          </div>

          {/* Grid de Exemplos */}
          {filteredExamples.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExamples.map((example) => (
                <div key={example.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Header do Card */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getPlatformIcon(example.platform)}</span>
                        <span className="text-sm font-medium text-gray-600 capitalize">
                          {example.platform}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">{getTypeIcon(example.type)}</span>
                        <span className="text-sm font-medium text-gray-600 capitalize">
                          {example.type}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {example.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                        {example.niche}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(example.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6">
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-800 whitespace-pre-line text-sm leading-relaxed">
                        {example.content}
                      </p>
                    </div>

                    {/* Hashtags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {example.hashtags.map((hashtag, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Engajamento */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          {example.engagement.likes}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {example.engagement.comments}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                          {example.engagement.shares}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer do Card */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Criado em {new Date(example.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <Button 
                        size="sm" 
                        className="bg-primary-600 hover:bg-primary-700 text-white"
                        onClick={() => {
                          // Simular ação de usar este exemplo
                          alert(`Exemplo "${example.title}" selecionado! Em breve você poderá usar este template.`)
                        }}
                      >
                        Usar Este Exemplo
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum exemplo encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Tente ajustar os filtros ou termo de busca
              </p>
              <Button 
                onClick={() => {
                  setSelectedNiche('Todos')
                  setSelectedType('Posts')
                  setSearchTerm('')
                }}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Quer conteúdo assim para seu negócio?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Comece hoje mesmo e tenha conteúdo profissional criado especificamente para seu nicho.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/precos">
              <Button className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Ver Preços
              </Button>
            </Link>
            <Link href="/precos">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold">
                Ver Preços
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}