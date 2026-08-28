import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Safety', href: '#safety' },
  { label: 'TrueForge', href: '#trueforge' },
  { label: 'GitHub', href: 'https://github.com/harshitsaxena214/refundai', target: '_blank' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleScroll = (href: string) => {
    setMenuOpen(false)
    if (href.startsWith('http')) { window.open(href, '_blank'); return }
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'background 0.35s ease, border-color 0.35s ease',
        background: scrolled ? 'rgba(8,8,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
          aria-label="RefundGuard home"
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D6A84F', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: '#F5F0E8' }}>RefundGuard</span>
        </a>

        {/* Desktop nav */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 32 }}
          className="landing-nav-desktop"
        >
          {NAV_LINKS.map(link => (
            <button
              key={link.label}
              onClick={() => handleScroll(link.href)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                color: '#9A9488',
                letterSpacing: '0.01em',
                padding: '4px 0',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F5F0E8')}
              onMouseLeave={e => (e.currentTarget.style.color = '#9A9488')}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            id="nav-try-demo"
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#D6A84F',
              color: '#0B0B0A',
              border: 'none',
              borderRadius: 6,
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.01em',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Try Demo
          </button>

          {/* Hamburger */}
          <button
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(m => !m)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9A9488',
              padding: 4,
              display: 'none',
            }}
            className="landing-nav-hamburger"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path d="M5 5L17 17M17 5L5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M4 7h14M4 11h14M4 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: '#0B0B0A',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '16px 32px 24px',
          }}
          className="landing-nav-mobile"
        >
          {NAV_LINKS.map(link => (
            <button
              key={link.label}
              onClick={() => handleScroll(link.href)}
              style={{
                display: 'block',
                width: '100%',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '10px 0',
                fontSize: 15,
                fontWeight: 500,
                color: '#9A9488',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { setMenuOpen(false); navigate('/dashboard') }}
            style={{
              marginTop: 16,
              background: '#D6A84F',
              color: '#0B0B0A',
              border: 'none',
              borderRadius: 6,
              padding: '10px 18px',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Try Demo
          </button>
        </div>
      )}
    </nav>
  )
}
