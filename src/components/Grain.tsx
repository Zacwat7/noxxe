import { useEffect, useRef } from 'react';

// Pre-bake a 256×256 noise tile on first mount and apply it as a tiled
// background-image. This replaces the feTurbulence SVG filter approach:
// feTurbulence on a fixed full-viewport element forces the CPU rasterizer to
// repaint the entire viewport on every scroll tick (~8–15ms/frame).
// A canvas-generated PNG is uploaded to a GPU texture once and tiled by the
// compositor at zero per-frame CPU cost.
export default function Grain() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const SIZE = 256;
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = ctx.createImageData(SIZE, SIZE);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      data[i]     = v;  // R
      data[i + 1] = v;  // G
      data[i + 2] = v;  // B
      data[i + 3] = 153; // A ≈ 60% — final opacity set by .grain class (0.055)
    }
    ctx.putImageData(img, 0, 0);

    el.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
  }, []);

  return <div ref={ref} className="grain" aria-hidden />;
}
