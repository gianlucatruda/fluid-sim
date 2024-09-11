const Y = 500;
const X = 800;
const N_PARTICLES = 5000;
const PF_MULT = 0.1;
const FP_MULT = 0.4;
const FRIC_MULT = 0.95;
const DRAG = 0.3;
const MAX_V = 20;

function symClip(x, v) {
  if (x < 0) {
    return Math.max(x, -v);
  }
  return Math.min(x, v);
}

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
    let signX = this.dx >= 0 ? 1.0 : -1.0;
    let signY = this.dy >= 0 ? 1.0 : -1.0;
    this.dx = symClip(this.dx * FRIC_MULT - signX * DRAG * this.dx ** 2, MAX_V);
    this.dy = symClip(this.dy * FRIC_MULT - signY * DRAG * this.dy ** 2, MAX_V);
  }

  discrete() {
    let pX = Math.floor((this.x + X) % X);
    let pY = Math.floor((this.y + Y) % Y);
    return [pX, pY];
  }
}

function drawMotion(x1, y1, x2, y2, ctx) {
  const speed = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (speed > 500) {
    return;
  }
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
    particles.push(
      new Particle(
        Math.random() * X,
        Math.random() * Y,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      ),
    );
  }

  // Make velocity vector field (2D array of (x, y) vectors)
  let field = Array.from({ length: X }, () =>
    Array.from({ length: Y }, () => [
      (Math.random() - 0.5) * 1.0,
      (Math.random() - 0.5) * 1.0,
    ]),
  );

  console.log({ field });

  function simulate() {
    for (const p of particles) {
      // Particle velocities update vector field
      const [pX, pY] = p.discrete();
      let field_at_p = field[pX][pY];
      field_at_p[0] += p.dx * PF_MULT;
      field_at_p[1] += p.dy * PF_MULT;
      // Vector field updates particles
      p.dx += field_at_p[0] * FP_MULT;
      p.dy += field_at_p[1] * FP_MULT;
    }
    for (let x = 0; x < X; x++) {
      for (let y = 0; y < Y; y++) {
        let neighs = [
          [x - 1, y - 1],
          [x - 1, y],
          [x + 1, y + 1],
          [x, y - 1],
          [x, y + 1],
          [x + 1, y - 1],
          [x + 1, y + 1],
        ];
        let nsumX = 0;
        let nsumY = 0;
        for (const n of neighs) {
          let [nX, nY] = n;
          nX = (nX + X) % X;
          nY = (nY + Y) % Y;
          nsumX += field[nX][nY][0];
          nsumY += field[nX][nY][1];
        }
        field[x][y] = [nsumX / neighs.length, nsumY / neighs.length];
      }
    }

    ctx.clearRect(0, 0, X, Y);

    particles.forEach((p) => {
      p.move();
      drawMotion(p.prevX, p.prevY, p.x, p.y, ctx);
    });

    console.log(particles[0]);
    requestAnimationFrame(simulate);
  }

  simulate();
  // for (let i = 0; i < 10; i++) {
  //
  // }
});
