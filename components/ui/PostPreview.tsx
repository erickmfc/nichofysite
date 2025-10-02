'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

interface PostPreviewProps {
  text: string
  type: 'copy' | 'post' | 'anuncio' | 'email'
  className?: string
}

const FONTES_DISPONIVEIS = [
  { id: 'inter', name: 'Inter' },
  { id: 'poppins', name: 'Poppins' },
  { id: 'roboto', name: 'Roboto' },
  { id: 'opensans', name: 'Open Sans' },
  { id: 'lato', name: 'Lato' },
  { id: 'montserrat', name: 'Montserrat' },
  { id: 'playfair', name: 'Playfair Display' },
  { id: 'merriweather', name: 'Merriweather' },
  { id: 'sourcecode', name: 'Source Code Pro' }
]

export const PostPreview = ({ text, type, className = '' }: PostPreviewProps) => {
  const { user } = useAuth()
  const [brandData, setBrandData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadBrandData()
    }
  }, [user])

  const loadBrandData = async () => {
    if (!user) return

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        if (data.brandIdentity) {
          setBrandData(data.brandIdentity)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar identidade da marca:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!brandData) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 ${className}`}>
        <p className="text-gray-600 text-sm">
          Configure sua identidade da marca para ver o preview personalizado
        </p>
      </div>
    )
  }

  const getFontFamily = (fontId: string) => {
    return FONTES_DISPONIVEIS.find(f => f.id === fontId)?.name || 'Inter'
  }

  const getPostStyle = () => {
    switch (type) {
      case 'copy':
        return {
          backgroundColor: brandData.cores.background,
          color: brandData.cores.texto,
          borderColor: brandData.cores.primaria,
          accentColor: brandData.cores.accent
        }
      case 'post':
        return {
          backgroundColor: '#ffffff',
          color: brandData.cores.texto,
          borderColor: brandData.cores.secundaria,
          accentColor: brandData.cores.primaria
        }
      case 'anuncio':
        return {
          backgroundColor: brandData.cores.primaria,
          color: '#ffffff',
          borderColor: brandData.cores.accent,
          accentColor: brandData.cores.accent
        }
      case 'email':
        return {
          backgroundColor: '#ffffff',
          color: brandData.cores.texto,
          borderColor: brandData.cores.neutra,
          accentColor: brandData.cores.primaria
        }
      default:
        return {
          backgroundColor: '#ffffff',
          color: brandData.cores.texto,
          borderColor: brandData.cores.neutra,
          accentColor: brandData.cores.primaria
        }
    }
  }

  const postStyle = getPostStyle()

  return (
    <div className={`rounded-lg border-2 p-6 ${className}`} style={{ 
      backgroundColor: postStyle.backgroundColor,
      borderColor: postStyle.borderColor,
      color: postStyle.color
    }}>
      <div className="space-y-4">
        {/* Header do Post */}
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: brandData.cores.primaria }}
          >
            {brandData.elementosVisuais?.icones?.[0] || '🎯'}
          </div>
          <div>
            <div 
              className="font-semibold text-sm"
              style={{ 
                fontFamily: getFontFamily(brandData.tipografia.titulo),
                color: postStyle.color
              }}
            >
              Sua Marca
            </div>
            <div 
              className="text-xs opacity-70"
              style={{ 
                fontFamily: getFontFamily(brandData.tipografia.corpo),
                color: postStyle.color
              }}
            >
              Agora
            </div>
          </div>
        </div>

        {/* Conteúdo do Post */}
        <div className="space-y-3">
          {text.split('\n').map((paragraph, index) => {
            if (!paragraph.trim()) return null
            
            const isTitle = index === 0 && paragraph.length < 100
            const isHighlight = paragraph.includes('!') || paragraph.includes('?')
            
            return (
              <div
                key={index}
                className={`${
                  isTitle ? 'font-bold text-lg' : 
                  isHighlight ? 'font-semibold' : 
                  'font-normal'
                }`}
                style={{ 
                  fontFamily: isTitle 
                    ? getFontFamily(brandData.tipografia.titulo)
                    : getFontFamily(brandData.tipografia.corpo),
                  color: postStyle.color
                }}
              >
                {paragraph}
              </div>
            )
          })}
        </div>

        {/* Footer do Post */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <button 
              className="flex items-center space-x-1 text-sm opacity-70 hover:opacity-100 transition-opacity"
              style={{ color: postStyle.color }}
            >
              <span>❤️</span>
              <span>0</span>
            </button>
            <button 
              className="flex items-center space-x-1 text-sm opacity-70 hover:opacity-100 transition-opacity"
              style={{ color: postStyle.color }}
            >
              <span>💬</span>
              <span>0</span>
            </button>
            <button 
              className="flex items-center space-x-1 text-sm opacity-70 hover:opacity-100 transition-opacity"
              style={{ color: postStyle.color }}
            >
              <span>🔄</span>
              <span>0</span>
            </button>
          </div>
          
          {/* Hashtags */}
          <div className="flex flex-wrap gap-1">
            {['#marca', '#conteudo', '#marketing'].map((hashtag, index) => (
              <span 
                key={index}
                className="text-xs opacity-70"
                style={{ 
                  color: postStyle.accentColor,
                  fontFamily: getFontFamily(brandData.tipografia.destaque)
                }}
              >
                {hashtag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
