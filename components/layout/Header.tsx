'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/lib/contexts/ThemeContext'
import { Button } from '@/components/ui/Button'
import { SearchBar } from './SearchBar'
import { NotificationBell } from './NotificationBell'
import { UserDropdown } from './UserDropdown'

interface HeaderProps {
  userName: string
  userEmail: string
  onCreateContent: () => void
  onLogout: () => void
}

export const Header = ({ userName, userEmail, onCreateContent, onLogout }: HeaderProps) => {
  const { theme } = useTheme()

  const handleSearch = (query: string) => {
    console.log('Buscando por:', query)
    // Implementar busca nos posts do usuário
  }

  return (
    <header className={`h-16 fixed top-0 right-0 left-64 z-20 border-b transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Left - Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 group"
          >
            <div className={`text-2xl font-bold transition-all duration-200 group-hover:scale-105 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              NichoFy
            </div>
            <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
              theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'
            }`}></div>
          </Link>
        </div>

        {/* Center - Search */}
        <SearchBar onSearch={handleSearch} />

        {/* Right - Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <NotificationBell notificationCount={3} />

          {/* Create Post Button */}
          <Button
            onClick={onCreateContent}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            ✨ Criar Post
          </Button>

          {/* User Dropdown */}
          <UserDropdown
            userName={userName}
            userEmail={userEmail}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  )
}
