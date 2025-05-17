'use client'

import { Button } from '@/components/ui/Button'

export default function ExemplosPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
              Exemplos de Conteúdo
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Conheça alguns exemplos do conteúdo especializado que geramos para diferentes nichos.
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="outline" className="bg-primary-50 text-primary-600">
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
              <Button variant="outline">
                Roteiros
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Exemplo 1 */}
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
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
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-medium mb-2">Conteúdo Gerado:</h4>
                    <p className="text-gray-600">
                      "A LGPD trouxe mudanças significativas para o mercado jurídico. 
                      Como advogados, precisamos estar atentos às novas responsabilidades 
                      e oportunidades que surgem com a proteção de dados..."
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-6">
                  Criar Conteúdo Similar
                </Button>
              </div>

              {/* Exemplo 2 */}
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
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
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-medium mb-2">Conteúdo Gerado:</h4>
                    <p className="text-gray-600">
                      "💓 Cuidar do coração é essencial! Confira 5 hábitos que podem 
                      prevenir doenças cardíacas: 1. Alimentação balanceada 2. Exercícios 
                      regulares 3. Controle do estresse..."
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-6">
                  Criar Conteúdo Similar
                </Button>
              </div>

              {/* Exemplo 3 */}
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
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
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-medium mb-2">Conteúdo Gerado:</h4>
                    <p className="text-gray-600">
                      "A Inteligência Artificial está revolucionando o desenvolvimento 
                      de software. Desde automação de testes até geração de código, 
                      as possibilidades são infinitas..."
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-6">
                  Criar Conteúdo Similar
                </Button>
              </div>

              {/* Exemplo 4 */}
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
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
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-medium mb-2">Conteúdo Gerado:</h4>
                    <p className="text-gray-600">
                      "[INTRO] Olá! Hoje vamos falar sobre estratégias de marketing 
                      digital que realmente funcionam. [DESENVOLVIMENTO] 1. Definição 
                      de público-alvo 2. Canais de distribuição..."
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-6">
                  Criar Conteúdo Similar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Pronto para transformar sua presença digital?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Comece agora mesmo a gerar conteúdo profissional e especializado.
          </p>
          <Button variant="outline" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
            Começar Gratuitamente
          </Button>
        </div>
      </section>
    </main>
  )
} 