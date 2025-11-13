import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Usuario } from '../types'
import { bootstrapStorage, storage } from '../utils/storage'

interface AuthContextValue {
  user: Usuario | null
  isLoading: boolean
  login: (email: string, senha: string) => Promise<void>
  register: (email: string, senha: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const gerarId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).substring(2, 10)
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    bootstrapStorage()
    setUser(storage.getCurrentUser())
    setIsLoading(false)
  }, [])

  const login = async (email: string, senha: string) => {
    const users = storage.getUsers()
    const found = users.find((u) => u.email === email && u.senha === senha)
    if (!found) {
      throw new Error('Email ou senha inválidos')
    }
    storage.setCurrentUser(found)
    setUser(found)
  }

  const register = async (email: string, senha: string) => {
    const users = storage.getUsers()
    if (users.some((u) => u.email === email)) {
      throw new Error('Já existe uma conta com este email')
    }
    const novo: Usuario = {
      id: gerarId(),
      email,
      senha,
      createdAt: new Date().toISOString(),
    }
    const atualizados = [...users, novo]
    storage.saveUsers(atualizados)
    storage.setCurrentUser(novo)
    setUser(novo)
  }

  const logout = () => {
    storage.clearCurrentUser()
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
