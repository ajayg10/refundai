import { useEffect, useRef, useState } from 'react'
import { Reveal } from './Reveal'

const LOG_ENTRIES = [
  { time: '09:41:02', label: 'REQUEST RECEIVED', value: 'ORD-1042', highlight: true },
  { time: '09:41:03', label: 'get_customer()', value: 'customer = Alice Johnson', code: true },
  { time: '09:41:03', label: 'get_order()', value: 'amount = $149', code: true },
  { time: '09:41:04', label: 'get_payment()', value: 'payment = completed', code: true },
  { time: '09:41:04', label: 'get_refund_history()', value: 'previous_refunds = 0', code: true },
  { time: '09:41:05', label: 'get_refund_policy()', value: 'eligibility = true', code: true },
  { time: '09:41:05', label: 'calculate_refund()', value: 'refund = $149', code: true },
  { time: '09:41:06', label: 'recommendation', value: 'APPROVE', accent: true },
  { time: '09:41:06', label: 'status', value: 'awaiting_human_approval', highlight: true },
]

export function ExecutionTrace() {
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
    const timers = LOG_ENTRIES.map((_, i) =>
      setTimeout(() => setVisible(i + 1), i * 350 + 100)
    )
    return () => timers.forEach(clearTimeout)
  }, [started])

  return (
    <section style={{ background: '#080808', padding: '120px 32px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Reveal>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#D6A84F', textTransform: 'uppercase', marginBottom: 16 }}>
              Under the Hood
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#F5F0E8', margin: 0 }}>
              Watch the agent work.
            </h2>
          </div>
        </Reveal>

        <div ref={ref}>
          <Reveal delay={100}>
            <div
              style={{
                background: '#0A0A09',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              {/* Terminal header */}
              <div
                style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2A2A28' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2A2A28' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2A2A28' }} />
                <span style={{ fontSize: 11, color: '#3A3630', marginLeft: 8, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                  refundguard · agent · execution trace
                </span>
              </div>

              {/* Log entries */}
              <div style={{ padding: '20px 0', fontFamily: 'monospace' }}>
                {LOG_ENTRIES.map((entry, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr 1fr',
                      gap: 16,
                      padding: '6px 24px',
                      opacity: visible > i ? 1 : 0,
                      transform: visible > i ? 'none' : 'translateY(6px)',
                      transition: 'opacity 0.35s ease, transform 0.35s ease',
                      borderLeft: entry.highlight ? '2px solid rgba(214,168,79,0.3)' : '2px solid transparent',
                      background: entry.highlight ? 'rgba(214,168,79,0.02)' : 'transparent',
                    }}
                  >
                    <span style={{ fontSize: 11, color: '#3A3630' }}>{entry.time}</span>
                    <span
                      style={{
                        fontSize: 12,
                        color: entry.code ? '#D6A84F' : entry.highlight ? '#9A9488' : '#6B6560',
                        fontWeight: entry.highlight ? 600 : 400,
                      }}
                    >
                      {entry.label}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: entry.accent ? '#4ADE80' : '#6B6560',
                        fontWeight: entry.accent ? 700 : 400,
                      }}
                    >
                      {entry.value}
                    </span>
                  </div>
                ))}

                {/* Cursor */}
                {visible < LOG_ENTRIES.length && started && (
                  <div style={{ padding: '6px 24px', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 2,
                        height: 14,
                        background: '#D6A84F',
                        animation: 'lp-blink 1s step-end infinite',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
