import { useEffect, useRef, useState } from 'react';

export default function LogoInterlude() {
  const sectionRef   = useRef<HTMLElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<'pre' | 'entering' | 'in' | 'leaving'>('pre');
  // Ref mirrors phase so the IO callback always reads the current value without
  // needing phase in its dependency array — prevents the observer from being
  // torn down and rebuilt on every phase transition (was 4× recreations per cycle).
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    const section = sectionRef.current;
    const video   = videoRef.current;
    if (!section || !video) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const current = phaseRef.current;
          if (e.intersectionRatio >= 0.15 && (current === 'pre' || current === 'leaving')) {
            // Upgrade preload to 'auto' so the browser fetches the full file
            // before play() is called, reducing stutter on first reveal.
            video.preload = 'auto';
            setPhase('entering');
            video.currentTime = 0;
            video.play().catch(() => {});
            requestAnimationFrame(() =>
              requestAnimationFrame(() => setPhase('in'))
            );
          } else if (e.intersectionRatio < 0.04 && current === 'in') {
            setPhase('leaving');
            video.pause();
            // fully reset after out-transition completes
            window.setTimeout(() => setPhase('pre'), 1400);
          }
        });
      },
      { threshold: [0, 0.04, 0.15, 0.5, 1] },
    );
    io.observe(section);
    return () => io.disconnect();
  // Empty dep array: observer is created once, reads phase via phaseRef.
  }, []);

  const revealed  = phase === 'in';
  const leaving   = phase === 'leaving';

  // Clip-path: entering collapses to a thin band, revealed expands full
  const clipPath = revealed
    ? 'inset(0% 0 0% 0)'
    : leaving
      ? 'inset(45% 0 45% 0)'
      : 'inset(45% 0 45% 0)';

  // Transition for clip-path: long on enter, short on leave
  const clipTransition = revealed
    ? 'clip-path 1800ms cubic-bezier(0.16,1,0.3,1) 200ms'
    : 'clip-path 900ms cubic-bezier(0.77,0,0.175,1)';

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#0d0d0d', minHeight: '100svh', contain: 'layout paint' }}
    >
      {/* ── Ambient bloom ─────────────────────────────────────────────── */}
      {/* Blur filters intentionally removed from all glow divs — each CSS
          blur() forces a separate compositor rasterisation pass. The radial
          gradients already produce a soft diffused look at these low opacities;
          the visual difference is imperceptible but the GPU cost is eliminated. */}
      {/* Amber core glow — sits behind the logo, pulses at peak */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(196,164,114,0.32) 0%, rgba(196,164,114,0.10) 50%, transparent 72%)',
          opacity: revealed ? 1 : 0,
          animation: revealed ? 'glow-pulse 800ms ease-out 1200ms 1 both' : 'none',
          transition: 'opacity 3000ms cubic-bezier(0.16,1,0.3,1) 300ms',
        }}
      />
      {/* Wide outer haze — makes the center feel lit */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 80% at 50% 50%, rgba(196,164,114,0.07) 0%, transparent 68%)',
          opacity: revealed ? 1 : 0,
          transition: 'opacity 3600ms cubic-bezier(0.16,1,0.3,1) 500ms',
        }}
      />
      {/* Electric accent — offset top-left */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: '-15%', left: '-8%',
          width: '65%', height: '65%',
          background:
            'radial-gradient(ellipse at center, rgba(32,80,255,0.15) 0%, transparent 68%)',
          opacity: revealed ? 1 : 0,
          transition: 'opacity 3800ms cubic-bezier(0.16,1,0.3,1) 700ms',
        }}
      />
      {/* Warm halo — bottom-right */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          bottom: '-12%', right: '-6%',
          width: '60%', height: '60%',
          background:
            'radial-gradient(ellipse at center, rgba(196,164,114,0.17) 0%, transparent 68%)',
          opacity: revealed ? 1 : 0,
          transition: 'opacity 3800ms cubic-bezier(0.16,1,0.3,1) 900ms',
        }}
      />

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="relative flex flex-col items-center justify-center" style={{ minHeight: '100svh', padding: '80px 0' }}>

        {/* Outer reveal wrapper — opacity + transform + clip-path only.
            filter intentionally absent: even filter:blur(0px) creates an
            isolated compositing stacking context, which forces per-frame
            software compositing of the video's mix-blend-mode:screen — the
            single biggest source of lag on this section. Removing filter lets
            the compositor handle the blend at the GPU layer directly. */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '100%',
            opacity: revealed ? 1 : 0,
            transform: revealed
              ? 'scale(1) translateY(0)'
              : leaving
                ? 'scale(0.95) translateY(20px)'
                : 'scale(0.92) translateY(-28px)',
            clipPath,
            transition: revealed
              ? [
                  'opacity 2000ms cubic-bezier(0.16,1,0.3,1) 80ms',
                  'transform 2400ms cubic-bezier(0.16,1,0.3,1) 80ms',
                  clipTransition,
                ].join(', ')
              : [
                  'opacity 900ms cubic-bezier(0.77,0,0.175,1)',
                  'transform 900ms cubic-bezier(0.77,0,0.175,1)',
                  clipTransition,
                ].join(', '),
          }}
        >
          {/* Ambient glow inside the wrapper — mirrors section-level glow so
              screen-blending looks consistent across the entire section.
              No filter:blur — would add a 6th compositor rasterisation pass. */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: '-40%',
              background: [
                'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(196,164,114,0.36) 0%, rgba(196,164,114,0.10) 55%, transparent 75%)',
                'radial-gradient(ellipse 60% 55% at 18% 5%, rgba(32,80,255,0.18) 0%, transparent 65%)',
                'radial-gradient(ellipse 55% 50% at 82% 95%, rgba(196,164,114,0.15) 0%, transparent 65%)',
              ].join(', '),
              pointerEvents: 'none',
            }}
          />

          {/* Video — inverted ink → white logo; screen blend makes bg invisible */}
          <video
            ref={videoRef}
            className="w-full"
            src="/videos/logo-paint.mp4"
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            {...({ 'webkit-playsinline': 'true' } as any)}
            style={{
              display: 'block',
              position: 'relative',
              mixBlendMode: 'screen',
              filter: 'invert(1) contrast(3.5) brightness(0.78)',
              // GPU layer promotion for smooth playback
              transform: 'translate3d(0,0,0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          />

          {/* Edge vignette — four narrow fades erase the video's hard
              rectangular boundary; the exact bg colour makes it seamless */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background: [
                'linear-gradient(to bottom, #0d0d0d 0%, transparent 12%)',
                'linear-gradient(to top,    #0d0d0d 0%, transparent 12%)',
              ].join(', '),
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
        </div>

        {/* ── Horizontal rule — scaleX instead of width transition (compositor-only) ──── */}
        <div
          aria-hidden
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 0,
            height: 1,
            width: '60px',
            overflow: 'visible',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              height: 1,
              width: '100%',
              background: 'rgba(196,164,114,0.4)',
              transformOrigin: 'center center',
              transform: revealed ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
              transition: revealed
                ? 'transform 600ms cubic-bezier(0.16,1,0.3,1) 2000ms'
                : 'transform 400ms cubic-bezier(0.77,0,0.175,1)',
            }}
          />
        </div>

      </div>

      {/* ── Designer annotations ────────────────────────────────────────── */}
      <div
        aria-hidden
        className="absolute top-[8%] left-[5%] pointer-events-none"
        style={{
          fontFamily: '"Bodoni Moda", Didot, serif',
          fontStyle: 'italic',
          fontSize: 11,
          letterSpacing: '0.05em',
          color: 'rgba(245,245,240,0.3)',
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 1800ms ease 1400ms, transform 1800ms cubic-bezier(0.16,1,0.3,1) 1400ms',
        }}
      >
        plate iv. — wordmark study, ink on cotton
      </div>

      <div
        aria-hidden
        className="absolute top-[8%] right-[5%] pointer-events-none"
        style={{
          fontFamily: '"Bodoni Moda", Didot, serif',
          fontStyle: 'italic',
          fontSize: 13,
          letterSpacing: '0.2em',
          color: 'rgba(245,245,240,0.25)',
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 2000ms ease 1600ms, transform 2000ms cubic-bezier(0.16,1,0.3,1) 1600ms',
        }}
      >
        / MMXXVI
      </div>

      {/* Struck-out alternative */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: '13%',
          right: '7%',
          fontFamily: '"Bodoni Moda", Didot, serif',
          fontSize: 34,
          letterSpacing: '-0.03em',
          color: 'rgba(245,245,240,0.18)',
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 2400ms ease 1800ms, transform 2400ms cubic-bezier(0.16,1,0.3,1) 1800ms',
        }}
      >
        <span style={{ position: 'relative', display: 'inline-block' }}>
          Noxe
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: -2, right: -2, top: '52%',
              height: 1.5,
              background: 'rgba(245,245,240,0.35)',
              transform: 'rotate(-6deg)',
            }}
          />
        </span>
        <div
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 9,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            marginTop: 4,
            color: 'rgba(245,245,240,0.25)',
          }}
        >
          ↳ no
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-[8%] right-[5%] pointer-events-none"
        style={{
          textAlign: 'right',
          fontFamily: '"Bodoni Moda", Didot, serif',
          fontStyle: 'italic',
          fontSize: 10,
          letterSpacing: '0.04em',
          color: 'rgba(245,245,240,0.22)',
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 2400ms ease 2000ms, transform 2400ms cubic-bezier(0.16,1,0.3,1) 2000ms',
        }}
      >
        v. final — set in didone, 0.3pt hairline
      </div>

      {/* Measurement marks — left spine */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '3.5%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          opacity: revealed ? 0.4 : 0,
          transition: 'opacity 2800ms ease 2200ms',
        }}
      >
        {['x', '½', '⅓', '¼'].map((m) => (
          <span
            key={m}
            style={{
              fontFamily: '"Bodoni Moda", Didot, serif',
              fontStyle: 'italic',
              fontSize: 9,
              color: 'rgba(245,245,240,0.6)',
            }}
          >
            {m}
          </span>
        ))}
      </div>

      {/* ── Edge blends (section bg → transparent) ───────────────────── */}
      <div
        aria-hidden className="absolute inset-x-0 top-0 pointer-events-none"
        style={{ height: '22%', background: 'linear-gradient(to bottom, #0d0d0d 0%, transparent 100%)' }}
      />
      <div
        aria-hidden className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ height: '22%', background: 'linear-gradient(to top, #0d0d0d 0%, transparent 100%)' }}
      />
    </section>
  );
}
