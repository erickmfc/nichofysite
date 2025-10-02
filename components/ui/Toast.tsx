'use client'

import React, { useState, useEffect, useCallback } from 'react'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, 'id'>) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastProps = {
      ...toast,
      id,
      duration: toast.duration || 5000
    }

    setToasts(prev => [...prev, newToast])

    // Auto remove após duração
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast deve ser usado dentro de ToastProvider')
  }
  return context
}

const ToastContainer: React.FC<{
  toasts: ToastProps[]
  onRemove: (id: string) => void
}> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

const Toast: React.FC<{
  toast: ToastProps
  onRemove: (id: string) => void
}> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Animação de entrada
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleRemove = useCallback(() => {
    setIsLeaving(true)
    setTimeout(() => onRemove(toast.id), 300)
  }, [toast.id, onRemove])

  const getToastStyles = () => {
    const baseStyles = "max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
    const animationStyles = isVisible && !isLeaving 
      ? "transform translate-x-0 opacity-100" 
      : "transform translate-x-full opacity-0"
    
    return `${baseStyles} ${animationStyles} transition-all duration-300 ease-in-out`
  }

  const getIconAndColor = () => {
    switch (toast.type) {
      case 'success':
        return { icon: '✅', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-800' }
      case 'error':
        return { icon: '❌', bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-800' }
      case 'warning':
        return { icon: '⚠️', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-800' }
      case 'info':
        return { icon: 'ℹ️', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-800' }
      default:
        return { icon: 'ℹ️', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', textColor: 'text-gray-800' }
    }
  }

  const { icon, bgColor, borderColor, textColor } = getIconAndColor()

  return (
    <div className={getToastStyles()}>
      <div className={`p-4 ${bgColor} ${borderColor} border-l-4`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-lg">{icon}</span>
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${textColor}`}>
              {toast.title}
            </p>
            <p className={`mt-1 text-sm ${textColor} opacity-90`}>
              {toast.message}
            </p>
            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={toast.action.onClick}
                  className={`text-sm font-medium ${textColor} hover:opacity-80 transition-opacity`}
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleRemove}
              className={`inline-flex ${textColor} hover:opacity-80 transition-opacity`}
            >
              <span className="sr-only">Fechar</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook para facilitar o uso
export const useToastNotifications = () => {
  const { addToast } = useToast()

  const showSuccess = useCallback((title: string, message: string, action?: ToastProps['action']) => {
    addToast({ type: 'success', title, message, action })
  }, [addToast])

  const showError = useCallback((title: string, message: string, action?: ToastProps['action']) => {
    addToast({ type: 'error', title, message, action })
  }, [addToast])

  const showWarning = useCallback((title: string, message: string, action?: ToastProps['action']) => {
    addToast({ type: 'warning', title, message, action })
  }, [addToast])

  const showInfo = useCallback((title: string, message: string, action?: ToastProps['action']) => {
    addToast({ type: 'info', title, message, action })
  }, [addToast])

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

// Componente de exemplo de uso
export const ToastExample: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToastNotifications()

  return (
    <div className="space-x-2">
      <button
        onClick={() => showSuccess('Sucesso!', 'Operação realizada com sucesso.')}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Sucesso
      </button>
      <button
        onClick={() => showError('Erro!', 'Algo deu errado.')}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Erro
      </button>
      <button
        onClick={() => showWarning('Atenção!', 'Verifique os dados.')}
        className="bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Aviso
      </button>
      <button
        onClick={() => showInfo('Informação', 'Nova atualização disponível.')}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Info
      </button>
    </div>
  )
}