import { create } from 'zustand'

interface SceneState {
  selectedPlanet: string | null
  isDragging: boolean
  rotationY: number
  rotationX: number
  showOrbits: boolean
  setSelectedPlanet: (id: string | null) => void
  setIsDragging: (v: boolean) => void
  setRotationY: (v: number) => void
  setRotationX: (v: number) => void
  setShowOrbits: (v: boolean) => void
  toggleOrbits: () => void
}

export const useSceneStore = create<SceneState>((set) => ({
  selectedPlanet: null,
  isDragging: false,
  rotationY: 0,
  rotationX: 0.15,
  showOrbits: true,
  setSelectedPlanet: (id) => set({ selectedPlanet: id }),
  setIsDragging: (v) => set({ isDragging: v }),
  setRotationY: (v) => set({ rotationY: v }),
  setRotationX: (v) => set({ rotationX: Math.max(-0.8, Math.min(0.8, v)) }),
  setShowOrbits: (v) => set({ showOrbits: v }),
  toggleOrbits: () => set((s) => ({ showOrbits: !s.showOrbits })),
}))