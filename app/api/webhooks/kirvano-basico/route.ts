import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, updateDoc, setDoc, Timestamp } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🔔 Webhook Kirvano recebido:', body)
    
    // Validar dados do webhook
    const { 
      transaction_id, 
      status, 
      amount, 
      customer_email, 
      customer_name,
      plan_type = 'basic',
      payment_method 
    } = body

    if (!transaction_id || !status || !customer_email) {
      return NextResponse.json(
        { error: 'Dados obrigatórios ausentes' },
        { status: 400 }
      )
    }

    // Processar baseado no status
    switch (status) {
      case 'approved':
        await handleApprovedPayment({
          transactionId: transaction_id,
          amount: amount || '15.00',
          customerEmail: customer_email,
          customerName: customer_name,
          planType: plan_type,
          paymentMethod: payment_method || 'credit_card'
        })
        break
        
      case 'pending':
        await handlePendingPayment({
          transactionId: transaction_id,
          amount: amount || '15.00',
          customerEmail: customer_email,
          customerName: customer_name,
          planType: plan_type
        })
        break
        
      case 'rejected':
        await handleRejectedPayment({
          transactionId: transaction_id,
          amount: amount || '15.00',
          customerEmail: customer_email,
          customerName: customer_name,
          planType: plan_type
        })
        break
        
      default:
        console.log('Status não reconhecido:', status)
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processado com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro no webhook Kirvano:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: 'Não foi possível processar o webhook'
      },
      { status: 500 }
    )
  }
}

async function handleApprovedPayment(data: {
  transactionId: string
  amount: string
  customerEmail: string
  customerName?: string
  planType: string
  paymentMethod: string
}) {
  try {
    console.log('✅ Processando pagamento aprovado:', data)
    
    // Buscar usuário por email
    const userRef = doc(db, 'users', data.customerEmail)
    
    // Atualizar dados do usuário
    await updateDoc(userRef, {
      plan: 'basic',
      planStatus: 'active',
      planType: data.planType,
      paymentMethod: data.paymentMethod,
      lastPaymentDate: Timestamp.now(),
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      updatedAt: Timestamp.now()
    }).catch(async () => {
      // Se usuário não existe, criar
      await setDoc(userRef, {
        email: data.customerEmail,
        name: data.customerName || 'Usuário',
        plan: 'basic',
        planStatus: 'active',
        planType: data.planType,
        paymentMethod: data.paymentMethod,
        lastPaymentDate: Timestamp.now(),
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
    })
    
    // Criar registro de pagamento
    await setDoc(doc(db, 'payments', data.transactionId), {
      transactionId: data.transactionId,
      userId: data.customerEmail,
      amount: data.amount,
      planType: data.planType,
      paymentMethod: data.paymentMethod,
      status: 'approved',
      approvedAt: Timestamp.now(),
      createdAt: Timestamp.now()
    })
    
    // Criar notificação para o usuário
    await setDoc(doc(db, 'notifications', `${data.transactionId}_approved`), {
      userId: data.customerEmail,
      type: 'payment_approved',
      title: 'Pagamento Aprovado! 🎉',
      message: `Seu pagamento de R$ ${data.amount} foi aprovado. Bem-vindo ao Plano Básico!`,
      read: false,
      createdAt: Timestamp.now()
    })
    
    console.log('✅ Pagamento processado com sucesso:', data.transactionId)
    
  } catch (error) {
    console.error('❌ Erro ao processar pagamento aprovado:', error)
    throw error
  }
}

async function handlePendingPayment(data: {
  transactionId: string
  amount: string
  customerEmail: string
  customerName?: string
  planType: string
}) {
  try {
    console.log('⏳ Processando pagamento pendente:', data)
    
    // Criar registro de pagamento pendente
    await setDoc(doc(db, 'payments', data.transactionId), {
      transactionId: data.transactionId,
      userId: data.customerEmail,
      amount: data.amount,
      planType: data.planType,
      status: 'pending',
      createdAt: Timestamp.now()
    })
    
    console.log('⏳ Pagamento pendente registrado:', data.transactionId)
    
  } catch (error) {
    console.error('❌ Erro ao processar pagamento pendente:', error)
    throw error
  }
}

async function handleRejectedPayment(data: {
  transactionId: string
  amount: string
  customerEmail: string
  customerName?: string
  planType: string
}) {
  try {
    console.log('❌ Processando pagamento rejeitado:', data)
    
    // Criar registro de pagamento rejeitado
    await setDoc(doc(db, 'payments', data.transactionId), {
      transactionId: data.transactionId,
      userId: data.customerEmail,
      amount: data.amount,
      planType: data.planType,
      status: 'rejected',
      rejectedAt: Timestamp.now(),
      createdAt: Timestamp.now()
    })
    
    // Criar notificação para o usuário
    await setDoc(doc(db, 'notifications', `${data.transactionId}_rejected`), {
      userId: data.customerEmail,
      type: 'payment_rejected',
      title: 'Pagamento Rejeitado',
      message: `Seu pagamento de R$ ${data.amount} foi rejeitado. Tente novamente ou entre em contato conosco.`,
      read: false,
      createdAt: Timestamp.now()
    })
    
    console.log('❌ Pagamento rejeitado registrado:', data.transactionId)
    
  } catch (error) {
    console.error('❌ Erro ao processar pagamento rejeitado:', error)
    throw error
  }
}

// Endpoint GET para verificar status do webhook
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const transactionId = searchParams.get('transaction_id')
  
  if (!transactionId) {
    return NextResponse.json(
      { error: 'ID da transação é obrigatório' },
      { status: 400 }
    )
  }

  try {
    // Em produção, buscaria no Firestore
    const mockPayment = {
      transactionId,
      status: 'approved',
      amount: '15.00',
      planType: 'basic',
      approvedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      payment: mockPayment
    })

  } catch (error) {
    console.error('❌ Erro ao buscar pagamento:', error)
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
