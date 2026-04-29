import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Step = {
  num: string;
  title: string;
  copy: string;
  duration: string;
  shift?: number;
};

const steps: Step[] = [
  {
    num: '01',
    title: 'The conversation.',
    copy: 'One long call. No decks, no questionnaires. You explain the work, we listen, we ask the questions that matter. Within 48 hours we tell you, in plain English, whether this is a fit and what it costs.',
    duration: 'Day 1 · Discovery',
  },
  {
    num: '02',
    title: 'The build.',
    copy: "React, GSAP, WebGL, headless CMS, the lot. Daily Loom updates so you can interrupt early. Sub-1.2s LCP and 100 Lighthouse aren't targets, they're the floor we're building on.",
    duration: 'Days 2–10 · Engineering',
    shift: 5,
  },
  {
    num: '03',
    title: 'The polish.',
    copy: "The part everyone else skips. Font hinting, easing curves, Core Web Vitals on every page, the way the cursor lands when you hover. We don't ship until you can screenshot any frame and have it look intentional.",
    duration: 'Days 11–12 · QA + craft',
  },
  {
    num: '04',
    title: 'The handover.',
    copy: "Clean repo, plain-English docs, a Loom walkthrough of every dashboard, every CMS field, every deploy step. You can run it forever, or we will. Either way, no rug pulls.",
    duration: 'Days 13–14 · Launch',
  },
];

const AMBER = '#C4A472';

const stats = [
  { label: 'Projects per year', value: 'Six' },
  { label: 'Average engagement', value: '5–14d' },
  { label: 'Average LCP', value: '<1.0s' },
  { label: 'Lighthouse', value: '100' },
];

