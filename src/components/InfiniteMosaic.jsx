import { useEffect, useRef } from 'react';
import { NUTRAINTEL_CONFIG } from '../config';
import { prefersReducedMotion } from '../lib/motion';
import { VERTEX_SHADER, FRAGMENT_SHADER, makeTextureCanvas, KINDS, CARDS, X_COLS } from '../lib/mosaic';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;

// Mosaico WebGL a scorrimento infinito dietro l'hero.
// Le card si curvano in base alla velocità di scroll e si deformano al passaggio del mouse.
export default function InfiniteMosaic({ heroRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' });
    if (!gl) return;

    // --- Programma shader
    const shader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const vs = shader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = shader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'aPosition');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const U = {};
    ['uTexture', 'uViewport', 'uRect', 'uImageSize', 'uPointer', 'uCurl', 'uHover', 'uZoom', 'uOpacity', 'uTime'].forEach(
      (k) => (U[k] = gl.getUniformLocation(prog, k))
    );
    gl.uniform1i(U.uTexture, 0);
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // --- Texture (placeholder + eventuali immagini reali da config)
    const textures = KINDS.map((kind, i) => {
      const source = makeTextureCanvas(kind, i);
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      return { texture: t, width: source.width, height: source.height, kind };
    });
    // Ridisegna i placeholder quando il font Onest e' caricato
    if (document.fonts && document.fonts.load) {
      Promise.all([document.fonts.load('700 20px Onest'), document.fonts.load('300 58px Onest')]).then(() => {
        if (gl.isContextLost()) return;
        textures.forEach((tx, i) => {
          if (tx.custom) return;
          const src = makeTextureCanvas(tx.kind, i);
          gl.bindTexture(gl.TEXTURE_2D, tx.texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
        });
      }).catch(() => {});
    }
    (NUTRAINTEL_CONFIG.media || []).slice(0, textures.length).forEach((item, i) => {
      if (!item || !item.url) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, textures[i].texture);
        try {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          textures[i].width = img.naturalWidth;
          textures[i].height = img.naturalHeight;
          textures[i].custom = true;
        } catch {
          /* resta il placeholder */
        }
      };
      img.src = item.url;
    });

    // --- Input e resize
    const mouse = { x: -999, y: -999, tx: -999, ty: -999 };
    const onMove = (e) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    const onLeave = () => (mouse.tx = mouse.ty = -999);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.8);
      canvas.width = Math.max(1, Math.round(window.innerWidth * dpr));
      canvas.height = Math.max(1, Math.round(window.innerHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.uViewport, window.innerWidth, window.innerHeight);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // --- Loop di disegno
    let lastY = window.scrollY, lastT = performance.now(), smoothVelocity = 0, raf = 0;
    const draw = (now) => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const rect = hero.getBoundingClientRect();
      const active = rect.bottom > 0 && rect.top < vh;
      const y = window.scrollY;
      const dt = Math.max(8, Math.min(40, now - lastT));
      const velocity = ((y - lastY) / dt) * 16.67;
      smoothVelocity = lerp(smoothVelocity, velocity, 0.11);
      lastY = y;
      lastT = now;
      mouse.x = lerp(mouse.x, mouse.tx, 0.08);
      mouse.y = lerp(mouse.y, mouse.ty, 0.08);

      if (active) {
        canvas.classList.add('is-ready');
        gl.disable(gl.SCISSOR_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.SCISSOR_TEST);
        const total = Math.max(1, hero.offsetHeight - vh);
        const progress = clamp(-rect.top / total, 0, 1);
        const travel = progress * vh * 3.2;
        const curl = clamp(Math.abs(smoothVelocity) / 70, 0, 1) * 0.19 + 0.035;

        CARDS.forEach((c, idx) => {
          // Loop infinito: quando una card esce in alto rientra dal basso
          const loop = vh * 1.58;
          let py = c.y * vh - travel * c.speed;
          py = (((py + loop * 0.32) % loop) + loop) % loop - loop * 0.32;
          const w = Math.max(150, c.w * vw), h = Math.max(160, c.h * vh);
          let px = X_COLS[c.col] * vw + (c.col === 1 ? Math.sin(progress * 6.283 + idx) * 18 : 0);
          const intro = clamp(progress / 0.3, 0, 1);
          if (progress < c.reveal) return;
          if (progress < 0.28) {
            if (c.col === 0) px -= vw * 0.018 * (1 - intro);
            if (c.col === 2) px += vw * 0.02 * (1 - intro);
            if (c.col === 1) px += vw * 0.09 * (1 - intro);
          }
          if (py + h < -80 || py > vh + 80) return;
          const hovered = mouse.x >= px && mouse.x <= px + w && mouse.y >= py && mouse.y <= py + h ? 1 : 0;
          const pointer = { x: clamp((mouse.x - px) / w, 0, 1), y: clamp((mouse.y - py) / h, 0, 1) };
          const edgeFade = clamp(Math.min((py + h) / 120, (vh - py) / 120), 0, 1);
          const revealFade = clamp((progress - c.reveal) / 0.11, 0, 1);
          const t = textures[c.tex];
          gl.scissor(
            Math.max(0, Math.floor((px - 140) * dpr)),
            Math.max(0, Math.floor((vh - (py + h) - 140) * dpr)),
            Math.min(canvas.width, Math.ceil((w + 280) * dpr)),
            Math.min(canvas.height, Math.ceil((h + 280) * dpr))
          );
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, t.texture);
          gl.uniform4f(U.uRect, px, py, w, h);
          gl.uniform2f(U.uImageSize, t.width, t.height);
          gl.uniform2f(U.uPointer, pointer.x, pointer.y);
          gl.uniform1f(U.uCurl, curl);
          gl.uniform1f(U.uHover, hovered);
          gl.uniform1f(U.uZoom, 1.015 + hovered * 0.025);
          gl.uniform1f(U.uOpacity, (0.58 + 0.38 * edgeFade) * revealFade * (0.82 + 0.18 * intro));
          gl.uniform1f(U.uTime, now * 0.001);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        });
      } else {
        canvas.classList.remove('is-ready');
        gl.disable(gl.SCISSOR_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    // Pulizia quando il componente viene smontato
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', resize);
      textures.forEach((t) => gl.deleteTexture(t.texture));
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [heroRef]);

  return <canvas className="ni-gl" aria-hidden="true" ref={canvasRef} />;
}
