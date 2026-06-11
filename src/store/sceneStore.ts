import { create } from 'zustand'

interface SceneState {
  focusPlanet: string | null
  orbitMode: number
  isDragging: boolean
  rotationY: number
  rotationX: number
  zoomDistance: number
  setFocusPlanet: (id: string | null) => void
  cycleOrbitMode: () => void
  setIsDragging: (v: boolean) => void
  setRotationY: (v: number) => void
  setRotationX: (v: number) => void
  setZoomDistance: (n: number) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  focusPlanet: null,
  orbitMode: 0,
  isDragging: false,
  rotationY: 0,
  rotationX: 0.15,
  zoomDistance: 20,
  setFocusPlanet: (id) => set({ focusPlanet: id }),
  cycleOrbitMode: () => set((s) => ({ orbitMode: (s.orbitMode + 1) % 3 })),
  setIsDragging: (v) => set({ isDragging: v }),
  setRotationY: (v) => set({ rotationY: v }),
  setRotationX: (v) => set({ rotationX: Math.max(-0.8, Math.min(0.8, v)) }),
  setZoomDistance: (n) => set({ zoomDistance: Math.max(6, Math.min(40, n)) }),
}))