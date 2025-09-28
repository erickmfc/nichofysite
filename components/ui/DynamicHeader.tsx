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
              lg:hidden p-2 rounded-lg transition-colors duration-300
              ${isScrolled 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-white hover:bg-white/10'
              }
            `}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`
          lg:hidden transition-all duration-300 ease-in-out overflow-hidden
          ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className={`
            py-4 space-y-4 border-t transition-colors duration-300
            ${isScrolled 
              ? 'border-gray-200' 
              : 'border-white/20'
            }
          `}>
            <Link 
              href="/nichos" 
              className={`
                block text-sm font-medium transition-colors duration-300
                ${isScrolled 
                  ? 'text-gray-700 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
                }
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Nichos
            </Link>
            
            <Link 
              href="/exemplos" 
              className={`
                block text-sm font-medium transition-colors duration-300
                ${isScrolled 
                  ? 'text-gray-700 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
                }
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Exemplos
            </Link>
            
            <Link 
              href="/projetos" 
              className={`
                block text-sm font-medium transition-colors duration-300
                ${isScrolled 
                  ? 'text-gray-700 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
                }
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projetos
            </Link>
            
            <Link 
              href="/precos" 
              className={`
                block text-sm font-medium transition-colors duration-300
                ${isScrolled 
                  ? 'text-gray-700 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
                }
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Preços
            </Link>
            
            <div className="pt-4 space-y-3">
              <Link 
                href="/contato" 
                className={`
                  block text-sm font-medium transition-colors duration-300
                  ${isScrolled 
                    ? 'text-primary-600 hover:text-primary-700' 
                    : 'text-white/80 hover:text-white'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Entrar
              </Link>
              
              <Link 
                href="/produto" 
                className={`
                  block w-full px-6 py-3 rounded-full text-sm font-semibold text-center transition-all duration-300
                  ${isScrolled 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                    : 'border-2 border-white text-white hover:bg-white/10'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
