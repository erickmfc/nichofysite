// Script para verificar configuração Firebase
// Execute este script no console do navegador

console.log('🔍 Verificando configuração Firebase...')

// Verificar se Firebase está carregado
if (typeof firebase !== 'undefined') {
  console.log('✅ Firebase carregado')
} else {
  console.log('❌ Firebase não carregado')
}

// Verificar configuração
const config = {
  apiKey: "AIzaSyCyND0kw70kzPofmq8_dK0K_gFF1qV1Jdo",
  authDomain: "nichofy-cb282.firebaseapp.com",
  projectId: "nichofy-cb282",
  storageBucket: "nichofy-cb282.firebasestorage.app",
  messagingSenderId: "621379290571",
  appId: "1:621379290571:web:ee5e75df2079378959e24e",
  measurementId: "G-DVBG19K4ZQ"
}

console.log('📋 Configuração atual:', config)

// Verificar domínio atual
console.log('🌐 Domínio atual:', window.location.hostname)
console.log('🔗 URL atual:', window.location.href)

// Verificar se é localhost
const isLocalhost = window.location.hostname === 'localhost'
console.log('🏠 É localhost:', isLocalhost)

// Teste de conectividade
fetch('https://nichofy-cb282.firebaseapp.com')
  .then(response => {
    console.log('🌐 Conectividade Firebase:', response.status)
  })
  .catch(error => {
    console.log('❌ Erro de conectividade:', error)
  })

console.log('✅ Verificação concluída')
