import { useMemo, createRef } from 'react'
import type { RefObject } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { View } from '@react-three/drei'
import { CinemaIntro } from '../components/ui/CinemaIntro'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { TiltCard } from '../components/ui/TiltCard'
import { SharedPlanetCanvas } from '../components/three/SharedPlanetCanvas'
import { Planet3D } from '../components/three/Planet3D'
import { PLANETS } from '../data/planets'
import { MOONS, getMoonsForPlanet } from '../data/moons'

const typeBorder: Record<string, string> = {
  rocky: 'border-l-[#e07040]',
  ice: 'border-l-[#7ec8e3]',
}

const PARENT_ORDER = [
  'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune',
]

export function Planets() {
  const cardRefs = useMemo<Record<string, RefObject<HTMLElement | null>>>(() => {
    const refs: Record<string, RefObject<HTMLElement | null>> = {}
    MOONS.forEach((m) => {
      refs[m.id] = createRef<HTMLElement>()
    })
    return refs
  }, [])

  const sections = useMemo(() => {
    return PARENT_ORDER.map((pid) => {
      const planet = PLANETS.find((p) => p.id === pid)!
      const moons = getMoonsForPlanet(pid)
      return { planet, moons }
    }).filter((s) => s.moons.length > 0)
  }, [])

  const totalMoons = sections.reduce((sum, s) => sum + s.moons.length, 0)

  return (
    <>
      <Helmet>
        <title>Hành Trình Hệ Mặt Trời &ndash; Mặt Trăng</title>
        <meta
          name="description"
          content="Khám phá các mặt trăng trong hệ Mặt Trời của chúng ta."
        />
      </Helmet>

      <CinemaIntro duration={1.4} />

      <SharedPlanetCanvas>
        {MOONS.map((moon) => (
          <View key={moon.id} track={cardRefs[moon.id] as RefObject<HTMLElement>}>
            <ambientLight intensity={0.4} color="#ffffff" />
            <directionalLight
              position={[3, 2, 3]}
              intensity={1.0}
              color="#ffffff"
            />
            <Planet3D
              planetId={moon.id}
              hexColor={moon.hexColor}
              radius={Math.max(0.4, moon.radius * 5)}
              segments={32}
            />
          </View>
        ))}
      </SharedPlanetCanvas>

      <div className="relative z-10 min-h-screen px-6 pt-32 pb-20 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-heading text-[clamp(32px,5vw,60px)] font-bold tracking-[0.15em] text-white">
                Mặt Trăng
              </h1>
              <p className="mt-3 max-w-2xl font-heading text-[13px] tracking-[0.2em] text-[#4a4a5a]">
                Khám phá các vệ tinh tự nhiên quay quanh các hành tinh trong hệ
                Mặt Trời — từ những mặt trăng núi lửa đến các đại dương ngầm băng giá.
              </p>
            </div>
            <div className="hidden font-mono text-[10px] tracking-[0.2em] text-[#4a4a5a] md:block">
              <p>HIỂN THỊ</p>
              <p className="mt-1 text-2xl text-white">
                {String(totalMoons).padStart(2, '0')}
                <span className="text-[#4a4a5a]"> / 13</span>
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-14 space-y-20">
          {sections.map(({ planet, moons }, si) => (
            <section key={planet.id}>
              <ScrollReveal delay={si * 0.1}>
                <div className="mb-6 flex items-center gap-4">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: planet.color,
                      boxShadow: `0 0 10px ${planet.color}`,
                    }}
                  />
                  <h2 className="font-heading text-2xl font-semibold tracking-[0.15em] text-white">
                    {planet.name}
                  </h2>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#4a4a5a]">
                    {moons.length} mặt trăng
                  </span>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {moons.map((moon, mi) => (
                  <ScrollReveal key={moon.id} delay={mi * 0.06} y={30}>
                    <TiltCard className="relative block h-full">
                      <Link
                        to={`/planets/${moon.parentId}/moons/${moon.id}`}
                        className="block h-full"
                      >
                        <div ref={cardRefs[moon.id] as RefObject<HTMLDivElement>}>
                          <MoonCard moon={moon} />
                        </div>
                      </Link>
                      {/* [preserved] CutawayButton — uncomment when ready to restore cutaway feature */}
                      {/* <CutawayButton active={false} onToggle={() => {}} /> */}
                    </TiltCard>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}

interface MoonCardProps {
  moon: (typeof MOONS)[number]
}

function MoonCard({ moon }: MoonCardProps) {
  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden glass border-l-2 ${typeBorder[moon.type]}`}
    >
      <div className="absolute inset-0 opacity-90" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(11,11,16,0.85)]" />

      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{
              backgroundColor: moon.color,
              boxShadow: `0 0 8px ${moon.color}`,
            }}
          />
          <span className="font-mono text-[9px] tracking-[0.25em] text-[#4a4a5a] uppercase">
            {moon.type === 'rocky' ? 'Đá' : 'Băng'}
          </span>
        </div>

        <div>
          <h3 className="font-heading text-2xl font-semibold tracking-[0.15em] text-white md:text-3xl">
            {moon.name}
          </h3>
          <p className="mt-2 line-clamp-2 font-heading text-[11px] leading-relaxed tracking-[0.1em] text-[#a0a0b0]">
            {moon.description}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[rgba(255,255,255,0.08)] pt-3">
            <Stat label="BK" value={`${(moon.radius * 4875).toFixed(0)} km`} />
            <Stat label="QUỸ ĐẠO" value={`${(moon.orbitRadius * 192000).toFixed(0)} km`} />
            <Stat label="LOẠI" value={moon.type === 'rocky' ? 'Đá' : 'Băng'} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[9px] tracking-[0.2em] text-[#4a4a5a]">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-[10px] text-white">{value}</p>
    </div>
  )
}