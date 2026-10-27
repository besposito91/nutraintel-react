# NutraIntel · Immersive pre-launch landing (React + Vite)

Versione React dello script "NUTRAINTEL / IMMERSIVE PRE-LAUNCH LANDING v3.6".

## Avvio
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # produzione in dist/
```

## Librerie
- **GSAP + ScrollTrigger** (`gsap`, `@gsap/react`): intro, hero, pannelli orizzontali, reveal
- **Lenis** (`lenis`): smooth scroll
- **WebGL** nativo: mosaico infinito nell'hero

## Configurazione
Modifica `src/config.js`:
- `media`: immagini reali al posto dei placeholder del mosaico (max 9)
- `videoUrl`: URL embed del video
- `formEndpoint`: endpoint CRM / webhook del form

## Struttura
```
src/
├─ App.jsx                   ← assembla tutto, gestisce intro e blocco scroll
├─ config.js                 ← ex window.NUTRAINTEL_CONFIG
├─ styles/nutraintel.css     ← CSS originale + piccole aggiunte in fondo
├─ hooks/useSmoothScroll.js  ← Lenis sincronizzato con ScrollTrigger
├─ lib/
│  ├─ motion.js              ← registrazione plugin GSAP
│  ├─ data.js                ← testi di intro e pannelli
│  └─ mosaic.js              ← shader, texture e card del mosaico
└─ components/
   ├─ Intro.jsx              ← apertura a pannelli (timeline GSAP)
   ├─ InfiniteMosaic.jsx     ← canvas WebGL infinito
   ├─ Nav.jsx                ← nav che diventa chiara sulle sezioni scure
   ├─ Hero.jsx               ← hero sticky 330vh
   ├─ Ecosystem.jsx          ← piano orizzontale con pin
   ├─ devices/Devices.jsx    ← mockup monitor, bilancia, phone, scheda, avvisi, laptop
   ├─ VideoSection.jsx
   ├─ LeadForm.jsx           ← form con UTM e invio all'endpoint
   └─ Footer.jsx
```
