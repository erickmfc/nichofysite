'use client'

import { Button } from '@/components/ui/Button'
import { ResponsiveTemplate } from '@/components/ui/ResponsiveTemplate'
import Link from 'next/link'
import { PublicNavbar } from '@/components/layout/PublicNavbar'

interface Nicho {
  id: string
  icon: string
  title: string
  description: string
  topics: string[]
  gradient: string
  isNew?: boolean
}

const nichos: Nicho[] = [
  // Nichos Existentes
  {
    id: 'direito',
    icon: '⚖️',
    title: 'Direito',
    description: 'Conteúdo jurídico especializado e atualizações legislativas',
    topics: ['Atualizações legislativas', 'Jurisprudência e Casos Reais', 'Direito do Consumidor'],
    gradient: 'from-blue-600 to-blue-800'
  },
  {
    id: 'saude',
    icon: '👨‍⚕️',
    title: 'Saúde & Bem-Estar',
    description: 'Conteúdo sobre saúde preventiva e bem-estar',
    topics: ['Saúde preventiva', 'Bem-estar mental', 'Nutrição saudável'],
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'tecnologia',
    icon: '💻',
    title: 'Tecnologia',
    description: 'Inovação, desenvolvimento e tendências tech',
    topics: ['Desenvolvimento', 'IA e Inovação', 'Tendências Tech'],
    gradient: 'from-purple-500 to-indigo-600'
  },
  
  // Novos Nichos Expandidos
  {
    id: 'gastronomia',
    icon: '🍔',
    title: 'Gastronomia',
    description: 'Conteúdo gastronômico e culinário',
    topics: ['Pratos do dia', 'Bastidores da cozinha', 'Promoções'],
    gradient: 'from-orange-500 to-red-600',
    isNew: true
  },
  {
    id: 'beleza',
    icon: '💇‍♀️',
    title: 'Beleza & Estética',
    description: 'Conteúdo sobre beleza e cuidados pessoais',
    topics: ['Transformações', 'Autocuidado', 'Serviços'],
    gradient: 'from-pink-500 to-rose-600',
    isNew: true
  },
  {
    id: 'varejo',
    icon: '🛍️',
    title: 'Varejo & E-commerce',
    description: 'Conteúdo para lojas físicas e online',
    topics: ['Lançamentos', 'Ofertas', 'Dicas de uso'],
    gradient: 'from-cyan-500 to-blue-600',
    isNew: true
  },
  {
    id: 'fitness',
    icon: '💪',
    title: 'Fitness & Esportes',
    description: 'Conteúdo sobre exercícios e vida saudável',
    topics: ['Treinos', 'Nutrição esportiva', 'Motivação'],
    gradient: 'from-yellow-500 to-orange-500',
    isNew: true
  },
  {
    id: 'imobiliario',
    icon: '🏠',
    title: 'Mercado Imobiliário',
    description: 'Conteúdo sobre imóveis e investimentos',
    topics: ['Imóveis em destaque', 'Dicas de compra', 'Tendências'],
    gradient: 'from-teal-500 to-green-600',
    isNew: true
  },
  {
    id: 'contabilidade',
    icon: '👔',
    title: 'Contabilidade & Finanças',
    description: 'Conteúdo financeiro e contábil',
    topics: ['Gestão empresarial', 'Obrigações fiscais', 'Educação financeira'],
    gradient: 'from-gray-600 to-gray-800',
    isNew: true
  },
  {
    id: 'pets',
    icon: '🐾',
    title: 'Pet Shops & Veterinária',
    description: 'Conteúdo sobre cuidados com animais',
    topics: ['Cuidados animais', 'Produtos', 'Fotos de pets'],
    gradient: 'from-amber-500 to-yellow-600',
    isNew: true
  },
  {
    id: 'educacao',
    icon: '📚',
    title: 'Educação & Cursos',
    description: 'Conteúdo educacional e cursos',
    topics: ['Dicas de estudo', 'Cursos', 'Depoimentos'],
    gradient: 'from-indigo-500 to-purple-600',
    isNew: true
  },
  {
    id: 'turismo',
    icon: '✈️',
    title: 'Turismo & Hotelaria',
    description: 'Conteúdo sobre viagens e hospedagem',
    topics: ['Promoções', 'Dicas de viagem', 'Estrutura'],
    gradient: 'from-sky-500 to-blue-600',
    isNew: true
  },

  // NOVAS PROFISSÕES ADICIONADAS
  {
    id: 'psicologia',
    icon: '🧠',
    title: 'Psicologia & Saúde Mental',
    description: 'Conteúdo sobre saúde mental e bem-estar psicológico',
    topics: ['Saúde mental', 'Técnicas de relaxamento', 'Consultas'],
    gradient: 'from-violet-500 to-purple-600',
    isNew: true
  },
  {
    id: 'odontologia',
    icon: '🦷',
    title: 'Odontologia',
    description: 'Conteúdo sobre saúde bucal e tratamentos dentários',
    topics: ['Higiene bucal', 'Tratamentos', 'Agendamentos'],
    gradient: 'from-blue-400 to-cyan-500',
    isNew: true
  },
  {
    id: 'farmacia',
    icon: '💊',
    title: 'Farmácia & Medicamentos',
    description: 'Conteúdo sobre medicamentos e cuidados farmacêuticos',
    topics: ['Orientações', 'Dicas de saúde', 'Promoções'],
    gradient: 'from-red-500 to-pink-600',
    isNew: true
  },
  {
    id: 'drogarias',
    icon: '🏥',
    title: 'Drogarias & Perfumarias',
    description: 'Conteúdo para drogarias e perfumarias',
    topics: ['Lançamentos', 'Promoções', 'Cuidados pessoais'],
    gradient: 'from-rose-500 to-red-600',
    isNew: true
  },
  {
    id: 'fisioterapia',
    icon: '🏃‍♂️',
    title: 'Fisioterapia & Reabilitação',
    description: 'Conteúdo sobre fisioterapia e reabilitação',
    topics: ['Exercícios', 'Prevenção', 'Tratamentos'],
    gradient: 'from-green-400 to-teal-500',
    isNew: true
  },
  {
    id: 'nutricao',
    icon: '🥗',
    title: 'Nutrição & Dietética',
    description: 'Conteúdo sobre nutrição e alimentação saudável',
    topics: ['Receitas saudáveis', 'Alimentação', 'Consultas'],
    gradient: 'from-lime-500 to-green-600',
    isNew: true
  },
  {
    id: 'veterinaria',
    icon: '🐕',
    title: 'Veterinária & Clínicas',
    description: 'Conteúdo para clínicas veterinárias',
    topics: ['Cuidados preventivos', 'Tratamentos', 'Dicas'],
    gradient: 'from-orange-400 to-yellow-500',
    isNew: true
  },
  {
    id: 'arquitetura',
    icon: '🏗️',
    title: 'Arquitetura & Engenharia',
    description: 'Conteúdo para arquitetos e engenheiros',
    topics: ['Projetos', 'Dicas de construção', 'Tendências'],
    gradient: 'from-slate-600 to-gray-700',
    isNew: true
  },
  {
    id: 'design',
    icon: '🎨',
    title: 'Design & Comunicação Visual',
    description: 'Conteúdo para designers e agências',
    topics: ['Portfólio', 'Tendências', 'Serviços'],
    gradient: 'from-fuchsia-500 to-purple-600',
    isNew: true
  },
  {
    id: 'marketing',
    icon: '📈',
    title: 'Marketing & Publicidade',
    description: 'Conteúdo para profissionais de marketing',
    topics: ['Estratégias', 'Cases de sucesso', 'Serviços'],
    gradient: 'from-emerald-500 to-teal-600',
    isNew: true
  },
  {
    id: 'consultoria',
    icon: '💼',
    title: 'Consultoria Empresarial',
    description: 'Conteúdo para consultores empresariais',
    topics: ['Gestão', 'Estratégias', 'Consultoria'],
    gradient: 'from-slate-500 to-gray-600',
    isNew: true
  },
  {
    id: 'coaching',
    icon: '🎯',
    title: 'Coaching & Desenvolvimento',
    description: 'Conteúdo para coaches e mentores',
    topics: ['Técnicas', 'Desenvolvimento', 'Programas'],
    gradient: 'from-amber-400 to-orange-500',
    isNew: true
  },
  {
    id: 'automotivo',
    icon: '🚗',
    title: 'Automotivo & Oficinas',
    description: 'Conteúdo para oficinas e serviços automotivos',
    topics: ['Manutenção', 'Reparos', 'Promoções'],
    gradient: 'from-gray-500 to-slate-600',
    isNew: true
  },
  {
    id: 'construcao',
    icon: '🔨',
    title: 'Construção Civil',
    description: 'Conteúdo para construtoras e pedreiros',
    topics: ['Projetos', 'Materiais', 'Obras'],
    gradient: 'from-yellow-600 to-orange-600',
    isNew: true
  },
  {
    id: 'seguranca',
    icon: '🛡️',
    title: 'Segurança & Vigilância',
    description: 'Conteúdo para empresas de segurança',
    topics: ['Sistemas', 'Segurança residencial', 'Vigilância'],
    gradient: 'from-red-600 to-red-800',
    isNew: true
  },
  {
    id: 'limpeza',
    icon: '🧽',
    title: 'Limpeza & Conservação',
    description: 'Conteúdo para empresas de limpeza',
    topics: ['Limpeza residencial', 'Comercial', 'Produtos'],
    gradient: 'from-blue-400 to-blue-600',
    isNew: true
  },
  {
    id: 'jardinagem',
    icon: '🌱',
    title: 'Jardinagem & Paisagismo',
    description: 'Conteúdo para jardineiros e paisagistas',
    topics: ['Cuidados plantas', 'Paisagismo', 'Manutenção'],
    gradient: 'from-green-400 to-emerald-500',
    isNew: true
  },
  {
    id: 'eventos',
    icon: '🎉',
    title: 'Eventos & Festas',
    description: 'Conteúdo para empresas de eventos',
    topics: ['Organização', 'Decoração', 'Buffet'],
    gradient: 'from-pink-400 to-rose-500',
    isNew: true
  },
  {
    id: 'fotografia',
    icon: '📸',
    title: 'Fotografia & Vídeo',
    description: 'Conteúdo para fotógrafos e videomakers',
    topics: ['Portfólio', 'Sessões', 'Dicas'],
    gradient: 'from-indigo-400 to-purple-500',
    isNew: true
  },
  {
    id: 'musica',
    icon: '🎵',
    title: 'Música & Entretenimento',
    description: 'Conteúdo para músicos e artistas',
    topics: ['Shows', 'Aulas', 'Produção'],
    gradient: 'from-purple-400 to-pink-500',
    isNew: true
  },
  {
    id: 'moda',
    icon: '👗',
    title: 'Moda & Vestuário',
    description: 'Conteúdo para lojas de roupas e moda',
    topics: ['Coleções', 'Estilo', 'Promoções'],
    gradient: 'from-pink-500 to-rose-600',
    isNew: true
  },
  {
    id: 'esportes',
    icon: '⚽',
    title: 'Esportes & Lazer',
    description: 'Conteúdo para academias e clubes esportivos',
    topics: ['Modalidades', 'Competições', 'Treinamentos'],
    gradient: 'from-green-500 to-lime-600',
    isNew: true
  },
  {
    id: 'livros',
    icon: '📖',
    title: 'Livrarias & Editoras',
    description: 'Conteúdo para livrarias e editoras',
    topics: ['Lançamentos', 'Resenhas', 'Promoções'],
    gradient: 'from-amber-500 to-yellow-600',
    isNew: true
  },
  {
    id: 'brinquedos',
    icon: '🧸',
    title: 'Brinquedos & Infantil',
    description: 'Conteúdo para lojas de brinquedos',
    topics: ['Novidades', 'Desenvolvimento', 'Promoções'],
    gradient: 'from-yellow-400 to-orange-500',
    isNew: true
  },
  {
    id: 'casa',
    icon: '🏡',
    title: 'Casa & Decoração',
    description: 'Conteúdo para lojas de decoração',
    topics: ['Tendências', 'Organização', 'Produtos'],
    gradient: 'from-teal-400 to-cyan-500',
    isNew: true
  },
  {
    id: 'eletronicos',
    icon: '📱',
    title: 'Eletrônicos & Tecnologia',
    description: 'Conteúdo para lojas de eletrônicos',
    topics: ['Lançamentos', 'Promoções', 'Dicas'],
    gradient: 'from-blue-500 to-indigo-600',
    isNew: true
  },
  {
    id: 'moveis',
    icon: '🪑',
    title: 'Móveis & Mobiliário',
    description: 'Conteúdo para lojas de móveis',
    topics: ['Coleções', 'Decoração', 'Financiamentos'],
    gradient: 'from-brown-500 to-amber-600',
    isNew: true
  },
  {
    id: 'ferramentas',
    icon: '🔧',
    title: 'Ferramentas & Equipamentos',
    description: 'Conteúdo para lojas de ferramentas',
    topics: ['Ferramentas', 'Manutenção', 'Equipamentos'],
    gradient: 'from-gray-600 to-slate-700',
    isNew: true
  },
  {
    id: 'agricultura',
    icon: '🌾',
    title: 'Agricultura & Agropecuária',
    description: 'Conteúdo para produtores rurais',
    topics: ['Plantio', 'Produtos', 'Manejo'],
    gradient: 'from-green-600 to-emerald-700',
    isNew: true
  },
  {
    id: 'transporte',
    icon: '🚛',
    title: 'Transporte & Logística',
    description: 'Conteúdo para empresas de transporte',
    topics: ['Frete', 'Passageiros', 'Logística'],
    gradient: 'from-orange-600 to-red-600',
    isNew: true
  },
  {
    id: 'comunicacao',
    icon: '📻',
    title: 'Comunicação & Mídia',
    description: 'Conteúdo para empresas de comunicação',
    topics: ['Comunicação', 'Audiovisual', 'Digital'],
    gradient: 'from-purple-600 to-indigo-700',
    isNew: true
  },
  {
    id: 'seguros',
    icon: '🛡️',
    title: 'Seguros & Previdência',
    description: 'Conteúdo para seguradoras',
    topics: ['Seguros', 'Proteção', 'Previdência'],
    gradient: 'from-blue-600 to-blue-800',
    isNew: true
  },
  {
    id: 'investimentos',
    icon: '💰',
    title: 'Investimentos & Bolsa',
    description: 'Conteúdo para assessores de investimento',
    topics: ['Estratégias', 'Mercado', 'Produtos'],
    gradient: 'from-green-600 to-emerald-700',
    isNew: true
  },
  {
    id: 'imobiliaria',
    icon: '🏢',
    title: 'Imobiliárias & Incorporadoras',
    description: 'Conteúdo para imobiliárias',
    topics: ['Lançamentos', 'Financiamento', 'Tendências'],
    gradient: 'from-teal-600 to-green-700',
    isNew: true
  },
  {
    id: 'advocacia',
    icon: '⚖️',
    title: 'Escritórios de Advocacia',
    description: 'Conteúdo para escritórios de advocacia',
    topics: ['Áreas jurídicas', 'Cases', 'Consultas'],
    gradient: 'from-blue-700 to-indigo-800',
    isNew: true
  },
  {
    id: 'medicina',
    icon: '🩺',
    title: 'Clínicas Médicas',
    description: 'Conteúdo para clínicas médicas',
    topics: ['Especialidades', 'Exames', 'Agendamentos'],
    gradient: 'from-green-700 to-emerald-800',
    isNew: true
  },
  {
    id: 'laboratorio',
    icon: '🧪',
    title: 'Laboratórios & Análises',
    description: 'Conteúdo para laboratórios de análises',
    topics: ['Exames', 'Orientações', 'Resultados'],
    gradient: 'from-cyan-600 to-blue-700',
    isNew: true
  },
  {
    id: 'radiologia',
    icon: '📡',
    title: 'Radiologia & Diagnóstico',
    description: 'Conteúdo para clínicas de radiologia',
    topics: ['Exames imagem', 'Preparação', 'Tecnologia'],
    gradient: 'from-slate-600 to-gray-700',
    isNew: true
  },
  {
    id: 'psiquiatria',
    icon: '🧠',
    title: 'Psiquiatria & Saúde Mental',
    description: 'Conteúdo para psiquiatras',
    topics: ['Tratamentos', 'Medicamentos', 'Consultas'],
    gradient: 'from-violet-600 to-purple-700',
    isNew: true
  },
  {
    id: 'cardiologia',
    icon: '❤️',
    title: 'Cardiologia',
    description: 'Conteúdo para cardiologistas',
    topics: ['Prevenção', 'Exames', 'Tratamentos'],
    gradient: 'from-red-600 to-pink-700',
    isNew: true
  },
  {
    id: 'dermatologia',
    icon: '✨',
    title: 'Dermatologia',
    description: 'Conteúdo para dermatologistas',
    topics: ['Cuidados pele', 'Tratamentos', 'Estética'],
    gradient: 'from-pink-600 to-rose-700',
    isNew: true
  },
  {
    id: 'ginecologia',
    icon: '👩',
    title: 'Ginecologia & Obstetrícia',
    description: 'Conteúdo para ginecologistas',
    topics: ['Saúde feminina', 'Exames', 'Pré-natal'],
    gradient: 'from-rose-600 to-pink-700',
    isNew: true
  },
  {
    id: 'pediatria',
    icon: '👶',
    title: 'Pediatria',
    description: 'Conteúdo para pediatras',
    topics: ['Cuidados crianças', 'Vacinação', 'Desenvolvimento'],
    gradient: 'from-blue-500 to-cyan-600',
    isNew: true
  },
  {
    id: 'ortopedia',
    icon: '🦴',
    title: 'Ortopedia & Traumatologia',
    description: 'Conteúdo para ortopedistas',
    topics: ['Lesões', 'Cirurgias', 'Reabilitação'],
    gradient: 'from-gray-500 to-slate-600',
    isNew: true
  },
  {
    id: 'neurologia',
    icon: '🧠',
    title: 'Neurologia',
    description: 'Conteúdo para neurologistas',
    topics: ['Distúrbios', 'Exames', 'Tratamentos'],
    gradient: 'from-indigo-600 to-purple-700',
    isNew: true
  },
  {
    id: 'oftalmologia',
    icon: '👁️',
    title: 'Oftalmologia',
    description: 'Conteúdo para oftalmologistas',
    topics: ['Visão', 'Cirurgias', 'Exames'],
    gradient: 'from-blue-400 to-indigo-500',
    isNew: true
  },
  {
    id: 'otorrinolaringologia',
    icon: '👂',
    title: 'Otorrinolaringologia',
    description: 'Conteúdo para otorrinolaringologistas',
    topics: ['Ouvido/nariz/garganta', 'Cirurgias', 'Exames'],
    gradient: 'from-teal-500 to-cyan-600',
    isNew: true
  },
  {
    id: 'urologia',
    icon: '🔬',
    title: 'Urologia',
    description: 'Conteúdo para urologistas',
    topics: ['Problemas urológicos', 'Cirurgias', 'Exames'],
    gradient: 'from-green-500 to-teal-600',
    isNew: true
  },
  {
    id: 'endocrinologia',
    icon: '🔄',
    title: 'Endocrinologia',
    description: 'Conteúdo para endocrinologistas',
    topics: ['Hormônios', 'Diabetes', 'Tratamentos'],
    gradient: 'from-yellow-500 to-orange-600',
    isNew: true
  },
  {
    id: 'gastroenterologia',
    icon: '🫀',
    title: 'Gastroenterologia',
    description: 'Conteúdo para gastroenterologistas',
    topics: ['Digestão', 'Endoscopias', 'Tratamentos'],
    gradient: 'from-orange-500 to-red-600',
    isNew: true
  },
  {
    id: 'pneumologia',
    icon: '🫁',
    title: 'Pneumologia',
    description: 'Conteúdo para pneumologistas',
    topics: ['Respiração', 'Exames', 'Tratamentos'],
    gradient: 'from-cyan-500 to-blue-600',
    isNew: true
  },
  {
    id: 'reumatologia',
    icon: '🦴',
    title: 'Reumatologia',
    description: 'Conteúdo para reumatologistas',
    topics: ['Reumatismo', 'Artrite', 'Tratamentos'],
    gradient: 'from-purple-500 to-indigo-600',
    isNew: true
  },
  {
    id: 'oncologia',
    icon: '🎗️',
    title: 'Oncologia',
    description: 'Conteúdo para oncologistas',
    topics: ['Câncer', 'Quimioterapia', 'Acompanhamento'],
    gradient: 'from-pink-500 to-rose-600',
    isNew: true
  },
  {
    id: 'geriatria',
    icon: '👴',
    title: 'Geriatria',
    description: 'Conteúdo para geriatras',
    topics: ['Idosos', 'Envelhecimento', 'Tratamentos'],
    gradient: 'from-gray-500 to-slate-600',
    isNew: true
  },
  {
    id: 'anestesiologia',
    icon: '💉',
    title: 'Anestesiologia',
    description: 'Conteúdo para anestesiologistas',
    topics: ['Anestesia', 'Cirurgias', 'Pós-operatório'],
    gradient: 'from-blue-500 to-indigo-600',
    isNew: true
  },
  {
    id: 'cirurgia',
    icon: '🏥',
    title: 'Cirurgia Geral',
    description: 'Conteúdo para cirurgiões',
    topics: ['Procedimentos', 'Minimamente invasiva', 'Recuperação'],
    gradient: 'from-red-500 to-pink-600',
    isNew: true
  },
  {
    id: 'plastica',
    icon: '✨',
    title: 'Cirurgia Plástica',
    description: 'Conteúdo para cirurgiões plásticos',
    topics: ['Estética', 'Reconstrutiva', 'Pós-operatório'],
    gradient: 'from-pink-500 to-rose-600',
    isNew: true
  },
  {
    id: 'vascular',
    icon: '🩸',
    title: 'Cirurgia Vascular',
    description: 'Conteúdo para cirurgiões vasculares',
    topics: ['Varizes', 'Cirurgias', 'Tratamentos'],
    gradient: 'from-red-600 to-pink-700',
    isNew: true
  },
  {
    id: 'cardiovascular',
    icon: '❤️',
    title: 'Cirurgia Cardiovascular',
    description: 'Conteúdo para cirurgiões cardiovasculares',
    topics: ['Cardíacas', 'Procedimentos', 'Transplantes'],
    gradient: 'from-red-600 to-red-800',
    isNew: true
  },
  {
    id: 'neurocirurgia',
    icon: '🧠',
    title: 'Neurocirurgia',
    description: 'Conteúdo para neurocirurgiões',
    topics: ['Cerebrais', 'Neurológicos', 'Tratamentos'],
    gradient: 'from-indigo-600 to-purple-700',
    isNew: true
  },
  {
    id: 'ortopedica',
    icon: '🦴',
    title: 'Cirurgia Ortopédica',
    description: 'Conteúdo para cirurgiões ortopédicos',
    topics: ['Coluna', 'Ortopédicos', 'Implantes'],
    gradient: 'from-gray-600 to-slate-700',
    isNew: true
  },
  {
    id: 'pediatrica',
    icon: '👶',
    title: 'Cirurgia Pediátrica',
    description: 'Conteúdo para cirurgiões pediátricos',
    topics: ['Crianças', 'Pediátricos', 'Cuidados'],
    gradient: 'from-blue-500 to-cyan-600',
    isNew: true
  },
  {
    id: 'toracica',
    icon: '🫁',
    title: 'Cirurgia Torácica',
    description: 'Conteúdo para cirurgiões torácicos',
    topics: ['Pulmonares', 'Torácicos', 'Respiratórios'],
    gradient: 'from-cyan-500 to-blue-600',
    isNew: true
  },
  {
    id: 'digestiva',
    icon: '🫀',
    title: 'Cirurgia Digestiva',
    description: 'Conteúdo para cirurgiões digestivos',
    topics: ['Digestivo', 'Gastrointestinais', 'Cirúrgicos'],
    gradient: 'from-orange-500 to-red-600',
    isNew: true
  },
  {
    id: 'urologica',
    icon: '🔬',
    title: 'Cirurgia Urológica',
    description: 'Conteúdo para cirurgiões urológicos',
    topics: ['Urológicas', 'Urológicos', 'Cirúrgicos'],
    gradient: 'from-green-500 to-teal-600',
    isNew: true
  },
  {
    id: 'ginecologica',
    icon: '👩',
    title: 'Cirurgia Ginecológica',
    description: 'Conteúdo para cirurgiões ginecológicos',
    topics: ['Ginecológicas', 'Femininos', 'Cirúrgicos'],
    gradient: 'from-rose-500 to-pink-600',
    isNew: true
  },
  {
    id: 'oftalmologica',
    icon: '👁️',
    title: 'Cirurgia Oftalmológica',
    description: 'Conteúdo para cirurgiões oftalmológicos',
    topics: ['Catarata', 'Oftalmológicos', 'Cirúrgicos'],
    gradient: 'from-blue-400 to-indigo-500',
    isNew: true
  },
  {
    id: 'otorrinolaringologica',
    icon: '👂',
    title: 'Cirurgia Otorrinolaringológica',
    description: 'Conteúdo para cirurgiões otorrinolaringológicos',
    topics: ['Ouvido', 'Otorrinolaringológicos', 'Cirúrgicos'],
    gradient: 'from-teal-500 to-cyan-600',
    isNew: true
  },
  {
    id: 'maxilofacial',
    icon: '🦷',
    title: 'Cirurgia Maxilofacial',
    description: 'Conteúdo para cirurgiões maxilofaciais',
    topics: ['Face', 'Maxilofaciais', 'Cirúrgicos'],
    gradient: 'from-blue-400 to-cyan-500',
    isNew: true
  },
  {
    id: 'traumatologica',
    icon: '🦴',
    title: 'Cirurgia Traumatológica',
    description: 'Conteúdo para cirurgiões traumatológicos',
    topics: ['Trauma', 'Traumatológicos', 'Cirúrgicos'],
    gradient: 'from-gray-600 to-slate-700',
    isNew: true
  },
  {
    id: 'oncologica',
    icon: '🎗️',
    title: 'Cirurgia Oncológica',
    description: 'Conteúdo para cirurgiões oncológicos',
    topics: ['Câncer', 'Oncológicos', 'Cirúrgicos'],
    gradient: 'from-pink-500 to-rose-600',
    isNew: true
  },
  {
    id: 'transplantes',
    icon: '🔄',
    title: 'Cirurgia de Transplantes',
    description: 'Conteúdo para cirurgiões de transplantes',
    topics: ['Órgãos', 'Transplante', 'Pós-transplante'],
    gradient: 'from-green-500 to-emerald-600',
    isNew: true
  },
  {
    id: 'robotica',
    icon: '🤖',
    title: 'Cirurgia Robótica',
    description: 'Conteúdo para cirurgiões robóticos',
    topics: ['Robóticas', 'Minimamente invasivos', 'Tecnologia'],
    gradient: 'from-purple-500 to-indigo-600',
    isNew: true
  },
  {
    id: 'laparoscopica',
    icon: '🔍',
    title: 'Cirurgia Laparoscópica',
    description: 'Conteúdo para cirurgiões laparoscópicos',
    topics: ['Laparoscópicas', 'Minimamente invasivos', 'Tecnologia'],
    gradient: 'from-blue-500 to-indigo-600',
    isNew: true
  },
  {
    id: 'endoscopica',
    icon: '🔬',
    title: 'Cirurgia Endoscópica',
    description: 'Conteúdo para cirurgiões endoscópicos',
    topics: ['Endoscópicas', 'Endoscópicos', 'Tecnologia'],
    gradient: 'from-green-500 to-teal-600',
    isNew: true
  },
  {
    id: 'microcirurgia',
    icon: '🔬',
    title: 'Microcirurgia',
    description: 'Conteúdo para microcirurgiões',
    topics: ['Microcirurgias', 'Microscópicos', 'Tecnologia'],
    gradient: 'from-cyan-500 to-blue-600',
    isNew: true
  },
  {
    id: 'emergencia',
    icon: '🚨',
    title: 'Cirurgia de Emergência',
    description: 'Conteúdo para cirurgiões de emergência',
    topics: ['Emergência', 'Urgência', 'Cuidados'],
    gradient: 'from-red-600 to-red-800',
    isNew: true
  },
  {
    id: 'ambulatoria',
    icon: '🏥',
    title: 'Cirurgia Ambulatorial',
    description: 'Conteúdo para cirurgiões ambulatoriais',
    topics: ['Ambulatoriais', 'Ambulatoriais', 'Cuidados'],
    gradient: 'from-blue-500 to-indigo-600',
    isNew: true
  },
  {
    id: 'hospitalar',
    icon: '🏥',
    title: 'Cirurgia Hospitalar',
    description: 'Conteúdo para cirurgiões hospitalares',
    topics: ['Hospitalares', 'Hospitalares', 'Cuidados'],
    gradient: 'from-green-500 to-emerald-600',
    isNew: true
  },
  {
    id: 'privada',
    icon: '🏥',
    title: 'Cirurgia Privada',
    description: 'Conteúdo para cirurgiões privados',
    topics: ['Privadas', 'Privados', 'Cuidados'],
    gradient: 'from-purple-500 to-indigo-600',
    isNew: true
  },
  {
    id: 'publica',
    icon: '🏥',
    title: 'Cirurgia Pública',
    description: 'Conteúdo para cirurgiões públicos',
    topics: ['Públicas', 'Públicos', 'Cuidados'],
    gradient: 'from-blue-600 to-blue-800',
    isNew: true
  }
]

