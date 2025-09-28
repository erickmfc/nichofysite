// app/api/monitoring/errors/route.ts
// API para monitoramento de erros

import { NextRequest, NextResponse } from 'next/server'
import { ErrorMonitoring } from '@/lib/monitoring'
import { withErrorMonitoring } from '@/lib/monitoring'

export const GET = withErrorMonitoring(async (request: NextRequest) => {
  try {
    const stats = await ErrorMonitoring.getErrorStats()
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao obter estatísticas de monitoramento'
    }, { status: 500 })
  }
})

export const POST = withErrorMonitoring(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { error, type, metadata, severity } = body
    
    await ErrorMonitoring.reportError(error, type, metadata, severity)
    
    return NextResponse.json({
      success: true,
      message: 'Erro reportado com sucesso'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao reportar erro'
    }, { status: 500 })
  }
})
