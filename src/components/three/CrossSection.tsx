import { useMemo } from 'react'
import * as THREE from 'three'
import { COMPOSITION } from '../../data/compositions'

interface CrossSectionProps {
  planetId: string
  radius: number
}

export function CrossSection({ planetId, radius }: CrossSectionProps) {
  const layers = COMPOSITION[planetId] ?? []

  const rings = useMemo(() => {
    if (layers.length === 0) return []

    let accRadius = 0
    return layers.map((layer) => {
      const outerR = radius * Math.sqrt((accRadius + layer.pct) / 100)
      accRadius += layer.pct
      return { ...layer, outerRadius: outerR }
    })
  }, [layers, radius])

  return (
    <group rotation={[0, Math.PI / 4, 0]} position={[0, 0, 0]}>
      {rings.map((ring, i) => {
        const innerR = i === 0 ? 0 : rings[i - 1].outerRadius
        return (
          <mesh key={ring.label}>
            <ringGeometry args={[innerR, ring.outerRadius, 64]} />
            <meshBasicMaterial
              color={ring.color}
              side={THREE.DoubleSide}
              transparent
              opacity={0.9}
              depthWrite={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}