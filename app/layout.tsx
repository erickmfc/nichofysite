import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DynamicHeader } from '@/components/ui/DynamicHeader'
import { AuthProvider } from '@/components/auth/AuthProvider'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NichoFy - Conteúdo certo, no tempo certo',
  description: 'Plataforma que combina IA especializada e gerenciamento humano para gerar conteúdo profissional para nichos específicos.',
  keywords: ['conteúdo', 'IA', 'inteligência artificial', 'marketing digital', 'redes sociais', 'blog', 'nichos', 'especializado'],
  authors: [{ name: 'NichoFy' }],
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
    title: 'NichoFy - Conteúdo certo, no tempo certo',
    description: 'Plataforma que combina IA especializada e gerenciamento humano para gerar conteúdo profissional para nichos específicos.',
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
    title: 'NichoFy - Conteúdo certo, no tempo certo',
    description: 'Plataforma que combina IA especializada e gerenciamento humano para gerar conteúdo profissional para nichos específicos.',
    images: ['/og-image.jpg'],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <DynamicHeader />
          <main>
            {children}
          </main>
          <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">NichoFy</h3>
                <p className="text-gray-400">
                  Conteúdo especializado para seu nicho em minutos.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Produto</h4>
                <ul className="space-y-2">
                  <li><Link href="/nichos" className="text-gray-400 hover:text-white transition-colors">Nichos</Link></li>
                  <li><Link href="/precos" className="text-gray-400 hover:text-white transition-colors">Preços</Link></li>
                  <li><Link href="/exemplos" className="text-gray-400 hover:text-white transition-colors">Exemplos</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><Link href="/termos" className="text-gray-400 hover:text-white transition-colors">Termos</Link></li>
                  <li><Link href="/privacidade" className="text-gray-400 hover:text-white transition-colors">Privacidade</Link></li>
                  <li><Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookies</Link></li>
                  <li><Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors">Admin</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contato</h4>
                <ul className="space-y-2">
                  <li><Link href="/contato" className="text-gray-400 hover:text-white transition-colors">Suporte</Link></li>
                  <li><Link href="/contato" className="text-gray-400 hover:text-white transition-colors">Contato</Link></li>
                  <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} NichoFy. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
        </AuthProvider>
      </body>
    </html>
  )
} 