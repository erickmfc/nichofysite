# 📋 REGRAS E CONFIGURAÇÕES - NichoFy

## 🔐 SISTEMA DE AUTENTICAÇÃO

### **Regras de Segurança Firebase**
- ✅ **Admin**: Controle total sobre todos os dados (`admin@nichofy.com`)
- ✅ **Usuários**: Acesso apenas aos próprios dados
- ✅ **Público**: Leitura de conteúdo, nichos, projetos, templates
- ✅ **Pedidos**: Criação pública, leitura própria, feedback limitado
- ✅ **Analytics**: Criação automática, leitura própria
- ✅ **Logs**: Apenas admin pode ler, criação automática
- ✅ **Segurança**: Negação por padrão para documentos não especificados

### **Configurações Firebase**
```javascript
// lib/firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyCyND0kw70kzPofmq8_dK0K_gFF1qV1Jdo",
  authDomain: "nichofy-cb282.firebaseapp.com",
  projectId: "nichofy-cb282",
  storageBucket: "nichofy-cb282.firebasestorage.app",
  messagingSenderId: "621379290571",
  appId: "1:621379290571:web:ee5e75df2079378959e24e",
  measurementId: "G-DVBG19K4ZQ"
};
```

## 🗄️ ESTRUTURA DO BANCO DE DADOS

### **Coleções Firestore**
- ✅ **orders** - Pedidos de conteúdo (criação pública, leitura própria)
- ✅ **users** - Dados dos usuários (acesso próprio)
- ✅ **content** - Conteúdo criado (leitura pública, escrita própria)
- ✅ **settings** - Configurações do sistema (leitura pública, escrita admin)
- ✅ **nichos** - Categorias de nichos (leitura pública, escrita admin)
- ✅ **projects** - Portfolio de projetos (leitura pública, escrita admin)
- ✅ **templates** - Modelos de conteúdo (leitura pública, escrita admin)
- ✅ **notifications** - Notificações do sistema (leitura própria)
- ✅ **payments** - Dados de pagamento (leitura própria)
- ✅ **analytics** - Métricas e estatísticas (criação automática, leitura própria)
- ✅ **feedback** - Avaliações e comentários (leitura pública, escrita própria)
- ✅ **logs** - Registro de atividades (leitura admin, criação automática)

## 🎨 DESIGN SYSTEM

### **Cores Principais**
- **Primária**: `bg-blue-600` / `text-blue-600`
- **Secundária**: `bg-gray-200` / `text-gray-700`
- **Sucesso**: `bg-green-600` / `text-green-600`
- **Erro**: `bg-red-600` / `text-red-600`
- **Aviso**: `bg-yellow-600` / `text-yellow-600`

### **Tamanhos de Botão**
- **Pequeno**: `px-3 py-1.5 text-sm`
- **Médio**: `px-4 py-2 text-base`
- **Grande**: `px-6 py-3 text-lg`

### **Espaçamentos**
- **Seção**: `py-8` (padding vertical)
- **Container**: `max-w-6xl mx-auto px-4`
- **Cards**: `p-6` (padding interno)
- **Gaps**: `gap-6` (espaçamento entre elementos)

## 📱 RESPONSIVIDADE

### **Breakpoints**
- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

### **Grid System**
- **Mobile**: `grid-cols-1`
- **Tablet**: `md:grid-cols-2`
- **Desktop**: `lg:grid-cols-3` ou `lg:grid-cols-4`

## 🔧 FUNCIONALIDADES

