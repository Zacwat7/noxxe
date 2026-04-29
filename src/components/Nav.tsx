import { useEffect, useRef, useState } from 'react';
import { useContactOverlay } from '../contexts/ContactOverlayContext';
import { useTestimonialsOverlay } from '../contexts/TestimonialsOverlayContext';
import { useNavTransition } from '../contexts/NavTransitionContext';

export default function Nav() {
  const { openContact } = useContactOverlay();
  const { openTestimonials } = useTestimonialsOverlay();
  const { navigateTo } = useNavTransition();
  const [scrolled, setScrolled] = useState(false);
  const [easter, setEaster] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock / unlock scroll when mobile menu toggles
  useEffect(() => {
    if (mobileOpen) {
      window.lenisInstance?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      window.lenisInstance?.start();
      document.body.style.overflow = '';
    }
    return () => {
      // Clean up on unmount
      window.lenisInstance?.start();
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  // Desktop nav: curtain wipe transition to section
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    navigateTo(targetId);
  };

  // Mobile nav: close panel first, then curtain transition
  const handleMobileAnchor = (targetId: string) => {
    closeMobile();
    setTimeout(() => navigateTo(targetId), 320);
  };

  return (
    <>
      <nav
        ref={ref}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          padding: scrolled ? '14px 28px' : '22px 28px',
          backdropFilter: scrolled ? 'blur(12px) saturate(120%)' : 'none',
          background: scrolled ? 'rgba(17,17,17,0.55)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(245,245,240,0.06)' : '1px solid transparent',
          transition: 'padding 700ms ease-out, background 700ms ease-out, border-bottom-color 700ms ease-out',
        }}
      >
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          {/* ── Logo ── */}
          <a
            href="#hero"
            onClick={(e) => handleAnchorClick(e, 'hero')}
            data-cursor="active"
            className="relative inline-block select-none"
            onMouseEnter={() => setEaster(true)}
            onMouseLeave={() => setEaster(false)}
          >
            <span
              className="font-display text-[19px] tracking-[0.32em] text-bone"
              style={{ fontWeight: 500 }}
            >
              NOXXE
            </span>
            <span
              aria-hidden
              className="absolute left-0 top-full mt-1 italic text-[10px] tracking-[0.18em] whitespace-nowrap"
              style={{
                fontFamily: '"Bodoni Moda", Didot, serif',
                color: 'rgba(245,245,240,0.55)',
                opacity: easter ? 1 : 0,
                transform: easter ? 'translateY(0)' : 'translateY(-3px)',
                transition: 'opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              established by chance, run on purpose
            </span>
          </a>

          {/* ── Desktop nav links ── */}
          <ul className="hidden lg:flex gap-10 text-[11px] tracking-[0.28em] uppercase text-bone/70">
            <li>
              <a
                href="#services"
                onClick={(e) => handleAnchorClick(e, 'services')}
                data-cursor="active"
                className="hover:text-bone transition-colors"
              >
                Process
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={() => openTestimonials()}
                data-cursor="active"
                className="bg-transparent border-0 p-0 m-0 font-inherit text-inherit tracking-[0.28em] uppercase text-bone/70 hover:text-bone transition-colors text-[11px] cursor-none"
              >
                Reviews
              </button>
            </li>
            <li>
              <a
                href="#portfolio"
                onClick={(e) => handleAnchorClick(e, 'portfolio')}
                data-cursor="active"
                className="hover:text-bone transition-colors"
              >
                Selected Work
              </a>
            </li>
            <li>
              <a
                href="#about"
                onClick={(e) => handleAnchorClick(e, 'about')}
                data-cursor="active"
                className="hover:text-bone transition-colors"
              >
                FAQ
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  openContact();
                }}
                data-cursor="active"
                className="bg-transparent border-0 p-0 m-0 font-inherit text-inherit tracking-[0.28em] uppercase text-bone/70 hover:text-bone transition-colors text-[11px] cursor-none"
              >
                Contact
              </button>
            </li>
          </ul>

          {/* ── Desktop CTA ── */}
          <button
            type="button"
            onClick={() => openContact()}
            data-cursor="active"
            className="hidden md:inline-block text-[11px] tracking-[0.28em] uppercase text-bone border border-bone/20 rounded-full px-5 py-2.5 hover:bg-bone hover:text-ink transition-colors duration-300"
          >
            Start a project
          </button>

          {/* ── Mobile hamburger trigger ── */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            data-cursor="active"
            className="lg:hidden relative flex flex-col justify-center items-center w-10 h-10 bg-transparent border-0 p-0 cursor-none"
          >
            {/* Line 1 */}
            <span
              aria-hidden
              style={{
                display: 'block',
                width: '22px',
                height: '1.5px',
                backgroundColor: 'rgba(245,245,240,0.7)',
                transformOrigin: 'center',
                transition: 'transform 400ms cubic-bezier(0.16,1,0.3,1), opacity 300ms ease',
                transform: mobileOpen
                  ? 'translateY(5px) rotate(45deg)'
                  : 'translateY(-4px) rotate(0deg)',
              }}
            />
            {/* Line 2 (middle — fades out) */}
            <span
              aria-hidden
              style={{
                display: 'block',
                width: '22px',
                height: '1.5px',
                backgroundColor: 'rgba(245,245,240,0.7)',
                transformOrigin: 'center',
                transition: 'opacity 200ms ease',
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            {/* Line 3 */}
            <span
              aria-hidden
              style={{
                display: 'block',
                width: '22px',
                height: '1.5px',
                backgroundColor: 'rgba(245,245,240,0.7)',
                transformOrigin: 'center',
                transition: 'transform 400ms cubic-bezier(0.16,1,0.3,1), opacity 300ms ease',
                transform: mobileOpen
                  ? 'translateY(-5px) rotate(-45deg)'
                  : 'translateY(4px) rotate(0deg)',
              }}
            />
          </button>
        </div>
      </nav>

      {/* ── Mobile full-screen overlay panel ── */}
      <div
        aria-hidden={!mobileOpen}
        className="fixed inset-0 z-40 lg:hidden flex flex-col"
        style={{
          background: '#080808',
          backgroundImage:
            'radial-gradient(ellipse at 80% 0%, rgba(196,164,114,0.08), transparent 50%)',
          transform: mobileOpen ? 'translateY(0)' : 'translateY(-100%)',
          opacity: mobileOpen ? 1 : 0,
          transition:
            'transform 500ms cubic-bezier(0.16,1,0.3,1), opacity 400ms cubic-bezier(0.16,1,0.3,1)',
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
      >
        {/* Subtle amber hairline at top */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(196,164,114,0.35) 40%, rgba(196,164,114,0.35) 60%, transparent 100%)',
            opacity: mobileOpen ? 1 : 0,
            transition: 'opacity 600ms 200ms ease',
          }}
        />

        {/* Nav links — centred, stacked */}
        <nav
          className="flex flex-col justify-center flex-1 px-8"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-8">
            {[
              { label: 'Process', action: () => handleMobileAnchor('services') },
              {
                label: 'Reviews',
                action: () => {
                  closeMobile();
                  setTimeout(() => openTestimonials(), 320);
                },
              },
              { label: 'Selected Work', action: () => handleMobileAnchor('portfolio') },
              { label: 'FAQ', action: () => handleMobileAnchor('about') },
              {
                label: 'Contact',
                action: () => {
                  closeMobile();
                  setTimeout(() => openContact(), 320);
                },
              },
            ].map(({ label, action }, i) => (
              <li key={label}>
                <button
                  type="button"
                  onClick={action}
                  data-cursor="active"
                  className="bg-transparent border-0 p-0 m-0 w-full text-left"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,245,240,0.75)',
                    cursor: 'none',
                    /* Staggered reveal — only plays when menu opens */
                    opacity: mobileOpen ? 1 : 0,
                    transform: mobileOpen ? 'translateY(0)' : 'translateY(10px)',
                    transition: `opacity 500ms cubic-bezier(0.16,1,0.3,1) ${100 + i * 60}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${80 + i * 60}ms`,
                  }}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div
            style={{
              marginTop: '3rem',
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? 'translateY(0)' : 'translateY(10px)',
              transition:
                'opacity 500ms cubic-bezier(0.16,1,0.3,1) 420ms, transform 600ms cubic-bezier(0.16,1,0.3,1) 400ms',
            }}
          >
            <button
              type="button"
              onClick={() => {
                closeMobile();
                setTimeout(() => openContact(), 320);
              }}
              data-cursor="active"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'rgba(245,245,240,1)',
                border: '1px solid rgba(245,245,240,0.20)',
                borderRadius: '9999px',
                padding: '12px 24px',
                background: 'transparent',
                cursor: 'none',
                transition: 'background 300ms ease, color 300ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'rgba(245,245,240,0.07)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              Start a project
            </button>
          </div>
        </nav>

        {/* Footer metadata */}
        <div
          className="px-8 pb-10"
          style={{
            opacity: mobileOpen ? 1 : 0,
            transition: 'opacity 500ms cubic-bezier(0.16,1,0.3,1) 480ms',
          }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(245,245,240,0.25)',
            }}
          >
            © NOXXE Studio
          </p>
        </div>
      </div>
    </>
  );
}