function Row({ s }: { s: Step }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.querySelectorAll<HTMLElement>('.line-mask').forEach((l, i) =>
              window.setTimeout(() => l.classList.add('is-in'), 90 * i),
            );
            io.unobserve(el);
          }
        }),
      { threshold: 0.18 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="service-row group relative grid grid-cols-12 gap-x-6 md:gap-x-12
                 items-start py-12 md:py-20 border-t"
      style={{ borderColor: 'rgba(245,245,240,0.07)' }}
    >
      {/* Ghost numeral — decorative depth layer */}
      <div
        aria-hidden
        className="service-ghost absolute right-0 md:right-4 top-1/2 -translate-y-1/2
                   select-none pointer-events-none leading-none"
        style={{
          fontFamily: '"Fraunces", "Bodoni Moda", serif',
          fontSize: 'clamp(100px, 14vw, 200px)',
          fontWeight: 700,
          fontVariationSettings: '"opsz" 144, "SOFT" 10',
          letterSpacing: '-0.05em',
          color: '#F5F5F0',
          opacity: 0.04,
          transition: 'opacity 600ms ease',
        }}
      >
        {s.num}
      </div>

      {/* Step indicator */}
      <div
        className="col-span-2 md:col-span-1 flex flex-col items-start gap-2.5 pt-1.5 line-mask"
        style={{ transform: `translateY(${s.shift ?? 0}px)` }}
      >
        <div
          className="service-dot w-[7px] h-[7px] rounded-full flex-shrink-0"
          style={{
            background: AMBER,
            boxShadow: `0 0 8px 2px ${AMBER}60`,
            transition: 'transform 400ms cubic-bezier(0.16,1,0.3,1), box-shadow 400ms ease',
          }}
        />
        <span
          className="text-[9.5px] tracking-[0.3em] uppercase tabular-nums"
          style={{ color: AMBER, fontWeight: 600, opacity: 0.9 }}
        >
          /{s.num}
        </span>
      </div>

      {/* Title */}
      <div className="col-span-10 md:col-span-6 line-mask">
        <span
          className="block text-bone leading-[1.0]"
          style={{
            fontFamily: '"Fraunces", "Bodoni Moda", serif',
            fontSize: 'clamp(34px, 5vw, 82px)',
            letterSpacing: '-0.035em',
            fontWeight: 600,
            fontVariationSettings: '"opsz" 144, "SOFT" 30',
            opacity: 0.9,
            transition: 'opacity 300ms ease',
          }}
        >
          {s.title}
        </span>
      </div>

      {/* Copy + tag */}
      <div className="col-span-12 md:col-span-5 flex flex-col gap-5 md:pt-2">
        <div className="line-mask">
          <p
            className="text-bone/60 leading-[1.65] max-w-[46ch]"
            style={{ fontSize: 'clamp(13.5px, 1.4vw, 15.5px)', fontWeight: 400 }}
          >
            {s.copy}
          </p>
        </div>
        <div className="line-mask">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                display: 'inline-block',
                width: 22,
                height: 1,
                background: `${AMBER}55`,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: '"Bodoni Moda", Didot, "Times New Roman", serif',
                fontStyle: 'italic',
                fontSize: 12.5,
                letterSpacing: '0.02em',
                color: `${AMBER}AA`,
                fontWeight: 400,
                lineHeight: 1,
              }}
            >
              {s.duration}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleBlockRef = useRef<HTMLDivElement>(null);

  // Line-mask reveal
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
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Title lines drift apart on scroll — line 1 left, line 2 right
  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return;

    const section = sectionRef.current;
    const block = titleBlockRef.current;
    if (!section || !block) return;

    const lines = block.querySelectorAll<HTMLElement>('.line-mask');
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.8,
      onUpdate: (self) => {
        const p = self.progress;
        if (lines[0]) lines[0].style.transform = `translateX(${p * -32}px)`;
        if (lines[1]) lines[1].style.transform = `translateX(${p * 32}px)`;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative bg-ink text-bone overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-7 md:px-12 pt-36 md:pt-52 pb-32 md:pb-44 relative">

        {/* Header */}
        <div ref={headerRef} className="mb-20 md:mb-32">
          <div className="line-mask mb-9">
            <span
              className="inline-flex items-center gap-3 text-[10px] tracking-[0.38em] uppercase"
              style={{ color: AMBER, fontWeight: 600 }}
            >
              <span className="inline-block w-6 h-px" style={{ background: AMBER, opacity: 0.7 }} />
              The work behind the work · 02
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-20">
            <div ref={titleBlockRef}>
              <div className="line-mask">
                <span
                  className="block text-bone"
                  style={{
                    fontFamily: '"Fraunces", "Bodoni Moda", serif',
                    fontSize: 'clamp(50px, 7.5vw, 124px)',
                    lineHeight: 0.93,
                    letterSpacing: '-0.04em',
                    fontWeight: 700,
                    fontVariationSettings: '"opsz" 144, "SOFT" 20',
                  }}
                >
                  How a NOXXE
                </span>
              </div>
              <div className="line-mask" style={{ paddingBottom: '0.14em' }}>
                <span
                  className="block italic"
                  style={{
                    fontFamily: '"Fraunces", "Bodoni Moda", serif',
                    fontSize: 'clamp(50px, 7.5vw, 124px)',
                    lineHeight: 0.93,
                    letterSpacing: '-0.04em',
                    fontWeight: 700,
                    fontVariationSettings: '"opsz" 144, "SOFT" 80',
                    color: 'rgba(245,245,240,0.55)',
                  }}
                >
                  site gets made.
                </span>
              </div>
            </div>

            <div className="line-mask md:max-w-[30ch] md:pb-2 flex-shrink-0">
              <p
                className="text-bone/45 leading-[1.65]"
                style={{ fontSize: 'clamp(13px, 1.3vw, 14.5px)', fontWeight: 400 }}
              >
                Four steps. 5–14 days. No mystery, no agency theatre. Here&rsquo;s exactly what
                happens between the first email and the day you go live.
              </p>
            </div>
          </div>
        </div>

        {/* Process steps */}
        <div>
          {steps.map((s) => (
            <Row key={s.num} s={s} />
          ))}
        </div>

        {/* Stats bar */}
        <div
          className="mt-20 md:mt-28 pt-10 md:pt-12 border-t grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0"
          style={{ borderColor: 'rgba(245,245,240,0.07)' }}
        >
          {stats.map(({ label, value }, i) => (
            <div
              key={label}
              className="flex flex-col gap-2 md:border-l first:border-l-0 md:pl-10 first:pl-0"
              style={{ borderColor: 'rgba(245,245,240,0.07)' }}
            >
              <span
                className="text-[9.5px] tracking-[0.3em] uppercase text-bone/35"
                style={{ fontWeight: 600 }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: '"Fraunces", "Bodoni Moda", serif',
                  fontSize: 'clamp(26px, 2.8vw, 42px)',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  fontWeight: 600,
                  color: i === 0 ? '#F5F5F0' : AMBER,
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
