import { useEffect } from 'react';
import { useLenis } from './hooks/useLenis';
import { ContactOverlayProvider } from './contexts/ContactOverlayContext';
import { TestimonialsOverlayProvider } from './contexts/TestimonialsOverlayContext';
import { NavTransitionProvider } from './contexts/NavTransitionContext';
import CustomCursor from './components/CustomCursor';
import Grain from './components/Grain';
import Preloader from './components/Preloader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import ScrollMarquee from './components/ScrollMarquee';
import LogoInterlude from './components/LogoInterlude';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Proposals from './components/Proposals';
import Contact from './components/Contact';
import ContactOverlay from './components/ContactOverlay';
import TestimonialsOverlay from './components/TestimonialsOverlay';
import NavCurtain from './components/NavCurtain';

export default function App() {
  useLenis();

  useEffect(() => {
    // scrollRestoration is set synchronously in main.tsx before React renders.
    // This effect just ensures Lenis (which initialises on the first RAF tick)
    // is also snapped to 0 so it agrees with the native scroll position.
    if (window.location.hash !== '#contact-form') {
      window.lenisInstance?.scrollTo(0, { immediate: true });
    }
  }, []);

  return (
    <NavTransitionProvider>
    <ContactOverlayProvider>
      <TestimonialsOverlayProvider>
        <Preloader />
        <CustomCursor />
        <Grain />
        <Nav />
        <main>
          <Hero />
          <Services />
          <ScrollMarquee line1="NOXXE  ·  STUDIO  ·  BY APPOINTMENT ONLY  ·" line2="WEBSITES THAT GET SCREENSHOTTED  ·" dark />
          <Portfolio />
          <ScrollMarquee line1="SELECTED WORK  ·  2024 – 2025  ·" line2="SIX CLIENTS A YEAR  ·  NO MORE  ·" dark={false} />
          <LogoInterlude />
          <Testimonials />
          <About />
          <Proposals />
          <Contact />
        </main>
        <ContactOverlay />
        <TestimonialsOverlay />
        <NavCurtain />
      </TestimonialsOverlayProvider>
    </ContactOverlayProvider>
    </NavTransitionProvider>
  );
}
