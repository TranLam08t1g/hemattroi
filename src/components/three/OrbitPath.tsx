import { useMemo } from 'react'
import * as THREE from 'three'
import { useSceneStore } from '../../store/sceneStore'

interface OrbitPathProps {
  radius: number
  color?: number
}

export function OrbitPath({ radius, color = 0x00D4FF }: OrbitPathProps) {
  const showOrbits = useSceneStore((s) => s.showOrbits)

  const line = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    const mat = new THREE.LineDashedMaterial({
      color,
      dashSize: 0.25,
      gapSize: 0.4,
      transparent: true,
      opacity: 0.18,
      depthTest: true,
      depthWrite: false,
    })
    const l = new THREE.Line(geo, mat)
    l.computeLineDistances()
    return l
  }, [radius, color])

  if (!showOrbits) return null

  return <primitive object={line} />
}