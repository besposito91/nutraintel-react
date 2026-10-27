import { Fragment, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../lib/motion';
import { PANELS } from '../lib/data';
import { DEVICES } from './devices/Devices';

// Piano orizzontale: la sezione si "blocca" e i 6 pannelli scorrono
// di lato mentre l'utente scrolla in verticale (solo desktop > 980px).
export default function Ecosystem() {
  const sectionRef = useRef(null);
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();

      mm.add('(min-width: 981px)', () => {
        const wrap = wrapRef.current;
        const track = trackRef.current;
        const getTravel = () => Math.max(0, track.scrollWidth - wrap.clientWidth);

        gsap.set(track, { x: 0 });
        const scroller = gsap.to(track, {
          x: () => -getTravel(),
          ease: 'none',
          overwrite: 'auto',
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: () => '+=' + (getTravel() + Math.min(window.innerWidth * 0.18, 260)),
            scrub: 0.55,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: false,
            onUpdate: (self) => {
              const idx = Math.min(PANELS.length - 1, Math.round(self.progress * (PANELS.length - 1)));
              setActive((prev) => (prev === idx ? prev : idx));
              if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });

        // Il testo di ogni pannello entra con un leggero parallasse orizzontale
        gsap.utils.toArray('.ni-eco-panel', sectionRef.current).forEach((panel, i) => {
          if (i === 0) return;
          gsap.from(panel.querySelector('.ni-eco-panel-copy'), {
            x: 140,
            opacity: 0.15,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scroller,
              start: 'left right',
              end: 'left 25%',
              scrub: true,
            },
          });
        });
      });

      // Mobile: i pannelli sono in colonna, compaiono uno dopo l'altro
      mm.add('(max-width: 980px)', () => {
        gsap.utils.toArray('.ni-eco-panel', sectionRef.current).forEach((panel, i) => {
          ScrollTrigger.create({
            trigger: panel,
            start: 'top center',
            end: 'bottom center',
            onToggle: (self) => self.isActive && setActive(i),
          });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section className="ni-ecosystem" id="ni-ecosystem" aria-labelledby="ni-eco-title" ref={sectionRef}>
      <div className="ni-eco-intro">
        <div className="ni-eyebrow ni-eyebrow--light" data-reveal>
          01 / NUTRAINTEL
        </div>
        <h2 id="ni-eco-title" data-reveal>
          Il percorso,{' '}
          <br />
          <em>sempre connesso.</em>
        </h2>
        <p data-reveal>
          Scorri le funzionalità principali di NutraIntel. Ogni passaggio accompagna il professionista e il paziente
          lungo il percorso nutrizionale.
        </p>
      </div>

      <div className="ni-eco-track-wrap" ref={wrapRef}>
        <div className="ni-eco-track" ref={trackRef}>
          {PANELS.map((p) => {
            const Device = DEVICES[p.key];
            return (
              <article key={p.key} className={`ni-eco-panel ni-eco-panel--${p.key}`}>
                <div className="ni-eco-panel-copy">
                  <span>{p.eyebrow}</span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
                <Device />
              </article>
            );
          })}
        </div>
        <div className="ni-eco-progress" aria-hidden="true">
          <i ref={barRef} />
        </div>
      </div>

      <div className="ni-benefits" aria-label="Sequenza funzionalità">
        {PANELS.map((p, i) => (
          <Fragment key={p.key}>
            {i > 0 && <i />}
            <span className={i === active ? 'is-active' : ''}>{p.benefit}</span>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
