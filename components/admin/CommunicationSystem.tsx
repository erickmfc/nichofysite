'use client'

import { useState, useEffect } from 'react'

interface Message {
  id: string
  type: 'email' | 'sms' | 'push' | 'in_app'
  subject: string
  content: string
  recipients: string[]
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  createdAt: Date
  scheduledAt?: Date
  sentAt?: Date
  template?: string
  metadata?: {
    openRate?: number
    clickRate?: number
    bounceRate?: number
    unsubscribeRate?: number
  }
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  variables: string[]
  category: 'welcome' | 'notification' | 'marketing' | 'transactional' | 'system'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface Campaign {
  id: string
  name: string
  description: string
  type: 'email' | 'sms' | 'push' | 'multi_channel'
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled'
  targetAudience: {
    segment: string
    criteria: any
    estimatedSize: number
  }
  schedule: {
    startDate: Date
    endDate?: Date
    frequency: 'once' | 'daily' | 'weekly' | 'monthly'
  }
  metrics: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    unsubscribed: number
    bounced: number
  }
  createdAt: Date
  updatedAt: Date
}

interface CommunicationSettings {
  email: {
    smtpEnabled: boolean
    smtpHost: string
    smtpPort: number
    smtpUser: string
    smtpPassword: string
    fromEmail: string
    fromName: string
    replyToEmail: string
    dailyLimit: number
    hourlyLimit: number
  }
  sms: {
    provider: 'twilio' | 'aws_sns' | 'custom'
    apiKey: string
    apiSecret: string
    fromNumber: string
    dailyLimit: number
    hourlyLimit: number
  }
  push: {
    enabled: boolean
    firebaseKey: string
    iosCertificate: string
    androidKey: string
  }
  general: {
    enableUnsubscribe: boolean
    unsubscribePage: string
    enableTracking: boolean
    enablePersonalization: boolean
    defaultLanguage: string
  }
}

