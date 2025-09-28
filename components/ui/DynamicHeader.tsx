'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export const DynamicHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 100) // Muda após 100px de scroll
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/20' 
          : 'bg-transparent'
        }
      `}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className={`
              text-2xl lg:text-3xl font-bold transition-colors duration-500
              ${isScrolled 
                ? 'text-gray-900' 
                : 'text-white drop-shadow-lg'
              }
            `}>
              NichoFy
            </div>
            <div className={`
              w-2 h-2 rounded-full transition-all duration-500 group-hover:scale-125
              ${isScrolled 
                ? 'bg-primary-500' 
                : 'bg-yellow-400'
              }
            `} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/nichos" 
              className={`
                relative text-sm font-medium transition-colors duration-300 hover:scale-105
                ${isScrolled 
                  ? 'text-gray-700 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
                }
              `}
            >
              <span className="relative">
                Nichos
                <span className={`
                  absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full
                  ${isScrolled ? 'bg-primary-500' : 'bg-yellow-400'}
                `} />
              </span>
            </Link>
            
            <Link 
              href="/exemplos" 
              className={`
                relative text-sm font-medium transition-colors duration-300 hover:scale-105
                ${isScrolled 
                  ? 'text-gray-700 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
                }
              `}
            >
              <span className="relative">
                Exemplos
                <span className={`
                  absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full
                  ${isScrolled ? 'bg-primary-500' : 'bg-yellow-400'}
                `} />
              </span>
            </Link>
            
            <Link 
              href="/projetos" 
              className={`
                relative text-sm font-medium transition-colors duration-300 hover:scale-105
                ${isScrolled 
                  ? 'text-gray-700 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
                }
              `}
            >
              <span className="relative">
                Projetos
                <span className={`
                  absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full
                  ${isScrolled ? 'bg-primary-500' : 'bg-yellow-400'}
                `} />
              </span>
            </Link>
            
            <Link 
              href="/precos" 
              className={`
                relative text-sm font-medium transition-colors duration-300 hover:scale-105
                ${isScrolled 
                  ? 'text-gray-700 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
                }
              `}
            >
              <span className="relative">
                Preços
                <span className={`
                  absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full
                  ${isScrolled ? 'bg-primary-500' : 'bg-yellow-400'}
                `} />
              </span>
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link 
              href="/contato" 
              className={`
                text-sm font-medium transition-colors duration-300 hover:scale-105
                ${isScrolled 
                  ? 'text-primary-600 hover:text-primary-700' 
                  : 'text-white/80 hover:text-white'
                }
              `}
            >
              Entrar
            </Link>
            
            <Link 
              href="/produto" 
              className={`
                px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                ${isScrolled 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-orange-500/25' 
                  : 'border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm'
                }
              `}
            >
              Começar Agora
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={`
              lg:hidden relative p-3 rounded-xl transition-all duration-300 transform hover:scale-105
              ${isScrolled 
                ? 'text-gray-700 hover:bg-gray-100/80 backdrop-blur-sm' 
                : 'text-white hover:bg-white/10 backdrop-blur-sm'
              }
              ${isMobileMenuOpen ? 'rotate-90' : ''}
            `}
          >
            <div className="relative w-6 h-6">
              <span className={`
                absolute top-1 left-0 w-6 h-0.5 transition-all duration-300 ease-out
                ${isScrolled ? 'bg-gray-700' : 'bg-white'}
                ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}
              `} />
              <span className={`
                absolute top-3 left-0 w-6 h-0.5 transition-all duration-300 ease-out
                ${isScrolled ? 'bg-gray-700' : 'bg-white'}
                ${isMobileMenuOpen ? 'opacity-0' : ''}
              `} />
              <span className={`
                absolute top-5 left-0 w-6 h-0.5 transition-all duration-300 ease-out
                ${isScrolled ? 'bg-gray-700' : 'bg-white'}
                ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}
              `} />
            </div>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        <div className={`
          lg:hidden fixed top-16 left-0 right-0 z-50 transform transition-all duration-300 ease-out
          ${isMobileMenuOpen 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-4 opacity-0 pointer-events-none'
          }
        `}>
          <div className={`
            mx-4 rounded-2xl shadow-2xl border backdrop-blur-xl
            ${isScrolled 
              ? 'bg-white/95 border-gray-200/50' 
              : 'bg-gradient-to-br from-gray-900/95 to-black/95 border-white/20'
            }
          `}>
            {/* Menu Header */}
            <div className="px-6 py-4 border-b border-gray-200/20">
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                  Menu
                </h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isScrolled 
                      ? 'text-gray-500 hover:bg-gray-100' 
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="px-6 py-4 space-y-2">
              <Link 
                href="/nichos" 
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isScrolled 
                    ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' 
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isScrolled ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  <span className="text-sm">🎯</span>
                </div>
                <span className="font-medium">Nichos</span>
                <svg className={`w-4 h-4 ml-auto transition-transform group-hover:translate-x-1 ${
                  isScrolled ? 'text-gray-400' : 'text-white/50'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <Link 
                href="/exemplos" 
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isScrolled 
                    ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' 
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isScrolled ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  <span className="text-sm">✨</span>
                </div>
                <span className="font-medium">Exemplos</span>
                <svg className={`w-4 h-4 ml-auto transition-transform group-hover:translate-x-1 ${
                  isScrolled ? 'text-gray-400' : 'text-white/50'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <Link 
                href="/projetos" 
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isScrolled 
                    ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' 
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isScrolled ? 'bg-orange-100 text-orange-600' : 'bg-orange-500/20 text-orange-400'
                }`}>
                  <span className="text-sm">🚀</span>
                </div>
                <span className="font-medium">Projetos</span>
                <svg className={`w-4 h-4 ml-auto transition-transform group-hover:translate-x-1 ${
                  isScrolled ? 'text-gray-400' : 'text-white/50'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <Link 
                href="/precos" 
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isScrolled 
                    ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' 
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isScrolled ? 'bg-green-100 text-green-600' : 'bg-green-500/20 text-green-400'
                }`}>
                  <span className="text-sm">💰</span>
                </div>
                <span className="font-medium">Preços</span>
                <svg className={`w-4 h-4 ml-auto transition-transform group-hover:translate-x-1 ${
                  isScrolled ? 'text-gray-400' : 'text-white/50'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 space-y-3 border-t border-gray-200/20">
              <Link 
                href="/contato" 
                className={`
                  flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
                  ${isScrolled 
                    ? 'text-primary-600 hover:bg-primary-50 border border-primary-200' 
                    : 'text-white/80 hover:bg-white/10 border border-white/20'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Entrar</span>
              </Link>
              
              <Link 
                href="/produto" 
                className={`
                  flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105
                  ${isScrolled 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-orange-500/25' 
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg hover:shadow-yellow-400/25'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Começar Agora</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
