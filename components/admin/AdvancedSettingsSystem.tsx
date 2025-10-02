'use client'

import { useState, useEffect } from 'react'

interface SystemConfig {
  general: {
    siteName: string
    siteDescription: string
    siteUrl: string
    maintenanceMode: boolean
    allowRegistration: boolean
    requireEmailVerification: boolean
    defaultLanguage: string
    timezone: string
  }
  content: {
    maxPostLength: number
    maxImageSize: number
    allowedImageTypes: string[]
    autoApprovePosts: boolean
    moderationRequired: boolean
    maxPostsPerDay: number
    categories: string[]
  }
  security: {
    enableTwoFactor: boolean
    passwordMinLength: number
    sessionTimeout: number
    maxLoginAttempts: number
    enableRateLimiting: boolean
    allowedDomains: string[]
    blockedDomains: string[]
  }
  email: {
    smtpHost: string
    smtpPort: number
    smtpUser: string
    smtpPassword: string
    fromEmail: string
    fromName: string
    enableEmailNotifications: boolean
  }
  storage: {
    storageProvider: 'firebase' | 'aws' | 'local'
    maxStoragePerUser: number
    enableImageCompression: boolean
    enableCDN: boolean
    cdnUrl: string
  }
  analytics: {
    enableGoogleAnalytics: boolean
    googleAnalyticsId: string
    enableCustomAnalytics: boolean
    trackUserBehavior: boolean
    enableHeatmaps: boolean
  }
  social: {
    enableSocialLogin: boolean
    googleClientId: string
    facebookAppId: string
    twitterApiKey: string
    enableSocialSharing: boolean
  }
  api: {
    enableApiAccess: boolean
    apiRateLimit: number
    requireApiKey: boolean
    allowedOrigins: string[]
    enableWebhooks: boolean
  }
}

interface ConfigSection {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

export const AdvancedSettingsSystem = () => {
  const [config, setConfig] = useState<SystemConfig>({
    general: {
      siteName: 'NichoFy',
      siteDescription: 'Plataforma de criação de conteúdo',
      siteUrl: 'https://nichofy.com',
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: true,
      defaultLanguage: 'pt-BR',
      timezone: 'America/Sao_Paulo'
    },
    content: {
      maxPostLength: 2000,
      maxImageSize: 5,
      allowedImageTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      autoApprovePosts: false,
      moderationRequired: true,
      maxPostsPerDay: 10,
      categories: ['Tecnologia', 'Saúde', 'Finanças', 'Educação', 'Entretenimento']
    },
    security: {
      enableTwoFactor: false,
      passwordMinLength: 8,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      enableRateLimiting: true,
      allowedDomains: [],
      blockedDomains: []
    },
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: 'noreply@nichofy.com',
      fromName: 'NichoFy',
      enableEmailNotifications: true
    },
    storage: {
      storageProvider: 'firebase',
      maxStoragePerUser: 100,
      enableImageCompression: true,
      enableCDN: false,
      cdnUrl: ''
    },
    analytics: {
      enableGoogleAnalytics: false,
      googleAnalyticsId: '',
      enableCustomAnalytics: true,
      trackUserBehavior: true,
      enableHeatmaps: false
    },
    social: {
      enableSocialLogin: false,
      googleClientId: '',
      facebookAppId: '',
      twitterApiKey: '',
      enableSocialSharing: true
    },
    api: {
      enableApiAccess: false,
      apiRateLimit: 1000,
      requireApiKey: true,
      allowedOrigins: [],
      enableWebhooks: false
    }
  })

