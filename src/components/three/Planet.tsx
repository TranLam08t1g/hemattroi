/* eslint-disable react-hooks/immutability */
import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlanetData } from '../../data/planets'
import { planetVertexShader, planetFragmentShader } from '../../shaders/planet'
import { MoonOrbitPath } from './MoonOrbitPath'

interface PlanetProps {
  data: PlanetData
  moonOrbitRadii?: number[]
  children?: React.ReactNode
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

export function Planet({ data, moonOrbitRadii, children }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const angleRef = useRef(data.startAngle)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  const activeTexture = texture ?? DEFAULT_WHITE
  const typeVal = getPlanetType(data.id)
  const params = getPlanetParams(data.id)

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

  const wireframeGeo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.SphereGeometry(data.radius * 1.008, 48, 48)),
    [data.radius],
  )

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    const BASE = import.meta.env.BASE_URL || '/'
    loader.load(
      `${BASE}textures/2k_${data.id}.jpg`,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        setTexture(tex)
      },
      undefined,
      () => {},
    )
  }, [data.id])

  useFrame((_, delta) => {
    angleRef.current += data.speed * delta * 0.8
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angleRef.current) * data.orbit
      groupRef.current.position.z = Math.sin(angleRef.current) * data.orbit
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * data.speed * 2
    }
    uniforms.uTime.value += delta
  })

  const wireColor = data.type === 'ice'
    ? 0xaaccdd
    : data.type === 'gas'
      ? 0xccaa88
      : data.hexColor

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[data.radius, 64, 64]} />
        <shaderMaterial
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      <lineSegments geometry={wireframeGeo}>
        <lineBasicMaterial
          color={wireColor}
          transparent
          opacity={0.18}
          depthTest
          depthWrite={false}
        />
      </lineSegments>
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
  )
}