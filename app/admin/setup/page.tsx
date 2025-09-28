// Página de administração para inicializar o banco de dados
'use client'

import { DatabaseInitializer } from '@/components/admin/DatabaseInitializer'

export default function AdminSetupPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <DatabaseInitializer />
      </div>
    </main>
  )
}
