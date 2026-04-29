import { useEffect, useRef } from 'react';
import { useTestimonialsOverlay } from '../contexts/TestimonialsOverlayContext';

const AMBER = '#C4A472';

const reviews = [
  {
    quote:
      "Six months after launch we're still finding details we didn't know were there. That's not how most agencies work. They shipped something that keeps getting better the longer you look at it.",
    name: 'Marcus T.',
    role: 'Founder',
    company: 'Horizons Shortbreaks',
    tag: 'Brand + web',
  },
  {
    quote:
      "Went live and immediately got a competitor DM asking who built our site. The Lighthouse score is 100. The LCP is under 900ms. And it looks nothing like anything in our industry. Worth every penny.",
    name: 'Priya K.',
    role: 'Head of Growth',
    company: 'Inspekta',
    tag: 'Full build',
  },
  {
    quote:
      "I expected the usual agency experience. I got something different — they pushed back on three of my ideas before we started, explained why, and were right every time. The site is genuinely the thing I'm most proud of.",
    name: 'Daniel W.',
    role: 'CEO',
    company: 'GambleGuard',
    tag: 'Redesign',
  },
  {
    quote:
      "We'd tried two other studios before NOXXE. Both delivered something generic that looked like every other edtech site. NOXXE delivered something that actually reflects who we are. Students notice the difference.",
    name: 'Alex R.',
    role: 'CPO',
    company: 'Examzi',
    tag: 'Identity + web',
  },
];

