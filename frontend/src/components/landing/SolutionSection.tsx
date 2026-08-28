import { Reveal } from './Reveal'

const STAGES = [
  { num: '01', label: 'Receive request', ai: true },
  { num: '02', label: 'Retrieve context', ai: true },
  { num: '03', label: 'Check policy', ai: true },
  { num: '04', label: 'Analyze case', ai: true },
  { num: '05', label: 'Calculate refund', ai: true },
  { num: '06', label: 'Request approval', boundary: true },
  { num: '07', label: 'Execute safely', ai: false },
]

export function SolutionSection() {
  return (
    <section id="how-it-works" style={{ background: '#080808', padding: '120px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }} className="solution-grid">
            {/* Left */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#D6A84F', textTransform: 'uppercase', marginBottom: 16 }}>
                The Solution
              </div>
              <h2 style={{ fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#F5F0E8', margin: '0 0 20px' }}>
                Let the agent do the investigation.
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: '#6B6560', margin: 0 }}>
                RefundGuard gathers the evidence needed to evaluate a refund before a support
                employee makes the final decision.
              </p>

              {/* AI vs Human boundary legend */}
              <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(214,168,79,0.3)', border: '1px solid rgba(214,168,79,0.4)', display: 'inline-block' }} />
                  <span style={{ fontSize: 12, color: '#9A9488', fontWeight: 500 }}>AI-automated investigation</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.3)', display: 'inline-block' }} />
                  <span style={{ fontSize: 12, color: '#9A9488', fontWeight: 500 }}>Human authorization required</span>
                </div>
              </div>
            </div>

            {/* Right: Pipeline */}
            <div>
              {STAGES.map((stage, i) => (
                <Reveal key={stage.num} delay={i * 80} direction="right">
                  <div style={{ position: 'relative' }}>
                    {/* Connector line */}
                    {i < STAGES.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 19,
                          top: 40,
                          width: 1,
                          height: stage.boundary ? 32 : 16,
                          background: stage.boundary
                            ? 'linear-gradient(to bottom, rgba(214,168,79,0.3), rgba(74,222,128,0.3))'
                            : 'rgba(255,255,255,0.06)',
                          zIndex: 0,
                        }}
                      />
                    )}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '12px 0',
                        marginBottom: stage.boundary ? 8 : 0,
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 8,
                          background: stage.boundary
                            ? 'rgba(214,168,79,0.12)'
                            : stage.ai
                              ? 'rgba(214,168,79,0.07)'
                              : 'rgba(74,222,128,0.07)',
                          border: `1px solid ${stage.boundary ? 'rgba(214,168,79,0.3)' : stage.ai ? 'rgba(255,255,255,0.06)' : 'rgba(74,222,128,0.2)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: 11,
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: stage.boundary ? '#D6A84F' : stage.ai ? '#6B6560' : '#4ADE80',
                        }}
                      >
                        {stage.num}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: stage.boundary ? '#D6A84F' : stage.ai ? '#9A9488' : '#4ADE80' }}>
                          {stage.label}
                        </div>
                        {stage.boundary && (
                          <div style={{ fontSize: 11, color: '#6B6560', marginTop: 2, letterSpacing: '0.08em', fontWeight: 600 }}>
                            ── HUMAN AUTHORIZATION ──
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
