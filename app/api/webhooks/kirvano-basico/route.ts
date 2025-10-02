import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, updateDoc, doc, query, where, getDocs, Timestamp } from 'firebase/firestore'

// Interface para dados do webhook Kirvano
interface KirvanoWebhookData {
  event: string
  transaction_id: string
  amount: number
  currency: string
  status: 'approved' | 'pending' | 'rejected'
  customer_email: string
  customer_name: string
  plan_id: string
  created_at: string
  metadata?: {
    user_id?: string
    plan_type?: string
    source?: string
  }
}

// Interface para histórico de pagamentos
interface PaymentHistory {
  id?: string
  userId: string
  transactionId: string
  amount: number
  currency: string
  status: string
  planType: string
  paymentMethod: string
  createdAt: Timestamp
  processedAt?: Timestamp
  metadata?: any
}

// Interface para notificações
interface Notification {
  id?: string
  userId: string
  type: 'payment_success' | 'payment_failed' | 'account_activated' | 'welcome'
  title: string
  message: string
  status: 'unread' | 'read'
  createdAt: Timestamp
  metadata?: any
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Webhook Kirvano recebido')
    
    const body = await request.json()
    console.log('📦 Dados do webhook:', body)
    
    // Validar dados do webhook
    const webhookData: KirvanoWebhookData = body
    
    if (!webhookData.transaction_id || !webhookData.customer_email) {
      console.error('❌ Dados inválidos no webhook')
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }
    
    // Processar diferentes tipos de eventos
    switch (webhookData.event) {
      case 'payment.approved':
        await handlePaymentApproved(webhookData)
        break
      case 'payment.failed':
        await handlePaymentFailed(webhookData)
        break
      case 'payment.pending':
        await handlePaymentPending(webhookData)
        break
      default:
        console.log('ℹ️ Evento não tratado:', webhookData.event)
    }
    
    console.log('✅ Webhook processado com sucesso')
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// Processar pagamento aprovado
async function handlePaymentApproved(data: KirvanoWebhookData) {
  console.log('✅ Processando pagamento aprovado:', data.transaction_id)
  
  try {
    // 1. Registrar histórico de pagamento
    const paymentHistory: Omit<PaymentHistory, 'id'> = {
      userId: data.metadata?.user_id || data.customer_email,
      transactionId: data.transaction_id,
      amount: data.amount,
      currency: data.currency,
      status: 'approved',
      planType: data.metadata?.plan_type || 'básico',
      paymentMethod: 'kirvano',
      createdAt: Timestamp.now(),
      processedAt: Timestamp.now(),
      metadata: data
    }
    
    await addDoc(collection(db, 'paymentHistory'), paymentHistory)
    console.log('📝 Histórico de pagamento registrado')
    
    // 2. Ativar conta premium
    await activatePremiumAccount(data)
    
    // 3. Enviar notificações
    await sendPaymentNotifications(data, 'success')
    
    // 4. Registrar métricas
    await updatePaymentMetrics(data)
    
    console.log('🎉 Pagamento aprovado processado completamente')
    
  } catch (error) {
    console.error('❌ Erro ao processar pagamento aprovado:', error)
    throw error
  }
}

// Processar pagamento falhado
async function handlePaymentFailed(data: KirvanoWebhookData) {
  console.log('❌ Processando pagamento falhado:', data.transaction_id)
  
  try {
    // Registrar histórico de pagamento falhado
    const paymentHistory: Omit<PaymentHistory, 'id'> = {
      userId: data.metadata?.user_id || data.customer_email,
      transactionId: data.transaction_id,
      amount: data.amount,
      currency: data.currency,
      status: 'failed',
      planType: data.metadata?.plan_type || 'básico',
      paymentMethod: 'kirvano',
      createdAt: Timestamp.now(),
      metadata: data
    }
    
    await addDoc(collection(db, 'paymentHistory'), paymentHistory)
    
    // Enviar notificação de falha
    await sendPaymentNotifications(data, 'failed')
    
    console.log('📝 Pagamento falhado registrado')
    
  } catch (error) {
    console.error('❌ Erro ao processar pagamento falhado:', error)
    throw error
  }
}

// Processar pagamento pendente
async function handlePaymentPending(data: KirvanoWebhookData) {
  console.log('⏳ Processando pagamento pendente:', data.transaction_id)
  
  try {
    // Registrar histórico de pagamento pendente
    const paymentHistory: Omit<PaymentHistory, 'id'> = {
      userId: data.metadata?.user_id || data.customer_email,
      transactionId: data.transaction_id,
      amount: data.amount,
      currency: data.currency,
      status: 'pending',
      planType: data.metadata?.plan_type || 'básico',
      paymentMethod: 'kirvano',
      createdAt: Timestamp.now(),
      metadata: data
    }
    
    await addDoc(collection(db, 'paymentHistory'), paymentHistory)
    
    console.log('📝 Pagamento pendente registrado')
    
  } catch (error) {
    console.error('❌ Erro ao processar pagamento pendente:', error)
    throw error
  }
}

// Ativar conta premium
async function activatePremiumAccount(data: KirvanoWebhookData) {
  console.log('🚀 Ativando conta premium para:', data.customer_email)
  
  try {
    const userId = data.metadata?.user_id || data.customer_email
    
    // Atualizar status da conta
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      planType: 'premium',
      planStatus: 'active',
      planStartDate: Timestamp.now(),
      planEndDate: new Timestamp(Timestamp.now().seconds + (30 * 24 * 60 * 60), 0), // 30 dias
      lastPaymentDate: Timestamp.now(),
      paymentMethod: 'kirvano',
      updatedAt: Timestamp.now()
    })
    
