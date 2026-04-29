import { useEffect, useRef, useState } from 'react';

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-in');
            const lines = el.querySelectorAll<HTMLElement>('.line-mask');
            lines.forEach((l, i) =>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const subject = encodeURIComponent(`New project — ${name || 'inbound'}`);
    const body = encodeURIComponent(
      `${msg}\n\n— ${name}\n${email}`,
    );
    window.location.href = `mailto:hello@noxxe.studio?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" className="relative bg-ink text-bone overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-7 md:px-12 pt-32 md:pt-44 pb-20 md:pb-28">
        <div ref={ref} className="grid grid-cols-12 gap-8 md:gap-16">
          <div className="col-span-12 md:col-span-7">
            <div className="line-mask">
              <span className="block text-[10px] tracking-[0.32em] uppercase text-bone/55">
                ( If you&rsquo;ve read this far )
              </span>
            </div>
            <div className="line-mask mt-8">
              <span
                className="font-display block"
                style={{
                  fontSize: 'clamp(56px, 9vw, 168px)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.045em',
                  fontWeight: 500,
                  color: '#F5F5F0',
                }}
              >
                Tell us
              </span>
            </div>
            <div className="line-mask">
              <span
                className="font-display block italic"
                style={{
                  fontSize: 'clamp(56px, 9vw, 168px)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.045em',
                  fontWeight: 500,
                  color: '#F5F5F0',
                }}
              >
                what you&rsquo;re building.
              </span>
            </div>

            <div className="line-mask mt-10 max-w-[44ch]">
              <span className="block text-bone/65 text-[15px] leading-[1.6]" style={{ fontWeight: 300 }}>
                One line is enough. We read every email and reply within two business days, even when we&rsquo;re saying no.{' '}
                Or slide into our{' '}
                <a
                  href="https://www.instagram.com/noxxe_agency/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-bone transition-colors"
                  data-cursor="active"
                >
                  Instagram DMs
                </a>
                .
              </span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-5 md:pt-12">
            {!sent ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                <Field
                  label="Your name"
                  value={name}
                  onChange={setName}
                  placeholder="Ada Lovelace"
                />
                <Field
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  placeholder="ada@studio.com"
                  type="email"
                  required
                />
                <Field
                  label="The project, in one line"
                  value={msg}
                  onChange={setMsg}
                  placeholder="A site that finally makes our story land."
                  textarea
                />
                <button
                  data-cursor="active"
                  type="submit"
                  className="self-start mt-4 group inline-flex items-center gap-4 text-[11px] tracking-[0.32em] uppercase text-bone border border-bone/25 rounded-full pl-6 pr-3 py-3 hover:bg-bone hover:text-ink transition-colors duration-300"
                >
                  Send it
                  <span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-current"
                    style={{ transition: 'transform 400ms cubic-bezier(0.16,1,0.3,1)' }}
                  >
                    →
                  </span>
                </button>
              </form>
            ) : (
              <div className="line-mask is-in">
                <span className="block text-bone/80 text-[16px]" style={{ fontWeight: 300 }}>
                  Got it. Check your mail client — it should be open. If not,{' '}
                  <a className="underline underline-offset-4 hover:text-bone" href="mailto:hello@noxxe.studio">
                    hello@noxxe.studio
                  </a>
                  .
                </span>
              </div>
            )}
          </div>
        </div>

        {/* footer line */}
        <div className="mt-24 md:mt-32 pt-10 border-t border-bone/10 flex flex-wrap items-center justify-between gap-6 text-[10px] tracking-[0.28em] uppercase text-bone/50">
          <div>NOXXE Studio · By appointment only</div>
          <div className="flex gap-6">
            <a href="mailto:hello@noxxe.studio" data-cursor="active" className="hover:text-bone transition-colors">
              hello@noxxe.studio
            </a>
            <a
              href="https://www.instagram.com/noxxe_agency/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="active"
              className="hover:text-bone transition-colors"
            >
              Instagram
            </a>
          </div>
          <div className="italic" style={{ fontFamily: '"Bodoni Moda", Didot, serif' }}>
            / MMXXVI
          </div>
        </div>

        {/* easter egg — quietly visible only on hover */}
        <div
          aria-hidden
          className="mt-6 text-[10px] tracking-[0.28em] uppercase text-transparent hover:text-bone/35 transition-colors duration-700"
          data-cursor="active"
        >
          ( the cursor is a circle. always was. )
        </div>
      </div>
    </section>
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
    <label className="block">
      <span className="block text-[10px] tracking-[0.32em] uppercase text-bone/45 mb-2">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          required={required}

          className="w-full bg-transparent border-b border-bone/15 focus:border-bone outline-none py-3 text-bone text-[16px] resize-none transition-colors"
          style={{ fontWeight: 300 }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}

          className="w-full bg-transparent border-b border-bone/15 focus:border-bone outline-none py-3 text-bone text-[16px] transition-colors"
          style={{ fontWeight: 300 }}
        />
      )}
    </label>
  );
}
