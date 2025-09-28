# 🌐 Configuração do Domínio nichofy.shop para Firebase Hosting

## ✅ **Status Atual:**
- **Site no ar:** https://nichofy-cb282.web.app
- **Domínio:** nichofy.shop (Hostinger)
- **Nameservers atuais:** ns1.dns-parking.com, ns2.dns-parking.com

## 🎯 **Passo a Passo para Configurar nichofy.shop:**

### **1. Configurar Domínio no Firebase Console:**

#### **Acesse o Firebase Console:**
1. **Vá para:** https://console.firebase.google.com/project/nichofy-cb282/hosting
2. **Clique em "Add custom domain"**
3. **Digite:** `nichofy.shop`
4. **Clique em "Continue"**

#### **Verificação de Domínio:**
O Firebase vai pedir para você verificar o domínio. Você terá duas opções:

**Opção A: Verificação por TXT Record (Recomendado)**
- Firebase vai gerar um registro TXT
- Você adiciona esse registro na Hostinger
- Firebase verifica automaticamente

**Opção B: Verificação por Arquivo HTML**
- Firebase gera um arquivo HTML
- Você faz upload na Hostinger
- Firebase verifica o arquivo

### **2. Configurar DNS na Hostinger:**

#### **Método 1: Manter Nameservers da Hostinger (Recomendado)**

**Na Hostinger, configure estes registros DNS:**

```
Tipo: A
Nome: @
Valor: 151.101.1.195
TTL: 300

Tipo: A
Nome: @
Valor: 151.101.65.195
TTL: 300

Tipo: CNAME
Nome: www
Valor: nichofy-cb282.web.app
TTL: 300

Tipo: TXT
Nome: @
Valor: [valor fornecido pelo Firebase]
TTL: 300
```

#### **Método 2: Usar Nameservers do Firebase (Alternativo)**

**Na Hostinger:**
1. **Vá em:** DNS/Nameservers > Editar
2. **Altere para:**
   ```
   ns1.firebase-dns.com
   ns2.firebase-dns.com
   ```
3. **Aguarde propagação** (até 24h)

### **3. Verificar Configuração:**

#### **Teste de DNS:**
```bash
# Teste se o domínio está apontando corretamente
nslookup nichofy.shop
nslookup www.nichofy.shop
```

#### **Teste de Site:**
- **nichofy.shop** → Deve mostrar o site do NichoFy
- **www.nichofy.shop** → Deve redirecionar para nichofy.shop

### **4. SSL Automático:**

Após configurar o domínio:
- ✅ **SSL automático** - Firebase configura HTTPS
- ✅ **Renovação automática** - Sempre atualizado
- ✅ **Certificado válido** - Sem avisos de segurança

## 🔧 **Configuração Detalhada na Hostinger:**

### **Passo 1: Acessar DNS**
1. **Login na Hostinger**
2. **Vá em:** Meus domínios > nichofy.shop
3. **Clique em:** DNS/Nameservers
4. **Clique em:** Gerenciar registros DNS

### **Passo 2: Adicionar Registros**
1. **Clique em:** Adicionar registro
2. **Configure cada registro:**

**Registro A (Principal):**
```
Tipo: A
Nome: @
Aponta para: 151.101.1.195
TTL: 300
```

**Registro A (Secundário):**
```
Tipo: A
Nome: @
Aponta para: 151.101.65.195
TTL: 300
```

**Registro CNAME (WWW):**
```
Tipo: CNAME
Nome: www
Aponta para: nichofy-cb282.web.app
TTL: 300
```

**Registro TXT (Verificação Firebase):**
```
Tipo: TXT
Nome: @
Conteúdo: [valor fornecido pelo Firebase]
TTL: 300
```

### **Passo 3: Remover Registros Antigos**
- **Remova** registros A antigos (84.32.84.32)
- **Mantenha** apenas os novos registros do Firebase

## ⏱️ **Tempo de Propagação:**

- **DNS:** 5-30 minutos
- **SSL:** 5-10 minutos após DNS
- **Propagação global:** Até 24h

## 🚀 **Comandos para Deploy Futuro:**

```bash
# Build e deploy
npm run build
firebase deploy

# Deploy apenas hosting
firebase deploy --only hosting

# Verificar status
firebase hosting:sites:list
```

## 📋 **Checklist de Configuração:**

### **No Firebase Console:**
- [ ] Adicionar domínio nichofy.shop
- [ ] Verificar domínio (TXT ou HTML)
- [ ] Aguardar SSL automático

### **Na Hostinger:**
- [ ] Configurar registros A (151.101.1.195, 151.101.65.195)
- [ ] Configurar CNAME (www → nichofy-cb282.web.app)
- [ ] Adicionar TXT para verificação
- [ ] Remover registros antigos

### **Verificação Final:**
- [ ] nichofy.shop carrega o site
- [ ] www.nichofy.shop redireciona
- [ ] HTTPS funcionando
- [ ] SSL válido

## 🎉 **Resultado Final:**

Após a configuração:
- ✅ **nichofy.shop** → Site do NichoFy
- ✅ **www.nichofy.shop** → Redireciona para nichofy.shop
- ✅ **HTTPS automático** → SSL gratuito
- ✅ **CDN global** → Velocidade mundial
- ✅ **Deploy simples** → Um comando para atualizar

## 📞 **Suporte:**

Se precisar de ajuda:
- **Firebase Console:** https://console.firebase.google.com/project/nichofy-cb282/hosting
- **Hostinger:** https://support.hostinger.com
- **Status DNS:** https://dnschecker.org

---

**🎯 Siga este guia e seu domínio nichofy.shop estará funcionando perfeitamente!**
