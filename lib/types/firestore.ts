import { Timestamp } from 'firebase/firestore';

// Interface para informações da marca do usuário
export interface BrandInfo {
  name: string;
  niche: string;
  description: string;
  targetAudience: string;
  toneOfVoice: string[];
  logoUrl?: string;
  brandColors?: string[];
}

// Interface para preferências do usuário
export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'pt' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    contentReady: boolean;
    weeklyReport: boolean;
  };
  contentPreferences: {
    tone: string[];
    length: 'short' | 'medium' | 'long';
    hashtags: boolean;
    emojis: boolean;
    callToAction: boolean;
  };
}

// Interface para assinatura do usuário
export interface UserSubscription {
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended' | 'cancelled';
  startDate: Date | Timestamp;
  endDate?: Date | Timestamp;
  autoRenew: boolean;
}

// Interface principal do usuário
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  brandInfo: BrandInfo;
  preferences: UserPreferences;
  subscription: UserSubscription;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  onboardingCompleted: boolean;
  lastLoginAt?: Date | Timestamp;
}

// Interface para posts gerados
export interface Post {
  id?: string;
  userId: string;
  prompt: string;
  generatedContent: string;
  imageUrl?: string;
  category: 'Institucional' | 'Promocional' | 'Educativo' | 'Engajamento' | 'Motivacional';
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok';
  hashtags: string[];
  scheduledFor?: Date | Timestamp;
  publishedAt?: Date | Timestamp;
  interactions: {
    liked: boolean;
    saved: boolean;
    used: boolean;
    shared: boolean;
  };
  metadata: {
    niche: string;
    toneOfVoice: string[];
    targetAudience: string;
    wordCount: number;
    estimatedReadTime: number;
  };
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

// Interface para eventos do calendário
export interface CalendarEvent {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  date: Date | Timestamp;
  isHoliday: boolean;
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  color?: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

// Interface para notificações
export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: Date | Timestamp;
  readAt?: Date | Timestamp;
}

// Interface para analytics do usuário
export interface UserAnalytics {
  userId: string;
  totalPosts: number;
  postsByCategory: { [key: string]: number };
  postsByPlatform: { [key: string]: number };
  postsByMonth: { [key: string]: number };
  totalInteractions: {
    likes: number;
    saves: number;
    uses: number;
    shares: number;
  };
  averageEngagement: number;
  mostUsedHashtags: string[];
  lastActivityAt: Date | Timestamp;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

// Interface para templates customizados
export interface CustomTemplate {
  id?: string;
  userId: string;
  name: string;
  description: string;
  template: string;
  category: string;
  variables: string[];
  isPublic: boolean;
  usageCount: number;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

// Interface para sugestões de conteúdo
export interface ContentSuggestion {
  id?: string;
  userId: string;
  title: string;
  description: string;
  type: 'post' | 'story' | 'reel' | 'carousel';
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok';
  priority: 'high' | 'medium' | 'low';
  suggestedTime?: Date | Timestamp;
  category: string;
  hashtags: string[];
  isUsed: boolean;
  createdAt: Date | Timestamp;
  usedAt?: Date | Timestamp;
}
