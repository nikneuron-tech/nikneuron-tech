import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  color: string;
}

export const Stars: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let stars: Star[] = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const count = window.innerWidth < 768 ? 70 : 160;
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.3 + 0.3,
          baseAlpha: Math.random() * 0.7 + 0.2,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.03 + 0.015,
          color: Math.random() > 0.4 ? '#ffffff' : Math.random() > 0.5 ? '#4fd8ff' : '#ff5aa5',
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        if (!prefersReduced) {
          s.phase += s.speed;
        }
        const alpha = prefersReduced ? s.baseAlpha : s.baseAlpha + Math.sin(s.phase) * 0.3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [prefersReduced]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};
