// Verificação de configuração do Firebase
// Este arquivo ajuda a diagnosticar problemas de conexão

export const firebaseConfig = {
  apiKey: "AIzaSyCyND0kw70kzPofmq8_dK0K_gFF1qV1Jdo",
  authDomain: "nichofy-cb282.firebaseapp.com",
  projectId: "nichofy-cb282",
  storageBucket: "nichofy-cb282.firebasestorage.app",
  messagingSenderId: "621379290571",
  appId: "1:621379290571:web:ee5e75df2079378959e24e",
  measurementId: "G-DVBG19K4ZQ"
}

// Checklist de configuração do Firebase:
export const firebaseChecklist = {
  // 1. Verificar se Authentication está habilitado no console Firebase
  authenticationEnabled: true,
  
  // 2. Verificar se Email/Password está habilitado
  emailPasswordEnabled: true,
  
  // 3. Verificar se Firestore está habilitado
  firestoreEnabled: true,
  
  // 4. Verificar regras de segurança do Firestore
  firestoreRules: `
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Permitir leitura/escrita para usuários autenticados
        match /users/{userId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
        
        // Permitir leitura pública para nichos e configurações
        match /nichos/{document} {
          allow read: if true;
        }
        
        match /settings/{document} {
          allow read: if true;
        }
      }
    }
  `,
  
  // 5. Verificar se o domínio está autorizado
  authorizedDomains: [
    'localhost',
    'nichofy.shop',
    'nichofy-cb282.firebaseapp.com'
  ]
}

// Instruções para configurar Firebase:
export const setupInstructions = `
1. Acesse o Console Firebase: https://console.firebase.google.com/
2. Selecione o projeto: nichofy-cb282
3. Vá em Authentication > Sign-in method
4. Habilite "Email/Password"
5. Vá em Firestore Database
6. Configure as regras de segurança
7. Adicione o domínio localhost nas configurações de autorização
`
