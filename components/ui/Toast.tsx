'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast,
    }

    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
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

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          icon: '✅',
          iconBg: 'bg-green-100 dark:bg-green-800',
          titleColor: 'text-green-800 dark:text-green-200',
          messageColor: 'text-green-600 dark:text-green-300'
        }
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          icon: '❌',
          iconBg: 'bg-red-100 dark:bg-red-800',
          titleColor: 'text-red-800 dark:text-red-200',
          messageColor: 'text-red-600 dark:text-red-300'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: '⚠️',
          iconBg: 'bg-yellow-100 dark:bg-yellow-800',
          titleColor: 'text-yellow-800 dark:text-yellow-200',
          messageColor: 'text-yellow-600 dark:text-yellow-300'
        }
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'ℹ️',
          iconBg: 'bg-blue-100 dark:bg-blue-800',
          titleColor: 'text-blue-800 dark:text-blue-200',
          messageColor: 'text-blue-600 dark:text-blue-300'
        }
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-gray-200 dark:border-gray-800',
          icon: '📢',
          iconBg: 'bg-gray-100 dark:bg-gray-800',
          titleColor: 'text-gray-800 dark:text-gray-200',
          messageColor: 'text-gray-600 dark:text-gray-300'
        }
    }
  }

  const styles = getToastStyles()

  return (
    <div
      className={`
        ${styles.bg} ${styles.border} border rounded-xl shadow-lg p-4 
        transform transition-all duration-300 ease-in-out
        animate-in slide-in-from-right-full
        hover:shadow-xl
      `}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`
          ${styles.iconBg} rounded-full p-2 flex-shrink-0
          flex items-center justify-center
        `}>
          <span className="text-lg">{styles.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm ${styles.titleColor}`}>
            {toast.title}
          </h4>
          {toast.message && (
            <p className={`text-sm mt-1 ${styles.messageColor}`}>
              {toast.message}
            </p>
          )}
          
          {/* Action Button */}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className={`
                mt-2 text-xs font-medium px-3 py-1 rounded-lg
                ${styles.titleColor} ${styles.bg} border ${styles.border}
                hover:opacity-80 transition-opacity
              `}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => onRemove(toast.id)}
          className={`
            flex-shrink-0 p-1 rounded-full hover:bg-black/10 
            transition-colors ${styles.messageColor}
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Hook para facilitar o uso
export const useToastNotifications = () => {
  const { addToast } = useToast()

  const success = useCallback((title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'success', title, message, action })
  }, [addToast])

  const error = useCallback((title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'error', title, message, action })
  }, [addToast])

  const warning = useCallback((title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'warning', title, message, action })
  }, [addToast])

  const info = useCallback((title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'info', title, message, action })
  }, [addToast])

  return { success, error, warning, info }
}
