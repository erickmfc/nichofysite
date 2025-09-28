'use client'

import { LoginForm } from '@/components/auth/LoginForm'
import { ResponsiveTemplate } from '@/components/ui/ResponsiveTemplate'

export default function AdminLoginPage() {
  return (
    <ResponsiveTemplate
      colorScheme="warning"
      title="Login Administrativo"
      subtitle="Acesso restrito para administradores do sistema"
      features={["🔐 Acesso seguro", "⚙️ Painel completo", "📊 Controle total"]}
    >
      <div className="max-w-md mx-auto">
        <LoginForm />
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Credenciais de teste:</p>
          <p className="font-mono text-xs mt-1">admin@nichofy.com / admin123</p>
        </div>
      </div>
    </ResponsiveTemplate>
  )
}