import { BrandIdentityManager } from '@/components/ui/BrandIdentityManager'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function BrandIdentityPage() {
  return (
    <ProtectedRoute>
      <BrandIdentityManager />
    </ProtectedRoute>
  )
}
