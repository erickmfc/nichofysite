'use client'

import { Button } from '@/components/ui/Button'

export default function NichosPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
              Nichos Especializados
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Conteúdo técnico e especializado para cada área, desenvolvido por 
              profissionais com profundo conhecimento em cada nicho.
            </p>
          </div>
        </div>
      </section>

      {/* Nichos */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Nossos Nichos</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Direito */}
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">⚖️</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Direito</h3>
                <ul className="space-y-4 text-gray-600 mb-6">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Atualizações legislativas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Jurisprudência</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Direito digital</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Ver Exemplos
                </Button>
              </div>

              {/* Saúde */}
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">👨‍⚕️</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Saúde</h3>
                <ul className="space-y-4 text-gray-600 mb-6">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Saúde preventiva</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Bem-estar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Nutrição</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Ver Exemplos
                </Button>
              </div>

              {/* Tecnologia */}
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">💻</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Tecnologia</h3>
                <ul className="space-y-4 text-gray-600 mb-6">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Desenvolvimento</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Inovação</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Tendências</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Ver Exemplos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Especialização */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Nossa Especialização</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Conhecimento Técnico</h3>
                    <p className="text-gray-600">Especialistas em cada nicho</p>
                  </div>
                </div>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Profissionais certificados</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Experiência prática</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Atualização constante</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Recursos Especiais</h3>
                    <p className="text-gray-600">Ferramentas exclusivas</p>
                  </div>
                </div>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Bibliotecas especializadas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Templates personalizados</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Análise de tendências</span>
                  </li>
                </ul>
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
            Comece agora mesmo a gerar conteúdo profissional e especializado para seu nicho.
          </p>
          <Button variant="outline" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
            Começar Gratuitamente
          </Button>
        </div>
      </section>
    </main>
  )
} 