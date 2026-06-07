import { Routes, Route } from 'react-router-dom'
import { RootLayout } from './components/layout/RootLayout'
import { Home } from './pages/Home'
import { Planets } from './pages/Planets'
import { PlanetDetail } from './pages/PlanetDetail'
import { About } from './pages/About'
import { Gallery } from './pages/Gallery'

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/planets" element={<Planets />} />
        <Route path="/planets/:slug" element={<PlanetDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
      </Route>
    </Routes>
  )
}
