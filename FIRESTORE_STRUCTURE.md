# Estrutura de Dados do Firestore - NichoFy Dashboard

## 📋 Visão Geral

Esta documentação descreve a estrutura completa de dados implementada no Firestore para o dashboard da NichoFy, incluindo regras de segurança e métodos de acesso.

## 🗂️ Estrutura das Coleções

### 1. **Coleção `users`**
Armazena informações do perfil e configurações da marca de cada usuário.

```typescript
/users/{userId}
├── displayName: string
├── email: string
├── photoURL?: string
├── brandInfo: {
│   ├── name: string
│   ├── niche: string
│   ├── description: string
│   ├── targetAudience: string
│   ├── toneOfVoice: string[]
│   ├── logoUrl?: string
│   └── brandColors?: string[]
├── preferences: {
│   ├── theme: 'light' | 'dark'
│   ├── language: 'pt' | 'en'
│   ├── notifications: { ... }
│   └── contentPreferences: { ... }
├── subscription: {
│   ├── plan: 'free' | 'basic' | 'premium' | 'enterprise'
│   ├── status: 'active' | 'inactive' | 'suspended' | 'cancelled'
│   ├── startDate: Timestamp
│   ├── endDate?: Timestamp
│   └── autoRenew: boolean
├── onboardingCompleted: boolean
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

### 2. **Coleção `posts`**
Armazena todos os posts gerados pelos usuários.

```typescript
/posts/{postId}
├── userId: string (IMPORTANTE para segurança)
├── prompt: string
├── generatedContent: string
├── imageUrl?: string
├── category: 'Institucional' | 'Promocional' | 'Educativo' | 'Engajamento' | 'Motivacional'
├── platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok'
├── hashtags: string[]
├── scheduledFor?: Timestamp
├── publishedAt?: Timestamp
├── interactions: {
│   ├── liked: boolean
│   ├── saved: boolean
│   ├── used: boolean
│   └── shared: boolean
├── metadata: {
│   ├── niche: string
│   ├── toneOfVoice: string[]
│   ├── targetAudience: string
│   ├── wordCount: number
│   └── estimatedReadTime: number
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

### 3. **Coleção `calendarEvents`**
Armazena eventos do calendário e datas importantes.

```typescript
/calendarEvents/{eventId}
├── userId: string (IMPORTANTE para segurança)
├── title: string
├── description?: string
├── date: Timestamp
├── isHoliday: boolean
├── isRecurring: boolean
├── recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly'
├── color?: string
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

### 4. **Coleção `notifications`**
Armazena notificações do usuário.

```typescript
/notifications/{notificationId}
├── userId: string (IMPORTANTE para segurança)
├── title: string
├── message: string
├── type: 'success' | 'info' | 'warning' | 'error'
├── read: boolean
├── actionUrl?: string
├── actionText?: string
├── createdAt: Timestamp
└── readAt?: Timestamp
```

### 5. **Subcoleções do Usuário**

#### **`/users/{userId}/analytics`**
```typescript
/analytics/main
├── userId: string
├── totalPosts: number
├── postsByCategory: { [key: string]: number }
├── postsByPlatform: { [key: string]: number }
├── postsByMonth: { [key: string]: number }
├── totalInteractions: { ... }
├── averageEngagement: number
├── mostUsedHashtags: string[]
├── lastActivityAt: Timestamp
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

#### **`/users/{userId}/customTemplates`**
```typescript
/customTemplates/{templateId}
├── userId: string
├── name: string
├── description: string
├── template: string
├── category: string
├── variables: string[]
├── isPublic: boolean
├── usageCount: number
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

#### **`/users/{userId}/contentSuggestions`**
```typescript
/contentSuggestions/{suggestionId}
├── userId: string
├── title: string
├── description: string
├── type: 'post' | 'story' | 'reel' | 'carousel'
├── platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok'
├── priority: 'high' | 'medium' | 'low'
├── suggestedTime?: Timestamp
├── category: string
├── hashtags: string[]
├── isUsed: boolean
├── createdAt: Timestamp
└── usedAt?: Timestamp
```

## 🔒 Regras de Segurança

### Arquivo: `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Usuários podem ler/atualizar apenas seu próprio perfil
    match /users/{userId} {
      allow read, update: if request.auth.uid == userId;
      allow create: if request.auth.uid != null;
    }

    // Posts: apenas o dono pode acessar
    match /posts/{postId} {
      allow create: if request.auth.uid != null && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth.uid != null && resource.data.userId == request.auth.uid;
    }

    // Eventos do calendário: apenas o dono pode acessar
    match /calendarEvents/{eventId} {
      allow create: if request.auth.uid != null && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth.uid != null && resource.data.userId == request.auth.uid;
    }

    // Notificações: apenas o dono pode acessar
    match /notifications/{notificationId} {
      allow create: if request.auth.uid != null && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth.uid != null && resource.data.userId == request.auth.uid;
    }

    // Subcoleções do usuário: acesso total apenas para o dono
    match /users/{userId}/{subcollection=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## 🛠️ Como Usar o FirestoreService

### Inicialização
```typescript
import { FirestoreService } from '@/lib/services/FirestoreService';

const service = new FirestoreService(userId);
```

### Exemplos de Uso

#### 1. **Criar um Post**
```typescript
const postId = await service.createPost({
  userId: userId,
  prompt: 'Criar um post de bom dia para minha cafeteria',
  generatedContent: 'Bom dia! Que tal começar o dia com um café especial? ☕',
  category: 'Motivacional',
  platform: 'instagram',
  hashtags: ['#cafe', '#bomdia', '#cafeteria'],
  interactions: {
    liked: false,
    saved: false,
    used: false,
    shared: false
  },
  metadata: {
    niche: 'gastronomia',
    toneOfVoice: ['amigavel'],
    targetAudience: 'jovens adultos',
    wordCount: 15,
    estimatedReadTime: 1
  }
});
```

#### 2. **Buscar Posts do Usuário**
```typescript
const posts = await service.getUserPosts(10);
```

#### 3. **Criar Evento no Calendário**
```typescript
const eventId = await service.createCalendarEvent({
  userId: userId,
  title: 'Planejar posts para Black Friday',
  description: 'Criar conteúdo promocional para a Black Friday',
  date: new Date('2024-11-29'),
  isHoliday: false,
  isRecurring: false
});
```

#### 4. **Criar Notificação**
```typescript
const notificationId = await service.createNotification({
  userId: userId,
  title: 'Post gerado com sucesso!',
  message: 'Seu post sobre "Café da manhã" está pronto.',
  type: 'success'
});
```

#### 5. **Buscar Estatísticas**
```typescript
const stats = await service.getUserStats();
// Retorna: { totalPosts, totalEvents, unreadNotifications, totalTemplates }
```

## 📊 Integração com o Dashboard

### Módulos que Usam os Dados

1. **GreetingModule**: Usa `notifications.filter(n => !n.read).length`
2. **CalendarModule**: Usa `posts.map(post => post.createdAt.getDate())`
3. **ActivityModule**: Usa dados processados dos últimos 7 dias
4. **CategoryModule**: Usa contagem de posts por categoria
5. **RecentPostsModule**: Usa `posts.slice(0, 3)`
6. **SuggestionsModule**: Usa `notifications.slice(0, 3)`

### Processamento de Dados

O dashboard processa os dados em tempo real:

```typescript
const processedData = {
  suggestionsCount: notifications.filter(n => !n.read).length,
  contentDays: posts.map(post => {
    const date = post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt.seconds * 1000)
    return date.getDate()
  }),
  activityData: // Processa últimos 7 dias
  categories: // Agrupa posts por categoria
  recentPosts: // Últimos 3 posts
  suggestions: // Últimas 3 notificações
}
```

## 🔄 Atualizações em Tempo Real

Para implementar atualizações em tempo real, use `onSnapshot`:

```typescript
import { onSnapshot } from 'firebase/firestore';

// Escutar mudanças nos posts
const unsubscribe = onSnapshot(
  query(collection(db, 'posts'), where('userId', '==', userId)),
  (snapshot) => {
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(posts);
  }
);
```

## 🚀 Próximos Passos

1. **Implementar atualizações em tempo real** nos módulos do dashboard
2. **Adicionar paginação** para grandes volumes de dados
3. **Implementar cache local** para melhor performance
4. **Adicionar índices** no Firestore para consultas complexas
5. **Implementar backup automático** dos dados importantes

## 📝 Notas Importantes

- **Sempre incluir `userId`** nos documentos para segurança
- **Usar `serverTimestamp()`** para timestamps consistentes
- **Implementar tratamento de erros** em todas as operações
- **Validar dados** antes de salvar no Firestore
- **Usar transações** para operações críticas
- **Implementar rate limiting** para evitar spam
