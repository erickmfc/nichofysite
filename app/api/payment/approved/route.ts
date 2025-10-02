import { NextRequest, NextResponse } from 'next/server'
import { PostPaymentService } from '@/lib/services/PostPaymentService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados do pagamento
    const paymentData = PostPaymentService.validatePaymentData(body)
    
    if (!paymentData) {
      return NextResponse.json(
        { error: 'Dados de pagamento inválidos' },
        { status: 400 }
      )
    }

    // Processar pagamento aprovado
    const nextPage = await PostPaymentService.processApprovedPayment(paymentData)
    
    // Gerar URL de redirecionamento
    const redirectUrl = PostPaymentService.generateRedirectUrl(nextPage, paymentData)
    
    // Log do evento
    await PostPaymentService.logPostPaymentEvent('payment_approved', {
      transactionId: paymentData.transactionId,
      plan: paymentData.plan,
      amount: paymentData.amount
    })

    return NextResponse.json({
      success: true,
      message: 'Pagamento processado com sucesso',
      redirectUrl,
      transactionId: paymentData.transactionId
    })

  } catch (error) {
    console.error('❌ Erro na API de pagamento:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: 'Não foi possível processar o pagamento'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get('transaction_id')
    
    if (!transactionId) {
      return NextResponse.json(
        { error: 'ID da transação é obrigatório' },
        { status: 400 }
      )
    }

    // Em produção, buscaria os dados da transação no banco
    const mockPaymentData = {
      transactionId,
      amount: '97.00',
      plan: 'Plano Premium',
      email: 'usuario@exemplo.com',
      status: 'approved',
      paymentMethod: 'credit_card',
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      paymentData: mockPaymentData
    })

  } catch (error) {
    console.error('❌ Erro ao buscar dados do pagamento:', error)
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
