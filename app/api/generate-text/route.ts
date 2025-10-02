import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit, apiRateLimiter } from '@/lib/utils/rateLimiter'
import { validateAndSanitize, contentSchema } from '@/lib/utils/validation'

// Prompts especializados para diferentes tipos de texto publicitário
const getPromptTemplate = (type: string, productDescription: string) => {
  const basePrompts = {
    copy: `Você é um copywriter especialista em criar textos persuasivos e vendas. 
    Crie um copy publicitário poderoso para: "${productDescription}"
    
    O texto deve:
    - Ser persuasivo e criar urgência
    - Destacar benefícios, não apenas características
    - Usar gatilhos mentais (escassez, autoridade, prova social)
    - Ter uma linguagem clara e direta
    - Incluir uma call-to-action forte
    - Máximo 200 palavras
    
    Formato: Título chamativo + texto persuasivo + call-to-action`,

    post: `Você é um especialista em marketing digital e criação de conteúdo para redes sociais.
    Crie um post envolvente para Instagram/LinkedIn sobre: "${productDescription}"
    
    O post deve:
    - Ser envolvente e gerar engajamento
    - Usar emojis estrategicamente
    - Ter uma linguagem conversacional
    - Incluir hashtags relevantes
    - Criar curiosidade ou valor
    - Máximo 150 palavras
    
    Formato: Texto principal + hashtags`,

    anuncio: `Você é um especialista em anúncios pagos (Google Ads, Facebook Ads).
    Crie um anúncio persuasivo para: "${productDescription}"
    
    O anúncio deve:
    - Ter um headline impactante
    - Destacar o benefício principal
    - Criar urgência ou escassez
    - Ser direto e objetivo
    - Incluir uma oferta clara
    - Máximo 100 palavras
    
    Formato: Headline + descrição + call-to-action`,

    email: `Você é um especialista em email marketing e automação de vendas.
    Crie um email persuasivo para: "${productDescription}"
    
    O email deve:
    - Ter um assunto chamativo
    - Criar conexão emocional
    - Apresentar o problema e a solução
    - Incluir prova social ou depoimentos
    - Ter uma call-to-action clara
    - Máximo 250 palavras
    
    Formato: Assunto + corpo do email + call-to-action`
  }

  return basePrompts[type as keyof typeof basePrompts] || basePrompts.copy
}

async function generateTextHandler(request: NextRequest) {
  try {
    const { prompt, type } = await request.json()

    // Validar e sanitizar o prompt
    const validation = validateAndSanitize({ title: prompt }, contentSchema)
    
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Descrição inválida', details: validation.errors },
        { status: 400 }
      )
    }

    const sanitizedPrompt = validation.data.title

    if (!sanitizedPrompt || sanitizedPrompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Descrição do produto/serviço é obrigatória' },
        { status: 400 }
      )
    }

    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Gerar texto usando o template especializado
    const promptTemplate = getPromptTemplate(type || 'copy', sanitizedPrompt)
    
    // Simulação de resposta da IA (em produção, aqui seria a integração real com OpenAI/Gemini)
    const generatedText = generateSampleText(type || 'copy', sanitizedPrompt)

    return NextResponse.json({
      success: true,
      text: generatedText,
      prompt: sanitizedPrompt,
      type: type || 'copy',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro ao gerar texto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para gerar textos de exemplo (simulação)
function generateSampleText(type: string, productDescription: string): string {
  const samples = {
    copy: `🚀 TRANSFORME SUA VIDA PROFISSIONAL EM APENAS 30 DIAS!

Você está cansado de trabalhar tanto e ganhar tão pouco? 

Nosso curso de ${productDescription.toLowerCase()} já transformou a vida de mais de 1.000 pessoas que hoje faturam 5x mais do que antes.

✅ Método comprovado usado por grandes empresas
✅ Suporte individual 24/7
✅ Garantia de 30 dias ou seu dinheiro de volta
✅ Certificado reconhecido no mercado

⚠️ ATENÇÃO: Vagas limitadas! Restam apenas 47 vagas para esta turma.

Não deixe esta oportunidade passar. Sua concorrência já está se preparando.

👉 CLIQUE AQUI e garante sua vaga agora mesmo!`,

    post: `🔥 Você sabia que 90% das pessoas que tentam ${productDescription.toLowerCase()} falham nos primeiros 3 meses?

Mas não precisa ser assim! 

Descobri um método que me fez sair do zero e alcançar resultados incríveis em apenas 30 dias.

✨ O que mudou na minha vida:
• Mais tempo com a família
• Liberdade financeira
• Trabalho com o que amo
• Reconhecimento profissional

E o melhor: você pode ter os mesmos resultados!

Quer saber como? Comenta "QUERO" que te mando os detalhes! 

#${productDescription.replace(/\s+/g, '').toLowerCase()} #sucesso #empreendedorismo #vida`,

    anuncio: `🎯 ${productDescription.toUpperCase()} - RESULTADOS GARANTIDOS!

✅ Método testado e aprovado
✅ Mais de 1.000 alunos satisfeitos  
✅ Suporte completo incluso
✅ Garantia de 30 dias

🔥 OFERTA LIMITADA: 50% de desconto apenas hoje!

Não perca esta oportunidade única. Vagas limitadas!

👉 CLIQUE AQUI e garante sua vaga agora!`,

    email: `Assunto: 🚨 Últimas 24h para garantir sua vaga!

Olá [Nome],

Você se lembra quando me disse que queria transformar sua vida profissional?

Bem, hoje é o último dia para você garantir sua vaga no nosso curso de ${productDescription.toLowerCase()}.

📊 Dados que você precisa saber:
• 94% dos nossos alunos aumentaram sua renda em até 300%
• Método aplicado por mais de 1.000 pessoas
• Suporte individual durante todo o processo
• Garantia total de satisfação

💡 O que nossos alunos estão dizendo:

"Em 30 dias consegui resultados que não tinha em 2 anos!" - Maria S.

"O investimento se pagou na primeira semana!" - João P.

⚠️ IMPORTANTE: Após hoje, o preço volta ao valor normal.

Não deixe esta oportunidade passar. Sua vida profissional merece uma mudança.

👉 Clique aqui e garanta sua vaga agora mesmo!

Com carinho,
Equipe de Sucesso

P.S.: Se você não ficar 100% satisfeito, devolvemos seu dinheiro. Sem perguntas.`
  }

  return samples[type as keyof typeof samples] || samples.copy
}

export const POST = withRateLimit(apiRateLimiter)(generateTextHandler)
