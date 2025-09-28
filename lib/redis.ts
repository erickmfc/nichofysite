// lib/redis.ts
// Sistema de cache Redis para NichoFy

import Redis from 'ioredis'

// Configuração do Redis
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
}

// Cliente Redis
export const redis = new Redis(redisConfig)

// Eventos do Redis
redis.on('connect', () => {
  console.log('✅ Redis conectado')
})

redis.on('error', (error) => {
  console.error('❌ Erro Redis:', error)
})

redis.on('close', () => {
  console.log('🔌 Redis desconectado')
})

// Funções de cache
export class CacheService {
  // Cache com TTL
  static async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value)
      await redis.setex(key, ttl, serializedValue)
    } catch (error) {
      console.error('Erro ao salvar no cache:', error)
    }
  }

  // Recuperar do cache
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('Erro ao recuperar do cache:', error)
      return null
    }
  }

  // Deletar do cache
  static async del(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error('Erro ao deletar do cache:', error)
    }
  }

  // Cache de usuários
  static async cacheUser(userId: string, userData: any): Promise<void> {
    await this.set(`user:${userId}`, userData, 1800) // 30 minutos
  }

  static async getCachedUser(userId: string): Promise<any> {
    return await this.get(`user:${userId}`)
  }

  // Cache de projetos
  static async cacheProjects(projects: any[]): Promise<void> {
    await this.set('projects:all', projects, 3600) // 1 hora
  }

  static async getCachedProjects(): Promise<any[]> {
    return await this.get('projects:all') || []
  }

  // Cache de nichos
  static async cacheNichos(nichos: any[]): Promise<void> {
    await this.set('nichos:all', nichos, 7200) // 2 horas
  }

  static async getCachedNichos(): Promise<any[]> {
    return await this.get('nichos:all') || []
  }

  // Cache de conteúdo
  static async cacheContent(contentId: string, content: any): Promise<void> {
    await this.set(`content:${contentId}`, content, 1800) // 30 minutos
  }

  static async getCachedContent(contentId: string): Promise<any> {
    return await this.get(`content:${contentId}`)
  }

  // Cache de sessões
  static async cacheSession(sessionId: string, sessionData: any): Promise<void> {
    await this.set(`session:${sessionId}`, sessionData, 86400) // 24 horas
  }

  static async getCachedSession(sessionId: string): Promise<any> {
    return await this.get(`session:${sessionId}`)
  }

  // Limpar cache por padrão
  static async clearPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } catch (error) {
      console.error('Erro ao limpar cache:', error)
    }
  }

  // Estatísticas do cache
  static async getStats(): Promise<any> {
    try {
      const info = await redis.info('memory')
      const keyspace = await redis.info('keyspace')
      
      return {
        memory: info,
        keyspace: keyspace,
        connected: redis.status === 'ready'
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      return null
    }
  }
}

// Middleware de cache para API routes
export function withCache(ttl: number = 3600) {
  return function(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function(...args: any[]) {
      const cacheKey = `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`
      
      // Tentar recuperar do cache
      const cached = await CacheService.get(cacheKey)
      if (cached) {
        return cached
      }

      // Executar método original
      const result = await method.apply(this, args)
      
      // Salvar no cache
      await CacheService.set(cacheKey, result, ttl)
      
      return result
    }
  }
}

export default redis
