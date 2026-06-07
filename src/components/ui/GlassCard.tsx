import { type HTMLAttributes } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function GlassCard({ children, className = '', ...props }: GlassCardProps) {
  return (
    <div
      className={`glass rounded-2xl p-6 md:p-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
