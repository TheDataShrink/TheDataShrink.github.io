import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Home from '@/pages/Home'
import Platform from '@/pages/Platform'
import Spectrum from '@/pages/Spectrum'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import Diagnostic from '@/pages/Diagnostic'
import Resources from '@/pages/Resources'
import Community from '@/pages/Community'
import Episodes from '@/pages/Episodes'
import EpisodeDetail from '@/pages/EpisodeDetail'
import Origin from '@/pages/Origin'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#04080f]">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/spectrum" element={<Spectrum />} />
          <Route path="/services" element={<Navigate to="/platform" replace />} />
          <Route path="/diagnostic" element={<Diagnostic />} />
          <Route path="/community" element={<Community />} />
          <Route path="/episodes" element={<Episodes />} />
          <Route path="/episodes/:slug" element={<EpisodeDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/origin" element={<Origin />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
