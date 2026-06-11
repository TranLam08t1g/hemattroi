import { useRef, type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Button({ children, rightIcon, className = '', ...props }: ButtonProps) {
  const fillRef = useRef<HTMLSpanElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)

  return (
    <button
      className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border px-8 py-4 font-heading text-[11px] font-semibold uppercase tracking-[0.3em] outline-none transition-[transform] duration-200 active:scale-[0.97] ${
        className || ''
      }`}
      style={{
        borderColor: 'rgba(255,255,255,0.25)',
        color: '#ffffff',
        background: 'transparent',
      }}
      onMouseEnter={() => {
        if (fillRef.current) fillRef.current.style.transform = 'scaleX(1)'
      }}
      onMouseLeave={() => {
        if (fillRef.current) fillRef.current.style.transform = 'scaleX(0)'
      }}
      {...props}
    >
      <span
        ref={fillRef}
        className="absolute inset-0 origin-left bg-white transition-transform duration-[0.7s] ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
      <span className="relative z-[1] mix-blend-difference">
        {children}
      </span>
      {rightIcon && (
        <span
          ref={iconRef}
          className="relative z-[1] flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:bg-white/20"
        >
          {rightIcon}
        </span>
      )}
    </button>
  )
}