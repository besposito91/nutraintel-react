import { forwardRef, useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion';

// Hero alta 330vh con contenuto sticky: il mosaico WebGL scorre all'infinito
// dietro, il wordmark sfuma e compare la storia.
const Hero = forwardRef(function Hero(_, heroRef) {
  const stickyRef = useRef(null);
  const [live, setLive] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set('.ni-hero-story', { opacity: 1 });
        setLive(true);
        return;
      }
      // Il wordmark esce del tutto prima che entri il titolo: niente sovrapposizioni.
      gsap.fromTo('.ni-hero-center', { opacity: 1, scale: 1, filter: 'blur(0px)' }, {
        opacity: 0,
        scale: 0.9,
        filter: 'blur(6px)',
        ease: 'none',
        immediateRender: false,
        scrollTrigger: { trigger: heroRef.current, start: '1% top', end: '7% top', scrub: true },
      });
      gsap.fromTo(
        '.ni-hero-story',
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: '7.5% top',
            end: '12% top',
            scrub: true,
            onEnter: () => setLive(true),
            onLeaveBack: () => setLive(false),
          },
        }
      );
    },
    { scope: stickyRef }
  );

  return (
    <section className="ni-hero" id="ni-top" aria-labelledby="ni-hero-title" ref={heroRef}>
      <div className="ni-hero-sticky" ref={stickyRef}>
        <div className="ni-hero-center">
          <div className="ni-hero-wordmark" aria-hidden="true">
            Nutra<span>Intel</span>
          </div>
          <div className="ni-hero-tagline">ECOSISTEMA DIGITALE · PROFESSIONISTA + PAZIENTE</div>
        </div>

        <div className={`ni-hero-story ${live ? 'is-live' : ''}`}>
          <div className="ni-hero-kicker">IL FOLLOW-UP, OLTRE LA VISITA</div>
          <div className="ni-hero-copy">
            <h1 id="ni-hero-title">Il percorso nutrizionale continua anche tra una visita e l'altra.</h1>
            <div className="ni-hero-side">
              <p>
                NutraIntel collega portale professionale, app per il paziente e bilancia connessa in un unico
                ecosistema digitale, per rendere disponibili le misurazioni e supportare il follow-up a distanza.
              </p>
              <div className="ni-hero-actions">
                <a className="ni-btn ni-btn-primary" href="#ni-lead">
                  <span>Resta aggiornato sul lancio</span>
                  <i>↗</i>
                </a>
                <a className="ni-btn ni-btn-ghost" href="#ni-ecosystem">
                  <span>Scopri NutraIntel</span>
                  <i>↓</i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="ni-scroll-note" aria-hidden="true">
          <span>SCROLL TO EXPLORE</span>
          <b />
        </div>
        <div className="ni-hero-index" aria-hidden="true">
          <span>01</span>
          <span>03</span>
        </div>
      </div>
    </section>
  );
});

export default Hero;
