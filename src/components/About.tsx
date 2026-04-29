import { useEffect, useRef } from 'react';
import { useLocale } from '../hooks/useLocale';

type Q = {
  q: string;
  a: string;
  // Optional pull-quote / tag rendered small above
  tag?: string;
};

function makeItems(isUS: boolean): Q[] {
  // '£' = £ — Unicode escape avoids source-file encoding ambiguity
  const sym = isUS ? '$' : '£';
  return [
    {
      tag: "Timeline",
      q: "How long does it take?",
      a: "Five to fourteen days, start to launch. Day one is discovery, two through ten is the build, eleven and twelve are polish and QA, thirteen and fourteen are handover and go-live. No radio silence — you get a Loom update every day we're working.",
    },
    {
      tag: "Investment",
      q: "What does it cost?",
      a: "Projects start at " + sym + "1,500 and most land between that and " + sym + "6,000 depending on scope, page count, and complexity. One fixed number, agreed before anything is designed.",
    },
    {
      tag: "Ownership",
      q: "Do I own the code and assets?",
      a: "Yes. Clean repo, MIT-style license on anything we wrote, source files for every visual. You can hire any engineer in the world to maintain it the day after we hand over.",
    },
    {
      tag: "After launch",
      q: "Do you do retainers?",
      a: "Optional. Monthly support starts at " + sym + "150 for performance monitoring, small tweaks, and keeping things dialled in. If you'd rather a clean handover and run it yourself, that's the default.",
    },
    {
      tag: "Revisions",
      q: "What if we want changes mid-flight?",
      a: "Two rounds of revisions baked in at every stage — design and build. Anything beyond that gets scoped and agreed before we start. We tell you when we're approaching the line, never after.",
    },
    {
      tag: "Capacity",
      q: "Why only six clients a year?",
      a: "Because everything we make has to look intentional, and we can't fake that at volume. If you're reading this in Q3, the year's usually full — the next slot is in Q1.",
    },
  ];
}

function Card({ item, index }: { item: Q; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.querySelectorAll<HTMLElement>('.line-mask').forEach((l, i) =>
              window.setTimeout(() => l.classList.add('is-in'), 80 * i),
            );
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.18 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Intentional grid break — every third card on desktop nudges down a touch
  const offset = index % 3 === 1 ? 'md:translate-y-6' : '';

  return (
    <div
      ref={ref}
      className={`relative pt-8 md:pt-10 border-t border-ink/15 ${offset}`}
    >
      <div className="flex items-baseline gap-4 mb-4 md:mb-5">
        <span className="line-mask">
          <span
            className="block italic text-ink/55"
            style={{
              fontFamily: '"Fraunces", "Bodoni Moda", serif',
              fontSize: 'clamp(20px, 1.6vw, 26px)',
              fontWeight: 500,
              letterSpacing: '-0.005em',
            }}
          >
            /0{index + 1}
          </span>
        </span>
        {item.tag && (
          <span className="line-mask">
            <span
              className="block text-[10px] tracking-[0.32em] uppercase text-ink/55"
              style={{ fontWeight: 500 }}
            >
              {item.tag}
            </span>
          </span>
        )}
      </div>

      <div className="line-mask block" style={{ paddingBottom: '0.18em' }}>
        <span
          className="block text-ink"
          style={{
            fontFamily: '"Fraunces", "Bodoni Moda", serif',
            fontSize: 'clamp(26px, 2.6vw, 42px)',
            lineHeight: 1.06,
            letterSpacing: '-0.025em',
            fontWeight: 600,
            fontVariationSettings: '"opsz" 144, "SOFT" 50',
          }}
        >
          {item.q}
        </span>
      </div>

      <div className="line-mask mt-4 md:mt-5">
        <span
          className="block text-ink/80 text-[15px] md:text-[16.5px] leading-[1.6] max-w-[44ch]"
          style={{ fontWeight: 400 }}
        >
          {item.a}
        </span>
      </div>
    </div>
  );
}

export default function About() {
  const headerRef = useRef<HTMLDivElement>(null);
  const { isUS } = useLocale();
  const items = makeItems(isUS);

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

  return (
    <section id="about" className="relative bg-ash text-ink">
      <div className="max-w-[1600px] mx-auto px-7 md:px-12 pt-32 md:pt-44 pb-32 md:pb-44">
        <div ref={headerRef} className="grid grid-cols-12 gap-6 md:gap-12 mb-20 md:mb-24">
          <div className="col-span-12 md:col-span-7">
            <div className="line-mask block mb-6 md:mb-8">
              <span className="block text-[10.5px] tracking-[0.34em] uppercase text-ink/65" style={{ fontWeight: 500 }}>
                ( Working together · 04 )
              </span>
            </div>
            <div className="line-mask block">
              <span
                className="block text-ink"
                style={{
                  fontFamily: '"Fraunces", "Bodoni Moda", serif',
                  fontSize: 'clamp(40px, 5.6vw, 96px)',
                  lineHeight: 0.96,
                  letterSpacing: '-0.04em',
                  fontWeight: 700,
                  fontVariationSettings: '"opsz" 144, "SOFT" 30',
                }}
              >
                Things you&rsquo;ll ask
              </span>
            </div>
            <div className="line-mask block" style={{ paddingBottom: '0.18em' }}>
              <span
                className="block italic text-ink"
                style={{
                  fontFamily: '"Fraunces", "Bodoni Moda", serif',
                  fontSize: 'clamp(40px, 5.6vw, 96px)',
                  lineHeight: 0.96,
                  letterSpacing: '-0.04em',
                  fontWeight: 700,
                  fontVariationSettings: '"opsz" 144, "SOFT" 80',
                }}
              >
                before you sign.
              </span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 md:col-start-9 md:pt-3 flex flex-col gap-5">
            <div className="line-mask">
              <span className="block text-ink/85 text-[15px] md:text-[16.5px] leading-[1.6]" style={{ fontWeight: 400 }}>
                The honest answers, before you spend an hour on a discovery call. Numbers are real. Timelines are kept. If something on this page changes, we&rsquo;ll change it here first.
              </span>
            </div>
            <div className="line-mask">
              <a
                href="#contact"
                data-cursor="active"
                className="self-start inline-flex items-center gap-3 text-[10.5px] tracking-[0.32em] uppercase text-ink border border-ink/30 rounded-full pl-5 pr-3 py-2.5 hover:bg-ink hover:text-bone transition-colors duration-300"
              >
                Skip to contact
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-current">
                  &rarr;
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 lg:gap-x-16 gap-y-14 md:gap-y-20">
          {items.map((q, i) => (
            <Card key={q.q} item={q} index={i} />
          ))}
        </div>

        {/* asymmetric closing line — off-grid signature */}
        <div aria-hidden className="mt-24 md:mt-32 flex justify-end">
          <span
            className="italic text-ink/45"
            style={{
              fontFamily: '"Fraunces", "Bodoni Moda", serif',
              fontSize: 'clamp(14px, 1.2vw, 18px)',
              letterSpacing: '0.02em',
              transform: 'translateX(-3vw)',
              display: 'inline-block',
              fontWeight: 500,
            }}
          >
            &mdash; If your question isn&rsquo;t here, it&rsquo;s probably worth asking on a call.
          </span>
        </div>
      </div>
    </section>
  );
}
