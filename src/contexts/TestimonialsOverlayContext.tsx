import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

type Ctx = {
  open: boolean;
  openTestimonials: () => void;
  closeTestimonials: () => void;
};

const TestimonialsCtx = createContext<Ctx | null>(null);

export function TestimonialsOverlayProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openTestimonials = useCallback(() => {
    setOpen(true);
    if (typeof window !== 'undefined' && window.location.hash !== '#reviews') {
      window.history.pushState({ overlay: 'reviews' }, '', '#reviews');
    }
  }, []);

  const closeTestimonials = useCallback(() => {
    setOpen(false);
    if (typeof window !== 'undefined' && window.location.hash === '#reviews') {
      window.history.back();
    }
  }, []);

  useEffect(() => {
    const onPop = () => setOpen(window.location.hash === '#reviews');
    if (window.location.hash === '#reviews') setOpen(true);
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onPop);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Pause Lenis so wheel events reach the overlay's overflow-y-auto panel
    window.lenisInstance?.stop();
    return () => {
      document.body.style.overflow = prev;
      window.lenisInstance?.start();
    };
  }, [open]);

  return (
    <TestimonialsCtx.Provider value={{ open, openTestimonials, closeTestimonials }}>
      {children}
    </TestimonialsCtx.Provider>
  );
}

export function useTestimonialsOverlay() {
  const ctx = useContext(TestimonialsCtx);
  if (!ctx) throw new Error('useTestimonialsOverlay must be used within TestimonialsOverlayProvider');
  return ctx;
}
