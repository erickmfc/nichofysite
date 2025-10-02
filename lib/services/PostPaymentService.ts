import { Timestamp } from 'firebase/firestore'

export interface PaymentData {
  transactionId: string
  amount: string
  plan: string
  email: string
  userId?: string
  status: 'pending' | 'approved' | 'rejected'
  paymentMethod: string
  createdAt: Timestamp
  approvedAt?: Timestamp
}

export interface UpsellOffer {
  id: string
  name: string
  price: string
  originalPrice: string
  discount: string
  description: string
  features: string[]
  icon: string
  color: string
  popular: boolean
}

export class PostPaymentService {
  // URLs das páginas pós-pagamento
  static readonly PAGES = {
    APPROVED: '/pagamento-aprovado',
    THANK_YOU: '/obrigado',
    UPSELL: '/upsell',
    LOGIN: '/login',
    DASHBOARD: '/dashboard'
  }

  // Configurações de redirecionamento
  static readonly REDIRECT_CONFIG = {
    AUTO_REDIRECT_DELAY: 10000, // 10 segundos
    UPSELL_DISPLAY_DELAY: 5000,  // 5 segundos
    THANK_YOU_DISPLAY_DELAY: 3000 // 3 segundos
  }

  /**
   * Processa o pagamento aprovado e determina o fluxo de redirecionamento
   */
  static async processApprovedPayment(paymentData: PaymentData): Promise<string> {
    try {
      // Salvar dados do pagamento
      await this.savePaymentData(paymentData)
      
      // Ativar plano do usuário
      await this.activateUserPlan(paymentData)
      
      // Enviar email de confirmação
      await this.sendConfirmationEmail(paymentData)
      
      // Determinar próxima página baseada no plano
      const nextPage = this.determineNextPage(paymentData)
      
      console.log('✅ Pagamento processado com sucesso:', paymentData.transactionId)
      return nextPage
      
    } catch (error) {
      console.error('❌ Erro ao processar pagamento:', error)
      throw error
    }
  }

  /**
   * Determina a próxima página baseada no plano e contexto
   */
  private static determineNextPage(paymentData: PaymentData): string {
    // Se for plano premium ou superior, mostrar upsell
    if (this.shouldShowUpsell(paymentData.plan)) {
      return this.PAGES.UPSELL
    }
    
    // Se for plano básico, ir direto para obrigado
    if (this.isBasicPlan(paymentData.plan)) {
      return this.PAGES.THANK_YOU
    }
    
    // Padrão: página de aprovação
    return this.PAGES.APPROVED
  }

  /**
   * Verifica se deve mostrar upsell baseado no plano
   */
  private static shouldShowUpsell(plan: string): boolean {
    const upsellPlans = ['Plano Premium', 'Plano Profissional']
    return upsellPlans.includes(plan)
  }

  /**
   * Verifica se é um plano básico
   */
  private static isBasicPlan(plan: string): boolean {
    const basicPlans = ['Plano Básico', 'Plano Starter']
    return basicPlans.includes(plan)
  }

  /**
   * Salva dados do pagamento no banco de dados
   */
  private static async savePaymentData(paymentData: PaymentData): Promise<void> {
    // Em produção, salvaria no Firestore
    console.log('💾 Salvando dados do pagamento:', paymentData)
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  /**
   * Ativa o plano do usuário
   */
  private static async activateUserPlan(paymentData: PaymentData): Promise<void> {
    // Em produção, atualizaria o perfil do usuário
    console.log('🎯 Ativando plano:', paymentData.plan, 'para usuário:', paymentData.userId)
    
    // Simular ativação
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  /**
   * Envia email de confirmação
   */
  private static async sendConfirmationEmail(paymentData: PaymentData): Promise<void> {
    // Em produção, enviaria email real
    console.log('📧 Enviando email de confirmação para:', paymentData.email)
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  /**
   * Gera URL de redirecionamento com parâmetros
   */
  static generateRedirectUrl(page: string, paymentData: PaymentData): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const params = new URLSearchParams({
      transaction_id: paymentData.transactionId,
      amount: paymentData.amount,
      plan: paymentData.plan,
      email: paymentData.email,
      timestamp: Date.now().toString()
    })
    
    return `${baseUrl}${page}?${params.toString()}`
  }

  /**
   * Valida dados do pagamento
   */
  static validatePaymentData(data: any): PaymentData | null {
    try {
      if (!data.transactionId || !data.amount || !data.plan || !data.email) {
        throw new Error('Dados obrigatórios ausentes')
      }

      return {
        transactionId: data.transactionId,
        amount: data.amount,
        plan: data.plan,
        email: data.email,
        userId: data.userId,
        status: 'approved',
        paymentMethod: data.paymentMethod || 'credit_card',
        createdAt: Timestamp.now(),
        approvedAt: Timestamp.now()
      }
    } catch (error) {
      console.error('❌ Erro na validação dos dados:', error)
      return null
    }
  }

  /**
   * Ofertas de upsell disponíveis
   */
  static getUpsellOffers(): UpsellOffer[] {
    return [
      {
        id: 'diamond-plan',
        name: 'Plano Diamante',
        price: '197',
        originalPrice: '297',
        discount: '33%',
        description: 'Recursos exclusivos para profissionais avançados',
        features: [
          'Tudo do Plano Premium',
          'Consultoria personalizada 1:1',
          'Templates exclusivos VIP',
          'Análise de concorrentes',
          'Relatórios executivos',
          'Suporte prioritário 24/7',
          'Integração com CRM',
          'Webhooks personalizados'
        ],
        icon: '💎',
        color: 'from-blue-500 to-purple-500',
        popular: true
      },
      {
        id: 'consulting',
        name: 'Consultoria Premium',
        price: '497',
        originalPrice: '997',
        discount: '50%',
        description: 'Sessão de consultoria estratégica personalizada',
        features: [
          'Análise completa do seu negócio',
          'Estratégia personalizada de conteúdo',
          'Plano de ação detalhado',
          'Acompanhamento por 30 dias',
          'Relatório executivo completo',
          'Sessão de follow-up incluída'
        ],
        icon: '🎯',
        color: 'from-green-500 to-teal-500',
        popular: false
      },
      {
        id: 'templates-pack',
        name: 'Pacote de Templates VIP',
        price: '97',
        originalPrice: '197',
        discount: '51%',
        description: 'Coleção exclusiva de templates profissionais',
        features: [
          '50+ templates exclusivos',
          'Templates para todas as plataformas',
          'Designs profissionais',
          'Atualizações mensais',
          'Suporte de design',
          'Licença comercial'
        ],
        icon: '🎨',
        color: 'from-pink-500 to-rose-500',
        popular: false
      }
    ]
  }

  /**
   * Log de eventos pós-pagamento
   */
  static async logPostPaymentEvent(event: string, data: any): Promise<void> {
    console.log(`📊 Evento pós-pagamento: ${event}`, data)
    
    // Em produção, salvaria no sistema de analytics
    // Analytics.track('post_payment_event', { event, ...data })
  }
}
