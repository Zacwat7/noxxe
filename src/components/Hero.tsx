import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  // Evaluated synchronously on first render so the autoPlay prop is baked into
  // the video element's initial HTML — iOS Safari checks the autoplay attribute
  // at element creation, before any useEffect JS runs.
  const [isTouch] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: none) and (pointer: coarse)').matches
  );

  useEffect(() => {
    const section = sectionRef.current!;
    const video = videoRef.current!;
    const overlay = overlayRef.current!;
    const title = titleRef.current!;
    const eyebrow = eyebrowRef.current!;
    const plate = plateRef.current!;
    if (!section || !video) return;

    // iOS Safari cannot seek a non-playing video via currentTime — the browser
    // won't buffer frames until play() is called. Detect touch devices and fall
    // back to normal playback instead of scroll-scrubbing.
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    video.muted = true;
    video.playsInline = true;
    // Desktop only: browsers cache currentTime across refreshes so the video
    // can restore to the last-scrubbed frame. On touch we skip this — setting
    // currentTime on an unloaded video creates a pending seek that can cause
    // the autoplay to abort with AbortError before the first frame appears.
    if (!isTouchDevice) video.currentTime = 0;

    let st: ScrollTrigger | null = null;

    // Cached state to avoid redundant DOM writes on every rAF tick
    let lastOverlayOpacity = -1;
    let lastPlateOpacity = -1;
    let eyebrowIn = false;
    let titleIn = false;
    let blurbIn = false;

    // Helpers — toggle reveal classes at progress thresholds.
    const reveal = (els: NodeListOf<Element> | Element[], on: boolean) => {
      els.forEach((el) => {
        if (on) el.classList.add('is-in');
        else el.classList.remove('is-in');
      });
    };

    const buildTrigger = () => {
      const dur = video.duration;
      if (!dur || !isFinite(dur)) return;

      const isMobile = window.innerWidth < 768;

      st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: isMobile ? '+=160%' : '+=240%',
        pin: true,
        anticipatePin: 1,
        scrub: 1.8, // higher = smoother, more cinematic feel
        invalidateOnRefresh: true,
        onUpdate: (self: ScrollTrigger) => {
          const p = self.progress;

          // VIDEO scrub — desktop only. iOS Safari won't buffer frames until
          // play() is called, so currentTime seeks produce a black screen there.
          if (!isTouchDevice) {
            const vp = Math.min(1, p / 0.88);
            const t = vp * dur;
            if (Math.abs(video.currentTime - t) > 0.033) {
              video.currentTime = t;
            }
          }

          // Vignette deepens linearly — only write when value changes meaningfully
          const newOverlay = Math.round((0.15 + p * 0.6) * 100) / 100;
          if (newOverlay !== lastOverlayOpacity) {
            overlay.style.opacity = String(newOverlay);
            lastOverlayOpacity = newOverlay;
          }

          // Backing plate fades up only in the late beat
          const newPlate = Math.round(Math.max(0, Math.min(1, (p - 0.78) / 0.12)) * 100) / 100;
          if (newPlate !== lastPlateOpacity) {
            plate.style.opacity = String(newPlate);
            lastPlateOpacity = newPlate;
          }

          // Reveal beats — held back so the video carries the first 80% alone.
          // Guard with booleans so classList mutations only fire on state change.
          const wantEyebrow = p >= 0.82;
          if (wantEyebrow !== eyebrowIn) {
            eyebrowIn = wantEyebrow;
            reveal(eyebrow.querySelectorAll('.line-mask'), wantEyebrow);
          }
          const wantTitle = p >= 0.86;
          if (wantTitle !== titleIn) {
            titleIn = wantTitle;
            reveal(title.querySelectorAll('.line-mask'), wantTitle);
          }
          const wantBlurb = p >= 0.94;
          if (wantBlurb !== blurbIn) {
            blurbIn = wantBlurb;
            reveal(section.querySelectorAll('[data-blurb]'), wantBlurb);
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onComplete: () => {
          // After hero pin completes, refresh ScrollTrigger to recalculate all
          // trigger positions. This fixes downstream IntersectionObservers that
          // may have cached incorrect positions during the 240% pinned scroll.
          ScrollTrigger.refresh();
        },
        onLeave: () => {
          if (!isTouchDevice && video.duration && isFinite(video.duration)) {
            video.currentTime = video.duration;
          }
        },
        onLeaveBack: () => {
          if (!isTouchDevice) video.currentTime = 0;
        },
      } as any);

      ScrollTrigger.refresh();
    };

    // Prime the decoder AFTER we have duration and the trigger is built.
    // Calling prime() before metadata is ready creates a race: the 400ms
    // reset timer fires while buildTrigger() / the user's first scroll are
    // also touching currentTime, causing the video to jump back to frame 0.
    const prime = () => {
      if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
      video.currentTime = 0;
      video.playbackRate = 4;
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
      window.setTimeout(() => {
        video.pause();
        video.playbackRate = 1;
        video.currentTime = 0;
      }, 400);
    };

    const onReady = () => {
      buildTrigger();
      if (!isTouchDevice) prime();
    };

    if (video.readyState >= 1 && video.duration && isFinite(video.duration)) {
      onReady();
    } else {
      video.addEventListener('loadedmetadata', onReady, { once: true });
    }

    // iOS Safari deadlock fix: iOS won't preload video data without play() being
    // called first, so loadedmetadata never fires — onReady never runs — play()
    // never gets called. Break the cycle by calling play() immediately here,
    // unconditionally. muted + playsInline HTML attrs make this always allowed.
    if (isTouchDevice) {
      video.play().catch(() => {});
    }

    return () => {
      video.removeEventListener('loadedmetadata', onReady);
      st?.kill();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full h-[100svh] overflow-hidden bg-ink"
    >
      {/* Video container — landscape strip on mobile (no letterbox), full-bleed on desktop.
          GPU hint lives on the wrapper, NOT the video: translate3d + backface-visibility
          directly on a <video> element causes iOS Safari to render the video blank. */}
      <div className="hero-video-wrap" style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' } as any}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/videos/hero-scrub.mp4"
          muted
          playsInline
          autoPlay={isTouch}
          preload="auto"
          disablePictureInPicture
          {...({ 'webkit-playsinline': 'true', 'x5-playsinline': 'true' } as any)}
        />
        {/* Mobile-only: dissolve bottom edge into the dark section background */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none md:hidden"
          style={{ background: 'linear-gradient(to bottom, transparent 0%, #080808 100%)' }}
        />
      </div>

      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Headline backing plate — fades up in the late beat to anchor the type */}
      <div
        ref={plateRef}
        aria-hidden
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '78%',
          opacity: 0,
          background:
            'linear-gradient(180deg, rgba(8,8,8,0) 0%, rgba(8,8,8,0.18) 38%, rgba(8,8,8,0.62) 78%, rgba(8,8,8,0.86) 100%)',
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-end px-7 md:px-12 pb-10 md:pb-12">
        {/* Top-right meta strip — always visible */}
        <div className="absolute top-28 md:top-32 right-7 md:right-12 text-right text-[10px] tracking-[0.32em] uppercase text-bone/60">
          <div>Est. MMXIX</div>
          <div className="mt-1">By appointment only</div>
          <div className="mt-2 flex items-center justify-end gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 5px 1px rgba(52,211,153,0.6)' }} />
            <span className="text-bone/50">Available every day</span>
          </div>
        </div>

        {/* Eyebrow + Headline lockup, anchored bottom-left */}
        <div className="max-w-[1600px] mx-auto w-full">
          <div ref={eyebrowRef} className="flex items-center gap-4 mb-7 md:mb-9">
            <span className="line-mask inline-block">
              <span className="inline-block text-[10px] tracking-[0.34em] uppercase text-bone/75">
                ( Studio manifesto · 01 )
              </span>
            </span>
            <span className="hidden md:inline-block w-16 h-px bg-bone/30" />
          </div>

          <div ref={titleRef} className="relative">
            {/* paddingBottom uses vw to track the display font (8.6vw) so
                overflow:hidden never clips ascenders or descenders regardless
                of viewport width. em would resolve against the 16px body
                font-size, not the 46–152px display size. */}
            <div data-line className="line-mask block" style={{ paddingBottom: 'clamp(4px, 0.7vw, 12px)' }}>
              <span
                className="font-editorial text-bone block"
                style={{
                  fontSize: 'clamp(46px, 8.6vw, 152px)',
                  lineHeight: 0.96,
                  letterSpacing: '-0.045em',
                  fontWeight: 700,
                  fontVariationSettings: '"opsz" 144, "SOFT" 30',
                  textShadow:
                    '0 1px 0 rgba(0,0,0,0.35), 0 4px 28px rgba(0,0,0,0.55)',
                }}
              >
                Websites that
              </span>
            </div>
            {/* Extra bottom room for the "g" descender in "get screenshotted." */}
            <div data-line className="line-mask block" style={{ paddingBottom: 'clamp(12px, 2.4vw, 40px)' }}>
              <span
                className="font-editorial text-bone block italic"
                style={{
                  fontSize: 'clamp(46px, 8.6vw, 152px)',
                  lineHeight: 0.96,
                  letterSpacing: '-0.045em',
                  fontWeight: 700,
                  fontVariationSettings: '"opsz" 144, "SOFT" 80',
                  textShadow:
                    '0 1px 0 rgba(0,0,0,0.35), 0 4px 28px rgba(0,0,0,0.55)',
                }}
              >
                get screenshotted.
              </span>
            </div>
          </div>

          {/* Bottom row: blurb + scroll cue */}
          <div className="mt-10 md:mt-12 flex justify-between items-end gap-10 flex-wrap">
            <div className="max-w-[420px]">
              <div data-blurb className="line-mask block">
                <span
                  className="text-bone/85 text-[14px] md:text-[15px] leading-[1.55] block"
                  style={{ fontWeight: 300 }}
                >
                  We make the kind of web work that holds up at sub-1.2s LCP and still looks like nothing else online. Where we&rsquo;re based isn&rsquo;t the point.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[10px] tracking-[0.32em] uppercase text-bone/65">
              <span className="inline-block w-8 h-px bg-bone/30" />
              <span>Scroll to begin</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

