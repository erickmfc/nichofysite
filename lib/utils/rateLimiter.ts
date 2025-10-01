// lib/utils/rateLimiter.ts
interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map()
  private windowMs: number
  private maxRequests: number

  constructor(windowMs: number = 900000, maxRequests: number = 100) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  isAllowed(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    if (!entry || now > entry.resetTime) {
      // Nova janela de tempo ou primeira requisição
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      })
      
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs
      }
    }

    if (entry.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      }
    }

    // Incrementar contador
    entry.count++
    this.requests.set(identifier, entry)

    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime
    }
  }

  // Limpar entradas expiradas
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key)
      }
    }
  }

  // Obter estatísticas
  getStats(identifier: string): { count: number; remaining: number; resetTime: number } | null {
    const entry = this.requests.get(identifier)
    if (!entry) return null

    return {
      count: entry.count,
      remaining: Math.max(0, this.maxRequests - entry.count),
      resetTime: entry.resetTime
    }
  }
}

// Instâncias específicas para diferentes tipos de requisições
export const loginRateLimiter = new RateLimiter(900000, 5) // 5 tentativas por 15 minutos
export const contactRateLimiter = new RateLimiter(3600000, 3) // 3 mensagens por hora
export const apiRateLimiter = new RateLimiter(900000, 100) // 100 requisições por 15 minutos
export const contentRateLimiter = new RateLimiter(3600000, 10) // 10 posts por hora

// Função para obter identificador do cliente
export function getClientIdentifier(request: Request): string {
  // Tentar obter IP do cliente
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  return ip
}

// Middleware de rate limiting para API routes
export function withRateLimit(
  rateLimiter: RateLimiter,
  identifier?: string
) {
  return function(handler: Function) {
    return async function(request: Request, ...args: any[]) {
      const clientId = identifier || getClientIdentifier(request)
      const result = rateLimiter.isAllowed(clientId)

      if (!result.allowed) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: 'Muitas requisições. Tente novamente mais tarde.',
            resetTime: result.resetTime
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': rateLimiter.maxRequests.toString(),
              'X-RateLimit-Remaining': result.remaining.toString(),
              'X-RateLimit-Reset': result.resetTime.toString(),
              'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
            }
          }
        )
      }

      // Adicionar headers de rate limit na resposta
      const response = await handler(request, ...args)
      
      if (response instanceof Response) {
        response.headers.set('X-RateLimit-Limit', rateLimiter.maxRequests.toString())
        response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
        response.headers.set('X-RateLimit-Reset', result.resetTime.toString())
      }

      return response
    }
  }
}

// Limpar cache periodicamente
setInterval(() => {
  loginRateLimiter.cleanup()
  contactRateLimiter.cleanup()
  apiRateLimiter.cleanup()
  contentRateLimiter.cleanup()
}, 300000) // A cada 5 minutos
