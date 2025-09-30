interface AdminUser {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'moderator'
  permissions: string[]
  lastLogin?: Date
  createdAt: Date
}

class AdminAuthService {
  private static readonly ADMIN_CREDENTIALS = {
    'admin@nichofy.com': {
      password: 'admin123',
      user: {
        id: 'admin-001',
        email: 'admin@nichofy.com',
        name: 'Administrador Principal',
        role: 'super_admin' as const,
        permissions: ['*'],
        createdAt: new Date()
      }
    },
    'moderator@nichofy.com': {
      password: 'mod123',
      user: {
        id: 'mod-001',
        email: 'moderator@nichofy.com',
        name: 'Moderador',
        role: 'moderator' as const,
        permissions: ['content.approve', 'content.reject', 'users.view'],
        createdAt: new Date()
      }
    }
  }

  static async login(email: string, password: string): Promise<boolean> {
    try {
      const credentials = this.ADMIN_CREDENTIALS[email as keyof typeof this.ADMIN_CREDENTIALS]
      
      if (!credentials || credentials.password !== password) {
        return false
      }

      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Salvar dados do admin no localStorage
      const adminData = {
        ...credentials.user,
        lastLogin: new Date()
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('nichofy_admin', JSON.stringify(adminData))
      }

      return true
    } catch (error) {
      console.error('Erro no login admin:', error)
      return false
    }
  }

  static async getCurrentAdmin(): Promise<AdminUser | null> {
    try {
      if (typeof window === 'undefined') return null

      const adminData = localStorage.getItem('nichofy_admin')
      if (!adminData) return null

      const admin = JSON.parse(adminData)
      return {
        ...admin,
        lastLogin: admin.lastLogin ? new Date(admin.lastLogin) : undefined,
        createdAt: new Date(admin.createdAt)
      }
    } catch (error) {
      console.error('Erro ao obter admin atual:', error)
      return null
    }
  }

  static async logout(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nichofy_admin')
      }
    } catch (error) {
      console.error('Erro no logout admin:', error)
    }
  }

  static async hasPermission(permission: string): Promise<boolean> {
    try {
      const admin = await this.getCurrentAdmin()
      if (!admin) return false

      // Super admin tem todas as permissões
      if (admin.permissions.includes('*')) return true

      return admin.permissions.includes(permission)
    } catch (error) {
      console.error('Erro ao verificar permissão:', error)
      return false
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const admin = await this.getCurrentAdmin()
      return admin !== null
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      return false
    }
  }

  static async updateAdminProfile(updates: Partial<AdminUser>): Promise<boolean> {
    try {
      const currentAdmin = await this.getCurrentAdmin()
      if (!currentAdmin) return false

      const updatedAdmin = { ...currentAdmin, ...updates }

      if (typeof window !== 'undefined') {
        localStorage.setItem('nichofy_admin', JSON.stringify(updatedAdmin))
      }

      return true
    } catch (error) {
      console.error('Erro ao atualizar perfil admin:', error)
      return false
    }
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const admin = await this.getCurrentAdmin()
      if (!admin) return false

      // Verificar senha atual
      const credentials = this.ADMIN_CREDENTIALS[admin.email as keyof typeof this.ADMIN_CREDENTIALS]
      if (!credentials || credentials.password !== currentPassword) {
        return false
      }

      // Em um sistema real, aqui seria feita a atualização no banco de dados
      // Por enquanto, apenas simulamos o sucesso
      await new Promise(resolve => setTimeout(resolve, 1000))

      return true
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      return false
    }
  }

  static async getAdminStats(): Promise<{
    totalAdmins: number
    activeAdmins: number
    lastLogin: Date | null
  }> {
    try {
      // Simular dados de estatísticas
      return {
        totalAdmins: Object.keys(this.ADMIN_CREDENTIALS).length,
        activeAdmins: 1, // Admin atual
        lastLogin: new Date()
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas admin:', error)
      return {
        totalAdmins: 0,
        activeAdmins: 0,
        lastLogin: null
      }
    }
  }
}

export { AdminAuthService }
export type { AdminUser }