### **Páginas Obrigatórias**
- ✅ `/` - Home
- ✅ `/login` - Login/Cadastro
- ✅ `/dashboard` - Dashboard principal (simplificado com métricas)
- ✅ `/criar-conteudo` - Criar conteúdo (com templates rápidos)
- ✅ `/calendario` - Calendário de conteúdo (visualização mensal)
- ✅ `/analytics` - Analytics básico (métricas principais)
- ✅ `/analytics-avancado` - Analytics detalhado (relatórios avançados)
- ✅ `/templates` - Biblioteca de templates (criação e uso)
- ✅ `/historico` - Histórico de conteúdos (filtros e ações)
- ✅ `/configuracoes` - Configurações do usuário (perfil e preferências)
- ✅ `/suporte` - Suporte e ajuda (FAQ e contatos)
- ✅ `/exportar-dados` - Exportação de dados (JSON, CSV, PDF)
- ✅ `/test-dashboard` - Página de teste (debug de autenticação)

### **Componentes Obrigatórios**
- ✅ `ProtectedRoute` - Proteção de rotas (com logs de debug)
- ✅ `useAuth` - Hook de autenticação (com redirecionamento automático)
- ✅ `Toast` - Sistema de notificações (success, error, warning, info) - **ARQUIVO DELETADO**
- ✅ `useMicroInteractions` - Micro-interações (contadores animados, hover, clique) - **ARQUIVO DELETADO**
- ✅ `AnimatedButton` - Botões com micro-interações
- ✅ `StaggeredAnimation` - Animações escalonadas
- ✅ `SkeletonLoader` - Loading states elegantes

## 🚀 DEPLOYMENT

### **Domínio Principal**
- **Produção**: `nichofy.shop`
- **Desenvolvimento**: `localhost:3000+`

### **Configurações Vercel**
```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### **Variáveis de Ambiente**
```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCyND0kw70kzPofmq8_dK0K_gFF1qV1Jdo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nichofy-cb282.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nichofy-cb282
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nichofy-cb282.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=621379290571
NEXT_PUBLIC_FIREBASE_APP_ID=1:621379290571:web:ee5e75df2079378959e24e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-DVBG19K4ZQ
```

## 📊 ANALYTICS E MÉTRICAS

### **Métricas Principais**
- **Visualizações**: Total de visualizações de conteúdo
- **Engajamento**: Taxa de engajamento por plataforma
- **Seguidores**: Novos seguidores por período
- **Conteúdos**: Total de conteúdos criados

### **Plataformas Suportadas**
- ✅ Instagram
- ✅ LinkedIn
- ✅ Blog
- ✅ Twitter
- ✅ Facebook

### **Nichos Disponíveis**
- ✅ Direito
- ✅ Saúde
- ✅ Tecnologia
- ✅ Marketing
- ✅ Educação
- ✅ Finanças
- ✅ Negócios

## 🛠️ DESENVOLVIMENTO

### **Comandos Essenciais**
```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Start produção
npm start

# Lint
npm run lint

# Type check
npm run type-check
```

### **Estrutura de Pastas**
```
app/
├── (auth)/          # Rotas de autenticação
├── dashboard/        # Dashboard principal
├── criar-conteudo/   # Criação de conteúdo
├── analytics/        # Analytics básico
├── analytics-avancado/ # Analytics detalhado
├── templates/        # Templates
├── historico/        # Histórico
├── configuracoes/    # Configurações
├── suporte/         # Suporte
└── exportar-dados/   # Exportação

components/
├── auth/            # Componentes de autenticação
├── ui/              # Componentes de interface
└── layout/          # Componentes de layout

hooks/
├── useAuth.ts       # Hook de autenticação
└── useMicroInteractions.ts # Micro-interações - **ARQUIVO DELETADO**

