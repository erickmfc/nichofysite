import { UserProfileExpanded } from '@/components/ui/UserProfileExpanded'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <UserProfileExpanded />
    </ProtectedRoute>
  )
}
