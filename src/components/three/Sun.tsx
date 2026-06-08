import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { planetVertexShader, planetFragmentShader } from '../../shaders/planet'
import { DEFAULT_WHITE, getPlanetType, getPlanetParams } from '../../utils/planetHelpers'

const SUN_COLOR = 0xffa500
const SUN_ID = 'sun'

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  const activeTexture = texture ?? DEFAULT_WHITE
  const typeVal = getPlanetType(SUN_ID)
  const params = getPlanetParams(SUN_ID)

  const uniforms = useMemo(
    () => ({
      uTexture: { value: activeTexture },
      uPlanetColor: { value: new THREE.Color(SUN_COLOR) },
      uTime: { value: 0 },
      uEffectIntensity: { value: params.intensity },
      uAnimSpeed: { value: new THREE.Vector2(params.animX, params.animY) },
      uPlanetType: { value: typeVal },
    }),
    [activeTexture, typeVal, params],
  )

  const wireframeGeo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.SphereGeometry(2.4 * 1.008, 32, 24)),
    [],
  )

  useEffect(() => {
    const BASE = import.meta.env.BASE_URL || '/'
    const loader = new THREE.TextureLoader()
    loader.load(
      `${BASE}textures/4k_sun.jpg`,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        setTexture(tex)
      },
      undefined,
      () => {
        loader.load(
          `${BASE}textures/2k_sun.jpg`,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace
            setTexture(tex)
          },
          undefined,
          () => {},
        )
      },
    )
  }, [])

  useFrame((_, delta) => {
    if (meshRef.current) {
      uniforms.uTime.value += delta
      meshRef.current.rotation.y += delta * 0.15
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.4, 64, 64]} />
        <shaderMaterial
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      <lineSegments geometry={wireframeGeo}>
        <lineBasicMaterial
          color={0xffd700}
          transparent
          opacity={0.08}
          depthTest
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}