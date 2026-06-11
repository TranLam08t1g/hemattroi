import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { Button } from '../ui/Button'

gsap.registerPlugin(useGSAP, SplitText)

interface HeroSectionProps {
  onReady?: () => void
}

export function HeroSection({ onReady }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleLine1Ref = useRef<HTMLSpanElement>(null)
  const titleLine2Ref = useRef<HTMLSpanElement>(null)
  const subtitleRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    if (!titleLine1Ref.current || !titleLine2Ref.current || !subtitleRef.current) return

    const split1 = SplitText.create(titleLine1Ref.current, { type: 'chars', tag: 'span' })
    const split2 = SplitText.create(titleLine2Ref.current, { type: 'chars', tag: 'span' })
    const splitSub = SplitText.create(subtitleRef.current, { type: 'chars', tag: 'span' })

    const tl = gsap.timeline({
      defaults: { ease: 'power4.out' },
      onComplete: () => onReady?.(),
    })

    tl.from(split1.chars, {
      y: 80,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
    }, 0.2)

    tl.from(split2.chars, {
      y: 80,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
    }, '-=0.5')

    tl.from(splitSub.chars, {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.04,
    }, '-=0.35')

    tl.from('.hero-text', {
      y: 30,
      opacity: 0,
      duration: 0.7,
    }, '-=0.35')

    tl.from('.hero-btn', {
      y: 20,
      opacity: 0,
      duration: 0.6,
    }, '-=0.25')

    tl.from('.hero-stat', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
    }, '-=0.2')

    return () => {
      split1.revert()
      split2.revert()
      splitSub.revert()
    }
  }, { scope: containerRef })

  return (
    <>
      {/* Vertical cinema bars (intro film) */}
      <div className="cinema-bar pointer-events-none fixed top-0 left-0 z-[60] h-full w-1/2 bg-black" />
      <div className="cinema-bar pointer-events-none fixed top-0 right-0 z-[60] h-full w-1/2 bg-black" />

      {/* Background decorative rings */}
      <div className="pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2">
        <div className="relative h-[560px] w-[560px]">
          <div className="absolute inset-0 rounded-full border border-[rgba(0,212,255,0.1)] spin-slow" />
          <div className="absolute inset-[80px] rounded-full border border-dashed border-[rgba(0,212,255,0.18)] spin-reverse" />
          <div className="absolute inset-[160px] rounded-full border border-[rgba(0,212,255,0.28)] pulse-ring" />
          <div className="absolute inset-[220px] rounded-full border border-dashed border-[rgba(255,107,0,0.25)] pulse-ring-delayed" />

          {/* Tick marks on outer ring */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = (i / 36) * Math.PI * 2
            const x = 280 + Math.cos(angle) * 270
            const y = 280 + Math.sin(angle) * 270
            return (
              <div
                key={i}
                className="absolute h-[10px] w-px bg-[rgba(0,212,255,0.4)]"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: `rotate(${(angle * 180) / Math.PI + 90}deg)`,
                  transformOrigin: 'top',
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Scan line overlay */}
      <div className="scan-line z-40" />

      {/* HUD corner frames */}
      <svg
        className="pointer-events-none fixed left-6 top-24 z-30 h-14 w-14 opacity-50"
        viewBox="0 0 56 56"
      >
        <path
          className="hud-corner-line"
          d="M0 0 L0 56 L56 56"
          stroke="#00D4FF"
          strokeWidth="1"
          fill="none"
          style={{ animationDelay: '0.2s' }}
        />
      </svg>
      <svg
        className="pointer-events-none fixed right-6 top-24 z-30 h-14 w-14 opacity-50"
        viewBox="0 0 56 56"
      >
        <path
          className="hud-corner-line"
          d="M56 0 L56 56 L0 56"
          stroke="#00D4FF"
          strokeWidth="1"
          fill="none"
          style={{ animationDelay: '0.35s' }}
        />
      </svg>
      <svg
        className="pointer-events-none fixed bottom-32 left-6 z-30 h-14 w-14 opacity-50"
        viewBox="0 0 56 56"
      >
        <path
          className="hud-corner-line"
          d="M0 56 L0 0 L56 0"
          stroke="#00D4FF"
          strokeWidth="1"
          fill="none"
          style={{ animationDelay: '0.5s' }}
        />
      </svg>
      <svg
        className="pointer-events-none fixed bottom-32 right-6 z-30 h-14 w-14 opacity-50"
        viewBox="0 0 56 56"
      >
        <path
          className="hud-corner-line"
          d="M56 56 L56 0 L0 0"
          stroke="#00D4FF"
          strokeWidth="1"
          fill="none"
          style={{ animationDelay: '0.65s' }}
        />
      </svg>

      {/* Main hero content */}
      <div ref={containerRef} className="relative z-10 max-w-[720px]">
        <h1 className="hero-title font-heading text-[clamp(24px,4.5vw,65px)] font-light leading-[0.95] tracking-[clamp(6px,0.9vw,14px)] text-white">
          <span ref={titleLine1Ref} className="block">HỆ</span>
          <span ref={titleLine2Ref} className="block">MẶT TRỜI</span>
        </h1>

        <h2 className="hero-subtitle mt-3 font-heading text-[clamp(18px,2.6vw,40px)] font-light tracking-[clamp(6px,1vw,14px)] text-white md:mt-4">
          <span ref={subtitleRef}>Hành Trình Khám Phá</span>
        </h2>

        <p className="hero-text mt-5 max-w-[440px] font-heading text-[13px] leading-relaxed tracking-[0.25em] text-[#4a4a5a] md:mt-6">
          Bắt đầu hành trình liên sao qua những kỳ quan vũ trụ trong
          vùng lân cận của chúng ta.
        </p>

        <div className="hero-btn mt-8 flex items-center gap-4">
          <Button rightIcon={<span className="text-[10px]">&rarr;</span>}>Khởi Động Hành Trình</Button>
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#4a4a5a]">
            ⌘ + E
          </span>
        </div>

        {/* Stat callouts */}
        <div className="mt-14 grid grid-cols-3 gap-6 max-w-[520px]">
          {[
            { label: 'NHIỆM VỤ', value: 'ODYSSEY-01' },
            { label: 'TRẠNG THÁI', value: 'ĐANG HOẠT ĐỘNG' },
            { label: 'KHỞI HÀNH', value: 'NGAY' },
          ].map((s, i) => (
            <div
              key={s.label}
              className="hero-stat glass rounded-lg p-3"
              style={{ animationDelay: `${1.6 + i * 0.1}s` }}
            >
              <p className="font-mono text-[9px] tracking-[0.25em] text-[#4a4a5a]">
                {s.label}
              </p>
              <p className="mt-1 font-heading text-[11px] tracking-[0.15em] text-white">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}