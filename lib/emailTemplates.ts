// lib/emailTemplates.ts
// Configuração dos templates de e-mail para NichoFy

export const EMAIL_TEMPLATES = {
  // Configurações do remetente
  sender: {
    name: 'NichoFy',
    email: 'noreply@nichofy-cb282.firebaseapp.com',
    replyTo: 'suporte@nichofy.com'
  },

  // Template de verificação de e-mail
  emailVerification: {
    subject: 'Verifique seu e-mail do NichoFy',
    template: {
      greeting: 'Olá, %DISPLAY_NAME%',
      message: 'Clique neste link para verificar seu endereço de e-mail e ativar sua conta na NichoFy.',
      cta: 'Verificar E-mail',
      footer: 'Se você não solicitou a verificação deste endereço, ignore este e-mail.',
      signature: 'Obrigado,\n\nEquipe NichoFy'
    }
  },

  // Template de boas-vindas
  welcome: {
    subject: 'Bem-vindo(a) à NichoFy!',
    template: {
      greeting: 'Olá, %DISPLAY_NAME%',
      message: 'Sua conta foi verificada com sucesso! Agora você pode começar a criar conteúdo profissional.',
      cta: 'Começar a Criar',
      footer: 'Obrigado por escolher a NichoFy para suas necessidades de conteúdo.',
      signature: 'Equipe NichoFy'
    }
  },

  // Template de redefinição de senha
  passwordReset: {
    subject: 'Redefinir senha - NichoFy',
    template: {
      greeting: 'Olá, %DISPLAY_NAME%',
      message: 'Recebemos uma solicitação para redefinir sua senha. Clique no link abaixo para criar uma nova senha.',
      cta: 'Redefinir Senha',
      footer: 'Se você não solicitou a redefinição de senha, ignore este e-mail.',
      signature: 'Equipe NichoFy'
    }
  }
}

// Função para personalizar templates
export const customizeEmailTemplate = (template: any, userData: any) => {
  let customizedTemplate = { ...template }
  
  // Substituir placeholders
  Object.keys(customizedTemplate).forEach(key => {
    if (typeof customizedTemplate[key] === 'string') {
      customizedTemplate[key] = customizedTemplate[key]
        .replace('%DISPLAY_NAME%', userData.displayName || userData.email?.split('@')[0] || 'Usuário')
        .replace('%EMAIL%', userData.email || '')
        .replace('%APP_NAME%', 'NichoFy')
    }
  })
  
  return customizedTemplate
}

// Configurações de domínio autorizado
export const AUTHORIZED_DOMAINS = [
  'localhost',
  'nichofy.shop',
  'nichofy-cb282.firebaseapp.com',
  'nichofy-cb282.web.app'
]

// Configurações de URL de redirecionamento
export const REDIRECT_URLS = {
  emailVerified: '/email-verified',
  passwordReset: '/reset-password',
  welcome: '/dashboard'
}

// Função para obter URL de redirecionamento
export const getRedirectUrl = (action: keyof typeof REDIRECT_URLS) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://nichofy.shop'
  return `${baseUrl}${REDIRECT_URLS[action]}`
}
