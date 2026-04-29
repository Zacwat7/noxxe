import { createContext, useCallback, useContext, useRef, useState, ReactNode } from 'react';

type Phase = 'idle' | 'in' | 'out';

type Ctx = {
  phase: Phase;
  navigateTo: (targetId: string) => void;
};

const NavTransitionCtx = createContext<Ctx | null>(null);

export function NavTransitionProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>('idle');
  // Ref mirrors state so navigateTo closure is always current — avoids
  // React's batched-setState window where rapid double-clicks see stale phase.
  const phaseRef = useRef<Phase>('idle');
  const pendingId = useRef<string | null>(null);

  const setPhaseSync = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const navigateTo = useCallback((targetId: string) => {
    if (phaseRef.current !== 'idle') return;
    setPhaseSync('in');
    pendingId.current = targetId;

    // After curtain covers the screen, snap-scroll then reveal
    window.setTimeout(() => {
      const el = document.getElementById(pendingId.current!);
      if (el) {
        // Stop Lenis so the instant scroll doesn't fight it
        window.lenisInstance?.stop();
        el.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
      }
      setPhaseSync('out');
      window.setTimeout(() => {
        setPhaseSync('idle');
        window.lenisInstance?.start();
      }, 500);
    }, 420);
  }, []); // no deps — phaseRef is always current

  return (
    <NavTransitionCtx.Provider value={{ phase, navigateTo }}>
      {children}
    </NavTransitionCtx.Provider>
  );
}

export function useNavTransition() {
  const ctx = useContext(NavTransitionCtx);
  if (!ctx) throw new Error('useNavTransition must be used within NavTransitionProvider');
  return ctx;
}
