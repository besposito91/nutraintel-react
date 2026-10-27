import { useEffect, useRef, useState } from 'react';
import { NUTRAINTEL_CONFIG } from '../config';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

// sessionStorage "sicuro": in iframe sandbox o con cookie bloccati
// l'accesso lancia un SecurityError, quindi lo proteggiamo con try/catch.
const safeStorage = {
  get(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      /* storage non disponibile: ignoriamo */
    }
  },
};

// Legge le UTM dall'URL e le conserva in sessionStorage (se disponibile)
function readUtm() {
  let params;
  try {
    params = new URLSearchParams(window.location.search);
  } catch {
    params = new URLSearchParams();
  }
  const out = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) safeStorage.set('ni_' + k, v);
    out[k] = v || safeStorage.get('ni_' + k) || '';
  });
  return out;
}

export default function LeadSection() {
  const formRef = useRef(null);
  const [utm, setUtm] = useState({});
  const [status, setStatus] = useState({ text: '', color: '' });

  useEffect(() => setUtm(readUtm()), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form.reportValidity()) return;

    // Non simula un successo finché non esiste un endpoint reale
    const endpoint = (NUTRAINTEL_CONFIG.formEndpoint || '').trim();
    if (!endpoint) {
      setStatus({ text: 'Modulo pronto: collega prima un endpoint CRM/form reale per attivare l’invio.', color: '#ffd28a' });
      return;
    }
    setStatus({ text: 'Invio in corso…', color: '' });
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      if (!res.ok) throw new Error();
      setStatus({ text: 'Grazie. La tua richiesta è stata registrata.', color: '#86f5d9' });
      form.reset();
    } catch {
      setStatus({ text: 'Invio non riuscito. Riprova o contattaci direttamente.', color: '#ffadad' });
    }
  };

  return (
    <section className="ni-lead" id="ni-lead" aria-labelledby="ni-lead-title">
      <div className="ni-lead-copy">
        <div className="ni-eyebrow ni-eyebrow--light" data-reveal>03 / PRE-LANCIO</div>
        <h2 id="ni-lead-title" data-reveal>
          NutraIntel{' '}
          <br />
          sta arrivando.
        </h2>
        <p data-reveal>Lascia i tuoi contatti per ricevere informazioni sul lancio e sulle novità di NutraIntel.</p>
        <div className="ni-lead-side-note" data-reveal>
          <span>Manifestazione di interesse</span>
          <span>Nessun acquisto richiesto</span>
        </div>
      </div>

      <form className="ni-form" noValidate onSubmit={handleSubmit} ref={formRef} data-reveal>
        <label>
          <span>Nome e cognome *</span>
          <input type="text" name="name" autoComplete="name" required />
        </label>
        <label>
          <span>Email *</span>
          <input type="email" name="email" autoComplete="email" required />
        </label>
        <label>
          <span>Telefono *</span>
          <input type="tel" name="phone" autoComplete="tel" required />
        </label>
        <label>
          <span>Professione / struttura</span>
          <input type="text" name="profession" autoComplete="organization-title" />
        </label>
        {UTM_KEYS.map((k) => (
          <input key={k} type="hidden" name={k} value={utm[k] || ''} readOnly />
        ))}
        <label className="ni-check">
          <input type="checkbox" name="privacy" required />
          <span>Ho letto l'informativa privacy e acconsento al trattamento dei dati per la gestione della mia richiesta. *</span>
        </label>
        <label className="ni-check">
          <input type="checkbox" name="marketing" />
          <span>Acconsento a ricevere comunicazioni di aggiornamento e marketing relative a NutraIntel.</span>
        </label>
        <button className="ni-submit" type="submit">
          <span>Resta aggiornato sul lancio</span>
          <i>↗</i>
        </button>
        <p className="ni-form-status" role="status" aria-live="polite" style={{ color: status.color || undefined }}>
          {status.text}
        </p>
        <p className="ni-privacy-placeholder">Inserire qui il link all'informativa privacy definitiva prima della pubblicazione.</p>
      </form>
    </section>
  );
}
