// Shader e texture del mosaico infinito (portati 1:1 dallo script originale).

export const VERTEX_SHADER = `attribute vec2 aPosition; varying vec2 vScreenUv; void main(){vScreenUv=aPosition;gl_Position=vec4(aPosition.x*2.0-1.0,1.0-aPosition.y*2.0,0.0,1.0);}`;

export const FRAGMENT_SHADER = `precision highp float;
  uniform sampler2D uTexture; uniform vec2 uViewport; uniform vec4 uRect; uniform vec2 uImageSize; uniform vec2 uPointer;
  uniform float uCurl; uniform float uHover; uniform float uZoom; uniform float uOpacity; uniform float uTime;
  varying vec2 vScreenUv;
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;} vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+10.0)*x);} float snoise(vec2 v){const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1=x0.x>x0.y?vec2(1.,0.):vec2(0.,1.);vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289(i);vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);m=m*m;m=m*m;vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;m*=1.79284291400159-.85373472095314*(a0*a0+h*h);vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.*dot(m,g);}
  void main(){
    vec2 suv=vScreenUv;
    float sy=suv.y*2.0-1.0;
    float edge=pow(abs(sy),2.25);
    float direction=sy<0.0?-1.0:1.0;
    suv.x=0.5+(suv.x-0.5)*(1.0-edge*uCurl);
    suv.y+=sin((suv.x-.5)*3.14159265)*edge*uCurl*.045*direction;
    vec2 luv=(suv*uViewport-uRect.xy)/uRect.zw;
    vec2 ep=min(luv,1.0-luv)*uRect.zw;
    float mask=smoothstep(0.0,1.25,min(ep.x,ep.y)); if(mask<=0.0)discard;
    vec2 uv=.5+(luv-.5)/uZoom;
    float a=uRect.z/max(uRect.w,1.0), ia=uImageSize.x/max(uImageSize.y,1.0);
    if(ia>a)uv.x=.5+(uv.x-.5)*a/ia; else uv.y=.5+(uv.y-.5)*ia/a;
    float pd=length((luv-uPointer)*vec2(1.0,1.0/a));
    float focus=smoothstep(.02,.17,pd);
    float noise=snoise(gl_FragCoord.xy*.31+uTime*.05);
    float disp=(1.0-pd*8.0)*noise*.0065*uHover*focus;
    uv+=vec2(disp,-disp);
    vec3 col=texture2D(uTexture,clamp(uv,0.,1.)).rgb;
    col*=1.0+edge*uCurl*.15;
    gl_FragColor=vec4(col,mask*uOpacity);
  }`;

function round(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  fill ? ctx.fill() : ctx.stroke();
}

