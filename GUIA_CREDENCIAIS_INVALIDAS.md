# 🔧 Guia de Correção: Credenciais Inválidas

## 🚨 Problema Atual
Você está recebendo "Credenciais inválidas" ao tentar fazer login com Google.

## 🔍 Diagnóstico Automático
1. **Acesse a página de login:** `http://localhost:3000/login`
2. **Use o diagnóstico:** Clique nos botões de teste no painel vermelho no canto superior esquerdo
3. **Analise os resultados:** O diagnóstico mostrará exatamente qual é o problema

## 🛠️ Soluções Mais Comuns

### 1. **Domínio Não Autorizado** (`auth/unauthorized-domain`)
**Problema:** O Firebase não reconhece `localhost` como domínio autorizado.

**Solução:**
1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto: `nichofy-cb282`
3. Vá em: **Authentication** → **Settings** → **Authorized domains**
4. Adicione:
   - `localhost`
   - `localhost:3000`
   - `localhost:3001`
5. Clique em **Save**

### 2. **Google Sign-in Não Habilitado** (`auth/operation-not-allowed`)
**Problema:** O método de login Google não está ativado.

**Solução:**
1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto: `nichofy-cb282`
3. Vá em: **Authentication** → **Sign-in method**
4. Clique em **Google**
5. Ative o toggle **Enable**
6. Configure:
   - **Project support email:** `matheusfc777@gmail.com`
   - **Project public-facing name:** `NichoFy`
7. Clique em **Save**

### 3. **Client ID Incorreto** (`auth/invalid-credential`)
**Problema:** O Client ID do Google OAuth está incorreto.

**Solução:**
1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto: `nichofy-cb282`
3. Vá em: **Project Settings** → **General**
4. Na seção **Your apps**, clique no ícone da web
5. Copie o **Web API Key**
6. Verifique se está igual ao arquivo `lib/firebase.ts`

### 4. **Configuração OAuth Consent Screen**
**Problema:** A tela de consentimento do Google não está configurada.

**Solução:**
1. Acesse: https://console.cloud.google.com/
2. Selecione o projeto: `project-621379290571`
3. Vá em: **APIs & Services** → **OAuth consent screen**
4. Configure:
   - **User Type:** External
   - **App name:** `NichoFy`
   - **User support email:** `matheusfc777@gmail.com`
   - **Developer contact:** `matheusfc777@gmail.com`
5. Adicione os domínios autorizados:
   - `localhost`
   - `localhost:3000`
   - `localhost:3001`

## 🧪 Teste Passo a Passo

### Teste 1: Verificar Configuração Firebase
1. Clique em **"Verificar Config Firebase"** no diagnóstico
2. Verifique se todos os campos estão preenchidos
3. Confirme que está rodando em `localhost`

### Teste 2: Testar Email/Password
1. Clique em **"Testar Email/Password"** no diagnóstico
2. Se funcionar, o problema é específico do Google OAuth
3. Se não funcionar, há problema geral de configuração

### Teste 3: Testar Google OAuth
1. Clique em **"Testar Google OAuth"** no diagnóstico
2. Analise a mensagem de erro específica
3. Siga a solução correspondente acima

## 🔄 Após Corrigir

1. **Limpe o cache do navegador:** Ctrl+Shift+R
2. **Teste novamente:** Use o diagnóstico
3. **Se funcionar:** Remova o componente `CredentialsDiagnostic` da página de login

## 📞 Se Ainda Não Funcionar

1. **Verifique o console do navegador:** F12 → Console
2. **Procure por erros:** Códigos começando com `auth/`
3. **Teste em modo incógnito:** Para evitar cache
4. **Verifique a conexão:** Certifique-se de estar online

## 🎯 Configuração Final Esperada

### Firebase Console:
- ✅ **Authentication** → **Sign-in method** → **Google** → **Enabled**
- ✅ **Authentication** → **Settings** → **Authorized domains** → `localhost` adicionado
- ✅ **Project Settings** → **General** → **Web API Key** configurado

### Google Cloud Console:
- ✅ **OAuth consent screen** configurado
- ✅ **Authorized domains** incluem `localhost`
- ✅ **Client ID** correto

---

**💡 Dica:** Use sempre o diagnóstico automático primeiro - ele mostrará exatamente qual é o problema!
