import type { Materia } from '../types'

const avaliacoesPadrao = (): Materia['avaliacoes'] => [
  { id: 'P1', descricao: 'Prova 1', peso: 2, nota: undefined },
  { id: 'P2', descricao: 'Prova 2', peso: 2, nota: undefined },
  { id: 'TAI', descricao: 'Trabalho Aplicado I', peso: 1, nota: undefined },
  { id: 'TAII', descricao: 'Trabalho Aplicado II', peso: 1, nota: undefined },
]

export const mockMaterias: Materia[] = [
  { id: 'calc1', nome: 'Cálculo 1', avaliacoes: avaliacoesPadrao() },
  { id: 'algebra', nome: 'Álgebra Linear', avaliacoes: avaliacoesPadrao() },
  { id: 'paradigmas', nome: 'Paradigmas de Programação', avaliacoes: avaliacoesPadrao() },
  { id: 'bd2', nome: 'Banco de Dados 2', avaliacoes: avaliacoesPadrao() },
  { id: 'ihc', nome: 'Interação Humano-Computador', avaliacoes: avaliacoesPadrao() },
  { id: 'engsoft', nome: 'Engenharia de Software', avaliacoes: avaliacoesPadrao() },
]
