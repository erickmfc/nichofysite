// Dados iniciais para popular o banco de dados
import type { Nicho, Template, Settings } from '@/lib/types'

// Nichos iniciais
export const initialNichos: Omit<Nicho, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Direito',
    description: 'Conteúdo jurídico especializado e atualizações legislativas',
    icon: '⚖️',
    color: 'from-blue-600 to-blue-800',
    isActive: true,
    topics: [
      'Atualizações legislativas',
      'Jurisprudência e Casos Reais',
      'Direito do Consumidor e Dicas',
      'Direito Trabalhista',
      'Direito Civil e Comercial'
    ],
    templates: [
      {
        id: 'direito-1',
        name: 'Atualização Legislativa',
        content: '📋 Nova lei em vigor! {data_lei}\n\n{resumo_lei}\n\n💡 O que isso significa para você:\n• {impacto_1}\n• {impacto_2}\n• {impacto_3}\n\n#Direito #Legislação #Atualização',
        variables: ['data_lei', 'resumo_lei', 'impacto_1', 'impacto_2', 'impacto_3']
      },
      {
        id: 'direito-2',
        name: 'Dica Jurídica',
        content: '⚖️ Dica Jurídica: {titulo_dica}\n\n{dica_conteudo}\n\n⚠️ Importante: {observacao}\n\n📞 Precisa de ajuda? Entre em contato!\n\n#Direito #DicaJurídica #ConsulteAdvogado',
        variables: ['titulo_dica', 'dica_conteudo', 'observacao']
      }
    ]
  },
  {
    name: 'Saúde & Bem-Estar',
    description: 'Conteúdo sobre saúde preventiva e bem-estar',
    icon: '👨‍⚕️',
    color: 'from-green-500 to-emerald-600',
    isActive: true,
    topics: [
      'Saúde preventiva e Dicas',
      'Bem-estar mental e físico',
      'Nutrição e Receitas Saudáveis',
      'Exercícios e Fitness',
      'Medicina Preventiva'
    ],
    templates: [
      {
        id: 'saude-1',
        name: 'Dica de Saúde',
        content: '🏥 Dica de Saúde: {titulo_dica}\n\n{dica_conteudo}\n\n✅ Benefícios:\n• {beneficio_1}\n• {beneficio_2}\n• {beneficio_3}\n\n#Saúde #BemEstar #Prevenção',
        variables: ['titulo_dica', 'dica_conteudo', 'beneficio_1', 'beneficio_2', 'beneficio_3']
      },
      {
        id: 'saude-2',
        name: 'Alimentação Saudável',
        content: '🥗 Receita Saudável: {nome_receita}\n\nIngredientes:\n• {ingrediente_1}\n• {ingrediente_2}\n• {ingrediente_3}\n\nModo de preparo:\n{preparo}\n\n#AlimentaçãoSaudável #Receita #Nutrição',
        variables: ['nome_receita', 'ingrediente_1', 'ingrediente_2', 'ingrediente_3', 'preparo']
      }
    ]
  },
  {
    name: 'Tecnologia',
    description: 'Inovação, desenvolvimento e tendências tech',
    icon: '💻',
    color: 'from-purple-500 to-indigo-600',
    isActive: true,
    topics: [
      'Desenvolvimento e Ferramentas',
      'Inovação e Inteligência Artificial',
      'Tendências e Notícias do Mercado',
      'Programação e Código',
      'Startups e Empreendedorismo'
    ],
    templates: [
      {
        id: 'tech-1',
        name: 'Tendência Tech',
        content: '🚀 Tendência Tech: {titulo_tendencia}\n\n{descricao_tendencia}\n\n💡 Impacto:\n• {impacto_1}\n• {impacto_2}\n\n#Tecnologia #Inovação #Tendências',
        variables: ['titulo_tendencia', 'descricao_tendencia', 'impacto_1', 'impacto_2']
      },
      {
        id: 'tech-2',
        name: 'Dica de Programação',
        content: '💻 Dica de Programação: {linguagem}\n\n{dica_conteudo}\n\nExemplo:\n```\n{codigo_exemplo}\n```\n\n#Programação #{linguagem} #Desenvolvimento',
        variables: ['linguagem', 'dica_conteudo', 'codigo_exemplo']
      }
    ]
  },
  {
    name: 'Gastronomia & Alimentação',
    description: 'Conteúdo gastronômico e culinário',
    icon: '🍔',
    color: 'from-orange-500 to-red-600',
    isActive: true,
    topics: [
      'Prato do dia e Novidades do Cardápio',
      'Bastidores da Cozinha e Ingredientes',
      'Promoções, Eventos e Happy Hour',
      'Receitas e Dicas Culinárias',
      'Especialidades da Casa'
    ],
    templates: [
      {
        id: 'gastronomia-1',
        name: 'Prato do Dia',
        content: '🍽️ Prato do Dia: {nome_prato}\n\n{descricao_prato}\n\n💰 Valor: R$ {preco}\n\n⏰ Disponível até: {horario}\n\n#PratoDoDia #Gastronomia #Cardápio',
        variables: ['nome_prato', 'descricao_prato', 'preco', 'horario']
      },
      {
        id: 'gastronomia-2',
        name: 'Promoção',
        content: '🎉 Promoção Especial!\n\n{promo_descricao}\n\n💰 Desconto: {desconto}\n\n📅 Válido até: {data_validade}\n\n#Promoção #Oferta #Gastronomia',
        variables: ['promo_descricao', 'desconto', 'data_validade']
      }
    ]
  },
  {
    name: 'Beleza & Estética',
    description: 'Conteúdo sobre beleza e cuidados pessoais',
    icon: '💇‍♀️',
    color: 'from-pink-500 to-rose-600',
    isActive: true,
    topics: [
      'Transformações (Antes e Depois)',
      'Dicas de Autocuidado (Skincare, Cabelo)',
      'Divulgação de Serviços e Agendamentos',
      'Produtos e Tratamentos',
      'Tendências de Beleza'
    ],
    templates: [
      {
        id: 'beleza-1',
        name: 'Transformação',
        content: '✨ Transformação Incrível!\n\n{descricao_transformacao}\n\n📅 Antes: {data_antes}\n📅 Depois: {data_depois}\n\n💡 Resultado: {resultado}\n\n#Transformação #Beleza #Resultado',
        variables: ['descricao_transformacao', 'data_antes', 'data_depois', 'resultado']
      },
      {
        id: 'beleza-2',
        name: 'Dica de Beleza',
        content: '💄 Dica de Beleza: {titulo_dica}\n\n{dica_conteudo}\n\n✅ Benefícios:\n• {beneficio_1}\n• {beneficio_2}\n\n#Beleza #Dica #Cuidados',
        variables: ['titulo_dica', 'dica_conteudo', 'beneficio_1', 'beneficio_2']
      }
    ]
  },
  {
    name: 'Varejo & E-commerce',
    description: 'Conteúdo para lojas físicas e online',
    icon: '🛍️',
    color: 'from-cyan-500 to-blue-600',
    isActive: true,
    topics: [
      'Lançamentos e Novidades da Semana',
      'Ofertas, Cupons e Liquidações',
      'Looks, Combinações e Dicas de Uso',
      'Produtos em Destaque',
      'Tendências de Moda'
    ],
    templates: [
      {
        id: 'varejo-1',
        name: 'Lançamento',
        content: '🆕 Lançamento: {nome_produto}\n\n{descricao_produto}\n\n💰 Preço: R$ {preco}\n\n🚚 Frete grátis para todo o Brasil!\n\n#Lançamento #Novidade #Moda',
        variables: ['nome_produto', 'descricao_produto', 'preco']
      },
      {
        id: 'varejo-2',
        name: 'Oferta',
        content: '🔥 Oferta Imperdível!\n\n{produto_oferta}\n\n💰 De: R$ {preco_original}\n💰 Por: R$ {preco_oferta}\n\n⏰ Apenas hoje!\n\n#Oferta #Promoção #Desconto',
        variables: ['produto_oferta', 'preco_original', 'preco_oferta']
      }
    ]
  },
  {
    name: 'Fitness & Esportes',
    description: 'Conteúdo sobre exercícios e vida saudável',
    icon: '💪',
    color: 'from-yellow-500 to-orange-500',
    isActive: true,
    topics: [
      'Dicas de Treino e Exercícios',
      'Receitas e Nutrição Esportiva',
      'Motivação e Resultados de Alunos',
      'Equipamentos e Acessórios',
      'Modalidades Esportivas'
    ],
    templates: [
      {
        id: 'fitness-1',
        name: 'Dica de Treino',
        content: '💪 Dica de Treino: {nome_exercicio}\n\n{descricao_exercicio}\n\n🎯 Músculos trabalhados:\n• {musculo_1}\n• {musculo_2}\n\n#Treino #Exercício #Fitness',
        variables: ['nome_exercicio', 'descricao_exercicio', 'musculo_1', 'musculo_2']
      },
      {
        id: 'fitness-2',
        name: 'Resultado de Aluno',
        content: '🏆 Resultado Incrível!\n\n{aluno_nome} conseguiu {resultado}\n\n📅 Tempo: {tempo_resultado}\n\n💪 Dedicação e foco!\n\n#Resultado #Sucesso #Fitness',
        variables: ['aluno_nome', 'resultado', 'tempo_resultado']
      }
    ]
  },
  {
    name: 'Mercado Imobiliário',
    description: 'Conteúdo sobre imóveis e investimentos',
    icon: '🏠',
    color: 'from-teal-500 to-green-600',
    isActive: true,
    topics: [
      'Imóvel da Semana (Venda/Aluguel)',
      'Dicas de Compra, Venda e Financiamento',
      'Notícias e Tendências do Mercado Local',
      'Investimentos Imobiliários',
      'Financiamento e Crédito'
    ],
    templates: [
      {
        id: 'imobiliario-1',
        name: 'Imóvel em Destaque',
        content: '🏠 Imóvel em Destaque!\n\n{tipo_imovel} em {bairro}\n\n📐 {area_total}m²\n🛏️ {quartos} quartos\n🚿 {banheiros} banheiros\n\n💰 Valor: R$ {valor}\n\n#Imóvel #Venda #Oportunidade',
        variables: ['tipo_imovel', 'bairro', 'area_total', 'quartos', 'banheiros', 'valor']
      },
      {
        id: 'imobiliario-2',
        name: 'Dica de Investimento',
        content: '💡 Dica de Investimento Imobiliário\n\n{dica_conteudo}\n\n📈 Potencial de valorização: {valorizacao}\n\n#Investimento #Imóveis #Oportunidade',
        variables: ['dica_conteudo', 'valorizacao']
      }
    ]
  },
  {
    name: 'Contabilidade & Finanças',
    description: 'Conteúdo financeiro e contábil',
    icon: '👔',
    color: 'from-gray-600 to-gray-800',
    isActive: true,
    topics: [
      'Dicas de Gestão para MEI e PMEs',
      'Prazos e Obrigações Fiscais (ex: IR)',
      'Educação Financeira para Empreendedores',
      'Planejamento Tributário',
      'Controle Financeiro'
    ],
    templates: [
      {
        id: 'contabilidade-1',
        name: 'Prazo Fiscal',
        content: '📅 Prazo Fiscal: {prazo_nome}\n\n⏰ Vencimento: {data_vencimento}\n\n📋 O que fazer:\n{orientacoes}\n\n⚠️ Atenção: Evite multas!\n\n#PrazoFiscal #Obrigação #Contabilidade',
        variables: ['prazo_nome', 'data_vencimento', 'orientacoes']
      },
      {
        id: 'contabilidade-2',
        name: 'Dica de Gestão',
        content: '💼 Dica de Gestão: {titulo_dica}\n\n{dica_conteudo}\n\n✅ Benefícios:\n• {beneficio_1}\n• {beneficio_2}\n\n#Gestão #Empreendedorismo #Contabilidade',
        variables: ['titulo_dica', 'dica_conteudo', 'beneficio_1', 'beneficio_2']
      }
    ]
  },
  {
    name: 'Pet Shops & Veterinária',
    description: 'Conteúdo sobre cuidados com animais',
    icon: '🐾',
    color: 'from-amber-500 to-yellow-600',
    isActive: true,
    topics: [
      'Dicas de Cuidado e Saúde Animal',
      'Produtos e Novidades da Loja',
      'Fotos de "Clientes" (Pets) e Curiosidades',
      'Vacinação e Prevenção',
      'Alimentação e Nutrição'
    ],
    templates: [
      {
        id: 'pets-1',
        name: 'Dica de Cuidado',
        content: '🐾 Dica de Cuidado: {titulo_dica}\n\n{dica_conteudo}\n\n✅ Benefícios:\n• {beneficio_1}\n• {beneficio_2}\n\n#PetCare #Cuidados #Animais',
        variables: ['titulo_dica', 'dica_conteudo', 'beneficio_1', 'beneficio_2']
      },
      {
        id: 'pets-2',
        name: 'Cliente Pet',
        content: '🐕 Cliente da Semana: {pet_nome}\n\n{pet_descricao}\n\n📸 {foto_descricao}\n\n#Pet #Cliente #Fofura',
        variables: ['pet_nome', 'pet_descricao', 'foto_descricao']
      }
    ]
  },
  {
    name: 'Educação & Cursos',
    description: 'Conteúdo educacional e cursos',
    icon: '📚',
    color: 'from-indigo-500 to-purple-600',
    isActive: true,
    topics: [
      'Dicas de Estudo e Aprendizado',
      'Divulgação de Cursos, Aulas e Workshops',
      'Depoimentos e Histórias de Sucesso de Alunos',
      'Metodologias de Ensino',
      'Certificações e Qualificações'
    ],
    templates: [
      {
        id: 'educacao-1',
        name: 'Dica de Estudo',
        content: '📚 Dica de Estudo: {titulo_dica}\n\n{dica_conteudo}\n\n🎯 Resultado esperado:\n{resultado_esperado}\n\n#Educação #Estudo #Aprendizado',
        variables: ['titulo_dica', 'dica_conteudo', 'resultado_esperado']
      },
      {
        id: 'educacao-2',
        name: 'Novo Curso',
        content: '🎓 Novo Curso: {nome_curso}\n\n{descricao_curso}\n\n⏰ Duração: {duracao}\n💰 Investimento: R$ {preco}\n\n📝 Inscrições abertas!\n\n#Curso #Educação #Oportunidade',
        variables: ['nome_curso', 'descricao_curso', 'duracao', 'preco']
      }
    ]
  },
  {
    name: 'Turismo & Hotelaria',
    description: 'Conteúdo sobre viagens e hospedagem',
    icon: '✈️',
    color: 'from-sky-500 to-blue-600',
    isActive: true,
    topics: [
      'Promoções de Pacotes e Diárias',
      'Dicas de Viagem e Roteiros Locais',
      'Apresentação da Estrutura (Hotel/Pousada)',
      'Eventos e Atrações',
      'Gastronomia Local'
    ],
    templates: [
      {
        id: 'turismo-1',
        name: 'Promoção de Pacote',
        content: '✈️ Pacote Promocional!\n\n{destino} - {duracao}\n\n💰 De: R$ {preco_original}\n💰 Por: R$ {preco_promocional}\n\n📅 Válido até: {data_validade}\n\n#Turismo #Promoção #Viagem',
        variables: ['destino', 'duracao', 'preco_original', 'preco_promocional', 'data_validade']
      },
      {
        id: 'turismo-2',
        name: 'Dica de Viagem',
        content: '🗺️ Dica de Viagem: {titulo_dica}\n\n{dica_conteudo}\n\n📍 Local: {local}\n\n#Turismo #Dica #Viagem',
        variables: ['titulo_dica', 'dica_conteudo', 'local']
      }
    ]
  }
]

