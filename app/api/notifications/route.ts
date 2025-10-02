import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp, orderBy, limit } from 'firebase/firestore'

// Interface para notificações
interface Notification {
  id?: string
  userId: string
  type: 'payment_success' | 'payment_failed' | 'account_activated' | 'welcome' | 'content_ready' | 'reminder' | 'promotion'
  title: string
  message: string
  status: 'unread' | 'read'
  createdAt: Timestamp
  metadata?: any
}

// Interface para templates de email
interface EmailTemplate {
  id: string
  name: string
  subject: string
  html: string
  variables: string[]
}

// Templates de email pré-definidos
const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'welcome_premium',
    name: 'Boas-vindas Premium',
    subject: '🎉 Bem-vindo ao NichoFy Premium!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Bem-vindo ao Premium</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #667eea; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bem-vindo ao NichoFy Premium!</h1>
            <p>Seu pagamento foi aprovado e sua conta foi ativada</p>
          </div>
          <div class="content">
            <h2>Olá {{customer_name}}!</h2>
            <p>Parabéns! Seu pagamento de <strong>R$ {{amount}}</strong> foi processado com sucesso e sua conta premium foi ativada.</p>
            
            <h3>🚀 O que você ganhou:</h3>
            <div class="feature">
              <strong>📝 15 Conteúdos por Mês</strong><br>
              Crie conteúdo profissional mensalmente
            </div>
            <div class="feature">
              <strong>🎨 Templates Profissionais</strong><br>
              Acesso a templates exclusivos e premium
            </div>
            <div class="feature">
              <strong>📊 Analytics Avançados</strong><br>
              Acompanhe performance dos seus posts
            </div>
            <div class="feature">
              <strong>💬 Suporte Prioritário</strong><br>
              Atendimento rápido e eficiente
            </div>
            
            <h3>🎯 Próximos Passos:</h3>
            <ol>
              <li>Faça login na sua conta</li>
              <li>Configure seu perfil e preferências</li>
              <li>Comece a criar conteúdo profissional</li>
              <li>Explore todos os recursos premium</li>
            </ol>
            
            <div style="text-align: center;">
              <a href="{{login_url}}" class="button">🔐 Acessar Minha Conta</a>
            </div>
            
            <p><strong>ID da Transação:</strong> {{transaction_id}}</p>
            <p><strong>Data do Pagamento:</strong> {{payment_date}}</p>
          </div>
          <div class="footer">
            <p>Precisa de ajuda? Entre em contato conosco: suporte@nichofy.com</p>
            <p>© 2025 NichoFy. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: ['customer_name', 'amount', 'transaction_id', 'payment_date', 'login_url']
  },
  {
    id: 'payment_failed',
    name: 'Pagamento Falhado',
    subject: '❌ Problema com seu pagamento',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Pagamento Não Processado</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Pagamento Não Processado</h1>
            <p>Ocorreu um problema com seu pagamento</p>
          </div>
          <div class="content">
            <h2>Olá {{customer_name}}!</h2>
            <p>Infelizmente, não conseguimos processar seu pagamento de <strong>R$ {{amount}}</strong>.</p>
            
            <h3>🔧 O que fazer agora:</h3>
            <ol>
              <li>Verifique os dados do seu cartão</li>
              <li>Tente novamente com outro método de pagamento</li>
              <li>Entre em contato conosco se o problema persistir</li>
            </ol>
            
            <div style="text-align: center;">
              <a href="{{retry_url}}" class="button">🔄 Tentar Novamente</a>
            </div>
            
            <p><strong>ID da Transação:</strong> {{transaction_id}}</p>
            <p><strong>Data:</strong> {{payment_date}}</p>
          </div>
          <div class="footer">
            <p>Precisa de ajuda? Entre em contato conosco: suporte@nichofy.com</p>
            <p>© 2025 NichoFy. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: ['customer_name', 'amount', 'transaction_id', 'payment_date', 'retry_url']
  }
]

