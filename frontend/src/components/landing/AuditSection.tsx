import { Reveal } from './Reveal'

const AUDIT_ROWS = [
  { label: 'Request', value: 'ORD-1042', mono: true },
  { label: 'Customer', value: 'Alice Johnson' },
  { label: 'Recommendation', value: 'APPROVE', accent: true },
  { label: 'Refund amount', value: '$149.00', mono: true },
  { label: 'Approved by', value: 'Support Agent' },
  { label: 'Action', value: 'Refund processed' },
  { label: 'Timestamp', value: '09:41:18', mono: true },
]

export function AuditSection() {
  return (
    <section style={{ background: '#0B0B0A', padding: '120px 32px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <Reveal>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#D6A84F', textTransform: 'uppercase', marginBottom: 16 }}>
              Audit Log
            </div>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#F5F0E8', margin: 0 }}>
              Every decision leaves a trail.
            </h2>
            <p style={{ marginTop: 16, fontSize: 15, lineHeight: 1.7, color: '#6B6560', maxWidth: 440 }}>
              A complete record of every investigation, recommendation, human decision and executed action.
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div
            style={{
              background: '#0D0D0C',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '14px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#9A9488', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Audit Record · RF-1042
              </span>
              <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 11, color: '#3A3630' }}>COMPLETED</span>
            </div>

            {/* Rows */}
            <div style={{ padding: '8px 0' }}>
              {AUDIT_ROWS.map((row, i) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    padding: '12px 24px',
                    borderBottom: i < AUDIT_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.035)' : 'none',
                  }}
                >
                  <span style={{ fontSize: 12, color: '#4A4640' }}>{row.label}</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: row.mono ? 'monospace' : 'inherit',
                      color: row.accent ? '#4ADE80' : '#9A9488',
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div
              style={{
                padding: '14px 24px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.01)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 11, color: '#3A3630' }}>
                Immutable audit record. Every step in the investigation and approval chain is logged.
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
