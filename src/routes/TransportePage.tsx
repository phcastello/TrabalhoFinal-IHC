import { useEffect, useMemo, useState } from 'react'
import { FiDownload, FiStar } from 'react-icons/fi'
import { diasSemana, mockDiasFavoritos } from '../data/mockTransporte'
import { useToast } from '../context/ToastContext'
import type { HorarioTransporte, DiaSemana, Turno } from '../types'
import { diaSemanaLabels } from '../types'
import { downloadTxt } from '../utils/export'
import { storage } from '../utils/storage'

const turnos: { label: string; value: Turno }[] = [
  { label: 'Manhã', value: 'manha' },
  { label: 'Tarde', value: 'tarde' },
  { label: 'Noite', value: 'noite' },
]

export const TransportePage = () => {
  const { showToast } = useToast()
  const [horarios, setHorarios] = useState<HorarioTransporte[]>(storage.getHorarios())
  const [favoritos, setFavoritos] = useState<DiaSemana[]>(storage.getFavoritos() ?? mockDiasFavoritos)
  const [diaSelecionado, setDiaSelecionado] = useState<DiaSemana>('segunda')
  const [turnoSelecionado, setTurnoSelecionado] = useState<Turno>('manha')
  const [textareaValue, setTextareaValue] = useState('')

  const horarioAtual = useMemo(
    () =>
      horarios.find((item) => item.dia === diaSelecionado && item.turno === turnoSelecionado) ?? {
        dia: diaSelecionado,
        turno: turnoSelecionado,
        linhas: [],
      },
    [horarios, diaSelecionado, turnoSelecionado],
  )

  useEffect(() => {
    setTextareaValue(horarioAtual.linhas.join('\n'))
  }, [horarioAtual])

  const salvarHorarios = () => {
    const linhas = textareaValue
      .split('\n')
      .map((linha) => linha.trim())
      .filter(Boolean)

    const atualizados = horarios.map((item) => {
      if (item.dia === diaSelecionado && item.turno === turnoSelecionado) {
        return { ...item, linhas }
      }
      return item
    })

    // caso não exista combinação, adiciona
    if (!horarios.some((item) => item.dia === diaSelecionado && item.turno === turnoSelecionado)) {
      atualizados.push({ dia: diaSelecionado, turno: turnoSelecionado, linhas })
    }

    setHorarios(atualizados)
    storage.saveHorarios(atualizados)
    showToast('Horários atualizados com sucesso!', 'success')
  }

  const toggleFavorito = (dia: DiaSemana) => {
    const atualizados = favoritos.includes(dia)
      ? favoritos.filter((item) => item !== dia)
      : [...favoritos, dia]
    setFavoritos(atualizados)
    storage.saveFavoritos(atualizados)
  }

  const baixarHorarios = () => {
    const titulo = `${diaSemanaLabels[diaSelecionado]} - ${turnos.find((t) => t.value === turnoSelecionado)?.label}`
    const conteudo = [
      `Horários de transporte - ${titulo}`,
      '-------------------------------',
      ...horarioAtual.linhas,
    ].join('\n')
    downloadTxt(`horarios-${diaSelecionado}-${turnoSelecionado}.txt`, conteudo)
    showToast('Arquivo gerado com sucesso!', 'info')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <section className="rounded-[30px] border border-[#e2dce9] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Dias da semana</h2>
        <p className="text-sm text-slate-500">Selecione o dia para editar os horários</p>

        <div className="mt-4 space-y-2">
          {diasSemana.map((dia) => {
            const ativo = dia === diaSelecionado
            const favorito = favoritos.includes(dia)
            return (
              <div
                key={dia}
                role="button"
                tabIndex={0}
                onClick={() => setDiaSelecionado(dia)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setDiaSelecionado(dia)
                  }
                }}
                className={`flex w-full items-center justify-between rounded-[20px] border px-4 py-3 text-left text-sm font-semibold ${
                  ativo ? 'border-slate-900 bg-slate-900 text-white' : 'border-transparent bg-[#f4eefc] text-slate-600'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FiStar className={favorito ? 'text-yellow-400' : ''} />
                  {diaSemanaLabels[dia]}
                </span>
                <button
                  type="button"
                  className="rounded-full border border-white/40 px-2 py-0.5 text-xs"
                  onClick={(event) => {
                    event.stopPropagation()
                    toggleFavorito(dia)
                  }}
                  aria-label={`Marcar ${diaSemanaLabels[dia]} como favorito`}
                >
                  {favorito ? '★' : '☆'}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-5 rounded-[30px] border border-[#e2dce9] bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm text-slate-500">Informações de horários</p>
          <h2 className="text-2xl font-semibold text-slate-900">{diaSemanaLabels[diaSelecionado]}</h2>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex flex-1 flex-col">
            <label className="text-sm font-semibold text-slate-600" htmlFor="turno">
              Escolha o turno
            </label>
            <select
              id="turno"
              value={turnoSelecionado}
              onChange={(event) => setTurnoSelecionado(event.target.value as Turno)}
              className="mt-2"
            >
              {turnos.map((turno) => (
                <option key={turno.value} value={turno.value}>
                  {turno.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-600" htmlFor="horarios">
            Horários
          </label>
          <textarea
            id="horarios"
            className="mt-2 h-56 w-full"
            value={textareaValue}
            onChange={(event) => setTextareaValue(event.target.value)}
            onBlur={salvarHorarios}
            placeholder={'06:30 - Linha Centro → Campus\n07:10 - Linha Bairro A → Campus'}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={salvarHorarios}
            className="rounded-full border border-[#dcd3ea] px-6 py-3 text-sm font-semibold text-slate-700"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={baixarHorarios}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
          >
            <FiDownload /> Download dos horários
          </button>
        </div>
      </section>
    </div>
  )
}
