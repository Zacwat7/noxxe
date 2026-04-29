import { useEffect, useRef, useState } from 'react';
import { useLocale } from '../hooks/useLocale';

const AMBER = '#C4A472';

type Proposal = {
  client: string;
  industry: string;
  tagline: string;
  scope: string[];
  deliverables: string;
  timeline: string;
  investment: string;
  note: string;
};

const proposals: Proposal[] = [
  {
    client: 'Horizons Shortbreaks',
    industry: 'Travel & Hospitality',
    tagline: 'A booking experience that feels as good as the break itself.',
    scope: [
      'Brand identity refresh — wordmark, type system, colour palette',
      'Marketing site — hero, destination pages, booking flow',
      'Mobile-first layout, sub-900ms LCP across all pages',
    ],
    deliverables: 'Brand PDF · Full-stack React site · Headless CMS · Source files',
    timeline: '6 weeks',
    investment: '£4,200',
    note: 'Most travel sites look like 2018. Yours won\'t.',
  },
  {
    client: 'Inspekta',
    industry: 'B2B SaaS',
    tagline: 'A product site that converts like a sales team that never sleeps.',
    scope: [
      'Positioning-led landing page with interactive product demo section',
      'Pricing page with clear tier logic and social proof',
      'Blog/resources hub for SEO compounding',
    ],
    deliverables: 'React site · Animated product walkthrough · CMS · Analytics setup',
    timeline: '5 weeks',
    investment: '£3,600',
    note: 'B2B SaaS sites are where good design pays back 10×. Every percentage point of CVR has a number behind it.',
  },
  {
    client: 'GambleGuard',
    industry: 'Responsible Gaming Software',
    tagline: 'Executive-grade credibility for a product that needs instant trust.',
    scope: [
      'Enterprise homepage targeting C-suite and compliance officers',
      'Case studies section with measurable outcome data',
      'Partner/integration pages with technical spec depth',
    ],
    deliverables: 'React site · Motion-restrained enterprise UI · CMS · Docs section',
    timeline: '7 weeks',
    investment: '£5,400',
    note: 'In regulated industries, your website is your first due-diligence document. It needs to be flawless.',
  },
  {
    client: 'Examzi',
    industry: 'EdTech',
    tagline: 'A marketing site that matches the product students already love.',
    scope: [
      'Marketing homepage with animated product screenshots',
      'App download flow optimised for mobile conversion',
      'Exam subject landing pages for SEO and paid traffic',
    ],
    deliverables: 'React site · App store deep-links · Performance tracking · CMS',
    timeline: '4 weeks',
    investment: '£2,800',
    note: 'Students make snap judgements. If the site doesn\'t feel as good as the app, they don\'t download.',
  },
];

