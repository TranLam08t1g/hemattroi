import { Canvas } from '@react-three/fiber'
import { useSceneStore } from '../../store/sceneStore'
import { SolarSystem } from './SolarSystem'

export function SceneSetup() {
  const setDragging = useSceneStore((s) => s.setIsDragging)

  return (
    <Canvas
      camera={{ position: [0, 5, 20], fov: 50, near: 0.1, far: 1000 }}
      gl={{ antialias: true, toneMapping: 3, toneMappingExposure: 1.2 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}
      onPointerDown={() => setDragging(true)}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <ambientLight intensity={0.35} color="#222244" />
      <pointLight position={[0, 0, 0]} intensity={1.8} distance={50} color="#FF6B00" />
      <SolarSystem />
    </Canvas>
  )
}
