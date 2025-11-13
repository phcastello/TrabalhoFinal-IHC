interface TimePickerProps {
  label: string
  value: string
  onChange: (novo: string) => void
}

const formatValue = (value: string, max: number) => {
  const numeric = Math.max(0, Math.min(Number(value.replace(/\D/g, '')) || 0, max))
  return numeric.toString().padStart(2, '0')
}

export const TimePicker = ({ label, value, onChange }: TimePickerProps) => {
  const [hora = '00', minuto = '00'] = value.split(':')

  const updateValue = (novoHora: string, novoMinuto: string) => {
    onChange(`${novoHora}:${novoMinuto}`)
  }

  return (
    <div className="rounded-[30px] border border-[#e2dce9] bg-white px-6 py-5">
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <div className="mt-4 flex items-center gap-4 text-4xl font-semibold text-slate-800">
        <input
          type="number"
          aria-label={`Horas de ${label}`}
          className="w-24 rounded-[20px] border border-[#dcd3ea] bg-[#f9f6ff] p-3 text-center text-4xl text-slate-800"
          value={hora}
          min={0}
          max={23}
          onChange={(event) => updateValue(formatValue(event.target.value, 23), minuto)}
        />
        :
        <input
          type="number"
          aria-label={`Minutos de ${label}`}
          className="w-24 rounded-[20px] border border-[#dcd3ea] bg-[#f9f6ff] p-3 text-center text-4xl text-slate-800"
          value={minuto}
          min={0}
          max={59}
          onChange={(event) => updateValue(hora, formatValue(event.target.value, 59))}
        />
      </div>
    </div>
  )
}
