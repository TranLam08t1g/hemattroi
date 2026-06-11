import { type HTMLAttributes } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function GlassCard({ children, className = '', ...props }: GlassCardProps) {
  return (
    <div className="rounded-[1.25rem] bg-white/[0.04] p-[2px]">
      <div
        className={`rounded-[calc(1.25rem-2px)] bg-[#0B0B10] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${className}`}
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}