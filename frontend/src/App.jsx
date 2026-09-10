import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Projects from './components/Projects'
import Careers from './components/Careers'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Reveal from './components/Reveal'
import BackToTop from './components/BackToTop'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = () => setMenuOpen(false)

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <span>SIADPL / ENGINEERING THE ESSENTIAL</span>
          <span>
            <a href="tel:+919131161983">+91 91311 61983</a> · Bilaspur, Chhattisgarh
          </span>
        </div>
      </div>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} nav={nav} />
      <main>
        <Hero />
        <Reveal>
          <About />
        </Reveal>
        <Reveal>
          <Services />
        </Reveal>
        <Reveal>
          <Projects />
        </Reveal>
        <Reveal>
          <Careers />
        </Reveal>
        <Reveal>
          <Contact />
        </Reveal>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
