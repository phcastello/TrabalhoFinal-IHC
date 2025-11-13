import dayjs from 'dayjs'
import type { AulaDoDia } from '../types'

const hoje = dayjs()

const gerarId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).substring(2, 10)
}

const gerarAula = (
  offset: number,
  nome: string,
  inicio: string,
  fim: string,
  sala: string,
): AulaDoDia => ({
  id: gerarId(),
  dataISO: hoje.add(offset, 'day').format('YYYY-MM-DD'),
  nome,
  inicio,
  fim,
  sala,
  professor: 'Prof. Maria Clara',
})

export const mockAulas: AulaDoDia[] = [
  gerarAula(0, 'Banco de Dados 2', '08:20', '10:00', 'Lab 3'),
  gerarAula(0, 'Interação Humano-Computador', '10:20', '12:00', 'Sala 204'),
  gerarAula(1, 'Paradigmas de Programação', '09:00', '10:40', 'Sala 305'),
  gerarAula(3, 'Cálculo 1', '07:30', '09:10', 'Auditório 1'),
  gerarAula(4, 'Álgebra Linear', '11:00', '12:40', 'Sala 102'),
]
