import { useMemo, useState } from 'react'
import { FiDownload, FiTarget } from 'react-icons/fi'
import { Accordion } from '../components/Accordion'
import { useToast } from '../context/ToastContext'
import type { AvaliacaoId, Materia } from '../types'
import { construirBoletimTexto, calcularMediaMateria } from '../utils/notes'
import { downloadTxt } from '../utils/export'
import { storage } from '../utils/storage'

export const NotasPage = () => {
  const { showToast } = useToast()
  const [materias, setMaterias] = useState<Materia[]>(storage.getMaterias())
  const [materiaSelecionadaId, setMateriaSelecionadaId] = useState(materias[0]?.id ?? '')
  const [resultado, setResultado] = useState<{ media: number | null; situacao: string } | null>(
    null,
  )

  const materiaSelecionada = useMemo(
    () => materias.find((materia) => materia.id === materiaSelecionadaId) ?? materias[0],
    [materias, materiaSelecionadaId],
  )

  const atualizarMateria = (materiaAtualizada: Materia) => {
    const novasMaterias = materias.map((materia) =>
      materia.id === materiaAtualizada.id ? materiaAtualizada : materia,
    )
    setMaterias(novasMaterias)
    storage.saveMaterias(novasMaterias)
  }

  const atualizarAvaliacao = (avaliacaoId: AvaliacaoId, campo: 'nota' | 'peso', valor: string) => {
    if (!materiaSelecionada) return
    const novaMateria: Materia = {
      ...materiaSelecionada,
      avaliacoes: materiaSelecionada.avaliacoes.map((avaliacao) => {
        if (avaliacao.id !== avaliacaoId) return avaliacao
        return {
          ...avaliacao,
          [campo]: campo === 'peso' ? Number(valor) || 0 : valor === '' ? undefined : Number(valor),
        }
      }),
    }
    atualizarMateria(novaMateria)
  }

  const calcularNotas = () => {
    if (!materiaSelecionada) return
    const resultadoMateria = calcularMediaMateria(materiaSelecionada)
    setResultado(resultadoMateria)
    showToast('Cálculo realizado!', 'success')
  }

  const downloadBoletim = () => {
    const texto = construirBoletimTexto(materias)
    downloadTxt('boletim-academico.txt', texto)
    showToast('Boletim baixado', 'info')
  }

  if (!materiaSelecionada) {
    return <p className="text-slate-500">Nenhuma matéria cadastrada.</p>
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-[34px] border border-[#e2dce9] bg-white p-6 shadow-inner">
        <h2 className="text-lg font-semibold text-slate-800">Matérias da ementa</h2>
        <p className="text-sm text-slate-500">Escolha a matéria que deseja ver a nota</p>

        <div className="mt-5 space-y-3">
          {materias.map((materia) => {
            const ativo = materia.id === materiaSelecionada?.id
            return (
              <button
                key={materia.id}
                type="button"
                className={`w-full rounded-[999px] px-4 py-3 text-sm font-semibold transition ${
                  ativo
                    ? 'border border-[#f1b6c0] bg-white text-[#ff4b4b] shadow'
                    : 'bg-[#f1eef7] text-slate-600'
                }`}
                onClick={() => setMateriaSelecionadaId(materia.id)}
              >
                {materia.nome}
              </button>
            )
          })}
        </div>
      </aside>

      <section className="space-y-5 rounded-[34px] border border-[#e2dce9] bg-white p-8 shadow-sm">
        <header>
          <p className="text-sm text-slate-500">Trabalhos avaliados na matéria até o momento:</p>
        </header>

        <div className="space-y-4">
          {materiaSelecionada.avaliacoes.map((avaliacao) => (
            <Accordion
              key={avaliacao.id}
              title={`${avaliacao.id}`}
              defaultOpen={avaliacao.id === 'P1'}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-xs font-semibold text-slate-500">
                  Nota obtida
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step="0.1"
                    value={avaliacao.nota ?? ''}
                    onChange={(event) => atualizarAvaliacao(avaliacao.id, 'nota', event.target.value)}
                  />
                </label>
                <label className="space-y-1 text-xs font-semibold text-slate-500">
                  Peso
                  <input
                    type="number"
                    min={1}
                    step="1"
                    value={avaliacao.peso}
                    onChange={(event) => atualizarAvaliacao(avaliacao.id, 'peso', event.target.value)}
                  />
                </label>
              </div>
            </Accordion>
          ))}
        </div>

        {resultado && (
          <div className="rounded-[24px] border border-[#e4f2e8] bg-[#f1fbf3] px-5 py-4 text-sm text-emerald-700">
            <div className="flex items-center gap-2 text-lg font-semibold text-emerald-700">
              <FiTarget /> Média: {resultado.media ?? '--'}
            </div>
            <p>Situação: {resultado.situacao}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={calcularNotas}
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
          >
            Calcular Notas
          </button>
          <button
            type="button"
            onClick={downloadBoletim}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
          >
            <FiDownload /> Download do Boletim
          </button>
        </div>
      </section>
    </div>
  )
}
