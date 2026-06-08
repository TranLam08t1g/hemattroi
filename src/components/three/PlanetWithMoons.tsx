import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Planet3D } from './Planet3D'
import { MoonOrbitPath } from './MoonOrbitPath'
import { getMoonsForPlanet } from '../../data/moons'

interface PlanetWithMoonsProps {
  planetId: string
  hexColor: number
  radius: number
  segments?: number
}

function OrbitingMoon({
  moon,
}: {
  moon: ReturnType<typeof getMoonsForPlanet>[number]
}) {
  const groupRef = useRef<THREE.Group>(null)
  const angleRef = useRef(moon.startAngle)

  const moonSize = Math.max(0.035, moon.radius * 0.35)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    angleRef.current += moon.speed * delta * 0.6
    groupRef.current.position.x = Math.cos(angleRef.current) * moon.orbitRadius
    groupRef.current.position.z = Math.sin(angleRef.current) * moon.orbitRadius
    groupRef.current.position.y = Math.sin(angleRef.current * 0.3) * 0.06
    groupRef.current.rotation.y += delta * 0.8
  })

  return (
    <>
      <MoonOrbitPath radius={moon.orbitRadius} color={moon.hexColor} />
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[moonSize, 12, 12]} />
          <meshStandardMaterial
            color={moon.color}
            emissive={moon.color}
            emissiveIntensity={0.3}
            roughness={0.6}
          />
        </mesh>
      </group>
    </>
  )
}

export function PlanetWithMoons({
  planetId,
  hexColor,
  radius,
  segments = 32,
}: PlanetWithMoonsProps) {
  const moons = getMoonsForPlanet(planetId)

  return (
    <group>
      <Planet3D
        planetId={planetId}
        hexColor={hexColor}
        radius={radius}
        segments={segments}
      />
      {moons.map((moon) => (
        <OrbitingMoon key={moon.id} moon={moon} />
      ))}
    </group>
  )
}