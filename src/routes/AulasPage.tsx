import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { FiDownload, FiInfo, FiPlus } from 'react-icons/fi'
import { Calendar } from '../components/Calendar'
import { Modal } from '../components/Modal'
import { TimePicker } from '../components/TimePicker'
import { useToast } from '../context/ToastContext'
import type { AulaDoDia } from '../types'
import { downloadCsv, downloadTxt } from '../utils/export'
import { storage } from '../utils/storage'

dayjs.locale('pt-br')

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 9)

const formatarData = (iso: string) => dayjs(iso).format('dddd, D [de] MMMM')

export const AulasPage = () => {
  const { showToast } = useToast()
  const [aulas, setAulas] = useState<AulaDoDia[]>(storage.getAulas())
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [aulaSelecionadaId, setAulaSelecionadaId] = useState<string>('')
  const [detalhesAbertos, setDetalhesAbertos] = useState(false)
  const [novaAula, setNovaAula] = useState({ nome: '', inicio: '08:00', fim: '09:00', professor: '', sala: '' })

  const aulasDoDia = useMemo(
    () => aulas.filter((aula) => aula.dataISO === selectedDate),
    [aulas, selectedDate],
  )

  useEffect(() => {
    if (aulasDoDia.length && !aulasDoDia.some((aula) => aula.id === aulaSelecionadaId)) {
      setAulaSelecionadaId(aulasDoDia[0].id)
    }
  }, [aulasDoDia, aulaSelecionadaId])

  const aulaSelecionada = aulas.find((aula) => aula.id === aulaSelecionadaId) ?? aulasDoDia[0] ?? null

  const salvarAulas = (lista: AulaDoDia[]) => {
    setAulas(lista)
    storage.saveAulas(lista)
  }

  const atualizarAula = (id: string, campo: keyof AulaDoDia, valor: string) => {
    const atualizadas = aulas.map((aula) => (aula.id === id ? { ...aula, [campo]: valor } : aula))
    salvarAulas(atualizadas)
  }

  const exportarHorarios = () => {
    if (!aulasDoDia.length) {
      showToast('Nenhuma aula neste dia para exportar', 'error')
      return
    }
    const rows = [['Matéria', 'Início', 'Fim', 'Professor', 'Sala'], ...aulasDoDia.map((aula) => [aula.nome, aula.inicio, aula.fim, aula.professor ?? '-', aula.sala ?? '-'])]
    downloadCsv(`aulas-${selectedDate}.csv`, rows)
    showToast('Agenda exportada!', 'success')
  }

  const abrirDetalhes = () => {
    if (!aulasDoDia.length) {
      showToast('Nenhuma aula para mostrar', 'info')
      return
    }
    setDetalhesAbertos(true)
  }

  const adicionarAula = () => {
    if (!novaAula.nome.trim()) {
      showToast('Informe o nome da aula', 'error')
      return
    }
    const nova: AulaDoDia = {
      id: createId(),
      dataISO: selectedDate,
      nome: novaAula.nome.trim(),
      inicio: novaAula.inicio,
      fim: novaAula.fim,
      professor: novaAula.professor || undefined,
      sala: novaAula.sala || undefined,
    }
    const atualizadas = [...aulas, nova]
    salvarAulas(atualizadas)
    setAulaSelecionadaId(nova.id)
    setNovaAula({ nome: '', inicio: '08:00', fim: '09:00', professor: '', sala: '' })
    showToast('Nova aula adicionada ao dia selecionado!', 'success')
  }

  const highlightedDates = [...new Set(aulas.map((aula) => aula.dataISO))]

  const exportarResumoTxt = () => {
    if (!aulasDoDia.length) {
      showToast('Nenhum dado para exportar', 'error')
      return
    }
    const texto = [
      `Aulas do dia ${formatarData(selectedDate)}`,
      '--------------------------',
      ...aulasDoDia.map(
        (aula) => `${aula.nome} - ${aula.inicio} às ${aula.fim} (${aula.professor ?? 'Professor a definir'})`,
      ),
    ].join('\n')
    downloadTxt(`agenda-${selectedDate}.txt`, texto)
    showToast('Arquivo TXT gerado', 'info')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <div className="space-y-6">
        <div className="rounded-[34px] bg-[#f3ecff] p-6 text-slate-700">
          <p className="text-sm font-semibold">Informações de aulas do dia</p>
          <h2 className="text-3xl font-semibold text-slate-800">
            {formatarData(selectedDate)}
          </h2>
          <p className="text-sm text-slate-600">
            Clique em uma data para visualizar os horários correspondentes.
          </p>
          <div className="mt-6">
            <Calendar
              selectedDate={selectedDate}
              onSelectDate={(iso) => {
                setSelectedDate(iso)
                const primeira = aulas.find((aula) => aula.dataISO === iso)
                setAulaSelecionadaId(primeira?.id ?? '')
              }}
              highlightedDates={highlightedDates}
            />
          </div>
        </div>
        <div className="rounded-[34px] border border-dashed border-[#d8cfee] bg-white/60 p-6 text-sm text-slate-600">
          <p>
            Dica: mantenha as informações atualizadas para aproveitar o botão de exportação e chegar nas
            aulas no horário certo.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <section className="rounded-[34px] border border-[#e2dce9] bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-slate-500">Aulas do dia</p>
              <h3 className="text-2xl font-semibold text-slate-800">
                {aulasDoDia.length ? `${aulasDoDia.length} aulas cadastradas` : 'Sem aulas cadastradas'}
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={exportarHorarios}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
              >
                <FiDownload /> Exportar CSV
              </button>
              <button
                type="button"
                onClick={exportarResumoTxt}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
              >
                <FiDownload /> Exportar TXT
              </button>
              <button
                type="button"
                onClick={abrirDetalhes}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
              >
                <FiInfo /> Ver informações detalhadas
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {aulasDoDia.length > 0 ? (
              <>
                <label className="space-y-2 text-sm font-semibold text-slate-600">
                  Selecionar aula
                  <select
                    className="w-full rounded-[24px] border border-[#e2dce9] bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                    value={aulaSelecionada?.id ?? ''}
                    onChange={(event) => setAulaSelecionadaId(event.target.value)}
                  >
                    {aulasDoDia.map((aula) => (
                      <option key={aula.id} value={aula.id}>
                        {aula.nome}
                      </option>
                    ))}
                  </select>
                </label>

                {aulaSelecionada && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <TimePicker
                      label="Horário de início"
                      value={aulaSelecionada.inicio}
                      onChange={(valor) => atualizarAula(aulaSelecionada.id, 'inicio', valor)}
                    />
                    <TimePicker
                      label="Horário de término"
                      value={aulaSelecionada.fim}
                      onChange={(valor) => atualizarAula(aulaSelecionada.id, 'fim', valor)}
                    />
                    <label className="space-y-1 text-sm font-semibold text-slate-600">
                      Professor(a)
                      <input
                        type="text"
                        className="w-full rounded-[24px] border border-[#e2dce9] bg-white px-4 py-3 text-sm text-slate-700"
                        value={aulaSelecionada.professor ?? ''}
                        onChange={(event) => atualizarAula(aulaSelecionada.id, 'professor', event.target.value)}
                      />
                    </label>
                    <label className="space-y-1 text-sm font-semibold text-slate-600">
                      Sala
                      <input
                        type="text"
                        className="w-full rounded-[24px] border border-[#e2dce9] bg-white px-4 py-3 text-sm text-slate-700"
                        value={aulaSelecionada.sala ?? ''}
                        onChange={(event) => atualizarAula(aulaSelecionada.id, 'sala', event.target.value)}
                      />
                    </label>
                  </div>
                )}
              </>
            ) : (
              <p className="rounded-[24px] border border-dashed border-[#dcd3ea] bg-[#fdfbff] p-6 text-center text-sm text-slate-500">
                Nenhuma aula cadastrada nesta data. Utilize o formulário abaixo para adicionar.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[34px] border border-[#e2dce9] bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Adicionar nova aula</p>
              <h3 className="text-xl font-semibold text-slate-800">
                Registrar para {formatarData(selectedDate)}
              </h3>
            </div>
            <button
              type="button"
              onClick={adicionarAula}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              <FiPlus /> Adicionar aula
            </button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-semibold text-slate-600">
              Nome da aula
              <input
                type="text"
                className="w-full rounded-[24px] border border-[#e2dce9] bg-white px-4 py-3 text-sm text-slate-700"
                value={novaAula.nome}
                onChange={(event) => setNovaAula((prev) => ({ ...prev, nome: event.target.value }))}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-600">
              Professor(a)
              <input
                type="text"
                className="w-full rounded-[24px] border border-[#e2dce9] bg-white px-4 py-3 text-sm text-slate-700"
                value={novaAula.professor}
                onChange={(event) => setNovaAula((prev) => ({ ...prev, professor: event.target.value }))}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-600">
              Sala
              <input
                type="text"
                className="w-full rounded-[24px] border border-[#e2dce9] bg-white px-4 py-3 text-sm text-slate-700"
                value={novaAula.sala}
                onChange={(event) => setNovaAula((prev) => ({ ...prev, sala: event.target.value }))}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-600">
              Horário inicial
              <input
                type="time"
                className="w-full rounded-[24px] border border-[#e2dce9] bg-white px-4 py-3 text-sm text-slate-700"
                value={novaAula.inicio}
                onChange={(event) => setNovaAula((prev) => ({ ...prev, inicio: event.target.value }))}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-600">
              Horário final
              <input
                type="time"
                className="w-full rounded-[24px] border border-[#e2dce9] bg-white px-4 py-3 text-sm text-slate-700"
                value={novaAula.fim}
                onChange={(event) => setNovaAula((prev) => ({ ...prev, fim: event.target.value }))}
              />
            </label>
          </div>
        </section>
      </div>

      <Modal open={detalhesAbertos} onClose={() => setDetalhesAbertos(false)} title="Aulas cadastradas">
        <div className="space-y-4">
          {aulasDoDia.map((aula) => (
            <div key={aula.id} className="rounded-2xl border border-[#e2dce9] p-4">
              <p className="text-lg font-semibold">{aula.nome}</p>
              <p className="text-sm text-slate-500">
                {aula.inicio} - {aula.fim} · {aula.sala ?? 'Sala a definir'}
              </p>
              <p className="text-sm text-slate-500">{aula.professor ?? 'Professor a definir'}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
