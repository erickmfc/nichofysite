// lib/monitoring.ts
// Sistema de monitoramento de erros para NichoFy

import { CacheService } from './redis'

// Configuração do monitoramento
export const MONITORING_CONFIG = {
  // Sentry para monitoramento de erros
  sentry: {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.1
  },
  
  // LogRocket para sessões
  logrocket: {
    appId: process.env.LOGROCKET_APP_ID
  },
  
  // Datadog para métricas
  datadog: {
    apiKey: process.env.DATADOG_API_KEY,
    site: process.env.DATADOG_SITE || 'datadoghq.com'
  }
}

// Tipos de erros
export enum ErrorType {
  CLIENT_ERROR = 'client_error',
  SERVER_ERROR = 'server_error',
  NETWORK_ERROR = 'network_error',
  AUTH_ERROR = 'auth_error',
  VALIDATION_ERROR = 'validation_error',
  DATABASE_ERROR = 'database_error',
  CACHE_ERROR = 'cache_error',
  CDN_ERROR = 'cdn_error'
}

// Interface de erro
export interface ErrorReport {
  id: string
  type: ErrorType
  message: string
  stack?: string
  context: {
    url: string
    userAgent: string
    userId?: string
    sessionId?: string
    timestamp: Date
    environment: string
  }
  metadata?: Record<string, any>
  severity: 'low' | 'medium' | 'high' | 'critical'
}

// Classe principal de monitoramento
export class ErrorMonitoring {
  private static errors: ErrorReport[] = []
  private static isInitialized = false
  
  // Inicializar monitoramento
  static async initialize(): Promise<void> {
    if (this.isInitialized) return
    
    try {
      // Inicializar Sentry se configurado
      if (MONITORING_CONFIG.sentry.dsn) {
        const Sentry = await import('@sentry/nextjs')
        Sentry.init({
          dsn: MONITORING_CONFIG.sentry.dsn,
          environment: MONITORING_CONFIG.sentry.environment,
          tracesSampleRate: MONITORING_CONFIG.sentry.tracesSampleRate,
          profilesSampleRate: MONITORING_CONFIG.sentry.profilesSampleRate,
          beforeSend(event) {
            // Filtrar erros não críticos
            if (event.exception) {
              const error = event.exception.values?.[0]
              if (error?.type === 'ChunkLoadError') {
                return null // Ignorar erros de chunk
              }
            }
            return event
          }
        })
      }
      
      this.isInitialized = true
      console.log('✅ Monitoramento de erros inicializado')
    } catch (error) {
      console.error('❌ Erro ao inicializar monitoramento:', error)
    }
  }
  
  // Reportar erro
  static async reportError(
    error: Error | string,
    type: ErrorType = ErrorType.SERVER_ERROR,
    metadata?: Record<string, any>,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<void> {
    try {
      const errorReport: ErrorReport = {
        id: this.generateErrorId(),
        type,
        message: typeof error === 'string' ? error : error.message,
        stack: typeof error === 'string' ? undefined : error.stack,
        context: {
          url: typeof window !== 'undefined' ? window.location.href : 'server',
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
          timestamp: new Date(),
          environment: process.env.NODE_ENV || 'development'
        },
        metadata,
        severity
      }
      
      // Adicionar à lista local
      this.errors.push(errorReport)
      
      // Salvar no cache Redis
      await CacheService.set(`error:${errorReport.id}`, errorReport, 86400) // 24 horas
      
      // Enviar para Sentry se configurado
      if (MONITORING_CONFIG.sentry.dsn && typeof window !== 'undefined') {
        const Sentry = await import('@sentry/nextjs')
        Sentry.captureException(error, {
          tags: {
            errorType: type,
            severity: severity
          },
          extra: metadata
        })
      }
      
      // Log local
      console.error(`🚨 Erro reportado [${severity}]:`, errorReport)
      
      // Limitar lista local
      if (this.errors.length > 100) {
        this.errors = this.errors.slice(-50)
      }
      
    } catch (reportError) {
      console.error('❌ Erro ao reportar erro:', reportError)
    }
  }
  
  // Reportar erro de API
  static async reportApiError(
    endpoint: string,
    method: string,
    statusCode: number,
    error: any,
    requestData?: any
  ): Promise<void> {
    await this.reportError(
      `API Error: ${method} ${endpoint} - ${statusCode}`,
      ErrorType.SERVER_ERROR,
      {
        endpoint,
        method,
        statusCode,
        requestData,
        error: error.message || error
      },
      statusCode >= 500 ? 'high' : 'medium'
    )
  }
  
  // Reportar erro de autenticação
  static async reportAuthError(
    action: string,
    error: any,
    userId?: string
  ): Promise<void> {
    await this.reportError(
      `Auth Error: ${action}`,
      ErrorType.AUTH_ERROR,
      {
        action,
        userId,
        error: error.message || error
      },
      'high'
    )
  }
  
  // Reportar erro de banco de dados
  static async reportDatabaseError(
    operation: string,
    error: any,
    query?: string
  ): Promise<void> {
    await this.reportError(
      `Database Error: ${operation}`,
      ErrorType.DATABASE_ERROR,
      {
        operation,
        query,
        error: error.message || error
      },
      'critical'
    )
  }
  
  // Obter estatísticas de erros
  static async getErrorStats(): Promise<any> {
    try {
      const stats = {
        total: this.errors.length,
        byType: {} as Record<ErrorType, number>,
        bySeverity: {} as Record<string, number>,
        recent: this.errors.slice(-10),
        last24h: 0
      }
      
      // Contar por tipo
      this.errors.forEach(error => {
        stats.byType[error.type] = (stats.byType[error.type] || 0) + 1
        stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1
      })
      
      // Contar últimos 24h
      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
      stats.last24h = this.errors.filter(error => 
        error.context.timestamp > last24h
      ).length
      
      return stats
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      return null
    }
  }
  
  // Gerar ID único para erro
  private static generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  // Limpar erros antigos
  static async cleanupOldErrors(): Promise<void> {
    try {
      const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 dias
      this.errors = this.errors.filter(error => 
        error.context.timestamp > cutoffDate
      )
      
      console.log(`🧹 Limpeza de erros: ${this.errors.length} erros mantidos`)
    } catch (error) {
      console.error('Erro na limpeza:', error)
    }
  }
}

// Hook para monitoramento de erros no React
export function useErrorMonitoring() {
  const reportError = async (
    error: Error | string,
    type?: ErrorType,
    metadata?: Record<string, any>,
    severity?: 'low' | 'medium' | 'high' | 'critical'
  ) => {
    await ErrorMonitoring.reportError(error, type, metadata, severity)
  }
  
  const reportApiError = async (
    endpoint: string,
    method: string,
    statusCode: number,
    error: any,
    requestData?: any
  ) => {
    await ErrorMonitoring.reportApiError(endpoint, method, statusCode, error, requestData)
  }
  
  return {
    reportError,
    reportApiError
  }
}

// Middleware para capturar erros em API routes
export function withErrorMonitoring(handler: Function) {
  return async (req: any, res: any) => {
    try {
      await handler(req, res)
    } catch (error) {
      await ErrorMonitoring.reportError(
        error as Error,
        ErrorType.SERVER_ERROR,
        {
          method: req.method,
          url: req.url,
          headers: req.headers
        },
        'high'
      )
      
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      })
    }
  }
}

// Inicializar monitoramento
ErrorMonitoring.initialize()

export default ErrorMonitoring
