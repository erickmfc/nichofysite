'use client'

export const HowItWorksSection: React.FC = () => {

  const steps = [
    {
      icon: '🎯',
      title: 'Escolha seu Nicho',
      description: 'Selecione sua área de atuação: Gastronomia, Saúde, Direito, Beleza, etc.',
      example: 'Gastronomia - Restaurante de comida italiana'
    },
    {
      icon: '💬',
      title: 'Peça seu Post',
      description: 'Descreva o que você precisa de forma simples e direta.',
      example: 'Promoção de pizza na terça-feira'
    },
    {
      icon: '⚡',
      title: 'Receba Pronto',
      description: 'Post profissional pronto em minutos no seu WhatsApp.',
      example: 'Post pronto com imagem, texto e hashtags'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-primary-50 relative overflow-hidden min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary-500/5 rounded-full animate-pulse" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-500/5 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Do pedido ao post pronto em{' '}
            <span className="text-primary-600">3 passos</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simples, rápido e eficiente. Veja como funciona:
          </p>
        </div>

        {/* Timeline Desktop */}
        <div className="hidden md:block">
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    {/* Número do Passo */}
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-2xl">
                      {index + 1}
                    </div>

                    {/* Ícone */}
                    <div className="text-5xl mb-4">
                      {step.icon}
                    </div>

                    {/* Conteúdo */}
                    <div className="max-w-sm mx-auto">
                      <h3 className="text-2xl font-bold mb-4 text-primary-600">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Exemplo */}
                      <div className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Exemplo:</p>
                        <p className="text-sm text-gray-600 italic">"{step.example}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Mobile */}
        <div className="md:hidden space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-6">
              {/* Número */}
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                {index + 1}
              </div>

              {/* Conteúdo */}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 text-primary-600">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                <p className="text-xs text-gray-500 italic">"{step.example}"</p>
              </div>

              {/* Ícone */}
              <div className="text-3xl">{step.icon}</div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-105 inline-block">
            🚀 Começar agora é grátis!
          </div>
        </div>
      </div>
    </section>
  )
}
