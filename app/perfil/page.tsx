import { UserProfile } from '@/components/ui/UserProfile'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  )
}
