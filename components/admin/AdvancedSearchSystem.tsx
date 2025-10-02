'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAdminRealData } from '@/hooks/useAdminRealData'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'

interface SearchResult {
  id: string
  type: 'user' | 'post' | 'comment' | 'order' | 'report' | 'log' | 'setting'
  title: string
  description: string
  url: string
  timestamp?: Date
  metadata?: {
    status?: string
    priority?: string
    category?: string
    author?: string
    tags?: string[]
  }
  relevance: number
}

interface SearchFilter {
  type: string[]
  dateRange: string
  status: string[]
  category: string[]
  priority: string[]
}

interface SearchSuggestion {
  id: string
  text: string
  type: 'recent' | 'popular' | 'suggestion'
  count?: number
}

interface SearchHistory {
  id: string
  query: string
  timestamp: Date
  resultsCount: number
}

export const AdvancedSearchSystem = () => {
  const { stats } = useAdminRealData()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [filters, setFilters] = useState<SearchFilter>({
    type: [],
    dateRange: 'all',
    status: [],
    category: [],
    priority: []
  })
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [searchStats, setSearchStats] = useState({
    totalResults: 0,
    searchTime: 0,
    lastSearch: null as Date | null
  })

  useEffect(() => {
    loadSearchHistory()
    loadSuggestions()
  }, [])

  useEffect(() => {
    if (searchQuery.length > 2) {
      const timeoutId = setTimeout(() => {
        performSearch(searchQuery)
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, filters])

  const loadSearchHistory = () => {
    const mockHistory: SearchHistory[] = [
      {
        id: '1',
        query: 'usuários ativos',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        resultsCount: 45
      },
      {
        id: '2',
        query: 'posts pendentes',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        resultsCount: 12
      },
      {
        id: '3',
        query: 'erro 500',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        resultsCount: 8
      },
      {
        id: '4',
        query: 'configurações email',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        resultsCount: 3
      }
    ]
    setSearchHistory(mockHistory)
  }

  const loadSuggestions = () => {
    const mockSuggestions: SearchSuggestion[] = [
      { id: '1', text: 'usuários ativos', type: 'popular', count: 45 },
      { id: '2', text: 'posts pendentes', type: 'popular', count: 12 },
      { id: '3', text: 'erro 500', type: 'popular', count: 8 },
      { id: '4', text: 'configurações', type: 'suggestion' },
      { id: '5', text: 'relatórios', type: 'suggestion' },
      { id: '6', text: 'backup', type: 'suggestion' },
      { id: '7', text: 'logs', type: 'suggestion' },
      { id: '8', text: 'notificações', type: 'suggestion' }
    ]
    setSuggestions(mockSuggestions)
  }

  const performSearch = async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)
    const startTime = Date.now()

    try {
      // Simular busca com dados mockados
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'user',
          title: 'João Silva',
          description: 'Usuário ativo desde 2024-01-15. 25 posts criados.',
          url: '/admin/users/user-123',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          metadata: {
            status: 'active',
            category: 'premium',
            author: 'João Silva'
          },
          relevance: 95
        },
        {
          id: '2',
          type: 'post',
          title: 'Como criar conteúdo viral',
          description: 'Post sobre estratégias de marketing digital. Status: pendente.',
          url: '/admin/moderation/post-456',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          metadata: {
            status: 'pending',
            category: 'marketing',
            author: 'Maria Santos',
            tags: ['marketing', 'conteúdo', 'viral']
          },
          relevance: 88
        },
        {
          id: '3',
          type: 'log',
          title: 'Erro 500 - API Payment',
          description: 'Falha na API de pagamento. Timestamp: 2024-01-15 14:30:00',
          url: '/admin/logs/log-789',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          metadata: {
            status: 'error',
            priority: 'high',
            category: 'api'
          },
          relevance: 92
        },
        {
          id: '4',
          type: 'setting',
          title: 'Configurações de Email',
          description: 'Configurações SMTP e templates de email do sistema.',
          url: '/admin/settings/email',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          metadata: {
            status: 'active',
            category: 'email'
          },
          relevance: 75
        },
        {
          id: '5',
          type: 'report',
          title: 'Relatório Mensal - Janeiro 2024',
          description: 'Relatório de performance e métricas do mês de janeiro.',
          url: '/admin/reports/report-101',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          metadata: {
            status: 'completed',
            category: 'analytics'
          },
          relevance: 82
        }
      ]

      // Filtrar resultados baseado na query
      const filteredResults = mockResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.metadata?.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )

      // Aplicar filtros adicionais
      const finalResults = filteredResults.filter(result => {
        if (filters.type.length > 0 && !filters.type.includes(result.type)) return false
        if (filters.status.length > 0 && result.metadata?.status && !filters.status.includes(result.metadata.status)) return false
        if (filters.category.length > 0 && result.metadata?.category && !filters.category.includes(result.metadata.category)) return false
        return true
      })

      setSearchResults(finalResults)
      setSearchStats({
        totalResults: finalResults.length,
        searchTime: Date.now() - startTime,
        lastSearch: new Date()
      })

      // Adicionar à história de busca
      if (query.trim()) {
        const newHistoryItem: SearchHistory = {
          id: Date.now().toString(),
          query: query.trim(),
          timestamp: new Date(),
          resultsCount: finalResults.length
        }
        setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 9)])
      }

    } catch (error) {
      console.error('Erro na busca:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'user': return '👤'
      case 'post': return '📝'
      case 'comment': return '💬'
      case 'order': return '🛒'
      case 'report': return '📊'
      case 'log': return '📋'
      case 'setting': return '⚙️'
      default: return '📄'
    }
  }

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'user': return 'bg-blue-500'
      case 'post': return 'bg-green-500'
      case 'comment': return 'bg-purple-500'
      case 'order': return 'bg-yellow-500'
      case 'report': return 'bg-indigo-500'
      case 'log': return 'bg-red-500'
      case 'setting': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'completed': return 'text-blue-400'
      case 'error': return 'text-red-400'
      case 'inactive': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const SearchResultCard = ({ result }: { result: SearchResult }) => (
    <div 
      className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer hover:shadow-lg"
      onClick={() => setSelectedResult(result)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start">
          <div className={`w-8 h-8 rounded-lg ${getTypeColor(result.type)} flex items-center justify-center mr-3 flex-shrink-0`}>
            <span className="text-white text-sm">{getTypeIcon(result.type)}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{result.title}</h3>
            <p className="text-gray-300 text-sm mb-2">{result.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span className="capitalize">{result.type}</span>
              {result.timestamp && (
                <span>{result.timestamp.toLocaleString('pt-BR')}</span>
              )}
              {result.metadata?.status && (
                <span className={getStatusColor(result.metadata.status)}>
                  {result.metadata.status}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">{result.relevance}%</span>
          <div className="w-16 bg-gray-700 rounded-full h-1">
            <div 
              className="bg-blue-500 h-1 rounded-full"
              style={{ width: `${result.relevance}%` }}
            />
          </div>
        </div>
      </div>

      {result.metadata?.tags && result.metadata.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {result.metadata.tags.map((tag, index) => (
            <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )

  const SuggestionItem = ({ suggestion }: { suggestion: SearchSuggestion }) => (
    <button
      onClick={() => setSearchQuery(suggestion.text)}
      className="w-full text-left p-3 hover:bg-gray-700 rounded-lg transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="text-gray-300">{suggestion.text}</span>
        <div className="flex items-center space-x-2">
          {suggestion.count && (
            <span className="text-xs text-gray-400">{suggestion.count}</span>
          )}
          <span className={`px-2 py-1 rounded text-xs ${
            suggestion.type === 'recent' ? 'bg-blue-500' :
            suggestion.type === 'popular' ? 'bg-green-500' :
            'bg-gray-500'
          }`}>
            {suggestion.type}
          </span>
        </div>
      </div>
    </button>
  )

  const HistoryItem = ({ history }: { history: SearchHistory }) => (
    <button
      onClick={() => setSearchQuery(history.query)}
      className="w-full text-left p-3 hover:bg-gray-700 rounded-lg transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="text-gray-300">{history.query}</span>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span>{history.resultsCount} resultados</span>
          <span>{history.timestamp.toLocaleString('pt-BR')}</span>
        </div>
      </div>
    </button>
  )

  const FilterSection = () => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Filtros de Busca</h3>
      
      <div className="space-y-4">
        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
          <div className="flex flex-wrap gap-2">
            {['user', 'post', 'comment', 'order', 'report', 'log', 'setting'].map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.type.includes(type)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({ ...prev, type: [...prev.type, type] }))
                    } else {
                      setFilters(prev => ({ ...prev, type: prev.type.filter(t => t !== type) }))
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-gray-300 text-sm capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <div className="flex flex-wrap gap-2">
            {['active', 'pending', 'completed', 'error', 'inactive'].map(status => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({ ...prev, status: [...prev.status, status] }))
                    } else {
                      setFilters(prev => ({ ...prev, status: prev.status.filter(s => s !== status) }))
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-gray-300 text-sm capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Período */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Período</label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="all">Todos</option>
            <option value="today">Hoje</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mês</option>
            <option value="year">Este ano</option>
          </select>
        </div>

        <button
          onClick={() => setFilters({ type: [], dateRange: 'all', status: [], category: [], priority: [] })}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
        >
          🔄 Limpar Filtros
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🔍 Busca Avançada</h1>
          <p className="text-gray-400">Encontre qualquer coisa no sistema rapidamente</p>
        </div>

        {/* Barra de Busca */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="relative">
            <div className="flex items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Digite sua busca... (usuários, posts, logs, configurações)"
                  className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 pr-12 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  ) : (
                    <span className="text-gray-400">🔍</span>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="ml-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors"
              >
                ⚙️ Filtros
              </button>
            </div>
          </div>

          {/* Estatísticas de Busca */}
          {searchStats.lastSearch && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
              <span>
                {searchStats.totalResults} resultados em {searchStats.searchTime}ms
              </span>
              <span>
                Última busca: {searchStats.lastSearch.toLocaleString('pt-BR')}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Sugestões */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Sugestões</h3>
              <div className="space-y-1">
                {suggestions.slice(0, 5).map(suggestion => (
                  <SuggestionItem key={suggestion.id} suggestion={suggestion} />
                ))}
              </div>
            </div>

            {/* Histórico */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Histórico</h3>
              <div className="space-y-1">
                {searchHistory.slice(0, 5).map(history => (
                  <HistoryItem key={history.id} history={history} />
                ))}
              </div>
            </div>

            {/* Filtros */}
            {showFilters && <FilterSection />}
          </div>

          {/* Resultados */}
          <div className="lg:col-span-3">
            {searchQuery.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    Resultados para "{searchQuery}"
                  </h2>
                  <span className="text-gray-400 text-sm">
                    {searchResults.length} resultados encontrados
                  </span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.map(result => (
                      <SearchResultCard key={result.id} result={result} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-white mb-2">Nenhum resultado encontrado</h3>
                    <p className="text-gray-400">Tente ajustar sua busca ou filtros</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">Comece sua busca</h3>
                <p className="text-gray-400 mb-6">Digite algo para encontrar usuários, posts, logs e mais</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="text-2xl mb-2">👥</div>
                    <h4 className="text-white font-medium mb-1">Usuários</h4>
                    <p className="text-gray-400 text-sm">Busque por nome, email ou ID</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="text-2xl mb-2">📝</div>
                    <h4 className="text-white font-medium mb-1">Posts</h4>
                    <p className="text-gray-400 text-sm">Encontre conteúdo por título ou categoria</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="text-2xl mb-2">📋</div>
                    <h4 className="text-white font-medium mb-1">Logs</h4>
                    <p className="text-gray-400 text-sm">Busque por erros ou eventos</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