function ProposalCard({ p, index, investment }: { p: Proposal; index: number; investment: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.querySelectorAll<HTMLElement>('.line-mask').forEach((l, i) =>
              window.setTimeout(() => l.classList.add('is-in'), 70 * i),
            );
            io.unobserve(el);
          }
        }),
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative border-t"
      style={{ borderColor: 'rgba(245,245,240,0.07)' }}
    >
      {/* Card header — always visible */}
      <button
        type="button"
        data-cursor="active"
        className="w-full text-left py-10 md:py-14 group"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="grid grid-cols-12 gap-6 md:gap-12 items-start">
          {/* Index */}
          <div className="col-span-1 line-mask pt-1">
            <span
              className="block text-[10px] tracking-[0.3em] uppercase tabular-nums"
              style={{ color: AMBER, fontWeight: 600, opacity: 0.7 }}
            >
              /{String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Client + industry */}
          <div className="col-span-9 md:col-span-7">
            <div className="line-mask">
              <span
                className="block text-bone"
                style={{
                  fontFamily: '"Fraunces", "Bodoni Moda", serif',
                  fontSize: 'clamp(28px, 3.8vw, 64px)',
                  lineHeight: 0.97,
                  letterSpacing: '-0.03em',
                  fontWeight: 600,
                  fontVariationSettings: '"opsz" 144, "SOFT" 30',
                }}
              >
                {p.client}
              </span>
            </div>
            <div className="line-mask mt-2">
              <span
                className="block text-bone/50 italic"
                style={{
                  fontFamily: '"Fraunces", "Bodoni Moda", serif',
                  fontSize: 'clamp(14px, 1.4vw, 19px)',
                  letterSpacing: '-0.01em',
                  fontWeight: 400,
                }}
              >
                {p.tagline}
              </span>
            </div>
          </div>

          {/* Meta + toggle */}
          <div className="col-span-2 md:col-span-4 flex flex-col md:flex-row md:items-center md:justify-end gap-3 md:gap-6">
            {/* line-mask intentionally omitted — it sets display:inline-block which
                 overrides Tailwind's `hidden` and causes this to show on mobile */}
            <div className="hidden md:flex flex-col gap-1 text-right">
              <span
                className="text-[10px] tracking-[0.28em] uppercase text-bone/35"
                style={{ fontWeight: 600 }}
              >
                {p.industry}
              </span>
              <span
                className="text-[11px] tracking-[0.2em] uppercase"
                style={{ color: AMBER, fontWeight: 600 }}
              >
                {investment}
              </span>
            </div>
            <div
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300"
              style={{
                borderColor: open ? 'rgba(245,245,240,0.5)' : 'rgba(245,245,240,0.15)',
                background: open ? 'rgba(245,245,240,0.08)' : 'transparent',
              }}
            >
              <span
                className="text-bone/70 text-[14px] transition-transform duration-300"
                style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)', display: 'block', lineHeight: 1 }}
              >
                +
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* Expanded content — grid-rows trick: animates row size on the compositor
           instead of max-height which forces layout recalc every frame. */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          opacity: open ? 1 : 0,
          transition: open
            ? 'grid-template-rows 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)'
            : 'grid-template-rows 700ms cubic-bezier(0.4, 0, 1, 1), opacity 400ms cubic-bezier(0.4, 0, 1, 1)',
        }}
      >
      <div style={{ overflow: 'hidden' }}>
        <div className="pb-12 md:pb-16 grid grid-cols-12 gap-6 md:gap-12">
          {/* Scope */}
          <div className="col-span-12 md:col-span-5 md:col-start-2">
            <p
              className="text-[9.5px] tracking-[0.3em] uppercase text-bone/35 mb-4"
              style={{ fontWeight: 600 }}
            >
              Scope
            </p>
            <ul className="flex flex-col gap-3">
              {p.scope.map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <span
                    className="mt-[6px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: AMBER, opacity: 0.7 }}
                  />
                  <span className="text-bone/70 text-[14px] md:text-[15px] leading-[1.55]" style={{ fontWeight: 300 }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deliverables + timeline + investment */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-7">
            <div>
              <p
                className="text-[9.5px] tracking-[0.3em] uppercase text-bone/35 mb-2"
                style={{ fontWeight: 600 }}
              >
                Deliverables
              </p>
              <p className="text-bone/65 text-[14px] leading-[1.55]" style={{ fontWeight: 300 }}>
                {p.deliverables}
              </p>
            </div>

            <div className="flex gap-10">
              <div>
                <p
                  className="text-[9.5px] tracking-[0.3em] uppercase text-bone/35 mb-1"
                  style={{ fontWeight: 600 }}
                >
                  Timeline
                </p>
                <p
                  style={{
                    fontFamily: '"Fraunces", "Bodoni Moda", serif',
                    fontSize: 'clamp(20px, 2vw, 28px)',
                    letterSpacing: '-0.025em',
                    fontWeight: 600,
                    color: '#F5F5F0',
                  }}
                >
                  {p.timeline}
                </p>
              </div>
              <div>
                <p
                  className="text-[9.5px] tracking-[0.3em] uppercase text-bone/35 mb-1"
                  style={{ fontWeight: 600 }}
                >
                  Investment
                </p>
                <p
                  style={{
                    fontFamily: '"Fraunces", "Bodoni Moda", serif',
                    fontSize: 'clamp(20px, 2vw, 28px)',
                    letterSpacing: '-0.025em',
                    fontWeight: 600,
                    color: AMBER,
                  }}
                >
                  {investment}
                </p>
              </div>
            </div>

            {/* Note */}
            <div
              className="pt-5 border-t"
              style={{ borderColor: `${AMBER}25` }}
            >
              <p
                className="italic"
                style={{
                  fontFamily: '"Fraunces", "Bodoni Moda", serif',
                  fontSize: 'clamp(13px, 1.3vw, 15.5px)',
                  color: `${AMBER}BB`,
                  fontWeight: 400,
                  letterSpacing: '-0.005em',
                  lineHeight: 1.5,
                }}
              >
                &ldquo;{p.note}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function Proposals() {
  const headerRef = useRef<HTMLDivElement>(null);
  const { price } = useLocale();

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

  return (
    <section id="proposals" className="relative bg-ink text-bone overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-7 md:px-12 pt-36 md:pt-52 pb-32 md:pb-44">

        {/* Header */}
        <div ref={headerRef} className="mb-10 md:mb-12">
          <div className="line-mask mb-9">
            <span
              className="inline-flex items-center gap-3 text-[10px] tracking-[0.38em] uppercase"
              style={{ color: AMBER, fontWeight: 600 }}
            >
              <span className="inline-block w-6 h-px" style={{ background: AMBER, opacity: 0.7 }} />
              What we&rsquo;d build · 05
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
                  Real proposals.
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
                  Real numbers.
                </span>
              </div>
            </div>

            <div className="line-mask md:max-w-[33ch] md:pb-2 flex-shrink-0">
              <p
                className="text-bone/45 leading-[1.65]"
                style={{ fontSize: 'clamp(13px, 1.3vw, 14.5px)', fontWeight: 400 }}
              >
                No RFP theatre. Below is exactly what we&rsquo;d scope, build, and charge for four companies we have strong opinions about.
              </p>
            </div>
          </div>
        </div>

        {/* Proposal cards */}
        <div>
          {proposals.map((p, i) => (
            <ProposalCard key={p.client} p={p} index={i} investment={price(p.investment)} />
          ))}
          {/* Final border */}
          <div className="border-t" style={{ borderColor: 'rgba(245,245,240,0.07)' }} />
        </div>

        {/* CTA */}
        <div className="mt-16 md:mt-20 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <p
            className="italic text-bone/35"
            style={{
              fontFamily: '"Fraunces", "Bodoni Moda", serif',
              fontSize: 'clamp(13px, 1.2vw, 16px)',
              fontWeight: 400,
            }}
          >
            Your company isn&rsquo;t on this list. It could be.
          </p>
          <a
            href="#contact"
            data-cursor="active"
            className="self-start inline-flex items-center gap-4 text-[11px] tracking-[0.32em] uppercase text-bone border border-bone/25 rounded-full pl-6 pr-3 py-3 hover:bg-bone hover:text-ink transition-colors duration-300"
          >
            Get a proposal
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-current">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
