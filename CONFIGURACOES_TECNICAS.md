# ⚙️ CONFIGURAÇÕES TÉCNICAS - NichoFy

## 🔧 CONFIGURAÇÕES DO PROJETO

### **package.json**
```json
{
  "name": "nichofysite",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "^18",
    "react-dom": "^18",
    "firebase": "^10.7.1",
    "firebase-admin": "^12.0.0"
  }
}
```

### **next.config.js**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
```

### **tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}
```

## 🔐 CONFIGURAÇÕES DE AUTENTICAÇÃO

### **Firebase Auth Rules**
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ========================================
    // FUNÇÕES AUXILIARES
    // ========================================
    
    // Função para verificar se é admin
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email == 'admin@nichofy.com';
    }
    
    // Função para verificar se é usuário autenticado
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Função para verificar se é o próprio usuário
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    // ========================================
    // PEDIDOS (ORDERS) - Sistema Principal
    // ========================================
    
    match /orders/{orderId} {
      // Admin tem controle total sobre todos os pedidos
      allow read, write, delete: if isAdmin();
      
      // Usuários podem criar pedidos (formulário público)
      allow create: if true;
      
      // Usuários autenticados podem ler seus próprios pedidos
      allow read: if isAuthenticated() && 
                     resource.data.userId == request.auth.uid;
      
      // Usuários podem atualizar apenas feedback dos seus pedidos
      allow update: if isAuthenticated() && 
                       resource.data.userId == request.auth.uid &&
                       // Apenas campos específicos podem ser atualizados
                       request.resource.data.keys().hasAll(['feedback', 'updatedAt']) &&
                       request.resource.data.keys().size() <= 2;
    }
    
    // ========================================
    // USUÁRIOS (USERS) - Gestão de Contas
    // ========================================
    
    match /users/{userId} {
      // Admin tem controle total sobre todos os usuários
      allow read, write, delete: if isAdmin();
      
      // Usuários podem ler e escrever apenas seus próprios dados
      allow read, write: if isOwner(userId);
      
      // Permitir criação de novos usuários
      allow create: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // ========================================
    // CONTEÚDO (CONTENT) - Posts e Artigos
    // ========================================
    
    match /content/{contentId} {
      // Admin tem controle total sobre todo conteúdo
      allow read, write, delete: if isAdmin();
      
      // Conteúdo público para leitura
      allow read: if true;
      
      // Usuários autenticados podem criar conteúdo
      allow create: if isAuthenticated();
      
      // Usuários podem atualizar apenas seu próprio conteúdo
      allow update: if isAuthenticated() && 
                       resource.data.userId == request.auth.uid;
    }
    
    // ========================================
    // CONFIGURAÇÕES (SETTINGS) - Sistema
    // ========================================
    
    match /settings/{settingId} {
      // Admin tem controle total sobre configurações
      allow read, write, delete: if isAdmin();
      
      // Configurações públicas para leitura
      allow read: if true;
      
      // Usuários não podem modificar configurações
      allow write: if false;
    }
    
    // ========================================
    // NICHOS (NICHOS) - Categorias
    // ========================================
    
    match /nichos/{nichoId} {
      // Admin tem controle total sobre nichos
      allow read, write, delete: if isAdmin();
      
      // Nichos públicos para leitura
      allow read: if true;
      
      // Usuários não podem modificar nichos
      allow write: if false;
    }
    
    // ========================================
    // PROJETOS (PROJECTS) - Portfolio
    // ========================================
    
    match /projects/{projectId} {
      // Admin tem controle total sobre projetos
      allow read, write, delete: if isAdmin();
      
      // Projetos públicos para leitura
      allow read: if true;
      
      // Usuários não podem modificar projetos
      allow write: if false;
    }
    
    // ========================================
    // TEMPLATES - Modelos de Conteúdo
    // ========================================
    
    match /templates/{templateId} {
      // Admin tem controle total sobre templates
      allow read, write, delete: if isAdmin();
      
      // Templates públicos para leitura
      allow read: if true;
      
      // Usuários não podem modificar templates
      allow write: if false;
    }
    
    // ========================================
    // NOTIFICAÇÕES - Sistema de Alertas
    // ========================================
    
    match /notifications/{notificationId} {
      // Admin tem controle total sobre notificações
      allow read, write, delete: if isAdmin();
      
      // Usuários podem ler suas próprias notificações
      allow read: if isAuthenticated() && 
                     resource.data.userId == request.auth.uid;
      
      // Usuários podem marcar como lida
      allow update: if isAuthenticated() && 
                       resource.data.userId == request.auth.uid &&
                       request.resource.data.keys().hasAll(['isRead', 'readAt']);
    }
    
    // ========================================
    // PAGAMENTOS - Sistema Financeiro
    // ========================================
    
    match /payments/{paymentId} {
      // Admin tem controle total sobre pagamentos
      allow read, write, delete: if isAdmin();
      
      // Usuários podem ler seus próprios pagamentos
      allow read: if isAuthenticated() && 
                     resource.data.userId == request.auth.uid;
      
      // Usuários não podem modificar pagamentos
      allow write: if false;
    }
    
    // ========================================
    // ANALYTICS - Métricas e Estatísticas
    // ========================================
    
    match /analytics/{analyticsId} {
      // Admin tem controle total sobre métricas
      allow read, write, delete: if isAdmin();
      
      // Usuários podem ler suas próprias métricas
      allow read: if isAuthenticated() && 
                     resource.data.userId == request.auth.uid;
      
      // Sistema pode criar métricas automaticamente
      allow create: if true;
      
      // Usuários não podem modificar métricas
      allow update, delete: if false;
    }
    
    // ========================================
    // FEEDBACK - Avaliações e Comentários
    // ========================================
    
    match /feedback/{feedbackId} {
      // Admin tem controle total sobre feedback
      allow read, write, delete: if isAdmin();
      
      // Feedback público para leitura
      allow read: if true;
      
      // Usuários autenticados podem criar feedback
      allow create: if isAuthenticated();
      
      // Usuários podem atualizar apenas seu próprio feedback
      allow update: if isAuthenticated() && 
                       resource.data.userId == request.auth.uid;
    }
    
    // ========================================
    // LOGS - Registro de Atividades
    // ========================================
    
    match /logs/{logId} {
      // Apenas admin pode ler logs
      allow read: if isAdmin();
      
      // Sistema pode criar logs automaticamente
      allow create: if true;
      
      // Ninguém pode modificar ou deletar logs
      allow update, delete: if false;
    }
    
    // ========================================
    // REGRAS PADRÃO - Negar tudo não especificado
    // ========================================
    
    // Negar acesso a qualquer documento não especificado
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### **Firebase Storage Rules**
```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🌐 CONFIGURAÇÕES DE DOMÍNIO

### **DNS Records**
```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: nichofy.shop

Type: CNAME
Name: app
Value: nichofy.shop
```

### **Vercel Configuration**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

## 📊 CONFIGURAÇÕES DE ANALYTICS

### **Google Analytics**
```javascript
// Google Analytics 4
gtag('config', 'G-DVBG19K4ZQ', {
  page_title: 'NichoFy Dashboard',
  page_location: window.location.href
});
```

### **Firebase Analytics**
```javascript
// lib/firebase.ts
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics(app);

// Eventos personalizados
logEvent(analytics, 'content_created', {
  content_type: 'post',
  platform: 'instagram',
  niche: 'direito'
});
```

## 🔧 CONFIGURAÇÕES DE DESENVOLVIMENTO

### **VS Code Settings**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### **ESLint Configuration**
```javascript
// .eslintrc.json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off"
  }
}
```

### **TypeScript Configuration**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 🚀 CONFIGURAÇÕES DE DEPLOY

### **Build Scripts**
```bash
# Desenvolvimento local
npm run dev

