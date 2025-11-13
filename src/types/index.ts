export type Tema = 'light' | 'dark'

export type Usuario = {
  id: string
  email: string
  senha: string
  createdAt: string
}

export type DiaSemana =
  | 'segunda'
  | 'terca'
  | 'quarta'
  | 'quinta'
  | 'sexta'
  | 'sabado'
  | 'domingo'

export const diaSemanaLabels: Record<DiaSemana, string> = {
  segunda: 'Segunda-feira',
  terca: 'Terça-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quinta-feira',
  sexta: 'Sexta-feira',
  sabado: 'Sábado',
  domingo: 'Domingo',
}

export type Turno = 'manha' | 'tarde' | 'noite'

export type HorarioTransporte = {
  dia: DiaSemana
  turno: Turno
  linhas: string[]
}

export type AvaliacaoId = 'P1' | 'P2' | 'TAI' | 'TAII'

export type Avaliacao = {
  id: AvaliacaoId
  descricao: string
  peso: number
  nota?: number
}

export type Materia = {
  id: string
  nome: string
  avaliacoes: Avaliacao[]
}

export type SituacaoMateria = 'Aprovado' | 'Reprovado' | 'Em andamento'

export type AulaDoDia = {
  id: string
  dataISO: string
  nome: string
  inicio: string
  fim: string
  professor?: string
  sala?: string
}

export type ToastVariant = 'success' | 'error' | 'info'
