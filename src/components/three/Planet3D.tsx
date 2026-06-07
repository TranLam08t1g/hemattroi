/* eslint-disable react-hooks/immutability */
import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { planetVertexShader, planetFragmentShader } from '../../shaders/planet'
import { DEFAULT_WHITE, getPlanetType, getPlanetParams } from '../../utils/planetHelpers'

interface Planet3DProps {
  planetId: string
  hexColor: number
  radius: number
  segments?: number
}

export function Planet3D({
  planetId,
  hexColor,
  radius,
  segments = 32,
}: Planet3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  const activeTexture = texture ?? DEFAULT_WHITE
  const typeVal = useMemo(() => getPlanetType(planetId), [planetId])
  const params = useMemo(() => getPlanetParams(planetId), [planetId])

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
    () =>
      new THREE.EdgesGeometry(
        new THREE.SphereGeometry(radius * 1.008, 24, 16),
      ),
    [radius],
  )

  useEffect(() => {
    let mounted = true
    const loader = new THREE.TextureLoader()
    loader.load(
      `/textures/2k_${planetId}.jpg`,
      (tex) => {
        if (!mounted) return
        tex.colorSpace = THREE.SRGBColorSpace
        setTexture(tex)
      },
      undefined,
      () => {},
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
        <sphereGeometry args={[radius, segments, segments]} />
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
          opacity={0.2}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}