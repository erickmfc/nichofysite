'use client'

import { useState, useEffect } from 'react'

interface SearchToolbarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedNiche: string
  onNicheChange: (niche: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  sortBy: 'recent' | 'oldest'
  onSortChange: (sort: 'recent' | 'oldest') => void
  niches: string[]
  categories: string[]
  stats: {
    total: number
    favorites: number
    showing: number
  }
}

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  searchTerm,
  onSearchChange,
  selectedNiche,
  onNicheChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  niches,
  categories,
  stats
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      {/* Barra de busca principal */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔎 Buscar posts
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Digite palavras-chave, títulos ou conteúdo..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>⚙️</span>
          <span className="hidden sm:inline">Filtros</span>
          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </div>

      {/* Filtros expandidos */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          
          {/* Filtro por Nicho */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎯 Nicho
            </label>
            <select
              value={selectedNiche}
              onChange={(e) => onNicheChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os nichos</option>
              {niches.map(niche => (
                <option key={niche} value={niche}>{niche}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📂 Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Ordenar por */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📊 Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'recent' | 'oldest')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="recent">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
            </select>
          </div>

          {/* Limpar filtros */}
          <div className="flex items-end">
            <button
              onClick={() => {
                onSearchChange('')
                onNicheChange('')
                onCategoryChange('')
                onSortChange('recent')
              }}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              🗑️ Limpar filtros
            </button>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">📊</span>
            <span className="text-gray-700">Total: <strong>{stats.total}</strong> posts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">⭐</span>
            <span className="text-gray-700">Favoritos: <strong>{stats.favorites}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">🔍</span>
            <span className="text-gray-700">Mostrando: <strong>{stats.showing}</strong> posts</span>
          </div>
          {stats.showing < stats.total && (
            <div className="flex items-center gap-2">
              <span className="text-orange-600">⚠️</span>
              <span className="text-gray-700">Filtros ativos</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
