/* eslint-disable react-hooks/immutability */
import { useState, useRef, useMemo, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PLANETS } from '../data/planets'
import { getMoonsForPlanet } from '../data/moons'
import { getMissions } from '../data/missions'
import { CinemaIntro } from '../components/ui/CinemaIntro'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { planetVertexShader, planetFragmentShader } from '../shaders/planet'
import { DEFAULT_WHITE, getPlanetType, getPlanetParams, TYPE_DISPLAY, STATUS_VI } from '../utils/planetHelpers'
import { COMPOSITION } from '../data/compositions'
import { Planet3D } from '../components/three/Planet3D'

type Tab = 'overview' | 'profile' | 'moons' | 'missions'

const TABS: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Tổng Quan' },
  { key: 'profile', label: 'Hồ Sơ' },
  { key: 'moons', label: 'Vệ Tinh' },
  { key: 'missions', label: 'Sứ Mệnh' },
]

interface HeroPlanet3DProps {
  planetId: string
  hexColor: number
  radius: number
}

function OrbitLine({ radius, color = 0x00d4ff }: { radius: number; color?: number }) {
  const line = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const segments = 64
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    const mat = new THREE.LineDashedMaterial({
      color,
      dashSize: 0.12,
      gapSize: 0.18,
      transparent: true,
      opacity: 0.22,
      depthTest: true,
      depthWrite: false,
    })
    const l = new THREE.Line(geo, mat)
    l.computeLineDistances()
    return l
  }, [radius, color])

  return <primitive object={line} />
}

function OrbitingMoonMesh({
  moon,
  orbitRadius,
  moonSize,
}: {
  moon: ReturnType<typeof getMoonsForPlanet>[number]
  orbitRadius: number
  moonSize: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const angleRef = useRef(moon.startAngle)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    angleRef.current += moon.speed * delta * 0.5
    groupRef.current.position.x = Math.cos(angleRef.current) * orbitRadius
    groupRef.current.position.z = Math.sin(angleRef.current) * orbitRadius
    groupRef.current.position.y = Math.sin(angleRef.current * 0.25) * 0.04
    groupRef.current.rotation.y += delta * 0.6
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[moonSize, 10, 10]} />
        <meshStandardMaterial
          color={moon.color}
          emissive={moon.color}
          emissiveIntensity={0.25}
          roughness={0.6}
        />
      </mesh>
    </group>
  )
}

