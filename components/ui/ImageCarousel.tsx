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
  interval = 3000 
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, images.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1)
  }

  if (images.length === 0) return null

  const currentImage = images[currentIndex]

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Carousel Container */}
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Image Section */}
          <div className="relative w-full lg:w-2/3">
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <div className="relative aspect-square max-w-md mx-auto">
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  priority={currentIndex === 0}
                />
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl z-10"
              aria-label="Imagem anterior"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl z-10"
              aria-label="Próxima imagem"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-1/3 text-center lg:text-left">
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {currentImage.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {currentImage.description}
                </p>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center lg:justify-start space-x-3">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-orange-500 scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Ir para imagem ${index + 1}`}
                  />
                ))}
              </div>

              {/* Auto-play indicator */}
              {autoPlay && images.length > 1 && (
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-500 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Passando automaticamente</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
