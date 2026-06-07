import { useFilterStore, type TypeFilter, type SortKey } from '../../store/filterStore'

interface FilterBarProps {
  counts: { all: number; rocky: number; gas: number; ice: number }
}

const TYPES: { key: TypeFilter; label: string }[] = [
  { key: 'all', label: 'Tất Cả' },
  { key: 'rocky', label: 'Đá' },
  { key: 'gas', label: 'Khí' },
  { key: 'ice', label: 'Băng' },
]

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'distance', label: 'KC' },
  { key: 'size', label: 'Kích Thước' },
  { key: 'moons', label: 'Vệ Tinh' },
]

export function FilterBar({ counts }: FilterBarProps) {
  const type = useFilterStore((s) => s.type)
  const sort = useFilterStore((s) => s.sort)
  const setType = useFilterStore((s) => s.setType)
  const setSort = useFilterStore((s) => s.setSort)

  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {TYPES.map((t) => {
          const isActive = type === t.key
          return (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              className={`group relative flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
                isActive
                  ? 'border-[#00D4FF] bg-[rgba(0,212,255,0.1)] text-[#00D4FF] shadow-[0_0_20px_rgba(0,212,255,0.25)]'
                  : 'border-[rgba(255,255,255,0.1)] text-[#4a4a5a] hover:border-[rgba(255,255,255,0.3)] hover:text-white'
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                  isActive
                    ? 'bg-[rgba(0,212,255,0.2)] text-[#00D4FF]'
                    : 'bg-[rgba(255,255,255,0.05)] text-[#4a4a5a]'
                }`}
              >
                {counts[t.key]}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] tracking-[0.2em] text-[#4a4a5a] uppercase">
Sắp Xếp
        </span>
        <div className="flex items-center gap-1 rounded-full border border-[rgba(255,255,255,0.1)] p-1">
          {SORTS.map((s) => {
            const isActive = sort === s.key
            return (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                className={`rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-[#0B0B10]'
                    : 'text-[#4a4a5a] hover:text-white'
                }`}
              >
                {s.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
