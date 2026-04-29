interface Props {
  line1?: string;
  line2?: string;
  dark?: boolean;
}

export default function ScrollMarquee({
  line1 = 'NOXXE · STUDIO · BY APPOINTMENT ONLY ·',
  line2 = 'WEBSITES THAT GET SCREENSHOTTED ·',
  dark = true,
}: Props) {
  const fg     = dark ? 'rgba(245,245,240,0.22)' : 'rgba(17,17,17,0.22)';
  const stroke = dark ? 'rgba(245,245,240,0.45)' : 'rgba(17,17,17,0.42)';
  const bg     = dark ? '#111111' : '#E8E8E3';

  // 3 copies: the @keyframes roll -33.333% (one copy width), seamless loop
  const text1 = `${line1}  ${line1}  ${line1}`;
  const text2 = `${line2}  ${line2}  ${line2}`;

  const baseStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: '"Fraunces", "Bodoni Moda", serif',
    fontSize: 'clamp(64px, 11vw, 170px)',
    lineHeight: 1.0,
    letterSpacing: '-0.01em',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  };

  return (
    <section
      aria-hidden
      className="relative overflow-hidden select-none"
      style={{ background: bg, paddingBlock: 'clamp(6px, 1vw, 14px)' }}
      {...(!dark ? { 'data-cursor-light': '' } : {})}
    >
      {/* Row 1 — scrolls LEFT, pure CSS, zero JS per frame */}
      <div
        style={{
          display: 'block',
          width: 'max-content',
          willChange: 'transform',
          animation: 'marquee-ltr 24s linear infinite',
        }}
      >
        <span
          style={{
            ...baseStyle,
            fontVariationSettings: '"opsz" 144, "SOFT" 10',
            color: fg,
          }}
        >
          {text1}
        </span>
      </div>

      {/* Row 2 — scrolls RIGHT, offset start via negative delay so rows aren't mirrored */}
      <div
        style={{
          display: 'block',
          width: 'max-content',
          willChange: 'transform',
          animation: 'marquee-rtl 30s linear infinite',
          animationDelay: '-9s',
        }}
      >
        <span
          style={{
            ...baseStyle,
            fontStyle: 'italic',
            fontVariationSettings: '"opsz" 144, "SOFT" 80',
            color: 'transparent',
            WebkitTextStroke: `1.5px ${stroke}`,
          }}
        >
          {text2}
        </span>
      </div>
    </section>
  );
}
