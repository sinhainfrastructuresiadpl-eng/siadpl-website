import { useState, useEffect } from 'react'

const images = [
  'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1800&q=85',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=85',
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1800&q=85',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1800&q=85'
]

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="hero" id="home">
      {images.map((img, index) => (
        <img
          key={img}
          className={`hero-img ${index === currentImage ? 'active' : ''}`}
          src={img}
          alt={`Infrastructure ${index + 1}`}
        />
      ))}
      <div className="wrap hero-inner">
        <div className="eyebrow lime-text">Railway · Civil · Electrical · Support</div>
        <h1 className="hero-title">Infrastructure that keeps <em>India moving.</em></h1>
        <p>
          We bring technical discipline, dependable teams and accountable execution to railway, industrial and infrastructure projects.
        </p>
        <div className="hero-actions">
          <a className="button lime" href="#services">Explore our services ↓</a>
          <a className="button outline" href="#contact">Talk to our team</a>
        </div>
      </div>
      <div className="hero-note">
        <span>OUR PRINCIPLE</span>
        Plan carefully. Execute precisely. Deliver responsibly.
      </div>
    </section>
  )
}
