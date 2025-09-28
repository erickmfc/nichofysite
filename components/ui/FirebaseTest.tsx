'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { orderService, Order } from '@/lib/services/orderService'

export const FirebaseTest = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [orders, setOrders] = useState<Order[]>([])

  const testConnection = async () => {
    setLoading(true)
    try {
      // Testar criação de pedido
      const testOrder: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
        customerName: 'Cliente Teste',
        customerEmail: 'teste@exemplo.com',
        customerPhone: '(11) 99999-9999',
        niche: 'Gastronomia',
        contentType: 'Post Instagram',
        description: 'Post promocional para o Dia dos Pais',
        status: 'pending',
        priority: 'medium'
      }

      const orderId = await orderService.createOrder(testOrder)
      setResult(`✅ Pedido criado com sucesso! ID: ${orderId}`)
      
      // Buscar todos os pedidos
      const allOrders = await orderService.getAllOrders()
      setOrders(allOrders)
      
    } catch (error) {
      setResult(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setLoading(false)
    }
  }

  const loadOrders = async () => {
    setLoading(true)
    try {
      const allOrders = await orderService.getAllOrders()
      setOrders(allOrders)
      setResult(`✅ ${allOrders.length} pedidos carregados`)
    } catch (error) {
      setResult(`❌ Erro ao carregar pedidos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setLoading(false)
    }
  }

  const getStats = async () => {
    setLoading(true)
    try {
      const stats = await orderService.getOrderStats()
      setResult(`📊 Estatísticas: Total: ${stats.total}, Pendentes: ${stats.pending}, Processando: ${stats.processing}, Concluídos: ${stats.completed}`)
    } catch (error) {
      setResult(`❌ Erro ao buscar estatísticas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">🔥 Teste de Conexão Firebase</h2>
      
      <div className="space-y-4 mb-6">
        <Button 
          onClick={testConnection} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testando...' : '🧪 Testar Conexão e Criar Pedido'}
        </Button>
        
        <Button 
          onClick={loadOrders} 
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          {loading ? 'Carregando...' : '📋 Carregar Pedidos'}
        </Button>
        
        <Button 
          onClick={getStats} 
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          {loading ? 'Carregando...' : '📊 Ver Estatísticas'}
        </Button>
      </div>

      {result && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-mono">{result}</p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">📋 Pedidos no Banco:</h3>
          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{order.customerName}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Email:</strong> {order.customerEmail}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Nicho:</strong> {order.niche}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Tipo:</strong> {order.contentType}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Descrição:</strong> {order.description}
                </p>
                {order.createdAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    Criado em: {order.createdAt.toDate().toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
