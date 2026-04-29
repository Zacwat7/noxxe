import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Utility ──────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Project = {
  client: string;
  title: string;
  meta: string;
  year: string;
  metric: string;
  url: string;
  image: string;
  video?: string;
  fallback: { swatch: string; accent: string };
  blurb: string;
  // CSS gradient used for the background watermark text
  watermarkGradient: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const projects: Project[] = [
  {
    client: 'HORIZONS',
    title: 'Therapeutic short breaks for young people.',
    meta: 'Identity · Web · Illustration',
    year: '2025',
    metric: 'LCP 0.9s · 41% lift on referrals',
    url: 'horizonshortbreaks.org',
    image: '/portfolio/horizons.jpg',
    video: '/portfolio/horizons.mp4',
    fallback: { swatch: '#f1ecd5', accent: '#f0935a' },
    watermarkGradient: 'linear-gradient(120deg, #f0935a 25%, #f1ecd5 75%)',
    blurb:
      'A therapeutic short-breaks programme for 13–15 and 16+ year-olds. Painted hero illustration, referrer portal, careers + judo programme pages, all on one fast, accessible site that reads warm without ever feeling soft.',
  },
  {
    client: 'EXAMZI',
    title: 'Voice tutoring for GCSE students.',
    meta: 'Identity · Web · 3D + Motion',
    year: '2025',
    metric: 'Sub-1.0s LCP · 18% paid conversion',
    url: 'examzi.com',
    image: '/portfolio/examzi.jpg',
    video: '/portfolio/examzi.mp4',
    fallback: { swatch: '#0f0a1d', accent: '#fbbf24' },
    watermarkGradient: 'linear-gradient(120deg, #7c3aed 30%, #fbbf24 70%)',
    blurb:
      'AI voice tutor that turns silent revision into spoken understanding. Custom WebGL hero, motion-driven onboarding, and a paywall that actually converts — built for parents reading the page at 11pm with eleven days until GCSEs.',
  },
  {
    client: 'C.A.P.S.',
    title: 'Grounds & green spaces, councils across the UK.',
    meta: 'Identity · Editorial · Web',
    year: '2025',
    metric: '100 Lighthouse · 4x contract enquiries',
    url: 'capswork.org',
    image: '/portfolio/caps.jpg',
    video: '/portfolio/caps.mp4',
    fallback: { swatch: '#ecead8', accent: '#1f5236' },
    watermarkGradient: 'linear-gradient(120deg, #e8e8e3 30%, #1f5236 70%)',
    blurb:
      'A 30-year-old grounds maintenance firm rebranded for the next 30. Hand-drawn botanical illustrations, a 9-chapter scrolling story, and a tender pack any procurement team can read in five minutes.',
  },
  {
    client: 'INSPEKTA',
    title: 'Evidence platform for CQC & Ofsted inspections.',
    meta: 'Identity · Web · Product',
    year: '2024',
    metric: 'LCP 0.9s · 6x faster booking flow',
    url: 'inspekta.co.uk',
    image: '/portfolio/inspekta.jpg',
    video: '/portfolio/inspekta.mp4',
    fallback: { swatch: '#0c1326', accent: '#dab84a' },
    watermarkGradient: 'linear-gradient(120deg, #2050FF 30%, #dab84a 70%)',
    blurb:
      'A SaaS that captures staff understanding at the point of decision so leadership never has to reconstruct the moment after a regulator turns up. Two product entry points, one tight marketing site.',
  },
];

// ─── BrowserFrame ─────────────────────────────────────────────────────────────
function BrowserFrame({ p, isActive }: { p: Project; isActive: boolean }) {
  const [imgFailed, setImgFailed]       = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Only play when this card is the active (centred) card — prevents up to
  // 4 simultaneous video decoders from adjacent visible-but-inactive cards.
  // The static image is always the base layer so cards are never black.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
      setVideoPlaying(false);
    }
  }, [isActive]);

  return (
    <div
      className="relative w-full"
      style={{
        aspectRatio: '16 / 9',
        background: '#0a0a0a',
        boxShadow: 'inset 0 0 0 1px rgba(245,245,240,0.06)',
      }}
    >
      {/* Browser chrome — solid bg, no backdrop-blur */}
      <div
        className="absolute top-0 inset-x-0 h-7 z-10 flex items-center gap-1.5 px-3 border-b border-bone/8"
        style={{ background: 'rgba(16,16,16,0.97)' }}
      >
        <span className="w-2 h-2 rounded-full bg-bone/15" />
        <span className="w-2 h-2 rounded-full bg-bone/15" />
        <span className="w-2 h-2 rounded-full bg-bone/15" />
        <span className="ml-3 text-[9px] tracking-[0.2em] text-bone/45 uppercase truncate">
          {p.url}
        </span>
        <span className="ml-auto text-[9px] tracking-[0.28em] uppercase" style={{ color: p.fallback.accent }}>
          live
        </span>
      </div>

      <div className="absolute inset-0 top-7">
        {!imgFailed ? (
          <div className="relative w-full h-full">
            {/* Static image — always visible as the base layer. This ensures cards
                are never black even before the video loads or while inactive.
                Previously the image branch was unreachable because every project
                has a `video` property, leaving inactive cards with preload="none"
                + no play() = solid black rectangle. */}
            <img
              src={p.image}
              alt={`${p.client} — ${p.title}`}
              loading="lazy"
              decoding="async"
              onError={() => setImgFailed(true)}
              className="portfolio-media absolute inset-0 w-full h-full object-cover object-top"
              style={{ display: 'block' }}
            />
            {/* Video — overlaid on the image, fades in once playing.
                Only the active card ever calls play(); inactive cards stay
                on the static image with zero video decoder overhead. */}
            {p.video && (
              <video
                ref={videoRef}
                src={p.video}
                loop
                muted
                playsInline
                preload="none"
                disablePictureInPicture
                onPlaying={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                {...({ 'webkit-playsinline': 'true' } as any)}
                className="portfolio-media absolute inset-0 w-full h-full object-cover object-top"
                style={{
                  display: 'block',
                  opacity: videoPlaying ? 1 : 0,
                  transition: 'opacity 500ms ease',
                  transform: 'translate3d(0,0,0)',
                  backfaceVisibility: 'hidden',
                }}
              />
            )}
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${p.fallback.swatch}, ${p.fallback.swatch}cc)` }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: `radial-gradient(circle at 70% 30%, ${p.fallback.accent}55, transparent 60%)` }}
            />
            <div
              className="relative text-center px-6"
              style={{
                fontFamily: '"Fraunces", "Bodoni Moda", serif',
                color: p.fallback.swatch === '#ecead8' || p.fallback.swatch === '#f1ecd5' ? '#111' : '#F5F5F0',
              }}
            >
              <div style={{ fontSize: 'clamp(28px, 3.4vw, 56px)', letterSpacing: '-0.03em', fontWeight: 700, lineHeight: 1 }}>
                {p.client.toLowerCase()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Particles ────────────────────────────────────────────────────────────────
function Particles({ accent }: { accent: string }) {
  const pts = useRef(
    Array.from({ length: 9 }, (_, i) => {
      const a = (i / 9) * Math.PI * 2 + (i % 2 === 0 ? 0.4 : -0.3);
      return {
        left: `${48 + Math.cos(a) * 36}%`,
        top: `${42 + Math.sin(a) * 28}%`,
        size: 1.5 + ((i * 7) % 3) * 0.7,
        dur: `${3.4 + (i % 3) * 1.2}s`,
        delay: `${(i * 0.37) % 3}s`,
        dx: `${((i % 5) - 2) * 3}px`,
        dy: `${((i % 4) - 1.5) * 2.5}px`,
      };
    }),
  ).current;

  return (
    <div
      aria-hidden
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4, borderRadius: 10, overflow: 'hidden' }}
    >
      {pts.map((pt, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: pt.left,
            top: pt.top,
            width: pt.size,
            height: pt.size,
            borderRadius: '50%',
            background: accent,
            opacity: 0.45,
            display: 'block',
            animation: `ptFloat ${pt.dur} ease-in-out infinite ${pt.delay}`,
            ['--dx' as string]: pt.dx,
            ['--dy' as string]: pt.dy,
          }}
        />
      ))}
    </div>
  );
}

// ─── MetaLine ─────────────────────────────────────────────────────────────────
function MetaLine({
  children,
  delay,
  visible,
  style: extraStyle,
}: {
  children: React.ReactNode;
  delay: number;
  visible: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        clipPath: visible ? 'inset(0 0% 0 0)' : 'inset(0 0 0 100%)',
        transition: visible
          ? `clip-path 580ms cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms`
          : 'clip-path 160ms ease',
        ...extraStyle,
      }}
    >
      {children}
    </div>
  );
}

// ─── Slide ────────────────────────────────────────────────────────────────────
function Slide({
  p,
  index,
  distance,
  onOpen,
}: {
  p: Project;
  index: number;
  distance: number;
  onOpen: (p: Project) => void;
}) {
  const vibRef = useRef<HTMLDivElement>(null);
  const rimRef = useRef<HTMLDivElement>(null);
  const wasActive = useRef(false);
  const [scanKey, setScanKey] = useState(0);
  const isActive = distance === 0;
  const isAdjacent = Math.abs(distance) === 1;

  // ── Snap effects: vibration + rim hue + scan line ──────────────────────────
  useEffect(() => {
    if (isActive && !wasActive.current) {
      wasActive.current = true;

      // Vibration shiver
      const el = vibRef.current;
      if (el) {
        gsap.timeline({ defaults: { ease: 'power3.out', overwrite: 'auto' } })
          .to(el, { x: 6,   duration: 0.055 })
          .to(el, { x: -5,  duration: 0.055 })
          .to(el, { x: 3,   duration: 0.045 })
          .to(el, { x: -1.5,duration: 0.04  })
          .to(el, { x: 0,   duration: 0.08, ease: 'elastic.out(2.2, 0.42)' });
      }

      // Rim hue-cycle class
      const rim = rimRef.current;
      if (rim) {
        rim.classList.add('hor-rim-active');
        const clean = window.setTimeout(() => rim.classList.remove('hor-rim-active'), 1300);
        return () => clearTimeout(clean);
      }

      // Scan line
      setScanKey(k => k + 1);
    }
    if (!isActive) wasActive.current = false;
  }, [isActive]);

  // More aggressive falloff — non-active cards retreat hard into the dark
  const absD = Math.min(Math.abs(distance), 2);
  const scale   = isActive ? 1 : absD === 1 ? 0.80 : 0.64;
  const opacity = isActive ? 1 : absD === 1 ? 0.35 : 0.10;

  const rotY = isActive
    ? 0
    : distance < 0
    ? Math.min(12, -distance * 6)
    : Math.max(-12, -distance * 6);

  const transformOrigin = distance < 0 ? 'right center' : distance > 0 ? 'left center' : 'center';

  return (
    <div
      className="hor-slide"
      style={{
        width: 'clamp(520px, 82vw, 1060px)',
        flexShrink: 0,
        scrollSnapAlign: 'center',
        cursor: isActive ? 'pointer' : 'default',
        perspective: '1100px',
        position: 'relative',
      }}
      onClick={() => { if (isActive) onOpen(p); }}
      data-cursor={isActive ? 'active' : undefined}
    >
      <div ref={vibRef} style={{ position: 'relative' }}>
        {/* Scale + rotateY */}
        <div
          style={{
            transform: `rotateY(${rotY}deg) scale(${scale})`,
            opacity,
            transition: 'transform 700ms cubic-bezier(0.23, 1, 0.32, 1), opacity 600ms cubic-bezier(0.23, 1, 0.32, 1)',
            transformOrigin,
            position: 'relative',
          }}
        >
          {/* ─── Card shell ─── */}
          <div
            ref={rimRef}
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: isActive
                ? `0 0 0 1.5px rgba(${hexToRgb(p.fallback.accent)},0.45),
                   0 60px 120px rgba(0,0,0,0.85),
                   0 0 80px 16px rgba(${hexToRgb(p.fallback.accent)},0.08)`
                : isAdjacent
                ? '0 0 0 1px rgba(245,245,240,0.05), 0 24px 56px rgba(0,0,0,0.55)'
                : '0 0 0 1px rgba(245,245,240,0.03), 0 12px 28px rgba(0,0,0,0.35)',
              transition: 'box-shadow 750ms cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          >
            <BrowserFrame p={p} isActive={isActive} />

            {/* Gradient bloom */}
            <div
              aria-hidden
              style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
                background: `radial-gradient(ellipse 80% 60% at 50% 35%, rgba(${hexToRgb(p.fallback.accent)},0.28) 0%, transparent 65%)`,
                opacity: isActive ? 1 : 0,
                transition: 'opacity 900ms ease-out',
              }}
            />

            {/* Particles */}
            {isActive && <Particles accent={p.fallback.accent} />}

            {/* ── Scan line — horizontal light sweep on activation ── */}
            {isActive && (
              <div
                key={scanKey}
                aria-hidden
                style={{
                  position: 'absolute', inset: 0, overflow: 'hidden',
                  pointerEvents: 'none', zIndex: 6, borderRadius: 12,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0, left: '-40%', bottom: 0, width: '40%',
                    background: `linear-gradient(to right,
                      transparent 0%,
                      rgba(${hexToRgb(p.fallback.accent)},0.09) 40%,
                      rgba(245,245,240,0.07) 50%,
                      rgba(${hexToRgb(p.fallback.accent)},0.09) 60%,
                      transparent 100%)`,
                    animation: 'cardScan 1200ms cubic-bezier(0.16,1,0.3,1) both',
                  }}
                />
              </div>
            )}
          </div>

          {/* Momentum echo */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: '10px -10px -20px -10px',
              background: `rgba(${hexToRgb(p.fallback.accent)},0.14)`,
              borderRadius: 16,
              filter: 'blur(6px)',
              zIndex: -1,
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(12px) scaleX(0.88)' : 'translateY(2px) scaleX(0.88)',
              transition: 'opacity 700ms ease-out, transform 700ms cubic-bezier(0.23, 1, 0.32, 1)',
              pointerEvents: 'none',
            }}
          />

          {/* ─── Metadata — clip-path cascade reveal ─── */}
          <div style={{ marginTop: 22, paddingLeft: 2 }}>
            <MetaLine delay={0} visible={isActive}>
              <span style={{
                display: 'block', fontSize: 9, letterSpacing: '0.36em',
                textTransform: 'uppercase', color: p.fallback.accent,
                fontWeight: 600, opacity: 0.9, marginBottom: 10,
              }}>
                /{String(index + 1).padStart(2, '0')} &nbsp;&middot;&nbsp; {p.year}
              </span>
            </MetaLine>

            <MetaLine delay={90} visible={isActive}>
              <span style={{
                display: 'block',
                fontFamily: '"Fraunces", "Bodoni Moda", serif',
                fontSize: 'clamp(28px, 2.8vw, 42px)',
                letterSpacing: '0.14em', fontWeight: 600,
                color: '#F5F5F0', lineHeight: 1, marginBottom: 10,
              }}>
                {p.client}
              </span>
            </MetaLine>

            <MetaLine delay={180} visible={isActive}>
              <span style={{
                display: 'block', fontSize: 13,
                color: 'rgba(245,245,240,0.55)', lineHeight: 1.5,
                maxWidth: '42ch', marginBottom: 14, fontWeight: 300,
              }}>
                {p.title}
              </span>
            </MetaLine>

            <MetaLine delay={270} visible={isActive} style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
                color: 'rgba(245,245,240,0.35)', fontWeight: 600,
              }}>
                {p.meta}
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase',
                color: p.fallback.accent, fontWeight: 600, opacity: 0.9,
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: p.fallback.accent, display: 'inline-block',
                  opacity: 0.85, flexShrink: 0,
                }} />
                {p.metric}
              </span>
            </MetaLine>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ p, onClose }: { p: Project | null; onClose: () => void }) {
  useEffect(() => {
    if (!p) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    // Stop Lenis (programmatic smooth scroll) — body overflow alone doesn't work
    window.lenisInstance?.stop();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.lenisInstance?.start();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [p, onClose]);

  if (!p) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto py-8 px-6 md:px-12"
      style={{
        background: 'rgba(8,8,8,0.92)',
        backdropFilter: 'blur(18px) saturate(110%)',
        animation: 'modalFadeIn 600ms cubic-bezier(0.16,1,0.3,1) both',
        overscrollBehavior: 'contain',
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[1280px] grid md:grid-cols-12 gap-10"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'modalSlideUp 800ms cubic-bezier(0.16,1,0.3,1) both' }}
      >
        <div className="md:col-span-7 rounded-md overflow-hidden border border-bone/10">
          <BrowserFrame p={p} isActive={true} />
        </div>
        <div className="md:col-span-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] tracking-[0.32em] uppercase text-bone/45">
              {p.year} · {p.meta}
            </div>
            <div
              className="mt-5"
              style={{
                fontFamily: '"Fraunces", "Bodoni Moda", serif',
                fontSize: 'clamp(40px, 4.6vw, 70px)',
                lineHeight: 0.96, letterSpacing: '-0.04em',
                color: '#F5F5F0', fontWeight: 700,
              }}
            >
              {p.client}
            </div>
            <p className="mt-6 text-bone/80 max-w-[44ch] text-[15px] leading-[1.6]" style={{ fontWeight: 400 }}>
              {p.blurb}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-3 px-4 py-2 border border-bone/15 rounded-full text-[10px] tracking-[0.28em] uppercase text-bone/70">
                <span style={{ color: p.fallback.accent }}>&#9679;</span>
                {p.metric}
              </span>
              <a
                href={`https://${p.url}`}
                target="_blank"
                rel="noreferrer"
                data-cursor="active"
                className="inline-flex items-center gap-2 px-4 py-2 border border-bone/15 rounded-full text-[10px] tracking-[0.28em] uppercase text-bone/70 hover:bg-bone hover:text-ink transition-colors"
              >
                Visit {p.url} &#8599;
              </a>
            </div>
          </div>
          <button
            data-cursor="active"
            onClick={onClose}
            className="self-start mt-8 md:mt-10 text-[11px] tracking-[0.32em] uppercase text-bone/60 hover:text-bone transition-colors"
          >
            &#8592; Close
          </button>
        </div>
      </div>
      <style>{`
        @keyframes modalFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes modalSlideUp {
          from { opacity:0; transform: translateY(28px) scale(0.985); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─── Portfolio ────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState<Project | null>(null);
  const [grabbing, setGrabbing] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const scrollLockRef = useRef(false);
  const scrollLockTimer = useRef<number | null>(null);
  // Boundary escape resistance — user must hold the scroll direction for 600ms
  // before the page scrolls past the first/last card.
  const boundaryEscapeRef = useRef(false);
  const boundaryEscapeTimer = useRef<number | null>(null);

  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);

  // Header line-mask reveal
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.querySelectorAll<HTMLElement>('.line-mask').forEach((l, i) =>
              window.setTimeout(() => l.classList.add('is-in'), 100 * i),
            );
            io.unobserve(el);
          }
        }),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Horizontal scroll + active detection
  useEffect(() => {
    if (!window.matchMedia('(min-width: 768px)').matches) return;
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const getActive = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      const slides = track.querySelectorAll<HTMLElement>('.hor-slide');
      let best = 0, bestDist = Infinity;
      slides.forEach((slide, i) => {
        const d = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    };

    const onScroll = () => {
      setActiveIndex(getActive());
      setHasScrolled(true);
    };

    // One-card-at-a-time wheel scroll — attached to the SECTION so the full
    // section area intercepts, not just the track div. Previously only the
    // track caught events; hovering over the header/progress bar passed events
    // straight to Lenis which scrolled the page vertically instead.
    const onWheel = (e: WheelEvent) => {
      const delta = e.deltaY + e.deltaX;
      if (Math.abs(delta) < 5) return;

      // Only capture once the section is truly at the viewport top.
      // Previously 90px — too generous: horizontal scroll activated while the
      // section was still arriving (89px off-screen), hijacking vertical scroll
      // mid-animation and causing the "lag on entry" feel.
      // 80px matches the nav bar height: section is considered "at top" once
      // its top edge is within one nav-bar height of the viewport.
      // Also lock Lenis on first capture so it doesn't overshoot past the
      // section while the user is scrolling cards.
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop > 80) return;

      // Freeze Lenis in place the moment horizontal scroll takes over so any
      // ongoing smooth-scroll animation doesn't drift the page past the section.
      // scrollTo(current, {immediate}) updates both DOM scroll and Lenis's
      // internal targetScroll atomically — no stale-position scroll-back.
      if (window.lenisInstance) {
        const ly = window.lenisInstance as any;
        // Only snap if Lenis is still animating (targetScroll ≠ scroll)
        if (Math.abs((ly.targetScroll ?? ly.scroll ?? 0) - window.scrollY) > 2) {
          window.lenisInstance.scrollTo(window.scrollY, { immediate: true });
        }
      }

      const dir = delta > 0 ? 1 : -1;
      const cur = activeIndexRef.current;

      const atBoundary = (cur === 0 && dir < 0) || (cur === projects.length - 1 && dir > 0);

      if (atBoundary) {
        if (!boundaryEscapeRef.current) {
          // Resist the exit for 600ms — prevents accidental snap-away on arrival.
          // Block the event so Lenis doesn't scroll the page during the hold.
          e.preventDefault();
          e.stopPropagation();
          if (!boundaryEscapeTimer.current) {
            boundaryEscapeTimer.current = window.setTimeout(() => {
              boundaryEscapeRef.current = true;
              boundaryEscapeTimer.current = null;
            }, 600);
          }
          return;
        }
        // Resistance expired — let Lenis scroll the page naturally.
        return;
      }

      // Not at boundary — reset escape resistance for next boundary visit.
      boundaryEscapeRef.current = false;
      if (boundaryEscapeTimer.current) {
        clearTimeout(boundaryEscapeTimer.current);
        boundaryEscapeTimer.current = null;
      }

      // Mid-range: fully capture so Lenis doesn't fight scrollToCard.
      // CustomCursor uses a capture-phase listener so it still gets the event.
      e.preventDefault();
      e.stopPropagation();

      if (scrollLockRef.current) return;
      scrollLockRef.current = true;
      setHasScrolled(true);
      const next = Math.min(Math.max(cur + dir, 0), projects.length - 1);
      scrollToCard(next);
      if (scrollLockTimer.current) clearTimeout(scrollLockTimer.current);
      scrollLockTimer.current = window.setTimeout(() => {
        scrollLockRef.current = false;
      }, 680);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!section.matches(':hover')) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollToCard(Math.min(activeIndexRef.current + 1, projects.length - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollToCard(Math.max(activeIndexRef.current - 1, 0));
      }
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    section.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);

    return () => {
      track.removeEventListener('scroll', onScroll);
      section.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const scrollToCard = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slides = track.querySelectorAll<HTMLElement>('.hor-slide');
    const slide = slides[i];
    if (!slide) return;
    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
      behavior: 'smooth',
    });
  };

  const ap = projects[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative text-bone overflow-hidden"
      style={{ background: '#040404', scrollMarginTop: '72px' }}
    >
      {/* ── Injected CSS ── */}
      <style>{`
        @keyframes ptFloat {
          0%, 100% { transform: translate(0, 0); opacity: 0.45; }
          50%       { transform: translate(var(--dx), var(--dy)); opacity: 0.22; }
        }
        @keyframes cardScan {
          from { transform: translateX(0%); }
          to   { transform: translateX(350%); }
        }
        .hor-rim-active {
          animation: rimHue 1250ms cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @keyframes rimHue {
          0%   { box-shadow: 0 0 0 1.5px rgba(196,164,114,0.5),  0 60px 120px rgba(0,0,0,0.85); }
          30%  { box-shadow: 0 0 0 1.5px rgba(80,110,255,0.65),  0 60px 120px rgba(0,0,0,0.85), 0 0 40px 8px rgba(80,110,255,0.14); }
          70%  { box-shadow: 0 0 0 1.5px rgba(196,164,114,0.7),  0 60px 120px rgba(0,0,0,0.85), 0 0 32px 6px rgba(196,164,114,0.12); }
          100% { box-shadow: 0 0 0 1.5px rgba(196,164,114,0.5),  0 60px 120px rgba(0,0,0,0.85); }
        }
        .hor-track::-webkit-scrollbar { display: none; }
        .hor-track-grabbing { cursor: grabbing !important; }
        .hor-track-grabbing * { cursor: grabbing !important; }
      `}</style>

      {/* ── Layer 0: Background colour worlds (one per project, fade between) ── */}
      {projects.map((proj, i) => (
        <div
          key={proj.client}
          aria-hidden
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            background: `radial-gradient(ellipse 90% 75% at 50% 58%, rgba(${hexToRgb(proj.fallback.accent)},0.11) 0%, transparent 68%)`,
            opacity: i === activeIndex ? 1 : 0,
            transition: 'opacity 1400ms cubic-bezier(0.23,1,0.32,1)',
          }}
        />
      ))}

      {/* Watermarks rendered inside the track wrapper — see ── Desktop horizontal track ── below */}

      {/* ── Header ── */}
      <div
        className="max-w-[1600px] mx-auto px-7 md:px-10 lg:px-12 pt-20 md:pt-24 lg:pt-28 pb-8 md:pb-12 lg:pb-16"
        style={{ position: 'relative', zIndex: 3 }}
      >
        <div ref={headerRef} className="flex items-end justify-between gap-10 flex-wrap">
          <div className="line-mask">
            <span
              className="font-display block"
              style={{
                fontSize: 'clamp(36px, 5vw, 96px)',
                letterSpacing: '-0.035em',
                lineHeight: 0.96,
                fontWeight: 500,
              }}
            >
              Four pieces from{' '}
              <span className="italic text-bone/55">last year.</span>
            </span>
          </div>
          <div className="line-mask max-w-[32ch]">
            <span className="block text-[12.5px] md:text-[13.5px] text-bone/45 leading-[1.55]" style={{ fontWeight: 300 }}>
              Six clients a year. Each one gets all of us.{' '}
              <span className="text-bone/65">Swipe, drag or scroll to explore.</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Desktop horizontal track ── */}
      <div className="hidden md:block" style={{ position: 'relative', zIndex: 2 }}>

        {/* ── Watermarks — inside this stacking context so z:5 clears the cards ── */}
        {projects.map((proj, i) => (
          <div
            key={proj.client + '-wm'}
            aria-hidden
            style={{
              position: 'absolute',
              bottom: '12%',
              left: '50%',
              transform: `translateX(-50%) translateY(${i === activeIndex ? '0' : '20px'})`,
              pointerEvents: 'none',
              zIndex: 5,
              fontFamily: '"Fraunces", "Bodoni Moda", serif',
              fontSize: 'clamp(100px, 18vw, 260px)',
              fontWeight: 800,
              fontStyle: 'italic',
              letterSpacing: '-0.05em',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              background: proj.watermarkGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: i === activeIndex ? 0.13 : 0,
              transition: 'opacity 900ms cubic-bezier(0.23,1,0.32,1), transform 900ms cubic-bezier(0.23,1,0.32,1)',
            }}
          >
            {proj.client}
          </div>
        ))}

        {/* Vignette — pure dark edge fade, no solid colour to fight the bg worlds */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none',
            background: [
              'linear-gradient(to right,  #040404 0%, transparent 14%, transparent 86%, #040404 100%)',
              'linear-gradient(to bottom, #040404 0%, transparent 10%, transparent 90%, #040404 100%)',
            ].join(', '),
          }}
        />

        {/* Scroll track */}
        <div
          ref={trackRef}
          className={`hor-track${grabbing ? ' hor-track-grabbing' : ''}`}
          data-lenis-prevent
          style={{
            display: 'flex',
            overflowX: 'scroll',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            gap: 'clamp(16px, 2vw, 32px)',
            paddingTop: 'clamp(8px, 1.2vw, 16px)',
            paddingBottom: 'clamp(32px, 4vw, 64px)',
            cursor: grabbing ? 'grabbing' : 'grab',
          }}
          onMouseDown={() => setGrabbing(true)}
          onMouseUp={() => setGrabbing(false)}
          onMouseLeave={() => setGrabbing(false)}
          onTouchStart={() => setHasScrolled(true)}
        >
          {/* Left spacer — centres first card */}
          <div aria-hidden style={{ flexShrink: 0, width: 'calc((100vw - clamp(520px, 82vw, 1060px)) / 2 - clamp(8px, 1vw, 16px))' }} />

          {projects.map((p, i) => (
            <Slide
              key={p.client}
              p={p}
              index={i}
              distance={i - activeIndex}
              onOpen={setOpen}
            />
          ))}

          {/* Right spacer */}
          <div aria-hidden style={{ flexShrink: 0, width: 'calc((100vw - clamp(520px, 82vw, 1060px)) / 2 - clamp(8px, 1vw, 16px))' }} />
        </div>

        {/* ── Progress bar ── */}
        <div
          style={{
            height: 1,
            background: 'rgba(245,245,240,0.06)',
            position: 'relative',
            margin: '0 7%',
            marginBottom: 28,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0, top: 0, height: '100%',
              width: `${((activeIndex + 1) / projects.length) * 100}%`,
              background: `rgba(${hexToRgb(ap.fallback.accent)},0.75)`,
              transition: 'width 650ms cubic-bezier(0.23,1,0.32,1), background 900ms ease',
              boxShadow: `0 0 8px 2px rgba(${hexToRgb(ap.fallback.accent)},0.35)`,
            }}
          />
        </div>

        {/* ── Counter + dots + arrows ── */}
        <div className="flex items-center justify-center gap-6 pb-14" style={{ position: 'relative', zIndex: 7 }}>

          {/* Live counter */}
          <span
            style={{
              fontFamily: '"Fraunces", serif',
              fontSize: 11,
              fontStyle: 'italic',
              color: `rgba(${hexToRgb(ap.fallback.accent)},0.75)`,
              letterSpacing: '0.12em',
              minWidth: 36,
              textAlign: 'right',
              transition: 'color 600ms ease',
            }}
          >
            0{activeIndex + 1}
          </span>

          {/* Prev */}
          <button
            type="button"
            data-cursor="active"
            onClick={() => scrollToCard(Math.max(activeIndex - 1, 0))}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              border: '1px solid rgba(245,245,240,0.12)',
              background: 'transparent',
              color: activeIndex > 0 ? 'rgba(245,245,240,0.65)' : 'rgba(245,245,240,0.15)',
              fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'none', transition: 'color 300ms ease, border-color 300ms ease',
            }}
          >
            &#8592;
          </button>

          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {projects.map((_, i) => (
              <button
                key={i}
                type="button"
                data-cursor="active"
                onClick={() => scrollToCard(i)}
                style={{
                  width: i === activeIndex ? 28 : 6, height: 6, borderRadius: 3,
                  background: i === activeIndex
                    ? `rgba(${hexToRgb(ap.fallback.accent)},0.85)`
                    : 'rgba(245,245,240,0.15)',
                  border: 'none', padding: 0, cursor: 'none',
                  transition: 'width 420ms cubic-bezier(0.23,1,0.32,1), background 500ms ease',
                  boxShadow: i === activeIndex
                    ? `0 0 8px 2px rgba(${hexToRgb(ap.fallback.accent)},0.4)`
                    : 'none',
                }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            type="button"
            data-cursor="active"
            onClick={() => scrollToCard(Math.min(activeIndex + 1, projects.length - 1))}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              border: '1px solid rgba(245,245,240,0.12)',
              background: 'transparent',
              color: activeIndex < projects.length - 1 ? 'rgba(245,245,240,0.65)' : 'rgba(245,245,240,0.15)',
              fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'none', transition: 'color 300ms ease, border-color 300ms ease',
            }}
          >
            &#8594;
          </button>

          {/* Total count */}
          <span
            style={{
              fontFamily: '"Fraunces", serif',
              fontSize: 11, fontStyle: 'italic',
              color: 'rgba(245,245,240,0.28)',
              letterSpacing: '0.12em',
              minWidth: 36,
              transition: 'color 600ms ease',
            }}
          >
            0{projects.length}
          </span>
        </div>

        {/* ── Drag hint — fades after first interaction ── */}
        <div
          style={{
            position: 'absolute',
            bottom: 80, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: 10,
            opacity: hasScrolled ? 0 : 0.45,
            transition: 'opacity 600ms ease',
            pointerEvents: 'none',
            zIndex: 7,
          }}
        >
          <span style={{ display: 'block', width: 24, height: 1, background: 'rgba(245,245,240,0.5)' }} />
          <span style={{
            fontSize: 8, letterSpacing: '0.38em', textTransform: 'uppercase',
            color: 'rgba(245,245,240,0.7)', fontWeight: 500,
          }}>
            Swipe or drag
          </span>
          <span style={{ display: 'block', width: 24, height: 1, background: 'rgba(245,245,240,0.5)' }} />
        </div>
      </div>

      {/* ── Mobile: vertical ── */}
      <div className="flex flex-col gap-16 md:hidden px-7 pb-24 pt-8">
        {projects.map((p, i) => (
          <MobileCard key={p.client} p={p} index={i} onOpen={setOpen} />
        ))}
      </div>

      <Modal p={open} onClose={() => setOpen(null)} />
    </section>
  );
}

// ─── MobileCard ───────────────────────────────────────────────────────────────
function MobileCard({ p, index, onOpen }: { p: Project; index: number; onOpen: (p: Project) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add('is-in'); io.unobserve(el); }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="breathe"
      data-cursor="active"
      onClick={() => onOpen(p)}
      style={{ borderRadius: 8, overflow: 'hidden' }}
    >
      <div style={{ borderRadius: 8, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(245,245,240,0.07), 0 24px 60px rgba(0,0,0,0.45)' }}>
        <BrowserFrame p={p} isActive={true} />
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-6 text-bone">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-[10px] tracking-[0.32em] uppercase text-bone/45">
              0{index + 1}
            </span>
            <span className="font-display" style={{ fontSize: 'clamp(20px, 5vw, 28px)', letterSpacing: '0.18em', fontWeight: 500 }}>
              {p.client}
            </span>
          </div>
          <div className="mt-1.5 text-[12px] text-bone/60 max-w-[36ch] leading-snug">
            {p.title}
          </div>
        </div>
        <div className="text-right text-[10px] tracking-[0.28em] uppercase text-bone/45 whitespace-nowrap">
          {p.year}
          <div className="mt-1 text-bone/35">{p.meta}</div>
        </div>
      </div>
    </div>
  );
}
