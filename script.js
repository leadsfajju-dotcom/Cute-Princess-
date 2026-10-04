const body = document.body;

// Video ke according parameters
const N = 40;
const elems = [];

for (let i = 0; i < N; i++) {
  elems[i] = { use: null, x: width / 2  window.innerWidth / 2, y: height / 2  window.innerHeight / 2 };
}

const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let frm = Math.random() * 20;
let rad = 0;

window.addEventListener('pointermove', (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});

// Container and SVG setup
const svgNS = "http://www.w3.org/2000/svg";
const svg = document.createElementNS(svgNS, "svg");
svg.style.position = "fixed";
svg.style.top = "0";
svg.style.left = "0";
svg.style.width = "100vw";
svg.style.height = "100vh";
svg.style.pointerEvents = "none";
svg.style.zIndex = "9999";
document.body.appendChild(svg);

// Create SVG definitions for Cabeza, Aletas, Espina
const defs = document.createElementNS(svgNS, "defs");

// 1. Head (Cabeza)
const gCabeza = document.createElementNS(svgNS, "g");
gCabeza.setAttribute("id", "Cabeza");
gCabeza.innerHTML = <path d="M 15 0 L -12 -10 L -6 0 L -12 10 Z" fill="#000" /><circle cx="2" cy="-4" r="2" fill="#fff"/><circle cx="2" cy="4" r="2" fill="#fff"/>;
defs.appendChild(gCabeza);

// 2. Wings/Fins (Aletas)
const gAletas = document.createElementNS(svgNS, "g");
gAletas.setAttribute("id", "Aletas");
gAletas.innerHTML = 
  <path d="M 0 0 C -20 -40, -60 -60, -90 -40 C -50 -20, -20 -10, 0 0 Z" fill="none" stroke="#000" stroke-width="1.5" />
  <path d="M 0 0 C -20 40, -60 60, -90 40 C -50 20, -20 10, 0 0 Z" fill="none" stroke="#000" stroke-width="1.5" />
  <path d="M 0 0 C -15 -25, -45 -35, -70 -20" fill="none" stroke="#000" stroke-width="1" />
  <path d="M 0 0 C -15 25, -45 35, -70 20" fill="none" stroke="#000" stroke-width="1" />
  <line x1="0" y1="0" x2="-25" y2="0" stroke="#000" stroke-width="2"/>
;
defs.appendChild(gAletas);

// 3. Spine/Ribs (Espina)
const gEspina = document.createElementNS(svgNS, "g");
gEspina.setAttribute("id", "Espina");
gEspina.innerHTML = 
  <path d="M 0 0 C -10 -20, -30 -30, -50 -25" fill="none" stroke="#000" stroke-width="1.2" />
  <path d="M 0 0 C -10 20, -30 30, -50 25" fill="none" stroke="#000" stroke-width="1.2" />
  <circle cx="0" cy="0" r="2.5" fill="#000" />
;
defs.appendChild(gEspina);

svg.appendChild(defs);

// Video code logic loop
for (let i = 1; i <= N; i++) {
  const use = document.createElementNS(svgNS, "use");
  if (i === 1) {
    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#Cabeza");
  } else if (i >= 8 && i <= 14) {
    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#Aletas");
  } else {
    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#Espina");
  }
  svg.appendChild(use);
  elems[i - 1].use = use;
}

function render() {
  elems[0].x += (pointer.x - elems[0].x) * 0.15;
  elems[0].y += (pointer.y - elems[0].y) * 0.15;

  for (let i = 1; i < N; i++) {
    const prev = elems[i - 1];
    const curr = elems[i];
    const dx = prev.x - curr.x;
    const dy = prev.y - curr.y;
    const angle = Math.atan2(dy, dx);
    const dist = Math.hypot(dx, dy);
    
    if (dist > 12) {
      curr.x = prev.x - Math.cos(angle) * 12;
      curr.y = prev.y - Math.sin(angle) * 12;
    }

    // Scale down towards tail
    const scale = Math.max(0.1, 1 - (i / N) * 0.85);
    const wingScale = (i >= 8 && i <= 14) ? (1 - Math.abs(i - 11) * 0.15) : scale;

    curr.use.setAttribute("transform", translate(${curr.x}, ${curr.y}) rotate(${(angle * 180) / Math.PI}) scale(${i >= 8 && i <= 14 ? wingScale : scale}));
  }

  // Head transform
  const headDx = pointer.x - elems[0].x;
  const headDy = pointer.y - elems[0].y;
  const headAngle = Math.atan2(headDy, headDx);
  elems[0].use.setAttribute("transform", translate(${elems[0].x}, ${elems[0].y}) rotate(${(headAngle * 180) / Math.PI}) scale(1.2));

  requestAnimationFrame(render);
}

render();
