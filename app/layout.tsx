import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/lib/contexts/ThemeContext'
import { ToastProvider } from '@/components/ui/Toast'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'NichoFy - Sua Fábrica de Conteúdo em Instantes',
    template: '%s | NichoFy'
  },
  description: 'Transforme seu negócio com conteúdo profissional criado por IA especializada. Mais de 10 nichos, resultados comprovados e suporte 24/7. Conheça nossos planos hoje!',
  keywords: [
    'conteúdo para redes sociais', 'IA para marketing', 'automação de conteúdo', 
    'marketing digital', 'redes sociais', 'conteúdo especializado', 'nichos',
    'inteligência artificial', 'geração de conteúdo', 'social media', 'copywriting'
  ],
  authors: [{ name: 'NichoFy Team' }],
  creator: 'NichoFy',
  publisher: 'NichoFy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nichofy.shop'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NichoFy - Sua Fábrica de Conteúdo em Instantes',
    description: 'Transforme seu negócio com conteúdo profissional criado por IA especializada. Mais de 10 nichos, resultados comprovados e suporte 24/7.',
    url: 'https://nichofy.shop',
    siteName: 'NichoFy',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NichoFy - Conteúdo especializado para seu nicho',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NichoFy - Sua Fábrica de Conteúdo em Instantes',
    description: 'Transforme seu negócio com conteúdo profissional criado por IA especializada. Mais de 10 nichos, resultados comprovados.',
    images: ['/og-image.jpg'],
    creator: '@nichofy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 