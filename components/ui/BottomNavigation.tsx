'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BottomNavigationProps {
  className?: string
}

export const BottomNavigation = ({ className = '' }: BottomNavigationProps) => {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/mobile-dashboard',
      icon: '🏠',
      label: 'Home',
      active: pathname === '/mobile-dashboard'
    },
    {
      href: '/meu-conteudo',
      icon: '📝',
      label: 'Histórico',
      active: pathname === '/meu-conteudo'
    },
    {
      href: '/criar-conteudo',
      icon: '✨',
      label: 'Criar',
      isCentral: true,
      active: pathname === '/criar-conteudo'
    },
    {
      href: '/analytics',
      icon: '📈',
      label: 'Analytics',
      active: pathname === '/analytics'
    },
    {
      href: '/mobile-profile',
      icon: '👤',
      label: 'Perfil',
      active: pathname === '/mobile-profile'
    }
  ]

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-50 ${className}`}>
      <div className="flex items-center justify-around">
        {navItems.map((item, index) => (
          <Link 
            key={index}
            href={item.href}
            className={`flex flex-col items-center space-y-1 ${
              item.active ? 'text-orange-500' : 'text-gray-400'
            }`}
          >
            {item.isCentral ? (
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                item.active 
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500' 
                  : 'bg-gray-200'
              }`}>
                <span className={`text-xl ${item.active ? 'text-white' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
              </div>
            ) : (
              <div className="w-6 h-6">{item.icon}</div>
            )}
            <span className={`text-xs font-medium ${item.active ? 'text-orange-500' : ''}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
