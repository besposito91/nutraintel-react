import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from './lib/motion';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import Intro from './components/Intro';
import InfiniteMosaic from './components/InfiniteMosaic';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Ecosystem from './components/Ecosystem';
import VideoSection from './components/VideoSection';
import LeadSection from './components/LeadForm';
import Footer from './components/Footer';

export default function App() {
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const reduced = prefersReducedMotion();

  // introActive → nav e wordmark nascosti; introMounted → pannelli dell'intro presenti
  const [introActive, setIntroActive] = useState(!reduced);
  const [introMounted, setIntroMounted] = useState(!reduced);

  const lenisRef = useSmoothScroll(rootRef);

  // Blocca lo scroll solo mentre l'apertura è a schermo
  useEffect(() => {
    if (!introMounted) return;
    const html = document.documentElement.style.overflow;
    const body = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    lenisRef.current?.stop();
    return () => {
      document.documentElement.style.overflow = html;
      document.body.style.overflow = body;
      lenisRef.current?.start();
      ScrollTrigger.refresh();
    };
  }, [introMounted, lenisRef]);

  const handleReveal = useCallback(() => setIntroActive(false), []);
  const handleComplete = useCallback(() => setIntroMounted(false), []);

  // Comparsa morbida degli elementi con data-reveal
  useGSAP(
    () => {
      const els = gsap.utils.toArray('[data-reveal]');
      if (reduced) {
        gsap.set(els, { opacity: 1, y: 0 });
        return;
      }
      els.forEach((el, i) =>
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: (i % 4) * 0.08,
          scrollTrigger: { trigger: el, start: 'top 86%' },
        })
      );
    },
    { scope: rootRef }
  );

  return (
    <div id="nutraintel-experience" className={introActive ? 'ni-intro-active' : ''} ref={rootRef}>
      {introMounted && <Intro onReveal={handleReveal} onComplete={handleComplete} />}
      <InfiniteMosaic heroRef={heroRef} />
      <Nav />
      <main>
        <Hero ref={heroRef} />
        <Ecosystem />
        <VideoSection />
        <LeadSection />
      </main>
      <Footer />
    </div>
  );
}
