# 🚀 Teste Rápido de Login

## 📋 Instruções para Resolver "Credenciais Inválidas"

### **Passo 1: Acesse o Login**
1. Abra o navegador
2. Vá para: `http://localhost:3000/login`
3. Aguarde a página carregar

### **Passo 2: Teste Google OAuth (Mais Fácil)**
1. **Clique em "Continuar com Google"**
2. **Escolha a conta:** `matheusfc777@gmail.com`
3. **Autorize o acesso**
4. **Deve redirecionar para o dashboard**

### **Passo 3: Se Google OAuth não funcionar, crie novo usuário**
1. **Clique em "Criar conta"** (ou acesse: `http://localhost:3000/login?mode=signup`)
2. **Preencha:**
   - Nome: `Teste`
   - Email: `teste@exemplo.com`
   - Senha: `123456`
3. **Clique em "Criar conta"**
4. **Deve redirecionar para o dashboard**

### **Passo 4: Teste Login com Email/Senha**
1. **Use as credenciais criadas:**
   - Email: `teste@exemplo.com`
   - Senha: `123456`
2. **Clique em "Entrar"**
3. **Deve fazer login com sucesso**

## 🔍 Se Ainda Der Erro

### **Verifique o Console (F12)**
1. **Abra o DevTools** (F12)
2. **Vá na aba Console**
3. **Tente fazer login**
4. **Copie qualquer erro que aparecer**

### **Verifique a Network (F12)**
1. **Vá na aba Network**
2. **Tente fazer login**
3. **Veja se há requisições para Firebase**
4. **Verifique se há erros 400/500**

## 📞 Reporte o Resultado

**Responda:**
1. ✅ Google OAuth funcionou?
2. ✅ Criação de usuário funcionou?
3. ✅ Login com email/senha funcionou?
4. ❌ Qual erro apareceu no console?

---

**💡 Dica:** O Google OAuth é sempre a opção mais confiável!
