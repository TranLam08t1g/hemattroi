import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useCountUp(
  ref: React.RefObject<HTMLElement | null>,
  target: number,
  suffix: string = '',
  decimals: number = 0,
  enabled: boolean = false,
) {
  const animated = useRef(false)

  useEffect(() => {
    if (!enabled || !ref.current || animated.current) return
    animated.current = true

    if (target === Infinity) {
      ref.current.textContent = '\u221e'
      return
    }

    const obj = { val: 0 }
    gsap.to(obj, {
      val: target,
      duration: 2.2,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent =
            decimals > 0
              ? obj.val.toFixed(decimals) + suffix
              : Math.floor(obj.val).toLocaleString() + suffix
        }
      },
    })
  }, [enabled, target, suffix, decimals, ref])
}
