# 🔐 SOLUÇÃO: Credenciais Inválidas

## 🚨 **PROBLEMA IDENTIFICADO**
Erro "Credenciais inválidas" ao tentar fazer login.

## 🔍 **POSSÍVEIS CAUSAS**

### **1. Usuário Não Existe**
- ❌ **Problema**: Tentando fazer login com email/senha que não foi cadastrado
- 🔧 **Solução**: Criar um usuário primeiro ou usar credenciais existentes

### **2. Senha Incorreta**
- ❌ **Problema**: Email existe mas senha está errada
- 🔧 **Solução**: Verificar senha ou resetar senha

### **3. Configuração Firebase**
- ❌ **Problema**: Firebase não configurado corretamente
- 🔧 **Solução**: Verificar configuração

### **4. Autenticação Desabilitada**
- ❌ **Problema**: Email/Password auth desabilitado no Firebase
- 🔧 **Solução**: Habilitar no Firebase Console

---

## 🧪 **SOLUÇÕES PASSO A PASSO**

### **Solução 1: Criar Usuário de Teste**

#### **Opção A: Usar Cadastro no Site**
1. Acesse: `http://localhost:3003/login?mode=signup`
2. Preencha o formulário de cadastro:
   - **Nome**: Teste Usuário
   - **Email**: teste@nichofy.com
   - **Senha**: 123456
   - **Confirmar Senha**: 123456
3. Clique em "Criar Conta"
4. Após cadastro, faça login com essas credenciais

#### **Opção B: Usar Google OAuth**
1. Na página de login, clique em "Continuar com Google"
2. Use sua conta Google existente
3. Isso criará automaticamente um usuário no Firebase

### **Solução 2: Verificar Firebase Console**

#### **Passos no Firebase Console:**
1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto: `nichofy-cb282`
3. Vá para **Authentication** > **Sign-in method**
4. Verifique se **Email/Password** está habilitado
5. Se não estiver, habilite e salve

### **Solução 3: Verificar Usuários Existentes**

#### **No Firebase Console:**
1. Vá para **Authentication** > **Users**
2. Veja se há usuários cadastrados
3. Se houver, use essas credenciais
4. Se não houver, crie um novo usuário

---

## 🔧 **CREDENCIAIS DE TESTE RECOMENDADAS**

### **Usuário de Teste:**
- **Email**: teste@nichofy.com
- **Senha**: 123456
- **Nome**: Usuário Teste

### **Como Criar:**
1. Acesse: `http://localhost:3003/login?mode=signup`
2. Use as credenciais acima
3. Clique em "Criar Conta"
4. Faça login com as mesmas credenciais

---

## 🚨 **VERIFICAÇÕES IMPORTANTES**

### **No Console do Navegador:**
Procure por estes erros:
```
Firebase: Error (auth/user-not-found)
Firebase: Error (auth/wrong-password)
Firebase: Error (auth/invalid-email)
Firebase: Error (auth/user-disabled)
Firebase: Error (auth/too-many-requests)
```

### **Erros Comuns:**
- **auth/user-not-found**: Usuário não existe
- **auth/wrong-password**: Senha incorreta
- **auth/invalid-email**: Email inválido
- **auth/user-disabled**: Usuário desabilitado
- **auth/too-many-requests**: Muitas tentativas

---

## 🧪 **TESTE PASSO A PASSO**

### **Passo 1: Verificar Console**
1. Abra o console (F12)
2. Tente fazer login
3. Copie qualquer erro que aparecer

### **Passo 2: Criar Usuário**
1. Acesse: `http://localhost:3003/login?mode=signup`
2. Crie um usuário com:
   - Email: teste@nichofy.com
   - Senha: 123456
3. Confirme o cadastro

### **Passo 3: Fazer Login**
1. Volte para a página de login
2. Use as credenciais criadas
3. Verifique se funciona

### **Passo 4: Verificar Logs**
Procure por estes logs no console:
```
🔐 Login: Fazendo login com: teste@nichofy.com
🔐 Login: Login realizado com sucesso: teste@nichofy.com
🔐 useAuth: Redirecionando para /dashboard
```

---

## 🚀 **PRÓXIMOS PASSOS**

### **Se o problema persistir:**
1. **Copie o erro** do console
2. **Verifique** se o Firebase está configurado
3. **Teste** com Google OAuth
4. **Crie** usuário manualmente no Firebase Console

### **Se funcionar:**
1. ✅ **Teste** todas as funcionalidades
2. ✅ **Use** o checklist completo
3. ✅ **Faça** deploy quando tudo funcionar

---

## 💡 **DICAS IMPORTANTES**

- **SEMPRE** verifique o console para erros
- **USE** credenciais simples para teste (123456)
- **TESTE** primeiro o cadastro, depois o login
- **VERIFIQUE** se o Firebase está ativo
- **COPIE** erros específicos se houver

---

**🔧 TENTE CRIAR UM USUÁRIO PRIMEIRO E ME INFORME O RESULTADO!**

**📋 Use as credenciais de teste recomendadas!**
