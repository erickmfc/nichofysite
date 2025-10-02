import { CONTENT_TEMPLATES, ContentTemplate } from '@/lib/data/contentTemplates'

export interface ContentRequest {
  topic: string
  description: string
  category: string
  platform: string
  templateId?: string
  tone: 'professional' | 'casual' | 'motivational' | 'educational'
  targetAudience: string
  keywords: string[]
}

export interface GeneratedContent {
  content: string
  hashtags: string[]
  suggestions: string[]
  estimatedEngagement: number
}

export const ContentGenerationService = {
  // Gerar conteúdo baseado no template
  async generateFromTemplate(request: ContentRequest): Promise<GeneratedContent> {
    const template = request.templateId 
      ? CONTENT_TEMPLATES.find(t => t.id === request.templateId)
      : this.selectBestTemplate(request)

    if (!template) {
      throw new Error('Template não encontrado')
    }

    // Simular geração de conteúdo com IA
    const generatedContent = await this.generateContentWithAI(request, template)
    
    return {
      content: generatedContent,
      hashtags: this.generateHashtags(request),
      suggestions: this.generateSuggestions(request),
      estimatedEngagement: this.calculateEngagement(request)
    }
  },

  // Selecionar melhor template baseado na categoria e plataforma
  selectBestTemplate(request: ContentRequest): ContentTemplate | undefined {
    const categoryTemplates = CONTENT_TEMPLATES.filter(t => t.category === request.category)
    const platformTemplates = categoryTemplates.filter(t => t.platform === request.platform)
    
    if (platformTemplates.length > 0) {
      return platformTemplates[0]
    }
    
    return categoryTemplates[0]
  },

  // Gerar conteúdo usando IA (simulado)
  async generateContentWithAI(request: ContentRequest, template: ContentTemplate): Promise<string> {
    // Simular delay de IA
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Gerar conteúdo baseado no template
    let content = template.template
    
    // Substituir variáveis com conteúdo gerado
    const variables = this.generateVariables(request, template)
    
    template.variables.forEach(variable => {
      const value = variables[variable] || `[${variable}]`
      content = content.replace(new RegExp(`{${variable}}`, 'g'), value)
    })
    
    return content
  },

  // Gerar valores para as variáveis do template
  generateVariables(request: ContentRequest, template: ContentTemplate): Record<string, string> {
    const variables: Record<string, string> = {}
    
    // Gerar conteúdo baseado no tópico e descrição
    const topic = request.topic
    const description = request.description
    
    // Lógica específica por categoria
    switch (request.category) {
      case 'Direito':
        variables.titulo = topic
        variables.mudanca1 = `Nova regulamentação sobre ${topic.toLowerCase()}`
        variables.mudanca2 = `Alterações nos procedimentos`
        variables.mudanca3 = `Novos prazos estabelecidos`
        variables.impacto = description
        variables.alerta = 'Consulte sempre um advogado especializado'
        break
        
      case 'Saúde & Bem-Estar':
        variables.titulo = topic
        variables.acao1 = `Prática regular de ${topic.toLowerCase()}`
        variables.acao2 = 'Manter alimentação equilibrada'
        variables.acao3 = 'Consultar médico regularmente'
        variables.evitar1 = 'Automedicação'
        variables.evitar2 = 'Ignorar sintomas'
        variables.lembrete = description
        break
        
      case 'Tecnologia':
        variables.titulo = topic
        variables.objetivo = description
        variables.passo1 = `Configurar ${topic.toLowerCase()}`
        variables.passo2 = 'Testar funcionalidades'
        variables.passo3 = 'Otimizar configurações'
        variables.dica = 'Sempre faça backup antes de mudanças'
        variables.link = 'Link para documentação oficial'
        break
        
      case 'Marketing & Publicidade':
        variables.titulo = topic
        variables.desafio = description
        variables.solucao = `Estratégia focada em ${topic.toLowerCase()}`
        variables.resultado1 = 'Aumento de 30% no engajamento'
        variables.resultado2 = 'Melhoria na conversão'
        variables.resultado3 = 'ROI positivo em 3 meses'
        variables.licao = 'Foco no público-alvo é fundamental'
        break
        
      case 'Fitness & Esportes':
        variables.titulo = topic
        variables.aquecimento = '5 minutos de cardio leve'
        variables.exercicio1 = topic
        variables.series1 = '3x12'
        variables.exercicio2 = 'Exercício complementar'
        variables.series2 = '3x10'
        variables.exercicio3 = 'Exercício final'
        variables.series3 = '3x8'
        variables.alongamento = '10 minutos de alongamento'
        variables.dica = description
        break
        
      case 'Psicologia & Saúde Mental':
        variables.titulo = topic
        variables.definicao = description
        variables.pratica1 = 'Respiração consciente'
        variables.pratica2 = 'Meditação diária'
        variables.pratica3 = 'Exercícios físicos regulares'
        variables.alerta = 'Procure ajuda profissional se necessário'
        variables.mensagem = 'Sua saúde mental é prioridade'
        break
        
      case 'Gastronomia':
        variables.titulo = topic
        variables.tempo = '30 minutos'
        variables.porcoes = '4 pessoas'
        variables.custo = 'R$ 25,00'
        variables.ingrediente1 = topic
        variables.ingrediente2 = 'Ingrediente principal'
        variables.ingrediente3 = 'Temperos essenciais'
        variables.passo1 = 'Preparar os ingredientes'
        variables.passo2 = 'Cozinhar conforme receita'
        variables.passo3 = 'Finalizar e servir'
        variables.dica = description
        break
        
      case 'Beleza & Estética':
        variables.titulo = topic
        variables.manha1 = 'Limpeza facial'
        variables.manha2 = 'Hidratação'
        variables.manha3 = 'Proteção solar'
        variables.noite1 = 'Remoção de maquiagem'
        variables.noite2 = 'Esfoliação suave'
        variables.noite3 = 'Hidratação noturna'
        variables.dica = description
        variables.alerta = 'Teste sempre em pequena área'
        break
        
      default:
        // Template genérico
        variables.titulo = topic
        variables.descricao = description
        break
    }
    
    return variables
  },

  // Gerar hashtags relevantes
  generateHashtags(request: ContentRequest): string[] {
    const baseHashtags = [
      request.category.toLowerCase().replace(/\s+/g, ''),
      request.platform.toLowerCase(),
      'conteudo',
      'marketing'
    ]
    
    // Adicionar hashtags específicas por categoria
    const categoryHashtags = this.getCategoryHashtags(request.category)
    const topicHashtags = this.getTopicHashtags(request.topic)
    
    return [...baseHashtags, ...categoryHashtags, ...topicHashtags].slice(0, 10)
  },

  // Obter hashtags por categoria
  getCategoryHashtags(category: string): string[] {
    const hashtags: Record<string, string[]> = {
      'Direito': ['advocacia', 'juridico', 'leis', 'justica'],
      'Saúde & Bem-Estar': ['saude', 'bemestar', 'medicina', 'prevencao'],
      'Tecnologia': ['tech', 'programacao', 'inovacao', 'digital'],
      'Marketing & Publicidade': ['marketing', 'publicidade', 'estrategia', 'vendas'],
      'Fitness & Esportes': ['fitness', 'treino', 'exercicio', 'saude'],
      'Psicologia & Saúde Mental': ['psicologia', 'saudemental', 'bemestar', 'autocuidado'],
      'Gastronomia': ['receita', 'culinaria', 'comida', 'chef'],
      'Beleza & Estética': ['beleza', 'skincare', 'estetica', 'rotina']
    }
    
    return hashtags[category] || []
  },

  // Obter hashtags por tópico
  getTopicHashtags(topic: string): string[] {
    const words = topic.toLowerCase().split(' ')
    return words.filter(word => word.length > 3).slice(0, 3)
  },

  // Gerar sugestões de melhoria
  generateSuggestions(request: ContentRequest): string[] {
    const suggestions = [
      'Adicione uma imagem chamativa',
      'Use emojis para destacar pontos importantes',
      'Inclua uma call-to-action clara',
      'Teste diferentes horários de publicação',
      'Engaje com comentários rapidamente'
    ]
    
    // Sugestões específicas por plataforma
    if (request.platform === 'Instagram') {
      suggestions.push('Use stories para complementar o post')
      suggestions.push('Adicione localização se relevante')
    } else if (request.platform === 'LinkedIn') {
      suggestions.push('Compartilhe insights profissionais')
      suggestions.push('Use dados e estatísticas')
    }
    
    return suggestions.slice(0, 5)
  },

  // Calcular estimativa de engajamento
  calculateEngagement(request: ContentRequest): number {
    let score = 50 // Base score
    
    // Ajustar baseado na categoria
    const categoryScores: Record<string, number> = {
      'Direito': 60,
      'Saúde & Bem-Estar': 70,
      'Tecnologia': 65,
      'Marketing & Publicidade': 75,
      'Fitness & Esportes': 80,
      'Psicologia & Saúde Mental': 75,
      'Gastronomia': 85,
      'Beleza & Estética': 80
    }
    
    score += categoryScores[request.category] || 0
    
    // Ajustar baseado na plataforma
    const platformScores: Record<string, number> = {
      'Instagram': 80,
      'LinkedIn': 60,
      'Facebook': 70,
      'Twitter': 65
    }
    
    score += platformScores[request.platform] || 0
    
    // Ajustar baseado no tom
    const toneScores: Record<string, number> = {
      'motivational': 85,
      'educational': 70,
      'professional': 60,
      'casual': 75
    }
    
    score += toneScores[request.tone] || 0
    
    return Math.min(100, Math.max(0, score))
  }
}
