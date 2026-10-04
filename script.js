const container = document.getElementById('dragon-container');

const N = 35;
const elems = [];

const pointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

window.addEventListener('pointermove', (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});

window.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    pointer.x = e.touches[0].clientX;
    pointer.y = e.touches[0].clientY;
  }
});

// Video wala exact structure logic
function prepend(type, index) {
  const div = document.createElement('div');
  div.className = 'dragon-segment';
  
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "1");
  svg.setAttribute("height", "1");
  
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttributeNS("http://www.w3.org/1999/xlink", "href", #${type});
  
  svg.appendChild(use);
  div.appendChild(svg);
  container.appendChild(div);

  return {
    el: div,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    type: type
  };
}

// Exact video loop logic:
for (let i = 1; i <= N; i++) {
  if (i === 1) {
    elems.push(prepend("Cabeza", i));
  } else if (i >= 8 && i <= 14) {
    elems.push(prepend("Aletas", i));
  } else {
    elems.push(prepend("Espina", i));
  }
}

function render() {
  // Follow pointer smoothly
  elems[0].x += (pointer.x - elems[0].x) * 0.2;
  elems[0].y += (pointer.y - elems[0].y) * 0.2;

  for (let i = 1; i < N; i++) {
    const prev = elems[i - 1];
    const curr = elems[i];

    const dx = prev.x - curr.x;
    const dy = prev.y - curr.y;
    const angle = Math.atan2(dy, dx);
    const dist = Math.hypot(dx, dy);

    const targetDist = 12;
    if (dist > targetDist) {
      curr.x = prev.x - Math.cos(angle) * targetDist;
      curr.y = prev.y - Math.sin(angle) * targetDist;
    }

    // Scale logic according to dragon body shape
    let scale = Math.max(0.15, 1 - (i / N) * 0.85);
    if (curr.type === "Aletas") {
      scale = 0.8 + (1 - Math.abs(i - 11) * 0.15) * 0.5;
    }

    const deg = (angle * 180) / Math.PI;
    curr.el.style.transform = translate3d(${curr.x}px, ${curr.y}px, 0) rotate(${deg}deg) scale(${scale});
  }

  // Head rotation
  const headAngle = Math.atan2(pointer.y - elems[0].y, pointer.x - elems[0].x);
  const headDeg = (headAngle * 180) / Math.PI;
  elems[0].el.style.transform = translate3d(${elems[0].x}px, ${elems[0].y}px, 0) rotate(${headDeg}deg) scale(1.1);

  requestAnimationFrame(render);
}

render();
