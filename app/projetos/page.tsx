'use client'

import { ResponsiveTemplate } from '@/components/ui/ResponsiveTemplate'
import { ProjectsCarousel } from '@/components/ui/ProjectsCarousel'

export default function ProjectsPage() {
  return (
    <ResponsiveTemplate
      colorScheme="accent"
      title="Nossos Projetos"
      subtitle="Explore nossa galeria de projetos e veja como transformamos ideias em realidade digital"
      features={["🎨 Design premium", "📈 Resultados reais", "⚡ Entrega rápida"]}
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Projetos em Destaque
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Veja alguns dos trabalhos incríveis que criamos para nossos clientes e os resultados alcançados.
        </p>
      </div>

      <ProjectsCarousel projects={[]} />
    </ResponsiveTemplate>
  )
}