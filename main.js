class Particle {
  constructor(x, y, vx, vy) {
    this.x = x;  // x-coordinate
    this.y = y;  // y-coordinate
    this.dv = vx;  // velocity in x-direction
    this.dx = vy;  // velocity in y-direction
    this.prevx = x;
    this.prevy = y;
  }

  move() {
    this.prevx = this.x;
    this.prevy = this.y;
    this.x += this.dx;
    this.y += this.dy;
  }
}

function drawMotion(x1, y1, x2, y2, ctx) {
  // TODO colour by velocity
  ctx.beginPath();       // Start a new path for drawing
  ctx.moveTo(x1, y1);    // Move the pen to the starting point
  ctx.lineTo(x2, y2);    // Draw a straight line to the ending point
  ctx.strokeStyle = 'blue'; // Define the color of the line
  ctx.lineWidth = 1;     // Define the thickness of the line
  ctx.stroke();          // Execute the drawing of the line
}

document.addEventListener("DOMContentLoaded", () => {
  const Y = 500;
  const X = 800;

  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  // Setting the canvas size
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

  // Particle sim set up --------------------
  // Particle array
  const N_PARTICLES = 30;
  let particles = [];
  for (let i = 0; i < N_PARTICLES; i++) {
    particles.push(new Particle(50, 50, 0, 0));
  }
  console.log({ particles });
  // Make velocity vector field (2D array of (x, y) vectors)
  let field = Array.from({ length: Y }, () => Array.from({ length: X }, () => [1, 1]));
  console.log({ field });

  // Main fluid sim loop ---------------------
  while (true) {
    for (const p of particles) {
      // Particle velocities update vector field
      let field_at_p = field[p.x][p.y];
      console.log({field_at_p});
      field_at_p[0] += p.dx;
      field_at_p[1] += p.dy;
    }
    for (let x = 0; x < X; x++) {
      for (let y = 0; y < Y; y++) {
        // TODO this smells bad
        for (const p of particles) {
          if (p.x == x && p.y == y) {
            // Vector field updates particles
            p.dx += field[x][y][0];
            p.dy += field[x][y][1];
          }
        }
      }
    }
    // TODO Propagate velocity through velocity field (each grid square take saverage vectors of its neighbours)


    // Visualisation --------------------------
    for (const p of particles) {
      p.move();
      drawMotion(p.prevx, p.prevy, p.x, p.y, ctx);
    }

  }


});
