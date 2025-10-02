import { db } from '@/lib/firebase'
import { collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore'

export interface FirebaseTestResult {
  success: boolean
  error?: string
  requestId?: string
}

export async function testFirebaseConnection(): Promise<FirebaseTestResult> {
  try {
    console.log('🔗 Testando conexão básica com Firebase...')
    
    // Teste simples: tentar acessar uma coleção
    const testCollection = collection(db, 'test')
    console.log('✅ Coleção de teste acessada')
    
    return {
      success: true
    }
  } catch (error: any) {
    console.error('❌ Erro na conexão:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido'
    }
  }
}

export async function testContentRequestSubmission(userId: string): Promise<FirebaseTestResult> {
  try {
    console.log('📝 Testando envio de pedido de teste...')
    
    const testRequestData = {
      userId: userId,
      userEmail: 'test@example.com',
      userName: 'Usuário de Teste',
      
      // Informações básicas
      title: 'Teste de Conexão - Pedido Automático',
      description: 'Este é um pedido de teste para verificar a conectividade do sistema.',
      category: 'Teste',
      platform: 'Teste',
      
      // Detalhes avançados
      objective: 'Teste de sistema',
      tone: 'Neutro',
      targetAudience: 'Desenvolvedores',
      keywords: 'teste, conexão, sistema',
      
      // Especificações técnicas
      size: 'Padrão',
      includeHashtags: false,
      includeCTA: false,
      urgency: 'Normal',
      
      // Referências e observações
      references: '',
      notes: 'Pedido criado automaticamente para teste de conectividade',
      
      // Status inicial
      status: 'test',
      createdAt: Timestamp.now(),
      isTestRequest: true
    }

    console.log('📦 Dados do pedido de teste:', testRequestData)
    
    const docRef = await addDoc(collection(db, 'contentRequests'), testRequestData)
    
    console.log('✅ Pedido de teste enviado com sucesso! ID:', docRef.id)
    
    return {
      success: true,
      requestId: docRef.id
    }
  } catch (error: any) {
    console.error('❌ Erro no envio do pedido de teste:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido'
    }
  }
}

export async function testUserPermissions(userId: string): Promise<FirebaseTestResult> {
  try {
    console.log('🔐 Testando permissões do usuário...')
    
    // Teste 1: Verificar se pode ler dados do usuário
    const userQuery = query(collection(db, 'users'), where('uid', '==', userId))
    const userSnapshot = await getDocs(userQuery)
    
    if (userSnapshot.empty) {
      console.warn('⚠️ Usuário não encontrado na coleção users')
    } else {
      console.log('✅ Usuário encontrado na coleção users')
    }
    
    // Teste 2: Verificar se pode criar um documento de teste
    const testDoc = await addDoc(collection(db, 'test'), {
      userId: userId,
      testType: 'permission_test',
      createdAt: Timestamp.now()
    })
    
    console.log('✅ Documento de teste criado:', testDoc.id)
    
    return {
      success: true,
      requestId: testDoc.id
    }
  } catch (error: any) {
    console.error('❌ Erro no teste de permissões:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido'
    }
  }
}