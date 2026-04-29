import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

type Ctx = {
  open: boolean;
  openContact: () => void;
  closeContact: () => void;
};

const ContactCtx = createContext<Ctx | null>(null);

export function ContactOverlayProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openContact = useCallback(() => {
    setOpen(true);
    if (typeof window !== 'undefined') {
      // Treat as a route — push #contact so the back button closes the overlay.
      if (window.location.hash !== '#contact-form') {
        window.history.pushState({ overlay: 'contact' }, '', '#contact-form');
      }
    }
  }, []);

  const closeContact = useCallback(() => {
    setOpen(false);
    if (typeof window !== 'undefined' && window.location.hash === '#contact-form') {
      // Pop the hash if we're still on it
      window.history.back();
    }
  }, []);

  // React to history changes (back button, manual hash edits)
  useEffect(() => {
    const onPop = () => {
      setOpen(window.location.hash === '#contact-form');
    };
    // If user lands on the URL with #contact-form already, open it.
    if (window.location.hash === '#contact-form') setOpen(true);
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onPop);
    };
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <ContactCtx.Provider value={{ open, openContact, closeContact }}>
      {children}
    </ContactCtx.Provider>
  );
}

export function useContactOverlay() {
  const ctx = useContext(ContactCtx);
  if (!ctx) throw new Error('useContactOverlay must be used within ContactOverlayProvider');
  return ctx;
}
