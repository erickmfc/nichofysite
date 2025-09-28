import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const projectsDir = path.join(process.cwd(), 'public', 'projects')
    
    // Verificar se a pasta existe
    if (!fs.existsSync(projectsDir)) {
      return NextResponse.json({ projects: [] })
    }

    // Ler todos os arquivos da pasta
    const files = fs.readdirSync(projectsDir)
    
    // Filtrar apenas arquivos de imagem
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return imageExtensions.includes(ext)
    })

    // Gerar projetos automaticamente
    const projects = imageFiles.map((file, index) => {
      const nameWithoutExt = path.parse(file).name
      const category = getCategoryFromName(nameWithoutExt)
      
      return {
        id: nameWithoutExt.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        title: formatTitle(nameWithoutExt),
        description: generateDescription(category),
        image: `/projects/${file}`,
        category: category,
        client: generateClientName(nameWithoutExt),
        results: generateResults(category),
        tags: generateTags(category),
        date: new Date().toISOString().split('T')[0],
        featured: true,
        url: '#'
      }
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Erro ao escanear projetos:', error)
    return NextResponse.json({ projects: [] }, { status: 500 })
  }
}

function getCategoryFromName(name: string): string {
  const nameLower = name.toLowerCase()
  
  if (nameLower.includes('cafe') || nameLower.includes('coffee') || nameLower.includes('restaurant') || nameLower.includes('food')) {
    return 'Gastronomia'
  }
  if (nameLower.includes('barber') || nameLower.includes('hair') || nameLower.includes('beauty') || nameLower.includes('salon')) {
    return 'Beleza'
  }
  if (nameLower.includes('law') || nameLower.includes('advocacy') || nameLower.includes('legal') || nameLower.includes('advocacia')) {
    return 'Direito'
  }
  if (nameLower.includes('gym') || nameLower.includes('fitness') || nameLower.includes('academy') || nameLower.includes('academia')) {
    return 'Saúde'
  }
  if (nameLower.includes('fashion') || nameLower.includes('clothes') || nameLower.includes('moda') || nameLower.includes('roupa')) {
    return 'Moda'
  }
  if (nameLower.includes('tech') || nameLower.includes('software') || nameLower.includes('app') || nameLower.includes('digital')) {
    return 'Tecnologia'
  }
  if (nameLower.includes('design') || nameLower.includes('brand') || nameLower.includes('logo') || nameLower.includes('creative')) {
    return 'Design'
  }
  
  return 'Geral'
}

function formatTitle(name: string): string {
  return name
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function generateDescription(category: string): string {
  const descriptions: Record<string, string> = {
    'Gastronomia': 'Conteúdo criativo para estabelecimentos gastronômicos',
    'Beleza': 'Posts sobre beleza e cuidados pessoais',
    'Direito': 'Conteúdo jurídico e consultoria legal',
    'Saúde': 'Posts motivacionais e dicas de saúde',
    'Moda': 'Conteúdo sobre moda e tendências',
    'Tecnologia': 'Posts sobre inovação e tecnologia',
    'Design': 'Conteúdo criativo e visual',
    'Geral': 'Conteúdo personalizado para seu negócio'
  }
  
  return descriptions[category] || descriptions['Geral']
}

function generateClientName(name: string): string {
  const nameLower = name.toLowerCase()
  
  if (nameLower.includes('cafe') || nameLower.includes('coffee')) {
    return 'Café & Cia'
  }
  if (nameLower.includes('barber') || nameLower.includes('hair')) {
    return 'Barbearia Style'
  }
  if (nameLower.includes('law') || nameLower.includes('advocacy')) {
    return 'Advocacia & Justiça'
  }
  if (nameLower.includes('gym') || nameLower.includes('fitness')) {
    return 'Academia Fit'
  }
  if (nameLower.includes('fashion') || nameLower.includes('clothes')) {
    return 'Moda & Estilo'
  }
  if (nameLower.includes('tech') || nameLower.includes('software')) {
    return 'Tech Solutions'
  }
  if (nameLower.includes('design') || nameLower.includes('brand')) {
    return 'Design Studio'
  }
  
  return 'Cliente Premium'
}

function generateResults(category: string): string[] {
  const resultsMap: Record<string, string[]> = {
    'Gastronomia': ['+150% engajamento', '+80% seguidores', '+200% vendas online'],
    'Beleza': ['+120% agendamentos', '+90% retenção', '+300% indicações'],
    'Direito': ['+180% leads', '+95% conversão', '+250% consultas'],
    'Saúde': ['+140% engajamento', '+85% conversão', '+220% agendamentos'],
    'Moda': ['+160% vendas', '+75% seguidores', '+190% tráfego'],
    'Tecnologia': ['+200% leads', '+90% conversão', '+280% downloads'],
    'Design': ['+170% engajamento', '+80% conversão', '+240% vendas'],
    'Geral': ['+130% engajamento', '+70% conversão', '+180% resultados']
  }
  
  return resultsMap[category] || resultsMap['Geral']
}

function generateTags(category: string): string[] {
  const tagMap: Record<string, string[]> = {
    'Gastronomia': ['Culinária', 'Restaurante', 'Chef'],
    'Beleza': ['Estética', 'Cuidados', 'Bem-estar'],
    'Direito': ['Jurídico', 'Consultoria', 'Legal'],
    'Saúde': ['Fitness', 'Bem-estar', 'Motivação'],
    'Moda': ['Fashion', 'Tendências', 'Style'],
    'Tecnologia': ['Inovação', 'Digital', 'Tech'],
    'Design': ['Criativo', 'Visual', 'Branding'],
    'Geral': ['Marketing', 'Conteúdo', 'Negócio']
  }
  
  return tagMap[category] || tagMap['Geral']
}
