import type { DiaSemana, HorarioTransporte, Turno } from '../types'

export const diasSemana: DiaSemana[] = [
  'segunda',
  'terca',
  'quarta',
  'quinta',
  'sexta',
  'sabado',
  'domingo',
]

const criarLinha = (hora: string, origem: string, destino: string) =>
  `${hora} - Linha ${origem} → ${destino}`

const turnos: Turno[] = ['manha', 'tarde', 'noite']

export const mockHorarios: HorarioTransporte[] = diasSemana.flatMap((dia) =>
  turnos.map((turno, index) => ({
    dia,
    turno,
    linhas: [
      criarLinha(`${6 + index}:30`, 'Centro', 'Campus'),
      criarLinha(`${7 + index}:15`, 'Bairro A', 'Campus'),
      criarLinha(`${8 + index}:05`, 'Terminal', 'Centro'),
    ],
  })),
)

export const mockDiasFavoritos: DiaSemana[] = ['segunda', 'quarta']
