import type { Materia, SituacaoMateria } from '../types'

export const calcularMediaMateria = (materia: Materia) => {
  const avaliacoesComNota = materia.avaliacoes.filter(
    (a) => typeof a.nota === 'number' && !Number.isNaN(a.nota),
  )

  if (avaliacoesComNota.length === 0) {
    return { media: null, situacao: 'Em andamento' as SituacaoMateria }
  }

  const somaPesos = avaliacoesComNota.reduce((acc, curr) => acc + curr.peso, 0)
  const total = avaliacoesComNota.reduce((acc, curr) => acc + (curr.nota ?? 0) * curr.peso, 0)
  const media = somaPesos ? total / somaPesos : 0

  const todasPreenchidas = materia.avaliacoes.every((a) => typeof a.nota === 'number')

  let situacao: SituacaoMateria = 'Em andamento'
  if (todasPreenchidas) {
    situacao = media >= 7 ? 'Aprovado' : 'Reprovado'
  }

  return { media: Number(media.toFixed(2)), situacao }
}

export const construirBoletimTexto = (materias: Materia[]) => {
  const linhas: string[] = ['Boletim Acadêmico', '-------------------']

  materias.forEach((materia) => {
    const { media, situacao } = calcularMediaMateria(materia)
    linhas.push(`Matéria: ${materia.nome}`)
    materia.avaliacoes.forEach((avaliacao) => {
      linhas.push(
        `  ${avaliacao.id} - ${avaliacao.descricao}: nota ${avaliacao.nota ?? '-'} (peso ${avaliacao.peso})`,
      )
    })
    linhas.push(`  Média final: ${media ?? '-'} | Situação: ${situacao}`)
    linhas.push('')
  })

  return linhas.join('\n')
}
