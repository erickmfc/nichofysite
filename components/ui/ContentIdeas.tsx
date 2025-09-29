'use client'

import { useState } from 'react'

const contentIdeas = {
  direito: [
    "Nova lei trabalhista: o que mudou?",
    "Direitos do consumidor: saiba como se proteger",
    "Divórcio consensual: passo a passo",
    "Herança: como funciona a partilha de bens",
    "Contratos de trabalho: o que você precisa saber",
    "Direito previdenciário: benefícios disponíveis",
    "Acidentes de trabalho: seus direitos",
    "Direito do consumidor: produtos com defeito"
  ],
  saude: [
    "Alimentação saudável: dicas práticas",
    "Exercícios para fazer em casa",
    "Prevenção de doenças: check-up anual",
    "Saúde mental: importância do autocuidado",
    "Medicina preventiva: investir na saúde",
    "Exercícios de respiração para ansiedade",
    "Alimentação anti-inflamatória",
    "Importância do sono para a saúde"
  ],
  tecnologia: [
    "IA no dia a dia: como está mudando tudo",
    "Segurança digital: proteja seus dados",
    "Tendências tech para 2024",
    "Apps que facilitam a vida",
    "Blockchain: o que é e como funciona",
    "Realidade virtual: futuro presente",
    "Cibersegurança: proteja-se online",
    "Automação: como a IA está mudando o trabalho"
  ],
  gastronomia: [
    "Receitas saudáveis para o dia a dia",
    "Técnicas de culinária básicas",
    "Ingredientes sazonais: aproveite o melhor",
    "Cozinha internacional: explore sabores",
    "Dicas para economizar na cozinha",
    "Alimentação sustentável: faça a diferença",
    "Técnicas de conservação de alimentos",
    "Cozinha funcional: organize seu espaço"
  ],
  fitness: [
    "Treino em casa: sem equipamentos",
    "Alimentação para ganho de massa",
    "Cardio vs musculação: qual escolher?",
    "Recuperação muscular: importância do descanso",
    "Suplementação: o que realmente funciona",
    "Treino funcional: movimentos naturais",
    "Motivação para treinar: dicas práticas",
    "Lesões no esporte: como prevenir"
  ],
  educacao: [
    "Métodos de estudo eficazes",
    "Tecnologia na educação: ferramentas úteis",
    "Educação financeira: ensine desde cedo",
    "Aprendizado de idiomas: dicas práticas",
    "Educação inclusiva: todos podem aprender",
    "Gamificação na educação: aprenda brincando",
    "Educação ambiental: conscientização",
    "Habilidades do século 21: o que ensinar"
  ]
}

interface ContentIdeasProps {
  niche?: keyof typeof contentIdeas
}

export const ContentIdeas = ({ niche = 'direito' }: ContentIdeasProps) => {
  const [currentIdea, setCurrentIdea] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const ideas = contentIdeas[niche] || contentIdeas.direito

  const nextIdea = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIdea((prev) => (prev + 1) % ideas.length)
      setIsAnimating(false)
    }, 150)
  }

  const previousIdea = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIdea((prev) => (prev - 1 + ideas.length) % ideas.length)
      setIsAnimating(false)
    }, 150)
  }

  const getNicheEmoji = () => {
    const emojis = {
      direito: '⚖️',
      saude: '🏥',
      tecnologia: '💻',
      gastronomia: '🍽️',
      fitness: '💪',
      educacao: '📚'
    }
    return emojis[niche] || '💡'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {getNicheEmoji()} Ideias de Conteúdo
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {currentIdea + 1}/{ideas.length}
        </span>
      </div>
      
      <div className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 min-h-[80px] transition-all duration-300 ${
        isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      }`}>
        <p className="text-gray-800 dark:text-gray-200 text-center">
          {ideas[currentIdea]}
        </p>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={previousIdea}
          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg transition-colors"
        >
          ← Anterior
        </button>
        <button
          onClick={nextIdea}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Próxima →
        </button>
      </div>

      <div className="mt-4 flex justify-center space-x-1">
        {ideas.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIdea 
                ? 'bg-blue-600' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
          💡 Use essas ideias como inspiração para seus posts!
        </p>
      </div>
    </div>
  )
}
