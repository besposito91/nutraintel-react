import { useRef } from 'react';
import { ScrollTrigger, useGSAP } from '../lib/motion';

// Sezioni con sfondo scuro: quando passano sotto la nav, il testo diventa bianco
const DARK_SECTIONS = ['#ni-ecosystem', '#ni-lead', '.ni-footer'];

export default function Nav() {
  const ref = useRef(null);

  useGSAP(() => {
    const triggers = DARK_SECTIONS.map((sel) =>
      ScrollTrigger.create({
        trigger: sel,
        start: 'top 38px',
        end: 'bottom 38px',
        refreshPriority: -1,
        onToggle: (self) => ref.current?.classList.toggle('is-dark', self.isActive),
      })
    );
    return () => triggers.forEach((t) => t.kill());
  });

  return (
    <header className="ni-nav" aria-label="Navigazione NutraIntel" ref={ref}>
      <a className="ni-brand" href="#ni-top" aria-label="NutraIntel - torna all'inizio">
        <span className="ni-brand-mark" />
        <span>NutraIntel</span>
      </a>
      <nav className="ni-nav-links" aria-label="Sezioni">
        <a href="#ni-ecosystem">Funzioni</a>
        <a href="#ni-video">Video</a>
        <a href="#ni-lead">Pre-lancio</a>
      </nav>
      <a className="ni-nav-cta" href="#ni-lead">
        Resta aggiornato
      </a>
    </header>
  );
}
