import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { 
  UserProfile, 
  Post, 
  CalendarEvent, 
  Notification, 
  UserAnalytics, 
  CustomTemplate, 
  ContentSuggestion 
} from '@/lib/types/firestore';

export class FirestoreService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  // ===== USER PROFILE METHODS =====
  
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', this.userId));
      if (userDoc.exists()) {
        return { uid: this.userId, ...userDoc.data() } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      throw error;
    }
  }

  async createUserProfile(profileData: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, 'users', this.userId);
      await setDoc(userRef, {
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao criar perfil do usuário:', error);
      throw error;
    }
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, 'users', this.userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      throw error;
    }
  }

  // ===== POSTS METHODS =====

  async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const postsRef = collection(db, 'posts');
      const newPostRef = doc(postsRef);
      
      await setDoc(newPostRef, {
        ...postData,
        userId: this.userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return newPostRef.id;
    } catch (error) {
      console.error('Erro ao criar post:', error);
      throw error;
    }
  }

  async getUserPosts(limitCount: number = 10, lastDoc?: any): Promise<Post[]> {
    try {
      let q = query(
        collection(db, 'posts'),
        where('userId', '==', this.userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
    } catch (error) {
      console.error('Erro ao buscar posts do usuário:', error);
      throw error;
    }
  }

  async updatePost(postId: string, updates: Partial<Post>): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      throw error;
    }
  }

  async deletePost(postId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      throw error;
    }
  }

  // ===== CALENDAR EVENTS METHODS =====

  async createCalendarEvent(eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const eventsRef = collection(db, 'calendarEvents');
      const newEventRef = doc(eventsRef);
      
      await setDoc(newEventRef, {
        ...eventData,
        userId: this.userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return newEventRef.id;
    } catch (error) {
      console.error('Erro ao criar evento do calendário:', error);
      throw error;
    }
  }

  async getUserCalendarEvents(startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
    try {
      let q = query(
        collection(db, 'calendarEvents'),
        where('userId', '==', this.userId),
        orderBy('date', 'asc')
      );

      if (startDate && endDate) {
        q = query(
          collection(db, 'calendarEvents'),
          where('userId', '==', this.userId),
          where('date', '>=', Timestamp.fromDate(startDate)),
          where('date', '<=', Timestamp.fromDate(endDate)),
          orderBy('date', 'asc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CalendarEvent[];
    } catch (error) {
      console.error('Erro ao buscar eventos do calendário:', error);
      throw error;
    }
  }

  async updateCalendarEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<void> {
    try {
      const eventRef = doc(db, 'calendarEvents', eventId);
      await updateDoc(eventRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao atualizar evento do calendário:', error);
      throw error;
    }
  }

  async deleteCalendarEvent(eventId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'calendarEvents', eventId));
    } catch (error) {
      console.error('Erro ao deletar evento do calendário:', error);
      throw error;
    }
  }

  // ===== NOTIFICATIONS METHODS =====

  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<string> {
    try {
      const notificationsRef = collection(db, 'notifications');
      const newNotificationRef = doc(notificationsRef);
      
      await setDoc(newNotificationRef, {
        ...notificationData,
        userId: this.userId,
        read: false,
        createdAt: serverTimestamp(),
      });

      return newNotificationRef.id;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }
  }

  async getUserNotifications(limitCount: number = 20): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', this.userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(): Promise<void> {
    try {
      const notifications = await this.getUserNotifications(100);
      const batch = notifications
        .filter(n => !n.read)
        .map(n => this.markNotificationAsRead(n.id!));
      
      await Promise.all(batch);
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      throw error;
    }
  }

  // ===== ANALYTICS METHODS =====

  async getUserAnalytics(): Promise<UserAnalytics | null> {
    try {
      const analyticsDoc = await getDoc(doc(db, 'users', this.userId, 'analytics', 'main'));
      if (analyticsDoc.exists()) {
        return analyticsDoc.data() as UserAnalytics;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar analytics do usuário:', error);
      throw error;
    }
  }

  async updateUserAnalytics(analyticsData: Partial<UserAnalytics>): Promise<void> {
    try {
      const analyticsRef = doc(db, 'users', this.userId, 'analytics', 'main');
      await setDoc(analyticsRef, {
        ...analyticsData,
        userId: this.userId,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('Erro ao atualizar analytics do usuário:', error);
      throw error;
    }
  }

  // ===== CUSTOM TEMPLATES METHODS =====

  async createCustomTemplate(templateData: Omit<CustomTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const templatesRef = collection(db, 'users', this.userId, 'customTemplates');
      const newTemplateRef = doc(templatesRef);
      
      await setDoc(newTemplateRef, {
        ...templateData,
        userId: this.userId,
        usageCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return newTemplateRef.id;
    } catch (error) {
      console.error('Erro ao criar template customizado:', error);
      throw error;
    }
  }

  async getUserCustomTemplates(): Promise<CustomTemplate[]> {
    try {
      const q = query(
        collection(db, 'users', this.userId, 'customTemplates'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CustomTemplate[];
    } catch (error) {
      console.error('Erro ao buscar templates customizados:', error);
      throw error;
    }
  }

  // ===== CONTENT SUGGESTIONS METHODS =====

  async createContentSuggestion(suggestionData: Omit<ContentSuggestion, 'id' | 'createdAt'>): Promise<string> {
    try {
      const suggestionsRef = collection(db, 'users', this.userId, 'contentSuggestions');
      const newSuggestionRef = doc(suggestionsRef);
      
      await setDoc(newSuggestionRef, {
        ...suggestionData,
        userId: this.userId,
        isUsed: false,
        createdAt: serverTimestamp(),
      });

      return newSuggestionRef.id;
    } catch (error) {
      console.error('Erro ao criar sugestão de conteúdo:', error);
      throw error;
    }
  }

  async getUserContentSuggestions(limitCount: number = 10): Promise<ContentSuggestion[]> {
    try {
      const q = query(
        collection(db, 'users', this.userId, 'contentSuggestions'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContentSuggestion[];
    } catch (error) {
      console.error('Erro ao buscar sugestões de conteúdo:', error);
      throw error;
    }
  }

  async markSuggestionAsUsed(suggestionId: string): Promise<void> {
    try {
      const suggestionRef = doc(db, 'users', this.userId, 'contentSuggestions', suggestionId);
      await updateDoc(suggestionRef, {
        isUsed: true,
        usedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao marcar sugestão como usada:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  async getUserStats(): Promise<{
    totalPosts: number;
    totalEvents: number;
    unreadNotifications: number;
    totalTemplates: number;
  }> {
    try {
      const [posts, events, notifications, templates] = await Promise.all([
        this.getUserPosts(1000), // Get all posts for counting
        this.getUserCalendarEvents(),
        this.getUserNotifications(1000), // Get all notifications for counting
        this.getUserCustomTemplates()
      ]);

      return {
        totalPosts: posts.length,
        totalEvents: events.length,
        unreadNotifications: notifications.filter(n => !n.read).length,
        totalTemplates: templates.length,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do usuário:', error);
      throw error;
    }
  }
}