export default function NichosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <PublicNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-8">
            Mais de{' '}
            <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              {nichos.length} Nichos
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-12 max-w-4xl mx-auto">
            Conteúdo especializado para cada área profissional. 
            Nossa IA foi treinada especificamente para cada nicho.
          </p>
        </div>

        {/* Grid de Nichos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {nichos.map((nicho) => (
            <div
              key={nicho.id}
              className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-l-4 bg-gradient-to-r ${nicho.gradient} border-l-transparent relative overflow-hidden`}
            >
              {nicho.isNew && (
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  NOVO
                </div>
              )}
              
              <div className="text-4xl mb-4">{nicho.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{nicho.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{nicho.description}</p>
              
              <div className="space-y-2">
                {nicho.topics.map((topic, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-500">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {topic}
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Link href="/login?mode=signup">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                    Começar Agora
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-6">
              Pronto para transformar seu conteúdo?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Escolha seu nicho e comece a criar conteúdo profissional hoje mesmo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/login?mode=signup" 
                className="bg-white text-orange-500 px-12 py-4 rounded-xl font-bold text-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Começar Gratuitamente
              </Link>
              <Link 
                href="/exemplos" 
                className="border-2 border-white text-white px-12 py-4 rounded-xl font-bold text-xl hover:bg-white hover:text-orange-500 transition-all duration-300"
              >
                Ver Exemplos
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}