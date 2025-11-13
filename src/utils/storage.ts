import { mockAulas } from '../data/mockAulas'
import { mockMaterias } from '../data/mockMaterias'
import { diasSemana, mockDiasFavoritos, mockHorarios } from '../data/mockTransporte'
import type {
  AulaDoDia,
  HorarioTransporte,
  Materia,
  Usuario,
  DiaSemana,
} from '../types'

const STORAGE_KEYS = {
  users: 'ihc_users',
  currentUser: 'ihc_current_user',
  materias: 'ihc_materias',
  transporte: 'ihc_transporte',
  favoritos: 'ihc_transporte_favoritos',
  aulas: 'ihc_aulas',
}

const hasWindow = typeof window !== 'undefined'

const getStore = () => (hasWindow ? window.localStorage : null)

const parse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch (error) {
    console.error('Erro ao ler localStorage', error)
    return fallback
  }
}

const getItem = <T>(key: string, fallback: T): T => {
  const store = getStore()
  if (!store) return fallback
  return parse(store.getItem(key), fallback)
}

const setItem = <T>(key: string, value: T) => {
  const store = getStore()
  if (!store) return
  store.setItem(key, JSON.stringify(value))
}

export const storage = {
  getUsers: () => getItem<Usuario[]>(STORAGE_KEYS.users, []),
  saveUsers: (users: Usuario[]) => setItem(STORAGE_KEYS.users, users),
  getCurrentUser: () => getItem<Usuario | null>(STORAGE_KEYS.currentUser, null),
  setCurrentUser: (user: Usuario | null) => {
    const store = getStore()
    if (!store) return
    if (!user) {
      store.removeItem(STORAGE_KEYS.currentUser)
      return
    }
    store.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user))
  },
  clearCurrentUser: () => storage.setCurrentUser(null),
  getMaterias: () => getItem<Materia[]>(STORAGE_KEYS.materias, mockMaterias),
  saveMaterias: (materias: Materia[]) => setItem(STORAGE_KEYS.materias, materias),
  getHorarios: () => getItem<HorarioTransporte[]>(STORAGE_KEYS.transporte, mockHorarios),
  saveHorarios: (horarios: HorarioTransporte[]) => setItem(STORAGE_KEYS.transporte, horarios),
  getFavoritos: () => getItem<DiaSemana[]>(STORAGE_KEYS.favoritos, mockDiasFavoritos),
  saveFavoritos: (favoritos: DiaSemana[]) => setItem(STORAGE_KEYS.favoritos, favoritos),
  getAulas: () => getItem<AulaDoDia[]>(STORAGE_KEYS.aulas, mockAulas),
  saveAulas: (aulas: AulaDoDia[]) => setItem(STORAGE_KEYS.aulas, aulas),
}

export const bootstrapStorage = () => {
  const store = getStore()
  if (!store) return

  if (!store.getItem(STORAGE_KEYS.users)) {
    storage.saveUsers([])
  }
  if (!store.getItem(STORAGE_KEYS.materias)) {
    storage.saveMaterias(mockMaterias)
  }
  if (!store.getItem(STORAGE_KEYS.transporte)) {
    storage.saveHorarios(mockHorarios)
  }
  if (!store.getItem(STORAGE_KEYS.favoritos)) {
    storage.saveFavoritos(mockDiasFavoritos)
  }
  if (!store.getItem(STORAGE_KEYS.aulas)) {
    storage.saveAulas(mockAulas)
  }
}

export const diasSemanaOrdenados = diasSemana
