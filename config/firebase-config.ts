// config/firebase-config.ts
export const firebaseConfig = {
  // Configuração do projeto Firebase
  projectId: "nichofy-cb282",
  authDomain: "nichofy-cb282.firebaseapp.com",
  storageBucket: "nichofy-cb282.appspot.com",
  
  // Configuração do Google Analytics
  measurementId: "506715686",
  
  // Configuração da conta de serviço
  serviceAccount: {
    email: "firebase-adminsdk-fbsvc@nichofy-cb282.iam.gserviceaccount.com",
    clientId: "101373751669209319428",
    privateKey: "YUEdiCK0lvH1HtSszVckUpi0x6epKhZQ4Crj-zQ6xKg"
  },
  
  // Configuração do Cloud Messaging
  webPushCertificates: {
    keyPair: "BPDnST8Pxn28D-U4-kvqOSYowBSnQRAiw4NGVb0MAxAKsgPnkOmJuxjoaRJoL9M6dZvD0AXh8GU-VFPZfCnt9Bc"
  }
}

// Instruções para configuração:
// 1. Acesse o Firebase Console: https://console.firebase.google.com/project/nichofy-cb282
// 2. Vá em Project Settings > General
// 3. Copie as chaves de configuração para o arquivo .env.local
// 4. Configure as variáveis de ambiente conforme necessário
