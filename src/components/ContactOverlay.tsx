import { useEffect, useRef, useState } from 'react';
import { useContactOverlay } from '../contexts/ContactOverlayContext';

type Form = {
  name: string;
  email: string;
  company: string;
  timeline: string;
  message: string;
};

const empty: Form = {
  name: '',
  email: '',
  company: '',
  timeline: '',
  message: '',
};

const timelines = ['ASAP', '1–3 months', '3–6 months', 'Q1 next year', 'Flexible'];

export default function ContactOverlay() {
  const { open, closeContact } = useContactOverlay();
  const [form, setForm] = useState<Form>(empty);
  const [sent, setSent] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeContact();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeContact]);

  // Reset form when closed
  useEffect(() => {
    if (!open) {
      setSent(false);
      // small delay so the user doesn't see fields clear before fade
      const t = window.setTimeout(() => setForm(empty), 700);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Animated reveal on open
  useEffect(() => {
    if (!open) return;
    const el = panelRef.current;
    if (!el) return;
    const lines = el.querySelectorAll<HTMLElement>('.line-mask');
    lines.forEach((l, i) => {
      window.setTimeout(() => l.classList.add('is-in'), 60 + 70 * i);
    });
    return () => {
      lines.forEach((l) => l.classList.remove('is-in'));
    };
  }, [open]);

  const update = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.message) return;
    const subject = encodeURIComponent(
      `New project — ${form.name || form.company || 'inbound'}`,
    );
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}\n${form.email}\nCompany: ${form.company || '—'}\nTimeline: ${form.timeline || '—'}`,
    );
    window.location.href = `mailto:hello@noxxe.studio?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div
      aria-hidden={!open}
      className="fixed inset-0 z-[95]"
      style={{
        pointerEvents: open ? 'auto' : 'none',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 600ms cubic-bezier(0.77,0,0.175,1), transform 700ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 20% 0%, rgba(32,80,255,0.12), transparent 60%), radial-gradient(ellipse at 100% 100%, rgba(201,169,97,0.08), transparent 55%), #0a0a0a',
        }}
      />

      {/* Panel — transform lives on the outer wrapper so overflow-y-auto scrolls on iOS */}
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
                / Contact
              </span>
            </div>
            <button
              data-cursor="active"
              onClick={closeContact}
              className="group flex items-center gap-3 text-[10.5px] tracking-[0.32em] uppercase text-bone/70 hover:text-bone transition-colors"
            >
              <span className="hidden md:inline">Close</span>
              <span
                aria-hidden
                className="relative inline-block w-7 h-7 rounded-full border border-bone/40 group-hover:border-bone transition-colors"
              >
                <span
                  className="absolute inset-0 m-auto w-3 h-px bg-current"
                  style={{ transform: 'rotate(45deg)' }}
                />
                <span
                  className="absolute inset-0 m-auto w-3 h-px bg-current"
                  style={{ transform: 'rotate(-45deg)' }}
                />
              </span>
            </button>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-7 md:px-12 pt-16 md:pt-24 pb-24 md:pb-32">
          <div className="grid grid-cols-12 gap-8 md:gap-16">
            {/* Left column — title, blurb, info */}
            <div className="col-span-12 md:col-span-6 lg:col-span-7 flex flex-col">
              <div className="line-mask block mb-6 md:mb-8">
                <span className="block text-[10.5px] tracking-[0.34em] uppercase text-bone/65" style={{ fontWeight: 500 }}>
                  ( New project · Step 0 )
                </span>
              </div>

              <div className="line-mask block">
                <span
                  className="block text-bone"
                  style={{
                    fontFamily: '"Fraunces", "Bodoni Moda", serif',
                    fontSize: 'clamp(48px, 7.6vw, 138px)',
                    lineHeight: 0.94,
                    letterSpacing: '-0.045em',
                    fontWeight: 700,
                    fontVariationSettings: '"opsz" 144, "SOFT" 30',
                  }}
                >
                  Tell us about
                </span>
              </div>
              <div className="line-mask block" style={{ paddingBottom: '0.18em' }}>
                <span
                  className="block italic text-bone"
                  style={{
                    fontFamily: '"Fraunces", "Bodoni Moda", serif',
                    fontSize: 'clamp(48px, 7.6vw, 138px)',
                    lineHeight: 0.94,
                    letterSpacing: '-0.045em',
                    fontWeight: 700,
                    fontVariationSettings: '"opsz" 144, "SOFT" 80',
                  }}
                >
                  the project.
                </span>
              </div>

              <div className="line-mask mt-8 md:mt-10 max-w-[52ch]">
                <span className="block text-bone/80 text-[15.5px] md:text-[17px] leading-[1.6]" style={{ fontWeight: 400 }}>
                  Real email, no calendar links. We read every message and reply within two business days, even when we&rsquo;re saying no. The more specific the brief, the faster the answer.
                </span>
              </div>

              <div className="mt-12 md:mt-16 grid grid-cols-2 gap-y-8 gap-x-8 max-w-[460px]">
                {[
                  { k: 'Direct', v: 'hello@noxxe.studio', href: 'mailto:hello@noxxe.studio' },
                  { k: 'Reply window', v: 'Within 2 business days' },
                  { k: 'Hours', v: 'Every day, by appointment' },
                  { k: 'Currently', v: '2 slots left for 2026' },
                ].map((s) => (
                  <div key={s.k} className="line-mask">
                    <span className="block">
                      <span className="block text-[10px] tracking-[0.32em] uppercase text-bone/45 mb-2">
                        {s.k}
                      </span>
                      {s.href ? (
                        <a
                          href={s.href}
                          data-cursor="active"
                          className="block text-bone hover:text-electric transition-colors"
                          style={{
                            fontFamily: '"Fraunces", "Bodoni Moda", serif',
                            fontSize: 'clamp(18px, 1.4vw, 22px)',
                            fontWeight: 500,
                            letterSpacing: '-0.005em',
                          }}
                        >
                          {s.v}
                        </a>
                      ) : (
                        <span
                          className="block text-bone"
                          style={{
                            fontFamily: '"Fraunces", "Bodoni Moda", serif',
                            fontSize: 'clamp(18px, 1.4vw, 22px)',
                            fontWeight: 500,
                            letterSpacing: '-0.005em',
                          }}
                        >
                          {s.v}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-16 md:pt-24 line-mask">
                <span
                  className="block italic text-bone/45"
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

            {/* Right column — form */}
            <div className="col-span-12 md:col-span-6 lg:col-span-5">
              {!sent ? (
                <form onSubmit={submit} className="flex flex-col gap-7 md:gap-8 md:pt-3">
                  <Field
                    label="Your name"
                    value={form.name}
                    onChange={(v) => update('name', v)}
                    placeholder="Ada Lovelace"
                    required
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => update('email', v)}
                    placeholder="ada@yourcompany.com"
                    required
                  />
                  <Field
                    label="Company / brand"
                    value={form.company}
                    onChange={(v) => update('company', v)}
                    placeholder="Lovelace & Co."
                  />
                  <ChipField
                    label="Timeline"
                    options={timelines}
                    value={form.timeline}
                    onChange={(v) => update('timeline', v)}
                  />
                  <Field
                    label="The project, in your own words"
                    value={form.message}
                    onChange={(v) => update('message', v)}
                    placeholder="What you're building, who it's for, what 'good' looks like to you. One paragraph is plenty."
                    textarea
                    required
                  />

                  <div className="line-mask mt-2">
                    <button
                      data-cursor="active"
                      type="submit"
                      className="group inline-flex items-center gap-4 text-[11px] tracking-[0.34em] uppercase text-bone border border-bone/30 rounded-full pl-7 pr-3 py-3.5 hover:bg-bone hover:text-ink transition-colors duration-300"
                    >
                      Send the brief
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-current"
                        style={{ transition: 'transform 400ms cubic-bezier(0.16,1,0.3,1)' }}
                      >
                        &rarr;
                      </span>
                    </button>
                  </div>

                  <div className="line-mask">
                    <span className="block text-[11px] text-bone/50 leading-[1.6] max-w-[40ch]">
                      Submitting opens your mail client with everything pre-filled. If that&rsquo;s a problem, just write to{' '}
                      <a
                        href="mailto:hello@noxxe.studio"
                        data-cursor="active"
                        className="underline underline-offset-4 hover:text-bone transition-colors"
                      >
                        hello@noxxe.studio
                      </a>
                      .
                    </span>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-6 md:pt-12">
                  <div
                    className="text-bone"
                    style={{
                      fontFamily: '"Fraunces", "Bodoni Moda", serif',
                      fontSize: 'clamp(36px, 4vw, 60px)',
                      lineHeight: 0.98,
                      fontWeight: 700,
                      letterSpacing: '-0.035em',
                    }}
                  >
                    Brief sent. Talk soon.
                  </div>
                  <p className="text-bone/75 max-w-[44ch] text-[15px] md:text-[16px] leading-[1.6]">
                    If your mail client didn&rsquo;t open, write to{' '}
                    <a
                      href="mailto:hello@noxxe.studio"
                      data-cursor="active"
                      className="underline underline-offset-4 hover:text-electric transition-colors"
                    >
                      hello@noxxe.studio
                    </a>{' '}
                    directly. We reply within two business days, every time.
                  </p>
                  <button
                    data-cursor="active"
                    onClick={closeContact}
                    className="self-start mt-4 inline-flex items-center gap-3 text-[11px] tracking-[0.32em] uppercase text-bone/70 hover:text-bone transition-colors"
                  >
                    &larr; Back to the site
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  textarea = false,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  return (
    <label className="line-mask block">
      <span className="block">
        <span className="block text-[10px] tracking-[0.32em] uppercase text-bone/50 mb-2.5">
          {label}{required && <span className="ml-1 text-electric">*</span>}
        </span>
        {textarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={4}
            required={required}

            className="w-full bg-transparent border-b border-bone/15 focus:border-bone outline-none py-3 text-bone text-[16px] md:text-[17px] resize-none transition-colors placeholder:text-bone/30"
            style={{ fontWeight: 300 }}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}

            className="w-full bg-transparent border-b border-bone/15 focus:border-bone outline-none py-3 text-bone text-[16px] md:text-[17px] transition-colors placeholder:text-bone/30"
            style={{ fontWeight: 300 }}
          />
        )}
      </span>
    </label>
  );
}

function ChipField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="line-mask block">
      <span className="block">
        <span className="block text-[10px] tracking-[0.32em] uppercase text-bone/50 mb-3">
          {label}
        </span>
        {/* Editorial slash list — no pills, no borders, just type */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            borderTop: '1px solid rgba(245,245,240,0.09)',
            paddingTop: 14,
            gap: '4px 0',
          }}
        >
          {options.map((o, i) => {
            const active = o === value;
            return (
              <span key={o} style={{ display: 'inline-flex', alignItems: 'baseline' }}>
                {i > 0 && (
                  <span
                    aria-hidden
                    style={{
                      padding: '0 9px',
                      color: 'rgba(245,245,240,0.18)',
                      fontSize: 11,
                      fontWeight: 300,
                    }}
                  >
                    /
                  </span>
                )}
                <button
                  type="button"
                  data-cursor="active"
                  onClick={() => onChange(active ? '' : o)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '3px 0',
                    fontFamily: '"Bodoni Moda", Didot, "Times New Roman", serif',
                    fontStyle: active ? 'italic' : 'normal',
                    fontSize: 15,
                    letterSpacing: '0.01em',
                    color: active ? '#C4A472' : 'rgba(245,245,240,0.38)',
                    fontWeight: 400,
                    transition: 'color 200ms ease',
                    textDecoration: active ? 'underline' : 'none',
                    textUnderlineOffset: '4px',
                    textDecorationColor: 'rgba(196,164,114,0.45)',
                    cursor: 'none',
                  }}
                >
                  {o}
                </button>
              </span>
            );
          })}
        </div>
      </span>
    </div>
  );
}
