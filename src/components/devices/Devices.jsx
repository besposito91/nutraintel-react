// Mockup provvisori dei dispositivi, uno per pannello.
const bars = (n) => Array.from({ length: n }, (_, i) => <i key={i} />);

export function Monitor() {
  return (
    <div className="ni-device ni-monitor" aria-label="Visualizzazione provvisoria del monitoraggio a distanza">
      <div className="ni-monitor-head">
        <span>PAZIENTE</span>
        <b>AGGIORNATO ORA</b>
      </div>
      <div className="ni-monitor-value">
        <small>PESO</small>
        <strong>72,4</strong>
        <em>kg</em>
      </div>
      <div className="ni-monitor-grid">
        <span>
          <small>IDRATAZIONE</small>
          <b>52%</b>
        </span>
        <span>
          <small>PASSI</small>
          <b>6.842</b>
        </span>
      </div>
      <div className="ni-monitor-line">{bars(6)}</div>
    </div>
  );
}

export function Scale() {
  return (
    <div className="ni-device ni-scale" aria-label="Mockup provvisorio bilancia smart">
      <div>
        <small>72.4</small>
        <b>kg</b>
      </div>
    </div>
  );
}

export function Phone() {
  return (
    <div className="ni-device ni-phone" aria-label="Mockup provvisorio app NutraIntel">
      <div className="ni-phone-notch" />
      <small>ANDAMENTO</small>
      <strong>72,4 kg</strong>
      <div className="ni-mini-chart">{bars(5)}</div>
    </div>
  );
}

export function PatientCard() {
  return (
    <div className="ni-device ni-patient-card" aria-label="Mockup provvisorio scheda paziente digitale">
      <div className="ni-patient-top">
        <span>MB</span>
        <div>
          <b>Maria B.</b>
          <small>Scheda paziente</small>
        </div>
        <em>ATTIVO</em>
      </div>
      <div className="ni-patient-stats">
        <span>
          <small>ULTIMA MISURAZIONE</small>
          <b>72,4 kg</b>
        </span>
        <span>
          <small>VARIAZIONE</small>
          <b>−1,8 kg</b>
        </span>
        <span>
          <small>FOLLOW-UP</small>
          <b>12 giorni</b>
        </span>
      </div>
      <div className="ni-patient-history">{bars(5)}</div>
    </div>
  );
}

export function Alerts() {
  return (
    <div className="ni-device ni-alerts" aria-label="Visualizzazione provvisoria degli avvisi">
      <div className="ni-alert-row">
        <span className="ni-alert-dot" />
        <div>
          <small>MISURAZIONI</small>
          <b>Nessuna nuova misurazione</b>
          <p>Ultimo aggiornamento 14 giorni fa</p>
        </div>
        <em>!</em>
      </div>
      <div className="ni-alert-row">
        <span className="ni-alert-dot ni-alert-dot--soft" />
        <div>
          <small>ANALISI CLINICHE</small>
          <b>Documentazione da aggiornare</b>
          <p>Verifica gli elementi richiesti</p>
        </div>
        <em>↗</em>
      </div>
    </div>
  );
}

export function Laptop() {
  return (
    <div className="ni-device ni-laptop" aria-label="Mockup provvisorio portale professionale">
      <div className="ni-screen">
        <span />
        <div className="ni-dashboard">{bars(3)}</div>
      </div>
      <div className="ni-laptop-base" />
    </div>
  );
}

export const DEVICES = {
  monitoring: Monitor,
  scale: Scale,
  app: Phone,
  record: PatientCard,
  alerts: Alerts,
  portal: Laptop,
};
