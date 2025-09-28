'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { InfiniteContentFlow } from '@/components/ui/InfiniteContentFlow'
import Link from 'next/link'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica de login/signup
    console.log('Form submitted:', formData)
  }

  const handleGoogleLogin = () => {
    // Implementar login com Google
    console.log('Google login clicked')
  }

  return (
    <main className="min-h-screen flex">
      {/* Lado Esquerdo: Vitrine da Marca */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700">
        {/* Overlay escuro para contraste */}
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        
        {/* Rio Infinito de Conteúdo */}
        <div className="absolute inset-0 z-20">
          <InfiniteContentFlow />
        </div>
        
        {/* Texto de Impacto */}
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="text-center px-8">
            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Sua fábrica de conteúdo.
              <br />
              <span className="text-yellow-400">A um clique de distância.</span>
            </h1>
            <p className="text-xl text-white/90 max-w-md mx-auto">
              Veja a mágica acontecer em tempo real enquanto você faz login
            </p>
          </div>
        </div>

        {/* Elementos Decorativos */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400/20 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-yellow-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Lado Direito: Área de Ação */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h2 className="text-3xl font-bold text-primary-600">NichoFy</h2>
            </Link>
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Crie sua conta grátis' : 'Bem-vindo(a) de volta!'}
            </h3>
            <p className="text-gray-600">
              {isSignUp 
                ? 'Comece a criar conteúdo profissional hoje mesmo' 
                : 'Entre na sua conta para continuar criando'
              }
            </p>
          </div>

          {/* Login Social */}
          <div className="mb-6">
            <Button
              onClick={handleGoogleLogin}
              className="w-full bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 py-3 text-base font-medium"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Entrar com Google
            </Button>
          </div>

          {/* Separador */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Seu nome
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={isSignUp}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Digite seu nome completo"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Seu e-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Digite seu e-mail"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Sua senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={isSignUp}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Confirme sua senha"
                />
              </div>
            )}

            {!isSignUp && (
              <div className="text-right">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Esqueci minha senha
                </Link>
              </div>
            )}

            {/* Botão Principal */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isSignUp ? 'Criar Conta' : 'Entrar'}
            </Button>
          </form>

          {/* Link para Cadastro/Login */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isSignUp ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-1 text-primary-600 hover:text-primary-700 font-semibold"
              >
                {isSignUp ? 'Faça login' : 'Cadastre-se de graça'}
              </button>
            </p>
          </div>

          {/* Informações de Segurança */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Ao continuar, você concorda com nossos{' '}
              <Link href="/termos" className="text-primary-600 hover:text-primary-700">
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link href="/privacidade" className="text-primary-600 hover:text-primary-700">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
