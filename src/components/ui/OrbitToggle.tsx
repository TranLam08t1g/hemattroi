import { useSceneStore } from '../../store/sceneStore'

export function OrbitToggle() {
  const showOrbits = useSceneStore((s) => s.showOrbits)
  const toggleOrbits = useSceneStore((s) => s.toggleOrbits)

  return (
    <button
      onClick={toggleOrbits}
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
            showOrbits
              ? 'bg-[#00D4FF] shadow-[0_0_8px_rgba(0,212,255,0.6)]'
              : 'bg-[#4a4a5a]'
          }`}
        />
        <span className={showOrbits ? 'text-white' : 'text-[#4a4a5a]'}>
          Quỹ Đạo
        </span>
        <span className={showOrbits ? 'text-[#00D4FF]' : 'text-[#4a4a5a]'}>
          {showOrbits ? 'BẬT' : 'TẮT'}
        </span>
      </span>
    </button>
  )
}