// Diagnóstico de problemas com pedidos de conteúdo
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, Timestamp, doc, getDoc } from 'firebase/firestore'

export interface DiagnosticResult {
  success: boolean
  step: string
  error?: string
  details?: any
}

export async function diagnoseContentRequestIssue(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = []
  
  try {
    // Teste 1: Verificar se o Firebase está inicializado
    results.push({
      success: !!db,
      step: 'Firebase Initialization',
      details: { dbExists: !!db }
    })
    
    if (!db) {
      return results
    }
    
    // Teste 2: Verificar se consegue acessar coleções
    try {
      const testCollection = collection(db, 'test')
      results.push({
        success: true,
        step: 'Collection Access',
        details: { collectionPath: testCollection.path }
      })
    } catch (error: any) {
      results.push({
        success: false,
        step: 'Collection Access',
        error: error.message,
        details: { code: error.code }
      })
    }
    
    // Teste 3: Verificar se consegue criar documentos
    try {
      const testDoc = await addDoc(collection(db, 'test'), {
        test: true,
        timestamp: Timestamp.now(),
        message: 'Diagnostic test'
      })
      results.push({
        success: true,
        step: 'Document Creation',
        details: { docId: testDoc.id }
      })
    } catch (error: any) {
      results.push({
        success: false,
        step: 'Document Creation',
        error: error.message,
        details: { code: error.code }
      })
    }
    
    // Teste 4: Verificar se consegue ler documentos
    try {
      const snapshot = await getDocs(collection(db, 'test'))
      results.push({
        success: true,
        step: 'Document Reading',
        details: { docCount: snapshot.size }
      })
    } catch (error: any) {
      results.push({
        success: false,
        step: 'Document Reading',
        error: error.message,
        details: { code: error.code }
      })
    }
    
    // Teste 5: Verificar se consegue criar pedidos de conteúdo
    try {
      const contentRequest = {
        userId: 'test-user-id',
        userEmail: 'test@example.com',
        userName: 'Test User',
        title: 'Test Request',
        description: 'This is a test request',
        category: 'test',
        platform: 'Instagram',
        objective: 'educar',
        tone: 'profissional',
        targetAudience: 'test',
        keywords: 'test',
        size: 'padrao',
        includeHashtags: true,
        includeCTA: true,
        urgency: 'normal',
        references: '',
        notes: 'Test request',
        status: 'pending',
        createdAt: Timestamp.now()
      }
      
      const docRef = await addDoc(collection(db, 'contentRequests'), contentRequest)
      results.push({
        success: true,
        step: 'Content Request Creation',
        details: { requestId: docRef.id }
      })
    } catch (error: any) {
      results.push({
        success: false,
        step: 'Content Request Creation',
        error: error.message,
        details: { code: error.code }
      })
    }
    
  } catch (error: any) {
    results.push({
      success: false,
      step: 'General Error',
      error: error.message,
      details: { code: error.code }
    })
  }
  
  return results
}

// Função para verificar configurações específicas
export async function checkFirebaseConfiguration(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = []
  
  try {
    // Verificar se as variáveis de ambiente estão definidas
    const envVars = {
      NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    }
    
    results.push({
      success: Object.values(envVars).every(Boolean),
      step: 'Environment Variables',
      details: envVars
    })
    
    // Verificar se o projeto Firebase está acessível
    try {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      if (projectId) {
        results.push({
          success: true,
          step: 'Project ID',
          details: { projectId }
        })
      } else {
        results.push({
          success: false,
          step: 'Project ID',
          error: 'Project ID not found in environment variables'
        })
      }
    } catch (error: any) {
      results.push({
        success: false,
        step: 'Project ID',
        error: error.message
      })
    }
    
  } catch (error: any) {
    results.push({
      success: false,
      step: 'Configuration Check',
      error: error.message
    })
  }
  
  return results
}
