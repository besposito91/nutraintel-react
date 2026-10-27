import { useState } from 'react';
import { NUTRAINTEL_CONFIG } from '../config';

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const [note, setNote] = useState('VIDEO PROMOZIONALE — ASSET DA COLLEGARE');

  const handleClick = () => {
    const url = (NUTRAINTEL_CONFIG.videoUrl || '').trim();
    if (!url) {
      setNote('COLLEGA NUTRAINTEL_CONFIG.videoUrl PER ATTIVARE IL VIDEO');
      return;
    }
    setPlaying(true);
  };

  return (
    <section className="ni-video ni-section" id="ni-video" aria-labelledby="ni-video-title">
      <div className="ni-section-head ni-video-head">
        <div className="ni-eyebrow" data-reveal>02 / VIDEO</div>
        <h2 id="ni-video-title" data-reveal>
          Scopri l'ecosistema{' '}
          <br />
          NutraIntel.
        </h2>
        <p data-reveal>
          Guarda il video di presentazione e scopri come NutraIntel collega professionista e paziente attraverso un
          ecosistema digitale integrato.
        </p>
      </div>
      <button className="ni-video-poster" type="button" aria-label="Riproduci il video NutraIntel" onClick={handleClick}>
        {playing ? (
          <iframe
            src={NUTRAINTEL_CONFIG.videoUrl}
            title="Video NutraIntel"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        ) : (
          <>
            <span className="ni-video-orbit" />
            <span className="ni-video-play">▶</span>
            <span className="ni-video-label">PLAY FILM / 01:48</span>
            <span className="ni-video-placeholder-note">{note}</span>
          </>
        )}
      </button>
    </section>
  );
}
