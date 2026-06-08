import { useMemo, createRef, useState } from 'react'
import type { RefObject } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { View } from '@react-three/drei'
import { BentoGrid, BentoItem } from '../components/ui/BentoGrid'
import { FilterBar } from '../components/ui/FilterBar'
import { CinemaIntro } from '../components/ui/CinemaIntro'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { TiltCard } from '../components/ui/TiltCard'
import { SharedPlanetCanvas } from '../components/three/SharedPlanetCanvas'
import { Planet3D } from '../components/three/Planet3D'
import { CutawayButton } from '../components/ui/CutawayButton'
import { PLANETS } from '../data/planets'
import { useFilterStore } from '../store/filterStore'
import { filterPlanets, sortPlanets, countByType } from '../utils/sortPlanets'
import { TYPE_DISPLAY } from '../utils/planetHelpers'

const typeBorder: Record<string, string> = {
  rocky: 'border-l-[#e07040]',
  gas: 'border-l-[#c88b5a]',
  ice: 'border-l-[#7ec8e3]',
}

interface SlotConfig {
  col: number
  colSpan: number
  rowSpan: number
}

const SLOT_MAP: Record<string, SlotConfig> = {
  mercury: { col: 1, colSpan: 3, rowSpan: 1 },
  venus: { col: 4, colSpan: 3, rowSpan: 1 },
  earth: { col: 7, colSpan: 3, rowSpan: 2 },
  mars: { col: 10, colSpan: 3, rowSpan: 2 },
  jupiter: { col: 1, colSpan: 4, rowSpan: 2 },
  saturn: { col: 5, colSpan: 4, rowSpan: 2 },
  uranus: { col: 9, colSpan: 2, rowSpan: 1 },
  neptune: { col: 11, colSpan: 2, rowSpan: 1 },
}

export function Planets() {
  const type = useFilterStore((s) => s.type)
  const sort = useFilterStore((s) => s.sort)
  const [cutawayId, setCutawayId] = useState<string | null>(null)

  const counts = useMemo(() => countByType(PLANETS), [])
  const filtered = useMemo(
    () => sortPlanets(filterPlanets(PLANETS, type), sort),
    [type, sort],
  )

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
        <title>Hành Trình Hệ Mặt Trời &ndash; Hành Tinh</title>
        <meta
          name="description"
          content="Khám phá các hành tinh trong hệ Mặt Trời của chúng ta."
        />
      </Helmet>

      <CinemaIntro duration={1.4} />

      <SharedPlanetCanvas>
        {filtered.map((planet) => (
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
              radius={planet.radius * 0.9}
              segments={32}
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
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-heading text-[clamp(32px,5vw,60px)] font-bold tracking-[0.15em] text-white">
                Hành Tinh
              </h1>
              <p className="mt-3 max-w-2xl font-heading text-[13px] tracking-[0.2em] text-[#4a4a5a]">
                Khám phá các thế giới đa dạng quay quanh Mặt Trời của chúng ta, từ
                bề mặt thiêu đốt của Sao Thủy đến những cơn gió băng giá của Sao Hải Vương.
              </p>
            </div>
            <div className="hidden font-mono text-[10px] tracking-[0.2em] text-[#4a4a5a] md:block">
              <p>HIỂN THỊ</p>
              <p className="mt-1 text-2xl text-white">
                {filtered.length.toString().padStart(2, '0')}
                <span className="text-[#4a4a5a]"> / 08</span>
              </p>
            </div>
          </div>
        </motion.div>

        <FilterBar counts={counts} />

        <div className="mt-10">
          <BentoGrid cols={12} gap="md">
            {filtered.map((planet, i) => {
              const slot = SLOT_MAP[planet.id] ?? {
                col: 1,
                colSpan: 3,
                rowSpan: 1,
              }
              return (
                <BentoItem
                  key={planet.id}
                  col={slot.col}
                  colSpan={slot.colSpan}
                  rowSpan={slot.rowSpan}
                >
                  <div ref={cardRefs[planet.id] as RefObject<HTMLDivElement>}>
                    <ScrollReveal delay={i * 0.05} stagger={false}>
                      <TiltCard className="relative block h-full">
                        <Link
                          to={`/planets/${planet.id}`}
                          className="block h-full"
                        >
                          <PlanetCard planet={planet} />
                        </Link>
                        <CutawayButton
                          active={cutawayId === planet.id}
                          onToggle={() =>
                            setCutawayId(cutawayId === planet.id ? null : planet.id)
                          }
                        />
                      </TiltCard>
                    </ScrollReveal>
                  </div>
                </BentoItem>
              )
            })}
          </BentoGrid>
        </div>

        {filtered.length === 0 && (
          <div className="mt-20 text-center font-mono text-[11px] tracking-[0.2em] text-[#4a4a5a]">
            KHÔNG CÓ HÀNH TINH PHÙ HỢP
          </div>
        )}
      </div>
    </>
  )
}

interface PlanetCardProps {
  planet: (typeof PLANETS)[number]
}

function PlanetCard({ planet }: PlanetCardProps) {
  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden glass border-l-2 ${typeBorder[planet.type]}`}
    >
      <div className="absolute inset-0 opacity-90" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(11,11,16,0.85)]" />

      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{
              backgroundColor: planet.color,
              boxShadow: `0 0 8px ${planet.color}`,
            }}
          />
          <span className="font-mono text-[9px] tracking-[0.25em] text-[#4a4a5a] uppercase">
            {TYPE_DISPLAY[planet.type]}
          </span>
        </div>

        <div>
          <h3 className="font-heading text-2xl font-semibold tracking-[0.15em] text-white md:text-3xl">
            {planet.name}
          </h3>
          <p className="mt-2 line-clamp-2 font-heading text-[11px] leading-relaxed tracking-[0.1em] text-[#a0a0b0]">
            {planet.description}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[rgba(255,255,255,0.08)] pt-3">
            <Stat label="KC" value={planet.distanceFromSun} />
            <Stat label="QĐ" value={planet.orbitalPeriod} />
            <Stat label="VT" value={String(planet.numberOfMoons)} />
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