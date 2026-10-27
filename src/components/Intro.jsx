import { Fragment, useRef } from 'react';
import { gsap, useGSAP } from '../lib/motion';
import { INTRO_FEATURES } from '../lib/data';

// Apertura editoriale: la schermata resta visibile, poi si "spegne"
// come un vecchio monitor CRT e rivela la scena infinita.
// onReveal  → mostra nav, wordmark e scroll note (a 2.90s)
// onComplete → intro finita: sblocca lo scroll e smonta il componente
// Secondi prima dello spegnimento: la schermata col testo resta visibile ~5s
const HOLD = 5;

export default function Intro({ onReveal, onComplete }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, onComplete });
      tl.to(q('.ni-intro-kicker'), { opacity: 1, y: 0, duration: 0.45 }, 0.08)
        .to(q('.ni-intro-name'), { opacity: 1, y: 0, duration: 0.78 }, 0.14)
        .to(q('.ni-intro-lead'), { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.52)
        .to(q('.ni-intro-node'), { opacity: 1, y: 0, duration: 0.46, stagger: 0.1, ease: 'power3.out' }, 0.82)
        .to(q('.ni-intro-link'), { scaleX: 1, scaleY: 1, duration: 0.45, stagger: 0.1, ease: 'power3.inOut' }, 1.02)
        .to(q('.ni-intro-rule i'), { xPercent: 101, duration: 0.72, ease: 'power3.inOut' }, 1.16)
        .to(q('.ni-intro-caption'), { opacity: 1, y: 0, duration: 0.48 }, 1.28)
        // Spegnimento stile CRT: flicker -> linea luminosa -> punto -> buio
        .addLabel('off', HOLD)
        .to(q('.ni-intro-screen'), { opacity: 0.82, duration: 0.05, yoyo: true, repeat: 3, ease: 'none' }, 'off')
        .to(q('.ni-intro-screen'), { filter: 'brightness(1.6) contrast(1.15)', duration: 0.18, ease: 'power2.in' }, 'off+=0.2')
        .to(q('.ni-intro-screen'), { scaleY: 0.004, duration: 0.34, ease: 'power4.in' }, 'off+=0.24')
        .to(q('.ni-intro-beam'), { opacity: 1, duration: 0.08, ease: 'none' }, 'off+=0.5')
        .set(q('.ni-intro-screen'), { opacity: 0 }, 'off+=0.58')
        .add(() => onReveal(), 'off+=0.58')
        .to(q('.ni-intro-beam'), { scaleX: 0.002, duration: 0.3, ease: 'power4.in' }, 'off+=0.6')
        .to(q('.ni-intro-dot'), { opacity: 1, scale: 1, duration: 0.1, ease: 'power2.out' }, 'off+=0.84')
        .set(q('.ni-intro-beam'), { opacity: 0 }, 'off+=0.9')
        .to(q('.ni-intro-dot'), { opacity: 0, scale: 0.2, duration: 0.42, ease: 'power2.in' }, 'off+=0.96');

    },
    { scope: ref }
  );

  return (
    <div className="ni-intro" aria-label="Introduzione NutraIntel" ref={ref}>
      <div className="ni-intro-screen">
      <div className="ni-intro-content">
        <span className="ni-intro-kicker">TI PRESENTIAMO</span>
        <div className="ni-intro-name" aria-label="NutraIntel">
          Nutra<span>Intel</span>
        </div>
        <p className="ni-intro-lead">
          NutraIntel collega portale professionale, app per il paziente e bilancia connessa in un unico ecosistema
          digitale, per rendere disponibili le misurazioni e supportare il follow-up a distanza.
        </p>
        <div className="ni-intro-system ni-intro-system--features" aria-label="Funzioni principali NutraIntel">
          {INTRO_FEATURES.map((f, i) => (
            <Fragment key={f.id}>
              {i > 0 && <i className="ni-intro-link" aria-hidden="true" />}
              <div className="ni-intro-node">
                <b>{f.id}</b>
                <span>{f.label}</span>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="ni-intro-rule" aria-hidden="true">
          <i />
        </div>
        <span className="ni-intro-caption">DAL DATO AL FOLLOW-UP, IN UN UNICO ECOSISTEMA.</span>
      </div>
      </div>
      <i className="ni-intro-beam" aria-hidden="true" />
      <i className="ni-intro-dot" aria-hidden="true" />
    </div>
  );
}
