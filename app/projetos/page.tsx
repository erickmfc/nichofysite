'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface Project {
  id: string
  title: string
  description: string
  category: string
  status: 'Ativo' | 'Pausado' | 'Concluído' | 'Rascunho'
  createdAt: string
  lastModified: string
  postsCount: number
  color: string
  icon: string
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Campanha Dia dos Pais',
    description: 'Conteúdo especial para o Dia dos Pais com foco em produtos masculinos',
    category: 'Marketing',
    status: 'Ativo',
    createdAt: '2024-01-15',
    lastModified: '2024-01-20',
    postsCount: 12,
    color: 'from-blue-500 to-cyan-500',
    icon: '👨‍👧‍👦'
  },
  {
    id: '2',
    title: 'Série Educativa - Saúde Mental',
    description: 'Posts educativos sobre bem-estar mental e autocuidado',
    category: 'Educativo',
    status: 'Ativo',
    createdAt: '2024-01-10',
    lastModified: '2024-01-18',
    postsCount: 8,
    color: 'from-green-500 to-emerald-500',
    icon: '🧠'
  },
  {
    id: '3',
    title: 'Promoção Black Friday',
    description: 'Conteúdo promocional para a Black Friday com ofertas especiais',
    category: 'Comercial',
    status: 'Concluído',
    createdAt: '2023-11-20',
    lastModified: '2023-11-30',
    postsCount: 25,
    color: 'from-orange-500 to-red-500',
    icon: '🛍️'
  },
  {
    id: '4',
    title: 'Tutorial de Receitas',
    description: 'Série de posts com receitas fáceis e rápidas',
    category: 'Educativo',
    status: 'Pausado',
    createdAt: '2024-01-05',
    lastModified: '2024-01-12',
    postsCount: 6,
    color: 'from-yellow-500 to-orange-500',
    icon: '👨‍🍳'
  },
  {
    id: '5',
    title: 'Dicas de Fitness',
    description: 'Conteúdo motivacional e dicas de exercícios',
    category: 'Saúde',
    status: 'Rascunho',
    createdAt: '2024-01-22',
    lastModified: '2024-01-22',
    postsCount: 3,
    color: 'from-purple-500 to-pink-500',
    icon: '💪'
  }
]

export default function ProjetosPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))]
  const statuses = ['all', ...Array.from(new Set(projects.map(p => p.status)))]

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800'
      case 'Pausado': return 'bg-yellow-100 text-yellow-800'
      case 'Concluído': return 'bg-blue-100 text-blue-800'
      case 'Rascunho': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ativo': return '🟢'
      case 'Pausado': return '🟡'
      case 'Concluído': return '🔵'
      case 'Rascunho': return '⚪'
      default: return '⚪'
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header com Menu de Navegação */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
                
                {/* Menu de Navegação */}
                <nav className="hidden md:flex space-x-6">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    📊 Dashboard
                  </button>
                  <button
                    onClick={() => router.push('/projetos')}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors border-b-2 border-blue-600 pb-1"
                  >
                    📁 Projetos
                  </button>
                  <button
                    onClick={() => router.push('/meu-conteudo')}
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    📚 Meus Posts
                  </button>
                  <button
                    onClick={() => router.push('/templates')}
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    📋 Templates
                  </button>
                  <button
                    onClick={() => router.push('/nichos')}
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    🎯 Nichos
                  </button>
                </nav>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/criar-projeto')}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  + Novo Projeto
                </button>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm">
                    {user?.displayName || user?.email?.split('@')[0] || 'Usuário'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Menu Mobile */}
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex space-x-4 overflow-x-auto">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900 font-medium text-sm whitespace-nowrap transition-colors"
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => router.push('/projetos')}
                className="text-blue-600 font-medium text-sm whitespace-nowrap border-b-2 border-blue-600 pb-1"
              >
                📁 Projetos
              </button>
              <button
                onClick={() => router.push('/meu-conteudo')}
                className="text-gray-600 hover:text-gray-900 font-medium text-sm whitespace-nowrap transition-colors"
              >
                📚 Posts
              </button>
              <button
                onClick={() => router.push('/templates')}
                className="text-gray-600 hover:text-gray-900 font-medium text-sm whitespace-nowrap transition-colors"
              >
                📋 Templates
              </button>
              <button
                onClick={() => router.push('/nichos')}
                className="text-gray-600 hover:text-gray-900 font-medium text-sm whitespace-nowrap transition-colors"
              >
                🎯 Nichos
              </button>
            </div>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
              <div className="text-sm text-gray-600">Total de Projetos</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.status === 'Ativo').length}
              </div>
              <div className="text-sm text-gray-600">Projetos Ativos</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-orange-600">
                {projects.reduce((acc, p) => acc + p.postsCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Posts Criados</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">
                {categories.length - 1}
              </div>
              <div className="text-sm text-gray-600">Categorias</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Busca */}
            <div className="w-full md:w-96">
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Filtros */}
            <div className="flex gap-2 flex-wrap">
              {/* Filtro de categoria */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Todas as categorias' : category}
                  </option>
                ))}
              </select>
              
              {/* Filtro de status */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Todos os status' : status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid de Projetos */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando seu primeiro projeto!'
                }
              </p>
              <button
                onClick={() => router.push('/criar-projeto')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Criar Primeiro Projeto
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                >
                  {/* Header com gradiente */}
                  <div className={`h-24 bg-gradient-to-r ${project.color} relative`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-4 left-4">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <span className="text-xl">{project.icon}</span>
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)} {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="bg-gray-100 px-2 py-1 rounded-full">
                        {project.category}
                      </span>
                      <span>{project.postsCount} posts</span>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-4">
                      <div>Criado em: {new Date(project.createdAt).toLocaleDateString('pt-BR')}</div>
                      <div>Modificado em: {new Date(project.lastModified).toLocaleDateString('pt-BR')}</div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => router.push(`/projeto/${project.id}`)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                      >
                        👁️ Ver Projeto
                      </Button>
                      <Button
                        onClick={() => router.push(`/projeto/${project.id}/editar`)}
                        variant="outline"
                        className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        ✏️ Editar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
