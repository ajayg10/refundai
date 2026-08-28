import { useEffect, useRef, useState } from 'react'
import { Reveal } from './Reveal'

const TOOL_CALLS = [
  { fn: 'get_customer()', result: 'Alice Johnson', delay: 400 },
  { fn: 'get_order()', result: 'ORD-1042 · $149', delay: 900 },
  { fn: 'get_payment()', result: 'Payment completed', delay: 1400 },
  { fn: 'get_refund_history()', result: 'No previous refunds', delay: 1900 },
  { fn: 'get_refund_policy()', result: 'Damaged product · 30 days', delay: 2400 },
]

export function InvestigationSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const timers = TOOL_CALLS.map((tc, i) =>
      setTimeout(() => setVisible(i + 1), tc.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [started])

  return (
    <section style={{ background: '#0B0B0A', padding: '120px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#D6A84F', textTransform: 'uppercase', marginBottom: 16 }}>
              AI Investigation
            </div>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#F5F0E8', margin: 0, maxWidth: 460 }}>
              Everything the agent needs. Nothing hidden.
            </h2>
          </div>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 32,
            alignItems: 'start',
          }}
          className="investigation-grid"
        >
          {/* Left: Case brief */}
          <Reveal direction="left">
            <div
              style={{
                background: 'rgba(16,16,15,0.6)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: 28,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: '#6B6560', textTransform: 'uppercase', marginBottom: 20 }}>
                Refund Request
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#D6A84F', fontWeight: 600, marginBottom: 6 }}>ORD-1042</div>
              <div style={{ fontFamily: 'monospace', fontSize: 32, fontWeight: 800, color: '#F5F0E8', letterSpacing: '-0.02em', marginBottom: 8 }}>$149</div>
              <div style={{ fontSize: 14, color: '#9A9488', marginBottom: 24 }}>Damaged headphones</div>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Customer', value: 'Alice Johnson' },
                  { label: 'Order age', value: '7 days' },
                  { label: 'Payment', value: 'Completed' },
                  { label: 'Previous refunds', value: 'None' },
                  { label: 'Reason', value: 'Damaged product' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 12, color: '#6B6560' }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#9A9488', fontFamily: row.label === 'Customer' ? 'inherit' : 'monospace' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right: Tool calls */}
          <div ref={ref}>
            <Reveal direction="right">
              <div
                style={{
                  background: '#0D0D0C',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                {/* Terminal header */}
                <div
                  style={{
                    padding: '12px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3A3630' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3A3630' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3A3630' }} />
                  <span style={{ fontSize: 11, color: '#4A4640', marginLeft: 8, fontFamily: 'monospace', letterSpacing: '0.06em' }}>
                    agent · investigation · ORD-1042
                  </span>
                </div>

                {/* Tool calls */}
                <div style={{ padding: '20px 20px 24px' }}>
                  {TOOL_CALLS.map((tc, i) => (
                    <div
                      key={tc.fn}
                      style={{
                        marginBottom: 16,
                        opacity: visible > i ? 1 : 0,
                        transform: visible > i ? 'none' : 'translateY(8px)',
                        transition: 'opacity 0.4s ease, transform 0.4s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#D6A84F', fontWeight: 600 }}>{tc.fn}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 4 }}>
                        <span style={{ fontSize: 11, color: '#4ADE80' }}>✓</span>
                        <span style={{ fontSize: 12, color: '#6B6560', fontFamily: 'monospace' }}>{tc.result}</span>
                      </div>
                    </div>
                  ))}

                  {/* Pending indicator */}
                  {visible < TOOL_CALLS.length && started && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: '#D6A84F',
                          animation: 'lp-pulse 1s ease-in-out infinite',
                        }}
                      />
                      <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#4A4640' }}>running...</span>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
