'use client'

import { Button } from '@/components/ui/Button'

export default function RedesSociaisPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
              Conteúdo Otimizado para Cada Rede Social
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Geramos conteúdo especializado e otimizado para cada plataforma, 
              respeitando suas particularidades e melhores práticas.
            </p>
          </div>
        </div>
      </section>

      {/* Plataformas */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Plataformas</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Instagram */}
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">📸</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Instagram</h3>
                <ul className="space-y-4 text-gray-600 mb-6">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Posts para feed e stories</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Legendas otimizadas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Hashtags relevantes</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Ver Exemplos
                </Button>
              </div>

              {/* LinkedIn */}
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">💼</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">LinkedIn</h3>
                <ul className="space-y-4 text-gray-600 mb-6">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Artigos profissionais</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Posts de autoridade</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Conteúdo B2B</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Ver Exemplos
                </Button>
              </div>

              {/* Facebook */}
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">👍</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Facebook</h3>
                <ul className="space-y-4 text-gray-600 mb-6">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Posts engajantes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Conteúdo viral</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-600">•</span>
                    <span>Comunidade ativa</span>
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

      {/* Casos de Sucesso */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Casos de Sucesso</h2>
            <div className="space-y-8">
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👨‍⚕️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Clínica Médica</h3>
                    <p className="text-gray-600">Instagram</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Aumento de 300% no engajamento após 3 meses de conteúdo especializado em saúde.
                </p>
                <div className="flex gap-4">
                  <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm">
                    +300% Engajamento
                  </span>
                  <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm">
                    +150% Seguidores
                  </span>
                </div>
              </div>

              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⚖️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Escritório de Advocacia</h3>
                    <p className="text-gray-600">LinkedIn</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Aumento de 200% em leads qualificados através de conteúdo jurídico especializado.
                </p>
                <div className="flex gap-4">
                  <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm">
                    +200% Leads
                  </span>
                  <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm">
                    +180% Conexões
                  </span>
                </div>
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
            Comece agora mesmo a gerar conteúdo profissional e especializado para suas redes sociais.
          </p>
          <Button variant="outline" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
            Saiba Mais
          </Button>
        </div>
      </section>
    </main>
  )
} 