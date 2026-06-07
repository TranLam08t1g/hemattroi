import type { PlanetData } from '../data/planets'
import type { TypeFilter, SortKey } from '../store/filterStore'

export function filterPlanets(
  planets: PlanetData[],
  type: TypeFilter,
): PlanetData[] {
  if (type === 'all') return planets
  return planets.filter((p) => p.type === type)
}

const distanceOrder: Record<string, number> = {
  mercury: 1,
  venus: 2,
  earth: 3,
  mars: 4,
  jupiter: 5,
  saturn: 6,
  uranus: 7,
  neptune: 8,
}

export function sortPlanets(planets: PlanetData[], key: SortKey): PlanetData[] {
  const sorted = [...planets]
  switch (key) {
    case 'distance':
      return sorted.sort(
        (a, b) => (distanceOrder[a.id] ?? 99) - (distanceOrder[b.id] ?? 99),
      )
    case 'size':
      return sorted.sort((a, b) => b.radius - a.radius)
    case 'moons':
      return sorted.sort((a, b) => b.numberOfMoons - a.numberOfMoons)
    default:
      return sorted
  }
}

export function countByType(planets: PlanetData[]) {
  return {
    all: planets.length,
    rocky: planets.filter((p) => p.type === 'rocky').length,
    gas: planets.filter((p) => p.type === 'gas').length,
    ice: planets.filter((p) => p.type === 'ice').length,
  }
}
