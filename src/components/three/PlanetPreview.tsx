interface PlanetPreviewProps {
  className?: string
}

export function PlanetPreview({ className = '' }: PlanetPreviewProps) {
  return <div className={`absolute inset-0 ${className}`} />
}