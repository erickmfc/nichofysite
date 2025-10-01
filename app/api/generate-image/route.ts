import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit, apiRateLimiter } from '@/lib/utils/rateLimiter'
import { validateAndSanitize, contentSchema } from '@/lib/utils/validation'

async function generateImageHandler(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    // Validar e sanitizar o prompt
    const validation = validateAndSanitize({ title: prompt }, contentSchema)
    
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Prompt inválido', details: validation.errors },
        { status: 400 }
      )
    }

    const sanitizedPrompt = validation.data.title

    if (!sanitizedPrompt || sanitizedPrompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt é obrigatório' },
        { status: 400 }
      )
    }

    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Para demonstração, retornar uma URL de imagem aleatória
    // Em produção, aqui seria a integração real com a API do Gemini
    const imageUrl = `https://picsum.photos/400/400?random=${Date.now()}`

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt: sanitizedPrompt,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro ao gerar imagem:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export const POST = withRateLimit(apiRateLimiter)(generateImageHandler)
