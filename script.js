const screen = document.getElementById("screen");
const xmlns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";

let width = window.innerWidth;
let height = window.innerHeight;

const resize = () => {
  width = window.innerWidth;
  height = window.innerHeight;
};
window.addEventListener("resize", resize, false);

const pointer = { x: width / 2, y: height / 2 };

window.addEventListener("pointermove", (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  rad = 0;
}, false);

window.addEventListener("touchmove", (e) => {
  if (e.touches.length > 0) {
    pointer.x = e.touches[0].clientX;
    pointer.y = e.touches[0].clientY;
    rad = 0;
  }
}, false);

const prepend = (use, i) => {
  const elem = document.createElementNS(xmlns, "use");
  elems[i].use = elem;
  elem.setAttributeNS(xlinkns, "xlink:href", "#" + use);
  screen.prepend(elem);
};

const N = 40;
const elems = [];
for (let i = 0; i < N; i++) {
  elems[i] = { use: null, x: width / 2, y: height / 2 };
}

const radm = Math.min(pointer.x, pointer.y) - 20;
let frm = Math.random();
let rad = 0;

// Video ka EXACT loop structure:
for (let i = 1; i < N; i++) {
  if (i === 1) prepend("Cabeza", i);
  else if (i >= 8 && i <= 14) prepend("Aletas", i);
  else prepend("Espina", i);
}

const run = () => {
  requestAnimationFrame(run);

  let e = elems[0];
  const ax = (Math.cos(3 * frm) * rad * width) / height;
  const ay = (Math.sin(4 * frm) * rad * width) / height;

  e.x += (pointer.x + ax - e.x) * 0.1;
  e.y += (pointer.y + ay - e.y) * 0.1;

  for (let i = 1; i < N; i++) {
    let ep = elems[i - 1];
    e = elems[i];

    const a = Math.atan2(e.y - ep.y, e.x - ep.x);
    const d = Math.hypot(e.x - ep.x, e.y - ep.y);

    e.x = ep.x + (Math.cos(a) * 12);
    e.y = ep.y + (Math.sin(a) * 12);

    let s = (1 - (i / N) * 0.7);
    if (i >= 8 && i <= 14) {
      s = 0.9 + (1 - Math.abs(i - 11) * 0.15) * 0.6;
    }

    e.use.setAttributeNS(
      null,
      "transform",
      translate(${(ep.x + e.x) / 2}, ${(ep.y + e.y) / 2}) rotate(${(180 / Math.PI) * a}) scale(${s}, ${s})
    );
  }

  if (rad < radm) rad++;
  frm += 0.003;
};

run();