// Configurações iniciais do sistema
export const initialSettings: Omit<Settings, 'id' | 'updatedAt' | 'updatedBy'>[] = [
  {
    key: 'site_name',
    value: 'NichoFy',
    type: 'string',
    description: 'Nome do site',
    isPublic: true
  },
  {
    key: 'site_description',
    value: 'Conteúdo especializado para seu nicho em minutos',
    type: 'string',
    description: 'Descrição do site',
    isPublic: true
  },
  {
    key: 'contact_email',
    value: 'contato@nichofy.com',
    type: 'string',
    description: 'Email de contato',
    isPublic: true
  },
  {
    key: 'contact_phone',
    value: '+55 11 99999-9999',
    type: 'string',
    description: 'Telefone de contato',
    isPublic: true
  },
  {
    key: 'social_instagram',
    value: '@nichofy',
    type: 'string',
    description: 'Instagram oficial',
    isPublic: true
  },
  {
    key: 'social_facebook',
    value: 'nichofy',
    type: 'string',
    description: 'Facebook oficial',
    isPublic: true
  },
  {
    key: 'social_linkedin',
    value: 'nichofy',
    type: 'string',
    description: 'LinkedIn oficial',
    isPublic: true
  },
  {
    key: 'pricing_basic',
    value: 97,
    type: 'number',
    description: 'Preço do plano básico',
    isPublic: true
  },
  {
    key: 'pricing_professional',
    value: 197,
    type: 'number',
    description: 'Preço do plano profissional',
    isPublic: true
  },
  {
    key: 'pricing_enterprise',
    value: 497,
    type: 'number',
    description: 'Preço do plano empresarial',
    isPublic: true
  },
  {
    key: 'maintenance_mode',
    value: false,
    type: 'boolean',
    description: 'Modo de manutenção',
    isPublic: false
  },
  {
    key: 'registration_enabled',
    value: true,
    type: 'boolean',
    description: 'Registro de novos usuários habilitado',
    isPublic: false
  },
  {
    key: 'max_orders_per_day',
    value: 50,
    type: 'number',
    description: 'Máximo de pedidos por dia por usuário',
    isPublic: false
  },
  {
    key: 'content_approval_required',
    value: true,
    type: 'boolean',
    description: 'Aprovação de conteúdo obrigatória',
    isPublic: false
  },
  {
    key: 'notification_email_enabled',
    value: true,
    type: 'boolean',
    description: 'Notificações por email habilitadas',
    isPublic: false
  }
]

// Função para popular o banco de dados com dados iniciais
export const populateInitialData = async () => {
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
  const { db } = await import('@/lib/firebase')

  try {
    console.log('Iniciando população do banco de dados...')

    // Adicionar nichos
    for (const nicho of initialNichos) {
      await addDoc(collection(db, 'nichos'), {
        ...nicho,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    }

    // Adicionar configurações
    for (const setting of initialSettings) {
      await addDoc(collection(db, 'settings'), {
        ...setting,
        updatedAt: serverTimestamp(),
        updatedBy: 'system'
      })
    }

    console.log('Banco de dados populado com sucesso!')
    return { success: true }
  } catch (error: any) {
    console.error('Erro ao popular banco de dados:', error)
    return { success: false, error: error.message }
  }
}
