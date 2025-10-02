'use client'

import React from 'react'

// Componente de estado vazio genérico
export const EmptyState: React.FC<{
  icon?: string
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}> = ({ icon = '📭', title, message, action, className = '' }) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// Componente de estado vazio para posts
export const EmptyPostsState: React.FC<{
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}> = ({ action, className = '' }) => {
  return (
    <EmptyState
      icon="📝"
      title="Nenhum post encontrado"
      message="Você ainda não criou nenhum post. Comece criando seu primeiro conteúdo!"
      action={action}
      className={className}
    />
  )
}

// Componente de estado vazio para usuários
export const EmptyUsersState: React.FC<{
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}> = ({ action, className = '' }) => {
  return (
    <EmptyState
      icon="👥"
      title="Nenhum usuário encontrado"
      message="Não há usuários cadastrados no sistema ainda."
      action={action}
      className={className}
    />
  )
}

// Componente de estado vazio para projetos
export const EmptyProjectsState: React.FC<{
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}> = ({ action, className = '' }) => {
  return (
    <EmptyState
      icon="🚀"
      title="Nenhum projeto encontrado"
      message="Você ainda não criou nenhum projeto. Comece criando seu primeiro projeto!"
      action={action}
      className={className}
    />
  )
}

// Componente de estado vazio para relatórios
export const EmptyReportsState: React.FC<{
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}> = ({ action, className = '' }) => {
  return (
    <EmptyState
      icon="📊"
      title="Nenhum relatório disponível"
      message="Não há relatórios gerados ainda. Gere seu primeiro relatório para começar!"
      action={action}
      className={className}
    />
  )
}

// Componente de estado vazio para notificações
export const EmptyNotificationsState: React.FC<{
  className?: string
}> = ({ className = '' }) => {
  return (
    <EmptyState
      icon="🔔"
      title="Nenhuma notificação"
      message="Você está em dia! Não há notificações pendentes."
      className={className}
    />
  )
}

// Componente de estado vazio para busca
export const EmptySearchState: React.FC<{
  query?: string
  className?: string
}> = ({ query, className = '' }) => {
  return (
    <EmptyState
      icon="🔍"
      title="Nenhum resultado encontrado"
      message={query ? `Não encontramos resultados para "${query}". Tente uma busca diferente.` : 'Digite algo para buscar.'}
      className={className}
    />
  )
}

// Componente de estado vazio para favoritos
export const EmptyFavoritesState: React.FC<{
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}> = ({ action, className = '' }) => {
  return (
    <EmptyState
      icon="❤️"
      title="Nenhum favorito ainda"
      message="Você ainda não favoritou nenhum conteúdo. Explore e marque seus favoritos!"
      action={action}
      className={className}
    />
  )
}

// Componente de estado vazio para histórico
export const EmptyHistoryState: React.FC<{
  className?: string
}> = ({ className = '' }) => {
  return (
    <EmptyState
      icon="📚"
      title="Nenhum histórico disponível"
      message="Seu histórico de atividades aparecerá aqui conforme você usar o sistema."
      className={className}
    />
  )
}

// Componente de estado vazio para configurações
export const EmptySettingsState: React.FC<{
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}> = ({ action, className = '' }) => {
  return (
    <EmptyState
      icon="⚙️"
      title="Configurações não disponíveis"
      message="As configurações do sistema não estão disponíveis no momento."
      action={action}
      className={className}
    />
  )
}

// Componente de estado vazio para erros
export const EmptyErrorState: React.FC<{
  title?: string
  message?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}> = ({ 
  title = 'Algo deu errado', 
  message = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
  action,
  className = '' 
}) => {
  return (
    <EmptyState
      icon="⚠️"
      title={title}
      message={message}
      action={action}
      className={className}
    />
  )
}

// Componente de estado vazio para conexão
export const EmptyConnectionState: React.FC<{
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}> = ({ action, className = '' }) => {
  return (
    <EmptyState
      icon="🌐"
      title="Sem conexão"
      message="Verifique sua conexão com a internet e tente novamente."
      action={action}
      className={className}
    />
  )
}