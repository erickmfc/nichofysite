'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  isLoaded: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Verificar se estamos no cliente
    if (typeof window === 'undefined') return

    try {
      // Carregar tema salvo do localStorage
      const savedTheme = localStorage.getItem('nichofy-theme') as 'light' | 'dark'
      if (savedTheme) {
        setTheme(savedTheme)
      } else {
        // Detectar preferência do sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setTheme(prefersDark ? 'dark' : 'light')
      }
    } catch (error) {
      console.warn('Erro ao carregar tema:', error)
      setTheme('light')
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    // Verificar se estamos no cliente
    if (typeof window === 'undefined') return

    try {
      // Salvar tema no localStorage
      localStorage.setItem('nichofy-theme', theme)
      
      // Aplicar tema ao documento
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(theme)
    } catch (error) {
      console.warn('Erro ao salvar tema:', error)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
