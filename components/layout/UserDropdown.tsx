'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme } from '@/lib/contexts/ThemeContext'

interface UserDropdownProps {
  userName: string
  userEmail: string
  onLogout: () => void
}

export const UserDropdown = ({ userName, userEmail, onLogout }: UserDropdownProps) => {
  const { theme, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMenuItemClick = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${
          theme === 'dark'
            ? 'hover:bg-gray-700'
            : 'hover:bg-gray-100'
        }`}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:block text-left">
          <p className={`text-sm font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {userName.split(' ')[0]}
          </p>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {userEmail}
          </p>
        </div>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-xl border z-50 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="p-4">
            {/* Header */}
            <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
              <p className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Olá, {userName.split(' ')[0]}! 👋
              </p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Bem-vindo ao seu dashboard
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => handleMenuItemClick(() => window.location.href = '/perfil')}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3">👤</span>
                Minha Marca
              </button>

              <button
                onClick={() => handleMenuItemClick(() => window.location.href = '/precos')}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3">💳</span>
                Gerenciar Assinatura
              </button>

              <button
                onClick={() => handleMenuItemClick(toggleTheme)}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3">{theme === 'dark' ? '☀️' : '🌙'}</span>
                {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
              </button>

              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

              <button
                onClick={() => handleMenuItemClick(onLogout)}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                    : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                }`}
              >
                <span className="mr-3">➡️</span>
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
