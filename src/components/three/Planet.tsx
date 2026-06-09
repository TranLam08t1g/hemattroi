/* eslint-disable react-hooks/immutability */
import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import type { PlanetData } from '../../data/planets'
import { planetVertexShader, planetFragmentShader } from '../../shaders/planet'
import { MoonOrbitPath } from './MoonOrbitPath'
import { useSceneStore } from '../../store/sceneStore'

interface PlanetProps {
  data: PlanetData
  moonOrbitRadii?: number[]
  children?: React.ReactNode
  registerRef?: (el: THREE.Group | null) => void
}

const DEFAULT_WHITE = (() => {
  const c = document.createElement('canvas')
  c.width = c.height = 2
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 2, 2)
  return new THREE.CanvasTexture(c)
})()

function getPlanetType(id: string): number {
  switch (id) {
    case 'earth':   return 1
    case 'venus':
    case 'jupiter':
    case 'saturn':  return 2
    case 'uranus':
    case 'neptune': return 3
    default:        return 0
  }
}

function getPlanetParams(id: string) {
  switch (id) {
    case 'mercury': return { intensity: 0.35, animX: 0.015, animY: 0.01 }
    case 'venus':   return { intensity: 0.40, animX: 0.04,  animY: 0.06 }
    case 'earth':   return { intensity: 0.30, animX: 0.02,  animY: 0.01 }
    case 'mars':    return { intensity: 0.30, animX: 0.02,  animY: 0.015 }
    case 'jupiter': return { intensity: 0.45, animX: 0.06,  animY: 0.08 }
    case 'saturn':  return { intensity: 0.35, animX: 0.04,  animY: 0.05 }
    case 'uranus':  return { intensity: 0.20, animX: 0.02,  animY: 0.01 }
    case 'neptune': return { intensity: 0.25, animX: 0.025, animY: 0.015 }
    default:        return { intensity: 0.30, animX: 0.02,  animY: 0.01 }
  }
}

export function Planet({ data, moonOrbitRadii, children, registerRef }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const angleRef = useRef(data.startAngle)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  const activeTexture = texture ?? DEFAULT_WHITE
  const typeVal = getPlanetType(data.id)
  const params = getPlanetParams(data.id)
  const tiltRad = (data.tilt * Math.PI) / 180
  const focusPlanet = useSceneStore((s) => s.focusPlanet)
  const setFocusPlanet = useSceneStore((s) => s.setFocusPlanet)

  const handleLabelClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      setFocusPlanet(focusPlanet === data.id ? null : data.id)
    },
    [setFocusPlanet, focusPlanet, data.id],
  )

  useEffect(() => {
    registerRef?.(groupRef.current)
    return () => registerRef?.(null)
  }, [registerRef])

  const uniforms = useMemo(
    () => ({
      uTexture: { value: activeTexture },
      uPlanetColor: { value: new THREE.Color(data.hexColor) },
      uTime: { value: 0 },
      uEffectIntensity: { value: params.intensity },
      uAnimSpeed: { value: new THREE.Vector2(params.animX, params.animY) },
      uPlanetType: { value: typeVal },
    }),
    [activeTexture, data.hexColor, typeVal, params],
  )

  useEffect(() => {
    const BASE = import.meta.env.BASE_URL || '/'
    const loader = new THREE.TextureLoader()
    loader.load(
      `${BASE}textures/4k_${data.id}.jpg`,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        setTexture(tex)
      },
      undefined,
      () => {
        loader.load(
          `${BASE}textures/2k_${data.id}.jpg`,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace
            setTexture(tex)
          },
          undefined,
          () => {},
        )
      },
    )
  }, [data.id])

  useFrame((_, delta) => {
    angleRef.current += data.speed * delta * 0.8
    if (groupRef.current) {
      const fp = useSceneStore.getState().focusPlanet
      if (!fp) {
        groupRef.current.position.x = Math.cos(angleRef.current) * data.orbit
        groupRef.current.position.z = Math.sin(angleRef.current) * data.orbit
      }
    }
    if (meshRef.current) {
      if (!useSceneStore.getState().focusPlanet) {
        meshRef.current.rotation.y += delta * data.speed * 2
      }
    }
    uniforms.uTime.value += delta
  })

  return (
    <group ref={groupRef}>
      <Html position={[0, data.radius * 1.6, 0]} center style={{ pointerEvents: 'auto' }}>
        <button
          onClick={handleLabelClick}
          className={`whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase transition-all duration-300 ${
            focusPlanet === data.id
              ? 'border-[rgba(0,212,255,0.5)] bg-[rgba(0,212,255,0.12)] text-[#00D4FF]'
              : 'border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.25)] text-[#6a6a7a] hover:border-[rgba(255,255,255,0.2)] hover:text-white'
          }`}
        >
          {data.name.toUpperCase()}
        </button>
      </Html>
      <group rotation={[0, 0, tiltRad]}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[data.radius, 64, 64]} />
          <shaderMaterial
            vertexShader={planetVertexShader}
            fragmentShader={planetFragmentShader}
            uniforms={uniforms}
          />
        </mesh>
        {data.hasRing && (
          <mesh ref={ringRef} rotation={[Math.PI * 0.5, 0, 0.3]}>
            <ringGeometry args={[data.radius * 1.3, data.radius * 2.2, 64]} />
            <meshBasicMaterial
              color={0xead6b8}
              side={THREE.DoubleSide}
              transparent
              opacity={0.3}
              depthWrite={false}
            />
          </mesh>
        )}
        {moonOrbitRadii?.map((r, i) => (
          <MoonOrbitPath key={i} radius={r} />
        ))}
        {children}
      </group>
    </group>
  )
}