'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PrivacidadePage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  const [showAccess, setShowAccess] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setShowAccess(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAdminAccess = () => {
    router.push('/admin/login')
  }

  const handleBackToSite = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-orange-400 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">N</span>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">NichoFy</h1>
                <p className="text-gray-600">Política de Privacidade</p>
              </div>
            </div>
            <button
              onClick={handleBackToSite}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Voltar ao Site
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showAccess ? (
          /* Loading Screen */
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-6"></div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Carregando Política de Privacidade</h2>
              <p className="text-gray-600 mb-6">
                Preparando os documentos de privacidade...
              </p>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-green-800 font-semibold">
                  Redirecionando em {countdown} segundos...
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Admin Access Screen */
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl font-bold">A</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🔐 Acesso Administrativo
              </h2>
              
              <p className="text-gray-600 mb-8 text-lg">
                Bem-vindo ao painel de controle do NichoFy!
              </p>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8 border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Funcionalidades Disponíveis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">👥 Gestão de Usuários</h4>
                    <p className="text-sm text-gray-600">Visualizar, suspender e gerenciar usuários</p>
                    <p className="text-xs text-blue-600 mt-2">Controle total da base de usuários</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">📝 Aprovação de Conteúdo</h4>
                    <p className="text-sm text-gray-600">Revisar e aprovar posts enviados</p>
                    <p className="text-xs text-green-600 mt-2">Qualidade garantida</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">📊 Relatórios e Analytics</h4>
                    <p className="text-sm text-gray-600">Estatísticas detalhadas do sistema</p>
                    <p className="text-xs text-purple-600 mt-2">Insights valiosos</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">⚙️ Configurações</h4>
                    <p className="text-sm text-gray-600">Personalizar sistema e funcionalidades</p>
                    <p className="text-xs text-orange-600 mt-2">Controle total</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleAdminAccess}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  🚀 Acessar Painel Administrativo
                </button>
                
                <button
                  onClick={handleBackToSite}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  ← Voltar ao Site Principal
                </button>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">
                  <strong>💡 Dica:</strong> Use as credenciais admin@nichofy.com / admin123 para acesso completo.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © 2024 NichoFy. Todos os direitos reservados.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="/termos" className="text-sm hover:text-gray-900 transition-colors">
                Termos de Uso
              </a>
              <a href="/privacidade" className="text-sm hover:text-gray-900 transition-colors">
                Política de Privacidade
              </a>
              <a href="/cookies" className="text-sm hover:text-gray-900 transition-colors">
                Política de Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
