# 🌐 Configuração do Domínio nichofy.shop

## ✅ Status: Configuração Firebase Concluída

O Firebase já configurou o domínio personalizado. Agora você precisa adicionar os registros DNS no seu provedor de domínio.

## 📋 Registros DNS Necessários

### **Registro A (Principal)**
```
Tipo: A
Nome: nichofy.shop
Valor: 199.36.158.100
TTL: 3600 (ou padrão)
```

### **Registro TXT (Verificação)**
```
Tipo: TXT
Nome: nichofy.shop
Valor: hosting-site=nichofy-cb282
TTL: 3600 (ou padrão)
```

## 🔧 Como Configurar

### **1. Acesse seu Provedor DNS**
- **Hostinger:** https://hpanel.hostinger.com
- **GoDaddy:** https://dcc.godaddy.com
- **Cloudflare:** https://dash.cloudflare.com
- **Registro.br:** https://registro.br

### **2. Localize a Zona DNS**
- Procure por "DNS", "Zona DNS" ou "Gerenciar DNS"
- Selecione o domínio `nichofy.shop`

### **3. Adicione os Registros**

#### **Registro A:**
1. Clique em "Adicionar Registro" ou "+"
2. Selecione tipo "A"
3. Nome: `@` ou `nichofy.shop`
4. Valor: `199.36.158.100`
5. TTL: `3600` (1 hora)
6. Salve

#### **Registro TXT:**
1. Clique em "Adicionar Registro" ou "+"
2. Selecione tipo "TXT"
3. Nome: `@` ou `nichofy.shop`
4. Valor: `hosting-site=nichofy-cb282`
5. TTL: `3600` (1 hora)
6. Salve

## ⏱️ Tempo de Propagação

- **Propagação DNS:** 1-24 horas
- **Verificação Firebase:** Até 24 horas
- **Status:** Aguardando verificação

## 🔍 Como Verificar

### **1. Verificar DNS:**
```bash
# No terminal/cmd
nslookup nichofy.shop
dig nichofy.shop
```

### **2. Verificar Firebase:**
- Acesse: https://console.firebase.google.com/project/nichofy-cb282/hosting
- Vá em "Domínios personalizados"
- Status deve mudar para "Conectado"

### **3. Testar Site:**
- Acesse: https://nichofy.shop
- Deve redirecionar para o site Firebase

## 🚨 Troubleshooting

### **Se não funcionar:**

1. **Verifique os registros:**
   - Confirme que os valores estão exatos
   - Sem espaços extras
   - TTL configurado

2. **Aguarde propagação:**
   - DNS pode levar até 24h
   - Use ferramentas online para verificar

3. **Contate suporte:**
   - Firebase: https://firebase.google.com/support
   - Provedor DNS: Suporte técnico

## 📱 Ferramentas de Verificação

- **DNS Checker:** https://dnschecker.org
- **What's My DNS:** https://whatsmydns.net
- **DNS Propagation:** https://dnspropagation.net

## 🎯 Próximos Passos

1. ✅ Adicionar registros DNS
2. ⏳ Aguardar propagação (1-24h)
3. 🔍 Verificar no Firebase Console
4. 🌐 Testar https://nichofy.shop
5. 🚀 Site funcionando!

## 📞 Suporte

Se precisar de ajuda:
- **Firebase Docs:** https://firebase.google.com/docs/hosting/custom-domain
- **Status:** Aguardando configuração DNS
- **Prazo:** Até 24 horas para funcionar

---

**Última atualização:** $(date)
**Status:** Aguardando configuração DNS
