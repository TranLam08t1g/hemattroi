/* eslint-disable react-hooks/immutability */
import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { MoonData } from '../../data/moons'
import { moonVertexShader, moonFragmentShader } from '../../shaders/moon'

interface MoonProps {
  data: MoonData
}

function createProceduralMoonTexture(data: MoonData) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const base = data.type === 'rocky' ? '#888888' : '#c8d8e8'
  ctx.fillStyle = base
  ctx.fillRect(0, 0, size, size)

  for (let i = 0; i < 300; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const r = Math.random() * 3 + 0.5
    const dark = data.type === 'rocky' ? 0 : 0.25
    const a = Math.random() * 0.35 + dark
    const gray = Math.floor(80 + Math.random() * 80)
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${gray},${gray},${gray},${a})`
    ctx.fill()
  }

  if (data.type === 'ice') {
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      ctx.beginPath()
      ctx.arc(x, y, Math.random() * 6 + 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(220,240,255,${Math.random() * 0.3})`
      ctx.fill()
    }
  }

  return new THREE.CanvasTexture(canvas)
}

export function Moon({ data }: MoonProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const angleRef = useRef(data.startAngle)
  const [texture, setTexture] = useState<THREE.Texture>(() =>
    createProceduralMoonTexture(data),
  )

  const wireframeGeo = useMemo(
    () =>
      new THREE.EdgesGeometry(
        new THREE.SphereGeometry(data.radius * 1.02, 24, 24),
      ),
    [data.radius],
  )

  const typeVal = data.type === 'rocky' ? 0 : 1
  const intensity = data.type === 'rocky' ? 0.35 : 0.25

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uColor: { value: new THREE.Color(data.hexColor) },
      uTime: { value: 0 },
      uMoonType: { value: typeVal },
      uEffectIntensity: { value: intensity },
    }),
    [texture, data.hexColor, typeVal, intensity],
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
    if (!groupRef.current) return

    angleRef.current += data.speed * delta
    groupRef.current.position.x =
      Math.cos(angleRef.current) * data.orbitRadius
    groupRef.current.position.z =
      Math.sin(angleRef.current) * data.orbitRadius
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * data.speed * 3
    }
    uniforms.uTime.value += delta
  })

  const wireColor = data.type === 'ice' ? 0xaaccdd : 0x888888

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[data.radius, 32, 32]} />
        <shaderMaterial
          vertexShader={moonVertexShader}
          fragmentShader={moonFragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      <lineSegments geometry={wireframeGeo}>
        <lineBasicMaterial
          color={wireColor}
          transparent
          opacity={0.15}
          depthTest
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}