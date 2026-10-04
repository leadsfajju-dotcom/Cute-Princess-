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
  y: height / 2,
  tx: width / 2,
  ty: height / 2
};

window.addEventListener('pointermove', (e) => {
  pointer.tx = e.clientX;
  pointer.ty = e.clientY;
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

  // Smooth pointer tracking
  pointer.x += (pointer.tx - pointer.x) * 0.1;
  pointer.y += (pointer.ty - pointer.y) * 0.1;

  // Head segment updates
  segments[0].x = pointer.x;
  segments[0].y = pointer.y;

  // Follower logic for body segments
  for (let i = 1; i < N; i++) {
    const prev = segments[i - 1];
    const curr = segments[i];

    const dx = prev.x - curr.x;
    const dy = prev.y - curr.y;
    curr.angle = Math.atan2(dy, dx);

    const dist = Math.hypot(dx, dy);
    const targetDist = 12;

    if (dist > targetDist) {
      curr.x = prev.x - Math.cos(curr.angle) * targetDist;
      curr.y = prev.y - Math.sin(curr.angle) * targetDist;
    }
  }

  // Draw Wings and Ribs
  for (let i = N - 1; i >= 0; i--) {
    const seg = segments[i];
    const angle = seg.angle;

    ctx.save();
    ctx.translate(seg.x, seg.y);
    ctx.rotate(angle);

    // Spine structure
    ctx.fillStyle = '#1a1a1a';
    ctx.strokeStyle = '#1a1a1a';

    if (i === 0) {
      // Dragon Head
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(-10, -8);
      ctx.lineTo(-5, 0);
      ctx.lineTo(-10, 8);
      ctx.closePath();
      ctx.fill();
    } else {
      // Body Spines & Wings
      const size = (1 - i / N) * 35;
      
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      
      // Left Rib/Wing
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-size * 0.5, -size * 1.5, -size, -size * 2);

      // Right Rib/Wing
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-size * 0.5, size * 1.5, -size, size * 2);

      ctx.stroke();

      // Vertebra Center Dot
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1, (1 - i / N) * 4), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  requestAnimationFrame(render);
}

render();
