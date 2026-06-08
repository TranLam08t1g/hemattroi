/* eslint-disable react-hooks/immutability */
import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { planetVertexShader, planetFragmentShader } from '../../shaders/planet'
import { DEFAULT_WHITE, getPlanetType, getPlanetParams } from '../../utils/planetHelpers'
import { CrossSection } from './CrossSection'

interface Planet3DProps {
  planetId: string
  hexColor: number
  radius: number
  segments?: number
  cutaway?: boolean
}

export function Planet3D({
  planetId,
  hexColor,
  radius,
  segments = 32,
  cutaway = false,
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
      uClipEnabled: { value: 0 },
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
    uniforms.uClipEnabled.value = cutaway ? 1 : 0
  }, [cutaway, uniforms])

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
        <sphereGeometry args={[radius, segments, segments]} />
        <shaderMaterial
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      {cutaway && (
        <>
          <lineSegments geometry={wireframeGeo}>
            <lineBasicMaterial
              color={hexColor}
              transparent
              opacity={0.25}
              depthTest
              depthWrite={false}
            />
          </lineSegments>
          <CrossSection planetId={planetId} radius={radius} />
        </>
      )}
    </group>
  )
}