// Criar notificação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, title, message, metadata } = body
    
    if (!userId || !type || !title || !message) {
      return NextResponse.json({ error: 'Dados obrigatórios faltando' }, { status: 400 })
    }
    
    const notification: Omit<Notification, 'id'> = {
      userId,
      type,
      title,
      message,
      status: 'unread',
      createdAt: Timestamp.now(),
      metadata: metadata || {}
    }
    
    const docRef = await addDoc(collection(db, 'notifications'), notification)
    console.log('✅ Notificação criada:', docRef.id)
    
    return NextResponse.json({ 
      success: true, 
      notificationId: docRef.id 
    })
    
  } catch (error) {
    console.error('❌ Erro ao criar notificação:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// Obter notificações do usuário
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limitCount = parseInt(searchParams.get('limit') || '10')
    
    if (!userId) {
      return NextResponse.json({ error: 'userId obrigatório' }, { status: 400 })
    }
    
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    
    const snapshot = await getDocs(notificationsQuery)
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return NextResponse.json({ notifications })
    
  } catch (error) {
    console.error('❌ Erro ao buscar notificações:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// Marcar notificação como lida
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId } = body
    
    if (!notificationId) {
      return NextResponse.json({ error: 'notificationId obrigatório' }, { status: 400 })
    }
    
    const notificationRef = doc(db, 'notifications', notificationId)
    await updateDoc(notificationRef, {
      status: 'read',
      readAt: Timestamp.now()
    })
    
    console.log('✅ Notificação marcada como lida:', notificationId)
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('❌ Erro ao marcar notificação como lida:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// Enviar email de boas-vindas
export async function sendWelcomeEmail(userData: any) {
  try {
    console.log('📧 Enviando email de boas-vindas para:', userData.email)
    
    const template = EMAIL_TEMPLATES.find(t => t.id === 'welcome_premium')
    if (!template) {
      throw new Error('Template de boas-vindas não encontrado')
    }
    
    // Substituir variáveis no template
    let html = template.html
    let subject = template.subject
    
    const variables = {
      customer_name: userData.name || userData.email,
      amount: userData.amount || '15.00',
      transaction_id: userData.transactionId || 'N/A',
      payment_date: new Date().toLocaleDateString('pt-BR'),
      login_url: `${process.env.NEXT_PUBLIC_BASE_URL}/login`
    }
    
    // Substituir variáveis
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      html = html.replace(regex, value)
      subject = subject.replace(regex, value)
    })
    
    // Aqui você integraria com um serviço de email como SendGrid, Resend, etc.
    // Por enquanto, vamos apenas logar o email
    console.log('📧 Email de boas-vindas preparado:')
    console.log('To:', userData.email)
    console.log('Subject:', subject)
    console.log('HTML:', html.substring(0, 200) + '...')
    
    // Simular envio de email
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('✅ Email de boas-vindas enviado')
    
    return { success: true }
    
  } catch (error) {
    console.error('❌ Erro ao enviar email de boas-vindas:', error)
    throw error
  }
}

// Enviar email de pagamento falhado
export async function sendPaymentFailedEmail(userData: any) {
  try {
    console.log('📧 Enviando email de pagamento falhado para:', userData.email)
    
    const template = EMAIL_TEMPLATES.find(t => t.id === 'payment_failed')
    if (!template) {
      throw new Error('Template de pagamento falhado não encontrado')
    }
    
    // Substituir variáveis no template
    let html = template.html
    let subject = template.subject
    
    const variables = {
      customer_name: userData.name || userData.email,
      amount: userData.amount || '15.00',
      transaction_id: userData.transactionId || 'N/A',
      payment_date: new Date().toLocaleDateString('pt-BR'),
      retry_url: `${process.env.NEXT_PUBLIC_BASE_URL}/planos`
    }
    
    // Substituir variáveis
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      html = html.replace(regex, value)
      subject = subject.replace(regex, value)
    })
    
    // Simular envio de email
    console.log('📧 Email de pagamento falhado preparado:')
    console.log('To:', userData.email)
    console.log('Subject:', subject)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('✅ Email de pagamento falhado enviado')
    
    return { success: true }
    
  } catch (error) {
    console.error('❌ Erro ao enviar email de pagamento falhado:', error)
    throw error
  }
}
