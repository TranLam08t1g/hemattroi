import { useMemo, createRef, useState } from 'react'
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
import { CutawayButton } from '../components/ui/CutawayButton'
import { PLANETS } from '../data/planets'
import { TYPE_DISPLAY } from '../utils/planetHelpers'

const typeAccent: Record<string, string> = {
  rocky: 'text-[#e07040]',
  gas: 'text-[#c88b5a]',
  ice: 'text-[#7ec8e3]',
}

export function Gallery() {
  const [cutawayId, setCutawayId] = useState<string | null>(null)

  const cardRefs = useMemo<Record<string, RefObject<HTMLElement | null>>>(() => {
    const refs: Record<string, RefObject<HTMLElement | null>> = {}
    PLANETS.forEach((p) => {
      refs[p.id] = createRef<HTMLElement>()
    })
    return refs
  }, [])

  return (
    <>
      <Helmet>
        <title>Hành Trình Hệ Mặt Trời &ndash; Thư Viện</title>
        <meta
          name="description"
          content="Thư viện hình ảnh về hệ Mặt Trời."
        />
      </Helmet>

      <CinemaIntro duration={1.4} />

      <SharedPlanetCanvas>
        {PLANETS.map((planet) => (
          <View key={planet.id} track={cardRefs[planet.id] as RefObject<HTMLElement>}>
            <ambientLight intensity={0.4} color="#ffffff" />
            <directionalLight
              position={[3, 2, 3]}
              intensity={1.0}
              color="#ffffff"
            />
            <Planet3D
              planetId={planet.id}
              hexColor={planet.hexColor}
              radius={planet.radius * 1.1}
              segments={64}
              cutaway={cutawayId === planet.id}
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
            Thư Viện
          </h1>
          <p className="mt-3 max-w-2xl font-heading text-[13px] tracking-[0.2em] text-[#4a4a5a]">
            Hành trình thị giác qua hệ Mặt Trời của chúng ta &mdash; tám thế
            giới, tám câu chuyện, được kết xuất trong thời gian thực.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {PLANETS.map((planet, i) => (
            <ScrollReveal key={planet.id} delay={i * 0.08} y={40}>
              <TiltCard max={6} scale={1.03} className="relative">
                <Link to={`/planets/${planet.id}`} className="block">
                  <div ref={cardRefs[planet.id] as RefObject<HTMLDivElement>}>
                    <GalleryCard planet={planet} />
                  </div>
                </Link>
                <CutawayButton
                  active={cutawayId === planet.id}
                  onToggle={() =>
                    setCutawayId(cutawayId === planet.id ? null : planet.id)
                  }
                />
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </>
  )
}

interface GalleryCardProps {
  planet: (typeof PLANETS)[number]
}

function GalleryCard({ planet }: GalleryCardProps) {
  return (
    <div className="group glass relative h-[420px] overflow-hidden rounded-2xl">
      <div className="absolute inset-0 opacity-95" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[rgba(11,11,16,0.95)] via-[rgba(11,11,16,0.5)] to-transparent" />

      <div className="absolute left-5 top-5 z-10">
        <span
          className={`font-mono text-[9px] tracking-[0.3em] uppercase ${typeAccent[planet.type]}`}
        >
          {TYPE_DISPLAY[planet.type]}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-6">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-heading text-3xl font-bold tracking-[0.1em] text-white">
              {planet.name}
            </h3>
            <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-[#4a4a5a] uppercase">
              {planet.distanceFromSun}
            </p>
          </div>
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{
              backgroundColor: planet.color,
              boxShadow: `0 0 12px ${planet.color}`,
            }}
          />
        </div>

        <p className="mt-3 line-clamp-2 font-heading text-[11px] leading-relaxed tracking-[0.1em] text-[#a0a0b0]">
          {planet.description}
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