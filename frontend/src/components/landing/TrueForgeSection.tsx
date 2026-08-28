import { Reveal } from './Reveal'

const CAPABILITIES = [
  'Agent orchestration',
  'Tool calling',
  'MCP integration',
  'Context management',
  'Sandbox execution',
  'Human approvals',
  'Session state',
  'Controlled actions',
  'Auditable workflows',
]

export function TrueForgeSection() {
  return (
    <section id="trueforge" style={{ background: '#080808', padding: '120px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }} className="trueforge-grid">
            {/* Left: text */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#D6A84F', textTransform: 'uppercase', marginBottom: 16 }}>
                Built with TrueForge
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#F5F0E8', margin: '0 0 20px' }}>
                An agent runtime for real actions.
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#6B6560', margin: '0 0 32px' }}>
                RefundGuard uses TrueForge to orchestrate the AI agent and its execution workflow —
                managing tool calls, session state, sandboxed execution, and human approval gates.
              </p>

              {/* Capability list */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {CAPABILITIES.map(cap => (
                  <span
                    key={cap}
                    style={{
                      padding: '6px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 20,
                      fontSize: 12,
                      color: '#9A9488',
                      fontWeight: 500,
                    }}
                  >
                    {cap}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
                <a
                  href="https://trueforge.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '10px 22px',
                    background: 'transparent',
                    border: '1px solid rgba(214,168,79,0.3)',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#D6A84F',
                    textDecoration: 'none',
                    letterSpacing: '0.02em',
                    transition: 'background 0.2s',
                    display: 'inline-block',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(214,168,79,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  Explore TrueForge
                </a>
                <a
                  href="https://github.com/truefoundry/trueforge"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '10px 22px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#9A9488',
                    textDecoration: 'none',
                    letterSpacing: '0.02em',
                    transition: 'color 0.2s',
                    display: 'inline-block',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F5F0E8')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#9A9488')}
                >
                  View on GitHub
                </a>
              </div>
            </div>

            {/* Right: architecture diagram */}
            <Reveal direction="right" delay={150}>
              <div
                style={{
                  background: '#0D0D0C',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12,
                  padding: '28px 24px',
                }}
              >
                <ArchNode label="REFUND REQUEST" top />
                <ArchArrow />
                <ArchNode label="REFUNDGUARD AGENT" amber />
                <ArchArrow />
                <ArchNode label="TRUEFORGE" gold />
                <ArchArrow />
                <ArchNode label="MCP TOOLS" />

                {/* Tool split */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
                  {['Customer', 'Order', 'Payment', 'History', 'Policy', 'Refund'].map(tool => (
                    <div
                      key={tool}
                      style={{
                        padding: '8px 10px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 6,
                        fontSize: 11,
                        color: '#6B6560',
                        textAlign: 'center',
                      }}
                    >
                      {tool}
                    </div>
                  ))}
                </div>

                <ArchArrow />
                <ArchNode label="HUMAN APPROVAL" amber />
                <ArchArrow />
                <ArchNode label="REFUND EXECUTION" green />
                <ArchArrow />
                <ArchNode label="AUDIT LOG" />
              </div>
            </Reveal>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ArchNode({ label, amber, gold, green, top }: { label: string; amber?: boolean; gold?: boolean; green?: boolean; top?: boolean }) {
  const style = amber
    ? { bg: 'rgba(214,168,79,0.06)', border: 'rgba(214,168,79,0.2)', color: '#D6A84F' }
    : gold
      ? { bg: 'rgba(214,168,79,0.1)', border: 'rgba(214,168,79,0.3)', color: '#D6A84F' }
      : green
        ? { bg: 'rgba(74,222,128,0.06)', border: 'rgba(74,222,128,0.2)', color: '#4ADE80' }
        : { bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.06)', color: '#9A9488' }
  return (
    <div
      style={{
        padding: '9px 16px',
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
        color: style.color,
        textAlign: 'center',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
  )
}

function ArchArrow() {
  return (
    <div style={{ textAlign: 'center', color: '#2A2A28', fontSize: 12, padding: '4px 0', lineHeight: 1 }}>↓</div>
  )
}
