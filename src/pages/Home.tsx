import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import { SceneSetup } from '../components/three/SceneSetup'
import { HeroSection } from '../components/sections/HeroSection'
import { TechnicalPanel } from '../components/ui/TechnicalPanel'
import { GlassCard } from '../components/ui/GlassCard'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { COUNTERS } from '../data/constants'

gsap.registerPlugin(useGSAP)

export function Home() {
  const [countersEnabled, setCountersEnabled] = useState(false)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.data-item', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, 0)
      .from('.glass-card-home', { x: 60, opacity: 0, duration: 1 }, '-=0.3')
  }, [])

  const handleReady = () => {
    setCountersEnabled(true)
  }

  return (
    <>
      <Helmet>
        <title>Solar System Odyssey &ndash; Trang Chủ</title>
        <meta
          name="description"
          content="Bắt đầu hành trình liên sao qua những kỳ quan vũ trụ trong hệ Mặt Trời."
        />
      </Helmet>

      <ErrorBoundary>
        <SceneSetup />
      </ErrorBoundary>

      <div className="fixed inset-0 z-[2] pointer-events-none">
        <div className="absolute bottom-[130px] left-[60px] pointer-events-auto max-sm:left-[24px] max-sm:bottom-[80px]">
          <HeroSection onReady={handleReady} />
        </div>

        <div className="absolute bottom-8 left-[48px] z-10 max-sm:left-[20px] max-sm:bottom-4">
          <TechnicalPanel
            align="left"
            enabled={countersEnabled}
            items={[
              { label: 'Khoảng Cách', target: COUNTERS.distance, suffix: ' KM' },
              { label: 'Vận Tốc', target: COUNTERS.velocity, suffix: ' KM/S', decimals: 2 },
              { label: 'Độ Trễ Tín Hiệu', target: COUNTERS.signalDelay, suffix: ' PHÚT', decimals: 1 },
            ]}
          />
        </div>

        <div className="absolute bottom-8 right-[48px] z-10 max-sm:hidden">
          <TechnicalPanel
            align="right"
            enabled={countersEnabled}
            items={[
              { label: 'Ngôi Sao', target: Infinity, suffix: '' },
              { label: 'Khám Phá', target: COUNTERS.discoveries, suffix: '' },
              { label: 'Tải Về', target: COUNTERS.downloads, suffix: '', decimals: 4 },
            ]}
          />
        </div>

        <div className="glass-card-home absolute right-[48px] top-1/2 z-10 -translate-y-1/2 pointer-events-auto max-lg:right-[28px] max-sm:hidden">
          <Link to="/planets/mars">
            <GlassCard className="group cursor-pointer transition-all duration-500 hover:border-[rgba(0,212,255,0.5)] hover:shadow-[0_0_40px_rgba(0,212,255,0.08)]">
              <h3 className="font-heading text-[22px] font-semibold tracking-[0.35em] uppercase text-white max-md:text-base">
                Sao Hỏa
              </h3>
              <p className="font-heading mt-1 text-xs tracking-[0.3em] text-[#4a4a5a] transition-colors duration-400 group-hover:text-[#00D4FF]">
                Khám phá &rarr;
              </p>
            </GlassCard>
          </Link>
        </div>
      </div>
    </>
  )
}
