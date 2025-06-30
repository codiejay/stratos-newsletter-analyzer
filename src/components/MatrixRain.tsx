"use client";

import { useEffect, useRef } from "react";

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to container size
    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };
    resizeCanvas();

    // Create a ResizeObserver to watch container size changes
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    // Matrix rain configuration
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    // Characters to use (you can customize this)
    const matrix = "email-analyzer";

    // Animation function
    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.fillStyle = "#0F0"; // Matrix green
      ctx.font = `${fontSize}px monospace`;

      // Draw the characters
      for (let i = 0; i < drops.length; i++) {
        // Random character from matrix
        const char = matrix[Math.floor(Math.random() * matrix.length)];

        // Calculate position
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Draw the character
        ctx.fillText(char, x, y);

        // Reset drop to top of screen or move it down
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // Call next frame
      requestAnimationFrame(draw);
    };

    // Start animation
    draw();

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-[1%] w-full h-full"
      />
    </div>
  );
};

export default MatrixRain;
