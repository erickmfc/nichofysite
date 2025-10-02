const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

// Configuração do Firebase (usar as mesmas variáveis de ambiente)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function createTestUser() {
  try {
    console.log('🚀 Iniciando criação da conta de teste...');
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    const testEmail = 'avaliacao.plataforma@nichofy.shop';
    const testPassword = 'avaliar12345';
    const testName = 'Conta de Avaliação';
    
    console.log('📧 Criando usuário:', testEmail);
    
    // Criar usuário
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ Usuário criado:', userCredential.user.uid);
    
    // Atualizar perfil
    await updateProfile(userCredential.user, { 
      displayName: testName 
    });
    console.log('👤 Perfil atualizado');
    
    // Salvar dados no Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: testEmail,
      displayName: testName,
      createdAt: serverTimestamp(),
      role: 'user',
      provider: 'email',
      plan: 'pro', // Plano profissional para teste completo
      planStatus: 'active',
      planSelectedAt: serverTimestamp(),
      isTestAccount: true,
      testAccountCreatedAt: serverTimestamp()
    });
    console.log('💾 Dados salvos no Firestore');
    
    console.log('🎉 Conta de teste criada com sucesso!');
    console.log('📧 E-mail:', testEmail);
    console.log('🔑 Senha:', testPassword);
    console.log('👤 Nome:', testName);
    console.log('⭐ Plano: Profissional (para teste completo)');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro ao criar conta de teste:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ A conta de teste já existe!');
      console.log('📧 E-mail:', 'avaliacao.plataforma@nichofy.shop');
      console.log('🔑 Senha:', 'avaliar12345');
    }
    
    process.exit(1);
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  createTestUser();
}

module.exports = { createTestUser };
