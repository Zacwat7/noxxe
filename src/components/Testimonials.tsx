import { useEffect, useRef } from 'react';
import { useTestimonialsOverlay } from '../contexts/TestimonialsOverlayContext';

const AMBER = '#C4A472';

type Review = {
  quote: string;
  name: string;
  role: string;
  company: string;
  tag?: string;
};

const reviews: Review[] = [
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
];

function ReviewCard({ r, index }: { r: Review; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.querySelectorAll<HTMLElement>('.line-mask').forEach((l, i) =>
              window.setTimeout(() => l.classList.add('is-in'), 80 * i),
            );
            io.unobserve(el);
          }
        }),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Stagger offset — middle card dips slightly
  const nudge = index === 1 ? 'md:translate-y-8' : '';

  return (
    <div
      ref={ref}
      className={`relative flex flex-col gap-6 ${nudge}`}
      style={{ paddingTop: '2px' }}
    >
      {/* Stars */}
      <div className="flex gap-1" aria-label="5 out of 5 stars">
        {[0,1,2,3,4].map((i) => (
          <span key={i} style={{ color: AMBER, fontSize: 13, opacity: 0.85 }}>★</span>
        ))}
      </div>

      <div className="line-mask block" style={{ paddingBottom: '0.1em' }}>
        <span
          className="block text-bone/85 leading-[1.58]"
          style={{
            fontFamily: '"Fraunces", "Bodoni Moda", serif',
            fontSize: 'clamp(16px, 1.5vw, 21px)',
            fontWeight: 400,
            fontStyle: 'italic',
            letterSpacing: '-0.01em',
          }}
        >
          {r.quote}
        </span>
      </div>

      <div className="line-mask flex items-center gap-4 mt-2">
        <div
          className="w-8 h-px flex-shrink-0"
          style={{ background: AMBER, opacity: 0.55 }}
        />
        <div className="flex flex-col gap-0.5">
          <span
            className="text-[11px] tracking-[0.28em] uppercase text-bone/90"
            style={{ fontWeight: 600 }}
          >
            {r.name}
          </span>
          <span
            className="text-[10px] tracking-[0.24em] uppercase"
            style={{ color: `${AMBER}99` }}
          >
            {r.role} · {r.company}
          </span>
        </div>
        {r.tag && (
          <div
            className="ml-auto hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{
              border: `1px solid ${AMBER}30`,
              background: `${AMBER}0A`,
            }}
          >
            <span
              className="w-1 h-1 rounded-full flex-shrink-0"
              style={{ background: AMBER, opacity: 0.7 }}
            />
            <span
              className="text-[9px] tracking-[0.28em] uppercase"
              style={{ color: `${AMBER}AA`, fontWeight: 600 }}
            >
              {r.tag}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const headerRef = useRef<HTMLDivElement>(null);
  const { openTestimonials } = useTestimonialsOverlay();

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
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative bg-ink text-bone overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-7 md:px-12 pt-36 md:pt-52 pb-32 md:pb-44">

        {/* Header */}
        <div ref={headerRef} className="mb-20 md:mb-28">
          <div className="line-mask mb-8">
            <span
              className="inline-flex items-center gap-3 text-[10px] tracking-[0.38em] uppercase"
              style={{ color: AMBER, fontWeight: 600 }}
            >
              <span className="inline-block w-6 h-px" style={{ background: AMBER, opacity: 0.7 }} />
              What clients say · 03
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-20">
            <div>
              <div className="line-mask">
                <span
                  className="block text-bone"
                  style={{
                    fontFamily: '"Fraunces", "Bodoni Moda", serif',
                    fontSize: 'clamp(42px, 6vw, 104px)',
                    lineHeight: 0.94,
                    letterSpacing: '-0.04em',
                    fontWeight: 700,
                    fontVariationSettings: '"opsz" 144, "SOFT" 20',
                  }}
                >
                  The work keeps
                </span>
              </div>
              <div className="line-mask" style={{ paddingBottom: '0.14em' }}>
                <span
                  className="block italic"
                  style={{
                    fontFamily: '"Fraunces", "Bodoni Moda", serif',
                    fontSize: 'clamp(42px, 6vw, 104px)',
                    lineHeight: 0.94,
                    letterSpacing: '-0.04em',
                    fontWeight: 700,
                    fontVariationSettings: '"opsz" 144, "SOFT" 80',
                    color: 'rgba(245,245,240,0.55)',
                  }}
                >
                  getting better.
                </span>
              </div>
            </div>

            <div className="line-mask md:max-w-[32ch] md:pb-2 flex-shrink-0">
              <p
                className="text-bone/45 leading-[1.65]"
                style={{ fontSize: 'clamp(13px, 1.3vw, 14.5px)', fontWeight: 400 }}
              >
                Not because we update it every week. Because the decisions made in week one are still paying off in month six. That&rsquo;s what intentional design does.
              </p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 lg:gap-x-16 gap-y-16 md:gap-y-0">
          {reviews.map((r, i) => (
            <ReviewCard key={r.name} r={r} index={i} />
          ))}
        </div>

        {/* Read all reviews CTA */}
        <div className="mt-16 md:mt-20 flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-10 border-t" style={{ borderColor: 'rgba(245,245,240,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5" aria-hidden>
              {[0,1,2,3,4].map((i) => (
                <span key={i} style={{ color: AMBER, fontSize: 11, opacity: 0.7 }}>★</span>
              ))}
            </div>
            <span className="text-bone/35 text-[11px] tracking-[0.22em] uppercase" style={{ fontWeight: 500 }}>
              4 verified reviews
            </span>
          </div>
          <button
            type="button"
            onClick={openTestimonials}
            data-cursor="active"
            className="self-start md:self-auto inline-flex items-center gap-4 text-[11px] tracking-[0.32em] uppercase text-bone border border-bone/20 rounded-full pl-6 pr-3 py-3 hover:bg-bone hover:text-ink transition-colors duration-300"
          >
            Read all reviews
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-current">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
