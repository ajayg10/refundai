import { Reveal } from './Reveal'

const TIMELINE = [
  { label: 'Request received', done: true },
  { label: 'Customer verified', done: true },
  { label: 'Order verified', done: true },
  { label: 'Payment verified', done: true },
  { label: 'Refund history checked', done: true },
  { label: 'Policy verified', done: true },
  { label: 'Refund calculated', done: true },
]

export function ProductShowcase() {
  return (
    <section style={{ background: '#0B0B0A', padding: '120px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#D6A84F', textTransform: 'uppercase', marginBottom: 16 }}>
              Product
            </div>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#F5F0E8', margin: 0 }}>
              From request to recommendation.
            </h2>
          </div>
        </Reveal>

        {/* Dashboard mockup */}
        <Reveal delay={100}>
          <div
            style={{
              background: '#0D0D0C',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            {/* Dashboard header bar */}
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D6A84F' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#F5F0E8', letterSpacing: '-0.01em' }}>REFUNDGUARD</span>
                <span style={{ fontSize: 11, color: '#4A4640', marginLeft: 8 }}>Refund Investigation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#D6A84F',
                    background: 'rgba(214,168,79,0.08)',
                    border: '1px solid rgba(214,168,79,0.2)',
                    borderRadius: 4,
                    padding: '3px 10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Awaiting approval
                </span>
              </div>
            </div>

            {/* Main dashboard body */}
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 480 }} className="dashboard-grid">
              {/* Left sidebar */}
              <div
                style={{
                  borderRight: '1px solid rgba(255,255,255,0.05)',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                }}
              >
                <div>
                  <div style={{ fontSize: 10, color: '#4A4640', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Request</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: '#D6A84F' }}>ORD-1042</div>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.04)' }} />
                <div>
                  <div style={{ fontSize: 10, color: '#4A4640', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Customer</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#F5F0E8' }}>Alice Johnson</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#4A4640', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Amount</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 800, color: '#F5F0E8' }}>$149.00</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#4A4640', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Reason</div>
                  <div style={{ fontSize: 13, color: '#9A9488', lineHeight: 1.5 }}>Damaged product</div>
                </div>

                <div style={{ height: 1, background: 'rgba(255,255,255,0.04)' }} />

                {/* Timeline */}
                <div>
                  <div style={{ fontSize: 10, color: '#4A4640', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Timeline</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {TIMELINE.map((item, i) => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 10, color: '#4ADE80' }}>✓</span>
                        <span style={{ fontSize: 11, color: '#6B6560' }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: AI Recommendation */}
              <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ fontSize: 10, color: '#4A4640', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                  AI Recommendation
                </div>

                {/* Main recommendation card */}
                <div
                  style={{
                    padding: '24px 28px',
                    background: 'rgba(74,222,128,0.04)',
                    border: '1px solid rgba(74,222,128,0.12)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#4ADE80', letterSpacing: '0.1em', marginBottom: 6 }}>APPROVE REFUND</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 36, fontWeight: 800, color: '#F5F0E8', letterSpacing: '-0.02em' }}>$149.00</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#4ADE80',
                        background: 'rgba(74,222,128,0.1)',
                        border: '1px solid rgba(74,222,128,0.2)',
                        borderRadius: 4,
                        padding: '4px 12px',
                        letterSpacing: '0.08em',
                        display: 'block',
                        marginBottom: 8,
                      }}
                    >
                      LOW RISK
                    </span>
                  </div>
                </div>

                {/* Reasoning */}
                <div
                  style={{
                    padding: '16px 20px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 8,
                    borderLeft: '3px solid rgba(214,168,79,0.35)',
                  }}
                >
                  <div style={{ fontSize: 10, color: '#4A4640', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Reasoning</div>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: '#9A9488', margin: 0, fontStyle: 'italic' }}>
                    "The order is 7 days old and the damaged-product policy allows a 100% refund within 30 days. No previous refunds found. Risk is low."
                  </p>
                </div>

                {/* Policy match */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {[
                    { label: 'Policy', value: 'Damaged product' },
                    { label: 'Within', value: '30 days' },
                    { label: 'Order age', value: '7 days ✓' },
                  ].map(item => (
                    <div
                      key={item.label}
                      style={{
                        padding: '12px 14px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 8,
                      }}
                    >
                      <div style={{ fontSize: 10, color: '#4A4640', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{item.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#9A9488' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
