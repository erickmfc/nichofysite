// app/api/cache/stats/route.ts
// API para estatísticas do cache Redis

import { NextRequest, NextResponse } from 'next/server'
import { CacheService } from '@/lib/redis'
import { withErrorMonitoring } from '@/lib/monitoring'

export const GET = withErrorMonitoring(async (request: NextRequest) => {
  try {
    const stats = await CacheService.getStats()
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao obter estatísticas do cache'
    }, { status: 500 })
  }
})

export const DELETE = withErrorMonitoring(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const pattern = searchParams.get('pattern')
    
    if (!pattern) {
      return NextResponse.json({
        success: false,
        error: 'Padrão não especificado'
      }, { status: 400 })
    }
    
    await CacheService.clearPattern(pattern)
    
    return NextResponse.json({
      success: true,
      message: `Cache limpo para o padrão: ${pattern}`
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao limpar cache'
    }, { status: 500 })
  }
})
