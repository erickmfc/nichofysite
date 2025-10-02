import { Timestamp } from 'firebase/firestore'

export interface ConversionEvent {
  id?: string
  userId?: string
  eventType: 'plan_selection' | 'payment_redirect' | 'payment_success' | 'payment_error'
  planId: string
  planName: string
  amount?: string
  paymentMethod?: string
  transactionId?: string
  userAgent?: string
  referrer?: string
  timestamp: Timestamp
  metadata?: Record<string, any>
}

export interface ConversionStats {
  totalConversions: number
  conversionRate: number
  totalRevenue: number
  averageOrderValue: number
  topConvertingPlans: Array<{
    planId: string
    planName: string
    conversions: number
    revenue: number
  }>
}

export class ConversionTrackingService {
  // Eventos de conversão
  static readonly EVENTS = {
    PLAN_SELECTION: 'plan_selection',
    PAYMENT_REDIRECT: 'payment_redirect',
    PAYMENT_SUCCESS: 'payment_success',
    PAYMENT_ERROR: 'payment_error'
  }

  /**
   * Registra evento de seleção de plano
   */
  static async trackPlanSelection(data: {
    userId?: string
    planId: string
    planName: string
    amount?: string
    userAgent?: string
    referrer?: string
  }): Promise<void> {
    try {
      const event: ConversionEvent = {
        eventType: this.EVENTS.PLAN_SELECTION,
        planId: data.planId,
        planName: data.planName,
        amount: data.amount,
        userId: data.userId,
        userAgent: data.userAgent,
        referrer: data.referrer,
        timestamp: Timestamp.now(),
        metadata: {
          source: 'plan_selection_page',
          timestamp: Date.now()
        }
      }

      await this.saveConversionEvent(event)
      
      console.log('📊 Evento de seleção de plano registrado:', {
        planId: data.planId,
        planName: data.planName,
        userId: data.userId
      })
      
    } catch (error) {
      console.error('❌ Erro ao registrar seleção de plano:', error)
    }
  }

  /**
   * Registra evento de redirecionamento para pagamento
   */
  static async trackPaymentRedirect(data: {
    userId?: string
    planId: string
    planName: string
    amount: string
    paymentLink: string
    userAgent?: string
  }): Promise<void> {
    try {
      const event: ConversionEvent = {
        eventType: this.EVENTS.PAYMENT_REDIRECT,
        planId: data.planId,
        planName: data.planName,
        amount: data.amount,
        userId: data.userId,
        userAgent: data.userAgent,
        timestamp: Timestamp.now(),
        metadata: {
          paymentLink: data.paymentLink,
          source: 'kirvano_payment',
          timestamp: Date.now()
        }
      }

      await this.saveConversionEvent(event)
      
      console.log('🚀 Redirecionamento para pagamento registrado:', {
        planId: data.planId,
        planName: data.planName,
        paymentLink: data.paymentLink,
        userId: data.userId
      })
      
    } catch (error) {
      console.error('❌ Erro ao registrar redirecionamento:', error)
    }
  }

  /**
   * Registra evento de pagamento bem-sucedido
   */
  static async trackPaymentSuccess(data: {
    userId?: string
    planId: string
    planName: string
    amount: string
    transactionId: string
    paymentMethod: string
    userAgent?: string
  }): Promise<void> {
    try {
      const event: ConversionEvent = {
        eventType: this.EVENTS.PAYMENT_SUCCESS,
        planId: data.planId,
        planName: data.planName,
        amount: data.amount,
        transactionId: data.transactionId,
        paymentMethod: data.paymentMethod,
        userId: data.userId,
        userAgent: data.userAgent,
        timestamp: Timestamp.now(),
        metadata: {
          source: 'kirvano_webhook',
          timestamp: Date.now()
        }
      }

      await this.saveConversionEvent(event)
      
      console.log('✅ Pagamento bem-sucedido registrado:', {
        planId: data.planId,
        planName: data.planName,
        transactionId: data.transactionId,
        amount: data.amount,
        userId: data.userId
      })
      
    } catch (error) {
      console.error('❌ Erro ao registrar pagamento bem-sucedido:', error)
    }
  }

