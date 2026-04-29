import { useEffect, useState } from 'react';

// Stage timeline:
//   0  → blank dark screen
//   1  (180ms)  → letters stagger in + rule draws from center
//   2  (980ms)  → all in, subtitle annotation fades up, glow breathes
//   3  (2000ms) → exit: letters scale+blur out, backdrop fades
//   4  (2750ms) → unmount

const LETTERS = ['N', 'O', 'X', 'X', 'E'];

export default function Preloader() {
  const [stage, setStage] = useState<0 | 1 | 2 | 3 | 4>(0);

  useEffect(() => {
    const a = window.setTimeout(() => setStage(1), 180);
    const b = window.setTimeout(() => setStage(2), 980);
    const c = window.setTimeout(() => setStage(3), 2100);
    const d = window.setTimeout(() => setStage(4), 2850);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); clearTimeout(d); };
  }, []);

  if (stage === 4) return null;

  const exiting  = stage === 3;
  const revealed = stage >= 2;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,   // just below cursor (9999) so cursor stays on top
        background: '#080808',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        // Exit: scale up + fade — no CSS filter; blur forces full-page repaint every
        // frame on a fullscreen element which tanks compositing on mid-tier GPUs.
        // Scale + fade alone reads as the same "camera zoom in" intent, for free.
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'scale(1.06)' : 'scale(1)',
        transition: exiting
          ? 'opacity 700ms cubic-bezier(0.77,0,0.175,1), transform 720ms cubic-bezier(0.77,0,0.175,1)'
          : 'none',
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      }}
    >
      {/* ── Ambient glow ─────────────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: [
            'radial-gradient(ellipse 55% 42% at 50% 50%, rgba(196,164,114,0.22) 0%, transparent 65%)',
            'radial-gradient(ellipse 35% 30% at 22% 30%, rgba(32,80,255,0.14) 0%, transparent 60%)',
            'radial-gradient(ellipse 30% 28% at 78% 68%, rgba(196,164,114,0.12) 0%, transparent 60%)',
          ].join(', '),
          opacity: revealed ? 1 : 0,
          transition: 'opacity 1400ms cubic-bezier(0.16,1,0.3,1)',
          /* filter:blur removed — compositing a blur on a fullscreen layer
             forces a per-frame repaint; large radial-gradients at low opacity
             produce the same soft glow with no filter cost */
          pointerEvents: 'none',
        }}
      />

      {/* ── Eyebrow rule + label ──────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 28,
          opacity: stage >= 1 ? 1 : 0,
          transition: 'opacity 600ms cubic-bezier(0.16,1,0.3,1) 200ms',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            height: 1,
            width: 32,
            background: 'rgba(196,164,114,0.55)',
            transformOrigin: 'left center',
            transform: stage >= 1 ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 700ms cubic-bezier(0.16,1,0.3,1) 300ms',
          }}
        />
        <span
          style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 9,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(245,245,240,0.35)',
            fontWeight: 500,
          }}
        >
          Studio · MMXXVI
        </span>
        <span
          style={{
            display: 'inline-block',
            height: 1,
            width: 32,
            background: 'rgba(196,164,114,0.55)',
            transformOrigin: 'right center',
            transform: stage >= 1 ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 700ms cubic-bezier(0.16,1,0.3,1) 300ms',
          }}
        />
      </div>

      {/* ── NOXXE — letter-by-letter stagger ─────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
          // Each letter needs its own clip — wrap the whole row in an overflow-hidden container
        }}
      >
        {LETTERS.map((letter, i) => (
          <div
            key={i}
            style={{
              overflow: 'hidden',
              // Small gap except between the two X's
              marginRight: i === 1 ? 2 : i < 4 ? 0 : 0,
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: '"Bodoni Moda", Didot, "Times New Roman", serif',
                fontSize: 'clamp(48px, 14vw, 160px)',
                lineHeight: 0.92,
                letterSpacing: '-0.01em',
                fontWeight: 500,
                color: '#F5F5F0',
                // Letter-by-letter stagger: slides up from below clip container
                transform: stage >= 1
                  ? 'translateY(0)'
                  : 'translateY(110%)',
                transition: stage >= 1
                  ? `transform 900ms cubic-bezier(0.16,1,0.3,1) ${80 + i * 60}ms`
                  : 'none',
                // Per-letter glow pulse when fully revealed
                textShadow: revealed
                  ? `0 0 ${40 + i * 8}px rgba(245,245,240,0.12), 0 0 80px rgba(196,164,114,0.06)`
                  : 'none',
              }}
            >
              {letter}
            </span>
          </div>
        ))}
      </div>

      {/* ── Horizontal rule — draws out from center ───────────────────── */}
      {/* Horizontal rule — uses scaleX instead of width transition to stay compositor-only */}
      <div
        style={{
          position: 'relative',
          height: 1,
          width: 'clamp(200px, 28vw, 380px)',
          marginTop: 20,
          overflow: 'visible',
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: '50%',
            display: 'block',
            height: 1,
            width: '100%',
            background: 'linear-gradient(to right, transparent 0%, rgba(196,164,114,0.6) 30%, rgba(196,164,114,0.6) 70%, transparent 100%)',
            transformOrigin: 'center center',
            transform: revealed
              ? 'translateX(-50%) scaleX(1)'
              : stage >= 1
                ? 'translateX(-50%) scaleX(0.28)'
                : 'translateX(-50%) scaleX(0)',
            transition: revealed
              ? 'transform 800ms cubic-bezier(0.16,1,0.3,1) 100ms'
              : stage >= 1
                ? 'transform 600ms cubic-bezier(0.16,1,0.3,1) 500ms'
                : 'none',
          }}
        />
      </div>

      {/* ── Subtitle annotation ───────────────────────────────────────── */}
      <div
        style={{
          marginTop: 18,
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(6px)',
          transition: revealed
            ? 'opacity 900ms cubic-bezier(0.16,1,0.3,1) 200ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) 200ms'
            : 'none',
        }}
      >
        <span
          style={{
            fontFamily: '"Bodoni Moda", Didot, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(11px, 1.2vw, 14px)',
            letterSpacing: '0.06em',
            color: 'rgba(245,245,240,0.28)',
            fontWeight: 400,
          }}
        >
          web design studio — by appointment only
        </span>
      </div>

      {/* ── Loading indicator — three dots pulse while stage < 2 ───────── */}
      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          display: 'flex',
          gap: 6,
          opacity: revealed ? 0 : stage >= 1 ? 1 : 0,
          transition: revealed ? 'opacity 400ms ease' : 'opacity 400ms ease 200ms',
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: 'rgba(196,164,114,0.5)',
              animation: 'preloader-dot 1.2s ease-in-out infinite',
              animationDelay: `${i * 200}ms`,
            }}
          />
        ))}
      </div>

      {/* ── Corner annotations ───────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '7%',
          right: '5%',
          textAlign: 'right',
          opacity: revealed ? 0.55 : 0,
          transition: 'opacity 1200ms ease 600ms',
        }}
      >
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 8, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.5)', lineHeight: 1.8 }}>
          Est. 2019
        </div>
        <div style={{ fontFamily: '"Bodoni Moda", serif', fontStyle: 'italic', fontSize: 10, letterSpacing: '0.04em', color: 'rgba(245,245,240,0.3)' }}>
          loading
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '7%',
          left: '5%',
          opacity: revealed ? 0.45 : 0,
          transition: 'opacity 1200ms ease 800ms',
        }}
      >
        <span style={{ fontFamily: '"Bodoni Moda", serif', fontStyle: 'italic', fontSize: 10, letterSpacing: '0.04em', color: 'rgba(245,245,240,0.3)' }}>
          — plate i.
        </span>
      </div>
    </div>
  );
}
