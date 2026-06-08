import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { PLANETS } from '../data/planets'
import { MOONS, getMoonsForPlanet } from '../data/moons'
import { CinemaIntro } from '../components/ui/CinemaIntro'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { Planet3D } from '../components/three/Planet3D'

type Tab = 'overview' | 'profile'

const TABS: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Tổng Quan' },
  { key: 'profile', label: 'Hồ Sơ' },
]

function moonComposition(type: 'rocky' | 'ice') {
  if (type === 'rocky') {
    return [
      { label: 'Lõi Sắt', pct: 30, color: '#d4904a' },
      { label: 'Lớp Phủ Silicat', pct: 55, color: '#a08060' },
      { label: 'Bề Mặt Đá', pct: 15, color: '#706050' },
    ]
  }
  return [
    { label: 'Lõi Đá', pct: 25, color: '#706050' },
    { label: 'Lớp Phủ Băng', pct: 60, color: '#a0c8e0' },
    { label: 'Bề Mặt Băng Giá', pct: 15, color: '#d0e8f8' },
  ]
}

export function MoonDetail() {
  const { id: planetId, moonId } = useParams<{ id: string; moonId: string }>()
  const planet = PLANETS.find((p) => p.id === planetId)
  const moon = MOONS.find((m) => m.id === moonId && m.parentId === planetId)
  const [tab, setTab] = useState<Tab>('overview')

  if (!planet || !moon) {
    return (
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl text-white">Không Tìm Thấy Mặt Trăng</h1>
          <Link
            to="/planets"
            className="mt-4 inline-block font-heading text-sm tracking-[0.2em] text-[#00D4FF] underline"
          >
            Quay Lại Danh Sách Mặt Trăng
          </Link>
        </div>
      </div>
    )
  }

  const siblings = getMoonsForPlanet(planet.id)
  const composition = moonComposition(moon.type)

  return (
    <>
      <Helmet>
        <title>Hành Trình Hệ Mặt Trời &ndash; {moon.name}</title>
        <meta name="description" content={moon.description} />
      </Helmet>

      <CinemaIntro duration={1.4} />

      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden bg-[#0B0B10]">
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${moon.color}33, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />

        <div className="pointer-events-none absolute inset-0 z-[2]">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45, near: 0.2, far: 100 }}
            gl={{ antialias: true }}
            dpr={[1, 2]}
            style={{ width: '100%', height: '100%', display: 'block' }}
            frameloop="always"
            onCreated={({ gl: renderer }) => {
              renderer.setClearColor(new THREE.Color('#0B0B10'))
            }}
          >
            <ambientLight intensity={0.4} color="#ffffff" />
            <directionalLight position={[3, 2, 3]} intensity={1.0} color="#ffffff" />
            <Planet3D
              planetId={moon.id}
              hexColor={moon.hexColor}
              radius={1.2}
              segments={64}
            />
          </Canvas>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-1/2 bg-gradient-to-t from-[#0B0B10] to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-14 md:px-12 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <Link
              to="/planets"
              className="inline-block font-mono text-[10px] tracking-[0.3em] text-[#4a4a5a] transition-colors hover:text-white uppercase"
            >
              &larr; Tất cả mặt trăng
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="mt-4 font-heading text-[clamp(48px,10vw,140px)] font-bold leading-[0.9] tracking-[0.08em] text-white"
            >
              {moon.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="mt-4 max-w-2xl font-heading text-sm leading-relaxed tracking-[0.15em] text-[#a0a0b0]"
            >
              {moon.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-6 flex items-center gap-3"
            >
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{
                  backgroundColor: moon.color,
                  boxShadow: `0 0 12px ${moon.color}`,
                }}
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#4a4a5a] uppercase">
                {moon.type === 'rocky' ? 'Đá' : 'Băng'} &middot; Vệ tinh của{' '}
                <Link
                  to={`/planets/${planet.id}`}
                  className="pointer-events-auto text-[#00D4FF] hover:underline"
                >
                  {planet.name}
                </Link>
              </span>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] text-[#4a4a5a]">
            CUỘN ĐỂ KHÁM PHÁ
          </span>
        </motion.div>
      </section>

      {/* TABS */}
      <section className="relative z-10 px-6 pt-16 md:px-12 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center gap-2 border-b border-[rgba(255,255,255,0.08)] pb-3">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-t-md px-4 py-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-all duration-300 ${
                  tab === t.key
                    ? 'tab-active-glow border border-b-0 border-[rgba(0,212,255,0.4)] bg-[rgba(0,212,255,0.08)] text-[#00D4FF]'
                    : 'text-[#4a4a5a] hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="min-h-[400px] py-10"
            >
              {tab === 'overview' && (
                <OverviewTab moon={moon} composition={composition} />
              )}
              {tab === 'profile' && (
                <ProfileTab moon={moon} planet={planet} siblings={siblings} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* FOOTER */}
      <section className="relative z-10 px-6 pb-20 md:px-12 lg:px-16">
        <div className="mx-auto max-w-5xl border-t border-[rgba(255,255,255,0.06)] pt-10">
          <Link
            to="/planets"
            className="font-mono text-[10px] tracking-[0.3em] text-[#4a4a5a] transition-colors hover:text-white uppercase"
          >
            &larr; Tiếp tục khám phá mặt trăng
          </Link>
        </div>
      </section>
    </>
  )
}

function OverviewTab({
  moon,
  composition,
}: {
  moon: (typeof MOONS)[number]
  composition: { label: string; pct: number; color: string }[]
}) {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <h2 className="font-heading text-xs tracking-[0.3em] uppercase text-[#00D4FF]">
          Về {moon.name}
        </h2>
        <p className="mt-4 font-heading text-base leading-relaxed tracking-[0.05em] text-white">
          {moon.description}
        </p>
        {moon.funFact && (
          <blockquote className="mt-6 border-l-2 border-[#00D4FF] pl-4 font-mono text-xs italic tracking-[0.1em] text-[#a0a0b0]">
            &ldquo;{moon.funFact}&rdquo;
          </blockquote>
        )}
      </div>

      <div>
        <h2 className="font-heading text-xs tracking-[0.3em] uppercase text-[#00D4FF]">
          Cấu Tạo Ước Tính
        </h2>
        <div className="mt-4 space-y-3">
          {composition.map((c) => (
            <div key={c.label}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.15em] text-[#a0a0b0] uppercase">
                  {c.label}
                </span>
                <span className="font-mono text-[10px] text-white">{c.pct}%</span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.05)]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${c.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: c.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProfileTab({
  moon,
  planet,
  siblings,
}: {
  moon: (typeof MOONS)[number]
  planet: (typeof PLANETS)[number]
  siblings: ReturnType<typeof getMoonsForPlanet>
}) {
  const realRadiusKm = (moon.radius * 4875).toFixed(0)
  const realOrbitKm = ((moon.orbitRadius * 192000) / 1000).toFixed(0)

  const stats = [
    { label: 'Loại', value: moon.type === 'rocky' ? 'ĐÁ' : 'BĂNG' },
    { label: 'Bán Kính', value: `${realRadiusKm} km` },
    { label: 'Bán Kính Quỹ Đạo', value: `${realOrbitKm} nghìn km` },
    { label: 'Hành Tinh Mẹ', value: planet.name.toUpperCase(), link: `/planets/${planet.id}` },
    {
      label: 'Vị Trí',
      value: `${siblings.findIndex((m) => m.id === moon.id) + 1} / ${siblings.length}`,
    },
    {
      label: 'Tốc Độ Quỹ Đạo',
      value: `${(moon.speed * 100).toFixed(0)} đv`,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
      {stats.map((s, i) => (
        <ScrollReveal key={s.label} delay={i * 0.05}>
          <div className="glass rounded-2xl p-5">
            <p className="font-mono text-[9px] tracking-[0.25em] text-[#4a4a5a] uppercase">
              {s.label}
            </p>
            {s.link ? (
              <Link
                to={s.link}
                className="mt-2 block font-heading text-2xl tracking-[0.1em] text-[#00D4FF] hover:underline"
              >
                {s.value}
              </Link>
            ) : (
              <p className="mt-2 font-heading text-2xl tracking-[0.1em] text-white">
                {s.value}
              </p>
            )}
          </div>
        </ScrollReveal>
      ))}
    </div>
  )
}