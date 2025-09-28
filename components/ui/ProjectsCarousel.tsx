'use client'

import { useState, useEffect } from 'react'

interface Project {
  id: string
  title: string
  description: string
  image: string
  category: string
  client: string
  results: string[]
}

interface ProjectsCarouselProps {
  projects: Project[]
}

export const ProjectsCarousel: React.FC<ProjectsCarouselProps> = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [loadedProjects, setLoadedProjects] = useState<Project[]>([])

  // Projetos de exemplo se não houver projetos
  const exampleProjects: Project[] = [
    {
      id: '1',
      title: 'Cafeteria Artesanal',
      description: 'Criamos uma estratégia completa de conteúdo para uma cafeteria especializada em cafés premium, focando na experiência do cliente e na qualidade dos produtos.',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=800&fit=crop',
      category: 'Gastronomia',
      client: 'Café & Cia',
      results: ['+150% engajamento', '+80% seguidores', '+200% vendas online']
    },
    {
      id: '2',
      title: 'Barbearia Moderna',
      description: 'Desenvolvemos conteúdo visual impactante para uma barbearia que queria se posicionar como referência em cortes modernos e cuidados masculinos.',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=800&fit=crop',
      category: 'Beleza',
      client: 'Barbearia Style',
      results: ['+120% agendamentos', '+90% retenção', '+300% indicações']
    },
    {
      id: '3',
      title: 'Escritório de Advocacia',
      description: 'Criamos uma estratégia de conteúdo educativa para um escritório de direito trabalhista, estabelecendo autoridade e gerando leads qualificados.',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=800&fit=crop',
      category: 'Direito',
      client: 'Advocacia & Justiça',
      results: ['+180% leads', '+95% conversão', '+250% consultas']
    }
  ]

  // Carregar projetos automaticamente da pasta
  useEffect(() => {
    fetch('/api/projects')
      .then(response => response.json())
      .then(data => {
        console.log('Projetos carregados automaticamente:', data.projects)
        const formattedProjects = data.projects.map((project: any) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          image: project.image,
          category: project.category,
          client: project.client,
          results: project.results
        }))
        setLoadedProjects(formattedProjects)
      })
      .catch(error => {
        console.error('Erro ao carregar projetos:', error)
        setLoadedProjects([])
      })
  }, [])

  const displayProjects = loadedProjects.length > 0 ? loadedProjects : exampleProjects

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayProjects.length)
    }, 6000) // Aumentei para 6 segundos para dar mais tempo de apreciar

    return () => clearInterval(interval)
  }, [displayProjects.length, isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 12000) // Retoma auto-play após 12s
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + displayProjects.length) % displayProjects.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 12000)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayProjects.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 12000)
  }

  return (
    <section className="relative bg-gradient-to-b from-gray-950 to-gray-900 py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-500/5 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-yellow-400/5 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-primary-500/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Nossos Projetos em Destaque
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Veja alguns dos trabalhos incríveis que criamos para nossos clientes
          </p>
        </div>

        {/* Carrossel Principal */}
        <div className="relative">
          {/* Container do Slide */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/30">
            <div 
              className="flex transition-all duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {displayProjects.map((project, index) => (
                <div key={project.id} className="w-full flex-shrink-0">
                  <div className="grid lg:grid-cols-2 gap-0 min-h-[600px]">
                    {/* Imagem - Lado Esquerdo */}
                    <div className="relative p-8 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                      <div className="relative group">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full max-w-md h-[500px] object-contain rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-primary-500/25"
                        />
                        
                        {/* Overlay com categoria */}
                        <div className="absolute top-6 left-6">
                          <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                            {project.category}
                          </span>
                        </div>

                        {/* Efeito de brilho no hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </div>

                    {/* Conteúdo - Lado Direito */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-gray-800/80 to-gray-900/80">
                      <div className="max-w-lg">
                        {/* Título */}
                        <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                          {project.title}
                        </h3>
                        
                        {/* Descrição */}
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                          {project.description}
                        </p>
                        
                        {/* Cliente */}
                        <div className="mb-8">
                          <p className="text-gray-500 text-sm mb-2 font-medium">Cliente:</p>
                          <p className="text-white text-xl font-semibold">{project.client}</p>
                        </div>

                        {/* Resultados */}
                        <div>
                          <p className="text-gray-500 text-sm mb-4 font-medium">Resultados Alcançados:</p>
                          <div className="flex flex-wrap gap-3">
                            {project.results.map((result, idx) => (
                              <span
                                key={idx}
                                className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-medium border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10"
                              >
                                {result}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Setas de Navegação */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center mt-12 space-x-3">
          {displayProjects.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                w-4 h-4 rounded-full transition-all duration-300 hover:scale-125
                ${index === currentIndex
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 scale-125 shadow-lg shadow-primary-500/50'
                  : 'bg-gray-600 hover:bg-gray-500'
                }
              `}
            />
          ))}
        </div>

        {/* Contador */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            {currentIndex + 1} de {displayProjects.length} projetos
          </p>
        </div>
      </div>
    </section>
  )
}