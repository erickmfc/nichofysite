'use client'

import { useState } from 'react'

interface Project {
  id: string
  title: string
  description: string
  image: string
  category: string
  featured: boolean
}

interface ProjectsGridProps {
  projects: Project[]
  showFeatured?: boolean
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects, showFeatured = false }) => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  // Projetos de exemplo se não houver projetos
  const exampleProjects: Project[] = [
    {
      id: '1',
      title: 'Cafeteria Artesanal',
      description: 'Posts sobre café especial e ambiente aconchegante',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
      category: 'Gastronomia',
      featured: true
    },
    {
      id: '2',
      title: 'Barbearia Moderna',
      description: 'Conteúdo sobre cortes modernos e cuidados masculinos',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop',
      category: 'Beleza',
      featured: true
    },
    {
      id: '3',
      title: 'Escritório de Advocacia',
      description: 'Posts sobre direito trabalhista e consultoria',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop',
      category: 'Direito',
      featured: false
    }
  ]

  const displayProjects = projects.length > 0 ? projects : exampleProjects
  const filteredProjects = showFeatured 
    ? displayProjects.filter(project => project.featured)
    : displayProjects

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredProjects.map((project) => (
        <div
          key={project.id}
          className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          onMouseEnter={() => setHoveredProject(project.id)}
          onMouseLeave={() => setHoveredProject(null)}
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {project.category}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
              {project.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>
          
          {/* Overlay hover */}
          {hoveredProject === project.id && (
            <div className="absolute inset-0 bg-primary-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-center text-white">
                <div className="text-2xl mb-2">✨</div>
                <p className="font-medium">Ver Projeto</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}