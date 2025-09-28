import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Analytics</h1>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Total de Visualizações</h2>
              <p className="text-3xl font-bold text-blue-600">12.4K</p>
              <p className="text-sm text-green-600">+15% vs mês anterior</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Engajamento</h2>
              <p className="text-3xl font-bold text-green-600">4.2%</p>
              <p className="text-sm text-green-600">+8% vs mês anterior</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Novos Seguidores</h2>
              <p className="text-3xl font-bold text-purple-600">156</p>
              <p className="text-sm text-green-600">+12% vs mês anterior</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Conteúdos Criados</h2>
              <p className="text-3xl font-bold text-orange-600">24</p>
              <p className="text-sm text-green-600">+20% vs mês anterior</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Performance por Plataforma</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-pink-500 rounded-full mr-3"></div>
                    <span>Instagram</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">8.2K visualizações</div>
                    <div className="text-sm text-gray-500">66% do total</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                    <span>LinkedIn</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">3.1K visualizações</div>
                    <div className="text-sm text-gray-500">25% do total</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    <span>Blog</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">1.1K visualizações</div>
                    <div className="text-sm text-gray-500">9% do total</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Top Conteúdos</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium">Direito Trabalhista</span>
                    <div className="text-sm text-gray-500">Post Instagram</div>
                  </div>
                  <span className="font-semibold">2.1K</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium">Saúde Mental</span>
                    <div className="text-sm text-gray-500">Artigo Blog</div>
                  </div>
                  <span className="font-semibold">1.8K</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium">Tecnologia IA</span>
                    <div className="text-sm text-gray-500">Post LinkedIn</div>
                  </div>
                  <span className="font-semibold">1.5K</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-medium">Marketing Digital</span>
                    <div className="text-sm text-gray-500">Story Instagram</div>
                  </div>
                  <span className="font-semibold">1.2K</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Evolução dos Últimos 30 Dias</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <p className="text-gray-600">Gráfico de evolução</p>
                <p className="text-sm text-gray-500">Visualizações por dia</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Insights e Recomendações</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-600 mb-2">✅ Pontos Fortes</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Conteúdos sobre Direito têm maior engajamento</li>
                  <li>• Posts no Instagram geram mais visualizações</li>
                  <li>• Horário das 14h-16h tem melhor performance</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-600 mb-2">💡 Oportunidades</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Aumentar frequência de posts sobre Saúde</li>
                  <li>• Testar mais conteúdo no LinkedIn</li>
                  <li>• Criar mais Stories interativos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
