import { useEffect, useState, useRef } from 'react'

export default function Reveal({ children }) {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (domRef.current) observer.unobserve(domRef.current)
        }
      })
    })

    observer.observe(domRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={domRef}
      className={`reveal ${isVisible ? 'active' : ''}`}
    >
      {children}
    </div>
  )
}
