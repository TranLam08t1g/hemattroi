import { useSceneStore } from '../../store/sceneStore'

const LABELS = ['Tất Cả', 'Hành Tinh ✕', 'Tất Cả ✕']

export function OrbitToggle() {
  const orbitMode = useSceneStore((s) => s.orbitMode)
  const cycleOrbitMode = useSceneStore((s) => s.cycleOrbitMode)

  return (
    <button
      onClick={cycleOrbitMode}
      className="fixed bottom-10 right-12 z-50 pointer-events-auto cursor-pointer
                 font-mono text-[10px] tracking-[0.25em] uppercase
                 border border-[rgba(255,255,255,0.08)] rounded-full px-5 py-2.5
                 bg-[rgba(255,255,255,0.02)] backdrop-blur-lg
                 transition-all duration-500
                 hover:border-[rgba(0,212,255,0.3)] hover:bg-[rgba(0,212,255,0.04)]
                 max-sm:bottom-6 max-sm:right-6"
    >
      <span className="flex items-center gap-2.5">
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full transition-all duration-500 ${
            orbitMode < 2
              ? 'bg-[#00D4FF] shadow-[0_0_8px_rgba(0,212,255,0.6)]'
              : 'bg-[#4a4a5a]'
          }`}
        />
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full transition-all duration-500 ${
            orbitMode < 1
              ? 'bg-[#00D4FF] shadow-[0_0_8px_rgba(0,212,255,0.6)]'
              : 'bg-[#4a4a5a]'
          }`}
        />
        <span className={orbitMode === 2 ? 'text-white' : 'text-white'}>
          {LABELS[orbitMode]}
        </span>
      </span>
    </button>
  )
}