import { useEffect, useRef, useState } from 'react'

const LINES = [
  { text: 'AI investigates.', delay: 0 },
  { text: 'AI recommends.', delay: 300 },
  { text: 'Human approves.', delay: 600, amber: true },
  { text: 'System executes.', delay: 900 },
]

export function CorePrinciple() {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const timers = LINES.map((line, i) =>
      setTimeout(() => setVisibleCount(i + 1), line.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [started])

  return (
    <section
      ref={ref}
      style={{
        background: '#0B0B0A',
        padding: '140px 32px',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#6B6560', textTransform: 'uppercase', marginBottom: 64, textAlign: 'center' }}>
          Core Principle
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {LINES.map((line, i) => (
            <div
              key={line.text}
              style={{
                fontSize: 'clamp(32px, 6vw, 80px)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                color: line.amber ? '#D6A84F' : '#F5F0E8',
                opacity: visibleCount > i ? 1 : 0,
                transform: visibleCount > i ? 'none' : 'translateX(-20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
            >
              {line.amber ? (
                <>
                  <span style={{ color: '#9A9488' }}>Human</span>{' '}
                  <span style={{ color: '#D6A84F' }}>approves.</span>
                </>
              ) : (
                line.text
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
