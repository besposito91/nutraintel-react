import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';

// Smooth scrolling con Lenis, sincronizzato con GSAP ScrollTrigger.
// Se l'utente preferisce meno animazioni, resta lo scroll nativo.
export function useSmoothScroll(rootRef) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.08,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      anchors: false,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Link interni (#ni-...) con scorrimento morbido
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || !rootRef.current?.contains(a)) return;
      const el = document.querySelector(a.getAttribute('href'));
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: 0, duration: 1.15 });
    };
    document.addEventListener('click', onClick);

    // Ricalcolo dei trigger al resize
    let timer = 0;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 160);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [rootRef]);

  return lenisRef;
}