# Build para produção
npm run build

# Teste local do build
npm run start

# Deploy no Vercel
vercel --prod

# Deploy no Firebase Hosting
firebase deploy
```

### **Environment Variables**
```bash
# .env.local (desenvolvimento)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCyND0kw70kzPofmq8_dK0K_gFF1qV1Jdo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nichofy-cb282.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nichofy-cb282
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nichofy-cb282.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=621379290571
NEXT_PUBLIC_FIREBASE_APP_ID=1:621379290571:web:ee5e75df2079378959e24e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-DVBG19K4ZQ

# .env.production (produção)
NEXT_PUBLIC_SITE_URL=https://nichofy.shop
NEXT_PUBLIC_API_URL=https://api.nichofy.shop
```

## 📱 CONFIGURAÇÕES DE RESPONSIVIDADE

### **Breakpoints Tailwind**
```css
/* Mobile First */
sm: '640px',   /* Small devices */
md: '768px',   /* Medium devices */
lg: '1024px',  /* Large devices */
xl: '1280px',  /* Extra large devices */
2xl: '1536px', /* 2X large devices */
```

### **Grid System**
```css
/* Containers */
.container {
  @apply max-w-6xl mx-auto px-4;
}

/* Grid Layouts */
.grid-responsive {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

/* Cards */
.card {
  @apply bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow;
}
```

## 🔍 CONFIGURAÇÕES DE DEBUG

### **Novos Hooks Implementados**
```javascript
// hooks/useMicroInteractions.ts - **ARQUIVO DELETADO**
export const useAnimatedCounter = (end: number, duration = 2000)
export const useAnimatedProgress = (targetProgress: number, duration = 1000)
export const StaggeredAnimation = ({ children, delay = 100, className = '' })
export const useHover = ()
export const useClickAnimation = ()
export const AnimatedButton = ({ children, onClick, variant, size, className, disabled })
export const SkeletonLoader = ({ className = '', lines = 1 })
```

### **Sistema de Toast**
```javascript
// components/ui/Toast.tsx
export const ToastProvider = ({ children })
export const useToast = () => {
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}
```

### **Error Boundaries**
```javascript
// components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo deu errado.</h1>;
    }
    return this.props.children;
  }
}
```

## 📊 CONFIGURAÇÕES DE PERFORMANCE

### **Next.js Optimizations**
```javascript
// next.config.js
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['firebase', 'firebase/auth'],
  }
};
```

### **Bundle Analysis**
```bash
# Analisar bundle
npm install --save-dev @next/bundle-analyzer

# Gerar relatório
ANALYZE=true npm run build
```

## 🔒 CONFIGURAÇÕES DE SEGURANÇA

### **Security Headers**
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

### **Rate Limiting**
```javascript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Implementar rate limiting aqui
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

## 📈 CONFIGURAÇÕES DE MONITORAMENTO

### **Health Check**
```javascript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}
```

### **Error Tracking**
```javascript
// lib/error-tracking.ts
export const trackError = (error: Error, context?: any) => {
  console.error('Error tracked:', error, context);
  // Integrar com serviço de monitoramento
};
```

---

## 🔄 CHECKLIST DE ATUALIZAÇÃO

### **Antes de Atualizar**
- [ ] Backup do código atual
- [ ] Teste em ambiente de desenvolvimento
- [ ] Verificação de dependências
- [ ] Teste de funcionalidades críticas

### **Após Atualizar**
- [ ] Teste de todas as páginas
- [ ] Verificação de performance
- [ ] Teste de responsividade
- [ ] Verificação de logs
- [ ] Deploy em produção

---

**📅 Última atualização**: Janeiro 2024  
**🔄 Próxima revisão**: Fevereiro 2024  
**👨‍💻 Responsável**: Equipe de Desenvolvimento
