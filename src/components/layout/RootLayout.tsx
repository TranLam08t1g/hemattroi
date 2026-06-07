import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '../ui/Navbar'
import { CustomCursor } from '../ui/CustomCursor'
import { OrbitToggle } from '../ui/OrbitToggle'

gsap.registerPlugin(useGSAP)

export function RootLayout() {
  const contentRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useGSAP(() => {
    if (contentRef.current) {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
      })
    }
  }, [location.pathname])

  return (
    <>
      <CustomCursor />
      <Navbar />
      <OrbitToggle />
      <main ref={contentRef} className="relative z-10 min-h-screen">
        <Outlet />
      </main>
    </>
  )
}
