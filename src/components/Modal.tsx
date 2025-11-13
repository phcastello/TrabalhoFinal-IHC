interface ModalProps {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  footer?: React.ReactNode
}

export const Modal = ({ open, title, children, onClose, footer }: ModalProps) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand">Informação</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
          </div>
          <button
            type="button"
            aria-label="Fechar modal"
            className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-200">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}
