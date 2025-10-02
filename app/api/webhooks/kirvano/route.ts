import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import crypto from 'crypto'

// Configurações do webhook
const WEBHOOK_SECRET = process.env.KIRVANO_WEBHOOK_SECRET || 'nk_webhook_2025_secure_token_xyz789'
const WEBHOOK_TIMEOUT = 30000 // 30 segundos

// Interface para dados do webhook Kirvano
interface KirvanoWebhookData {
  event: string
  transaction_id: string
  customer: {
    name: string
    email: string
    cpf?: string
    phone?: string
  }
  product: {
    name: string
    price: number
    recurring: boolean
    plan_id?: string
  }
  payment: {
    method: string
    status: string
    date: string
    amount?: number
  }
  metadata?: {
    user_id?: string
    plan_type?: string
  }
}

// Validação de assinatura HMAC-SHA256
function validateSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch (error) {
    console.error('Erro na validação de assinatura:', error)
    return false
  }
}

// Log de auditoria
async function logWebhookEvent(data: any, status: string, error?: string) {
  try {
    await addDoc(collection(db, 'webhook_logs'), {
      timestamp: new Date(),
      event: data.event,
      transaction_id: data.transaction_id,
      status,
      error: error || null,
      customer_email: data.customer?.email,
      amount: data.payment?.amount || data.product?.price,
      processed_at: new Date()
    })
  } catch (logError) {
    console.error('Erro ao registrar log:', logError)
  }
}

// Processar pagamento aprovado
async function handlePaymentApproved(data: KirvanoWebhookData) {
  try {
    const { customer, product, payment, transaction_id } = data
    
    // Buscar usuário por email
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', customer.email))
    const userQuery = await getDocs(q)
    
    if (userQuery.empty) {
      throw new Error(`Usuário não encontrado: ${customer.email}`)
    }
    
    const userDoc = userQuery.docs[0]
    const userId = userDoc.id
    
    // Determinar o plano baseado no produto
    let planId = 'basic'
    if (product.name.includes('Profissional')) planId = 'pro'
    if (product.name.includes('Empresarial')) planId = 'enterprise'
    
    // Atualizar dados do usuário
    await updateDoc(doc(db, 'users', userId), {
      plan: planId,
      planStatus: 'active',
      planSelectedAt: new Date(),
      paymentStatus: 'approved',
      lastPaymentDate: new Date(),
      transactionId: transaction_id,
      paymentMethod: payment.method,
      subscriptionActive: true,
      updatedAt: new Date()
    })
    
    // Criar notificação de sucesso
    await addDoc(collection(db, 'notifications'), {
      userId,
      type: 'payment_success',
      title: '🎉 Pagamento Aprovado!',
      message: `Seu plano ${product.name} foi ativado com sucesso!`,
      read: false,
      createdAt: new Date(),
      priority: 'high'
    })
    
    // Registrar atividade
    await addDoc(collection(db, 'activities'), {
      userId,
      type: 'payment_approved',
      description: `Pagamento aprovado para ${product.name}`,
      amount: product.price,
      transactionId: transaction_id,
      createdAt: new Date()
    })
    
    console.log('✅ Pagamento aprovado processado:', {
      userId,
      planId,
      transactionId: transaction_id,
      amount: product.price
    })
    
    return { success: true, message: 'Pagamento processado com sucesso' }
    
  } catch (error) {
    console.error('Erro ao processar pagamento aprovado:', error)
    throw error
  }
}

// Processar pagamento pendente
async function handlePaymentPending(data: KirvanoWebhookData) {
  try {
    const { customer, product, transaction_id } = data
    
    // Buscar usuário por email
    const userQuery = await db.collection('users')
      .where('email', '==', customer.email)
      .limit(1)
      .get()
    
    if (!userQuery.empty) {
      const userDoc = userQuery.docs[0]
      const userId = userDoc.id
      
      // Atualizar status de pagamento
      await updateDoc(doc(db, 'users', userId), {
        paymentStatus: 'pending',
        transactionId: transaction_id,
        updatedAt: new Date()
      })
      
      // Criar notificação
      await addDoc(collection(db, 'notifications'), {
        userId,
        type: 'payment_pending',
        title: '⏳ Pagamento Pendente',
        message: 'Seu pagamento está sendo processado. Você receberá uma confirmação em breve.',
        read: false,
        createdAt: new Date(),
        priority: 'medium'
      })
    }
    
    return { success: true, message: 'Status de pagamento atualizado' }
    
  } catch (error) {
    console.error('Erro ao processar pagamento pendente:', error)
    throw error
  }
}

