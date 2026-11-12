import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Streak {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  life: number;
}

export const ShootingStar: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let streak: Streak | null = null;
    let nextSpawn = performance.now() + 15000;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const spawn = () => {
      const startX = Math.random() * canvas.width * 0.75 + canvas.width * 0.1;
      const startY = Math.random() * canvas.height * 0.3;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
      streak = {
        x: startX,
        y: startY,
        vx: Math.cos(angle) * 14,
        vy: Math.sin(angle) * 14,
        length: Math.random() * 140 + 90,
        life: 1.0,
      };
      nextSpawn = performance.now() + 15000 + Math.random() * 10000;
    };

    const render = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (now > nextSpawn && !streak) {
        spawn();
      }

      if (streak) {
        streak.x += streak.vx;
        streak.y += streak.vy;
        streak.life -= 0.025;

        const tailX = streak.x - (streak.vx / 14) * streak.length;
        const tailY = streak.y - (streak.vy / 14) * streak.length;

        const grad = ctx.createLinearGradient(streak.x, streak.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${streak.life})`);
        grad.addColorStop(0.3, `rgba(79, 216, 255, ${streak.life * 0.8})`);
        grad.addColorStop(1, 'rgba(79, 216, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(streak.x, streak.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (streak.life <= 0) {
          streak = null;
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />;
};
