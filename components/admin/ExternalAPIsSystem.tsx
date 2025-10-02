'use client'

import { useState, useEffect } from 'react'

interface ApiIntegration {
  id: string
  name: string
  description: string
  provider: string
  category: 'social' | 'payment' | 'analytics' | 'storage' | 'email' | 'sms' | 'ai' | 'other'
  status: 'active' | 'inactive' | 'error' | 'pending'
  apiKey?: string
  apiSecret?: string
  webhookUrl?: string
  lastSync?: Date
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual'
  config: {
    endpoint: string
    version: string
    timeout: number
    retries: number
    rateLimit: number
  }
  metrics: {
    totalCalls: number
    successRate: number
    avgResponseTime: number
    lastCall?: Date
    errorsToday: number
  }
  createdAt: Date
  updatedAt: Date
}

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  status: 'active' | 'inactive' | 'error'
  secret?: string
  lastTriggered?: Date
  successCount: number
  errorCount: number
  createdAt: Date
}

interface ApiLog {
  id: string
  integrationId: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: string
  statusCode: number
  responseTime: number
  timestamp: Date
  success: boolean
  errorMessage?: string
  requestData?: any
  responseData?: any
}

interface ApiProvider {
  id: string
  name: string
  description: string
  category: string
  logo: string
  documentation: string
  pricing: string
  features: string[]
  isPopular: boolean
}

