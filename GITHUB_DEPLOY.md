# 🚀 Deploy Automático do NichoFy - nichofy.shop

## ✅ **Status Atual:**
- ✅ **Código no GitHub** - [https://github.com/erickmfc/nichofysite.git](https://github.com/erickmfc/nichofysite.git)
- ✅ **Build funcionando** - Projeto compila perfeitamente
- ✅ **Firebase configurado** - Com suas chaves reais
- ✅ **Domínio ativo** - nichofy.shop na Hostinger
- ✅ **Deploy configurado** - vercel.json pronto

## 🎯 **Deploy Automático na Vercel:**

### **1. Conectar GitHub à Vercel:**
1. **Acesse:** https://vercel.com
2. **Faça login** com GitHub
3. **Clique em "New Project"**
4. **Importe:** `erickmfc/nichofysite`
5. **Configure o projeto:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (padrão)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### **2. Variáveis de Ambiente:**
Adicione estas variáveis na Vercel:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCyND0kw70kzPofmq8_dK0K_gFF1qV1Jdo
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nichofy-cb282
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nichofy-cb282.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nichofy-cb282.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=621379290571
NEXT_PUBLIC_FIREBASE_APP_ID=1:621379290571:web:ee5e75df2079378959e24e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-DVBG19K4ZQ
```

### **3. Deploy:**
1. **Clique em "Deploy"**
2. **Aguarde** o build (2-3 minutos)
3. **Teste** o site na URL temporária da Vercel

## 🌐 **Configurar Domínio Personalizado:**

### **Na Vercel Dashboard:**
1. **Vá em:** Settings > Domains
2. **Adicione:** `nichofy.shop`
3. **Adicione:** `www.nichofy.shop`
4. **Copie as instruções** de DNS

### **Na Hostinger (nichofy.shop):**

#### **Opção A: Nameservers (Recomendado)**
1. **Acesse:** Painel de Controle > DNS/Nameservers
2. **Altere para:**
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
3. **Aguarde propagação** (até 24h)

#### **Opção B: DNS Direto**
Configure estes registros:
```
Tipo: A
Nome: @
Valor: 76.76.19.61
TTL: 300

Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
TTL: 300
```

## 🔄 **Deploy Automático:**

### **Funcionamento:**
- ✅ **Push no GitHub** → Deploy automático na Vercel
- ✅ **Pull Request** → Preview automático
- ✅ **Merge na main** → Deploy em produção
- ✅ **SSL automático** → HTTPS gratuito

### **URLs do Projeto:**
- **GitHub:** https://github.com/erickmfc/nichofysite
- **Vercel:** https://nichofy.shop (domínio principal)
- **Produção:** https://nichofy.shop (após configurar DNS)

## 📋 **Checklist de Deploy:**

### **Antes do Deploy:**
- [x] Código no GitHub
- [x] Build funcionando localmente
- [x] Firebase configurado
- [x] Domínio ativo na Hostinger

### **Durante o Deploy:**
- [ ] Conectar GitHub à Vercel
- [ ] Configurar variáveis de ambiente
- [ ] Fazer primeiro deploy
- [ ] Testar site funcionando

### **Após o Deploy:**
- [ ] Configurar domínio personalizado
- [ ] Verificar SSL/HTTPS
- [ ] Testar todas as páginas
- [ ] Configurar analytics

## 🎉 **Resultado Final:**

Seu site **nichofy.shop** estará no ar com:
- ✅ **Deploy automático** do GitHub
- ✅ **SSL gratuito** e automático
- ✅ **CDN global** para velocidade
- ✅ **Firebase funcionando** perfeitamente
- ✅ **Todas as páginas** responsivas

## 🚀 **Comandos Úteis:**

```bash
# Verificar status do Git
git status

# Fazer novo commit
git add .
git commit -m "Descrição da mudança"
git push origin main

# Deploy manual na Vercel
vercel --prod
```

## 📞 **Suporte:**

- **Vercel Docs:** https://vercel.com/docs
- **GitHub:** https://github.com/erickmfc/nichofysite
- **Firebase:** https://console.firebase.google.com/project/nichofy-cb282

---

**🎉 Seu site estará no ar em poucos minutos!**
