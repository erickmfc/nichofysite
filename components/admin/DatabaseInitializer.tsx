// Script para inicializar o banco de dados
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { populateInitialData } from '@/lib/data/initialData'

export const DatabaseInitializer = () => {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializeDatabase = async () => {
    setIsInitializing(true)
    setError(null)

    try {
      const result = await populateInitialData()
      
      if (result.success) {
        setIsInitialized(true)
        console.log('Banco de dados inicializado com sucesso!')
      } else {
        setError(result.error || 'Erro desconhecido')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🗄️ Inicialização do Banco de Dados
        </h2>
        <p className="text-gray-600">
          Configure o banco de dados com dados iniciais para começar a usar o NichoFy.
        </p>
      </div>

      {!isInitialized && !error && (
        <div className="text-center">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              O que será criado:
            </h3>
            <ul className="text-left text-blue-800 space-y-1">
              <li>• 12 nichos especializados com templates</li>
              <li>• Configurações do sistema</li>
              <li>• Estrutura de dados inicial</li>
            </ul>
          </div>

          <Button
            onClick={initializeDatabase}
            disabled={isInitializing}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 text-lg"
          >
            {isInitializing ? 'Inicializando...' : '🚀 Inicializar Banco de Dados'}
          </Button>
        </div>
      )}

      {isInitializing && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Criando estrutura do banco de dados...</p>
        </div>
      )}

      {isInitialized && (
        <div className="text-center">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">
            Banco de Dados Inicializado!
          </h3>
          <p className="text-gray-600 mb-6">
            O banco de dados foi configurado com sucesso. Você pode começar a usar o sistema.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
          >
            🔄 Recarregar Página
          </Button>
        </div>
      )}

      {error && (
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h3 className="text-2xl font-bold text-red-900 mb-2">
            Erro na Inicialização
          </h3>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <Button
            onClick={initializeDatabase}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
          >
            🔄 Tentar Novamente
          </Button>
        </div>
      )}
    </div>
  )
}