  const [activeSection, setActiveSection] = useState<string>('general')
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const configSections: ConfigSection[] = [
    {
      id: 'general',
      title: 'Geral',
      description: 'Configurações básicas do sistema',
      icon: '⚙️',
      color: 'bg-blue-500'
    },
    {
      id: 'content',
      title: 'Conteúdo',
      description: 'Configurações de posts e mídia',
      icon: '📝',
      color: 'bg-green-500'
    },
    {
      id: 'security',
      title: 'Segurança',
      description: 'Configurações de segurança e autenticação',
      icon: '🔒',
      color: 'bg-red-500'
    },
    {
      id: 'email',
      title: 'Email',
      description: 'Configurações de envio de emails',
      icon: '📧',
      color: 'bg-purple-500'
    },
    {
      id: 'storage',
      title: 'Armazenamento',
      description: 'Configurações de arquivos e mídia',
      icon: '💾',
      color: 'bg-yellow-500'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Configurações de análise e métricas',
      icon: '📊',
      color: 'bg-indigo-500'
    },
    {
      id: 'social',
      title: 'Social',
      description: 'Configurações de redes sociais',
      icon: '🌐',
      color: 'bg-pink-500'
    },
    {
      id: 'api',
      title: 'API',
      description: 'Configurações de API e webhooks',
      icon: '🔌',
      color: 'bg-gray-500'
    }
  ]

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      setIsLoading(true)
      // Simular carregamento de configurações
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Em um sistema real, aqui seria feita a busca no banco de dados
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveConfig = async () => {
    try {
      setIsLoading(true)
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      setHasChanges(false)
      alert('Configurações salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setIsLoading(false)
    }
  }

  const resetConfig = () => {
    if (confirm('Tem certeza que deseja reverter todas as alterações?')) {
      loadConfig()
      setHasChanges(false)
    }
  }

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const addCategory = () => {
    const category = prompt('Digite o nome da nova categoria:')
    if (category && !config.content.categories.includes(category)) {
      updateConfig('content', 'categories', [...config.content.categories, category])
    }
  }

  const removeCategory = (category: string) => {
    updateConfig('content', 'categories', config.content.categories.filter(c => c !== category))
  }

  const addAllowedDomain = () => {
    const domain = prompt('Digite o domínio permitido:')
    if (domain && !config.security.allowedDomains.includes(domain)) {
      updateConfig('security', 'allowedDomains', [...config.security.allowedDomains, domain])
    }
  }

  const removeAllowedDomain = (domain: string) => {
    updateConfig('security', 'allowedDomains', config.security.allowedDomains.filter(d => d !== domain))
  }

  const addBlockedDomain = () => {
    const domain = prompt('Digite o domínio bloqueado:')
    if (domain && !config.security.blockedDomains.includes(domain)) {
      updateConfig('security', 'blockedDomains', [...config.security.blockedDomains, domain])
    }
  }

  const removeBlockedDomain = (domain: string) => {
    updateConfig('security', 'blockedDomains', config.security.blockedDomains.filter(d => d !== domain))
  }

  const addAllowedOrigin = () => {
    const origin = prompt('Digite a origem permitida:')
    if (origin && !config.api.allowedOrigins.includes(origin)) {
      updateConfig('api', 'allowedOrigins', [...config.api.allowedOrigins, origin])
    }
  }

  const removeAllowedOrigin = (origin: string) => {
    updateConfig('api', 'allowedOrigins', config.api.allowedOrigins.filter(o => o !== origin))
  }

  const ConfigField = ({ 
    label, 
    type = 'text', 
    value, 
    onChange, 
    placeholder, 
    options, 
    helpText 
  }: {
    label: string
    type?: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'textarea'
    value: any
    onChange: (value: any) => void
    placeholder?: string
    options?: Array<{ value: string; label: string }>
    helpText?: string
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      
      {type === 'select' && options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            className="mr-3"
          />
          <span className="text-gray-300">Ativar</span>
        </label>
      ) : type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
        />
      )}
      
      {helpText && (
        <p className="text-gray-400 text-xs mt-1">{helpText}</p>
      )}
    </div>
  )

