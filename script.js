const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.pointerEvents = 'none';

let width, height;
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const pointer = { x: width / 2, y: height / 2 };
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

const N = 35;
const segments = [];
for (let i = 0; i < N; i++) {
  segments.push({ x: width / 2, y: height / 2, angle: 0 });
}

function render() {
  ctx.clearRect(0, 0, width, height);

  // Smooth follow
  segments[0].x += (pointer.x - segments[0].x) * 0.15;
  segments[0].y += (pointer.y - segments[0].y) * 0.15;

  for (let i = 1; i < N; i++) {
    const prev = segments[i - 1];
    const curr = segments[i];
    const dx = prev.x - curr.x;
    const dy = prev.y - curr.y;
    curr.angle = Math.atan2(dy, dx);

    const dist = Math.hypot(dx, dy);
    const targetDist = 11;
    if (dist > targetDist) {
      curr.x = prev.x - Math.cos(curr.angle) * targetDist;
      curr.y = prev.y - Math.sin(curr.angle) * targetDist;
    }
  }

  // Draw Head to Tail
  for (let i = N - 1; i >= 0; i--) {
    const seg = segments[i];
    ctx.save();
    ctx.translate(seg.x, seg.y);
    ctx.rotate(seg.angle);

    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#000000';

    if (i === 0) {
      // Head (Cabeza)
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(-10, -8);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-10, 8);
      ctx.closePath();
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(2, -4, 2, 0, Math.PI * 2);
      ctx.arc(2, 4, 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (i >= 7 && i <= 15) {
      // Wings (Aletas)
      const wScale = (1 - Math.abs(i - 11) * 0.12);
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-20 * wScale, -50 * wScale, -80 * wScale, -40 * wScale);
      ctx.quadraticCurveTo(-40 * wScale, -15 * wScale, 0, 0);
      
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-20 * wScale, 50 * wScale, -80 * wScale, 40 * wScale);
      ctx.quadraticCurveTo(-40 * wScale, 15 * wScale, 0, 0);
      ctx.stroke();

      // Wing Rib Lines
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.moveTo(0, 0);
      ctx.lineTo(-65 * wScale, -25 * wScale);
      ctx.moveTo(0, 0);
      ctx.lineTo(-65 * wScale, 25 * wScale);
      ctx.stroke();
    } else {
      // Spine Bones (Espina)
      const scale = Math.max(0.2, 1 - (i / N) * 0.8);
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-15 * scale, -25 * scale, -45 * scale, -20 * scale);
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-15 * scale, 25 * scale, -45 * scale, 20 * scale);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 2.5 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  requestAnimationFrame(render);
}

render();
