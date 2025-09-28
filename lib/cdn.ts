// lib/cdn.ts
// Sistema CDN para NichoFy

// Configuração CDN
export const CDN_CONFIG = {
  // Cloudflare CDN
  cloudflare: {
    zoneId: process.env.CLOUDFLARE_ZONE_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    baseUrl: 'https://nichofy-cdn.com'
  },
  
  // AWS CloudFront
  cloudfront: {
    distributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    baseUrl: 'https://d1234567890.cloudfront.net'
  },
  
  // Configuração atual
  active: process.env.CDN_PROVIDER || 'cloudflare'
}

// URLs de assets otimizados
export const ASSETS_CONFIG = {
  images: {
    baseUrl: CDN_CONFIG[CDN_CONFIG.active as keyof typeof CDN_CONFIG]?.baseUrl || '/images',
    formats: ['webp', 'avif', 'jpg', 'png'],
    sizes: [320, 640, 768, 1024, 1280, 1920],
    quality: 85
  },
  
  styles: {
    baseUrl: CDN_CONFIG[CDN_CONFIG.active as keyof typeof CDN_CONFIG]?.baseUrl || '/css',
    minify: true,
    compress: true
  },
  
  scripts: {
    baseUrl: CDN_CONFIG[CDN_CONFIG.active as keyof typeof CDN_CONFIG]?.baseUrl || '/js',
    minify: true,
    compress: true
  }
}

// Função para gerar URL otimizada de imagem
export function getOptimizedImageUrl(
  imagePath: string,
  width?: number,
  height?: number,
  format: string = 'webp',
  quality: number = 85
): string {
  const baseUrl = ASSETS_CONFIG.images.baseUrl
  const params = new URLSearchParams()
  
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  params.set('f', format)
  params.set('q', quality.toString())
  
  return `${baseUrl}${imagePath}?${params.toString()}`
}

// Função para gerar URL de asset com versioning
export function getAssetUrl(assetPath: string, version?: string): string {
  const baseUrl = CDN_CONFIG[CDN_CONFIG.active as keyof typeof CDN_CONFIG]?.baseUrl || ''
  const versionParam = version ? `?v=${version}` : ''
  
  return `${baseUrl}${assetPath}${versionParam}`
}

// Componente de imagem otimizada
export interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw'
}: OptimizedImageProps) {
  const optimizedSrc = getOptimizedImageUrl(src, width, height)
  
  return (
    <picture>
      <source
        srcSet={getOptimizedImageUrl(src, width, height, 'avif')}
        type="image/avif"
      />
      <source
        srcSet={getOptimizedImageUrl(src, width, height, 'webp')}
        type="image/webp"
      />
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
      />
    </picture>
  )
}

// Sistema de cache de assets
export class AssetCache {
  private static cache = new Map<string, string>()
  
  static async preloadAsset(assetPath: string): Promise<void> {
    try {
      const response = await fetch(getAssetUrl(assetPath))
      if (response.ok) {
        this.cache.set(assetPath, response.url)
      }
    } catch (error) {
      console.error('Erro ao pré-carregar asset:', error)
    }
  }
  
  static getCachedAsset(assetPath: string): string | null {
    return this.cache.get(assetPath) || null
  }
  
  static async preloadCriticalAssets(): Promise<void> {
    const criticalAssets = [
      '/images/logo.webp',
      '/images/hero-bg.webp',
      '/css/critical.css',
      '/js/main.js'
    ]
    
    await Promise.all(
      criticalAssets.map(asset => this.preloadAsset(asset))
    )
  }
}

// Configuração de cache headers
export const CACHE_HEADERS = {
  // Assets estáticos - 1 ano
  static: {
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Expires': new Date(Date.now() + 31536000000).toUTCString()
  },
  
  // HTML - 1 hora
  html: {
    'Cache-Control': 'public, max-age=3600',
    'Expires': new Date(Date.now() + 3600000).toUTCString()
  },
  
  // API responses - 5 minutos
  api: {
    'Cache-Control': 'public, max-age=300',
    'Expires': new Date(Date.now() + 300000).toUTCString()
  },
  
  // No cache
  noCache: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
}

// Função para aplicar headers de cache
export function applyCacheHeaders(response: Response, type: keyof typeof CACHE_HEADERS): Response {
  const headers = CACHE_HEADERS[type]
  
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  return response
}

export default CDN_CONFIG
