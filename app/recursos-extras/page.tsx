'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RecursosExtrasPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<'templates' | 'tools' | 'guides' | 'integrations'>('templates')

  const categories = [
    { id: 'templates', label: '📝 Templates', count: 25 },
    { id: 'tools', label: '🛠️ Ferramentas', count: 15 },
    { id: 'guides', label: '📚 Guias', count: 20 },
    { id: 'integrations', label: '🔌 Integrações', count: 10 }
  ]

  const templates = [
    {
      id: 'instagram-post',
      name: 'Post para Instagram',
      description: 'Template otimizado para posts do Instagram',
      category: 'Social Media',
      downloads: 1250,
      rating: 4.8,
      icon: '📱',
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 'linkedin-article',
      name: 'Artigo para LinkedIn',
      description: 'Template profissional para artigos do LinkedIn',
      category: 'Profissional',
      downloads: 890,
      rating: 4.9,
      icon: '💼',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'story-template',
      name: 'Story Template',
      description: 'Templates para stories do Instagram',
      category: 'Social Media',
      downloads: 2100,
      rating: 4.7,
      icon: '📸',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'email-template',
      name: 'Email Marketing',
      description: 'Templates para campanhas de email',
      category: 'Marketing',
      downloads: 750,
      rating: 4.6,
      icon: '📧',
      color: 'from-green-500 to-teal-500'
    }
  ]

  const tools = [
    {
      id: 'hashtag-generator',
      name: 'Gerador de Hashtags',
      description: 'Gere hashtags relevantes automaticamente',
      category: 'Automação',
      usage: 3200,
      rating: 4.8,
      icon: '🏷️',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'content-scheduler',
      name: 'Agendador de Conteúdo',
      description: 'Agende posts em múltiplas plataformas',
      category: 'Produtividade',
      usage: 1800,
      rating: 4.9,
      icon: '📅',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'analytics-dashboard',
      name: 'Dashboard de Analytics',
      description: 'Analise performance dos seus conteúdos',
      category: 'Analytics',
      usage: 2500,
      rating: 4.7,
      icon: '📊',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'ai-writer',
      name: 'Escritor IA',
      description: 'Gere conteúdo usando inteligência artificial',
      category: 'IA',
      usage: 1500,
      rating: 4.5,
      icon: '🤖',
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  const guides = [
    {
      id: 'content-strategy',
      name: 'Estratégia de Conteúdo',
      description: 'Guia completo para criar estratégias eficazes',
      category: 'Estratégia',
      views: 5600,
      rating: 4.9,
      icon: '🎯',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'social-media-tips',
      name: 'Dicas de Redes Sociais',
      description: '100 dicas para dominar as redes sociais',
      category: 'Social Media',
      views: 4200,
      rating: 4.8,
      icon: '💡',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'branding-guide',
      name: 'Guia de Branding',
      description: 'Como construir uma marca forte',
      category: 'Branding',
      views: 3800,
      rating: 4.7,
      icon: '🎨',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'growth-hacking',
      name: 'Growth Hacking',
      description: 'Técnicas para acelerar o crescimento',
      category: 'Crescimento',
      views: 3100,
      rating: 4.6,
      icon: '🚀',
      color: 'from-green-500 to-blue-500'
    }
  ]

  const integrations = [
    {
      id: 'canva-integration',
      name: 'Integração Canva',
      description: 'Conecte diretamente com o Canva',
      category: 'Design',
      users: 2800,
      rating: 4.8,
      icon: '🎨',
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'buffer-integration',
      name: 'Integração Buffer',
      description: 'Agende posts através do Buffer',
      category: 'Social Media',
      users: 1900,
      rating: 4.7,
      icon: '📱',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Conecte com Google Analytics',
      category: 'Analytics',
      users: 3200,
      rating: 4.9,
      icon: '📊',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'mailchimp-integration',
      name: 'Integração Mailchimp',
      description: 'Conecte com Mailchimp para email marketing',
      category: 'Email Marketing',
      users: 1500,
      rating: 4.6,
      icon: '📧',
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  const getCurrentResources = () => {
    switch (activeCategory) {
      case 'templates': return templates
      case 'tools': return tools
      case 'guides': return guides
      case 'integrations': return integrations
      default: return []
    }
  }

  const getResourceStats = (resource: any) => {
    switch (activeCategory) {
      case 'templates': return `${resource.downloads} downloads`
      case 'tools': return `${resource.usage} usos`
      case 'guides': return `${resource.views} visualizações`
      case 'integrations': return `${resource.users} usuários`
      default: return ''
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button
                  onClick={() => router.back()}
                  className="mr-4 p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                >
                  <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                </button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    🛠️ Recursos Extras
                  </h1>
                  <p className="text-gray-600 mt-1">Biblioteca completa de templates, ferramentas e guias</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Templates</h3>
                  <p className="text-3xl font-bold text-gray-900">25</p>
                </div>
                <div className="text-3xl text-blue-500">📝</div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Ferramentas</h3>
                  <p className="text-3xl font-bold text-gray-900">15</p>
                </div>
                <div className="text-3xl text-green-500">🛠️</div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Guias</h3>
                  <p className="text-3xl font-bold text-gray-900">20</p>
                </div>
                <div className="text-3xl text-purple-500">📚</div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Integrações</h3>
                  <p className="text-3xl font-bold text-gray-900">10</p>
                </div>
                <div className="text-3xl text-orange-500">🔌</div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
            <div className="flex border-b border-gray-200">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as any)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category.label}
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeCategory === category.id ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCurrentResources().map((resource) => (
              <div key={resource.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${resource.color} flex items-center justify-center text-2xl text-white`}>
                    {resource.icon}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm font-medium text-gray-700">{resource.rating}</span>
                    </div>
                    <div className="text-xs text-gray-500">{getResourceStats(resource)}</div>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {resource.category}
                  </span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Usar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {getCurrentResources().length === 0 && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
              <div className="text-6xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum recurso encontrado</h3>
              <p className="text-gray-600">Esta categoria ainda não possui recursos disponíveis.</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}