# 🔧 Solução para "Credenciais Inválidas" - Versão 2

## 🚨 Problema Identificado

O erro "Credenciais inválidas" pode ocorrer por vários motivos. Vamos diagnosticar e resolver passo a passo.

## 🔍 Diagnóstico Rápido

### 1. Verificar se o usuário existe
```bash
# Acesse o Firebase Console
# Vá em Authentication > Users
# Verifique se o email existe na lista
```

### 2. Testar com usuário conhecido
Use estas credenciais de teste que sabemos que funcionam:
- **Email:** `matheusfc777@gmail.com` (Google OAuth)
- **Email:** `teste@exemplo.com` (criar novo)

## 🛠️ Soluções

### **Solução 1: Criar Novo Usuário**

1. **Acesse a página de login**
2. **Clique em "Criar conta"**
3. **Preencha os dados:**
   - Nome: `Usuário Teste`
   - Email: `teste123@exemplo.com`
   - Senha: `123456`
4. **Clique em "Criar conta"**

### **Solução 2: Usar Google OAuth**

1. **Na página de login**
2. **Clique em "Continuar com Google"**
3. **Escolha a conta:** `matheusfc777@gmail.com`
4. **Autorize o acesso**

### **Solução 3: Reset de Senha**

Se você esqueceu a senha:

1. **Na página de login**
2. **Clique em "Esqueci minha senha"**
3. **Digite seu email**
4. **Verifique sua caixa de entrada**
5. **Siga as instruções do email**

## 🔧 Verificações Técnicas

### 1. Console do Navegador
Abra o DevTools (F12) e verifique:
- **Console:** Mensagens de erro
- **Network:** Requisições para Firebase
- **Application:** Cookies e localStorage

### 2. Firebase Console
Verifique se:
- **Authentication está habilitado**
- **Email/Password está ativo**
- **Google OAuth está configurado**

### 3. Configuração do Projeto
```javascript
// lib/firebase.ts - Verificar se está correto
const firebaseConfig = {
  apiKey: "AIzaSyCyND0kw70kzPofmq8_dK0K_gFF1qV1Jdo",
  authDomain: "nichofy-cb282.firebaseapp.com",
  projectId: "nichofy-cb282",
  // ... resto da configuração
};
```

## 🚀 Teste Rápido

### Teste 1: Login com Google
```bash
1. Acesse: http://localhost:3000/login
2. Clique em "Continuar com Google"
3. Escolha: matheusfc777@gmail.com
4. Deve redirecionar para /dashboard
```

### Teste 2: Criar Novo Usuário
```bash
1. Acesse: http://localhost:3000/login?mode=signup
2. Preencha:
   - Nome: Teste
   - Email: teste@exemplo.com
   - Senha: 123456
3. Clique em "Criar conta"
4. Deve redirecionar para /dashboard
```

### Teste 3: Login com Email/Senha
```bash
1. Use as credenciais criadas no Teste 2
2. Email: teste@exemplo.com
3. Senha: 123456
4. Deve fazer login com sucesso
```

## 🐛 Debug Avançado

### 1. Logs Detalhados
Adicione estes logs no console:
```javascript
// No console do navegador
console.log('Firebase Auth:', firebase.auth());
console.log('Current User:', firebase.auth().currentUser);
```

### 2. Verificar Erro Específico
```javascript
// No catch do login
catch (error) {
  console.log('Error Code:', error.code);
  console.log('Error Message:', error.message);
  console.log('Full Error:', error);
}
```

## 📋 Checklist de Verificação

- [ ] Firebase Authentication habilitado
- [ ] Email/Password provider ativo
- [ ] Google OAuth configurado
- [ ] Usuário existe no Firebase Console
- [ ] Senha tem pelo menos 6 caracteres
- [ ] Email está no formato correto
- [ ] Não há erros no console
- [ ] Network requests estão funcionando

## 🆘 Se Nada Funcionar

### Opção 1: Reset Completo
```bash
1. Limpe o cache do navegador
2. Limpe o localStorage
3. Reinicie o servidor: npm run dev
4. Tente novamente
```

### Opção 2: Usar Modo Incógnito
```bash
1. Abra uma janela anônima
2. Acesse: http://localhost:3000/login
3. Tente fazer login
```

### Opção 3: Verificar Firebase Rules
```javascript
// No Firebase Console > Firestore > Rules
// Verifique se as regras permitem autenticação
```

## 📞 Próximos Passos

1. **Teste a Solução 1** (criar novo usuário)
2. **Se funcionar:** O problema era credenciais inexistentes
3. **Se não funcionar:** Teste a Solução 2 (Google OAuth)
4. **Reporte o resultado** para continuarmos o diagnóstico

---

**💡 Dica:** O Google OAuth é sempre a opção mais confiável para teste inicial!
