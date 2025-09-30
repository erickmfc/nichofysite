'use client'

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  avatar: string
  rating: number
  metric?: string
}

interface TestimonialsProps {
  className?: string
}

export const Testimonials = ({ className = '' }: TestimonialsProps) => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Maria Silva',
      role: 'Advogada',
      company: 'Silva & Associados',
      content: 'Aumentei meu engajamento em 300% usando a NichoFy! A IA entende perfeitamente o tom jurídico e cria conteúdo que realmente conecta com meus clientes.',
      avatar: 'MS',
      rating: 5,
      metric: '+300% engajamento'
    },
    {
      id: 2,
      name: 'João Santos',
      role: 'Consultor Financeiro',
      company: 'Santos Investimentos',
      content: 'Economizo 4 horas por dia com a criação de conteúdo. A qualidade é impressionante e meus posts sempre performam bem.',
      avatar: 'JS',
      rating: 5,
      metric: '4h/dia economizadas'
    },
    {
      id: 3,
      name: 'Ana Costa',
      role: 'Nutricionista',
      company: 'Vida Saudável',
      content: 'Meus posts sobre nutrição ficaram muito mais profissionais e engajantes. Os clientes elogiam constantemente o conteúdo.',
      avatar: 'AC',
      rating: 5,
      metric: '+150% seguidores'
    },
    {
      id: 4,
      name: 'Carlos Mendes',
      role: 'Personal Trainer',
      company: 'Mendes Fitness',
      content: 'A NichoFy revolucionou minha presença digital. Agora consigo manter uma frequência constante de posts de qualidade.',
      avatar: 'CM',
      rating: 5,
      metric: '+200% vendas'
    },
    {
      id: 5,
      name: 'Patricia Lima',
      role: 'Psicóloga',
      company: 'Psicologia & Vida',
      content: 'O conteúdo gerado pela IA é sensível e apropriado para minha área. Meus pacientes se identificam muito com os posts.',
      avatar: 'PL',
      rating: 5,
      metric: '+180% agendamentos'
    },
    {
      id: 6,
      name: 'Roberto Alves',
      role: 'Contador',
      company: 'Alves Contabilidade',
      content: 'Transformei minha prática contábil com conteúdo educativo. Os clientes confiam mais em mim e indicam mais serviços.',
      avatar: 'RA',
      rating: 5,
      metric: '+250% indicações'
    }
  ]

  return (
    <div className={`${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          O que nossos clientes dizem
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Mais de 500 profissionais já transformaram sua presença digital com a NichoFy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            {/* Rating */}
            <div className="flex items-center mb-4">
              {Array.from({ length: testimonial.rating }, (_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Content */}
            <blockquote className="text-gray-700 mb-6 leading-relaxed">
              "{testimonial.content}"
            </blockquote>

            {/* Metric */}
            {testimonial.metric && (
              <div className="bg-orange-50 text-orange-600 px-3 py-2 rounded-lg text-sm font-semibold mb-4 inline-block">
                {testimonial.metric}
              </div>
            )}

            {/* Author */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {testimonial.avatar}
              </div>
              <div className="ml-4">
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
                <div className="text-xs text-gray-500">{testimonial.company}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 text-white text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-white/90">Clientes Ativos</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">10K+</div>
            <div className="text-white/90">Posts Criados</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">4.9★</div>
            <div className="text-white/90">Avaliação Média</div>
          </div>
        </div>
      </div>
    </div>
  )
}
