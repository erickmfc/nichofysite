'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'

// Empty state principal
interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'outline'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const EmptyState = ({
  icon = '📭',
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
  className = ''
}: EmptyStateProps) => {
  const { theme } = useTheme()
  
  const sizeClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16'
  }
  
  const iconSizes = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl'
  }
  
  const getButtonClasses = (variant: string = 'primary') => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105'
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl`
      case 'secondary':
        return `${baseClasses} ${
          theme === 'dark' 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`
      case 'outline':
        return `${baseClasses} border-2 ${
          theme === 'dark' 
            ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:bg-gray-700' 
            : 'border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50'
        }`
      default:
        return baseClasses
    }
  }
  
  return (
    <div className={`flex flex-col items-center justify-center text-center ${sizeClasses[size]} ${className}`}>
      {/* Icon */}
      <div className={`mb-6 ${iconSizes[size]} animate-bounce`}>
        {icon}
      </div>
      
      {/* Content */}
      <div className="max-w-md mx-auto">
        <h3 className={`text-xl font-semibold mb-3 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h3>
        <p className={`text-sm mb-6 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {description}
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {action && (
            <button
              onClick={action.onClick}
              className={getButtonClasses(action.variant)}
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={getButtonClasses('outline')}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Empty state específico para metas
export const EmptyGoalsState = ({ onCreateGoal, onViewTemplates }: {
  onCreateGoal: () => void
  onViewTemplates: () => void
}) => {
  return (
    <EmptyState
      icon="🎯"
      title="Nenhuma meta ativa"
      description="Crie sua primeira meta para começar a acompanhar seu progresso e alcançar seus objetivos de forma organizada."
      action={{
        label: "Criar Primeira Meta",
        onClick: onCreateGoal,
        variant: 'primary'
      }}
      secondaryAction={{
        label: "Ver Templates",
        onClick: onViewTemplates
      }}
    />
  )
}

// Empty state para estatísticas
export const EmptyStatsState = ({ onCreatePost, onViewAnalytics }: {
  onCreatePost: () => void
  onViewAnalytics: () => void
}) => {
  return (
    <EmptyState
      icon="📊"
      title="Ainda não há dados"
      description="Crie seu primeiro post para começar a gerar estatísticas e acompanhar seu crescimento na plataforma."
      action={{
        label: "Criar Primeiro Post",
        onClick: onCreatePost,
        variant: 'primary'
      }}
      secondaryAction={{
        label: "Ver Analytics",
        onClick: onViewAnalytics
      }}
    />
  )
}

// Empty state para alertas
export const EmptyAlertsState = () => {
  const { theme } = useTheme()
  
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${
      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
    }`}>
      <div className="text-6xl mb-4 animate-pulse">🔔</div>
      <h3 className={`text-lg font-medium mb-2 ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        Nenhuma notificação
      </h3>
      <p className="text-sm">
        Você está em dia! Quando houver alertas importantes, eles aparecerão aqui.
      </p>
    </div>
  )
}

// Empty state para gráficos
export const EmptyChartState = ({ message = "Dados insuficientes para gerar gráfico" }: {
  message?: string
}) => {
  const { theme } = useTheme()
  
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${
      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
    }`}>
      <div className="text-6xl mb-4 opacity-50">📈</div>
      <p className="text-sm">{message}</p>
    </div>
  )
}

// Empty state para posts
export const EmptyPostsState = ({ onCreatePost, onImportContent }: {
  onCreatePost: () => void
  onImportContent: () => void
}) => {
  return (
    <EmptyState
      icon="📝"
      title="Nenhum post criado"
      description="Comece sua jornada de criação de conteúdo! Crie posts envolventes ou importe conteúdo existente para começar."
      action={{
        label: "Criar Primeiro Post",
        onClick: onCreatePost,
        variant: 'primary'
      }}
      secondaryAction={{
        label: "Importar Conteúdo",
        onClick: onImportContent
      }}
    />
  )
}

// Empty state para categorias
export const EmptyCategoriesState = ({ onExploreCategories, onCreateCustom }: {
  onExploreCategories: () => void
  onCreateCustom: () => void
}) => {
  return (
    <EmptyState
      icon="🏷️"
      title="Nenhuma categoria usada"
      description="Explore diferentes nichos e categorias para diversificar seu conteúdo e alcançar mais audiências."
      action={{
        label: "Explorar Categorias",
        onClick: onExploreCategories,
        variant: 'primary'
      }}
      secondaryAction={{
        label: "Criar Personalizada",
        onClick: onCreateCustom
      }}
    />
  )
}

// Empty state com ilustração animada
interface AnimatedEmptyStateProps extends Omit<EmptyStateProps, 'icon'> {
  animation?: 'bounce' | 'pulse' | 'spin' | 'wiggle'
}

export const AnimatedEmptyState = ({
  animation = 'bounce',
  ...props
}: AnimatedEmptyStateProps) => {
  const { theme } = useTheme()
  
  const getAnimationClass = () => {
    switch (animation) {
      case 'bounce': return 'animate-bounce'
      case 'pulse': return 'animate-pulse'
      case 'spin': return 'animate-spin'
      case 'wiggle': return 'animate-wiggle'
      default: return 'animate-bounce'
    }
  }
  
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 ${props.className || ''}`}>
      {/* Animated illustration */}
      <div className={`mb-6 text-6xl ${getAnimationClass()}`}>
        {props.icon || '✨'}
      </div>
      
      {/* Content */}
      <div className="max-w-md mx-auto">
        <h3 className={`text-xl font-semibold mb-3 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {props.title}
        </h3>
        <p className={`text-sm mb-6 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {props.description}
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {props.action && (
            <button
              onClick={props.action.onClick}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
            >
              {props.action.label}
            </button>
          )}
          {props.secondaryAction && (
            <button
              onClick={props.secondaryAction.onClick}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 border-2 ${
                theme === 'dark' 
                  ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {props.secondaryAction.label}
            </button>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes wiggle {
          0%, 7% { transform: rotateZ(0); }
          15% { transform: rotateZ(-15deg); }
          20% { transform: rotateZ(10deg); }
          25% { transform: rotateZ(-10deg); }
          30% { transform: rotateZ(6deg); }
          35% { transform: rotateZ(-4deg); }
          40%, 100% { transform: rotateZ(0); }
        }
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// Empty state com progresso
interface EmptyStateWithProgressProps {
  icon?: string
  title: string
  description: string
  progress: number
  progressLabel: string
  action?: {
    label: string
    onClick: () => void
  }
}

export const EmptyStateWithProgress = ({
  icon = '🚀',
  title,
  description,
  progress,
  progressLabel,
  action
}: EmptyStateWithProgressProps) => {
  const { theme } = useTheme()
  
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 ${
      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
    }`}>
      {/* Icon */}
      <div className="text-6xl mb-6 animate-pulse">
        {icon}
      </div>
      
      {/* Content */}
      <div className="max-w-md mx-auto mb-6">
        <h3 className={`text-xl font-semibold mb-3 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h3>
        <p className={`text-sm mb-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {description}
        </p>
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              {progressLabel}
            </span>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              {progress}%
            </span>
          </div>
          <div className={`w-full rounded-full h-2 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Action */}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
