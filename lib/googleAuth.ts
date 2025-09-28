// lib/googleAuth.ts
// Configuração do Google Auth para NichoFy

export const GOOGLE_AUTH_CONFIG = {
  // Configurações do projeto Firebase
  projectId: 'nichofy-cb282',
  projectNumber: '621379290571',
  
  // ID do cliente da Web (fornecido pelo usuário)
  webClientId: '621379290571-m1kr5opp266vh1vlkh0i2nd1oj4sc0ii.apps.googleusercontent.com',
  
  // E-mail de suporte
  supportEmail: 'matheusfc777@gmail.com',
  
  // Configurações de domínio autorizado
  authorizedDomains: [
    'localhost',
    'nichofy.shop',
    'nichofy-cb282.firebaseapp.com',
    'nichofy-cb282.web.app'
  ],
  
  // Scopes solicitados
  scopes: [
    'email',
    'profile',
    'openid'
  ]
}

// Função para verificar se o domínio está autorizado
export const isDomainAuthorized = (domain: string): boolean => {
  return GOOGLE_AUTH_CONFIG.authorizedDomains.includes(domain)
}

// Função para obter configurações específicas do ambiente
export const getGoogleAuthConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isProduction = process.env.NODE_ENV === 'production'
  
  return {
    ...GOOGLE_AUTH_CONFIG,
    environment: {
      isDevelopment,
      isProduction,
      currentDomain: typeof window !== 'undefined' ? window.location.hostname : 'server'
    }
  }
}
