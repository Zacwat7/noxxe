import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const ring = ringRef.current!;
    const dot = dotRef.current!;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let vx = 0;
    let vy = 0;
    let lastMx = mx;
    let lastMy = my;
    let prevTime = performance.now();
    let raf = 0;

    // Last-written position values — used to skip style writes when movement
    // is sub-pixel (< 0.05px), avoiding redundant compositor layer updates.
    let lastRx = rx;
    let lastRy = ry;
    let lastMxWritten = mx;
    let lastMyWritten = my;
    let lastScrollStretch = 0;

    // Cursor state — processed once per frame in tick, not on every mousemove
    let cursorState: string | null = null;
    let isOnLight = false;
    let pendingTarget: HTMLElement | null = null;

    // Click scale — lerped in tick, applied in same transform write as position
    let clickScale = 1;
    let clickScaleTarget = 1;

    // State scale — replaces CSS width/height transitions (those force layout
    // recalculations on every hover change, causing stutter).
    // is-active → 1.78 (64px), default → 1, is-text → 0.22 (8px dot)
    let ringStateScale = 1;
    let ringStateScaleTarget = 1;

    // Scroll stretch — wheel accumulates velocity, decays each frame
    let wheelVy = 0;
    let scrollStretch = 0;

    const onWheel = (e: WheelEvent) => {
      wheelVy += e.deltaY * 0.42;
      wheelVy = Math.max(-180, Math.min(180, wheelVy));
    };

    const spawnSparks = (x: number, y: number) => {
      const count = 8;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 26 + Math.random() * 24;
        const el = document.createElement('div');
        el.className = 'cursor-spark';
        if (isOnLight) el.classList.add('on-light');
        el.style.cssText =
          `left:${x}px;top:${y}px;` +
          `--tx:${(Math.cos(angle) * dist).toFixed(1)}px;` +
          `--ty:${(Math.sin(angle) * dist).toFixed(1)}px;` +
          `animation-duration:${420 + Math.random() * 160}ms`;
        document.body.appendChild(el);
        el.addEventListener('animationend', () => el.remove(), { once: true });
      }
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      clickScaleTarget = 1.85;
      spawnSparks(e.clientX, e.clientY);
      window.setTimeout(() => { clickScaleTarget = 1; }, 170);
    };

    const spawnRipple = (x: number, y: number, delay = 0) => {
      const el = document.createElement('div');
      el.className = 'cursor-ripple';
      el.style.cssText = `left:${x}px;top:${y}px;animation-delay:${delay}ms`;
      if (isOnLight) el.classList.add('on-light');
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove(), { once: true });
    };

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      clickScaleTarget = 0.68;
      spawnRipple(e.clientX, e.clientY);
      spawnRipple(e.clientX, e.clientY, 80);
    };
    const onUp = () => { clickScaleTarget = 1; };

    // onMove only stores coords + target — zero DOM work here
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      pendingTarget = e.target as HTMLElement;
    };

    // Light/dark: IntersectionObserver populates rect cache.
    // Rects are only read inside the RAF tick (gated to once/second) — no scroll
    // listener, so Lenis never triggers a layout flush outside the frame budget.
    type Rect = { top: number; left: number; bottom: number; right: number };
    const lightRects = new Map<Element, Rect>();

    const cacheRect = (el: Element) => {
      const r = el.getBoundingClientRect();
      // Store page-absolute coords so scroll movement doesn't stale the cache.
      // The IO fires whenever the element crosses a threshold and we snapshot
      // the current absolute position at that moment.
      lightRects.set(el, {
        top:    r.top    + window.scrollY,
        left:   r.left   + window.scrollX,
        bottom: r.bottom + window.scrollY,
        right:  r.right  + window.scrollX,
      });
    };

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) cacheRect(entry.target);
        else lightRects.delete(entry.target);
      }
    });
    document.querySelectorAll('.bg-bone, .bg-ash, [data-cursor-light]').forEach((el) => io.observe(el));

    // Keep rects fresh on resize only — IO handles enter/exit
    const onResize = () => lightRects.forEach((_, el) => cacheRect(el));
    window.addEventListener('resize', onResize, { passive: true });

    let lastLightCheck = 0;

    const tick = () => {
      const now = performance.now();
      // Cap dt at 50ms so a long GC pause doesn't teleport the cursor
      const dt = Math.min(now - prevTime, 50);
      prevTime = now;

      // Frame-rate-independent lerp: same feel at any refresh rate
      const alpha = 1 - Math.pow(0.72, dt / 16.667);

      const dx = mx - lastMx;
      const dy = my - lastMy;
      vx = vx * 0.7 + dx * 0.3;
      vy = vy * 0.7 + dy * 0.3;
      lastMx = mx;
      lastMy = my;

      rx += (mx - rx) * alpha;
      ry += (my - ry) * alpha;

      clickScale += (clickScaleTarget - clickScale) * (1 - Math.pow(0.75, dt / 16.667));
      ringStateScale += (ringStateScaleTarget - ringStateScale) * (1 - Math.pow(0.78, dt / 16.667));

      wheelVy *= Math.pow(0.80, dt / 16.667);
      const targetStretch = Math.min(Math.abs(wheelVy) * 0.014, 0.85);
      scrollStretch += (targetStretch - scrollStretch) * (1 - Math.pow(0.78, dt / 16.667));
      const sy = 1 + scrollStretch;
      const sx = 1 - scrollStretch * 0.35;

      const speed = Math.hypot(vx, vy);
      const lean = Math.min(6, speed * 0.25);
      const angle = speed > 0.01 ? Math.atan2(vy, vx) : 0;

      const baseScale = clickScale * ringStateScale;
      // Write the ring transform when position OR scroll stretch has changed.
      // Previously gated only on ringMoved — meaning a stationary mouse while
      // scrolling never got the scaleY stretch applied (cursor stayed a circle).
      const ringMoved = Math.abs(rx - lastRx) >= 0.05 || Math.abs(ry - lastRy) >= 0.05;
      const stretchChanged = Math.abs(scrollStretch - lastScrollStretch) >= 0.001;
      if (ringMoved || stretchChanged) {
        lastRx = rx;
        lastRy = ry;
        lastScrollStretch = scrollStretch;
        ring.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0) scale(${baseScale.toFixed(3)}) scaleY(${sy.toFixed(3)}) scaleX(${sx.toFixed(3)})`;
      }
      // Dot tracks raw mouse so it feels instant; ring trails for the fluid effect
      const dotX = mx + Math.cos(angle) * lean - 2;
      const dotY = my + Math.sin(angle) * lean - 2;
      const dotMoved = Math.abs(dotX - lastMxWritten) >= 0.05 || Math.abs(dotY - lastMyWritten) >= 0.05;
      if (dotMoved) {
        lastMxWritten = dotX;
        lastMyWritten = dotY;
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      }

      // Cursor state — once per frame, not per mousemove event
      if (pendingTarget) {
        const t = pendingTarget;
        pendingTarget = null;
        const closest = t.closest?.('[data-cursor]') as HTMLElement | null;
        const next = closest ? closest.getAttribute('data-cursor') : null;
        if (next !== cursorState) {
          cursorState = next;
          ring.classList.remove('is-active', 'is-text');
          if (next === 'text') {
            ring.classList.add('is-text');
            ringStateScaleTarget = 0.22;   // 36 × 0.22 ≈ 8px dot
          } else if (next) {
            ring.classList.add('is-active');
            ringStateScaleTarget = 1.78;   // 36 × 1.78 ≈ 64px
          } else {
            ringStateScaleTarget = 1;
          }
        }
      }

      // Light check: pure point-in-rect math, every 200ms
      if (now - lastLightCheck > 200) {
        lastLightCheck = now;
        let next = false;
        for (const r of lightRects.values()) {
          const ay = my + window.scrollY;
          if (mx >= r.left && mx <= r.right && ay >= r.top && ay <= r.bottom) {
            next = true;
            break;
          }
        }
        if (next !== isOnLight) {
          isOnLight = next;
          ring.classList.toggle('on-light', next);
          dot.classList.toggle('on-light', next);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    // capture: true — fires during the top-down capture phase, BEFORE any
    // bubble-phase stopPropagation (e.g. Portfolio's wheel handler). This
    // ensures the scroll-stretch effect works even when a child element stops
    // propagation to prevent Lenis from interfering with horizontal scroll.
    window.addEventListener('wheel', onWheel, { passive: true, capture: true });
    window.addEventListener('contextmenu', onContextMenu);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
