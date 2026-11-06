import { useState } from 'react'

export default function Header({ menuOpen, setMenuOpen, nav }) {
  return (
    <header>
      <div className="wrap nav">
        <a className="brand" href="#home" onClick={nav}>
          <span className="mark">S/I</span>
          <span>SIADPL</span>
        </a>
        <nav className={menuOpen ? 'navlinks open' : 'navlinks'}>
          <a onClick={nav} href="#about">About</a>
          <a onClick={nav} href="#services">Services</a>
          <a onClick={nav} href="#projects">Projects</a>
          <a onClick={nav} href="#careers">Careers</a>
          <a onClick={nav} href="#contact">Contact</a>
        </nav>
        <a className="button desktop-button" href="#contact">Start an enquiry ↗</a>
        <button
          className="menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? '×' : '☰'}
        </button>
      </div>
    </header>
  )
}
