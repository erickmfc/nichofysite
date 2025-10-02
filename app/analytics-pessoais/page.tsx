import { PersonalAnalytics } from '@/components/ui/PersonalAnalytics'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <PersonalAnalytics />
    </ProtectedRoute>
  )
}
