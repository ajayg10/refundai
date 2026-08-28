const FOOTER_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Safety', href: '#safety' },
  { label: 'TrueForge', href: '#trueforge' },
  { label: 'GitHub', href: 'https://github.com', external: true },
  { label: 'Demo', href: '/dashboard', demo: true },
]

export function Footer() {
  const handleLink = (href: string, external?: boolean, demo?: boolean) => {
    if (external) { window.open(href, '_blank'); return }
    if (demo) { window.location.href = href; return }
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer
      style={{
        background: '#080808',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '48px 32px 40px',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#D6A84F', display: 'inline-block' }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: '#F5F0E8', letterSpacing: '-0.01em' }}>RefundGuard</span>
            </div>
            <p style={{ fontSize: 12, color: '#4A4640', margin: 0, lineHeight: 1.6 }}>
              AI-powered refund investigation and approval.
            </p>
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
            {FOOTER_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => handleLink(link.href, link.external, link.demo)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: '#4A4640',
                  fontWeight: 500,
                  padding: 0,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#9A9488')}
                onMouseLeave={e => (e.currentTarget.style.color = '#4A4640')}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <span style={{ fontSize: 12, color: '#2A2A28', fontStyle: 'italic', fontWeight: 600, letterSpacing: '0.02em' }}>
            AI investigates. Humans decide.
          </span>
          <span style={{ fontSize: 11, color: '#2A2A28' }}>
            Built with TrueForge
          </span>
        </div>
      </div>
    </footer>
  )
}
