import { useState } from 'react'
import { Reveal } from './Reveal'

type Stage = 'idle' | 'approving' | 'authorized' | 'processing' | 'processed' | 'audited'

const APPROVAL_STAGES: { key: Stage; label: string }[] = [
  { key: 'authorized', label: 'Authorization verified' },
  { key: 'processing', label: 'Processing refund' },
  { key: 'processed', label: 'Refund processed' },
  { key: 'audited', label: 'Audit log created' },
]

export function HumanApprovalSection() {
  const [stage, setStage] = useState<Stage>('idle')
  const [rejected, setRejected] = useState(false)

  const handleApprove = async () => {
    if (stage !== 'idle') return
    setStage('approving')
    await delay(700)
    setStage('authorized')
    await delay(800)
    setStage('processing')
    await delay(900)
    setStage('processed')
    await delay(700)
    setStage('audited')
  }

  const handleReject = () => {
    if (stage !== 'idle') return
    setRejected(true)
  }

  const handleReset = () => {
    setStage('idle')
    setRejected(false)
  }

  const stageIndex = APPROVAL_STAGES.findIndex(s => s.key === stage)

  return (
    <section id="safety" style={{ background: '#080808', padding: '120px 32px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#D6A84F', textTransform: 'uppercase', marginBottom: 16 }}>
              Human in the Loop
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 60px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.08, color: '#F5F0E8', margin: 0 }}>
              AI can recommend.
              <br />
              Only a <span style={{ color: '#D6A84F' }}>human</span> can approve.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div
            style={{
              background: '#0D0D0C',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            {/* AI Recommendation header */}
            <div
              style={{
                padding: '24px 32px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: '#6B6560', textTransform: 'uppercase', marginBottom: 16 }}>
                AI Recommendation
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#4ADE80', letterSpacing: '0.1em', marginBottom: 4 }}>APPROVE</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 28, fontWeight: 800, color: '#F5F0E8', letterSpacing: '-0.02em' }}>$149</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
                    <span style={{ fontSize: 12, color: '#6B6560' }}>Risk</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#4ADE80' }}>LOW</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
                    <span style={{ fontSize: 12, color: '#6B6560' }}>Policy</span>
                    <span style={{ fontSize: 12, color: '#9A9488' }}>Damaged product eligible</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Human approval boundary */}
            <div
              style={{
                padding: '0 32px',
                position: 'relative',
                margin: '0',
              }}
            >
              <div
                style={{
                  height: 1,
                  background: 'linear-gradient(to right, transparent, rgba(214,168,79,0.4), transparent)',
                  margin: 0,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: '#0D0D0C',
                  padding: '4px 20px',
                  border: '1px solid rgba(214,168,79,0.25)',
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: '#D6A84F',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                Human Approval Required
              </div>
            </div>

            {/* Approval UI */}
            <div style={{ padding: '32px 32px 32px' }}>
              {stage === 'idle' && !rejected && (
                <>
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 15, color: '#9A9488', margin: 0, fontWeight: 500 }}>
                      Approve refund of{' '}
                      <span style={{ fontFamily: 'monospace', color: '#F5F0E8', fontWeight: 700 }}>$149</span>{' '}
                      to <span style={{ color: '#F5F0E8', fontWeight: 600 }}>Alice Johnson</span>?
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button
                      id="approval-reject-btn"
                      onClick={handleReject}
                      style={{
                        background: 'rgba(239,68,68,0.08)',
                        color: '#EF4444',
                        border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: 8,
                        padding: '12px 28px',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        letterSpacing: '0.01em',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.14)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                    >
                      Reject
                    </button>
                    <button
                      id="approval-approve-btn"
                      onClick={handleApprove}
                      style={{
                        background: '#166534',
                        color: '#4ADE80',
                        border: '1px solid rgba(74,222,128,0.25)',
                        borderRadius: 8,
                        padding: '12px 32px',
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: 'pointer',
                        letterSpacing: '0.02em',
                        transition: 'background 0.2s',
                        flex: 1,
                        maxWidth: 240,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#15803d')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#166534')}
                    >
                      Approve Refund →
                    </button>
                  </div>
                </>
              )}

              {rejected && (
                <div
                  style={{
                    padding: '20px 24px',
                    background: 'rgba(239,68,68,0.05)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    borderRadius: 10,
                    animation: 'lp-fadeUp 0.4s ease forwards',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#EF4444', marginBottom: 6, letterSpacing: '0.06em' }}>REFUND REJECTED</div>
                  <div style={{ fontSize: 13, color: '#9A9488' }}>The refund request has been denied by the support agent.</div>
                  <button
                    onClick={handleReset}
                    style={{
                      marginTop: 14,
                      background: 'none',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 6,
                      padding: '7px 16px',
                      fontSize: 12,
                      color: '#9A9488',
                      cursor: 'pointer',
                    }}
                  >
                    Reset demo
                  </button>
                </div>
              )}

              {stage !== 'idle' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { key: 'approving', label: 'Approval received' },
                    ...APPROVAL_STAGES,
                  ].map((s, i) => {
                    const allStages: Stage[] = ['approving', 'authorized', 'processing', 'processed', 'audited']
                    const currentIdx = allStages.indexOf(stage)
                    const thisIdx = allStages.indexOf(s.key as Stage)
                    const done = currentIdx >= thisIdx
                    const active = currentIdx === thisIdx

                    return (
                      <div
                        key={s.key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          opacity: done ? 1 : 0.2,
                          transition: 'opacity 0.5s ease',
                        }}
                      >
                        <span style={{ fontSize: 14, color: '#4ADE80' }}>{done ? '✓' : '○'}</span>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: done ? 600 : 400,
                            color: active && stage !== 'audited' ? '#D6A84F' : done ? '#F5F0E8' : '#6B6560',
                          }}
                        >
                          {s.label}
                          {active && stage !== 'audited' && (
                            <span
                              style={{
                                display: 'inline-block',
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: '#D6A84F',
                                marginLeft: 8,
                                animation: 'lp-pulse 0.8s ease-in-out infinite',
                              }}
                            />
                          )}
                        </span>
                      </div>
                    )
                  })}

                  {stage === 'audited' && (
                    <button
                      onClick={handleReset}
                      style={{
                        marginTop: 8,
                        background: 'none',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 6,
                        padding: '7px 16px',
                        fontSize: 12,
                        color: '#9A9488',
                        cursor: 'pointer',
                        alignSelf: 'flex-start',
                      }}
                    >
                      Reset demo
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
