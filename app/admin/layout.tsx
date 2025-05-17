'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

const menuItems = [
  {
    title: 'Painel',
    href: '/admin/dashboard',
    icon: '📊'
  },
  {
    title: 'Pedidos',
    href: '/admin/pedidos',
    icon: '📝'
  },
  {
    title: 'Códigos',
    href: '/admin/codigos',
    icon: '🔑'
  },
  {
    title: 'Conteúdos',
    href: '/admin/conteudos',
    icon: '📚'
  },
  {
    title: 'Equipe',
    href: '/admin/equipe',
    icon: '👥'
  },
  {
    title: 'Relatórios',
    href: '/admin/relatorios',
    icon: '📈'
  },
  {
    title: 'Configurações',
    href: '/admin/configuracoes',
    icon: '⚙️'
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-white shadow-lg w-64 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-600">NichoFy Admin</h1>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                pathname === item.href ? 'bg-primary-50 text-primary-600' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isSidebarOpen ? '←' : '→'}
            </button>

            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                🔔
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                🌙
              </button>
              <Button
                variant="outline"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 