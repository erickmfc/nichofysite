import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Button } from '@/components/ui/Button'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NichoFy - Conteúdo certo, no tempo certo',
  description: 'Plataforma que combina IA especializada e gerenciamento humano para gerar conteúdo profissional para nichos específicos.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <header className="fixed w-full bg-white/80 backdrop-blur-sm border-b z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <span className="text-2xl font-bold text-primary-600">NichoFy</span>
                <nav className="hidden md:flex items-center gap-6">
                  <a href="#recursos" className="text-gray-600 hover:text-primary-600 transition-colors">Recursos</a>
                  <a href="#diferenciais" className="text-gray-600 hover:text-primary-600 transition-colors">Diferenciais</a>
                  <a href="#precos" className="text-gray-600 hover:text-primary-600 transition-colors">Preços</a>
                  <a href="#sobre" className="text-gray-600 hover:text-primary-600 transition-colors">Sobre</a>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost">Entrar</Button>
                <Button>Começar Agora</Button>
              </div>
            </div>
          </div>
        </header>
        <div className="pt-16">
          {children}
        </div>
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
                  <li><a href="#recursos" className="text-gray-400 hover:text-white transition-colors">Recursos</a></li>
                  <li><a href="#precos" className="text-gray-400 hover:text-white transition-colors">Preços</a></li>
                  <li><a href="#sobre" className="text-gray-400 hover:text-white transition-colors">Sobre</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Termos</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidade</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contato</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Suporte</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} NichoFy. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
} 