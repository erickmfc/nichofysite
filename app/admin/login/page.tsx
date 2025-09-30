'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminAuthService } from '@/lib/services/AdminAuthService'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const success = await AdminAuthService.login(formData.email, formData.password)
      if (success) {
        router.push('/admin')
      } else {
        setError('Credenciais inválidas')
      }
    } catch (err) {
      console.error('Erro no login:', err)
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-3xl font-bold">A</span>
          </div>
          <h2 className="mt-6 text-4xl font-bold text-white">
            NichoFy Admin
          </h2>
          <p className="mt-2 text-lg text-gray-300">
            Painel de Controle Administrativo
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Faça login para acessar o painel de administração
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-red-400 text-xl mr-2">❌</span>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                📧 Email Administrativo
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200"
                placeholder="admin@nichofy.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                🔒 Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                '🚀 Entrar no Painel Admin'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <h4 className="text-yellow-300 font-semibold mb-2">🔑 Credenciais de Demo:</h4>
            <div className="text-sm text-yellow-200 space-y-1">
              <p><strong>Email:</strong> admin@nichofy.com</p>
              <p><strong>Senha:</strong> admin123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © 2024 NichoFy. Todos os direitos reservados.
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
              ← Voltar ao Site
            </a>
            <span className="text-gray-600">•</span>
            <a href="/login" className="text-gray-400 hover:text-white transition-colors text-sm">
              Login de Usuário
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
