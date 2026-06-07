import { create } from 'zustand'

export type TypeFilter = 'all' | 'rocky' | 'gas' | 'ice'
export type SortKey = 'distance' | 'size' | 'moons'

interface FilterState {
  type: TypeFilter
  sort: SortKey
  setType: (t: TypeFilter) => void
  setSort: (s: SortKey) => void
  reset: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  type: 'all',
  sort: 'distance',
  setType: (t) => set({ type: t }),
  setSort: (s) => set({ sort: s }),
  reset: () => set({ type: 'all', sort: 'distance' }),
}))
