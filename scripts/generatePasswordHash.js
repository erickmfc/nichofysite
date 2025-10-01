// scripts/generatePasswordHash.js
const bcrypt = require('bcryptjs')

async function generatePasswordHash() {
  const password = process.argv[2]
  
  if (!password) {
    console.log('Uso: node scripts/generatePasswordHash.js <senha>')
    console.log('Exemplo: node scripts/generatePasswordHash.js admin123')
    process.exit(1)
  }

  try {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    
    console.log('🔐 Hash gerado com sucesso!')
    console.log('Senha:', password)
    console.log('Hash:', hash)
    console.log('')
    console.log('Adicione ao seu arquivo .env.local:')
    console.log(`ADMIN_PASSWORD_HASH=${hash}`)
    
  } catch (error) {
    console.error('❌ Erro ao gerar hash:', error.message)
    process.exit(1)
  }
}

generatePasswordHash()
