import { createContext, useContext, useMemo, useState } from 'react'
import type { ToastVariant } from '../types'

export type ToastMessage = {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toasts: ToastMessage[]
  showToast: (message: string, variant?: ToastVariant) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 9)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const dismissToast = (id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  const showToast = (message: string, variant: ToastVariant = 'info') => {
    const id = createId()
    setToasts((current) => [...current, { id, message, variant }])
    setTimeout(() => dismissToast(id), 4000)
  }

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      dismissToast,
    }),
    [toasts],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro do ToastProvider')
  return ctx
}
