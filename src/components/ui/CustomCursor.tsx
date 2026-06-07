import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const isHover = useRef(false)

  const springX = useSpring(cursorX, { stiffness: 150, damping: 15 })
  const springY = useSpring(cursorY, { stiffness: 150, damping: 15 })

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const addHover = () => { isHover.current = true }
    const removeHover = () => { isHover.current = false }

    const targets = document.querySelectorAll(
      'a, button, .glass-card, [data-cursor-hover]'
    )
    targets.forEach((el) => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    window.addEventListener('mousemove', move)
    document.body.style.cursor = 'none'

    return () => {
      window.removeEventListener('mousemove', move)
      document.body.style.cursor = 'auto'
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', addHover)
        el.removeEventListener('mouseleave', removeHover)
      })
    }
  }, [cursorX, cursorY])

  return (
    <motion.div
      className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border"
      style={{
        left: springX,
        top: springY,
        width: 20,
        height: 20,
        borderColor: 'rgba(255,255,255,0.6)',
        mixBlendMode: 'difference',
      }}
      animate={{ width: 20, height: 20, background: 'transparent' }}
      whileHover={{
        width: 56,
        height: 56,
        borderColor: '#00D4FF',
        background: 'rgba(0,212,255,0.08)',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <style>{`
        * { cursor: none !important; }
      `}</style>
    </motion.div>
  )
}
