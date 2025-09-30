'use client'

import { useState, useEffect } from 'react'

interface InteractiveDemoProps {
  className?: string
}

export const InteractiveDemo = ({ className = '' }: InteractiveDemoProps) => {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [generatedContent, setGeneratedContent] = useState('')
  const [selectedNiche, setSelectedNiche] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('')

  // Nichos e tópicos dinâmicos
  const niches = [
    { id: 'direito', name: 'Direito Trabalhista', icon: '⚖️', color: 'from-gray-600 to-gray-800' },
    { id: 'saude', name: 'Saúde & Bem-Estar', icon: '👨‍⚕️', color: 'from-green-500 to-emerald-600' },
    { id: 'gastronomia', name: 'Gastronomia', icon: '🍔', color: 'from-orange-500 to-red-600' },
    { id: 'beleza', name: 'Beleza & Estética', icon: '💇‍♀️', color: 'from-pink-500 to-rose-600' },
    { id: 'fitness', name: 'Fitness & Esportes', icon: '💪', color: 'from-yellow-500 to-orange-500' },
    { id: 'tecnologia', name: 'Tecnologia', icon: '💻', color: 'from-purple-500 to-indigo-600' }
  ]

  const topics = {
    direito: [
      'Demissão via WhatsApp',
      'Horas extras não pagas',
      'Assédio no trabalho',
      'FGTS e direitos',
      'Rescisão indireta'
    ],
    saude: [
      'Prevenção de doenças',
      'Alimentação saudável',
      'Exercícios físicos',
      'Saúde mental',
      'Check-up médico'
    ],
    gastronomia: [
      'Receita do dia',
      'Dicas culinárias',
      'Ingredientes frescos',
      'Técnicas de cozinha',
      'Cardápio especial'
    ],
    beleza: [
      'Skincare diário',
      'Tendências de cabelo',
      'Maquiagem natural',
      'Tratamentos estéticos',
      'Autocuidado'
    ],
    fitness: [
      'Treino em casa',
      'Alimentação esportiva',
      'Motivação fitness',
      'Exercícios funcionais',
      'Resultados de alunos'
    ],
    tecnologia: [
      'Novidades tech',
      'Dicas de programação',
      'IA e automação',
      'Segurança digital',
      'Ferramentas úteis'
    ]
  }

  const demoSteps = [
    {
      title: 'Escolhendo o nicho...',
      content: `Analisando perfil: ${selectedNiche || 'Selecionando nicho ideal'}`,
      icon: '🎯'
    },
    {
      title: 'Analisando tendências...',
      content: `Identificando tópicos em alta: ${selectedTopic || 'Analisando tendências'}`,
      icon: '📊'
    },
    {
      title: 'Criando conteúdo...',
      content: 'Gerando post otimizado para engajamento',
      icon: '✨'
    },
    {
      title: 'Finalizando...',
      content: 'Aplicando tom profissional e hashtags relevantes',
      icon: '🎨'
    }
  ]

  // Gerar conteúdo dinâmico baseado no nicho e tópico
  const generateDynamicContent = (nicheId: string, topic: string) => {
    const niche = niches.find(n => n.id === nicheId)
    if (!niche) return null

    const contentTemplates = {
      direito: {
        title: `${topic}: Você tem direitos!`,
        content: `Você sabia que ${topic.toLowerCase()} pode render uma indenização significativa? 

📱 ${topic} é considerado abusivo pela Justiça do Trabalho
💰 Você tem direito a indenização por danos morais
⚖️ Procure um advogado especializado em direito trabalhista

#DireitoTrabalhista #${topic.replace(/\s+/g, '')} #DireitosDoTrabalhador #JusticaTrabalhista #AdvogadoTrabalhista`,
        metrics: { engagement: '+340%', reach: '+280%', saves: '+190%' }
      },
      saude: {
        title: `${topic}: Cuide da sua saúde!`,
        content: `💡 ${topic} é fundamental para uma vida saudável!

🏥 Consulte regularmente seu médico
🥗 Mantenha uma alimentação equilibrada
🏃‍♂️ Pratique exercícios físicos regularmente
🧘‍♀️ Cuide da sua saúde mental

#Saude #${topic.replace(/\s+/g, '')} #Prevencao #BemEstar #SaudeMental`,
        metrics: { engagement: '+280%', reach: '+320%', saves: '+220%' }
      },
      gastronomia: {
        title: `${topic}: Receita especial!`,
        content: `🍽️ ${topic} nunca foi tão fácil!

👨‍🍳 Ingredientes frescos e selecionados
⏰ Tempo de preparo: 30 minutos
👥 Serve: 4 pessoas
🌟 Dificuldade: Fácil

#Gastronomia #${topic.replace(/\s+/g, '')} #Receita #Culinaria #Chef`,
        metrics: { engagement: '+420%', reach: '+380%', saves: '+310%' }
      },
      beleza: {
        title: `${topic}: Transforme sua beleza!`,
        content: `✨ ${topic} para realçar sua beleza natural!

💄 Produtos de qualidade e testados
👩‍⚕️ Técnicas profissionais
🌟 Resultados duradouros
💅 Autocuidado é essencial

#Beleza #${topic.replace(/\s+/g, '')} #Estetica #Autocuidado #BelezaNatural`,
        metrics: { engagement: '+380%', reach: '+290%', saves: '+250%' }
      },
      fitness: {
        title: `${topic}: Transforme seu corpo!`,
        content: `💪 ${topic} para resultados incríveis!

🏋️‍♂️ Exercícios eficazes e seguros
🥗 Alimentação balanceada
📈 Acompanhamento profissional
🎯 Metas alcançáveis

#Fitness #${topic.replace(/\s+/g, '')} #Treino #Saude #Transformacao`,
        metrics: { engagement: '+350%', reach: '+310%', saves: '+280%' }
      },
      tecnologia: {
        title: `${topic}: Inovação em suas mãos!`,
        content: `🚀 ${topic} revolucionando o futuro!

💻 Tecnologia de ponta
🔧 Soluções práticas
📱 Acessível para todos
🌟 Inovação constante

#Tecnologia #${topic.replace(/\s+/g, '')} #Inovacao #Digital #Tech`,
        metrics: { engagement: '+290%', reach: '+340%', saves: '+200%' }
      }
    }

    return contentTemplates[nicheId as keyof typeof contentTemplates] || contentTemplates.direito
  }

  const startDemo = () => {
    // Selecionar nicho e tópico aleatórios
    const randomNiche = niches[Math.floor(Math.random() * niches.length)]
    const nicheTopics = topics[randomNiche.id as keyof typeof topics] || []
    const randomTopic = nicheTopics[Math.floor(Math.random() * nicheTopics.length)]
    
    setSelectedNiche(randomNiche.name)
    setSelectedTopic(randomTopic)
    setIsRunning(true)
    setCurrentStep(0)
    setGeneratedContent('')
  }

  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= demoSteps.length - 1) {
          setIsRunning(false)
          // Gerar conteúdo dinâmico baseado na seleção
          const nicheId = niches.find(n => n.name === selectedNiche)?.id || 'direito'
          const dynamicContent = generateDynamicContent(nicheId, selectedTopic)
          if (dynamicContent) {
            setGeneratedContent(dynamicContent.content)
          }
          return prev
        }
        return prev + 1
      })
    }, 2000)

    return () => clearInterval(timer)
  }, [isRunning, selectedNiche, selectedTopic])

  return (
    <div className={`bg-white rounded-3xl shadow-2xl p-8 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Veja a IA em ação
        </h2>
        <p className="text-lg text-gray-600">
          Demonstração em tempo real da criação de conteúdo profissional
        </p>
        
        {/* Nicho e Tópico Selecionados */}
        {(selectedNiche || selectedTopic) && (
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {selectedNiche && (
              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                🎯 Nicho: {selectedNiche}
              </div>
            )}
            {selectedTopic && (
              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                📝 Tópico: {selectedTopic}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Demo Area */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Processo de Criação
            </h3>
            
            {isRunning ? (
              <div className="space-y-4">
                {demoSteps.map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-500 ${
                      index <= currentStep 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep ? 'bg-orange-500 text-white' : 'bg-gray-300'
                    }`}>
                      {index < currentStep ? '✓' : step.icon}
                    </div>
                    <div>
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm opacity-80">{step.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚀</span>
                </div>
                <p className="text-gray-600">Clique em "Iniciar Demo" para ver a IA criando conteúdo</p>
              </div>
            )}
          </div>

          <button
            onClick={startDemo}
            disabled={isRunning}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              isRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            }`}
          >
            {isRunning ? 'Demo em andamento...' : 'Iniciar Demo'}
          </button>
        </div>

        {/* Result Area */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resultado Final
            </h3>
            
            {generatedContent ? (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border-l-4 border-orange-500">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {(() => {
                      const nicheId = niches.find(n => n.name === selectedNiche)?.id || 'direito'
                      const dynamicContent = generateDynamicContent(nicheId, selectedTopic)
                      return dynamicContent?.title || 'Conteúdo Gerado'
                    })()}
                  </h4>
                  <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                    {generatedContent}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {(() => {
                    const nicheId = niches.find(n => n.name === selectedNiche)?.id || 'direito'
                    const dynamicContent = generateDynamicContent(nicheId, selectedTopic)
                    const metrics = dynamicContent?.metrics || { engagement: '+300%', reach: '+250%', saves: '+200%' }
                    
                    return (
                      <>
                        <div className="bg-green-50 text-green-700 p-3 rounded-xl text-center">
                          <div className="text-lg font-bold">{metrics.engagement}</div>
                          <div className="text-xs">Engajamento</div>
                        </div>
                        <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-center">
                          <div className="text-lg font-bold">{metrics.reach}</div>
                          <div className="text-xs">Alcance</div>
                        </div>
                        <div className="bg-purple-50 text-purple-700 p-3 rounded-xl text-center">
                          <div className="text-lg font-bold">{metrics.saves}</div>
                          <div className="text-xs">Salvamentos</div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📝</span>
                </div>
                <p>O conteúdo aparecerá aqui após a demonstração</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Tempo de Criação</h3>
            <div className="text-4xl font-bold mb-2">8 segundos</div>
            <p className="text-white/90">vs. 2 horas manualmente</p>
          </div>
        </div>
      </div>
    </div>
  )
}
