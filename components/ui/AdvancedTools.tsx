'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface PerformanceComparison {
  periodo: string
  engajamento: number
  alcance: number
  conversao: number
}

export const AdvancedTools = () => {
  const [comparisonData, setComparisonData] = useState<PerformanceComparison[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateComparison = async () => {
    setIsGenerating(true)
    
    // Simular geração de comparação
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockData: PerformanceComparison[] = [
      {
        periodo: 'Última Semana',
        engajamento: 4.2,
        alcance: 12500,
        conversao: 2.8
      },
      {
        periodo: 'Semana Anterior',
        engajamento: 3.8,
        alcance: 11800,
        conversao: 2.5
      },
      {
        periodo: 'Média do Nicho',
        engajamento: 3.2,
        alcance: 9500,
        conversao: 1.9
      }
    ]
    
    setComparisonData(mockData)
    setIsGenerating(false)
  }

  const calculateEngagementRate = (likes: number, comments: number, shares: number, followers: number) => {
    const totalEngagement = likes + (comments * 2) + (shares * 3)
    return ((totalEngagement / followers) * 100).toFixed(2)
  }

  const analyzeHashtags = (hashtags: string[]) => {
    // Simular análise de hashtags
    return hashtags.map(hashtag => ({
      hashtag,
      volume: Math.random() > 0.5 ? 'Alto' : 'Médio',
      competition: Math.random() > 0.5 ? 'Alta' : 'Média',
      recommendation: Math.random() > 0.5 ? 'Recomendado' : 'Evitar'
    }))
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      
      {/* Comparador de Performance */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            📊 Comparador de Performance
          </h2>
          <Button
            onClick={generateComparison}
            disabled={isGenerating}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
          >
            {isGenerating ? 'Gerando...' : '🔄 Comparar'}
          </Button>
        </div>
        
        {comparisonData.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-600 mb-4">
              Compare sua performance com períodos anteriores
            </p>
            <Button
              onClick={generateComparison}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Iniciar Comparação
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {comparisonData.map((data, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                index === 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">{data.periodo}</h3>
                  {index === 0 && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Atual</span>}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">{data.engajamento}%</div>
                    <div className="text-gray-600">Engajamento</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{data.alcance.toLocaleString()}</div>
                    <div className="text-gray-600">Alcance</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-purple-600">{data.conversao}%</div>
                    <div className="text-gray-600">Conversão</div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">💡 Insights:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Seu engajamento cresceu 10.5% em relação à semana anterior</li>
                <li>• Performance 31% acima da média do nicho</li>
                <li>• Alcance aumentou 5.9% na última semana</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Calculadora Avançada de Engajamento */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          🧮 Calculadora Avançada de Engajamento
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curtidas
              </label>
              <input 
                type="number" 
                placeholder="500"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentários
              </label>
              <input 
                type="number" 
                placeholder="50"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compartilhamentos
              </label>
              <input 
                type="number" 
                placeholder="25"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seguidores
              </label>
              <input 
                type="number" 
                placeholder="10000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <Button className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg">
            🧮 Calcular Engajamento
          </Button>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-2">Resultado Detalhado:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Taxa de Engajamento:</span>
                <span className="font-semibold text-green-600">5.75%</span>
              </div>
              <div className="flex justify-between">
                <span>Engajamento por Tipo:</span>
                <span className="text-gray-600">Curtidas: 5.0% | Comentários: 1.0% | Shares: 0.75%</span>
              </div>
              <div className="flex justify-between">
                <span>Comparação com Nicho:</span>
                <span className="text-green-600">+79% acima da média</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analisador Avançado de Hashtags */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          🔍 Analisador Avançado de Hashtags
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coleção de Hashtags
            </label>
            <textarea 
              placeholder="#marketing #vendas #empreendedorismo #negocios #digital"
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nicho/Área
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="marketing">Marketing Digital</option>
              <option value="tecnologia">Tecnologia</option>
              <option value="saude">Saúde & Bem-estar</option>
              <option value="beleza">Beleza & Estética</option>
              <option value="educacao">Educação</option>
            </select>
          </div>
          
          <Button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg">
            🔍 Analisar Hashtags
          </Button>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-3">Análise Detalhada:</h3>
            <div className="space-y-3">
              {[
                { hashtag: '#marketing', volume: 'Alto', competition: 'Alta', recommendation: 'Moderar uso' },
                { hashtag: '#vendas', volume: 'Médio', competition: 'Média', recommendation: 'Recomendado' },
                { hashtag: '#empreendedorismo', volume: 'Baixo', competition: 'Baixa', recommendation: 'Excelente' },
                { hashtag: '#negocios', volume: 'Alto', competition: 'Alta', recommendation: 'Moderar uso' },
                { hashtag: '#digital', volume: 'Médio', competition: 'Média', recommendation: 'Recomendado' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="font-medium">{item.hashtag}</span>
                  <div className="flex space-x-2 text-xs">
                    <span className={`px-2 py-1 rounded ${
                      item.volume === 'Alto' ? 'bg-red-100 text-red-800' :
                      item.volume === 'Médio' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.volume}
                    </span>
                    <span className={`px-2 py-1 rounded ${
                      item.competition === 'Alta' ? 'bg-red-100 text-red-800' :
                      item.competition === 'Média' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.competition}
                    </span>
                    <span className={`px-2 py-1 rounded ${
                      item.recommendation === 'Excelente' ? 'bg-green-100 text-green-800' :
                      item.recommendation === 'Recomendado' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {item.recommendation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">💡 Recomendações:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Use 70% hashtags de baixo/médio volume</li>
                <li>• Inclua 30% hashtags de alto volume</li>
                <li>• Evite hashtags com competição muito alta</li>
                <li>• Teste combinações diferentes por post</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Planejador Inteligente */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          🤖 Planejador Inteligente de Posts
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objetivo Principal
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="engajamento">Aumentar Engajamento</option>
              <option value="alcance">Expandir Alcance</option>
              <option value="vendas">Gerar Vendas</option>
              <option value="autoridade">Construir Autoridade</option>
              <option value="comunidade">Fortalecer Comunidade</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nicho Principal
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="marketing">Marketing Digital</option>
              <option value="tecnologia">Tecnologia</option>
              <option value="saude">Saúde & Bem-estar</option>
              <option value="beleza">Beleza & Estética</option>
              <option value="educacao">Educação</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequência Ideal
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="diario">Diário (7 posts/semana)</option>
              <option value="alternado">Dia sim, dia não (4 posts/semana)</option>
              <option value="3x-semana">3x por semana</option>
              <option value="semanal">Semanal (1-2 posts)</option>
            </select>
          </div>
          
          <Button className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg">
            🤖 Gerar Estratégia Inteligente
          </Button>
          
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-gray-900 mb-3">Estratégia Recomendada:</h3>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border">
                <h4 className="font-medium text-gray-900 mb-1">Segunda-feira - Conteúdo Educativo</h4>
                <p className="text-sm text-gray-600">Post informativo sobre tendências do nicho</p>
                <div className="text-xs text-blue-600 mt-1">Horário: 12h-14h | Hashtags: 15-20</div>
              </div>
              
              <div className="p-3 bg-white rounded border">
                <h4 className="font-medium text-gray-900 mb-1">Quarta-feira - Story Interativo</h4>
                <p className="text-sm text-gray-600">Pergunta para engajar a audiência</p>
                <div className="text-xs text-green-600 mt-1">Horário: 18h-20h | Hashtags: 5-10</div>
              </div>
              
              <div className="p-3 bg-white rounded border">
                <h4 className="font-medium text-gray-900 mb-1">Sexta-feira - Reel Divertido</h4>
                <p className="text-sm text-gray-600">Conteúdo leve e entretenimento</p>
                <div className="text-xs text-purple-600 mt-1">Horário: 19h-21h | Hashtags: 20-25</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">📊 Projeção de Resultados:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-green-600">+25%</div>
                  <div className="text-gray-600">Engajamento</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-600">+18%</div>
                  <div className="text-gray-600">Alcance</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-600">+12%</div>
                  <div className="text-gray-600">Seguidores</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
