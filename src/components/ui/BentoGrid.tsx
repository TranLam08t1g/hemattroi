import type { ReactNode } from 'react'

interface BentoGridProps {
  children: ReactNode
  cols?: 6 | 12
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

const gapMap = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
}

const colsMap = {
  6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  12: 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12',
}

export function BentoGrid({
  children,
  cols = 12,
  gap = 'md',
  className = '',
}: BentoGridProps) {
  return (
    <div
      className={`mx-auto grid max-w-7xl auto-rows-[140px] ${colsMap[cols]} ${gapMap[gap]} ${className}`}
    >
      {children}
    </div>
  )
}

interface BentoItemProps {
  children: ReactNode
  col?: number
  colSpan?: number
  rowSpan?: number
  className?: string
}

// Static class maps so Tailwind JIT picks them up
const colSpanMap: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-2 sm:col-span-3',
  4: 'col-span-2 sm:col-span-4',
  5: 'col-span-2 sm:col-span-4 lg:col-span-5',
  6: 'col-span-2 sm:col-span-4 lg:col-span-6',
  7: 'col-span-2 sm:col-span-4 lg:col-span-6 xl:col-span-7',
  8: 'col-span-2 sm:col-span-4 lg:col-span-6 xl:col-span-8',
  9: 'col-span-2 sm:col-span-4 lg:col-span-6 xl:col-span-9',
  10: 'col-span-2 sm:col-span-4 lg:col-span-6 xl:col-span-10',
  11: 'col-span-2 sm:col-span-4 lg:col-span-6 xl:col-span-11',
  12: 'col-span-2 sm:col-span-4 lg:col-span-6 xl:col-span-12',
}

const rowSpanMap: Record<number, string> = {
  1: 'row-span-1',
  2: 'row-span-2',
  3: 'row-span-2 sm:row-span-3',
  4: 'row-span-2 sm:row-span-4',
}

const colStartMap: Record<number, string> = {
  1: 'xl:col-start-1',
  2: 'xl:col-start-2',
  3: 'xl:col-start-3',
  4: 'xl:col-start-4',
  5: 'xl:col-start-5',
  6: 'xl:col-start-6',
  7: 'xl:col-start-7',
  8: 'xl:col-start-8',
  9: 'xl:col-start-9',
  10: 'xl:col-start-10',
  11: 'xl:col-start-11',
  12: 'xl:col-start-12',
}

export function BentoItem({
  children,
  col,
  colSpan = 1,
  rowSpan = 1,
  className = '',
}: BentoItemProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,212,255,0.08)] ${colSpanMap[colSpan] ?? colSpanMap[1]} ${rowSpanMap[rowSpan] ?? rowSpanMap[1]} ${col ? colStartMap[col] ?? '' : ''} ${className}`}
    >
      {children}
    </div>
  )
}