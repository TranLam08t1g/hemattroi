/* eslint-disable react-hooks/immutability */
import { useRef, useEffect, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMousePosition } from '../../hooks/useMousePosition'
import { sunVertexShader, sunFragmentShader } from '../../shaders/sun'

function makeFallbackTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(512, 256, 10, 512, 256, 530)
  grad.addColorStop(0, '#FFFDE0')
  grad.addColorStop(0.08, '#FFE060')
  grad.addColorStop(0.22, '#FFA010')
  grad.addColorStop(0.45, '#E05000')
  grad.addColorStop(0.75, '#601000')
  grad.addColorStop(1, '#0a0000')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1024, 512)
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 1024
    const y = Math.random() * 512
    ctx.beginPath()
    ctx.arc(x, y, Math.random() * 4 + 0.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,${140 + Math.random() * 60},${Math.random() * 40},${Math.random() * 0.35})`
    ctx.fill()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const FALLBACK_TEX = makeFallbackTexture()
const CORONA_PERIOD_S = 8

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Sprite>(null)
  const colorRef = useRef(new THREE.Color(0xff6b00))
  const targetColor = useRef(new THREE.Color(0xff6b00))
  const pos = useMousePosition()
  const [videoTex, setVideoTex] = useState<THREE.VideoTexture | null>(null)

  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    grad.addColorStop(0, 'rgba(255,140,0,1)')
    grad.addColorStop(0.08, 'rgba(255,100,0,0.7)')
    grad.addColorStop(0.25, 'rgba(255,60,0,0.25)')
    grad.addColorStop(0.5, 'rgba(200,30,0,0.06)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 512)
    return new THREE.CanvasTexture(canvas)
  }, [])

  const activeTex = videoTex ?? FALLBACK_TEX

  const uniforms = useMemo(
    () => ({
      uTexture: { value: activeTex as THREE.Texture },
      uColor: { value: new THREE.Color('#FF6B00') },
      uRimHot: { value: new THREE.Color('#FFD700') },
      uRimCool: { value: new THREE.Color('#FF4500') },
      uCMEIntensity: { value: 0.6 },
      uTime: { value: 0 },
      uCoronaPhase: { value: 0 },
    }),
    [activeTex],
  )

  useEffect(() => {
    const BASE = import.meta.env.BASE_URL || '/'
    const video = document.createElement('video')
    video.src = `${BASE}textures/sun-procedural.mp4`
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'
    video.preload = 'auto'
    video.style.display = 'none'
    document.body.appendChild(video)

    const startOnTap = () => {
      video.play().catch(() => {})
    }

    const onLoaded = () => {
      const tex = new THREE.VideoTexture(video)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.wrapS = THREE.RepeatWrapping
      tex.wrapT = THREE.RepeatWrapping
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      setVideoTex(tex)
      video.play().catch(() => startOnTap())
    }

    video.addEventListener('loadeddata', onLoaded, { once: true })
    document.addEventListener('pointerdown', startOnTap, { once: true })

    return () => {
      document.removeEventListener('pointerdown', startOnTap)
      video.pause()
      video.remove()
      videoTex?.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((_, delta) => {
    const dist = Math.sqrt(pos.normX * pos.normX + pos.normY * pos.normY)
    if (dist < 0.55) {
      const intensity = 1 - dist / 0.55
      const hue = 0.08 - intensity * 0.22
      targetColor.current.setHSL(hue, 1, 0.5 + intensity * 0.15)
      uniforms.uCMEIntensity.value = 0.6 + intensity * 0.8
    } else {
      targetColor.current.setHex(0xff6b00)
      uniforms.uCMEIntensity.value = 0.6
    }

    colorRef.current.lerp(targetColor.current, 0.04)
    uniforms.uTime.value += delta
    uniforms.uCoronaPhase.value =
      (uniforms.uCoronaPhase.value + delta / CORONA_PERIOD_S) % 1

    if (glowRef.current) {
      glowRef.current.material.color.copy(colorRef.current)
      glowRef.current.material.opacity = 0.7 + Math.sin(Date.now() * 0.0008) * 0.15
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.4, 64, 64]} />
        <shaderMaterial
          vertexShader={sunVertexShader}
          fragmentShader={sunFragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      <sprite ref={glowRef} scale={[14, 14, 1]}>
        <spriteMaterial
          map={glowTexture}
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.85}
          depthWrite={false}
          color={0xff6b00}
        />
      </sprite>
    </group>
  )
}