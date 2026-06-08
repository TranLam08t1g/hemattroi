export interface CompositionLayer {
  label: string
  pct: number
  color: string
}

export const COMPOSITION: Record<string, CompositionLayer[]> = {
  mercury: [
    { label: 'Lõi Sắt', pct: 75, color: '#FFD700' },
    { label: 'Lớp Phủ Silicat', pct: 22, color: '#D2691E' },
    { label: 'Đất Bề Mặt', pct: 3, color: '#808080' },
  ],
  venus: [
    { label: 'Lõi Sắt', pct: 30, color: '#FFD700' },
    { label: 'Lớp Phủ Silicat', pct: 60, color: '#D2691E' },
    { label: 'Khí Quyển CO₂', pct: 10, color: '#E8D5A3' },
  ],
  earth: [
    { label: 'Lõi Sắt', pct: 32, color: '#FFD700' },
    { label: 'Lớp Phủ Silicat', pct: 50, color: '#D2691E' },
    { label: 'Thủy Quyển', pct: 13, color: '#4169E1' },
    { label: 'Khí Quyển', pct: 5, color: '#87CEEB' },
  ],
  mars: [
    { label: 'Lõi Sắt', pct: 25, color: '#FFD700' },
    { label: 'Lớp Phủ Silicat', pct: 55, color: '#D2691E' },
    { label: 'Khí Quyển CO₂', pct: 10, color: '#E8D5A3' },
    { label: 'Băng Cực', pct: 10, color: '#B0E0E6' },
  ],
  jupiter: [
    { label: 'Hydro', pct: 73, color: '#ADD8E6' },
    { label: 'Heli', pct: 24, color: '#9370DB' },
    { label: 'Nguyên Tố Vết', pct: 3, color: '#FFA07A' },
  ],
  saturn: [
    { label: 'Hydro', pct: 75, color: '#ADD8E6' },
    { label: 'Heli', pct: 23, color: '#9370DB' },
    { label: 'Nguyên Tố Vết', pct: 2, color: '#FFA07A' },
  ],
  uranus: [
    { label: 'Hydro', pct: 50, color: '#ADD8E6' },
    { label: 'Heli', pct: 20, color: '#9370DB' },
    { label: 'Băng Methane', pct: 25, color: '#00CED1' },
    { label: 'Silicat', pct: 5, color: '#A0522D' },
  ],
  neptune: [
    { label: 'Hydro', pct: 50, color: '#ADD8E6' },
    { label: 'Heli', pct: 20, color: '#9370DB' },
    { label: 'Băng Methane', pct: 25, color: '#00CED1' },
    { label: 'Silicat', pct: 5, color: '#A0522D' },
  ],
}