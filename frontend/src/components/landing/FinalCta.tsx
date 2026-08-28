import { useNavigate } from 'react-router-dom'
import { Reveal } from './Reveal'

export function FinalCta() {
  const navigate = useNavigate()

  return (
    <section
      style={{
        background: '#080808',
        padding: '140px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle grid lines */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          mask: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* Amber glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 300,
          background: 'radial-gradient(ellipse, rgba(214,168,79,0.06) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <h2
            style={{
              fontSize: 'clamp(36px, 5.5vw, 72px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.07,
              color: '#F5F0E8',
              margin: '0 0 24px',
            }}
          >
            Automate the work.
            <br />
            Keep humans in control.
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              color: '#6B6560',
              margin: '0 auto 48px',
              maxWidth: 480,
            }}
          >
            RefundGuard turns refund requests into explainable decisions without handing
            irreversible actions to an AI.
          </p>
        </Reveal>

        <Reveal delay={250}>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <button
              id="final-cta-try"
              onClick={() => navigate('/dashboard')}
              style={{
                background: '#D6A84F',
                color: '#0B0B0A',
                border: 'none',
                borderRadius: 6,
                padding: '14px 32px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.01em',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Try RefundGuard
            </button>
            <a
              href="https://github.com/harshitsaxena214/refundai"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '14px 32px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
                fontSize: 15,
                fontWeight: 500,
                color: '#9A9488',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                transition: 'color 0.2s, border-color 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#F5F0E8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9A9488'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
            >
              View on GitHub
            </a>
          </div>
        </Reveal>

        <Reveal delay={350}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#D6A84F' }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#4A4640', textTransform: 'uppercase' }}>
              Powered by TrueForge
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