  const GeneralSettings = () => (
    <div className="space-y-6">
      <ConfigField
        label="Nome do Site"
        value={config.general.siteName}
        onChange={(value) => updateConfig('general', 'siteName', value)}
        placeholder="Nome da sua plataforma"
      />
      
      <ConfigField
        label="Descrição do Site"
        type="textarea"
        value={config.general.siteDescription}
        onChange={(value) => updateConfig('general', 'siteDescription', value)}
        placeholder="Descrição da plataforma"
      />
      
      <ConfigField
        label="URL do Site"
        type="url"
        value={config.general.siteUrl}
        onChange={(value) => updateConfig('general', 'siteUrl', value)}
        placeholder="https://seusite.com"
      />
      
      <ConfigField
        label="Modo de Manutenção"
        type="checkbox"
        value={config.general.maintenanceMode}
        onChange={(value) => updateConfig('general', 'maintenanceMode', value)}
        helpText="Ativa uma página de manutenção para todos os usuários"
      />
      
      <ConfigField
        label="Permitir Registro"
        type="checkbox"
        value={config.general.allowRegistration}
        onChange={(value) => updateConfig('general', 'allowRegistration', value)}
      />
      
      <ConfigField
        label="Requer Verificação de Email"
        type="checkbox"
        value={config.general.requireEmailVerification}
        onChange={(value) => updateConfig('general', 'requireEmailVerification', value)}
      />
      
      <ConfigField
        label="Idioma Padrão"
        type="select"
        value={config.general.defaultLanguage}
        onChange={(value) => updateConfig('general', 'defaultLanguage', value)}
        options={[
          { value: 'pt-BR', label: 'Português (Brasil)' },
          { value: 'en-US', label: 'English (US)' },
          { value: 'es-ES', label: 'Español' }
        ]}
      />
      
      <ConfigField
        label="Fuso Horário"
        type="select"
        value={config.general.timezone}
        onChange={(value) => updateConfig('general', 'timezone', value)}
        options={[
          { value: 'America/Sao_Paulo', label: 'São Paulo (GMT-3)' },
          { value: 'America/New_York', label: 'New York (GMT-5)' },
          { value: 'Europe/London', label: 'London (GMT+0)' }
        ]}
      />
    </div>
  )

