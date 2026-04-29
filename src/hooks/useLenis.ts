import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Global Lenis instance for external access (e.g., from nav anchors)
declare global {
  interface Window {
    lenisInstance?: Lenis;
  }
}

export function useLenis() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouch || reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    // Store global reference for anchor links and programmatic scroll
    window.lenisInstance = lenis;

    // Standard Lenis + GSAP ScrollTrigger integration.
    // Lenis updates window.scrollY naturally, so ScrollTrigger reads it as normal —
    // no scrollerProxy needed (that would break Hero's fixed-position pin + mix-blend-mode).
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Refresh once after initialization so all triggers know about Lenis
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete window.lenisInstance;
      // Do NOT kill ScrollTrigger instances here — Hero/Services triggers
      // are owned by their own components and cleaned up in their own effects.
    };
  }, []);
}