    console.log('✅ Conta premium ativada')
    
  } catch (error) {
    console.error('❌ Erro ao ativar conta premium:', error)
    throw error
  }
}

// Enviar notificações
async function sendPaymentNotifications(data: KirvanoWebhookData, type: 'success' | 'failed') {
  console.log('🔔 Enviando notificações:', type)
  
  try {
    const userId = data.metadata?.user_id || data.customer_email
    
    if (type === 'success') {
      // Notificação de pagamento aprovado
      const paymentNotification: Omit<Notification, 'id'> = {
        userId,
        type: 'payment_success',
        title: '🎉 Pagamento Aprovado!',
        message: `Seu pagamento de R$ ${data.amount} foi aprovado. Sua conta premium foi ativada!`,
        status: 'unread',
        createdAt: Timestamp.now(),
        metadata: {
          transactionId: data.transaction_id,
          amount: data.amount,
          planType: data.metadata?.plan_type || 'básico'
        }
      }
      
      await addDoc(collection(db, 'notifications'), paymentNotification)
      
      // Notificação de boas-vindas
      const welcomeNotification: Omit<Notification, 'id'> = {
        userId,
        type: 'welcome',
        title: '🎊 Bem-vindo ao Premium!',
        message: 'Sua conta premium foi ativada. Explore todos os recursos disponíveis!',
        status: 'unread',
        createdAt: Timestamp.now(),
        metadata: {
          planType: data.metadata?.plan_type || 'básico',
          features: ['templates_premium', 'analytics_avancados', 'suporte_prioritario']
        }
      }
      
      await addDoc(collection(db, 'notifications'), welcomeNotification)
      
    } else {
      // Notificação de pagamento falhado
      const failedNotification: Omit<Notification, 'id'> = {
        userId,
        type: 'payment_failed',
        title: '❌ Pagamento Não Processado',
        message: `Seu pagamento de R$ ${data.amount} não foi processado. Tente novamente.`,
        status: 'unread',
        createdAt: Timestamp.now(),
        metadata: {
          transactionId: data.transaction_id,
          amount: data.amount,
          planType: data.metadata?.plan_type || 'básico'
        }
      }
      
      await addDoc(collection(db, 'notifications'), failedNotification)
    }
    
    console.log('✅ Notificações enviadas')
    
  } catch (error) {
    console.error('❌ Erro ao enviar notificações:', error)
    throw error
  }
}

// Atualizar métricas de pagamento
async function updatePaymentMetrics(data: KirvanoWebhookData) {
  console.log('📊 Atualizando métricas de pagamento')
  
  try {
    // Registrar métricas de conversão
    const metricsData = {
      event: 'payment_conversion',
      transactionId: data.transaction_id,
      amount: data.amount,
      planType: data.metadata?.plan_type || 'básico',
      source: data.metadata?.source || 'kirvano',
      timestamp: Timestamp.now(),
      metadata: data
    }
    
    await addDoc(collection(db, 'conversionMetrics'), metricsData)
    
    console.log('📈 Métricas atualizadas')
    
  } catch (error) {
    console.error('❌ Erro ao atualizar métricas:', error)
    throw error
  }
}

// GET para verificar status do webhook
export async function GET() {
  return NextResponse.json({ 
    status: 'active',
    service: 'Kirvano Webhook Handler',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
}