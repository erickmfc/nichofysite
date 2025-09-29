'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/lib/contexts/ThemeContext'

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊', current: true },
  { name: 'Criar Conteúdo', href: '/dashboard/criar', icon: '✨', current: false },
  { name: 'Meu Conteúdo', href: '/meu-conteudo', icon: '📚', current: false },
  { name: 'Calendário', href: '/dashboard/calendario', icon: '📅', current: false },
  { name: 'Analytics', href: '/dashboard/analytics', icon: '📈', current: false },
  { name: 'Templates', href: '/dashboard/templates', icon: '🎨', current: false },
  { name: 'Configurações', href: '/dashboard/configuracoes', icon: '⚙️', current: false },
]

const secondaryItems = [
  { name: 'Preços', href: '/precos', icon: '💳' },
  { name: 'Suporte', href: '/contato', icon: '💬' },
]

interface SidebarProps {
  onLogout: () => void
}

export const Sidebar = ({ onLogout }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out ${
      theme === 'dark' 
        ? 'bg-gray-900 border-r border-gray-700' 
        : 'bg-white border-r border-gray-200'
    } h-screen fixed left-0 top-0 z-30`}>
      {/* Logo */}
      <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <h1 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {collapsed ? 'N' : 'NichoFy'}
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                item.current
                  ? theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {!collapsed && item.name}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className={`mt-8 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}></div>

        {/* Secondary Navigation */}
        <div className="mt-6 space-y-1">
          {secondaryItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {!collapsed && item.name}
            </Link>
          ))}
        </div>

        {/* Theme Toggle */}
        <div className={`mt-8 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}></div>
        <div className="mt-6">
          <button
            onClick={toggleTheme}
            className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              theme === 'dark'
                ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <span className="text-lg mr-3">{theme === 'dark' ? '☀️' : '🌙'}</span>
            {!collapsed && (theme === 'dark' ? 'Modo Claro' : 'Modo Escuro')}
          </button>
        </div>
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`absolute -right-3 top-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
        }`}
      >
        {collapsed ? '→' : '←'}
      </button>
    </div>
  )
}
