'use client'

import { ResponsiveTemplate } from '@/components/ui/ResponsiveTemplate'
import { Button } from '@/components/ui/Button'

export default function ExemplosPage() {
  return (
    <ResponsiveTemplate
      colorScheme="secondary"
      title="Exemplos de Conteúdo"
      subtitle="Veja exemplos reais de conteúdo criado para diferentes nichos"
      features={["📝 Templates prontos", "🎨 Design profissional", "📊 Métricas reais"]}
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Galeria de Exemplos
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore nossa biblioteca de conteúdo criado para diferentes nichos e veja a qualidade profissional.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 justify-center mb-12">
        <Button variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
          Todos
        </Button>
        <Button variant="outline">
          Direito
        </Button>
        <Button variant="outline">
          Saúde
        </Button>
        <Button variant="outline">
          Tecnologia
        </Button>
        <Button variant="outline">
          Posts
        </Button>
        <Button variant="outline">
          Artigos
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Exemplo 1 */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl">⚖️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Direito Digital</h3>
                <p className="text-sm text-gray-600">Post para LinkedIn</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Solicitação:</h4>
                <p className="text-gray-600">
                  "Preciso de um post sobre a nova LGPD para advogados"
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium mb-2">Conteúdo Gerado:</h4>
                <p className="text-gray-600">
                  "A LGPD trouxe mudanças significativas para o mercado jurídico. 
                  Como advogados, precisamos estar atentos às novas responsabilidades 
                  e oportunidades que surgem com a proteção de dados..."
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-6 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-300"
            >
              Criar Conteúdo Similar
            </Button>
          </div>
        </div>

        {/* Exemplo 2 */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👨‍⚕️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Saúde Preventiva</h3>
                <p className="text-sm text-gray-600">Post para Instagram</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Solicitação:</h4>
                <p className="text-gray-600">
                  "Quero um post sobre prevenção de doenças cardíacas"
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium mb-2">Conteúdo Gerado:</h4>
                <p className="text-gray-600">
                  "💓 Cuidar do coração é essencial! Confira 5 hábitos que podem 
                  prevenir doenças cardíacas: 1. Alimentação balanceada 2. Exercícios 
                  regulares 3. Controle do estresse..."
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-6 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-300"
            >
              Criar Conteúdo Similar
            </Button>
          </div>
        </div>

        {/* Exemplo 3 */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl">💻</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Tecnologia</h3>
                <p className="text-sm text-gray-600">Artigo para Blog</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Solicitação:</h4>
                <p className="text-gray-600">
                  "Preciso de um artigo sobre IA no desenvolvimento de software"
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium mb-2">Conteúdo Gerado:</h4>
                <p className="text-gray-600">
                  "A Inteligência Artificial está revolucionando o desenvolvimento 
                  de software. Desde automação de testes até geração de código, 
                  as possibilidades são infinitas..."
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-6 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-300"
            >
              Criar Conteúdo Similar
            </Button>
          </div>
        </div>

        {/* Exemplo 4 */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📝</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Roteiro de Vídeo</h3>
                <p className="text-sm text-gray-600">YouTube</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Solicitação:</h4>
                <p className="text-gray-600">
                  "Quero um roteiro para vídeo sobre marketing digital"
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium mb-2">Conteúdo Gerado:</h4>
                <p className="text-gray-600">
                  "[INTRO] Olá! Hoje vamos falar sobre estratégias de marketing 
                  digital que realmente funcionam. [DESENVOLVIMENTO] 1. Definição 
                  de público-alvo 2. Canais de distribuição..."
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-6 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-300"
            >
              Criar Conteúdo Similar
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveTemplate>
  )
}