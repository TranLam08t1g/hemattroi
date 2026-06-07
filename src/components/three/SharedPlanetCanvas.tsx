import type { ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

interface SharedPlanetCanvasProps {
  children: ReactNode
}

export function SharedPlanetCanvas({ children }: SharedPlanetCanvasProps) {
  return (
    <Canvas
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      frameloop="always"
      onCreated={({ gl }) =>
        gl.setClearColor(new THREE.Color('#0B0B10'), 0)
      }
    >
      {children}
    </Canvas>
  )
}