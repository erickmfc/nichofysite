'use client'

import { useUserPlan } from '@/hooks/useUserPlan'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export const PlanInfo = () => {
  const { userPlan, getPlanName, getPlanLimits, canAccessFeature } = useUserPlan()
  const router = useRouter()

  if (!userPlan) return null

  const limits = getPlanLimits()
  const planName = getPlanName()

  const getPlanColor = () => {
    switch (userPlan.plan) {
      case 'free':
        return 'from-blue-500 to-blue-600'
      case 'basic':
        return 'from-green-500 to-emerald-600'
      case 'pro':
        return 'from-orange-500 to-orange-600'
      case 'enterprise':
        return 'from-purple-500 to-pink-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getPlanIcon = () => {
    switch (userPlan.plan) {
      case 'free':
        return '🎯'
      case 'basic':
        return '🚀'
      case 'pro':
        return '⭐'
      case 'enterprise':
        return '🏢'
      default:
        return '📋'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getPlanColor()} flex items-center justify-center text-2xl text-white`}>
            {getPlanIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{planName}</h3>
            <p className="text-sm text-gray-600">Plano Atual</p>
          </div>
        </div>
        
        <Button
          onClick={() => router.push('/planos')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
        >
          Alterar Plano
        </Button>
      </div>

      {limits && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Textos por mês:</span>
              <span className="font-semibold text-gray-900">
                {limits.postsPerMonth === -1 ? 'Ilimitados' : limits.postsPerMonth}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Templates:</span>
              <span className="font-semibold text-gray-900">
                {limits.templates === -1 ? 'Ilimitados' : limits.templates}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Analytics:</span>
              <span className={`font-semibold ${limits.analytics ? 'text-green-600' : 'text-gray-500'}`}>
                {limits.analytics ? 'Completo' : 'Básico'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Suporte:</span>
              <span className="font-semibold text-gray-900 capitalize">
                {limits.support}
              </span>
            </div>
          </div>

          {/* Features disponíveis */}
          <div className="pt-3 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Recursos Disponíveis:</h4>
            <div className="flex flex-wrap gap-2">
              {canAccessFeature('analytics') && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  📊 Analytics Avançados
                </span>
              )}
              {canAccessFeature('customBranding') && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  🎨 Branding Personalizado
                </span>
              )}
              {canAccessFeature('prioritySupport') && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  💬 Suporte Prioritário
                </span>
              )}
              {canAccessFeature('dedicatedSupport') && (
                <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                  🎯 Suporte Dedicado
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
