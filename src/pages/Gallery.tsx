import { useMemo, createRef } from 'react'
import type { RefObject } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { View } from '@react-three/drei'
import { CinemaIntro } from '../components/ui/CinemaIntro'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { TiltCard } from '../components/ui/TiltCard'
import { SharedPlanetCanvas } from '../components/three/SharedPlanetCanvas'
import { Planet3D } from '../components/three/Planet3D'
import { PLANETS } from '../data/planets'
import { MOONS, getMoonsForPlanet } from '../data/moons'

const typeAccent: Record<string, string> = {
  rocky: 'text-[#e07040]',
  ice: 'text-[#7ec8e3]',
}

const PARENT_ORDER = [
  'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune',
]

export function Gallery() {
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

  return (
    <>
      <Helmet>
        <title>Hành Trình Hệ Mặt Trời &ndash; Thư Viện Mặt Trăng</title>
        <meta
          name="description"
          content="Thư viện hình ảnh về các mặt trăng trong hệ Mặt Trời."
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
              radius={Math.max(0.5, moon.radius * 6)}
              segments={64}
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
          <h1 className="font-heading text-[clamp(32px,5vw,60px)] font-bold tracking-[0.15em] text-white">
            Thư Viện Mặt Trăng
          </h1>
          <p className="mt-3 max-w-2xl font-heading text-[13px] tracking-[0.2em] text-[#4a4a5a]">
            Hành trình thị giác qua các vệ tinh của hệ Mặt Trời &mdash; mười ba
            thế giới bí ẩn, được kết xuất trong thời gian thực.
          </p>
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
                  <ScrollReveal key={moon.id} delay={mi * 0.08} y={40}>
                    <TiltCard max={6} scale={1.03} className="relative">
                      <Link to={`/planets/${moon.parentId}/moons/${moon.id}`} className="block">
                        <div ref={cardRefs[moon.id] as RefObject<HTMLDivElement>}>
                          <GalleryCard moon={moon} />
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

interface GalleryCardProps {
  moon: (typeof MOONS)[number]
}

function GalleryCard({ moon }: GalleryCardProps) {
  return (
    <div className="group glass relative h-[420px] overflow-hidden rounded-2xl">
      <div className="absolute inset-0 opacity-95" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[rgba(11,11,16,0.95)] via-[rgba(11,11,16,0.5)] to-transparent" />

      <div className="absolute left-5 top-5 z-10">
        <span
          className={`font-mono text-[9px] tracking-[0.3em] uppercase ${typeAccent[moon.type]}`}
        >
          {moon.type === 'rocky' ? 'Đá' : 'Băng'}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-6">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-heading text-3xl font-bold tracking-[0.1em] text-white">
              {moon.name}
            </h3>
            <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-[#4a4a5a] uppercase">
              BK {(moon.radius * 4875).toFixed(0)} km
            </p>
          </div>
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{
              backgroundColor: moon.color,
              boxShadow: `0 0 12px ${moon.color}`,
            }}
          />
        </div>

        <p className="mt-3 line-clamp-2 font-heading text-[11px] leading-relaxed tracking-[0.1em] text-[#a0a0b0]">
          {moon.description}
        </p>

        <div className="mt-4 flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#00D4FF] uppercase">
            Khám Phá
          </span>
          <span className="text-[#00D4FF]">&rarr;</span>
        </div>
      </div>
    </div>
  )
}