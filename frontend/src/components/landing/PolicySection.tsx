import { Reveal } from './Reveal'

export function PolicySection() {
  return (
    <section style={{ background: '#080808', padding: '120px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#D6A84F', textTransform: 'uppercase', marginBottom: 16 }}>
              Policy Analysis
            </div>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#F5F0E8', margin: 0, maxWidth: 480 }}>
              The recommendation comes with evidence.
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }} className="policy-grid">
          {/* Policy match */}
          <Reveal direction="left" delay={100}>
            <div
              style={{
                background: 'rgba(16,16,15,0.6)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: 28,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: '#6B6560', textTransform: 'uppercase', marginBottom: 20 }}>
                Refund Policy
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'Damaged product', highlight: true },
                  { label: 'Within 30 days', highlight: false },
                  { label: '100% refund', highlight: true },
                ].map((item, i) => (
                  <div key={item.label} style={{ position: 'relative' }}>
                    <div
                      style={{
                        padding: '14px 18px',
                        background: item.highlight ? 'rgba(214,168,79,0.05)' : 'transparent',
                        border: `1px solid ${item.highlight ? 'rgba(214,168,79,0.15)' : 'rgba(255,255,255,0.04)'}`,
                        borderRadius: 6,
                        marginBottom: 4,
                        fontSize: 14,
                        fontWeight: item.highlight ? 600 : 400,
                        color: item.highlight ? '#D6A84F' : '#9A9488',
                      }}
                    >
                      {item.label}
                    </div>
                    {i < 2 && (
                      <div style={{ textAlign: 'center', color: '#3A3630', fontSize: 16, marginBottom: 4, lineHeight: 1 }}>↓</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Order age match */}
              <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.12)', borderRadius: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#6B6560' }}>Order age</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: '#9A9488' }}>7 days</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#6B6560' }}>Eligible</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#4ADE80' }}>YES</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Decision record */}
          <Reveal direction="right" delay={150}>
            <div
              style={{
                background: 'rgba(16,16,15,0.6)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: 28,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: '#6B6560', textTransform: 'uppercase', marginBottom: 20 }}>
                Decision Record
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 12, color: '#6B6560' }}>Recommended refund</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 800, color: '#F5F0E8', letterSpacing: '-0.02em' }}>$149</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#6B6560' }}>Risk assessment</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#4ADE80',
                      background: 'rgba(74,222,128,0.08)',
                      border: '1px solid rgba(74,222,128,0.2)',
                      borderRadius: 4,
                      padding: '3px 10px',
                      letterSpacing: '0.08em',
                    }}
                  >
                    LOW
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#6B6560' }}>Eligibility</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#4ADE80',
                      background: 'rgba(74,222,128,0.08)',
                      border: '1px solid rgba(74,222,128,0.2)',
                      borderRadius: 4,
                      padding: '3px 10px',
                      letterSpacing: '0.08em',
                    }}
                  >
                    ELIGIBLE
                  </span>
                </div>
              </div>

              {/* Reasoning */}
              <div
                style={{
                  marginTop: 24,
                  padding: '16px 18px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 8,
                  borderLeft: '3px solid rgba(214,168,79,0.4)',
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: '#6B6560', textTransform: 'uppercase', marginBottom: 10 }}>
                  Agent Reasoning
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: '#9A9488', margin: 0, fontStyle: 'italic' }}>
                  "The order is 7 days old and the damaged-product policy allows a 100% refund within 30 days."
                </p>
              </div>

              {/* NOT executing notice */}
              <div
                style={{
                  marginTop: 16,
                  padding: '12px 16px',
                  background: 'rgba(214,168,79,0.04)',
                  border: '1px solid rgba(214,168,79,0.15)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 14 }}>⏸</span>
                <span style={{ fontSize: 12, color: '#9A9488', fontWeight: 500 }}>
                  AI does not execute. Human approval required.
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
