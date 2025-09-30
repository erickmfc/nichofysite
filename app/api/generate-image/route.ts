import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt || prompt.trim().length === 0) {
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
      prompt,
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
