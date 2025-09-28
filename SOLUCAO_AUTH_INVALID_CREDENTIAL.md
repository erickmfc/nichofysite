# 🔥 Solução para Erro auth/invalid-credential

## 🚨 **Problema Identificado**
O erro `auth/invalid-credential` indica que as credenciais de autenticação estão inválidas ou mal configuradas.

## 🔍 **Possíveis Causas**

### 1. **Email/Password não habilitado**
- Método de autenticação não está ativado no Firebase Console
- Configuração incorreta do provedor

### 2. **Domínio não autorizado**
- Domínio atual não está na lista de domínios autorizados
- Configuração de OAuth incorreta

### 3. **Configuração do projeto**
- API Key inválida ou expirada
- Project ID incorreto
- Configuração do Firebase mal configurada

## 🛠️ **Soluções Passo a Passo**

### **Passo 1: Verificar Firebase Console**
1. Acesse: https://console.firebase.google.com/project/nichofy-cb282/authentication/providers
2. Verifique se **Email/Password** está habilitado
3. Se não estiver, clique em **Email/Password** e habilite

### **Passo 2: Verificar Domínios Autorizados**
1. No Firebase Console, vá em **Authentication > Settings**
2. Na seção **Authorized domains**, adicione:
   - `localhost` (para desenvolvimento)
   - `nichofy.shop` (domínio personalizado)
   - `nichofy-cb282.firebaseapp.com` (domínio Firebase)
   - `nichofy-cb282.web.app` (domínio Firebase)

### **Passo 3: Verificar Configuração OAuth**
1. Acesse: https://console.firebase.google.com/project/nichofy-cb282/authentication/providers
2. Clique em **Google**
3. Verifique se está habilitado
4. Configure o **Web client ID** se necessário

### **Passo 4: Testar Configuração**
1. Acesse: http://localhost:3001/diagnostic
2. Execute o diagnóstico
3. Verifique os resultados

## 🔧 **Configurações Atuais**

### **Firebase Config:**
```javascript
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

### **Google OAuth Config:**
```javascript
const googleOAuthConfig = {
  clientId: "621379290571-m1kr5opp266vh1vlkh0i2nd1oj4sc0ii.apps.googleusercontent.com",
  projectId: "project-621379290571",
  supportEmail: "matheusfc777@gmail.com"
}
```

## 🧪 **Teste de Credenciais**

### **Credenciais de Teste:**
- **Email:** `admin@nichofy.com`
- **Senha:** `admin123` (ou senha configurada)

### **Como Testar:**
1. Acesse: http://localhost:3001/login
2. Tente fazer login com as credenciais
3. Se falhar, execute o diagnóstico

## 📋 **Checklist de Verificação**

- [ ] Email/Password habilitado no Firebase Console
- [ ] Google Sign-in habilitado (se necessário)
- [ ] Domínios autorizados configurados
- [ ] API Key válida
- [ ] Project ID correto
- [ ] Configuração OAuth correta
- [ ] Teste com credenciais válidas

## 🚀 **Próximos Passos**

1. **Execute o diagnóstico:** http://localhost:3001/diagnostic
2. **Verifique o Firebase Console**
3. **Teste a autenticação**
4. **Reporte os resultados**

## 📞 **Suporte**

Se o problema persistir:
1. Execute o diagnóstico completo
2. Capture os resultados
3. Verifique o Firebase Console
4. Teste com diferentes credenciais

---

**Status:** 🔍 Investigando erro auth/invalid-credential
**Prioridade:** 🔴 Alta
**Responsável:** Sistema de Autenticação Firebase