  const ContentSettings = () => (
    <div className="space-y-6">
      <ConfigField
        label="Tamanho Máximo do Post"
        type="number"
        value={config.content.maxPostLength}
        onChange={(value) => updateConfig('content', 'maxPostLength', parseInt(value))}
        helpText="Número máximo de caracteres por post"
      />
      
      <ConfigField
        label="Tamanho Máximo da Imagem (MB)"
        type="number"
        value={config.content.maxImageSize}
        onChange={(value) => updateConfig('content', 'maxImageSize', parseInt(value))}
      />
      
      <ConfigField
        label="Auto-aprovar Posts"
        type="checkbox"
        value={config.content.autoApprovePosts}
        onChange={(value) => updateConfig('content', 'autoApprovePosts', value)}
        helpText="Posts são aprovados automaticamente sem moderação"
      />
      
      <ConfigField
        label="Moderação Obrigatória"
        type="checkbox"
        value={config.content.moderationRequired}
        onChange={(value) => updateConfig('content', 'moderationRequired', value)}
      />
      
      <ConfigField
        label="Máximo de Posts por Dia"
        type="number"
        value={config.content.maxPostsPerDay}
        onChange={(value) => updateConfig('content', 'maxPostsPerDay', parseInt(value))}
      />
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Categorias Disponíveis
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {config.content.categories.map(category => (
            <span
              key={category}
              className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center"
            >
              {category}
              <button
                onClick={() => removeCategory(category)}
                className="ml-2 text-red-300 hover:text-red-100"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <button
          onClick={addCategory}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          ➕ Adicionar Categoria
        </button>
      </div>
    </div>
  )

  const SecuritySettings = () => (
    <div className="space-y-6">
      <ConfigField
        label="Habilitar Autenticação de Dois Fatores"
        type="checkbox"
        value={config.security.enableTwoFactor}
        onChange={(value) => updateConfig('security', 'enableTwoFactor', value)}
      />
      
      <ConfigField
        label="Tamanho Mínimo da Senha"
        type="number"
        value={config.security.passwordMinLength}
        onChange={(value) => updateConfig('security', 'passwordMinLength', parseInt(value))}
      />
      
      <ConfigField
        label="Timeout da Sessão (horas)"
        type="number"
        value={config.security.sessionTimeout}
        onChange={(value) => updateConfig('security', 'sessionTimeout', parseInt(value))}
      />
      
      <ConfigField
        label="Máximo de Tentativas de Login"
        type="number"
        value={config.security.maxLoginAttempts}
        onChange={(value) => updateConfig('security', 'maxLoginAttempts', parseInt(value))}
      />
      
      <ConfigField
        label="Habilitar Rate Limiting"
        type="checkbox"
        value={config.security.enableRateLimiting}
        onChange={(value) => updateConfig('security', 'enableRateLimiting', value)}
      />
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Domínios Permitidos
        </label>
        <div className="space-y-2 mb-2">
          {config.security.allowedDomains.map(domain => (
            <div key={domain} className="flex items-center justify-between bg-gray-700 p-2 rounded">
              <span className="text-white">{domain}</span>
              <button
                onClick={() => removeAllowedDomain(domain)}
                className="text-red-400 hover:text-red-300"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addAllowedDomain}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          ➕ Adicionar Domínio
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Domínios Bloqueados
        </label>
        <div className="space-y-2 mb-2">
          {config.security.blockedDomains.map(domain => (
            <div key={domain} className="flex items-center justify-between bg-gray-700 p-2 rounded">
              <span className="text-white">{domain}</span>
              <button
                onClick={() => removeBlockedDomain(domain)}
                className="text-red-400 hover:text-red-300"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addBlockedDomain}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          ➕ Adicionar Domínio
        </button>
      </div>
    </div>
  )

  const EmailSettings = () => (
    <div className="space-y-6">
      <ConfigField
        label="SMTP Host"
        value={config.email.smtpHost}
        onChange={(value) => updateConfig('email', 'smtpHost', value)}
        placeholder="smtp.gmail.com"
      />
      
      <ConfigField
        label="SMTP Port"
        type="number"
        value={config.email.smtpPort}
        onChange={(value) => updateConfig('email', 'smtpPort', parseInt(value))}
      />
      
      <ConfigField
        label="SMTP User"
        type="email"
        value={config.email.smtpUser}
        onChange={(value) => updateConfig('email', 'smtpUser', value)}
      />
      
      <ConfigField
        label="SMTP Password"
        type="password"
        value={config.email.smtpPassword}
        onChange={(value) => updateConfig('email', 'smtpPassword', value)}
      />
      
      <ConfigField
        label="Email Remetente"
        type="email"
        value={config.email.fromEmail}
        onChange={(value) => updateConfig('email', 'fromEmail', value)}
      />
      
      <ConfigField
        label="Nome do Remetente"
        value={config.email.fromName}
        onChange={(value) => updateConfig('email', 'fromName', value)}
      />
      
      <ConfigField
        label="Habilitar Notificações por Email"
        type="checkbox"
        value={config.email.enableEmailNotifications}
        onChange={(value) => updateConfig('email', 'enableEmailNotifications', value)}
      />
    </div>
  )

  const StorageSettings = () => (
    <div className="space-y-6">
      <ConfigField
        label="Provedor de Armazenamento"
        type="select"
        value={config.storage.storageProvider}
        onChange={(value) => updateConfig('storage', 'storageProvider', value)}
        options={[
          { value: 'firebase', label: 'Firebase Storage' },
          { value: 'aws', label: 'Amazon S3' },
          { value: 'local', label: 'Armazenamento Local' }
        ]}
      />
      
      <ConfigField
        label="Armazenamento Máximo por Usuário (MB)"
        type="number"
        value={config.storage.maxStoragePerUser}
        onChange={(value) => updateConfig('storage', 'maxStoragePerUser', parseInt(value))}
      />
      
      <ConfigField
        label="Habilitar Compressão de Imagens"
        type="checkbox"
        value={config.storage.enableImageCompression}
        onChange={(value) => updateConfig('storage', 'enableImageCompression', value)}
      />
      
      <ConfigField
        label="Habilitar CDN"
        type="checkbox"
        value={config.storage.enableCDN}
        onChange={(value) => updateConfig('storage', 'enableCDN', value)}
      />
      
      <ConfigField
        label="URL do CDN"
        value={config.storage.cdnUrl}
        onChange={(value) => updateConfig('storage', 'cdnUrl', value)}
        placeholder="https://cdn.seusite.com"
      />
    </div>
  )

  const AnalyticsSettings = () => (
    <div className="space-y-6">
      <ConfigField
        label="Habilitar Google Analytics"
        type="checkbox"
        value={config.analytics.enableGoogleAnalytics}
        onChange={(value) => updateConfig('analytics', 'enableGoogleAnalytics', value)}
      />
      
      <ConfigField
        label="ID do Google Analytics"
        value={config.analytics.googleAnalyticsId}
        onChange={(value) => updateConfig('analytics', 'googleAnalyticsId', value)}
        placeholder="GA-XXXXXXXXX-X"
      />
      
      <ConfigField
        label="Habilitar Analytics Personalizado"
        type="checkbox"
        value={config.analytics.enableCustomAnalytics}
        onChange={(value) => updateConfig('analytics', 'enableCustomAnalytics', value)}
      />
      
      <ConfigField
        label="Rastrear Comportamento do Usuário"
        type="checkbox"
        value={config.analytics.trackUserBehavior}
        onChange={(value) => updateConfig('analytics', 'trackUserBehavior', value)}
      />
      
      <ConfigField
        label="Habilitar Heatmaps"
        type="checkbox"
        value={config.analytics.enableHeatmaps}
        onChange={(value) => updateConfig('analytics', 'enableHeatmaps', value)}
      />
    </div>
  )

  const SocialSettings = () => (
    <div className="space-y-6">
      <ConfigField
        label="Habilitar Login Social"
        type="checkbox"
        value={config.social.enableSocialLogin}
        onChange={(value) => updateConfig('social', 'enableSocialLogin', value)}
      />
      
      <ConfigField
        label="Google Client ID"
        value={config.social.googleClientId}
        onChange={(value) => updateConfig('social', 'googleClientId', value)}
        placeholder="seu-google-client-id"
      />
      
      <ConfigField
        label="Facebook App ID"
        value={config.social.facebookAppId}
        onChange={(value) => updateConfig('social', 'facebookAppId', value)}
        placeholder="seu-facebook-app-id"
      />
      
      <ConfigField
        label="Twitter API Key"
        value={config.social.twitterApiKey}
        onChange={(value) => updateConfig('social', 'twitterApiKey', value)}
        placeholder="seu-twitter-api-key"
      />
      
      <ConfigField
        label="Habilitar Compartilhamento Social"
        type="checkbox"
        value={config.social.enableSocialSharing}
        onChange={(value) => updateConfig('social', 'enableSocialSharing', value)}
      />
    </div>
  )

  const ApiSettings = () => (
    <div className="space-y-6">
      <ConfigField
        label="Habilitar Acesso à API"
        type="checkbox"
        value={config.api.enableApiAccess}
        onChange={(value) => updateConfig('api', 'enableApiAccess', value)}
      />
      
      <ConfigField
        label="Rate Limit da API (requests/hora)"
        type="number"
        value={config.api.apiRateLimit}
        onChange={(value) => updateConfig('api', 'apiRateLimit', parseInt(value))}
      />
      
      <ConfigField
        label="Requer API Key"
        type="checkbox"
        value={config.api.requireApiKey}
        onChange={(value) => updateConfig('api', 'requireApiKey', value)}
      />
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Origens Permitidas (CORS)
        </label>
        <div className="space-y-2 mb-2">
          {config.api.allowedOrigins.map(origin => (
            <div key={origin} className="flex items-center justify-between bg-gray-700 p-2 rounded">
              <span className="text-white">{origin}</span>
              <button
                onClick={() => removeAllowedOrigin(origin)}
                className="text-red-400 hover:text-red-300"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addAllowedOrigin}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          ➕ Adicionar Origem
        </button>
      </div>
      
      <ConfigField
        label="Habilitar Webhooks"
        type="checkbox"
        value={config.api.enableWebhooks}
        onChange={(value) => updateConfig('api', 'enableWebhooks', value)}
      />
    </div>
  )

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings />
      case 'content':
        return <ContentSettings />
      case 'security':
        return <SecuritySettings />
      case 'email':
        return <EmailSettings />
      case 'storage':
        return <StorageSettings />
      case 'analytics':
        return <AnalyticsSettings />
      case 'social':
        return <SocialSettings />
      case 'api':
        return <ApiSettings />
      default:
        return <GeneralSettings />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Carregando Configurações</h2>
          <p className="text-gray-400">Buscando configurações do sistema...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">⚙️ Configurações Avançadas</h1>
            <p className="text-gray-400">Gerencie todas as configurações do sistema</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {hasChanges && (
              <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Alterações não salvas
              </div>
            )}
            <button
              onClick={resetConfig}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🔄 Reverter
            </button>
            <button
              onClick={saveConfig}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isLoading ? '💾 Salvando...' : '💾 Salvar'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Seções</h3>
              <div className="space-y-2">
                {configSections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{section.icon}</span>
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs opacity-75">{section.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">
                  {configSections.find(s => s.id === activeSection)?.icon}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {configSections.find(s => s.id === activeSection)?.title}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {configSections.find(s => s.id === activeSection)?.description}
                  </p>
                </div>
              </div>

              {renderSectionContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
