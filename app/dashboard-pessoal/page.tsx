import { AdvancedPersonalDashboard } from '@/components/ui/AdvancedPersonalDashboard'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function PersonalDashboardPage() {
  return (
    <ProtectedRoute>
      <AdvancedPersonalDashboard />
    </ProtectedRoute>
  )
}
