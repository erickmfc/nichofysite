# 🔧 Guia de Configuração Google OAuth - NichoFy

## ⚠️ Problema: "Credenciais inválidas"

Este erro indica que o Google Sign-in não está configurado corretamente no console do Firebase.

## 🚀 Solução Passo a Passo

### 1. **Acesse o Console Firebase**
```
https://console.firebase.google.com/
```

### 2. **Selecione o Projeto**
- Projeto: `nichofy-cb282`
- Project ID: `nichofy-cb282`

### 3. **Configure Authentication**
1. No menu lateral, clique em **"Authentication"**
2. Clique na aba **"Sign-in method"**
3. Encontre **"Google"** na lista
4. Clique em **"Google"** para configurar

### 4. **Habilite Google Sign-in**
1. **Ative** o toggle "Enable"
2. **Project support email**: `matheusfc777@gmail.com`
3. Clique em **"Save"**

### 5. **Configure Web SDK**
1. Na seção **"Web SDK configuration"**
2. **Web client ID**: `621379290571-m1kr5opp266vh1vlkh0i2nd1oj4sc0ii.apps.googleusercontent.com`
3. **Web client secret**: (será gerado automaticamente)

### 6. **Autorize Domínios**
1. Na seção **"Authorized domains"**
2. Adicione os seguintes domínios:
   - `localhost`
   - `nichofy.shop`
   - `nichofy-cb282.firebaseapp.com`
   - `nichofy-cb282.web.app`

### 7. **Configure OAuth Consent Screen**
1. Acesse: https://console.developers.google.com/
2. Selecione o projeto: `project-621379290571`
3. Vá em **"OAuth consent screen"**
4. Configure:
   - **App name**: `NichoFy`
   - **User support email**: `matheusfc777@gmail.com`
   - **Developer contact**: `matheusfc777@gmail.com`

### 8. **Configure Credentials**
1. No mesmo projeto, vá em **"Credentials"**
2. Encontre o **"Web client"**
3. Verifique se o **Client ID** está correto:
   ```
   621379290571-m1kr5opp266vh1vlkh0i2nd1oj4sc0ii.apps.googleusercontent.com
   ```

## 🔍 Verificação

### Teste no Console do Navegador
1. Abra `http://localhost:3000/login`
2. Abra o **Console do Navegador** (F12)
3. Clique em **"Testar Google Login"**
4. Verifique se não há erros no console

### Erros Comuns e Soluções

| Erro | Solução |
|------|---------|
| `auth/operation-not-allowed` | Habilite Google Sign-in no Firebase |
| `auth/unauthorized-domain` | Adicione localhost nas URLs autorizadas |
| `auth/invalid-credential` | Verifique o Client ID |
| `auth/popup-blocked` | Desabilite bloqueador de popup |

## 📋 Checklist de Configuração

- [ ] Firebase Authentication habilitado
- [ ] Google Sign-in habilitado
- [ ] Web SDK configurado
- [ ] Client ID correto
- [ ] Domínios autorizados
- [ ] OAuth consent screen configurado
- [ ] Credentials válidas

## 🆘 Suporte

Se o problema persistir:
1. Use o **"Diagnóstico Google Auth"** na página de login
2. Verifique os logs do console do navegador
3. Confirme todas as configurações no Firebase Console

## 🔗 Links Úteis

- [Firebase Console](https://console.firebase.google.com/)
- [Google Cloud Console](https://console.developers.google.com/)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
