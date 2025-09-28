'use client'

import { useState, useEffect } from 'react'

interface ContentCard {
  id: string
  title: string
  content: string
  platform: string
  niche: string
  x: number
  y: number
  rotation: number
}

interface FlyingContentCardsProps {
  content: string
  isActive: boolean
}

const platformIcons: Record<string, string> = {
  instagram: '📸',
  facebook: '👍',
  linkedin: '💼',
  twitter: '🐦',
  tiktok: '🎵'
}

const nicheColors: Record<string, string> = {
  'café': 'from-amber-500 to-orange-600',
  'barbearia': 'from-blue-500 to-indigo-600',
  'direito': 'from-gray-600 to-gray-800',
  'saúde': 'from-green-500 to-emerald-600',
  'finanças': 'from-yellow-500 to-orange-500'
}

export const FlyingContentCards: React.FC<FlyingContentCardsProps> = ({ content, isActive }) => {
  const [cards, setCards] = useState<ContentCard[]>([])

  useEffect(() => {
    if (!isActive) return

    const generateCards = () => {
      const newCards: ContentCard[] = []
      const platforms = ['instagram', 'facebook', 'linkedin', 'twitter', 'tiktok'] as const
      const niches = ['café', 'barbearia', 'direito', 'saúde', 'finanças'] as const

      for (let i = 0; i < 4; i++) { // Menos cards para não sobrecarregar
        const platform = platforms[Math.floor(Math.random() * platforms.length)]
        const niche = niches[Math.floor(Math.random() * niches.length)]
        
        newCards.push({
          id: `card-${Date.now()}-${i}`,
          title: `Post ${i + 1}`,
          content: content.slice(0, 60) + '...', // Texto mais curto
          platform,
          niche,
          x: Math.random() * 80 + 10, // Evita bordas
          y: Math.random() * 60 + 20, // Evita bordas
          rotation: (Math.random() - 0.5) * 15 // Rotação menor
        })
      }

      setCards(newCards)
    }

    const timer = setTimeout(generateCards, 1500) // Delay maior
    return () => clearTimeout(timer)
  }, [content, isActive])

  if (!isActive || cards.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className={`absolute transform transition-all duration-1000 ease-out ${
            index < 3 ? 'animate-fly-in' : 'animate-fly-in-delayed'
          }`}
          style={{
            left: `${card.x}%`,
            top: `${card.y}%`,
            transform: `rotate(${card.rotation}deg)`,
            animationDelay: `${index * 200}ms`
          }}
        >
          <div className={`w-64 h-40 bg-gradient-to-br ${nicheColors[card.niche]} rounded-2xl shadow-2xl p-4 backdrop-blur-sm border border-white/20`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm font-medium">{card.niche}</span>
              <span className="text-white text-lg">{platformIcons[card.platform]}</span>
            </div>
            <div className="text-white text-sm leading-relaxed">
              {card.content}
            </div>
            <div className="absolute bottom-2 right-2 flex gap-1">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