export const ExternalAPIsSystem = () => {
  const [integrations, setIntegrations] = useState<ApiIntegration[]>([])
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [apiLogs, setApiLogs] = useState<ApiLog[]>([])
  const [providers, setProviders] = useState<ApiProvider[]>([])
  const [activeTab, setActiveTab] = useState<'integrations' | 'webhooks' | 'logs' | 'providers'>('integrations')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateIntegration, setShowCreateIntegration] = useState(false)
  const [showCreateWebhook, setShowCreateWebhook] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<ApiIntegration | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Carregar integrações
      loadIntegrations()
      
      // Carregar webhooks
      loadWebhooks()
      
      // Carregar logs
      loadApiLogs()
      
      // Carregar provedores
      loadProviders()
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadIntegrations = () => {
    const mockIntegrations: ApiIntegration[] = [
      {
        id: '1',
        name: 'Google Analytics',
        description: 'Integração com Google Analytics para métricas de site',
        provider: 'Google',
        category: 'analytics',
        status: 'active',
        apiKey: 'ga_****_****',
        webhookUrl: 'https://api.nichofy.com/webhooks/google-analytics',
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
        syncFrequency: 'hourly',
        config: {
          endpoint: 'https://analytics.googleapis.com/analytics/v3',
          version: 'v3',
          timeout: 30,
          retries: 3,
          rateLimit: 1000
        },
        metrics: {
          totalCalls: 15420,
          successRate: 98.5,
          avgResponseTime: 245,
          lastCall: new Date(Date.now() - 30 * 60 * 1000),
          errorsToday: 2
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Stripe Payment',
        description: 'Processamento de pagamentos via Stripe',
        provider: 'Stripe',
        category: 'payment',
        status: 'active',
        apiKey: 'sk_****_****',
        lastSync: new Date(Date.now() - 1 * 60 * 60 * 1000),
        syncFrequency: 'realtime',
        config: {
          endpoint: 'https://api.stripe.com/v1',
          version: 'v1',
          timeout: 15,
          retries: 2,
          rateLimit: 100
        },
        metrics: {
          totalCalls: 8920,
          successRate: 99.8,
          avgResponseTime: 180,
          lastCall: new Date(Date.now() - 5 * 60 * 1000),
          errorsToday: 0
        },
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Facebook API',
        description: 'Integração com Facebook para compartilhamento social',
        provider: 'Facebook',
        category: 'social',
        status: 'error',
        apiKey: 'fb_****_****',
        lastSync: new Date(Date.now() - 6 * 60 * 60 * 1000),
        syncFrequency: 'daily',
        config: {
          endpoint: 'https://graph.facebook.com/v18.0',
          version: 'v18.0',
          timeout: 20,
          retries: 3,
          rateLimit: 200
        },
        metrics: {
          totalCalls: 3240,
          successRate: 85.2,
          avgResponseTime: 320,
          lastCall: new Date(Date.now() - 6 * 60 * 60 * 1000),
          errorsToday: 15
        },
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        name: 'OpenAI API',
        description: 'Integração com OpenAI para geração de conteúdo',
        provider: 'OpenAI',
        category: 'ai',
        status: 'active',
        apiKey: 'sk-****_****',
        lastSync: new Date(Date.now() - 15 * 60 * 1000),
        syncFrequency: 'realtime',
        config: {
          endpoint: 'https://api.openai.com/v1',
          version: 'v1',
          timeout: 60,
          retries: 2,
          rateLimit: 50
        },
        metrics: {
          totalCalls: 1890,
          successRate: 96.8,
          avgResponseTime: 1200,
          lastCall: new Date(Date.now() - 15 * 60 * 1000),
          errorsToday: 1
        },
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]
    setIntegrations(mockIntegrations)
  }

  const loadWebhooks = () => {
    const mockWebhooks: Webhook[] = [
      {
        id: '1',
        name: 'Payment Webhook',
        url: 'https://api.nichofy.com/webhooks/stripe',
        events: ['payment.succeeded', 'payment.failed', 'subscription.updated'],
        status: 'active',
        secret: 'whsec_****',
        lastTriggered: new Date(Date.now() - 30 * 60 * 1000),
        successCount: 245,
        errorCount: 3,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'User Registration Webhook',
        url: 'https://api.nichofy.com/webhooks/user-registration',
        events: ['user.created', 'user.updated'],
        status: 'active',
        secret: 'whsec_****',
        lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
        successCount: 89,
        errorCount: 1,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Content Webhook',
        url: 'https://api.nichofy.com/webhooks/content',
        events: ['post.created', 'post.updated', 'post.deleted'],
        status: 'inactive',
        secret: 'whsec_****',
        lastTriggered: new Date(Date.now() - 24 * 60 * 60 * 1000),
        successCount: 156,
        errorCount: 8,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      }
    ]
    setWebhooks(mockWebhooks)
  }

  const loadApiLogs = () => {
    const mockLogs: ApiLog[] = [
      {
        id: '1',
        integrationId: '1',
        method: 'GET',
        endpoint: '/analytics/v3/data/ga',
        statusCode: 200,
        responseTime: 245,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        success: true,
        requestData: { metrics: 'ga:sessions', startDate: '2024-01-01' },
        responseData: { rows: [['1500']] }
      },
      {
        id: '2',
        integrationId: '2',
        method: 'POST',
        endpoint: '/v1/payment_intents',
        statusCode: 201,
        responseTime: 180,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        success: true,
        requestData: { amount: 9999, currency: 'usd' },
        responseData: { id: 'pi_123', status: 'requires_payment_method' }
      },
      {
        id: '3',
        integrationId: '3',
        method: 'POST',
        endpoint: '/v18.0/me/feed',
        statusCode: 400,
        responseTime: 320,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        success: false,
        errorMessage: 'Invalid access token',
        requestData: { message: 'Check out this post!' }
      },
      {
        id: '4',
        integrationId: '4',
        method: 'POST',
        endpoint: '/v1/chat/completions',
        statusCode: 200,
        responseTime: 1200,
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        success: true,
        requestData: { model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: 'Hello' }] },
        responseData: { choices: [{ message: { content: 'Hello! How can I help you?' } }] }
      }
    ]
    setApiLogs(mockLogs)
  }

  const loadProviders = () => {
    const mockProviders: ApiProvider[] = [
      {
        id: 'google',
        name: 'Google',
        description: 'APIs do Google para Analytics, Maps, Drive e mais',
        category: 'analytics',
        logo: '🔍',
        documentation: 'https://developers.google.com',
        pricing: 'Freemium',
        features: ['Analytics', 'Maps', 'Drive', 'Gmail', 'Calendar'],
        isPopular: true
      },
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Plataforma de pagamentos online',
        category: 'payment',
        logo: '💳',
        documentation: 'https://stripe.com/docs',
        pricing: '2.9% + $0.30 por transação',
        features: ['Pagamentos', 'Assinaturas', 'Marketplace', 'Fraud Detection'],
        isPopular: true
      },
      {
        id: 'facebook',
        name: 'Facebook',
        description: 'APIs do Facebook para redes sociais',
        category: 'social',
        logo: '📘',
        documentation: 'https://developers.facebook.com',
        pricing: 'Gratuito',
        features: ['Login', 'Sharing', 'Marketing', 'Analytics'],
        isPopular: true
      },
      {
        id: 'openai',
        name: 'OpenAI',
        description: 'Inteligência artificial para geração de conteúdo',
        category: 'ai',
        logo: '🤖',
        documentation: 'https://platform.openai.com/docs',
        pricing: 'Por token usado',
        features: ['GPT', 'DALL-E', 'Whisper', 'Embeddings'],
        isPopular: true
      },
      {
        id: 'aws',
        name: 'Amazon Web Services',
        description: 'Serviços em nuvem da Amazon',
        category: 'storage',
        logo: '☁️',
        documentation: 'https://docs.aws.amazon.com',
        pricing: 'Pay-as-you-go',
        features: ['S3', 'Lambda', 'SNS', 'SES', 'RDS'],
        isPopular: true
      },
      {
        id: 'twilio',
        name: 'Twilio',
        description: 'Comunicação via SMS, voz e vídeo',
        category: 'sms',
        logo: '📱',
        documentation: 'https://www.twilio.com/docs',
        pricing: 'Por mensagem/envio',
        features: ['SMS', 'Voice', 'Video', 'WhatsApp'],
        isPopular: false
      }
    ]
    setProviders(mockProviders)
  }

  const testIntegration = async (integrationId: string) => {
    try {
      const integration = integrations.find(i => i.id === integrationId)
      if (!integration) return

      // Simular teste de integração
      console.log(`Testando integração: ${integration.name}`)
      
      // Atualizar status temporariamente
      setIntegrations(prev => prev.map(i => 
        i.id === integrationId ? { ...i, status: 'pending' } : i
      ))

      // Simular delay
      setTimeout(() => {
        setIntegrations(prev => prev.map(i => 
          i.id === integrationId ? { 
            ...i, 
            status: 'active',
            lastSync: new Date(),
            metrics: {
              ...i.metrics,
              lastCall: new Date()
            }
          } : i
        ))
      }, 2000)

    } catch (error) {
      console.error('Erro ao testar integração:', error)
      setIntegrations(prev => prev.map(i => 
        i.id === integrationId ? { ...i, status: 'error' } : i
      ))
    }
  }

  const toggleIntegration = async (integrationId: string) => {
    setIntegrations(prev => prev.map(i => 
      i.id === integrationId 
        ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' }
        : i
    ))
  }

  const IntegrationCard = ({ integration }: { integration: ApiIntegration }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{integration.name}</h3>
          <p className="text-gray-300 text-sm mb-2">{integration.description}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span>Provedor: {integration.provider}</span>
            <span>Sincronização: {integration.syncFrequency}</span>
            {integration.lastSync && (
              <span>Última sync: {integration.lastSync.toLocaleString('pt-BR')}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            integration.category === 'analytics' ? 'bg-blue-500' :
            integration.category === 'payment' ? 'bg-green-500' :
            integration.category === 'social' ? 'bg-purple-500' :
            integration.category === 'ai' ? 'bg-orange-500' :
            integration.category === 'storage' ? 'bg-yellow-500' :
            integration.category === 'email' ? 'bg-red-500' :
            integration.category === 'sms' ? 'bg-pink-500' :
            'bg-gray-500'
          }`}>
            {integration.category}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            integration.status === 'active' ? 'bg-green-500' :
            integration.status === 'inactive' ? 'bg-gray-500' :
            integration.status === 'error' ? 'bg-red-500' :
            'bg-yellow-500'
          }`}>
            {integration.status}
          </span>
        </div>
      </div>

      <div className="mb-4 p-3 bg-gray-700 rounded-lg">
        <h4 className="text-gray-300 font-medium mb-2">Métricas:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Total de Chamadas:</span>
            <span className="text-white ml-2">{integration.metrics.totalCalls.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-400">Taxa de Sucesso:</span>
            <span className="text-white ml-2">{integration.metrics.successRate}%</span>
          </div>
          <div>
            <span className="text-gray-400">Tempo Médio:</span>
            <span className="text-white ml-2">{integration.metrics.avgResponseTime}ms</span>
          </div>
          <div>
            <span className="text-gray-400">Erros Hoje:</span>
            <span className="text-white ml-2">{integration.metrics.errorsToday}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => testIntegration(integration.id)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          🧪 Testar
        </button>
        <button
          onClick={() => toggleIntegration(integration.id)}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            integration.status === 'active'
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {integration.status === 'active' ? '⏸️ Pausar' : '▶️ Ativar'}
        </button>
        <button
          onClick={() => setSelectedIntegration(integration)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          ⚙️ Configurar
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
          🗑️ Remover
        </button>
      </div>
    </div>
  )

  const WebhookCard = ({ webhook }: { webhook: Webhook }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{webhook.name}</h3>
          <p className="text-gray-300 text-sm mb-2 break-all">{webhook.url}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span>Eventos: {webhook.events.length}</span>
            {webhook.lastTriggered && (
              <span>Último disparo: {webhook.lastTriggered.toLocaleString('pt-BR')}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            webhook.status === 'active' ? 'bg-green-500' :
            webhook.status === 'inactive' ? 'bg-gray-500' :
            'bg-red-500'
          }`}>
            {webhook.status}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-gray-300 font-medium mb-2">Eventos:</h4>
        <div className="flex flex-wrap gap-2">
          {webhook.events.map(event => (
            <span key={event} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
              {event}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4 p-3 bg-gray-700 rounded-lg">
        <h4 className="text-gray-300 font-medium mb-2">Estatísticas:</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Sucessos:</span>
            <span className="text-green-400 ml-2">{webhook.successCount}</span>
          </div>
          <div>
            <span className="text-gray-400">Erros:</span>
            <span className="text-red-400 ml-2">{webhook.errorCount}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
          🧪 Testar
        </button>
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors">
          ✏️ Editar
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
          🗑️ Remover
        </button>
      </div>
    </div>
  )

  const ProviderCard = ({ provider }: { provider: ApiProvider }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-3">{provider.logo}</span>
            <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
            {provider.isPopular && (
              <span className="ml-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium">
                Popular
              </span>
            )}
          </div>
          <p className="text-gray-300 text-sm mb-2">{provider.description}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span>Categoria: {provider.category}</span>
            <span>Preço: {provider.pricing}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-gray-300 font-medium mb-2">Recursos:</h4>
        <div className="flex flex-wrap gap-2">
          {provider.features.map(feature => (
            <span key={feature} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
              {feature}
            </span>
          ))}
        </div>
      </div>

      <div className="flex space-x-2">
        <a
          href={provider.documentation}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          📚 Documentação
        </a>
        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
          ➕ Integrar
        </button>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Carregando APIs</h2>
          <p className="text-gray-400">Buscando integrações e webhooks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">🔌 Integração com APIs Externas</h1>
            <p className="text-gray-400">Gerencie integrações, webhooks e APIs de terceiros</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateIntegration(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ➕ Nova Integração
            </button>
            <button
              onClick={() => setShowCreateWebhook(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ➕ Novo Webhook
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'integrations'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            🔌 Integrações
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'webhooks'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            🪝 Webhooks
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'logs'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📋 Logs
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'providers'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            🏢 Provedores
          </button>
        </div>

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Integrações Ativas</h2>
              <div className="text-gray-400 text-sm">
                {integrations.length} integrações • {integrations.filter(i => i.status === 'active').length} ativas
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {integrations.map(integration => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>

            {integrations.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔌</div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhuma integração encontrada</h3>
                <p className="text-gray-400">Conecte-se com APIs externas</p>
              </div>
            )}
          </div>
        )}

        {/* Webhooks Tab */}
        {activeTab === 'webhooks' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Webhooks Configurados</h2>
              <div className="text-gray-400 text-sm">
                {webhooks.length} webhooks • {webhooks.filter(w => w.status === 'active').length} ativos
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {webhooks.map(webhook => (
                <WebhookCard key={webhook.id} webhook={webhook} />
              ))}
            </div>

            {webhooks.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🪝</div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum webhook encontrado</h3>
                <p className="text-gray-400">Configure webhooks para receber notificações</p>
              </div>
            )}
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Logs de API</h2>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-gray-300 py-2">Timestamp</th>
                      <th className="text-left text-gray-300 py-2">Integração</th>
                      <th className="text-left text-gray-300 py-2">Método</th>
                      <th className="text-left text-gray-300 py-2">Endpoint</th>
                      <th className="text-left text-gray-300 py-2">Status</th>
                      <th className="text-left text-gray-300 py-2">Tempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiLogs.map(log => (
                      <tr key={log.id} className="border-b border-gray-700">
                        <td className="text-gray-400 py-2">{log.timestamp.toLocaleString('pt-BR')}</td>
                        <td className="text-white py-2">{integrations.find(i => i.id === log.integrationId)?.name}</td>
                        <td className="text-white py-2">{log.method}</td>
                        <td className="text-white py-2">{log.endpoint}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            log.success ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            {log.statusCode}
                          </span>
                        </td>
                        <td className="text-white py-2">{log.responseTime}ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Providers Tab */}
        {activeTab === 'providers' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Provedores de API</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map(provider => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </div>
        )}

        {/* Create Integration Modal */}
        {showCreateIntegration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Nova Integração</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Provedor</label>
                  <select className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                    <option value="">Selecione um provedor</option>
                    {providers.map(provider => (
                      <option key={provider.id} value={provider.id}>{provider.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                  <input
                    type="text"
                    placeholder="Nome da integração"
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                  <textarea
                    placeholder="Descrição da integração"
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
                  <input
                    type="password"
                    placeholder="Sua API Key"
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">API Secret</label>
                  <input
                    type="password"
                    placeholder="Sua API Secret"
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowCreateIntegration(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowCreateIntegration(false)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  Criar Integração
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
