import * as THREE from 'three'

export const DEFAULT_WHITE = (() => {
  const c = document.createElement('canvas')
  c.width = c.height = 2
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 2, 2)
  return new THREE.CanvasTexture(c)
})

export const TYPE_DISPLAY: Record<string, string> = {
  rocky: 'Đá',
  gas: 'Khí',
  ice: 'Băng',
}

export const STATUS_VI: Record<string, string> = {
  past: 'Đã qua',
  current: 'Hiện tại',
  future: 'Tương lai',
}

export function getPlanetType(id: string): number {
  switch (id) {
    case 'earth': return 1
    case 'venus':
    case 'jupiter':
    case 'saturn': return 2
    case 'uranus':
    case 'neptune': return 3
    default: return 0
  }
}

export function getPlanetParams(id: string) {
  switch (id) {
    case 'mercury': return { intensity: 0.35, animX: 0.015, animY: 0.01 }
    case 'venus': return { intensity: 0.40, animX: 0.04, animY: 0.06 }
    case 'earth': return { intensity: 0.30, animX: 0.02, animY: 0.01 }
    case 'mars': return { intensity: 0.30, animX: 0.02, animY: 0.015 }
    case 'jupiter': return { intensity: 0.45, animX: 0.06, animY: 0.08 }
    case 'saturn': return { intensity: 0.35, animX: 0.04, animY: 0.05 }
    case 'uranus': return { intensity: 0.20, animX: 0.02, animY: 0.01 }
    case 'neptune': return { intensity: 0.25, animX: 0.025, animY: 0.015 }
    default: return { intensity: 0.30, animX: 0.02, animY: 0.01 }
  }
}