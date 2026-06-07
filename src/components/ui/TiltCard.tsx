import { useRef, useState } from 'react'
import type { ReactNode, MouseEvent } from 'react'

interface TiltCardProps {
  children: ReactNode
  max?: number
  scale?: number
  perspective?: number
  className?: string
}

export function TiltCard({
  children,
  max = 8,
  scale = 1.02,
  perspective = 1000,
  className = '',
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTransform(
      `perspective(${perspective}px) rotateX(${-y * max}deg) rotateY(${x * max}deg) scale(${scale})`,
    )
  }

  const handleMouseLeave = () => {
    setTransform(
      `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
    )
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card ${className}`}
      style={{ transform }}
    >
      {children}
    </div>
  )
}
