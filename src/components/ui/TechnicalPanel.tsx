import { useRef } from 'react'
import { useCountUp } from '../../hooks/useCountUp'

interface PanelItem {
  label: string
  target: number
  suffix?: string
  decimals?: number
}

interface TechnicalPanelProps {
  items: PanelItem[]
  align?: 'left' | 'right'
  enabled: boolean
}

export function TechnicalPanel({ items, align = 'left', enabled }: TechnicalPanelProps) {
  return (
    <div
      className={`font-mono text-[11px] leading-relaxed tracking-wider text-[#4a4a5a] ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      {items.map((item) => (
        <PanelRow key={item.label} item={item} enabled={enabled} />
      ))}
    </div>
  )
}

function PanelRow({ item, enabled }: { item: PanelItem; enabled: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  useCountUp(ref, item.target, item.suffix || '', item.decimals || 0, enabled)

  return (
    <div className="my-1.5">
      <span className="text-[#4a4a5a]">{item.label}: </span>
      <span ref={ref} className="text-white">
        0
      </span>
    </div>
  )
}
