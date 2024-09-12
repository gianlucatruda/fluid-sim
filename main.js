// Application
const Y = 500;
const X = 800;

// Environment
const N_PARTICLES = 5000;
const PF_MULT = 0.05;
const FP_MULT = 0.5;
const DIFF_MULT = 0.997;
const LAG = 0.5;
const DAMP = 0.99;
const WIND_X = 0.1;
const WIND_Y = -0.05;

// Sail
const SAIL_P1_X = 1.0;
const SAIL_P1_Y = 1.0;

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
    this.TURB = 0.1;
    this.FRIC = 0.95;
    this.DRAG = 0.1;
    this.MAX_V = 5;
  }

  move() {
    this.prevX = this.x;
    this.prevY = this.y;
    let signX = this.dx >= 0 ? 1.0 : -1.0;
    let signY = this.dy >= 0 ? 1.0 : -1.0;
    this.dx += (Math.random() - 0.5) * 2 * this.TURB;
    this.dy += (Math.random() - 0.5) * 2 * this.TURB;
    this.dx = symClip(this.dx * this.FRIC - signX * this.DRAG * this.dx ** 2, this.MAX_V);
    this.dy = symClip(this.dy * this.FRIC - signY * this.DRAG * this.dy ** 2, this.MAX_V);
    this.x = (this.x + this.dx + X) % X;
    this.y = (this.y + this.dy + Y) % Y;
  }

  discrete() {
    let pX = (Math.round(this.x) + X) % X;
    let pY = (Math.round(this.y) + Y) % Y;
    return [pX, pY];
  }
}

class Wing extends Particle {
  constructor(x, y, l) {
    super(x, y, 0, 0); // This must come first before using 'this'
    this.length = l;

    // Override params
    this.TURB = 0.01;
    this.FRIC = 0.999;
    this.DRAG = 0.02;
    this.MAX_V = 10;
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

function drawSail(sail, ctx) {
  // Defining the rectangle dimensions based on the sail's properties
  // const halfLength = sail.length / 2; // half the length to center the rectangle
  // const x = sail.x - halfLength; // Top-left corner x coordinate
  // const y = sail.y - halfLength; // Top-left corner y coordinate
  // const height = sail.length; // Height of the rectangle
  //
  // // Sail
  // ctx.beginPath();
  // ctx.rect(x, y, 5, height);
  // ctx.fillStyle = 'white'; // Set the fill color to white (or any other color)
  // ctx.fill();
  // ctx.strokeStyle = 'green'; // Edge color
  // ctx.stroke();

  // Centre of sail physics
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(sail.x, sail.y, 4, 0, Math.PI * 2, true);
  ctx.fill();
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = X;
  canvas.height = Y;

  let particles = [];
  for (let i = 0; i < N_PARTICLES; i++) {
    particles.push(
      new Particle(
        Math.random() * X,
        Math.random() * Y,
        // 0, 0,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
      ),
    );
  }

  // Make velocity vector field (2D array of (x, y) vectors)
  let field = Array.from({ length: X }, () =>
    Array.from({ length: Y }, () => [
      (Math.random() - 0.5) * 1.0 + WIND_X, // x component
      (Math.random() - 0.5) * 1.0 + WIND_Y, // y component
      0, // Next x component
      0, // Next y component
    ]),
  );

  console.log({ field });

  let sail = new Wing(200, 400, 30);


  let fcount = 0;
  function simulate() {
    let tStart = performance.now();
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
          nsumX += field[nX][nY][0] * DIFF_MULT;
          nsumY += field[nX][nY][1] * DIFF_MULT;
        }
        // Update the future field values based on neighbours
        field[x][y][2] = nsumX / neighs.length;
        field[x][y][3] = nsumY / neighs.length;
      }
    }

    for (let x = 0; x < X; x++) {
      for (let y = 0; y < Y; y++) {
        field[x][y][0] =
          (field[x][y][0] * LAG + field[x][y][2] * (1 - LAG)) * DAMP;
        field[x][y][1] =
          (field[x][y][1] * LAG + field[x][y][3] * (1 - LAG)) * DAMP;
      }
    }

    // Clear the canvas for a re-render
    ctx.clearRect(0, 0, X, Y);

    // Draw the sail
    console.log(sail);
    const [sX, sY] = sail.discrete();
    sail.dx += field[sX][sY][0] * SAIL_P1_X;
    sail.dy += field[sX][sY][1] * SAIL_P1_Y;
    sail.move();
    drawSail(sail, ctx);

    // Move and draw each particle
    particles.forEach((p) => {
      p.move();
      drawMotion(p.prevX, p.prevY, p.x, p.y, ctx);
    });

    // Draw some markers
    for (let x = 0; x < X; x += 30) {
      for (let y = 0; y < Y; y += 30) {
        ctx.fillStyle = "gray";
        ctx.beginPath();
        ctx.arc(x, y, 0.75, 0, Math.PI * 2, true);
        ctx.fill();
      }
    }

    for (let x = 0; x < X; x += 30) {
      for (let y = 0; y < Y; y += 30) {
        field[x][y];
        // const color = `hsl(${Math.min(360 - Math.floor(speed) * 50, 360)}, 100%, 50%)`;
        const color = "blue";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
          Math.round(x + field[x][y][0] * 1000),
          Math.round(y + field[x][y][1] * 1000),
        );
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    let tDelta = performance.now() - tStart;
    let fps = 1 / (tDelta / 1000);
    fcount++;
    if (fcount % 30 == 0) {
      console.log(
        `Rendered in ${tDelta.toFixed(1)}ms (${fps.toFixed(0)}fps) | ${fcount}`,
      );
      console.log(particles[0]);
    }

    requestAnimationFrame(simulate);
  }

  simulate();
});
