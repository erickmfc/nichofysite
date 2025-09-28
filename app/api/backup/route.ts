// app/api/backup/route.ts
// API para gerenciamento de backups

import { NextRequest, NextResponse } from 'next/server'
import { BackupService } from '@/lib/backup'
import { withErrorMonitoring } from '@/lib/monitoring'

export const POST = withErrorMonitoring(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { type = 'daily' } = body
    
    const backup = await BackupService.executeBackup(type)
    
    return NextResponse.json({
      success: true,
      data: backup
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao executar backup'
    }, { status: 500 })
  }
})

export const GET = withErrorMonitoring(async (request: NextRequest) => {
  try {
    const backups = await BackupService.listBackups()
    
    return NextResponse.json({
      success: true,
      data: backups
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao listar backups'
    }, { status: 500 })
  }
})
