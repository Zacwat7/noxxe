import { useNavTransition } from '../contexts/NavTransitionContext';

const AMBER = '#C4A472';

export default function NavCurtain() {
  const { phase } = useNavTransition();

  // idle → off-screen left
  // in   → slides right to cover screen
  // out  → continues right to exit screen
  const translateX =
    phase === 'idle' ? '-100%' :
    phase === 'in'   ? '0%'   :
                       '100%';

  const transition =
    phase === 'in'
      ? 'transform 420ms cubic-bezier(0.77,0,0.175,1)'
      : phase === 'out'
        ? 'transform 500ms cubic-bezier(0.77,0,0.175,1)'
        : 'none';

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        pointerEvents: phase !== 'idle' ? 'auto' : 'none',
        transform: `translateX(${translateX})`,
        transition,
        background: '#080808',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Amber leading-edge line */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 1,
          background: `linear-gradient(to bottom, transparent 0%, ${AMBER} 30%, ${AMBER} 70%, transparent 100%)`,
          opacity: 0.55,
        }}
      />
      {/* NOXXE wordmark centred in curtain */}
      <span
        style={{
          fontFamily: '"Bodoni Moda", Didot, serif',
          fontSize: 'clamp(18px, 2.5vw, 32px)',
          letterSpacing: '0.38em',
          color: 'rgba(245,245,240,0.12)',
          fontWeight: 500,
          userSelect: 'none',
        }}
      >
        NOXXE
      </span>
    </div>
  );
}
