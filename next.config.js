/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações básicas
  trailingSlash: true,
  
  // Compressão
  compress: true,
  
  // Configurações de imagens
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  
  // Headers básicos
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
  
  // Redirecionamentos básicos
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/pricing',
        destination: '/precos',
        permanent: true,
      },
      {
        source: '/examples',
        destination: '/exemplos',
        permanent: true,
      },
    ]
  },
  
  // Configurações de desenvolvimento
  ...(process.env.NODE_ENV === 'development' && {
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  }),
}

module.exports = nextConfig