export const CommunicationSystem = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [settings, setSettings] = useState<CommunicationSettings>({
    email: {
      smtpEnabled: true,
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'noreply@nichofy.com',
      smtpPassword: '',
      fromEmail: 'noreply@nichofy.com',
      fromName: 'NichoFy',
      replyToEmail: 'support@nichofy.com',
      dailyLimit: 10000,
      hourlyLimit: 1000
    },
    sms: {
      provider: 'twilio',
      apiKey: '',
      apiSecret: '',
      fromNumber: '+1234567890',
      dailyLimit: 1000,
      hourlyLimit: 100
    },
    push: {
      enabled: true,
      firebaseKey: '',
      iosCertificate: '',
      androidKey: ''
    },
    general: {
      enableUnsubscribe: true,
      unsubscribePage: '/unsubscribe',
      enableTracking: true,
      enablePersonalization: true,
      defaultLanguage: 'pt-BR'
    }
  })
  const [activeTab, setActiveTab] = useState<'messages' | 'templates' | 'campaigns' | 'settings'>('messages')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateMessage, setShowCreateMessage] = useState(false)
  const [showCreateTemplate, setShowCreateTemplate] = useState(false)
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Carregar mensagens
      loadMessages()
      
      // Carregar templates
      loadTemplates()
      
      // Carregar campanhas
      loadCampaigns()
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = () => {
    const mockMessages: Message[] = [
      {
        id: '1',
        type: 'email',
        subject: 'Bem-vindo ao NichoFy!',
        content: 'Olá {{name}}, obrigado por se cadastrar em nossa plataforma...',
        recipients: ['user1@example.com', 'user2@example.com'],
        status: 'sent',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        template: 'welcome',
        metadata: {
          openRate: 85.5,
          clickRate: 12.3,
          bounceRate: 2.1,
          unsubscribeRate: 0.5
        }
      },
      {
        id: '2',
        type: 'push',
        subject: 'Novo conteúdo disponível',
        content: 'Confira os novos posts em sua área de interesse!',
        recipients: ['user-123', 'user-456'],
        status: 'scheduled',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
        template: 'content_notification'
      },
      {
        id: '3',
        type: 'sms',
        subject: 'Código de verificação',
        content: 'Seu código de verificação é: {{code}}',
        recipients: ['+5511999999999'],
        status: 'sent',
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        sentAt: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: '4',
        type: 'email',
        subject: 'Relatório semanal',
        content: 'Confira seu relatório semanal de atividade...',
        recipients: ['admin@nichofy.com'],
        status: 'draft',
        createdAt: new Date(Date.now() - 10 * 60 * 1000)
      }
    ]
    setMessages(mockMessages)
  }

  const loadTemplates = () => {
    const mockTemplates: EmailTemplate[] = [
      {
        id: '1',
        name: 'Email de Boas-vindas',
        subject: 'Bem-vindo ao {{platformName}}!',
        content: `
          <h1>Olá {{userName}}!</h1>
          <p>Obrigado por se cadastrar em {{platformName}}.</p>
          <p>Comece explorando nossa plataforma e crie seu primeiro conteúdo!</p>
          <a href="{{dashboardUrl}}">Acessar Dashboard</a>
        `,
        variables: ['platformName', 'userName', 'dashboardUrl'],
        category: 'welcome',
        isActive: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Notificação de Novo Post',
        subject: 'Novo post em {{category}}',
        content: `
          <h2>Novo conteúdo disponível!</h2>
          <p>Um novo post foi publicado na categoria {{category}}.</p>
          <h3>{{postTitle}}</h3>
          <p>{{postExcerpt}}</p>
          <a href="{{postUrl}}">Ler Post</a>
        `,
        variables: ['category', 'postTitle', 'postExcerpt', 'postUrl'],
        category: 'notification',
        isActive: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Email de Marketing',
        subject: 'Oferta especial para você!',
        content: `
          <h1>Oferta Especial!</h1>
          <p>Olá {{userName}},</p>
          <p>Temos uma oferta especial para você: {{offerDescription}}</p>
          <p>Use o código {{discountCode}} e economize {{discountAmount}}!</p>
          <a href="{{offerUrl}}">Aproveitar Oferta</a>
        `,
        variables: ['userName', 'offerDescription', 'discountCode', 'discountAmount', 'offerUrl'],
        category: 'marketing',
        isActive: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]
    setTemplates(mockTemplates)
  }

  const loadCampaigns = () => {
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'Campanha de Boas-vindas',
        description: 'Email de boas-vindas para novos usuários',
        type: 'email',
        status: 'running',
        targetAudience: {
          segment: 'new_users',
          criteria: { registrationDate: 'last_7_days' },
          estimatedSize: 150
        },
        schedule: {
          startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          frequency: 'once'
        },
        metrics: {
          sent: 150,
          delivered: 147,
          opened: 125,
          clicked: 23,
          unsubscribed: 2,
          bounced: 3
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Newsletter Semanal',
        description: 'Newsletter com os melhores conteúdos da semana',
        type: 'email',
        status: 'scheduled',
        targetAudience: {
          segment: 'active_users',
          criteria: { lastLogin: 'last_30_days', subscription: 'active' },
          estimatedSize: 2500
        },
        schedule: {
          startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          frequency: 'weekly'
        },
        metrics: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          unsubscribed: 0,
          bounced: 0
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]
    setCampaigns(mockCampaigns)
  }

  const sendMessage = async (messageData: Partial<Message>) => {
    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: messageData.type || 'email',
        subject: messageData.subject || '',
        content: messageData.content || '',
        recipients: messageData.recipients || [],
        status: 'sending',
        createdAt: new Date()
      }
      
      setMessages(prev => [newMessage, ...prev])
      setShowCreateMessage(false)
      
      // Simular envio
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent', sentAt: new Date() }
            : msg
        ))
      }, 3000)
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    }
  }

  const createTemplate = async (templateData: Partial<EmailTemplate>) => {
    try {
      const newTemplate: EmailTemplate = {
        id: Date.now().toString(),
        name: templateData.name || 'Novo Template',
        subject: templateData.subject || '',
        content: templateData.content || '',
        variables: templateData.variables || [],
        category: templateData.category || 'notification',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setTemplates(prev => [newTemplate, ...prev])
      setShowCreateTemplate(false)
      
    } catch (error) {
      console.error('Erro ao criar template:', error)
    }
  }

  const createCampaign = async (campaignData: Partial<Campaign>) => {
    try {
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        name: campaignData.name || 'Nova Campanha',
        description: campaignData.description || '',
        type: campaignData.type || 'email',
        status: 'draft',
        targetAudience: campaignData.targetAudience || {
          segment: 'all_users',
          criteria: {},
          estimatedSize: 0
        },
        schedule: campaignData.schedule || {
          startDate: new Date(),
          frequency: 'once'
        },
        metrics: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          unsubscribed: 0,
          bounced: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setCampaigns(prev => [newCampaign, ...prev])
      setShowCreateCampaign(false)
      
    } catch (error) {
      console.error('Erro ao criar campanha:', error)
    }
  }

  const MessageCard = ({ message }: { message: Message }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{message.subject}</h3>
          <p className="text-gray-300 text-sm mb-2 line-clamp-2">{message.content}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span>Criado: {message.createdAt.toLocaleString('pt-BR')}</span>
            <span>Destinatários: {message.recipients.length}</span>
            {message.sentAt && (
              <span>Enviado: {message.sentAt.toLocaleString('pt-BR')}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            message.type === 'email' ? 'bg-blue-500' :
            message.type === 'sms' ? 'bg-green-500' :
            message.type === 'push' ? 'bg-purple-500' :
            'bg-orange-500'
          }`}>
            {message.type}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            message.status === 'sent' ? 'bg-green-500' :
            message.status === 'sending' ? 'bg-blue-500' :
            message.status === 'scheduled' ? 'bg-yellow-500' :
            message.status === 'failed' ? 'bg-red-500' :
            'bg-gray-500'
          }`}>
            {message.status}
          </span>
        </div>
      </div>

      {message.metadata && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <h4 className="text-gray-300 font-medium mb-2">Métricas:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Taxa de Abertura:</span>
              <span className="text-white ml-2">{message.metadata.openRate}%</span>
            </div>
            <div>
              <span className="text-gray-400">Taxa de Clique:</span>
              <span className="text-white ml-2">{message.metadata.clickRate}%</span>
            </div>
            <div>
              <span className="text-gray-400">Taxa de Bounce:</span>
              <span className="text-white ml-2">{message.metadata.bounceRate}%</span>
            </div>
            <div>
              <span className="text-gray-400">Unsubscribe:</span>
              <span className="text-white ml-2">{message.metadata.unsubscribeRate}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        {message.status === 'draft' && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
            ✉️ Enviar
          </button>
        )}
        {message.status === 'scheduled' && (
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors">
            ⏰ Agendar
          </button>
        )}
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors">
          ✏️ Editar
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
          🗑️ Excluir
        </button>
      </div>
    </div>
  )

  const TemplateCard = ({ template }: { template: EmailTemplate }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
          <p className="text-gray-300 text-sm mb-2">{template.subject}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span>Criado: {template.createdAt.toLocaleDateString('pt-BR')}</span>
            <span>Variáveis: {template.variables.length}</span>
            <span>Atualizado: {template.updatedAt.toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            template.category === 'welcome' ? 'bg-green-500' :
            template.category === 'notification' ? 'bg-blue-500' :
            template.category === 'marketing' ? 'bg-purple-500' :
            template.category === 'transactional' ? 'bg-orange-500' :
            'bg-gray-500'
          }`}>
            {template.category}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            template.isActive ? 'bg-green-500' : 'bg-gray-500'
          }`}>
            {template.isActive ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>

      <div className="mb-4 p-3 bg-gray-700 rounded-lg">
        <h4 className="text-gray-300 font-medium mb-2">Variáveis Disponíveis:</h4>
        <div className="flex flex-wrap gap-2">
          {template.variables.map(variable => (
            <span key={variable} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
              {`{{${variable}}}`}
            </span>
          ))}
        </div>
      </div>

      <div className="flex space-x-2">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
          👁️ Visualizar
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
          ✏️ Editar
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors">
          📋 Usar
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
          🗑️ Excluir
        </button>
      </div>
    </div>
  )

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{campaign.name}</h3>
          <p className="text-gray-300 text-sm mb-2">{campaign.description}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span>Tipo: {campaign.type}</span>
            <span>Público: {campaign.targetAudience.estimatedSize}</span>
            <span>Criado: {campaign.createdAt.toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            campaign.type === 'email' ? 'bg-blue-500' :
            campaign.type === 'sms' ? 'bg-green-500' :
            campaign.type === 'push' ? 'bg-purple-500' :
            'bg-orange-500'
          }`}>
            {campaign.type}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            campaign.status === 'running' ? 'bg-green-500' :
            campaign.status === 'scheduled' ? 'bg-yellow-500' :
            campaign.status === 'completed' ? 'bg-blue-500' :
            campaign.status === 'paused' ? 'bg-orange-500' :
            campaign.status === 'cancelled' ? 'bg-red-500' :
            'bg-gray-500'
          }`}>
            {campaign.status}
          </span>
        </div>
      </div>

      <div className="mb-4 p-3 bg-gray-700 rounded-lg">
        <h4 className="text-gray-300 font-medium mb-2">Métricas:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Enviados:</span>
            <span className="text-white ml-2">{campaign.metrics.sent}</span>
          </div>
          <div>
            <span className="text-gray-400">Entregues:</span>
            <span className="text-white ml-2">{campaign.metrics.delivered}</span>
          </div>
          <div>
            <span className="text-gray-400">Abertos:</span>
            <span className="text-white ml-2">{campaign.metrics.opened}</span>
          </div>
          <div>
            <span className="text-gray-400">Cliques:</span>
            <span className="text-white ml-2">{campaign.metrics.clicked}</span>
          </div>
          <div>
            <span className="text-gray-400">Bounces:</span>
            <span className="text-white ml-2">{campaign.metrics.bounced}</span>
          </div>
          <div>
            <span className="text-gray-400">Unsubscribe:</span>
            <span className="text-white ml-2">{campaign.metrics.unsubscribed}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        {campaign.status === 'draft' && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
            ▶️ Iniciar
          </button>
        )}
        {campaign.status === 'running' && (
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm transition-colors">
            ⏸️ Pausar
          </button>
        )}
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors">
          ✏️ Editar
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors">
          📊 Relatório
        </button>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Carregando Comunicação</h2>
          <p className="text-gray-400">Buscando mensagens e campanhas...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">📧 Sistema de Comunicação</h1>
            <p className="text-gray-400">Gerencie emails, SMS, push notifications e campanhas</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateMessage(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ➕ Nova Mensagem
            </button>
            <button
              onClick={() => setShowCreateTemplate(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ➕ Novo Template
            </button>
            <button
              onClick={() => setShowCreateCampaign(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ➕ Nova Campanha
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'messages'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📧 Mensagens
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'templates'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📋 Templates
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'campaigns'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            🎯 Campanhas
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            ⚙️ Configurações
          </button>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Mensagens Enviadas</h2>
              <div className="text-gray-400 text-sm">
                {messages.length} mensagens • {messages.filter(m => m.status === 'sent').length} enviadas
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.map(message => (
                <MessageCard key={message.id} message={message} />
              ))}
            </div>

            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📧</div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhuma mensagem encontrada</h3>
                <p className="text-gray-400">Crie sua primeira mensagem</p>
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Templates de Email</h2>
              <div className="text-gray-400 text-sm">
                {templates.length} templates • {templates.filter(t => t.isActive).length} ativos
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>

            {templates.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum template encontrado</h3>
                <p className="text-gray-400">Crie seu primeiro template</p>
              </div>
            )}
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Campanhas de Marketing</h2>
              <div className="text-gray-400 text-sm">
                {campaigns.length} campanhas • {campaigns.filter(c => c.status === 'running').length} ativas
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaigns.map(campaign => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>

            {campaigns.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhuma campanha encontrada</h3>
                <p className="text-gray-400">Crie sua primeira campanha</p>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Configurações de Comunicação</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Configurações de Email</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Host</label>
                    <input
                      type="text"
                      value={settings.email.smtpHost}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, smtpHost: e.target.value }
                      }))}
                      className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Port</label>
                    <input
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, smtpPort: parseInt(e.target.value) }
                      }))}
                      className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Remetente</label>
                    <input
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, fromEmail: e.target.value }
                      }))}
                      className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Limite Diário</label>
                    <input
                      type="number"
                      value={settings.email.dailyLimit}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, dailyLimit: parseInt(e.target.value) }
                      }))}
                      className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Configurações de SMS</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Provedor</label>
                    <select
                      value={settings.sms.provider}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        sms: { ...prev.sms, provider: e.target.value as any }
                      }))}
                      className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="twilio">Twilio</option>
                      <option value="aws_sns">AWS SNS</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
                    <input
                      type="password"
                      value={settings.sms.apiKey}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        sms: { ...prev.sms, apiKey: e.target.value }
                      }))}
                      className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Número Remetente</label>
                    <input
                      type="text"
                      value={settings.sms.fromNumber}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        sms: { ...prev.sms, fromNumber: e.target.value }
                      }))}
                      className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Limite Diário</label>
                    <input
                      type="number"
                      value={settings.sms.dailyLimit}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        sms: { ...prev.sms, dailyLimit: parseInt(e.target.value) }
                      }))}
                      className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                💾 Salvar Configurações
              </button>
            </div>
          </div>
        )}

        {/* Create Message Modal */}
        {showCreateMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Nova Mensagem</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
                  <select className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push Notification</option>
                    <option value="in_app">In-App</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Assunto</label>
                  <input
                    type="text"
                    placeholder="Assunto da mensagem"
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Conteúdo</label>
                  <textarea
                    placeholder="Conteúdo da mensagem"
                    rows={6}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Destinatários</label>
                  <textarea
                    placeholder="Digite os emails/telefones separados por vírgula"
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowCreateMessage(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => sendMessage({})}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  Enviar Mensagem
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
