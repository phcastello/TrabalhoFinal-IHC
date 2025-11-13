import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

interface AccordionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export const Accordion = ({ title, defaultOpen = false, children }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="rounded-[20px] border border-[#e8e1f1] bg-[#f9f6ff]">
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-slate-700"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {title}
        <FiChevronDown className={`h-5 w-5 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="border-t border-[#e8e1f1] px-5 py-4 text-sm text-slate-600">{children}</div>}
    </div>
  )
}
