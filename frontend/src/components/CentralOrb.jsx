import React, { useEffect, useRef, useState } from 'react';

export default function CentralOrb() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = (canvas.width = 360);
    const height = (canvas.height = 360);
    const centerX = width / 2;
    const centerY = height / 2;

    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 0.04;

      // Subtle Soft Ambient Radial Glow
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 150);
      bgGrad.addColorStop(0, 'rgba(0, 230, 118, 0.18)');
      bgGrad.addColorStop(0.6, 'rgba(16, 185, 129, 0.05)');
      bgGrad.addColorStop(1, 'rgba(5, 8, 6, 0)');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
      ctx.fill();

      // 1. Expanding Wireframe Acoustic Sound Ripples
      for (let r = 1; r <= 3; r++) {
        const rad = ((step * 25 + r * 45) % 140) + 25;
        const alpha = Math.max(0, 1 - rad / 150);
        ctx.strokeStyle = `rgba(0, 230, 118, ${alpha * 0.35})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(centerX, centerY - 25, rad, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 2. Pure Wireframe Microphone Head (Capsule)
      const capY = centerY - 55;
      const capRadiusX = 32;
      const capRadiusY = 48;

      ctx.strokeStyle = '#00E676';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#00E676';
      ctx.shadowBlur = 10;

      // Outer Wireframe Outline
      ctx.beginPath();
      ctx.ellipse(centerX, capY, capRadiusX, capRadiusY, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Horizontal Wireframe Lattice Rings
      const ringCount = 7;
      for (let i = 1; i < ringCount; i++) {
        const ratio = (i / ringCount) * 2 - 1; // -1 to 1
        const yPos = capY + ratio * (capRadiusY - 4);
        const rx = capRadiusX * Math.sqrt(Math.max(0, 1 - ratio * ratio));

        // Sine wave audio modulation
        const waveShift = Math.sin(step * 2 + i) * 3;

        ctx.strokeStyle = i % 2 === 0 ? '#00E676' : 'rgba(56, 189, 248, 0.75)';
        ctx.lineWidth = i % 2 === 0 ? 1.2 : 0.8;
        ctx.beginPath();
        ctx.ellipse(centerX, yPos, Math.max(2, rx + waveShift), 4 + Math.abs(waveShift * 0.5), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Vertical Sine-Wave Lattice Lines
      const lineCount = 6;
      for (let j = 0; j < lineCount; j++) {
        const angle = (j * Math.PI) / lineCount + step * 0.5;
        const xOffset = Math.sin(angle) * (capRadiusX - 4);

        ctx.strokeStyle = 'rgba(0, 230, 118, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX + xOffset, capY - capRadiusY + 6);
        ctx.quadraticCurveTo(
          centerX + xOffset * 1.3,
          capY,
          centerX + xOffset,
          capY + capRadiusY - 6
        );
        ctx.stroke();
      }

      // 3. Glowing Center Audio Frequency Wave Thread
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      for (let y = capY - capRadiusY + 10; y <= capY + capRadiusY - 10; y += 4) {
        const xWave = Math.sin(y * 0.1 + step * 3) * 12;
        if (y === capY - capRadiusY + 10) ctx.moveTo(centerX + xWave, y);
        else ctx.lineTo(centerX + xWave, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 4. Wireframe U-Shaped Shock Mount
      const mountY = capY + 15;
      ctx.strokeStyle = '#00E676';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00E676';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(centerX, mountY, 48, 0.15 * Math.PI, 0.85 * Math.PI, false);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Shock Mount Connection Pins
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(centerX - 48, mountY + 10, 3, 0, Math.PI * 2);
      ctx.arc(centerX + 48, mountY + 10, 3, 0, Math.PI * 2);
      ctx.fill();

      // 5. Wireframe Handle Body
      const bodyTopY = capY + capRadiusY + 4;
      const bodyHeight = 50;
      ctx.strokeStyle = 'rgba(0, 230, 118, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX - 12, bodyTopY);
      ctx.lineTo(centerX - 8, bodyTopY + bodyHeight);
      ctx.lineTo(centerX + 8, bodyTopY + bodyHeight);
      ctx.lineTo(centerX + 12, bodyTopY);
      ctx.closePath();
      ctx.stroke();

      // Body Horizontal Rib Lines
      for (let b = 1; b <= 3; b++) {
        const ry = bodyTopY + b * 12;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 10, ry);
        ctx.lineTo(centerX + 10, ry);
        ctx.stroke();
      }

      // 6. Wireframe Desktop Stand Shaft & Base Ring
      const shaftTopY = bodyTopY + bodyHeight;
      const shaftHeight = 45;
      ctx.strokeStyle = '#00E676';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, shaftTopY);
      ctx.lineTo(centerX, shaftTopY + shaftHeight);
      ctx.stroke();

      // Base Circular Wire Ring
      const baseY = shaftTopY + shaftHeight;
      ctx.strokeStyle = '#00E676';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00E676';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(centerX, baseY, 52, 16, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Base Inner Glow Accent Ring
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(centerX, baseY, 34, 10, 0, 0, Math.PI * 2);
      ctx.stroke();

      // 7. Floating Glowing Orbiting Particle Nodes
      for (let p = 0; p < 4; p++) {
        const pAngle = step * 1.2 + p * (Math.PI / 2);
        const px = centerX + Math.cos(pAngle) * 58;
        const py = capY + Math.sin(pAngle) * 28;

        ctx.fillStyle = p % 2 === 0 ? '#00E676' : '#38BDF8';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / rect.height) * 14,
      y: (x / rect.width) * 14,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: 'transform 0.15s ease-out',
      }}
      className="relative z-10 flex items-center justify-center select-none cursor-pointer group p-2"
    >
      <canvas ref={canvasRef} className="w-[360px] h-[360px] pointer-events-none drop-shadow-[0_0_20px_rgba(0,230,118,0.3)]" />
    </div>
  );
}
