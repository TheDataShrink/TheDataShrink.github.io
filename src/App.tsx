import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Home from '@/pages/Home'
import Services from '@/pages/Services'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import Diagnostic from '@/pages/Diagnostic'
import Resources from '@/pages/Resources'
import Community from '@/pages/Community'
import Episodes from '@/pages/Episodes'
import EpisodeDetail from '@/pages/EpisodeDetail'

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
          <Route path="/services" element={<Services />} />
          <Route path="/diagnostic" element={<Diagnostic />} />
          <Route path="/community" element={<Community />} />
          <Route path="/episodes" element={<Episodes />} />
          <Route path="/episodes/:slug" element={<EpisodeDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
