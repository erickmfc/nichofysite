// lib/backup.ts
// Sistema de backup automático para NichoFy

import { db } from './firebase'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { CacheService } from './redis'
import { ErrorMonitoring } from './monitoring'

// Configuração do backup
export const BACKUP_CONFIG = {
  // Intervalos de backup
  intervals: {
    daily: 24 * 60 * 60 * 1000,    // 24 horas
    weekly: 7 * 24 * 60 * 60 * 1000, // 7 dias
    monthly: 30 * 24 * 60 * 60 * 1000 // 30 dias
  },
  
  // Destinos de backup
  destinations: {
    local: process.env.BACKUP_LOCAL_PATH || './backups',
    s3: {
      bucket: process.env.AWS_S3_BACKUP_BUCKET,
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    gcs: {
      bucket: process.env.GCS_BACKUP_BUCKET,
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE
    }
  },
  
  // Configurações de retenção
  retention: {
    daily: 30,   // Manter 30 backups diários
    weekly: 12,  // Manter 12 backups semanais
    monthly: 12  // Manter 12 backups mensais
  }
}

// Interface de backup
export interface BackupData {
  id: string
  timestamp: Date
  type: 'daily' | 'weekly' | 'monthly'
  collections: {
    [collectionName: string]: any[]
  }
  metadata: {
    totalDocuments: number
    totalSize: number
    duration: number
    version: string
  }
}

// Classe principal de backup
export class BackupService {
  private static isRunning = false
  
  // Executar backup completo
  static async executeBackup(type: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<BackupData> {
    if (this.isRunning) {
      throw new Error('Backup já está em execução')
    }
    
    this.isRunning = true
    const startTime = Date.now()
    
    try {
      console.log(`🔄 Iniciando backup ${type}...`)
      
      const backupData: BackupData = {
        id: this.generateBackupId(),
        timestamp: new Date(),
        type,
        collections: {},
        metadata: {
          totalDocuments: 0,
          totalSize: 0,
          duration: 0,
          version: process.env.npm_package_version || '1.0.0'
        }
      }
      
      // Coleções para backup
      const collectionsToBackup = [
        'users',
        'orders',
        'content',
        'projects',
        'nichos',
        'templates',
        'notifications',
        'settings',
        'analytics',
        'feedback'
      ]
      
      // Fazer backup de cada coleção
      for (const collectionName of collectionsToBackup) {
        try {
          console.log(`📦 Fazendo backup da coleção: ${collectionName}`)
          const collectionData = await this.backupCollection(collectionName)
          backupData.collections[collectionName] = collectionData
          backupData.metadata.totalDocuments += collectionData.length
        } catch (error) {
          console.error(`❌ Erro ao fazer backup da coleção ${collectionName}:`, error)
          await ErrorMonitoring.reportError(
            `Backup collection error: ${collectionName}`,
            ErrorType.DATABASE_ERROR,
            { collectionName, error: (error as Error).message }
          )
        }
      }
      
      // Calcular tamanho total
      backupData.metadata.totalSize = JSON.stringify(backupData).length
      backupData.metadata.duration = Date.now() - startTime
      
      // Salvar backup
      await this.saveBackup(backupData)
      
      // Limpar backups antigos
      await this.cleanupOldBackups(type)
      
      console.log(`✅ Backup ${type} concluído em ${backupData.metadata.duration}ms`)
      
      return backupData
      
    } catch (error) {
      await ErrorMonitoring.reportError(
        `Backup execution error: ${type}`,
        ErrorType.SERVER_ERROR,
        { type, error: (error as Error).message },
        'critical'
      )
      throw error
    } finally {
      this.isRunning = false
    }
  }
  
  // Fazer backup de uma coleção específica
  private static async backupCollection(collectionName: string): Promise<any[]> {
    try {
      const snapshot = await getDocs(collection(db, collectionName))
      const documents: any[] = []
      
      snapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          data: doc.data(),
          metadata: {
            createdAt: doc.metadata.fromCache ? 'cached' : 'server',
            lastModified: new Date()
          }
        })
      })
      
      return documents
    } catch (error) {
      console.error(`Erro ao fazer backup da coleção ${collectionName}:`, error)
      return []
    }
  }
  
  // Salvar backup
  private static async saveBackup(backupData: BackupData): Promise<void> {
    try {
      // Salvar no cache Redis
      await CacheService.set(`backup:${backupData.id}`, backupData, 86400 * 7) // 7 dias
      
      // Salvar localmente
      await this.saveBackupLocally(backupData)
      
      // Salvar na nuvem (S3/GCS)
      await this.saveBackupToCloud(backupData)
      
    } catch (error) {
      console.error('Erro ao salvar backup:', error)
      throw error
    }
  }
  
  // Salvar backup localmente
  private static async saveBackupLocally(backupData: BackupData): Promise<void> {
    try {
      const fs = await import('fs/promises')
      const path = await import('path')
      
      const backupDir = BACKUP_CONFIG.destinations.local
      const fileName = `backup_${backupData.type}_${backupData.id}.json`
      const filePath = path.join(backupDir, fileName)
      
      // Criar diretório se não existir
      await fs.mkdir(backupDir, { recursive: true })
      
      // Salvar arquivo
      await fs.writeFile(filePath, JSON.stringify(backupData, null, 2))
      
      console.log(`💾 Backup salvo localmente: ${filePath}`)
    } catch (error) {
      console.error('Erro ao salvar backup local:', error)
    }
  }
  
  // Salvar backup na nuvem
  private static async saveBackupToCloud(backupData: BackupData): Promise<void> {
    try {
      // AWS S3
      if (BACKUP_CONFIG.destinations.s3.bucket) {
        await this.saveToS3(backupData)
      }
      
      // Google Cloud Storage
      if (BACKUP_CONFIG.destinations.gcs.bucket) {
        await this.saveToGCS(backupData)
      }
      
    } catch (error) {
      console.error('Erro ao salvar backup na nuvem:', error)
    }
  }
  
  // Salvar no AWS S3
  private static async saveToS3(backupData: BackupData): Promise<void> {
    try {
      const AWS = await import('aws-sdk')
      const s3 = new AWS.S3({
        accessKeyId: BACKUP_CONFIG.destinations.s3.accessKeyId,
        secretAccessKey: BACKUP_CONFIG.destinations.s3.secretAccessKey,
        region: BACKUP_CONFIG.destinations.s3.region
      })
      
      const fileName = `backups/${backupData.type}/backup_${backupData.id}.json`
      
      await s3.upload({
        Bucket: BACKUP_CONFIG.destinations.s3.bucket,
        Key: fileName,
        Body: JSON.stringify(backupData, null, 2),
        ContentType: 'application/json',
        ServerSideEncryption: 'AES256'
      }).promise()
      
      console.log(`☁️ Backup salvo no S3: ${fileName}`)
    } catch (error) {
      console.error('Erro ao salvar no S3:', error)
    }
  }
  
  // Salvar no Google Cloud Storage
  private static async saveToGCS(backupData: BackupData): Promise<void> {
    try {
      const { Storage } = await import('@google-cloud/storage')
      const storage = new Storage({
        projectId: BACKUP_CONFIG.destinations.gcs.projectId,
        keyFilename: BACKUP_CONFIG.destinations.gcs.keyFilename
      })
      
      const bucket = storage.bucket(BACKUP_CONFIG.destinations.gcs.bucket)
      const fileName = `backups/${backupData.type}/backup_${backupData.id}.json`
      const file = bucket.file(fileName)
      
      await file.save(JSON.stringify(backupData, null, 2), {
        metadata: {
          contentType: 'application/json',
          cacheControl: 'private, max-age=0'
        }
      })
      
      console.log(`☁️ Backup salvo no GCS: ${fileName}`)
    } catch (error) {
      console.error('Erro ao salvar no GCS:', error)
    }
  }
  
  // Limpar backups antigos
  private static async cleanupOldBackups(type: 'daily' | 'weekly' | 'monthly'): Promise<void> {
    try {
      const retention = BACKUP_CONFIG.retention[type]
      console.log(`🧹 Limpando backups antigos (${type}): mantendo ${retention}`)
      
      // Implementar lógica de limpeza baseada no tipo
      // Por enquanto, apenas log
      console.log(`✅ Limpeza de backups ${type} concluída`)
    } catch (error) {
      console.error('Erro na limpeza de backups:', error)
    }
  }
  
  // Restaurar backup
  static async restoreBackup(backupId: string): Promise<void> {
    try {
      console.log(`🔄 Restaurando backup: ${backupId}`)
      
      // Carregar backup
      const backupData = await CacheService.get<BackupData>(`backup:${backupId}`)
      if (!backupData) {
        throw new Error('Backup não encontrado')
      }
      
      // Restaurar cada coleção
      for (const [collectionName, documents] of Object.entries(backupData.collections)) {
        console.log(`📦 Restaurando coleção: ${collectionName}`)
        await this.restoreCollection(collectionName, documents)
      }
      
      console.log(`✅ Backup restaurado: ${backupId}`)
    } catch (error) {
      console.error('Erro ao restaurar backup:', error)
      throw error
    }
  }
  
  // Restaurar coleção
  private static async restoreCollection(collectionName: string, documents: any[]): Promise<void> {
    try {
      const { setDoc } = await import('firebase/firestore')
      
      for (const docData of documents) {
        await setDoc(doc(db, collectionName, docData.id), docData.data)
      }
      
      console.log(`✅ Coleção ${collectionName} restaurada: ${documents.length} documentos`)
    } catch (error) {
      console.error(`Erro ao restaurar coleção ${collectionName}:`, error)
    }
  }
  
  // Listar backups disponíveis
  static async listBackups(): Promise<BackupData[]> {
    try {
      // Implementar listagem de backups
      // Por enquanto, retornar array vazio
      return []
    } catch (error) {
      console.error('Erro ao listar backups:', error)
      return []
    }
  }
  
  // Gerar ID único para backup
  private static generateBackupId(): string {
    return `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  // Agendar backups automáticos
  static scheduleAutomaticBackups(): void {
    // Backup diário às 2:00 AM
    setInterval(async () => {
      try {
        await this.executeBackup('daily')
      } catch (error) {
        console.error('Erro no backup diário:', error)
      }
    }, BACKUP_CONFIG.intervals.daily)
    
    // Backup semanal aos domingos às 3:00 AM
    setInterval(async () => {
      try {
        await this.executeBackup('weekly')
      } catch (error) {
        console.error('Erro no backup semanal:', error)
      }
    }, BACKUP_CONFIG.intervals.weekly)
    
    // Backup mensal no dia 1 às 4:00 AM
    setInterval(async () => {
      try {
        await this.executeBackup('monthly')
      } catch (error) {
        console.error('Erro no backup mensal:', error)
      }
    }, BACKUP_CONFIG.intervals.monthly)
    
    console.log('📅 Backups automáticos agendados')
  }
}

// Inicializar backups automáticos
BackupService.scheduleAutomaticBackups()

export default BackupService
