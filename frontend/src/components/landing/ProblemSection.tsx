import { useEffect, useRef, useState } from 'react'
import { Reveal } from './Reveal'

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */

const INVESTIGATION_NODES = [
  { label: 'Customer', icon: '→' },
  { label: 'Order', icon: '→' },
  { label: 'Payment', icon: '→' },
  { label: 'Refund History', icon: '→' },
  { label: 'Policy', icon: '→' },
]

const MANUAL_STEPS = [
  { num: '01', label: 'Find the customer', desc: 'Check identity, account status' },
  { num: '02', label: 'Check the order', desc: 'Verify product, amount, date' },
  { num: '03', label: 'Verify payment', desc: 'Confirm transaction status' },
  { num: '04', label: 'Check history', desc: 'Review past refund patterns' },
  { num: '05', label: 'Read the policy', desc: 'Interpret eligibility rules' },
  { num: '06', label: 'Make a decision', desc: 'Calculate and approve or deny' },
]

/* ─────────────────────────────────────────
   WORKFLOW DIAGRAM — triggers on scroll
───────────────────────────────────────── */
function WorkflowDiagram() {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.25 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const nodeVisible = (index: number) =>
    started ? { opacity: 1, transform: 'none' } : { opacity: 0, transform: 'translateY(10px)' }

  const nodeTransition = (delayMs: number) =>
    `opacity 0.5s ease ${delayMs}ms, transform 0.5s ease ${delayMs}ms`

  return (
    <div ref={ref} className="problem-workflow">
      {/* ── TOP NODE: Refund Request ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            ...nodeVisible(0),
            transition: nodeTransition(80),
            padding: '10px 28px',
            background: 'rgba(214,168,79,0.07)',
            border: '1px solid rgba(214,168,79,0.28)',
            borderRadius: 7,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#D6A84F',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          Refund Request
        </div>

        {/* Connector line down */}
        <div
          style={{
            width: 1,
            height: 24,
            background: 'rgba(214,168,79,0.2)',
            transition: `height 0.4s ease 220ms`,
          }}
        />

        {/* ── INVESTIGATION CLUSTER ── */}
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10,
            overflow: 'hidden',
            width: '100%',
          }}
        >
          {/* Cluster header */}
          <div
            style={{
              padding: '7px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(255,255,255,0.025)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#3A3630', display: 'inline-block' }} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: '#4A4640', textTransform: 'uppercase' }}>
              Investigation
            </span>
          </div>

          {/* Cluster items */}
          {INVESTIGATION_NODES.map((node, i) => (
            <div
              key={node.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderBottom: i < INVESTIGATION_NODES.length - 1
                  ? '1px solid rgba(255,255,255,0.04)'
                  : 'none',
                background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                ...nodeVisible(i),
                transition: nodeTransition(180 + i * 80),
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 500, color: '#9A9488' }}>
                {node.label}
              </span>
              <span style={{ fontSize: 10, color: '#3A3630' }}>retrieve</span>
            </div>
          ))}
        </div>

        {/* Connector line down */}
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.07)' }} />

        {/* ── SUPPORT EMPLOYEE ── */}
        <div
          style={{
            ...nodeVisible(INVESTIGATION_NODES.length),
            transition: nodeTransition(180 + INVESTIGATION_NODES.length * 80),
            padding: '10px 28px',
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 7,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.06em',
            color: '#9A9488',
            textTransform: 'uppercase',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          Support Employee
        </div>

        {/* Connector line down */}
        <div
          style={{
            width: 1,
            height: 24,
            background: 'rgba(255,255,255,0.07)',
          }}
        />
        <span style={{ fontSize: 10, color: '#3A3630', lineHeight: 1, marginBottom: 2 }}>▼</span>

        {/* ── DECISION ── */}
        <div
          style={{
            ...nodeVisible(INVESTIGATION_NODES.length + 1),
            transition: nodeTransition(180 + (INVESTIGATION_NODES.length + 1) * 80),
            padding: '10px 28px',
            width: '100%',
            background: 'rgba(214,168,79,0.06)',
            border: '1px solid rgba(214,168,79,0.22)',
            borderRadius: 7,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#D6A84F',
            textTransform: 'uppercase',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          Decision
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   STEP CARD
───────────────────────────────────────── */
function StepCard({ num, label, desc, delay }: { num: string; label: string; desc: string; delay: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Reveal delay={delay} direction="up">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: '18px 20px',
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.055)'}`,
          borderRadius: 8,
          transition: 'border-color 0.25s ease',
          height: '100%',
          boxSizing: 'border-box',
          cursor: 'default',
        }}
      >
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 10,
            fontWeight: 700,
            color: '#3A3630',
            letterSpacing: '0.1em',
            marginBottom: 10,
          }}
        >
          {num}
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: hovered ? '#F5F0E8' : '#9A9488',
            marginBottom: 5,
            lineHeight: 1.3,
            transition: 'color 0.25s ease',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 12,
            color: '#4A4640',
            lineHeight: 1.55,
          }}
        >
          {desc}
        </div>
      </div>
    </Reveal>
  )
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export function ProblemSection() {
  return (
    <section id="product" style={{ background: '#0B0B0A', padding: '120px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ══════════════════════════════════
            LAYER 1 + 2 — two-column layout
        ══════════════════════════════════ */}
        <div className="problem-two-col">

          {/* LEFT — statement */}
          <div className="problem-left">
            <Reveal>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  color: '#D6A84F',
                  textTransform: 'uppercase',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#D6A84F', display: 'inline-block', flexShrink: 0 }} />
                The Problem
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2
                style={{
                  fontSize: 'clamp(28px, 4vw, 52px)',
                  fontWeight: 800,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.08,
                  color: '#F5F0E8',
                  margin: '0 0 24px',
                }}
              >
                A refund request takes more work than it seems.
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.72,
                  color: '#6B6560',
                  margin: 0,
                  maxWidth: 400,
                }}
              >
                What looks like a simple refund request usually requires a support
                employee to jump between customer records, orders, payments, refund
                history and policy documents before making a decision.
              </p>
            </Reveal>

            {/* Small annotation on desktop */}
            <Reveal delay={280}>
              <div
                style={{
                  marginTop: 40,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
                className="problem-annotation"
              >
                <div
                  style={{
                    width: 1,
                    height: 40,
                    background: 'linear-gradient(to bottom, rgba(214,168,79,0.4), transparent)',
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                />
                <p style={{ fontSize: 12, color: '#4A4640', lineHeight: 1.65, margin: 0, maxWidth: 300 }}>
                  Each data source requires a separate lookup. A single request can
                  take minutes of manual context-switching before a decision is even
                  possible.
                </p>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — workflow diagram */}
          <div className="problem-right">
            <Reveal direction="right" delay={120}>
              <WorkflowDiagram />
            </Reveal>
          </div>
        </div>

        {/* ══════════════════════════════════
            LAYER 3 — manual steps grid
        ══════════════════════════════════ */}
        <div style={{ marginTop: 72 }}>
          {/* Section micro-label */}
          <Reveal>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  height: 1,
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  color: '#3A3630',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                Six steps. Every time. Manually.
              </span>
              <div
                style={{
                  height: 1,
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                }}
              />
            </div>
          </Reveal>

          <div className="problem-steps-grid">
            {MANUAL_STEPS.map((step, i) => (
              <StepCard
                key={step.num}
                num={step.num}
                label={step.label}
                desc={step.desc}
                delay={i * 55}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
