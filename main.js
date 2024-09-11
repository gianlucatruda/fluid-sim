document.addEventListener("DOMContentLoaded", () => {
  const M = 500;
  const N = 500;

  const canvas = document.getElementById("myCanvas");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");

    // Setting the canvas size
    canvas.width = M;
    canvas.height = N;

    // Simple drawing: a rectangle
    // ctx.fillStyle = "blue"; // Fill color
    // ctx.fillRect(50, 50, 200, 100); // A rectangle at (50, 50) with width 200, height 100

    // Drawing a line
    // ctx.beginPath(); // Start a new path
    // ctx.moveTo(300, 300); // Move the pen to (300, 300)
    // ctx.lineTo(500, 300); // Draw a line to (500, 300)
    // ctx.strokeStyle = "red"; // Line color
    // ctx.lineWidth = 5; // Line width
    // ctx.stroke(); // Render the path

    // Draw some markers 
    for (let x = 0; x < M; x += 30) {
      for (let y = 0; y < N; y += 30) {
        ctx.beginPath();
        ctx.arc(x, y, 0.75, 0, Math.PI * 2, true);
        ctx.fill();

      }

    }

    // Add more drawing commands as needed
  } else {
    console.log("Canvas is not supported in your browser.");
  }
});