lib/
├── firebase.ts      # Configuração Firebase
├── firebase-admin.ts # Firebase Admin
└── contexts/        # Contextos React
```

## 🔍 DEBUG E LOGS

### **Sistema de Logs**
- 🔐 **useAuth**: Logs de autenticação e redirecionamento
- 🛡️ **ProtectedRoute**: Logs de proteção de rotas
- 🔐 **Login**: Logs de processo de login e cadastro
- 📊 **Analytics**: Logs de métricas e performance
- 🎨 **UI**: Logs de micro-interações e animações

### **Páginas de Debug**
- `/test-dashboard` - Teste de autenticação com informações do usuário
- Console do navegador - Logs detalhados com emojis para identificação
- Sistema de debug implementado em todas as funcionalidades críticas

## ✨ NOVAS FUNCIONALIDADES IMPLEMENTADAS

### **Sistema de Notificações Toast** - **ARQUIVO DELETADO**
- ❌ **ToastProvider** - Context global para gerenciar notificações
- ❌ **useToast hook** - Métodos: `success()`, `error()`, `warning()`, `info()`
- ❌ **Animações suaves** - Entrada e saída com transições
- ❌ **Auto-dismiss** - Remove automaticamente após 5 segundos
- ❌ **Ações personalizadas** - Botões de ação nas notificações
- ❌ **Design responsivo** - Funciona em todos os dispositivos

### **Micro-interações Avançadas** - **ARQUIVO DELETADO**
- ❌ **useFadeIn** - Animações de entrada com Intersection Observer
- ❌ **useHover** - Estados de hover interativos
- ❌ **useClickAnimation** - Feedback visual em cliques
- ❌ **useAnimatedCounter** - Contadores animados com easing
- ❌ **useAnimatedProgress** - Barras de progresso animadas
- ❌ **StaggeredAnimation** - Animações escalonadas
- ❌ **AnimatedButton** - Botões com micro-interações
- ❌ **SkeletonLoader** - Loading states elegantes

### **Analytics e Relatórios Avançados**
- ✅ **Dashboard de métricas** - Cards animados com contadores
- ✅ **Gráficos interativos** - Placeholders para integração futura
- ✅ **Comparações mensais** - Tabelas com crescimento percentual
- ✅ **Demografia detalhada** - Faixa etária, localização, dispositivos
- ✅ **Top conteúdos** - Ranking de performance
- ✅ **Insights automáticos** - Recomendações baseadas em dados
- ✅ **Filtros por período** - 7d, 30d, 90d, 1 ano

### **Sistema de Exportação**
- ✅ **Múltiplos formatos** - JSON, CSV, PDF
- ✅ **Seleção granular** - Escolher quais dados exportar
- ✅ **Resumo detalhado** - Preview antes da exportação
- ✅ **Conformidade LGPD** - Informações sobre privacidade
- ✅ **Feedback visual** - Loading states e notificações
- ✅ **Download automático** - Arquivos baixados automaticamente

### **Calendário de Conteúdo**
- ✅ **Visualização mensal** - Grid de 31 dias com conteúdos programados
- ✅ **Categorização por plataforma** - Instagram, LinkedIn, Blog, Twitter
- ✅ **Estatísticas do mês** - Conteúdos programados, publicados, engajamento
- ✅ **Próximos conteúdos** - Lista de conteúdos agendados
- ✅ **Navegação entre meses** - Botões anterior/próximo mês

### **Templates Avançados**
- ✅ **Biblioteca completa** - 8 tipos de templates pré-definidos
- ✅ **Filtros por categoria** - Instagram, LinkedIn, Blog, Twitter
- ✅ **Estatísticas de uso** - Contador de vezes que cada template foi usado
- ✅ **Criação de templates** - Formulário para criar novos templates
- ✅ **Templates mais usados** - Ranking de popularidade

### **Histórico Detalhado**
- ✅ **Tabela completa** - Lista todos os conteúdos criados
- ✅ **Filtros avançados** - Por status, nicho, tipo, data
- ✅ **Ações em massa** - Ver, editar, excluir conteúdos
- ✅ **Performance integrada** - Visualizações e engajamento por conteúdo
- ✅ **Estatísticas gerais** - Total, publicados, rascunhos, arquivados

### **Configurações Completas**
- ✅ **Perfil do usuário** - Nome, email, profissão, empresa
- ✅ **Preferências de conteúdo** - Nichos, plataformas, tom de voz
- ✅ **Notificações** - Email, lembretes, atualizações do sistema
- ✅ **Privacidade** - Compartilhamento de dados, perfil público
- ✅ **Gerenciamento de conta** - Alterar senha, exportar dados, excluir conta

### **Suporte Avançado**
- ✅ **Múltiplos canais** - Email, WhatsApp, Chat online
- ✅ **FAQ completo** - 5 perguntas frequentes com respostas
- ✅ **Formulário de contato** - Campos para nome, email, assunto, mensagem
- ✅ **Recursos úteis** - Guia de início, tutoriais, dicas, novidades
- ✅ **Status do sistema** - Monitoramento em tempo real de todos os serviços

## 📝 TEMPLATES DE CONTEÚDO

### **Tipos Disponíveis**
- **Post Motivacional** - Instagram (15 usos)
- **Dica Profissional** - LinkedIn (12 usos)
- **Pergunta Engajante** - Instagram (8 usos)
- **Case de Sucesso** - Blog (6 usos)
- **Thread Educativa** - Twitter (10 usos)
- **Story Interativo** - Instagram (7 usos)
- **Artigo Informativo** - Blog (9 usos)
- **Post Promocional** - LinkedIn (4 usos)

### **Tom de Voz**
- **Profissional** - Formal e técnico
- **Casual** - Descontraído e amigável
- **Autoritário** - Confiante e direto
- **Amigável** - Acolhedor e próximo

## 🔒 SEGURANÇA E PRIVACIDADE

### **LGPD Compliance**
- ✅ Exportação de dados disponível
- ✅ Exclusão de conta disponível
- ✅ Controle de notificações
- ✅ Política de privacidade

### **Proteção de Rotas**
- ✅ Todas as páginas protegidas com `ProtectedRoute`
- ✅ Redirecionamento automático para login
- ✅ Verificação de estado de autenticação

## 📞 SUPORTE

### **Canais de Contato**
- **Email**: suporte@nichofy.com
- **WhatsApp**: +55 (11) 99999-9999
- **Chat Online**: Disponível 24/7

### **Recursos de Ajuda**
- **FAQ**: Perguntas frequentes
- **Guia de Início**: Tutorial básico
- **Tutoriais em Vídeo**: Passo a passo
- **Dicas e Truques**: Otimizações

## 🔄 ATUALIZAÇÕES

### **Versão Atual**: 1.0.0
### **Última Atualização**: Janeiro 2024

### **Próximas Funcionalidades**
- [ ] Integração com mais plataformas (TikTok, YouTube)
- [ ] IA para geração de conteúdo avançada
- [ ] Relatórios personalizados
- [ ] API pública
- [ ] App mobile
- [ ] Sistema de colaboração em equipe
- [ ] Agendamento automático de posts
- [ ] Integração com ferramentas de design
- [ ] Marketplace de templates
- [ ] Sistema de gamificação

---

## 📋 CHECKLIST DE VERIFICAÇÃO

### **Antes de Deploy**
- [ ] Todas as páginas funcionando (13 páginas principais)
- [ ] Sistema de login operacional (com debug)
- [ ] Analytics funcionando (básico e avançado)
- [ ] Sistema de notificações toast funcionando
- [ ] Micro-interações funcionando
- [ ] Exportação de dados funcionando
- [ ] Calendário de conteúdo funcionando
- [ ] Templates funcionando
- [ ] Histórico funcionando
- [ ] Configurações funcionando
- [ ] Suporte funcionando
- [ ] Responsividade testada
- [ ] Performance otimizada
- [ ] SEO configurado
- [ ] Segurança verificada

### **Após Deploy**
- [ ] Domínio funcionando
- [ ] SSL ativo
- [ ] Analytics conectado
- [ ] Monitoramento ativo
- [ ] Backup configurado

---

**📅 Criado em**: Janeiro 2024  
**👨‍💻 Mantido por**: Equipe NichoFy  
**🔄 Última revisão**: Janeiro 2024 (Atualizado com novas funcionalidades)