// Processar cancelamento
async function handlePaymentCancelled(data: KirvanoWebhookData) {
  try {
    const { customer, transaction_id } = data
    
    // Buscar usuário por email
    const userQuery = await db.collection('users')
      .where('email', '==', customer.email)
      .limit(1)
      .get()
    
    if (!userQuery.empty) {
      const userDoc = userQuery.docs[0]
      const userId = userDoc.id
      
      // Suspender acesso
      await updateDoc(doc(db, 'users', userId), {
        planStatus: 'suspended',
        paymentStatus: 'cancelled',
        subscriptionActive: false,
        suspendedAt: new Date(),
        updatedAt: new Date()
      })
      
      // Criar notificação
      await addDoc(collection(db, 'notifications'), {
        userId,
        type: 'payment_cancelled',
        title: '❌ Assinatura Cancelada',
        message: 'Sua assinatura foi cancelada. Entre em contato para reativar.',
        read: false,
        createdAt: new Date(),
        priority: 'high'
      })
    }
    
    return { success: true, message: 'Cancelamento processado' }
    
  } catch (error) {
    console.error('Erro ao processar cancelamento:', error)
    throw error
  }
}

// Endpoint principal do webhook
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Verificar timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), WEBHOOK_TIMEOUT)
    })
    
    // Obter dados da requisição
    const body = await request.text()
    const signature = request.headers.get('x-kirvano-signature') || ''
    const timestamp = request.headers.get('x-kirvano-timestamp') || ''
    
    // Validar assinatura
    if (!validateSignature(body, signature, WEBHOOK_SECRET)) {
      console.error('❌ Assinatura inválida')
      return NextResponse.json(
        { status: 'error', message: 'Assinatura inválida', code: 'INVALID_SIGNATURE' },
        { status: 401 }
      )
    }
    
    // Parse dos dados
    const data: KirvanoWebhookData = JSON.parse(body)
    
    console.log('📥 Webhook recebido:', {
      event: data.event,
      transaction_id: data.transaction_id,
      customer_email: data.customer?.email,
      amount: data.product?.price
    })
    
    // Processar evento baseado no tipo
    let result
    switch (data.event) {
      case 'payment.approved':
        result = await handlePaymentApproved(data)
        break
        
      case 'payment.pending':
        result = await handlePaymentPending(data)
        break
        
      case 'payment.cancelled':
        result = await handlePaymentCancelled(data)
        break
        
      case 'payment.refunded':
        result = await handlePaymentCancelled(data) // Mesmo tratamento
        break
        
      default:
        console.log('⚠️ Evento não reconhecido:', data.event)
        result = { success: true, message: 'Evento não processado' }
    }
    
    // Log de sucesso
    await logWebhookEvent(data, 'success')
    
    const processingTime = Date.now() - startTime
    console.log(`✅ Webhook processado em ${processingTime}ms`)
    
    return NextResponse.json({
      status: 'success',
      message: 'Webhook processado com sucesso',
      timestamp: new Date().toISOString(),
      processing_time: processingTime
    })
    
  } catch (error) {
    const processingTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    
    console.error('❌ Erro no webhook:', errorMessage)
    
    // Log de erro
    try {
      const body = await request.text()
      const data = JSON.parse(body)
      await logWebhookEvent(data, 'error', errorMessage)
    } catch (logError) {
      console.error('Erro ao registrar log de erro:', logError)
    }
    
    return NextResponse.json(
      {
        status: 'error',
        message: errorMessage,
        code: 'PROCESSING_ERROR',
        timestamp: new Date().toISOString(),
        processing_time: processingTime
      },
      { status: 500 }
    )
  }
}

// Endpoint para teste (apenas em desenvolvimento)
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  
  return NextResponse.json({
    status: 'webhook_active',
    message: 'Webhook Kirvano configurado e funcionando',
    timestamp: new Date().toISOString(),
    events_supported: [
      'payment.approved',
      'payment.pending', 
      'payment.cancelled',
      'payment.refunded'
    ]
  })
}
