import { useState, useEffect } from 'react'

interface CinemaIntroProps {
  duration?: number
  className?: string
}

export function CinemaIntro({ duration = 1.2, className = '' }: CinemaIntroProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration * 1000 + 400)
    return () => clearTimeout(timer)
  }, [duration])

  if (!visible) return null

  return (
    <>
      <div
        className={`cinema-bar pointer-events-none fixed top-0 left-0 z-[60] h-full w-1/2 bg-black ${className}`}
        style={{ animationDuration: `${duration}s` }}
      />
      <div
        className={`cinema-bar pointer-events-none fixed top-0 right-0 z-[60] h-full w-1/2 bg-black ${className}`}
        style={{ animationDuration: `${duration}s` }}
      />
    </>
  )
}