  /**
   * Registra evento de erro no pagamento
   */
  static async trackPaymentError(data: {
    userId?: string
    planId: string
    planName: string
    amount: string
    transactionId?: string
    errorMessage?: string
    userAgent?: string
  }): Promise<void> {
    try {
      const event: ConversionEvent = {
        eventType: this.EVENTS.PAYMENT_ERROR,
        planId: data.planId,
        planName: data.planName,
        amount: data.amount,
        transactionId: data.transactionId,
        userId: data.userId,
        userAgent: data.userAgent,
        timestamp: Timestamp.now(),
        metadata: {
          errorMessage: data.errorMessage,
          source: 'payment_error',
          timestamp: Date.now()
        }
      }

      await this.saveConversionEvent(event)
      
      console.log('❌ Erro de pagamento registrado:', {
        planId: data.planId,
        planName: data.planName,
        transactionId: data.transactionId,
        errorMessage: data.errorMessage,
        userId: data.userId
      })
      
    } catch (error) {
      console.error('❌ Erro ao registrar erro de pagamento:', error)
    }
  }

  /**
   * Salva evento de conversão no banco de dados
   */
  private static async saveConversionEvent(event: ConversionEvent): Promise<void> {
    // Em produção, salvaria no Firestore
    console.log('💾 Salvando evento de conversão:', event)
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  /**
   * Calcula estatísticas de conversão
   */
  static async getConversionStats(period: 'day' | 'week' | 'month' = 'month'): Promise<ConversionStats> {
    try {
      // Em produção, buscaria dados reais do Firestore
      const mockStats: ConversionStats = {
        totalConversions: 156,
        conversionRate: 12.5,
        totalRevenue: 2340.00,
        averageOrderValue: 15.00,
        topConvertingPlans: [
          {
            planId: 'basic',
            planName: 'Plano Básico',
            conversions: 89,
            revenue: 1335.00
          },
          {
            planId: 'pro',
            planName: 'Plano Profissional',
            conversions: 45,
            revenue: 1345.50
          },
          {
            planId: 'enterprise',
            planName: 'Plano Empresarial',
            conversions: 22,
            revenue: 2197.80
          }
        ]
      }

      console.log('📊 Estatísticas de conversão calculadas:', mockStats)
      return mockStats
      
    } catch (error) {
      console.error('❌ Erro ao calcular estatísticas:', error)
      throw error
    }
  }

  /**
   * Gera relatório de conversões
   */
  static async generateConversionReport(period: 'day' | 'week' | 'month' = 'month'): Promise<string> {
    try {
      const stats = await this.getConversionStats(period)
      
      const report = `
📊 RELATÓRIO DE CONVERSÕES - ${period.toUpperCase()}

🎯 Métricas Principais:
• Total de Conversões: ${stats.totalConversions}
• Taxa de Conversão: ${stats.conversionRate}%
• Receita Total: R$ ${stats.totalRevenue.toFixed(2)}
• Ticket Médio: R$ ${stats.averageOrderValue.toFixed(2)}

🏆 Planos Mais Convertidos:
${stats.topConvertingPlans.map((plan, index) => 
  `${index + 1}. ${plan.planName}: ${plan.conversions} conversões (R$ ${plan.revenue.toFixed(2)})`
).join('\n')}

📈 Insights:
• O Plano Básico representa ${((stats.topConvertingPlans[0].conversions / stats.totalConversions) * 100).toFixed(1)}% das conversões
• Receita média por conversão: R$ ${(stats.totalRevenue / stats.totalConversions).toFixed(2)}
• Taxa de conversão está ${stats.conversionRate > 10 ? 'acima' : 'abaixo'} da média da indústria (10%)

🎯 Recomendações:
• Focar em otimizar a conversão do Plano Básico
• Implementar upsell para aumentar ticket médio
• Analisar pontos de abandono no funil
      `.trim()

      console.log('📋 Relatório de conversões gerado:', report)
      return report
      
    } catch (error) {
      console.error('❌ Erro ao gerar relatório:', error)
      throw error
    }
  }

  /**
   * Rastreia evento de página (para analytics)
   */
  static trackPageView(page: string, userId?: string): void {
    console.log('📄 Page view tracked:', { page, userId, timestamp: Date.now() })
    
    // Em produção, integraria com Google Analytics, Mixpanel, etc.
    // gtag('event', 'page_view', { page_title: page, user_id: userId })
  }

  /**
   * Rastreia evento customizado
   */
  static trackCustomEvent(eventName: string, properties: Record<string, any>): void {
    console.log('🎯 Custom event tracked:', { eventName, properties, timestamp: Date.now() })
    
    // Em produção, integraria com analytics
    // gtag('event', eventName, properties)
  }
}
