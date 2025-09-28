'use client'

import { useState, useEffect } from 'react'

interface ContentItem {
  id: string
  title: string
  content: string
  niche: string
  platform: string
  group: number
  position: number
}

const contentItems: Omit<ContentItem, 'id' | 'group' | 'position'>[] = [
  { title: "Dia do Café", content: "☕ Celebre o Dia Internacional do Café com nossa seleção especial...", niche: "Café", platform: "Instagram" },
  { title: "Corte da Semana", content: "✂️ Novo corte da semana! Agende já o seu horário...", niche: "Barbearia", platform: "Instagram" },
  { title: "Direito Trabalhista", content: "⚖️ Conheça seus direitos trabalhistas. Consultoria gratuita...", niche: "Direito", platform: "LinkedIn" },
  { title: "Saúde Preventiva", content: "🏥 Prevenção é o melhor remédio. Cuide da sua saúde...", niche: "Saúde", platform: "Facebook" },
  { title: "Investimentos", content: "💰 Aprenda a investir com segurança. Educação financeira...", niche: "Finanças", platform: "Instagram" },
  { title: "Marketing Digital", content: "📱 Estratégias de marketing que realmente funcionam...", niche: "Marketing", platform: "LinkedIn" },
  { title: "Nutrição", content: "🥗 Alimentação saudável para uma vida melhor...", niche: "Saúde", platform: "Instagram" },
  { title: "Tecnologia", content: "💻 As últimas tendências em tecnologia para seu negócio...", niche: "Tech", platform: "Twitter" },
  { title: "Moda", content: "👗 Looks incríveis para todas as ocasiões...", niche: "Moda", platform: "Instagram" },
  { title: "Educação", content: "📚 Educação de qualidade transforma vidas...", niche: "Educação", platform: "Facebook" },
  { title: "Fitness", content: "💪 Treinos eficazes para todos os níveis...", niche: "Saúde", platform: "Instagram" },
  { title: "Beleza", content: "✨ Dicas de beleza para realçar sua naturalidade...", niche: "Beleza", platform: "Instagram" }
]

const nicheColors: Record<string, string> = {
  "Café": "bg-gradient-to-br from-amber-500 to-orange-600",
  "Barbearia": "bg-gradient-to-br from-blue-500 to-indigo-600", 
  "Direito": "bg-gradient-to-br from-gray-600 to-gray-800",
  "Saúde": "bg-gradient-to-br from-green-500 to-emerald-600",
  "Finanças": "bg-gradient-to-br from-yellow-500 to-orange-500",
  "Marketing": "bg-gradient-to-br from-purple-500 to-pink-600",
  "Tech": "bg-gradient-to-br from-indigo-500 to-blue-600",
  "Moda": "bg-gradient-to-br from-pink-500 to-rose-600",
  "Educação": "bg-gradient-to-br from-teal-500 to-cyan-600",
  "Beleza": "bg-gradient-to-br from-rose-500 to-pink-600"
}

export const InfiniteContentFlow = () => {
  const [groups, setGroups] = useState<ContentItem[][]>([])

  useEffect(() => {
    const createGroup = (): ContentItem[] => {
      // Seleciona 3 itens aleatórios para formar um grupo
      const shuffled = [...contentItems].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, 3).map((item, index) => ({
        ...item,
        id: `group-${Date.now()}-${index}`,
        group: Math.floor(Date.now() / 1000),
        position: index
      }))
    }

    const addNewGroup = () => {
      const newGroup = createGroup()
      setGroups(prev => [...prev, newGroup])
      
      // Remove grupos antigos após 15 segundos
      setTimeout(() => {
        setGroups(prev => prev.slice(1))
      }, 15000)
    }

    // Criar grupo inicial
    addNewGroup()
    
    // Adicionar novos grupos a cada 4 segundos
    const interval = setInterval(addNewGroup, 4000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0">
        {groups.map((group, groupIndex) => (
          <div
            key={`group-${groupIndex}`}
            className="absolute inset-0"
            style={{
              animation: `slideUp 15s linear forwards`,
              animationDelay: `${groupIndex * 4}s`
            }}
          >
            {group.map((item, itemIndex) => (
              <div
                key={item.id}
                className={`absolute w-72 h-28 ${nicheColors[item.niche]} rounded-xl shadow-lg p-4 text-white backdrop-blur-sm border border-white/20`}
                style={{
                  left: `${20 + itemIndex * 30}%`,
                  top: `${30 + itemIndex * 15}%`,
                  animation: `fadeInUp 1s ease-out forwards`,
                  animationDelay: `${itemIndex * 0.3}s`
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold bg-white/30 px-2 py-1 rounded-full text-gray-900">
                    {item.niche}
                  </span>
                  <span className="text-xs font-medium bg-white/30 px-2 py-1 rounded-full text-gray-900">
                    {item.platform}
                  </span>
                </div>
                <h3 className="font-bold text-sm mb-1 leading-tight drop-shadow-md">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed line-clamp-2 font-medium drop-shadow-sm">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Gradiente sutil para melhorar legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none"></div>
    </div>
  )
}
