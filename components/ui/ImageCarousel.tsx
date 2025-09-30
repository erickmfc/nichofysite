'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImageData {
  src: string
  alt: string
  title: string
  description: string
}

interface ImageCarouselProps {
  images: ImageData[]
  autoPlay?: boolean
  interval?: number
}

export const ImageCarousel = ({ 
  images, 
  autoPlay = true, 
  interval = 4000 
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay || images.length <= 3) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = images.length - 3
        return prevIndex >= maxIndex ? 0 : prevIndex + 1
      })
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, images.length])

  const goToSlide = (index: number) => {
    const maxIndex = Math.max(0, images.length - 3)
    setCurrentIndex(Math.min(index, maxIndex))
  }

  const goToPrevious = () => {
    const maxIndex = Math.max(0, images.length - 3)
    setCurrentIndex(currentIndex === 0 ? maxIndex : currentIndex - 1)
  }

  const goToNext = () => {
    const maxIndex = Math.max(0, images.length - 3)
    setCurrentIndex(currentIndex >= maxIndex ? 0 : currentIndex + 1)
  }

  if (images.length === 0) return null

  // Se temos 3 ou menos imagens, mostrar todas
  const visibleImages = images.length <= 3 
    ? images 
    : images.slice(currentIndex, currentIndex + 3)

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      {/* Carousel Container */}
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Veja o que nossa IA pode criar
          </h2>
          <p className="text-lg text-gray-600">
            Exemplos reais de conteúdo profissional gerado pela NichoFy
          </p>
        </div>

        {/* Images Tray */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleImages.map((image, index) => (
              <div key={currentIndex + index} className="group">
                <div className="bg-gray-50 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {/* Image Container */}
                  <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-white">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      priority={index === 0}
                    />
                  </div>
                  
                  {/* Text Content */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {image.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {image.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows - Only show if more than 3 images */}
          {images.length > 3 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl z-10"
                aria-label="Imagens anteriores"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl z-10"
                aria-label="Próximas imagens"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Dots Indicator - Only show if more than 3 images */}
        {images.length > 3 && (
          <div className="flex justify-center mt-8 space-x-3">
            {Array.from({ length: Math.max(1, images.length - 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-orange-500 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir para conjunto ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Auto-play indicator */}
        {autoPlay && images.length > 3 && (
          <div className="flex items-center justify-center mt-4 space-x-2 text-gray-500 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Passando automaticamente</span>
          </div>
        )}
      </div>
    </div>
  )
}
