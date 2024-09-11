const Y = 500;
const X = 800;
const N_PARTICLES = 1000;

class Particle {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.prevX = x;
    this.prevY = y;
  }

  move() {
    this.prevX = this.x;
    this.prevY = this.y;
    this.x = (this.x + this.dx + X) % X;
    this.y = (this.y + this.dy + Y) % Y;
  }
}

function drawMotion(x1, y1, x2, y2, ctx) {
  const speed = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (speed > 500) { return }
  const color = `hsl(${Math.min(360 - Math.floor(speed) * 50, 360)}, 100%, 50%)`;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = X;
  canvas.height = Y;

  // Draw some markers 
  for (let x = 0; x < X; x += 30) {
    for (let y = 0; y < Y; y += 30) {
      ctx.beginPath();
      ctx.arc(x, y, 0.75, 0, Math.PI * 2, true);
      ctx.fill();

    }
  }

  let particles = [];
  for (let i = 0; i < N_PARTICLES; i++) {
    particles.push(new Particle(
      Math.random() * X - 1,
      Math.random() * Y - 1,
      Math.random() * 3 - 1,
      Math.random() * 2 - 1,
    ))
  }

  // Make velocity vector field (2D array of (x, y) vectors)
  let field = Array.from({ length: Y }, () => Array.from({ length: X }, () => [1, 1]));
  console.log({ field });

  function simulate() {

    // for (const p of particles) {
    //   // Particle velocities update vector field
    //   let field_at_p = field[p.x][p.y];
    //   // console.log({ field_at_p });
    //   field_at_p[0] += p.dx;
    //   field_at_p[1] += p.dy;
    // }
    // for (let x = 0; x < X; x++) {
    //   for (let y = 0; y < Y; y++) {
    //     // TODO this smells bad
    //     for (const p of particles) {
    //       if (p.x == x && p.y == y) {
    //         // Vector field updates particles
    //         p.dx += field[x][y][0];
    //         p.dy += field[x][y][1];
    //       }
    //     }
    //   }
    // }

    ctx.clearRect(0, 0, X, Y);

    particles.forEach(p => {
      p.move();
      drawMotion(p.prevX, p.prevY, p.x, p.y, ctx);
    });
    requestAnimationFrame(simulate);
  }

  simulate();
});

