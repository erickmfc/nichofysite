'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme } from '@/lib/contexts/ThemeContext'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export const SearchBar = ({ onSearch, placeholder = "🔎 Buscar em meus posts por palavra-chave..." }: SearchBarProps) => {
  const { theme } = useTheme()
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  return (
    <div className="flex-1 max-w-2xl mx-8">
      <form onSubmit={handleSearch} className="relative">
        <div className={`relative transition-all duration-200 ${
          isFocused ? 'scale-105' : ''
        }`}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-200 text-lg ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
            }`}
          />
          
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className={`w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className={`absolute inset-y-0 right-0 pr-4 flex items-center ${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search Suggestions (Future Enhancement) */}
        {isFocused && query && (
          <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl border z-40 ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className="p-4">
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Buscando por: <span className="font-semibold">"{query}"</span>
              </p>
              <p className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Pressione Enter para buscar em todos os seus posts
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
