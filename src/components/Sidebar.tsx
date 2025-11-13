import { NavLink, useNavigate } from 'react-router-dom'
import {
  FiCalendar,
  FiClock,
  FiCornerDownRight,
  FiLogOut,
  FiMoon,
  FiSettings,
  FiSun,
  FiTrendingUp,
} from 'react-icons/fi'
import { FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from 'react-icons/fa6'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { label: 'H\\Aulas', to: '/aulas', icon: FiCalendar },
  { label: 'Notas', to: '/notas', icon: FiTrendingUp },
  { label: 'H\\Transporte', to: '/transporte', icon: FiClock },
  { label: 'Configurações', to: '/configuracoes', icon: FiSettings },
]

const socialItems = [
  { icon: FaXTwitter, label: 'Twitter', href: 'https://twitter.com/' },
  { icon: FaInstagram, label: 'Instagram', href: 'https://instagram.com/' },
  { icon: FaYoutube, label: 'YouTube', href: 'https://youtube.com/' },
  { icon: FaLinkedin, label: 'LinkedIn', href: 'https://linkedin.com/' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-[#e2dce9] bg-white/95 px-5 py-6 transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col gap-6">
          <div className="rounded-2xl border border-[#e9e3f3] bg-[#faf7ff] px-4 py-3 text-center text-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Sistema</p>
            <p className="font-semibold text-slate-700">Gerenciador Acadêmico</p>
          </div>

          <nav className="space-y-3" aria-label="Menu principal">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-[26px] px-4 py-3 text-sm font-semibold shadow-sm shadow-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'bg-[#f4eefc] text-slate-600 hover:text-slate-900'
                    }`
                  }
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  <FiCornerDownRight className="h-4 w-4" />
                </NavLink>
              )
            })}
          </nav>

          <div className="rounded-[26px] border border-[#e3d6ef] px-4 py-4 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Modo</p>
                <p className="font-semibold text-slate-700">{theme === 'light' ? 'Claro' : 'Escuro'}</p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Alternar tema"
                className="inline-flex items-center gap-2 rounded-full border border-[#ded3ec] bg-white px-3 py-1 text-xs font-semibold"
              >
                {theme === 'light' ? <FiSun /> : <FiMoon />}
                <span>{theme === 'light' ? 'on' : 'off'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-3 rounded-[26px] border border-[#e3d6ef] px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Redes</p>
            <div className="flex flex-wrap gap-2">
              {socialItems.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e0d7ef] text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-3 text-sm text-slate-500">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-between rounded-[26px] border border-[#e4d7ef] bg-white px-4 py-3 font-semibold text-slate-600 hover:text-slate-900"
            >
              <span>Sair</span>
              <FiLogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
    </>
  )
}
