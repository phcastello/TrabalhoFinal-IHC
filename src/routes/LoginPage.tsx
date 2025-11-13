import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Modal } from '../components/Modal'

const emailRegex = /.+@.+\..+/

type FormState = {
  email: string
  senha: string
}

type FormErrors = Partial<FormState> & { geral?: string }

export const LoginPage = () => {
  const { login, register, user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({ email: '', senha: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/aulas', { replace: true })
    }
  }, [user, navigate])

  const validate = () => {
    const newErrors: FormErrors = {}
    if (!emailRegex.test(form.email)) {
      newErrors.email = 'Informe um email válido'
    }
    if (form.senha.length < 6) {
      newErrors.senha = 'Senha precisa ter pelo menos 6 caracteres'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined, geral: undefined }))
  }

  const submit = async (action: 'login' | 'register') => {
    if (!validate()) return
    setIsSubmitting(true)
    try {
      if (action === 'login') {
        await login(form.email, form.senha)
        showToast('Login realizado com sucesso!', 'success')
      } else {
        await register(form.email, form.senha)
        showToast('Conta criada! Você já pode acessar.', 'success')
      }
      navigate('/aulas')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro inesperado'
      setErrors((prev) => ({ ...prev, geral: message }))
      showToast(message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f2ff] px-4 py-12">
      <div className="w-full max-w-md rounded-[26px] border border-[#e2dce9] bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Sistema</p>
          <p className="text-lg font-semibold text-slate-700">Sistema Gerenciador Acadêmico</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-slate-500">Email</p>
          <input
            id="email"
            type="email"
            placeholder="Digite seu email"
            value={form.email}
            onChange={(event) => handleChange('email', event.target.value)}
            className={`w-full ${errors.email ? 'border-rose-400' : ''}`}
          />
          {errors.email && <p className="text-sm text-rose-500">{errors.email}</p>}
        </div>

        <div className="mt-6 space-y-2">
          <p className="text-sm text-slate-500">Senha</p>
          <input
            id="senha"
            type="password"
            placeholder="Digite sua senha"
            value={form.senha}
            onChange={(event) => handleChange('senha', event.target.value)}
            className={`w-full ${errors.senha ? 'border-rose-400' : ''}`}
          />
          {errors.senha && <p className="text-sm text-rose-500">{errors.senha}</p>}
        </div>

        {errors.geral && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {errors.geral}
          </div>
        )}

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            className="flex-1 rounded-full bg-[#e7e4eb] px-4 py-3 text-sm font-semibold text-slate-700 shadow-inner"
            disabled={isSubmitting}
            onClick={() => submit('login')}
          >
            {isSubmitting ? 'Validando...' : 'Login'}
          </button>
          <button
            type="button"
            className="flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow"
            disabled={isSubmitting}
            onClick={() => submit('register')}
          >
            {isSubmitting ? 'Carregando...' : 'Registrar'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setForgotOpen(true)}
          className="mt-6 text-left text-sm font-semibold text-slate-700 underline underline-offset-4"
        >
          Esqueceu senha?
        </button>
      </div>

      <Modal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        title="Recuperação de senha"
        footer={
          <button
            type="button"
            onClick={() => setForgotOpen(false)}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Entendido
          </button>
        }
      >
        Este protótipo não possui backend. Para redefinir sua senha, utilize a opção de registro
        criando uma nova conta ou entre em contato com o suporte do curso.
      </Modal>
    </div>
  )
}
