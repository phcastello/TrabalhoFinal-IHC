import { useMemo, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/pt-br'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface CalendarProps {
  selectedDate: string
  onSelectDate: (iso: string) => void
  highlightedDates?: string[]
}

const weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

dayjs.locale('pt-br')

const buildCalendar = (currentMonth: Dayjs) => {
  const start = currentMonth.startOf('month').startOf('week')
  const end = currentMonth.endOf('month').endOf('week')
  const days = []
  let date = start

  while (date.isBefore(end) || date.isSame(end, 'day')) {
    days.push(date)
    date = date.add(1, 'day')
  }

  return days
}

export const Calendar = ({ selectedDate, onSelectDate, highlightedDates = [] }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs(selectedDate))
  const days = useMemo(() => buildCalendar(currentMonth), [currentMonth])
  const highlightedSet = useMemo(() => new Set(highlightedDates), [highlightedDates])

  const goToPrev = () => setCurrentMonth((prev) => prev.subtract(1, 'month'))
  const goToNext = () => setCurrentMonth((prev) => prev.add(1, 'month'))

  return (
    <div className="rounded-[30px] bg-[#f3ecff] p-6 text-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-brand">Calendário</p>
          <h3 className="text-2xl font-semibold text-slate-800">
            {currentMonth.format('MMMM [de] YYYY')}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPrev}
            className="rounded-full border border-[#d9cfe6] p-2 text-slate-600"
            aria-label="Mês anterior"
          >
            <FiChevronLeft />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="rounded-full border border-[#d9cfe6] p-2 text-slate-600"
            aria-label="Próximo mês"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
        {weekdayLabels.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((day) => {
          const isCurrentMonth = day.isSame(currentMonth, 'month')
          const isSelected = day.format('YYYY-MM-DD') === selectedDate
          const hasAula = highlightedSet.has(day.format('YYYY-MM-DD'))

          return (
            <button
              type="button"
              key={day.toISOString()}
              onClick={() => onSelectDate(day.format('YYYY-MM-DD'))}
              className={`flex h-12 flex-col items-center justify-center rounded-2xl border text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand ${
                isSelected
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : isCurrentMonth
                    ? 'border-transparent bg-white text-slate-700'
                    : 'border-transparent text-slate-400'
              }`}
            >
              {day.date()}
              {hasAula && !isSelected && <span className="mt-1 h-1 w-1 rounded-full bg-slate-500" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
