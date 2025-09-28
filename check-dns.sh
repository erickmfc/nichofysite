#!/bin/bash
# Script para verificar configuração DNS do nichofy.shop

echo "🌐 Verificando configuração DNS para nichofy.shop"
echo "================================================"

# Verificar registro A
echo "📋 Verificando registro A..."
nslookup nichofy.shop

echo ""
echo "📋 Verificando registro TXT..."
nslookup -type=TXT nichofy.shop

echo ""
echo "🔍 Testando conectividade..."
curl -I https://nichofy.shop 2>/dev/null | head -1

echo ""
echo "✅ Verificação concluída!"
echo "📝 Se os registros não aparecerem, aguarde a propagação DNS (1-24h)"
