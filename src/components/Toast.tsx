import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi'
import { useToast } from '../context/ToastContext'

const variantStyles = {
  success: 'bg-emerald-500/90 text-white shadow-lg',
  error: 'bg-rose-500/90 text-white shadow-lg',
  info: 'bg-slate-800/90 text-white shadow-lg',
}

const variantIcon = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
}

export const ToastViewport = () => {
  const { toasts, dismissToast } = useToast()

  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center space-y-3 px-4">
      {toasts.map((toast) => {
        const Icon = variantIcon[toast.variant]
        return (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl px-4 py-3 ${variantStyles[toast.variant]}`}
          >
            <Icon aria-hidden className="h-5 w-5" />
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            <button
              type="button"
              aria-label="Fechar notificação"
              className="rounded-full bg-white/20 px-2 py-1 text-xs font-semibold uppercase tracking-wide"
              onClick={() => dismissToast(toast.id)}
            >
              Fechar
            </button>
          </div>
        )
      })}
    </div>
  )
}
