import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore } from '../../store/sceneStore'
import { PLANETS } from '../../data/planets'
import { getMoonsForPlanet } from '../../data/moons'
import { Sun } from './Sun'
import { Planet } from './Planet'
import { OrbitPath } from './OrbitPath'
import { Moon } from './Moon'
import { Starfield } from './Starfield'
import { useMousePosition } from '../../hooks/useMousePosition'

export function SolarSystem() {
  const groupRef = useRef<THREE.Group>(null)
  const rotY = useSceneStore((s) => s.rotationY)
  const rotX = useSceneStore((s) => s.rotationX)
  const isDragging = useSceneStore((s) => s.isDragging)
  const setRotY = useSceneStore((s) => s.setRotationY)
  const setRotX = useSceneStore((s) => s.setRotationX)
  const prevMouse = useRef({ x: 0, y: 0 })
  const pos = useMousePosition()

  useFrame(() => {
    if (!groupRef.current) return

    if (isDragging) {
      const dx = pos.x - prevMouse.current.x
      const dy = pos.y - prevMouse.current.y
      setRotY(rotY + dx * 0.005)
      setRotX(rotX + dy * 0.005)
    }
    prevMouse.current = { x: pos.x, y: pos.y }

    groupRef.current.rotation.y += (rotY - groupRef.current.rotation.y) * 0.04
    groupRef.current.rotation.x += (rotX - groupRef.current.rotation.x) * 0.04

    groupRef.current.position.x += (pos.normX * 0.25 - groupRef.current.position.x) * 0.015
    groupRef.current.position.y += (pos.normY * 0.25 - groupRef.current.position.y) * 0.015
  })

  return (
    <group ref={groupRef}>
      <Starfield />
      <Sun />
      {PLANETS.map((p) => {
        const moons = getMoonsForPlanet(p.id)
        return (
          <group key={p.id}>
            <OrbitPath radius={p.orbit} />
            <Planet
              data={p}
              moonOrbitRadii={moons.map((m) => m.orbitRadius)}
            >
              {moons.map((m) => (
                <Moon key={m.id} data={m} />
              ))}
            </Planet>
          </group>
        )
      })}
    </group>
  )
}