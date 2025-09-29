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
  metadataBase: new URL('https://nichofy.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NichoFy - Sua Fábrica de Conteúdo em Instantes',
    description: 'Transforme seu negócio com conteúdo profissional criado por IA especializada. Mais de 10 nichos, resultados comprovados e suporte 24/7.',
    url: 'https://nichofy.com',
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
            <main>
              {children}
            </main>
          </ToastProvider>
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-5 gap-8">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="text-2xl font-bold">NichoFy</div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                </div>
                <p className="text-gray-400 mb-6 max-w-md">
                  Sua fábrica de conteúdo profissional. Transformamos ideias em posts que vendem, 
                  usando IA especializada para mais de 10 nichos diferentes.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Produto */}
              <div>
                <h4 className="font-semibold mb-4 text-white">Produto</h4>
                <ul className="space-y-3">
                  <li><Link href="/nichos" className="text-gray-400 hover:text-white transition-colors">Nichos Disponíveis</Link></li>
                  <li><Link href="/precos" className="text-gray-400 hover:text-white transition-colors">Planos e Preços</Link></li>
                  <li><Link href="/exemplos" className="text-gray-400 hover:text-white transition-colors">Galeria de Exemplos</Link></li>
                  <li><Link href="/projetos" className="text-gray-400 hover:text-white transition-colors">Projetos em Destaque</Link></li>
                </ul>
              </div>

              {/* Suporte */}
              <div>
                <h4 className="font-semibold mb-4 text-white">Suporte</h4>
                <ul className="space-y-3">
                  <li><Link href="/contato" className="text-gray-400 hover:text-white transition-colors">Central de Ajuda</Link></li>
                  <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">Perguntas Frequentes</Link></li>
                  <li><Link href="/contato" className="text-gray-400 hover:text-white transition-colors">Fale Conosco</Link></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-semibold mb-4 text-white">Legal</h4>
                <ul className="space-y-3">
                  <li><Link href="/termos" className="text-gray-400 hover:text-white transition-colors">Termos de Uso</Link></li>
                  <li><Link href="/privacidade" className="text-gray-400 hover:text-white transition-colors">Política de Privacidade</Link></li>
                  <li><Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Política de Cookies</Link></li>
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            <div className="border-t border-gray-800 mt-12 pt-8">
              <div className="max-w-md mx-auto text-center">
                <h4 className="font-semibold mb-4 text-white">Receba nossas novidades</h4>
                <p className="text-gray-400 mb-4 text-sm">
                  Dicas exclusivas de marketing digital e novos nichos em primeira mão.
                </p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Seu melhor email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                  <button className="px-6 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors">
                    Inscrever
                  </button>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} NichoFy. Todos os direitos reservados.</p>
              <p className="text-sm mt-2">
                Feito com ❤️ para transformar seu negócio através do conteúdo
              </p>
            </div>
          </div>
        </footer>
        </ThemeProvider>
      </body>
    </html>
  )
} 