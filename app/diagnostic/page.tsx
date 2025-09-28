import { AuthDiagnostic } from '@/components/ui/AuthDiagnostic'

export default function DiagnosticPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <AuthDiagnostic />
      </div>
    </div>
  )
}
