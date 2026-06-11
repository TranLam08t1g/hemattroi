import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
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
  const planetGroupRefs = useRef<Record<string, THREE.Group | null>>({})
  const { camera } = useThree()
  const rotY = useSceneStore((s) => s.rotationY)
  const rotX = useSceneStore((s) => s.rotationX)
  const isDragging = useSceneStore((s) => s.isDragging)
  const focusPlanet = useSceneStore((s) => s.focusPlanet)
  const zoomDistance = useSceneStore((s) => s.zoomDistance)
  const setRotY = useSceneStore((s) => s.setRotationY)
  const setRotX = useSceneStore((s) => s.setRotationX)
  const prevMouse = useRef({ x: 0, y: 0 })
  const pos = useMousePosition()
  const camTarget = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((_, delta) => {
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

    if (focusPlanet) {
      const targetGroup = planetGroupRefs.current[focusPlanet]
      if (targetGroup) {
        const worldPos = new THREE.Vector3()
        targetGroup.getWorldPosition(worldPos)
        camTarget.current.lerp(worldPos, 0.06)
      }
      camera.position.copy(
        new THREE.Vector3(
          camTarget.current.x + 5 * (zoomDistance / 20),
          camTarget.current.y + 3 * (zoomDistance / 20),
          camTarget.current.z + 8 * (zoomDistance / 20),
        ),
      )
      camera.lookAt(camTarget.current)
    } else {
      const defaultPos = new THREE.Vector3(0, 0, 0)
      camTarget.current.lerp(defaultPos, 0.06)
      camera.position.lerp(
        new THREE.Vector3(0, 5 * (zoomDistance / 20), zoomDistance),
        delta * 1.5,
      )
      camera.lookAt(0, 0, 0)
      groupRef.current.position.x += (pos.normX * 0.25 - groupRef.current.position.x) * 0.015
      groupRef.current.position.y += (pos.normY * 0.25 - groupRef.current.position.y) * 0.015
    }
  })

  return (
    <group ref={groupRef}>
      <Starfield />
      <Sun />
      {PLANETS.map((p) => {
        const moons = getMoonsForPlanet(p.id)
        const inclRad = (p.tilt * Math.PI) / 180
        return (
          <group key={p.id}>
            <OrbitPath radius={p.orbit} />
            <group rotation={[0, inclRad, 0]}>
                <Planet
                  data={p}
                  registerRef={(el) => { planetGroupRefs.current[p.id] = el }}
                  moonOrbitRadii={moons.map((m) => m.orbitRadius)}
                >
                  {moons.map((m) => (
                    <Moon key={m.id} data={m} />
                  ))}
                </Planet>
            </group>
          </group>
        )
      })}
    </group>
  )
}