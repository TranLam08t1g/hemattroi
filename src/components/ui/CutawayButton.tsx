interface CutawayButtonProps {
  active: boolean
  onToggle: () => void
}

export function CutawayButton({ active, onToggle }: CutawayButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle()
      }}
      className="pointer-events-auto absolute top-5 right-5 z-20 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300"
      style={{
        borderColor: active ? 'rgba(0,212,255,0.6)' : 'rgba(255,255,255,0.12)',
        background: active ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.03)',
      }}
      title={active ? 'Tắt mặt cắt' : 'Xem mặt cắt'}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? '#00D4FF' : '#4a4a5a'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
    </button>
  )
}