# 🚨 SOLUÇÃO RÁPIDA - Erro auth/invalid-credential

## 🎯 **Problema**
Erro `auth/invalid-credential` ao tentar fazer login no Firebase.

## ⚡ **Solução Imediata**

### **1. Verificar Firebase Console**
🔗 **Acesse:** https://console.firebase.google.com/project/nichofy-cb282/authentication/providers

**Verifique se está habilitado:**
- ✅ **Email/Password** - Deve estar ATIVO
- ✅ **Google** - Deve estar ATIVO (se usando Google Sign-in)

### **2. Verificar Domínios Autorizados**
🔗 **Acesse:** https://console.firebase.google.com/project/nichofy-cb282/authentication/settings

**Adicione estes domínios:**
- `localhost`
- `nichofy.shop`
- `nichofy-cb282.firebaseapp.com`
- `nichofy-cb282.web.app`

### **3. Testar Diagnóstico**
🔗 **Acesse:** http://localhost:3001/diagnostic

**Execute o diagnóstico completo para identificar o problema específico.**

## 🔧 **Configuração Atual**

```javascript
// Firebase Config (já configurado)
const firebaseConfig = {
  apiKey: "AIzaSyCyND0kw70kzPofmq8_dK0K_gFF1qV1Jdo",
  authDomain: "nichofy-cb282.firebaseapp.com",
  projectId: "nichofy-cb282",
  storageBucket: "nichofy-cb282.firebasestorage.app",
  messagingSenderId: "621379290571",
  appId: "1:621379290571:web:ee5e75df2079378959e24e",
  measurementId: "G-DVBG19K4ZQ"
}
```

## 🧪 **Teste Rápido**

1. **Acesse:** http://localhost:3001/login
2. **Tente login com:**
   - Email: `admin@nichofy.com`
   - Senha: `admin123` (ou senha configurada)
3. **Se falhar:** Execute o diagnóstico

## 📋 **Checklist Rápido**

- [ ] Email/Password habilitado no Firebase Console
- [ ] Domínios autorizados configurados
- [ ] Teste com credenciais válidas
- [ ] Execute diagnóstico se necessário

## 🚀 **Próximos Passos**

1. **Verifique o Firebase Console**
2. **Execute o diagnóstico**
3. **Teste a autenticação**
4. **Reporte o resultado**

---

**Status:** 🔍 Investigando auth/invalid-credential
**Prioridade:** 🔴 Alta
**Servidor:** http://localhost:3001