function HeroPlanet3D({ planetId, hexColor, radius }: HeroPlanet3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const activeTexture = texture ?? DEFAULT_WHITE
  const typeVal = useMemo(() => getPlanetType(planetId), [planetId])
  const params = useMemo(() => getPlanetParams(planetId), [planetId])

  const planet = PLANETS.find((p) => p.id === planetId)
  const moons = planet ? getMoonsForPlanet(planet.id) : []
  const dataRadius = planet ? planet.radius : 1

  const uniforms = useMemo(
    () => ({
      uTexture: { value: activeTexture },
      uPlanetColor: { value: new THREE.Color(hexColor) },
      uTime: { value: 0 },
      uEffectIntensity: { value: params.intensity },
      uAnimSpeed: { value: new THREE.Vector2(params.animX, params.animY) },
      uPlanetType: { value: typeVal },
    }),
    [activeTexture, hexColor, typeVal, params],
  )

  const wireframeGeo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.SphereGeometry(radius * 1.008, 32, 24)),
    [radius],
  )

  useEffect(() => {
    let mounted = true
    const BASE = import.meta.env.BASE_URL || '/'
    const loader = new THREE.TextureLoader()
    loader.load(
      `${BASE}textures/4k_${planetId}.jpg`,
      (tex) => {
        if (!mounted) return
        tex.colorSpace = THREE.SRGBColorSpace
        setTexture(tex)
      },
      undefined,
      () => {
        if (!mounted) return
        loader.load(
          `${BASE}textures/2k_${planetId}.jpg`,
          (tex) => {
            if (!mounted) return
            tex.colorSpace = THREE.SRGBColorSpace
            setTexture(tex)
          },
          undefined,
          () => {},
        )
      },
    )
    return () => {
      mounted = false
    }
  }, [planetId])

  useFrame((_, delta) => {
    if (meshRef.current) {
      uniforms.uTime.value += delta
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      <lineSegments geometry={wireframeGeo}>
        <lineBasicMaterial
          color={hexColor}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </lineSegments>
      {moons.map((moon) => {
        const scaledOrbit = moon.orbitRadius * (radius / dataRadius)
        const scaledSize = Math.max(0.04, moon.radius * (radius / dataRadius) * 0.2)
        return (
          <group key={moon.id}>
            <OrbitLine radius={scaledOrbit} color={moon.hexColor} />
            <OrbitingMoonMesh moon={moon} orbitRadius={scaledOrbit} moonSize={scaledSize} />
          </group>
        )
      })}
    </group>
  )
}

export function PlanetDetail() {
  const { slug } = useParams<{ slug: string }>()
  const planet = PLANETS.find((p) => p.id === slug)
  const [tab, setTab] = useState<Tab>('overview')

  if (!planet) {
    return (
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl text-white">Không Tìm Thấy Hành Tinh</h1>
          <Link
            to="/planets"
            className="mt-4 inline-block font-heading text-sm tracking-[0.2em] text-[#00D4FF] underline"
          >
            Quay Lại Danh Sách Hành Tinh
          </Link>
        </div>
      </div>
    )
  }

  const moons = getMoonsForPlanet(planet.id)
  const missions = getMissions(planet.id)
  const composition = COMPOSITION[planet.id] ?? []

  return (
    <>
      <Helmet>
        <title>Hành Trình Hệ Mặt Trời &ndash; {planet.name}</title>
        <meta name="description" content={planet.description} />
      </Helmet>

      <CinemaIntro duration={1.4} />

      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden bg-[#0B0B10]">
        {/* Planet glow */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${planet.color}33, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />

        {/* 3D Canvas — direct, no wrapper chain */}
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
            <HeroPlanet3D
              planetId={planet.id}
              hexColor={planet.hexColor}
              radius={1.2}
            />
          </Canvas>
        </div>

        {/* Gradient overlay bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-1/2 bg-gradient-to-t from-[#0B0B10] to-transparent" />

        {/* Text content */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-14 md:px-12 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <Link
              to="/planets"
              className="inline-block font-mono text-[10px] tracking-[0.3em] text-[#4a4a5a] transition-colors hover:text-white uppercase"
            >
              &larr; Tất cả hành tinh
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="mt-4 font-heading text-[clamp(48px,10vw,140px)] font-bold leading-[0.9] tracking-[0.08em] text-white"
            >
              {planet.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="mt-4 max-w-2xl font-heading text-sm leading-relaxed tracking-[0.15em] text-[#a0a0b0]"
            >
              {planet.description}
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
                  backgroundColor: planet.color,
                  boxShadow: `0 0 12px ${planet.color}`,
                }}
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#4a4a5a] uppercase">
                {TYPE_DISPLAY[planet.type]} &middot; {planet.distanceFromSun}
              </span>
            </motion.div>
          </div>
        </div>

        {/* SCROLL indicator */}
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
                <OverviewTab planet={planet} composition={composition} />
              )}
              {tab === 'profile' && <ProfileTab planet={planet} />}
              {tab === 'moons' && <MoonsTab moons={moons} planetId={planet.id} />}
              {tab === 'missions' && <MissionsTab missions={missions} />}
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
            &larr; Tiếp tục khám phá hệ Mặt Trời
          </Link>
        </div>
      </section>
    </>
  )
}

function OverviewTab({
  planet,
  composition,
}: {
  planet: (typeof PLANETS)[number]
  composition: { label: string; pct: number }[]
}) {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <h2 className="font-heading text-xs tracking-[0.3em] uppercase text-[#00D4FF]">
          Về {planet.name}
        </h2>
        <p className="mt-4 font-heading text-base leading-relaxed tracking-[0.05em] text-white">
          {planet.description}
        </p>
        <blockquote className="mt-6 border-l-2 border-[#00D4FF] pl-4 font-mono text-xs italic tracking-[0.1em] text-[#a0a0b0]">
          &ldquo;{planet.funFact}&rdquo;
        </blockquote>
      </div>

      <div>
        <h2 className="font-heading text-xs tracking-[0.3em] uppercase text-[#00D4FF]">
          Thành Phần
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
                  style={{ backgroundColor: planet.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProfileTab({ planet }: { planet: (typeof PLANETS)[number] }) {
  const stats = [
    { label: 'Loại', value: TYPE_DISPLAY[planet.type]?.toUpperCase() ?? planet.type.toUpperCase() },
    { label: 'KC Mặt Trời', value: planet.distanceFromSun },
    { label: 'Chu Kỳ Quỹ Đạo', value: planet.orbitalPeriod },
    { label: 'Vệ Tinh', value: String(planet.numberOfMoons) },
    { label: 'Bán Kính', value: `${planet.radius} Eq` },
    { label: 'Độ Nghiêng', value: `${planet.tilt}°` },
  ]

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
      {stats.map((s, i) => (
        <ScrollReveal key={s.label} delay={i * 0.05}>
          <div className="glass rounded-2xl p-5">
            <p className="font-mono text-[9px] tracking-[0.25em] text-[#4a4a5a] uppercase">
              {s.label}
            </p>
            <p className="mt-2 font-heading text-2xl tracking-[0.1em] text-white">
              {s.value}
            </p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  )
}

function MoonsTab({ moons, planetId }: { moons: ReturnType<typeof getMoonsForPlanet>; planetId: string }) {
  if (moons.length === 0) {
    return (
      <div className="text-center font-mono text-[11px] tracking-[0.2em] text-[#4a4a5a]">
        KHÔNG CÓ VỆ TINH ĐÃ BIẾT
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {moons.map((moon, i) => (
        <ScrollReveal key={moon.id} delay={i * 0.06}>
          <Link to={`/planets/${planetId}/moons/${moon.id}`}>
            <div className="glass flex items-center gap-4 rounded-2xl p-4 transition-colors hover:border-[rgba(0,212,255,0.25)]">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                <Canvas
                  camera={{ position: [0, 0, 2.5], fov: 45, near: 0.1, far: 100 }}
                  gl={{ antialias: true }}
                  style={{ width: '100%', height: '100%', display: 'block' }}
                >
                  <ambientLight intensity={0.4} color="#ffffff" />
                  <directionalLight position={[3, 2, 3]} intensity={1.0} color="#ffffff" />
                  <Planet3D
                    planetId={moon.id}
                    hexColor={moon.hexColor}
                    radius={0.5}
                    segments={24}
                  />
                </Canvas>
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-base tracking-[0.15em] text-white">
                  {moon.name}
                </h3>
                <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-[#4a4a5a] uppercase">
                  {moon.type in TYPE_DISPLAY ? TYPE_DISPLAY[moon.type] : moon.type} &middot; quỹ đạo {moon.orbitRadius} đv
                </p>
              </div>
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: moon.color }}
              />
            </div>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  )
}

function MissionsTab({ missions }: { missions: ReturnType<typeof getMissions> }) {
  if (missions.length === 0) {
    return (
      <div className="text-center font-mono text-[11px] tracking-[0.2em] text-[#4a4a5a]">
        KHÔNG CÓ DỮ LIỆU SỨ MỆNH
      </div>
    )
  }
  return (
    <div className="relative">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[rgba(0,212,255,0.15)]" />
      <div className="space-y-6">
        {missions.map((m, i) => {
          const color =
            m.status === 'current'
              ? '#00D4FF'
              : m.status === 'future'
                ? '#c88b5a'
                : '#4a4a5a'
          return (
            <ScrollReveal key={`${m.year}-${i}`} delay={i * 0.08} x={-20}>
              <div className="relative flex gap-6 pl-2">
                <div
                  className="relative z-10 mt-2 h-3.5 w-3.5 shrink-0 rounded-full mission-dot"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 border-l border-[rgba(255,255,255,0.06)] pb-2 pl-4">
                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-mono text-[10px] tracking-[0.2em] uppercase"
                      style={{ color }}
                    >
                      {m.year}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.25em] text-[#4a4a5a] uppercase">
                      {m.status in STATUS_VI ? STATUS_VI[m.status] : m.status}
                    </span>
                  </div>
                  <h3 className="mt-1 font-heading text-lg tracking-[0.1em] text-white">
                    {m.title}
                  </h3>
                  <p className="mt-1 font-heading text-xs leading-relaxed tracking-[0.05em] text-[#a0a0b0]">
                    {m.detail}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </div>
  )
}