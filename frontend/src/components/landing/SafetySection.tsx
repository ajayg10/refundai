import { Reveal } from './Reveal'

export function SafetySection() {
  return (
    <section style={{ background: '#0B0B0A', padding: '120px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#D6A84F', textTransform: 'uppercase', marginBottom: 16 }}>
              Safe by Design
            </div>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#F5F0E8', margin: '0 auto', maxWidth: 500 }}>
              The agent can investigate.
              <br />
              It cannot bypass approval.
            </h2>
            <p style={{ marginTop: 20, fontSize: 16, lineHeight: 1.7, color: '#6B6560', maxWidth: 480, margin: '20px auto 0' }}>
              The refund execution tool is protected by the backend. Even if the AI attempts to call{' '}
              <code style={{ fontFamily: 'monospace', fontSize: 13, color: '#D6A84F', background: 'rgba(214,168,79,0.08)', padding: '1px 6px', borderRadius: 4 }}>
                process_refund()
              </code>
              , the backend rejects the operation unless a human approval has been recorded.
            </p>
          </div>
        </Reveal>

        {/* Safety diagram */}
        <Reveal delay={150}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, maxWidth: 600, margin: '0 auto' }}>

            {/* AI Agent */}
            <Node label="AI AGENT" color="neutral" />
            <Arrow />
            <CodeNode label="process_refund()" />
            <Arrow />

            {/* Authorization check */}
            <div
              style={{
                padding: '14px 32px',
                background: 'rgba(214,168,79,0.06)',
                border: '1px solid rgba(214,168,79,0.2)',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                color: '#D6A84F',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Authorization Check
            </div>

            {/* Fork */}
            <div style={{ display: 'flex', gap: 60, marginTop: 0, width: '100%', justifyContent: 'center', alignItems: 'flex-start' }}>
              {/* Left: blocked */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flex: 1 }}>
                <div style={{ width: 1, height: 28, background: 'rgba(239,68,68,0.3)' }} />
                <div
                  style={{
                    padding: '10px 18px',
                    background: 'rgba(239,68,68,0.06)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#EF4444',
                    textAlign: 'center',
                    letterSpacing: '0.06em',
                  }}
                >
                  NO APPROVAL
                </div>
                <div style={{ width: 1, height: 20, background: 'rgba(239,68,68,0.3)' }} />
                <div
                  style={{
                    padding: '10px 18px',
                    background: 'rgba(239,68,68,0.04)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#EF4444',
                    textAlign: 'center',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  ✕ Request rejected
                </div>
              </div>

              {/* Right: authorized */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flex: 1 }}>
                <div style={{ width: 1, height: 28, background: 'rgba(74,222,128,0.3)' }} />
                <div
                  style={{
                    padding: '10px 18px',
                    background: 'rgba(74,222,128,0.06)',
                    border: '1px solid rgba(74,222,128,0.2)',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#4ADE80',
                    textAlign: 'center',
                    letterSpacing: '0.06em',
                  }}
                >
                  APPROVED
                </div>
                <div style={{ width: 1, height: 20, background: 'rgba(74,222,128,0.3)' }} />
                <div
                  style={{
                    padding: '10px 18px',
                    background: 'rgba(74,222,128,0.04)',
                    border: '1px solid rgba(74,222,128,0.15)',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#4ADE80',
                    textAlign: 'center',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  ✓ Execute refund
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* The key insight */}
        <Reveal delay={300}>
          <div
            style={{
              marginTop: 64,
              textAlign: 'center',
              padding: '28px 32px',
              background: 'rgba(255,255,255,0.015)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              maxWidth: 500,
              margin: '64px auto 0',
            }}
          >
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: '#F5F0E8',
              }}
            >
              AI ≠ AUTHORIZATION
            </div>
            <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.65, color: '#6B6560', margin: '12px 0 0' }}>
              The AI's recommendation is advisory, not executive.
              Irreversible financial actions require a human decision.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Node({ label, color }: { label: string; color: 'neutral' | 'amber' | 'green' | 'red' }) {
  const colors = {
    neutral: { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', text: '#9A9488' },
    amber: { bg: 'rgba(214,168,79,0.07)', border: 'rgba(214,168,79,0.2)', text: '#D6A84F' },
    green: { bg: 'rgba(74,222,128,0.06)', border: 'rgba(74,222,128,0.2)', text: '#4ADE80' },
    red: { bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)', text: '#EF4444' },
  }
  const c = colors[color]
  return (
    <div
      style={{
        padding: '12px 32px',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 700,
        color: c.text,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
  )
}

function CodeNode({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: '10px 24px',
        background: '#0D0D0C',
        border: '1px solid rgba(214,168,79,0.15)',
        borderRadius: 6,
        fontFamily: 'monospace',
        fontSize: 14,
        fontWeight: 600,
        color: '#D6A84F',
      }}
    >
      {label}
    </div>
  )
}

function Arrow() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)' }} />
      <span style={{ color: '#3A3630', fontSize: 12 }}>▼</span>
    </div>
  )
}
