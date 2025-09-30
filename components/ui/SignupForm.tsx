'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SignupFormProps {
  className?: string
}

export const SignupForm = ({ className = '' }: SignupFormProps) => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simular cadastro - redirecionar para login com modo signup
      router.push('/login?mode=signup')
    } catch (error) {
      setError('Erro ao criar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className={`bg-white rounded-3xl shadow-2xl p-8 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Crie sua conta grátis
        </h2>
        <p className="text-gray-600">
          Comece a criar conteúdo profissional hoje mesmo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome completo
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            placeholder="Seu nome completo"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Senha
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            placeholder="Mínimo 6 caracteres"
            minLength={6}
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            required
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
            Eu aceito os{' '}
            <Link href="/termos" className="text-orange-500 hover:text-orange-600">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link href="/privacidade" className="text-orange-500 hover:text-orange-600">
              Política de Privacidade
            </Link>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Criando conta...
            </div>
          ) : (
            'Criar Conta Agora'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
            Acesse aqui
          </Link>
        </p>
      </div>

      {/* Garantia */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-center space-x-2 text-green-700">
          <span className="text-lg">🛡️</span>
          <span className="text-sm font-medium">
            Garantia de 7 dias grátis - Cancele quando quiser
          </span>
        </div>
      </div>
    </div>
  )
}
