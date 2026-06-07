import { useState, useEffect } from 'react'

interface MousePosition {
  x: number
  y: number
  normX: number
  normY: number
}

export function useMousePosition(): MousePosition {
  const [pos, setPos] = useState<MousePosition>({
    x: -100,
    y: -100,
    normX: 0,
    normY: 0,
  })

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setPos({
        x: e.clientX,
        y: e.clientY,
        normX: (e.clientX / window.innerWidth) * 2 - 1,
        normY: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  return pos
}
