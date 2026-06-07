import { useRef, type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function Button({ children, className = '', ...props }: ButtonProps) {
  const fillRef = useRef<HTMLSpanElement>(null)

  return (
    <button
      className={`relative inline-flex items-center justify-center overflow-hidden border px-10 py-4 font-heading text-[11px] font-semibold uppercase tracking-[0.3em] outline-none transition-colors duration-300 ${
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
        className="absolute inset-0 origin-left bg-white transition-transform duration-[0.7s] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
      <span className="relative z-[1] mix-blend-difference">
        {children}
      </span>
    </button>
  )
}
