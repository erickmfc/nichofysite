export interface ContentTemplate {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: string
  platform: string
  template: string
  variables: string[]
  tips: string[]
}

export const CONTENT_TEMPLATES: ContentTemplate[] = [
  // Templates para Direito
  {
    id: 'direito-lei-nova',
    name: 'Nova Lei',
    description: 'Template para explicar mudanças legislativas',
    icon: '⚖️',
    color: 'from-blue-500 to-indigo-600',
    category: 'Direito',
    platform: 'Instagram',
    template: `⚖️ NOVA LEI: {titulo}

📋 O que mudou:
• {mudanca1}
• {mudanca2}
• {mudanca3}

💡 Impacto: {impacto}

⚠️ Atenção: {alerta}

#direito #leis #juridico #advocacia`,
    variables: ['titulo', 'mudanca1', 'mudanca2', 'mudanca3', 'impacto', 'alerta'],
    tips: [
      'Use linguagem clara e acessível',
      'Destaque os pontos mais importantes',
      'Inclua sempre o impacto prático'
    ]
  },

  // Templates para Saúde
  {
    id: 'saude-dica-prevencao',
    name: 'Dica de Prevenção',
    description: 'Template para dicas de saúde e prevenção',
    icon: '🏥',
    color: 'from-green-500 to-emerald-600',
    category: 'Saúde & Bem-Estar',
    platform: 'Instagram',
    template: `🏥 DICA DE SAÚDE: {titulo}

✅ O que fazer:
• {acao1}
• {acao2}
• {acao3}

❌ O que evitar:
• {evitar1}
• {evitar2}

💡 Lembre-se: {lembrete}

#saude #prevencao #bemestar #medicina`,
    variables: ['titulo', 'acao1', 'acao2', 'acao3', 'evitar1', 'evitar2', 'lembrete'],
    tips: [
      'Sempre consulte um profissional',
      'Use linguagem médica adequada',
      'Inclua avisos de responsabilidade'
    ]
  },

  // Templates para Tecnologia
  {
    id: 'tech-tutorial',
    name: 'Tutorial Tech',
    description: 'Template para tutoriais de tecnologia',
    icon: '💻',
    color: 'from-purple-500 to-pink-600',
    category: 'Tecnologia',
    platform: 'LinkedIn',
    template: `💻 TUTORIAL: {titulo}

🎯 Objetivo: {objetivo}

📋 Passo a passo:
1️⃣ {passo1}
2️⃣ {passo2}
3️⃣ {passo3}

💡 Dica extra: {dica}

🔗 Link útil: {link}

#tecnologia #tutorial #programacao #tech`,
    variables: ['titulo', 'objetivo', 'passo1', 'passo2', 'passo3', 'dica', 'link'],
    tips: [
      'Use screenshots quando possível',
      'Explique cada passo detalhadamente',
      'Inclua links para recursos adicionais'
    ]
  },

  // Templates para Marketing
  {
    id: 'marketing-case-sucesso',
    name: 'Case de Sucesso',
    description: 'Template para cases de sucesso em marketing',
    icon: '📈',
    color: 'from-orange-500 to-red-600',
    category: 'Marketing & Publicidade',
    platform: 'LinkedIn',
    template: `📈 CASE DE SUCESSO: {titulo}

🎯 Desafio: {desafio}

💡 Solução: {solucao}

📊 Resultados:
• {resultado1}
• {resultado2}
• {resultado3}

✨ Lição aprendida: {licao}

#marketing #casodesucesso #resultados #estrategia`,
    variables: ['titulo', 'desafio', 'solucao', 'resultado1', 'resultado2', 'resultado3', 'licao'],
    tips: [
      'Use dados concretos e métricas',
      'Conte uma história envolvente',
      'Destaque os aprendizados'
    ]
  },

  // Templates para Fitness
  {
    id: 'fitness-treino',
    name: 'Treino do Dia',
    description: 'Template para treinos e exercícios',
    icon: '💪',
    color: 'from-red-500 to-orange-600',
    category: 'Fitness & Esportes',
    platform: 'Instagram',
    template: `💪 TREINO DO DIA: {titulo}

🔥 Aquecimento: {aquecimento}

🏋️ Exercícios:
• {exercicio1} - {series1}
• {exercicio2} - {series2}
• {exercicio3} - {series3}

❄️ Alongamento: {alongamento}

💡 Dica: {dica}

#fitness #treino #exercicio #saude`,
    variables: ['titulo', 'aquecimento', 'exercicio1', 'series1', 'exercicio2', 'series2', 'exercicio3', 'series3', 'alongamento', 'dica'],
    tips: [
      'Inclua sempre aquecimento e alongamento',
      'Especifique séries e repetições',
      'Adicione dicas de segurança'
    ]
  },

  // Templates para Psicologia
  {
    id: 'psicologia-dica-mental',
    name: 'Dica de Saúde Mental',
    description: 'Template para dicas de psicologia e saúde mental',
    icon: '🧠',
    color: 'from-indigo-500 to-purple-600',
    category: 'Psicologia & Saúde Mental',
    platform: 'Instagram',
    template: `🧠 SAÚDE MENTAL: {titulo}

💭 O que é: {definicao}

✅ Como praticar:
• {pratica1}
• {pratica2}
• {pratica3}

⚠️ Sinais de alerta: {alerta}

💙 Lembre-se: {mensagem}

#saudemental #psicologia #bemestar #autocuidado`,
    variables: ['titulo', 'definicao', 'pratica1', 'pratica2', 'pratica3', 'alerta', 'mensagem'],
    tips: [
      'Use linguagem acolhedora e não-patologizante',
      'Inclua sempre recursos de ajuda',
      'Seja sensível com o tema'
    ]
  },

  // Templates para Gastronomia
  {
    id: 'gastronomia-receita',
    name: 'Receita Simples',
    description: 'Template para receitas culinárias',
    icon: '🍳',
    color: 'from-yellow-500 to-orange-600',
    category: 'Gastronomia',
    platform: 'Instagram',
    template: `🍳 RECEITA: {titulo}

⏱️ Tempo: {tempo}
👥 Porções: {porcoes}
💰 Custo: {custo}

🥘 Ingredientes:
• {ingrediente1}
• {ingrediente2}
• {ingrediente3}

👨‍🍳 Modo de preparo:
1️⃣ {passo1}
2️⃣ {passo2}
3️⃣ {passo3}

💡 Dica do chef: {dica}

#receita #gastronomia #culinaria #comida`,
    variables: ['titulo', 'tempo', 'porcoes', 'custo', 'ingrediente1', 'ingrediente2', 'ingrediente3', 'passo1', 'passo2', 'passo3', 'dica'],
    tips: [
      'Inclua sempre tempo e porções',
      'Use ingredientes acessíveis',
      'Seja claro no modo de preparo'
    ]
  },

  // Templates para Beleza
  {
    id: 'beleza-rotina',
    name: 'Rotina de Beleza',
    description: 'Template para rotinas de beleza e skincare',
    icon: '✨',
    color: 'from-pink-500 to-rose-600',
    category: 'Beleza & Estética',
    platform: 'Instagram',
    template: `✨ ROTINA DE BELEZA: {titulo}

🌅 Manhã:
• {manha1}
• {manha2}
• {manha3}

🌙 Noite:
• {noite1}
• {noite2}
• {noite3}

💡 Dica especial: {dica}

⚠️ Importante: {alerta}

#beleza #skincare #rotina #estetica`,
    variables: ['titulo', 'manha1', 'manha2', 'manha3', 'noite1', 'noite2', 'noite3', 'dica', 'alerta'],
    tips: [
      'Adapte para diferentes tipos de pele',
      'Inclua sempre proteção solar',
      'Seja específico com produtos'
    ]
  }
]

export const getTemplatesByCategory = (category: string) => {
  return CONTENT_TEMPLATES.filter(template => template.category === category)
}

export const getTemplatesByPlatform = (platform: string) => {
  return CONTENT_TEMPLATES.filter(template => template.platform === platform)
}

export const getTemplateById = (id: string) => {
  return CONTENT_TEMPLATES.find(template => template.id === id)
}
