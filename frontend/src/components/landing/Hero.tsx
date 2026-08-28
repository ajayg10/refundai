import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  '✓ Customer found',
  '✓ Order verified',
  '✓ Payment verified',
  '✓ Refund history checked',
  '✓ Policy retrieved',
]

// Generated cinematic frames — used as animated slideshow background
// Falls back gracefully when hero-video.mp4 is present (video takes priority)
const BG_FRAMES = [
  '/hero-bg-1.jpg',
  '/hero-bg-2.jpg',
  '/hero-bg-3.jpg',
  '/hero-bg-4.jpg',
  '/hero-bg-5.jpg',
]
const FRAME_DURATION = 4000 // ms each frame stays visible
const FADE_DURATION = 1200  // ms crossfade

export function Hero() {
  const navigate = useNavigate()
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [activeFrame, setActiveFrame] = useState(0)
  const [fadingFrame, setFadingFrame] = useState<number | null>(null)
  const [hasVideo, setHasVideo] = useState(false)

  // Step-by-step investigation reveal
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleSteps(v => {
        if (v >= STEPS.length) { clearInterval(timer); return v }
        return v + 1
      })
    }, 600)
    return () => clearInterval(timer)
  }, [])

  // Slideshow cycling through cinematic frames
  useEffect(() => {
    if (hasVideo) return // skip if real video loaded
    const interval = setInterval(() => {
      setFadingFrame(activeFrame)
      setActiveFrame(prev => (prev + 1) % BG_FRAMES.length)
      setTimeout(() => setFadingFrame(null), FADE_DURATION)
    }, FRAME_DURATION)
    return () => clearInterval(interval)
  }, [activeFrame, hasVideo])

  return (
    <section
      id="hero"
      aria-label="Hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: '#080808',
      }}
    >
      {/* ── Cinematic frame slideshow (background layer) ── */}
      {!hasVideo && BG_FRAMES.map((src, i) => (
        <div
          key={src}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === activeFrame ? 0.22 : i === fadingFrame ? 0.12 : 0,
            transition: `opacity ${FADE_DURATION}ms ease`,
            // Ken Burns slow zoom on active frame
            transform: i === activeFrame ? 'scale(1.06)' : 'scale(1)',
            transitionProperty: 'opacity, transform',
            transitionDuration: `${FADE_DURATION}ms, ${FRAME_DURATION + FADE_DURATION}ms`,
            transitionTimingFunction: 'ease, linear',
            zIndex: 0,
          }}
        />
      ))}

      {/* ── Real video element: auto-activates when /hero-video.mp4 is present ── */}
      <video
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
        onCanPlay={() => setHasVideo(true)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: hasVideo ? 0.22 : 0,
          transition: 'opacity 1.5s ease',
          zIndex: 0,
        }}
      >
        {/* Drop hero-video.mp4 into /public to activate — no code changes needed */}
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlays */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,8,8,0.60) 0%, rgba(8,8,8,0.35) 40%, rgba(8,8,8,0.80) 80%, #080808 100%)',
          zIndex: 1,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(214,168,79,0.04) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1200,
          margin: '0 auto',
          padding: '120px 32px 80px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 420px',
          gap: 64,
          alignItems: 'center',
        }}
        className="hero-grid"
      >
        {/* Left: Text */}
        <div>
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 32,
              opacity: 0,
              animation: 'lp-fadeUp 0.7s ease 0.2s forwards',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D6A84F', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#9A9488', textTransform: 'uppercase' }}>
              AI Refund Decision Agent
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(48px, 7vw, 96px)',
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: '-0.04em',
              color: '#F5F0E8',
              margin: '0 0 28px',
              opacity: 0,
              animation: 'lp-fadeUp 0.7s ease 0.35s forwards',
            }}
          >
            AI investigates.
            <br />
            <span style={{ color: '#D6A84F' }}>Humans</span> decide.
          </h1>

          {/* Supporting copy */}
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.65,
              color: '#9A9488',
              maxWidth: 520,
              margin: '0 0 12px',
              fontWeight: 400,
              opacity: 0,
              animation: 'lp-fadeUp 0.7s ease 0.5s forwards',
            }}
          >
            Automate refund investigations without giving AI the final say.
          </p>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: '#6B6560',
              maxWidth: 500,
              margin: '0 0 44px',
              fontWeight: 400,
              opacity: 0,
              animation: 'lp-fadeUp 0.7s ease 0.6s forwards',
            }}
          >
            RefundGuard investigates refund requests, gathers customer and order context,
            checks policy, calculates the refund and recommends what to do — while keeping
            the actual refund behind human approval.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              marginBottom: 56,
              opacity: 0,
              animation: 'lp-fadeUp 0.7s ease 0.75s forwards',
            }}
          >
            <button
              id="hero-try-refundguard"
              onClick={() => navigate('/dashboard')}
              style={{
                background: '#D6A84F',
                color: '#0B0B0A',
                border: 'none',
                borderRadius: 6,
                padding: '13px 28px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.01em',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Try RefundGuard
            </button>
            <button
              id="hero-see-how"
              onClick={() => { const el = document.querySelector('#how-it-works'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }}
              style={{
                background: 'transparent',
                color: '#9A9488',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
                padding: '13px 28px',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#F5F0E8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9A9488'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
            >
              See How It Works
            </button>
          </div>

          {/* Powered by TrueForge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              opacity: 0,
              animation: 'lp-fadeUp 0.7s ease 0.9s forwards',
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#D6A84F' }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#6B6560', textTransform: 'uppercase' }}>
              Powered by TrueForge
            </span>
          </div>
        </div>

        {/* Right: Investigation panel */}
        <div
          style={{
            background: 'rgba(16,16,15,0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: 28,
            backdropFilter: 'blur(12px)',
            opacity: 0,
            animation: 'lp-fadeUp 0.8s ease 0.5s forwards',
          }}
          className="hero-panel"
        >
          {/* Request header */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: '#6B6560', textTransform: 'uppercase', marginBottom: 10 }}>
              Refund Request
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 600, color: '#D6A84F' }}>ORD-1042</span>
              <span style={{ fontSize: 11, color: '#6B6560' }}>·</span>
              <span style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: '#F5F0E8' }}>$149.00</span>
            </div>
            <div style={{ fontSize: 13, color: '#9A9488' }}>Damaged headphones</div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />

          {/* Investigating indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#D6A84F',
                display: 'inline-block',
                animation: visibleSteps < STEPS.length ? 'lp-pulse 1.2s ease-in-out infinite' : 'none',
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#9A9488', textTransform: 'uppercase' }}>
              {visibleSteps >= STEPS.length ? 'Investigation Complete' : 'AI Investigating...'}
            </span>
          </div>

          {/* Tool call steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {STEPS.map((step, i) => (
              <div
                key={step}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: visibleSteps > i ? '#4ADE80' : '#3A3630',
                  transition: 'color 0.4s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 12 }}>{step}</span>
              </div>
            ))}
          </div>

          {/* Result */}
          {visibleSteps >= STEPS.length && (
            <div
              style={{
                marginTop: 20,
                padding: '12px 16px',
                background: 'rgba(74,222,128,0.06)',
                border: '1px solid rgba(74,222,128,0.15)',
                borderRadius: 8,
                animation: 'lp-fadeUp 0.5s ease forwards',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#6B6560', textTransform: 'uppercase' }}>
                  Recommendation
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#4ADE80', letterSpacing: '0.06em' }}>ELIGIBLE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: '#F5F0E8' }}>$149.00</span>
                <span style={{ fontSize: 11, color: '#4ADE80', fontWeight: 600 }}>LOW RISK</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          opacity: 0,
          animation: 'lp-fadeUp 0.7s ease 1.5s forwards',
        }}
        aria-hidden="true"
      >
        <span style={{ fontSize: 10, letterSpacing: '0.12em', color: '#6B6560', textTransform: 'uppercase' }}>Scroll</span>
        <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(214,168,79,0.5), transparent)' }} />
      </div>
    </section>
  )
}
