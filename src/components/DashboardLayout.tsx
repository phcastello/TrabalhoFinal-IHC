import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { FiMenu } from 'react-icons/fi'
import { Sidebar } from './Sidebar'

const titles: Record<string, string> = {
  '/aulas': 'Informações de aulas do dia',
  '/notas': 'Matérias da ementa',
  '/transporte': 'Informações de horários',
  '/configuracoes': 'Configurações',
}

export const DashboardLayout = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const title = titles[location.pathname] ?? 'Portal acadêmico'

  return (
    <div className="flex min-h-screen bg-[#f8f2ff] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar isOpen={open} onClose={() => setOpen(false)} />
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-[#e6dff2] bg-white/80 px-4 py-4 shadow-sm md:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#d9cfe6] px-4 py-2 text-sm font-semibold text-slate-600"
          >
            <FiMenu /> Menu
          </button>
          <span className="text-sm font-semibold text-slate-500">{title}</span>
        </div>

        <main className="flex-1 px-4 py-8 md:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
