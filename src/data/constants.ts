export const COLORS = {
  bg: '#0B0B10',
  text: '#FFFFFF',
  muted: '#4a4a5a',
  accentOrange: '#FF6B00',
  accentPink: '#FF3366',
  accentCyan: '#00D4FF',
  glassBg: 'rgba(255,255,255,0.03)',
  glassBorder: 'rgba(255,255,255,0.1)',
} as const

export const SCENE = {
  starCount: 5000,
  starFieldSize: 300,
  sunRadius: 2.4,
  cameraPosition: [0, 5, 20] as const,
  cameraFov: 50,
  glowSize: 14,
  dragSensitivity: 0.005,
} as const

export const COUNTERS = {
  distance: 1277986,
  velocity: 29.78,
  signalDelay: 4.3,
  discoveries: 3897,
  downloads: 0.0034,
} as const
