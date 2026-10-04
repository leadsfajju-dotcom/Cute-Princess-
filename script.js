const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width, height;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

const pointer = {
  x: width / 2,
  y: height / 2
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

const N = 40;
const segments = [];

for (let i = 0; i < N; i++) {
  segments.push({
    x: width / 2,
    y: height / 2,
    angle: 0
  });
}

function render() {
  ctx.clearRect(0, 0, width, height);

  // Smooth follow mouse/finger movement
  segments[0].x += (pointer.x - segments[0].x) * 0.2;
  segments[0].y += (pointer.y - segments[0].y) * 0.2;

  for (let i = 1; i < N; i++) {
    const prev = segments[i - 1];
    const curr = segments[i];

    const dx = prev.x - curr.x;
    const dy = prev.y - curr.y;
    curr.angle = Math.atan2(dy, dx);

    const dist = Math.hypot(dx, dy);
    const targetDist = 10;

    if (dist > targetDist) {
      curr.x = prev.x - Math.cos(curr.angle) * targetDist;
      curr.y = prev.y - Math.sin(curr.angle) * targetDist;
    }
  }

  // Draw dragon parts from tail to head
  for (let i = N - 1; i >= 0; i--) {
    const seg = segments[i];

    ctx.save();
    ctx.translate(seg.x, seg.y);
    ctx.rotate(seg.angle);

    ctx.fillStyle = '#111111';
    ctx.strokeStyle = '#111111';

    if (i === 0) {
      // 1. Dragon Head (Cabeza)
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(-12, -8);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-12, 8);
      ctx.closePath();
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(2, -3, 1.8, 0, Math.PI * 2);
      ctx.arc(2, 3, 1.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (i >= 8 && i <= 14) {
      // 2. Wings (Aletas)
      const wingFactor = 1 - Math.abs(i - 11) * 0.15;
      const wingLength = 70 * wingFactor;

      ctx.lineWidth = 1.5;

      // Top wing curved feather ribs
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-15, -wingLength * 0.8, -wingLength, -wingLength * 0.5);
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-10, -wingLength * 0.6, -wingLength * 0.8, -wingLength * 0.35);
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-5, -wingLength * 0.4, -wingLength * 0.6, -wingLength * 0.2);

      // Bottom wing curved feather ribs
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-15, wingLength * 0.8, -wingLength, wingLength * 0.5);
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-10, wingLength * 0.6, -wingLength * 0.8, wingLength * 0.35);
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-5, wingLength * 0.4, -wingLength * 0.6, wingLength * 0.2);

      ctx.stroke();

      // Spine dot
      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // 3. Rib Bones / Tail (Espina)
      const tailScale = Math.max(0.15, 1 - (i / N) * 0.85);
      const ribSize = 35 * tailScale;

      ctx.lineWidth = 1.2;

      ctx.beginPath();
      // Curved rib left
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-ribSize * 0.3, -ribSize * 0.8, -ribSize, -ribSize * 0.6);
      // Curved rib right
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-ribSize * 0.3, ribSize * 0.8, -ribSize, ribSize * 0.6);
      ctx.stroke();

      // Vertebra dot
      ctx.beginPath();
      ctx.arc(0, 0, 2 * tailScale, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  requestAnimationFrame(render);
}

render();
