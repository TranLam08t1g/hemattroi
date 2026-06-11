import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  y?: number
  x?: number
  className?: string
  stagger?: boolean
  threshold?: string
}

export function ScrollReveal({
  children,
  delay = 0,
  y = 60,
  x = 0,
  className = '',
  stagger = false,
  threshold = 'top 85%',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!ref.current) return
    const target = stagger ? ref.current.children : ref.current
    gsap.from(target, {
      y,
      x,
      opacity: 0,
      filter: 'blur(8px)',
      duration: 0.9,
      delay,
      stagger: stagger ? 0.08 : 0,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: ref.current,
        start: threshold,
        once: true,
      },
    })
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
