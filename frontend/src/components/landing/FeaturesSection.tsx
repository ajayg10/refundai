import { Reveal } from './Reveal'

const FEATURES = [
  { label: 'AI refund investigation', desc: 'Autonomous investigation of every refund request' },
  { label: 'Customer context retrieval', desc: 'Fetches account history and identity automatically' },
  { label: 'Order verification', desc: 'Checks order status, product and amount' },
  { label: 'Payment verification', desc: 'Confirms transaction and payment state' },
  { label: 'Refund history', desc: 'Surfaces previous refund patterns per customer' },
  { label: 'Policy evaluation', desc: 'Applies the refund policy to the specific case' },
  { label: 'Refund calculation', desc: 'Computes the exact eligible refund amount' },
  { label: 'Human approval gate', desc: 'Every refund requires explicit human authorization' },
  { label: 'Protected execution', desc: 'Refund tools reject calls without recorded approval' },
  { label: 'Audit logs', desc: 'Immutable trail of every decision and action' },
  { label: 'Agent execution trace', desc: 'Full visibility into tool calls and agent reasoning' },
  { label: 'Sandboxed actions', desc: 'Irreversible actions gated behind authorization checks' },
]

export function FeaturesSection() {
  return (
    <section style={{ background: '#080808', padding: '120px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, alignItems: 'start' }} className="features-grid">
            {/* Left: header */}
            <div style={{ position: 'sticky', top: 100 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#D6A84F', textTransform: 'uppercase', marginBottom: 16 }}>
                Built for Support Teams
              </div>
              <h2 style={{ fontSize: 'clamp(26px, 3vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#F5F0E8', margin: '0 0 16px' }}>
                Automate the investigation. Keep control of the action.
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#6B6560' }}>
                RefundGuard covers every step of the investigation while enforcing human oversight at the only step that matters.
              </p>
            </div>

            {/* Right: features grid */}
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1,
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
                className="features-inner-grid"
              >
                {FEATURES.map((feat, i) => (
                  <Reveal key={feat.label} delay={i * 40} direction="none">
                    <div
                      style={{
                        padding: '20px 20px',
                        background: 'rgba(255,255,255,0.015)',
                        borderRight: '1px solid rgba(255,255,255,0.04)',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        transition: 'background 0.2s',
                        cursor: 'default',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(214,168,79,0.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ color: '#D6A84F', fontSize: 13, marginTop: 1, flexShrink: 0 }}>—</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#9A9488', marginBottom: 4 }}>{feat.label}</div>
                          <div style={{ fontSize: 12, color: '#4A4640', lineHeight: 1.5 }}>{feat.desc}</div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
