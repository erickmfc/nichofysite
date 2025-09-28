'use client'

import { useState, useEffect } from 'react'

export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrollTop / docHeight, 1)
      
      setScrollProgress(progress)
      
      // Determinar seção atual baseada no scroll
      const sectionHeight = window.innerHeight
      const section = Math.floor(scrollTop / sectionHeight)
      setCurrentSection(section)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { scrollProgress, currentSection }
}