// Placeholder generati via canvas, finché non arrivano gli asset reali.
export function makeTextureCanvas(kind, index) {
  const c = document.createElement('canvas');
  c.width = 900;
  c.height = index % 3 === 1 ? 1200 : 760;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, c.width, c.height);
  const palettes = [['#f1f5f1', '#b8d8d2'], ['#dce8e8', '#4fa2aa'], ['#e7f2ef', '#78cdbd'], ['#d7e4e7', '#6a9fbc']];
  const p = palettes[index % palettes.length];
  g.addColorStop(0, p[0]);
  g.addColorStop(1, p[1]);
  x.fillStyle = g;
  x.fillRect(0, 0, c.width, c.height);
  x.globalAlpha = 0.18;
  x.strokeStyle = '#ffffff';
  x.lineWidth = 2;
  for (let i = 0; i < 9; i++) {
    x.beginPath();
    x.arc(c.width * 0.5, c.height * 0.5, 90 + i * 52, 0, Math.PI * 2);
    x.stroke();
  }
  x.globalAlpha = 1;
  x.save();
  x.translate(c.width / 2, c.height / 2);
  if (kind === 'app') {
    x.fillStyle = '#062f44'; round(x, -150, -285, 300, 570, 46, true);
    x.fillStyle = '#eaf7f5'; round(x, -138, -273, 276, 546, 38, true);
    x.fillStyle = '#083b59'; round(x, -58, -245, 116, 18, 12, true);
    x.fillStyle = '#1095a7'; x.font = '700 20px Onest, Arial'; x.fillText('NUTRAINTEL', -70, -165);
    x.fillStyle = '#053b5c'; x.font = '700 74px Onest, Arial'; x.fillText('72,4', -93, -65);
    x.font = '18px Onest, Arial'; x.fillText('kg', 92, -65);
    x.strokeStyle = '#1095a7'; x.lineWidth = 8; x.beginPath(); x.moveTo(-100, 120); x.bezierCurveTo(-10, 30, 40, 170, 110, 72); x.stroke();
  } else if (kind === 'scale') {
    x.rotate(-0.08);
    x.fillStyle = '#eaf8f7'; x.shadowColor = 'rgba(0,40,60,.25)'; x.shadowBlur = 35; round(x, -260, -210, 520, 420, 58, true);
    x.shadowBlur = 0; x.fillStyle = '#082f44'; round(x, -80, -62, 160, 94, 12, true);
    x.fillStyle = '#bffbea'; x.font = '300 58px Onest, Arial'; x.fillText('72.4', -65, 5);
    x.font = '16px Onest, Arial'; x.fillText('kg', 50, 5);
  } else if (kind === 'portal') {
    x.fillStyle = '#072f45'; round(x, -350, -220, 700, 440, 24, true);
    x.fillStyle = '#effaf8'; round(x, -326, -196, 652, 392, 10, true);
    x.fillStyle = '#1095a7'; round(x, -290, -160, 155, 18, 9, true);
    x.fillStyle = '#d8efec';
    for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) round(x, -290 + q * 190, -100 + r * 95, 160, 65, 12, true);
    x.fillStyle = '#1bc8a1'; round(x, -290, -100, 350, 255, 12, true);
  } else {
    x.fillStyle = 'rgba(255,255,255,.92)'; x.font = '600 95px Onest, Arial'; x.textAlign = 'center';
    x.fillText(index % 2 ? 'FOLLOW' : 'DATA', 0, 15);
    x.font = '500 18px Onest, Arial'; x.letterSpacing = '6px';
    x.fillText('NUTRAINTEL / ECOSYSTEM', 0, 65);
  }
  x.restore();
  return c;
}

export const KINDS = ['portal', 'app', 'scale', 'abstract', 'app', 'portal', 'scale', 'abstract', 'portal'];

// Posizione, dimensione e velocità di ogni card del mosaico
export const CARDS = [
  { tex: 0, col: 0, y: 0.18, w: 0.23, h: 0.30, speed: 1.00, reveal: 0.00 },
  { tex: 1, col: 1, y: -0.13, w: 0.17, h: 0.31, speed: 1.10, reveal: 0.00 },
  { tex: 2, col: 2, y: 0.06, w: 0.23, h: 0.34, speed: 0.94, reveal: 0.00 },
  { tex: 3, col: 0, y: 0.72, w: 0.18, h: 0.23, speed: 1.02, reveal: 0.00 },
  { tex: 4, col: 1, y: 0.58, w: 0.17, h: 0.36, speed: 1.13, reveal: 0.13 },
  { tex: 5, col: 2, y: 0.70, w: 0.22, h: 0.25, speed: 0.95, reveal: 0.00 },
  { tex: 6, col: 0, y: 1.05, w: 0.24, h: 0.29, speed: 1.00, reveal: 0.19 },
  { tex: 7, col: 1, y: 1.13, w: 0.16, h: 0.24, speed: 1.11, reveal: 0.27 },
  { tex: 8, col: 2, y: 1.02, w: 0.23, h: 0.29, speed: 0.94, reveal: 0.20 },
];

export const X_COLS = [0.025, 0.415, 0.765];