export default function TestimonialsOverlay() {
  const { open, closeTestimonials } = useTestimonialsOverlay();
  const panelRef = useRef<HTMLDivElement>(null);

  // Esc closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeTestimonials(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeTestimonials]);

  // Stagger-reveal lines on open
  useEffect(() => {
    if (!open) return;
    const el = panelRef.current;
    if (!el) return;
    const lines = el.querySelectorAll<HTMLElement>('.line-mask');
    lines.forEach((l, i) => {
      window.setTimeout(() => l.classList.add('is-in'), 60 + 55 * i);
    });
    return () => { lines.forEach((l) => l.classList.remove('is-in')); };
  }, [open]);

  return (
    <div
      aria-hidden={!open}
      className="fixed inset-0 z-[95]"
      style={{
        pointerEvents: open ? 'auto' : 'none',
        opacity: open ? 1 : 0,
        // Entry animation lives on the outer wrapper — keeping transform OFF the
        // overflow-y-auto panel prevents iOS WebKit's stacking-context scroll bug.
        transform: open ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 600ms cubic-bezier(0.77,0,0.175,1), transform 700ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 80% 0%, rgba(196,164,114,0.10), transparent 55%), radial-gradient(ellipse at 10% 100%, rgba(32,80,255,0.07), transparent 55%), #0a0a0a',
        }}
      />

      {/* Panel — no transform here so iOS scroll works */}
      <div
        ref={panelRef}
        className="relative h-full w-full overflow-y-auto overlay-panel"
        style={{
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Header bar — isolation:isolate contains the backdrop-filter repaint
             within this stacking context so it doesn't propagate up the layer tree */}
        <div className="sticky top-0 z-10 backdrop-blur-md bg-[rgba(10,10,10,0.6)] border-b border-bone/8" style={{ isolation: 'isolate' }}>
          <div className="max-w-[1600px] mx-auto px-7 md:px-12 py-5 md:py-6 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <span
                className="font-display text-bone text-[16px] md:text-[18px]"
                style={{ letterSpacing: '0.32em', fontWeight: 500 }}
              >
                NOXXE
              </span>
              <span className="hidden md:inline-block text-[10px] tracking-[0.32em] uppercase text-bone/55">
                / Reviews
              </span>
            </div>
            <button
              data-cursor="active"
              onClick={closeTestimonials}
              className="group flex items-center gap-3 text-[10.5px] tracking-[0.32em] uppercase text-bone/70 hover:text-bone transition-colors"
            >
              <span className="hidden md:inline">Close</span>
              <span
                aria-hidden
                className="relative inline-block w-7 h-7 rounded-full border border-bone/40 group-hover:border-bone transition-colors"
              >
                <span className="absolute inset-0 m-auto w-3 h-px bg-current" style={{ transform: 'rotate(45deg)' }} />
                <span className="absolute inset-0 m-auto w-3 h-px bg-current" style={{ transform: 'rotate(-45deg)' }} />
              </span>
            </button>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-7 md:px-12 pt-16 md:pt-24 pb-24 md:pb-32">
          {/* Title block */}
          <div className="mb-16 md:mb-24">
            <div className="line-mask block mb-6 md:mb-8">
              <span className="block text-[10.5px] tracking-[0.34em] uppercase text-bone/55" style={{ fontWeight: 500 }}>
                ( What clients say )
              </span>
            </div>
            <div className="line-mask block">
              <span
                className="block text-bone"
                style={{
                  fontFamily: '"Fraunces", "Bodoni Moda", serif',
                  fontSize: 'clamp(44px, 7vw, 120px)',
                  lineHeight: 0.94,
                  letterSpacing: '-0.045em',
                  fontWeight: 700,
                  fontVariationSettings: '"opsz" 144, "SOFT" 30',
                }}
              >
                The work keeps
              </span>
            </div>
            <div className="line-mask block" style={{ paddingBottom: '0.18em' }}>
              <span
                className="block italic text-bone"
                style={{
                  fontFamily: '"Fraunces", "Bodoni Moda", serif',
                  fontSize: 'clamp(44px, 7vw, 120px)',
                  lineHeight: 0.94,
                  letterSpacing: '-0.045em',
                  fontWeight: 700,
                  fontVariationSettings: '"opsz" 144, "SOFT" 80',
                  color: 'rgba(245,245,240,0.5)',
                }}
              >
                getting better.
              </span>
            </div>
            <div className="line-mask mt-8 max-w-[48ch]">
              <span className="block text-bone/65 text-[15px] md:text-[16.5px] leading-[1.6]" style={{ fontWeight: 300 }}>
                Not because we update it every week. Because the decisions made in week one are still paying off in month six. That&rsquo;s what intentional design does.
              </span>
            </div>
          </div>

          {/* Review cards — full-width stacked list */}
          <div className="flex flex-col">
            {reviews.map((r, i) => (
              <div
                key={r.name}
                className="py-12 md:py-16 border-t"
                style={{ borderColor: 'rgba(245,245,240,0.07)' }}
              >
                <div className="grid grid-cols-12 gap-6 md:gap-12">
                  {/* Index */}
                  <div className="col-span-2 md:col-span-1 line-mask">
                    <span
                      className="block text-[10px] tracking-[0.3em] uppercase tabular-nums"
                      style={{ color: AMBER, fontWeight: 600, opacity: 0.65 }}
                    >
                      /{String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Stars + Quote */}
                  <div className="col-span-12 md:col-span-7 line-mask">
                    {/* Stars sit above the quote text */}
                    <div className="flex gap-1 mb-4" aria-label="5 out of 5 stars">
                      {[0,1,2,3,4].map((s) => (
                        <span key={s} style={{ color: '#C4A472', fontSize: 13, opacity: 0.85 }}>★</span>
                      ))}
                    </div>
                    <p
                      className="text-bone/85"
                      style={{
                        fontFamily: '"Fraunces", "Bodoni Moda", serif',
                        fontSize: 'clamp(18px, 2vw, 28px)',
                        lineHeight: 1.5,
                        fontStyle: 'italic',
                        letterSpacing: '-0.01em',
                        fontWeight: 400,
                      }}
                    >
                      &ldquo;{r.quote}&rdquo;
                    </p>
                  </div>

                  {/* Attribution */}
                  <div className="col-span-12 md:col-span-4 flex flex-col gap-3 md:pt-1 line-mask">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-px flex-shrink-0" style={{ background: AMBER, opacity: 0.5 }} />
                      <div>
                        <p className="text-[11px] tracking-[0.28em] uppercase text-bone/90" style={{ fontWeight: 600 }}>
                          {r.name}
                        </p>
                        <p className="text-[10px] tracking-[0.22em] uppercase mt-0.5" style={{ color: `${AMBER}88` }}>
                          {r.role} · {r.company}
                        </p>
                      </div>
                    </div>
                    {r.tag && (
                      <div
                        className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                        style={{ border: `1px solid ${AMBER}28`, background: `${AMBER}08` }}
                      >
                        <span className="w-1 h-1 rounded-full" style={{ background: AMBER, opacity: 0.65 }} />
                        <span className="text-[9px] tracking-[0.28em] uppercase" style={{ color: `${AMBER}99`, fontWeight: 600 }}>
                          {r.tag}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t" style={{ borderColor: 'rgba(245,245,240,0.07)' }} />
          </div>

          {/* Footer note */}
          <div className="mt-16 md:mt-20 line-mask">
            <span
              className="block italic text-bone/35"
              style={{
                fontFamily: '"Fraunces", "Bodoni Moda", serif',
                fontSize: 'clamp(13px, 1vw, 16px)',
                letterSpacing: '0.02em',
              }}
            >
              &mdash; Pressing Escape closes this. So does the back button.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
